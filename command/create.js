/**
 * /page 目录下创建几个空文件
 */

/* global __dirname */
let chalk   = require( 'chalk' );
let logger  = require( '../lib/logger' );
let process = require( 'process' );
let fs      = require( 'fs-extra' );
let path    = require( 'path' );

/**
 * 获取z3里模板文件的路径绝对路径
 *
 * @param {String} p
 */
function getAbsPath( p ) {
    return path.resolve( __dirname, p );
}

/**
 * 生成工作目录的文件路径
 *
 * @param {String} dirName 创建的新页面名称
 * @param {String} ext      文件后缀名
 * @param {String} [fileName]  指定文件名，可选，默认为新页面名称
 * @returns {string}
 */
function getCurrentWorkingPath( dirName, ext, fileName ) {
    return [
        process.cwd(),
        '/page/',
        dirName,
        '/',
        (fileName || dirName),
        '.',
        ext
    ].join( '' );
}


/* global module */
module.exports = function ( pageName ) {

    const MAP = [
        {
            ext: 'es6'
        },
        {
            ext: 'less'
        },
        {
            ext: 'jade'
        },
        {
            ext     : 'md',
            fileName: 'README'
        }
    ];

    function replace( data ) {
        return data.replace( /\{template}/g, pageName );
    }

    /**
     * 向目标文件夹灌输模板数据，并替换占位表达式
     *
     * @param {String} ext
     * @param {String} fileName
     */
    function overwrites( ext, fileName ) {
        return fs.readFile(
            getAbsPath( '../tmp/' + (fileName || 'tmp') + '.' + ext ), 'utf8'
        ).then( data => fs.outputFile(
            getCurrentWorkingPath( pageName, ext, fileName ),
            replace( data )
        ) );
    }

    /**
     * 生成一个执行队列
     *
     * @param {Array<promise>} queue
     * @returns {Promise.<TResult>}
     */
    function execQueue( ...queue ) {
        return Promise.all( queue )
            .then( () => console.log(
                chalk.green( '  Page {' + pageName + '} created in ' + process.cwd() + '/page/' )
            ) )
            .catch( err => logger.fatal( err ) );
    }

    let $promises = MAP.map( item => overwrites( item.ext, item.fileName ) );

    // 再搞一些别的事情，比如自动配置路由；
    $promises.push(
        fs.readFile(
            getAbsPath( '../tmp/append.js' ), 'utf8'
        ).then( data => fs.appendFile(
            [process.cwd(), '/static/', 'routes-config.es6'].join( '' ),
            replace( data ),
            'utf8'
        ) )
    );

    execQueue.apply( null, $promises );
};