/**
 * @file utils
 */

/* global module */
module.exports = {
    each             : each,
    getLocalDirName  : getLocalDirName,
    getAskDescription: getAskDescription
};

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

const process = require( 'process' );
const path    = require( 'path' );

/**
 * 获取当前的工作目录的名称
 */
function getLocalDirName() {
    let cwd  = process.cwd();
    let dirs = cwd.split( path.sep );
    return dirs[dirs.length - 1];
}

const chalk = require( 'chalk' );

/**
 * 获取一个好看的问题描述信息
 * @param {String} name
 * @param {String} [sampleText]
 * @returns {string}
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