/**
 * @file 根据模板 meta.js 中提供的文件列表，创建文件
 */

let logger = require( '../lib/logger' );
let templatePath;

module.exports = function ( pageName, templateName ) {

    let pkg      = require( '../package.json' );
    let download = require( '../lib/download' );
    let {
            findTemplate,
            checkTemplate
        }        = require( '../lib/util' );

    download( pkg.z3conf.template )
        .then( res => findTemplate( templateName, res.path ) )
        .then( setGlobalTemplatePath )
        .then( path => checkTemplate( templateName, path ) )
        .then( runMeta )
        .then( res => build( res, pageName ) )
        .catch( logger.fatal );
};

/**
 * 缓存一下已找到的模板路径
 */
function setGlobalTemplatePath( path ) {
    templatePath = path;
    return templatePath;
}

/**
 * 运行模板的meta.js
 */
function runMeta( files ) {
    let meta = require( getMetaPath() )( {
        tempPath: templatePath
    } );
    return {
        files: files,
        meta : meta
    };
}

function getMetaPath() {
    return require( 'path' ).join( templatePath, 'meta.js' );
}

function build( options, pageName ) {
    let {meta} = options;

    let fs   = require( 'fs-extra' );
    let etpl = require( 'etpl' );
    let path = require( 'path' );
    let data = {
        pageName: pageName
    };

    function getPath( ...p ) {
        p.unshift( require( 'process' ).cwd() );
        return path.join.apply( path, p );
    }

    meta.create.forEach( $file => {

        let fileSettingString = JSON.stringify( $file );
        let render            = etpl.compile( fileSettingString );

        $file = JSON.parse( render( data ) );

        if ( $file.append ) {
            fs.appendFile(
                getPath( $file.append ),
                $file.content, 'utf8'
            );

            logger.warn( '  Append to ' + $file.append );
            return;
        }

        let fileName = `${$file.name}.${$file.ext}`;

        fs.outputFile(
            getPath( $file.dist, `/${fileName}` ),
            $file.content );
        logger.warn( `  Create ${fileName} to ${$file.dist}` );
    } );
}
