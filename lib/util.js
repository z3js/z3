/**
 * @file utils
 */

/* global module */
module.exports = {
    getLocalDirName  : getLocalDirName,
    findComponent    : findComponent,
    findTemplate     : findTemplate,
    each             : each,
    getAskDescription: getAskDescription,
    getScaffold      : getScaffold,
    readFile         : readFile,
    checkTemplate    : checkTemplate
};

/**
 * 获取当前的工作目录的名称
 */
function getLocalDirName() {
    let process = require( 'process' );
    let path    = require( 'path' );

    let cwd  = process.cwd();
    let dirs = cwd.split( path.sep );
    return dirs[dirs.length - 1];
}

/**
 * ref: http://devdocs.io/javascript/global_objects/array/foreach
 *
 * The each() method executes a provided function once per array or object literal element.
 *
 * 原生 forEach 在 return false 后会自动 break,这里对象字面量的循环延续该特性.
 *
 * @param {Object | Array}elements
 * @param callBack
 */
function each( elements, callBack ) {
    if ( !elements ) {
        return;
    }

    if ( elements.forEach ) {
        return elements.forEach( callBack );
    }

    for ( var key in elements ) {
        if ( elements.hasOwnProperty( key ) && callBack( elements[key], key, elements ) === false ) {
            break;
        }
    }
};

const chalk = require( 'chalk' );

/**
 * 获取一个好看的问题描述信息
 */
function getAskDescription( name, sampleText ) {
    return chalk.green( '?' )
        + ' '
        + name
        + ' '
        + (sampleText
            ? (
                chalk.gray( '(' )
                + chalk.gray( sampleText )
                + chalk.gray( ')' ))
            : '');
}


/**
 * 匹配对应模板/组件目录
 */
function findTemplate( name, path ) {
    return require( 'path' ).join( path, 'templates', name );
}

/**
 * 匹配对应模板/组件目录
 */
function findComponent( name, path ) {
    return require( 'path' ).join( path, 'components', name );
}

/**
 * 获取一个 Scaffold 实例
 *
 * @return {Scaffold}
 */
function getScaffold() {
    return new (require( 'fis-scaffold-kernel' ))( {
        type: 'gitlab',
        log : {
            level: 0
        }
    } );
}


function readFile( path ) {
    return require( 'fs' ).readFileSync( path, {encoding: 'utf8', flag: 'r'} ).toString();
}


/**
 * 检查合法性
 */
function checkTemplate( name, path ) {

    let $scaffold = getScaffold();

    let files = $scaffold.util.find( path );
    if ( files.length === 0 ) {
        throw new Error( `Failed to download repo or component [  ${name}  ]` );
    }

    return files;
}
