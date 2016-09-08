/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

var process  = require( 'process' );
var path     = require( 'path' );
var download = require( '../lib/download' );
var pkg      = require( '../package.json' );
var chalk    = require( 'chalk' );

module.exports = function ( templateName ) {
    return download( pkg.z3conf.template, function ( scaffold, tempPath ) {
        deliver( scaffold, tempPath, templateName );
    } );
};

function deliver( scaffold, tempPath, templateName ) {
    var cwd = process.cwd();

    var fromPath = path.join( tempPath, 'templates', templateName );

    scaffold.util.find( fromPath ).forEach( function ( val ) {
        val = val.replace( fromPath, '' ).replace( /^\\/g, '' );
        console.log( chalk.yellow( '  Installing ' ) + val );
    } );

    scaffold.util.move(
        fromPath,
        cwd
    );

    console.log( chalk.green( 'Get template: [ %s ] success!' ), templateName );
}