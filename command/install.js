/**
 * @file
 * @author
 */

/* global module */

'use strict';

var download = require( '../lib/download' );
var path     = require( 'path' );
var process  = require( 'process' );

module.exports = function ( name ) {

    download( 'z3/z3-ui@master', function ( scaffold, tempPath, pkg ) {

        var deps = {};

        function getDeps( dep ) {

            var z3conf = require( getPath( dep, true ) );

            deps[dep] = getPath( dep );

            z3conf.dependencies.forEach( function ( val ) {
                (!deps[val]) && getDeps( val );
            } );
        }

        getDeps( name );

        var cwd = process.cwd();

        console.log( cwd );

        for ( var key in deps ) {
            let dep = deps[key];

            scaffold.util.move(
                dep,
                path.join( cwd, 'component', key )
            );
        }
        
        function getPath( name, isGetJson ) {

            var paths = [tempPath, 'components', name];
            isGetJson && paths.push( 'z3.json' );

            return path.join.apply( path, paths );
        }

    } );
};