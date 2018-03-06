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
        .then( build )
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
    let meta = require( getMetaPath() )();
    return {
        files: files,
        meta : meta
    };
}

function getMetaPath() {
    return require( 'path' ).join( templatePath, 'meta.js' );
}

function build( options ) {
    console.log( options );
}
