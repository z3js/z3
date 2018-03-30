module.exports = function ( componentName ) {
    let getRc    = require( '../lib/config' ).get;
    let download = require( '../lib/download' );
    let pkg      = require( '../package.json' );
    let logger   = require( '../lib/logger' );
    let req      = require( 'request-promise' );
    let process  = require( 'process' );
    const chalk  = require( 'chalk' );
    const sep    = chalk.gray( '·' );

    let {getLocalDirName, getScaffold} = require( '../lib/util' );

    download( pkg.z3conf.template )
        .then( getAPI )
        .then( queue )
        .catch( logger.fatal );


    function getAPI( res ) {
        let {data}       = res.pkg;
        let commitPrefix = data.api.commit;
        return `${commitPrefix}?private_token=${getRc().token}`;
    }

    let $s = getScaffold();

    function getFiles() {
        return $s.util.find( process.cwd() );
    }

    function queue( api ) {

        function buildOptions( msg, action ) {
            return {
                method: 'POST',
                uri   : api,
                body  : {
                    branch        : 'master',
                    commit_message: msg,
                    actions       : [action]
                },
                json  : true
            }
        }

        let files   = getFiles();
        let spinner = require( 'ora' )( `publishing......` );
        let max     = files.length;
        let current = 0;

        function build( file, type ) {
            let fileName     = file.replace( process.cwd(), '' );
            let localDirName = getLocalDirName();
            let Path         = require( 'path' );

            let name = (componentName || localDirName);

            let filePath = ['', 'components', name,
                            fileName]
                .map( i => i.replace( Path.sep, '' ) )
                .join( Path.sep );

            // 尝试创建
            req( buildOptions(
                `${type} ${fileName}`,
                {
                    content  : $s.util.read( file ),
                    action   : type,
                    file_path: filePath
                }
            ) ).then( data => {
                    logger.warn( ` ${data.author_name}<${data.author_email}> ${type} ${fileName} success` );
                    spinner.stop();
                    current++;
                    if ( current === max ) {
                        logger.success( ` 
                        Publish "${name}" success, to get started:
                        
                            z3 install ${name}` )
                    }
                }
                // 失败则尝试更新
            ).catch( err => build( file, 'update' ) );
        }

        if ( max > 10 ) {
            return logger.fatal( 'Max 10 files can be uploaded' );
        }

        spinner.start();

        files.forEach( file => {
            build( file, 'create' );
        } );
    }
};
