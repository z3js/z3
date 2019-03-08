/**
 * @file
 */

let logger = require( '../lib/logger' );
let getRc  = require( '../lib/config' ).get;
let {
        checkTemplate,
        getScaffold,
        readFile
    }      = require( '../lib/util' );

let templatePath;

let textFileWhiteList = [
    'package.json',
    'BCLOUD',
    'README.md',
];
let textFileExtWhiteList = [
    '.js',
    '.ts',
    '.es',
    '.es6',

    '.json',
    '.conf',

    '.jade',
    '.tpl',
    '.html',
    '.htm',

    '.css',
    '.less',

    '.md',
    '.sh',
];

module.exports = function ( templateName ) {

    let pkg            = require( '../package.json' );
    let download       = require( '../lib/download' );
    let {findTemplate} = require( '../lib/util' );

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

function build( options ) {

    let co      = require( 'co' );
    let prompt  = require( 'co-prompt' );
    let process = require( 'process' );

    let getAskDescription = require( '../lib/util' ).getAskDescription;

    let {files, meta} = options;

    co( function* () {
        let data = Object.assign( meta.data, getRc() );
        let prompts = meta.prompts;

        for ( let key in prompts ) {
            let temp  = prompts[key];
            data[key] = yield prompt( getAskDescription( temp.message, temp.default ) );

            if ( data[key] === '' ) {
                data[key] = temp.default;
            }
        }

        process.stdin.pause();

        // 文件移转
        getScaffold().util.move( templatePath, process.cwd() );

        replacing( files, meta );
    } );
}

function replacing( files, meta ) {
    let PATH = require( 'path' );
    let etpl = require( 'etpl' );
    let fs   = require( 'fs' );
    let cwd  = require( 'process' ).cwd();
    let mime = require('mime/lite');

    // 获取问题结果
    files.forEach(path => {
        let fileName = path.replace( templatePath, '' ).replace( /^\\/g, '' );

        path = PATH.resolve( cwd + '/' + fileName );
        logger.success( `  Install [ ${fileName} ] start` );
        let extname = PATH.extname(fileName);
        let type = mime.getType(extname.slice(1));
        // should add a extname whitelist
        if(!type || !type.match(/^text\//) || !type.match(/javascript|json|typescript/)) {
           logger.success(`not a text file [${extname}:${type}] skip`);
        } else {
            let file   = readFile( path );
            let compileFailed = false;
            try {
                let render = etpl.compile( file );
            } catch (e) {
                compileFailed = true;
            }
            if (!compileFailed) {
                fs.writeFileSync(
                    path,
                    render( meta.data ),
                    {encoding: 'utf8', flag: 'w'} );
            }
        }
        logger.success( `  Install [ ${fileName} ] success` );
    });

    let $scaffold = getScaffold();

    // 删掉忽略列表文件
    meta.ignore.forEach( file => {
        $scaffold.util.del( PATH.resolve( cwd + file ) );
        logger.success( `  Remove ignore file [ ${file} ] success` );
    } );

}
