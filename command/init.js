/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

var process  = require( 'process' );
var path     = require( 'path' );
var fs       = require( 'fs' );
var download = require( '../lib/download' );

module.exports = function ( templateName ) {

    var roadmap = [
        {
            reg    : '**' + templateName + '/**',
            release: '$&'
        },
        {
            reg    : '**',
            release: false
        }
    ];

    return download( 'z3/z3-warehouse@master', function ( scaffold, tempPath ) {
        deliver( scaffold, tempPath, roadmap, templateName );
    } );
};

function deliver( scaffold, tempPath, roadmap, templateName ) {
    var cwd = process.cwd();

    scaffold.deliver(
        tempPath,
        cwd,
        roadmap
    );

    scaffold.util.move(
        path.join( cwd, 'templates', templateName ),
        cwd
    );

    if ( fs.existsSync( path.join( cwd, 'templates' ) ) ) {
        scaffold.util.del( path.join( cwd, 'templates' ) );
    }

    console.log(
        templateName + ' done!'
    );
}