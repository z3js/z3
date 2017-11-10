/**
 * @file 修改一些文件中的 {namespace} 占位符为 用户设置的namespace
 */

/* global __dirname */
const PATH  = require( 'path' );
const FS    = require( 'fs' );
const chalk = require( 'chalk' );

const OPTIONS = {
    encoding: 'utf8'
};

// 修改的文件列表
const FILES = [
    'package.json',
    'offline.config.json',
    'build.sh',
    'BCLOUD'
];

module.exports = function ( ns, path ) {
    FILES.forEach( ( path, index ) => {
        path = resolvePath( path );
        new Promise(
            ( resolve, rej ) => FS.readFile(
                path,
                OPTIONS,
                ( err, data ) => err
                    ? rej( err )
                    : resolve( data.replace( /\{namespace}/g, ns ) )
            )
        ).then(
            data => FS.writeFile(
                path,
                data,
                OPTIONS,
                err => err
                    ? onError( err )
                    : console.log( chalk.cyan( '  Rewriting  ' ) + FILES[index] )
            )
        ).catch(
            err => onError( err )
        );

        function onError( err ) {
            console.log( chalk.red( '  Rewrite Fail  ' ) + FILES[index], err );
        }
    } );

    function resolvePath( file ) {
        return PATH.resolve( path + '/' + file );
    }
};

