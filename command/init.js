/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

module.exports = function ( name ) {

    var args = arguments;

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

            scaffold.deliver(
                path,
                __dirname,
                roadmap
            );
        }
    );
};