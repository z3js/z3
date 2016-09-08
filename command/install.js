/**
 * @file
 * @author
 */

/* global module */

'use strict';

var download = require( '../lib/download' );
var path     = require( 'path' );
var process  = require( 'process' );
var pkg      = require( '../package.json' );
var each     = require( '../lib/util' ).each;

module.exports = function ( name ) {

    download( pkg.z3conf.component, function ( scaffold, tempPath ) {

        var deps = {};

        function getDeps( dep ) {

            var confPath = getPath( dep, true );

            if ( !scaffold.util.isFile( confPath ) ) {
                return console.log( 'Component %s not exist', dep );
            }

            var z3conf = require( confPath );

            deps[dep] = getPath( dep );

            each(
                z3conf.dependencies,
                function ( dep ) {
                    (!deps[dep]) && getDeps( dep );
                }
            );
        }

        getDeps( name );

        var cwd = process.cwd();

        each( deps, function ( dep, key ) {
            scaffold.util.move(
                dep,
                path.join( cwd, 'component', key )
            );

            console.log( 'Get component [ %s ] success!', key );
        } );

        function getPath( name, isGetJson ) {

            var paths = [tempPath, 'components', name];
            isGetJson && paths.push( 'z3.json' );

            return path.join.apply( path, paths );
        }

    } );
};