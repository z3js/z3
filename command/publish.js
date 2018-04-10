module.exports = function ( componentName ) {
    let getRc    = require( '../lib/config' ).get;
    let download = require( '../lib/download' );
    let pkg      = require( '../package.json' );
    let logger   = require( '../lib/logger' );
    let req      = require( 'request-promise' );
    let process  = require( 'process' );
    const chalk  = require( 'chalk' );
    const sep    = chalk.gray( '·' );
    let Path     = require( 'path' );

    let {getLocalDirName, getScaffold} = require( '../lib/util' );

    let $s = getScaffold();

    download( pkg.z3conf.template )
        .then( data => {

            let localDirName = getLocalDirName();

            let name = (componentName || localDirName);

            function buildOptions( msg, action ) {
                return {
                    method: 'POST',
                    uri   : getAPI( data ),
                    body  : {
                        branch        : 'master',
                        commit_message: msg,
                        actions       : action
                    },
                    json  : true
                }
            };

            function buildActions() {
                let currentFiles = getFiles();
                let result       = [];

                currentFiles.forEach( i => {

                    let fileName = i.replace( process.cwd(), '' );

                    let filePath = ['', 'components', name,
                                    fileName]
                        .map( i => i.replace( Path.sep, '' ) )
                        .join( '/' );

                    function getType( path ) {
                        path      = path.split( 'component' )[1];
                        let files = $s.util.find( data.path, new RegExp( path, 'g' ) );
                        return files.length === 0 ? 'create' : 'update';
                    }

                    let action = {
                        content  : $s.util.read( i ),
                        action   : getType( i ),
                        file_path: filePath
                    };

                    result.push( action );

                } );
                return result;
            }

            req( buildOptions(
                `组件 ${name} 发布`, buildActions()
            ) ).then( data => {
                logger.success( `${data.author_name}<${data.author_email}> publish "${name}" success, to get started:

            z3 install ${name}` )
            } )
                .catch( logger.fatal );
        } )
        .catch( logger.fatal );


    function getAPI( res ) {
        let {data}       = res.pkg;
        let commitPrefix = data.api.commit;
        return `${commitPrefix}?private_token=${getRc().token}`;
    }


    function getFiles() {
        return $s.util.find( process.cwd() );
    }
};
