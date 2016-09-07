/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

var process = require( 'process' );

require( 'colors' );

module.exports = function ( name ) {

    var args = makeArray( arguments ).filter( function ( val ) {
        return (typeof val === 'string')
    } );

    function makeArray( arrayLike ) {
        return Array.prototype.slice.call( arrayLike );
    }

    var scaffold = new (require( 'fis-scaffold-kernel' ))( {
        type: 'gitlab',
        log : {
            level: 0
        }
    } );

    var roadmap = [];
    var length  = args.length;

    while ( length-- ) {
        var arg = args[length];
        (typeof arg === 'string')
        && roadmap.push( {
            reg    : '**' + arg + '/**',
            release: '$&'
        } );
    }

    roadmap.push( {
        reg    : '**',
        release: false
    } );


    scaffold.download(
        'z3/z3-warehouse@master',
        function ( err, path ) {

            if ( err ) {
                return console.log(
                    err
                )
            }

            var cwd = process.cwd();

            scaffold.deliver(
                path,
                cwd,
                roadmap
            );

            scaffold.util.move(
                cwd + '/templates',
                cwd
            );

            console.log(
                'z3 · Generated ' + (length > 1 ? args.join( '&' ) : args[0])
            );

        }
    );
};