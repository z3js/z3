/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

var pkg      = require( '../package.json' );
var download = require( '../lib/download' );
var chalk    = require( 'chalk' );
var each     = require( '../lib/util' ).each;

module.exports = function ( options ) {

    if ( typeof  options != 'object' ) {
        return console.log( 'Unknown option [ %s ]!', options );
    }

    var id      = pkg.z3conf.template;
    var snippet = 'templates';

    if ( options.components ) {
        id      = pkg.z3conf.component;
        snippet = 'components';
    }

    download( id, function ( scaffold, tempPath, pkg ) {
        console.log( '  Available official %s:', snippet );
        console.log();
        each(
            pkg.data, function ( repo ) {
                console.log(
                    '  ' + chalk.yellow( '★' ) +
                    '  ' + chalk.blue( repo.name ) +
                    ' - ' + (repo.description || '') );
            }
        );
    } );
};