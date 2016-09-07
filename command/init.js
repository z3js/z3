/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

var process          = require( 'process' );
var path             = require( 'path' );
var co               = require( 'co' );
var fs               = require( 'fs' );
var prompt           = require( 'co-prompt' );
var versionCompare   = require( '../lib/versionCompare' );
var downloadTemplate = require( '../lib/downloadTemplate' );

module.exports = function ( name ) {

    var args = makeArray( arguments ).filter( function ( val ) {
        return (typeof val === 'string')
    } );

    var templateName = args[0];

    var scaffold = new (require( 'fis-scaffold-kernel' ))( {
        type: 'gitlab',
        log : {
            level: 0
        }
    } );

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

    const CONFIG_PATH = path.resolve( __dirname + '/init-conf.json' );

    var initConfig = require( CONFIG_PATH );
    var pkg;

    if ( initConfig.templatePath ) {
        pkg = require( initConfig.templatePath + '/package.json' );
    }

    if ( !pkg || (pkg && (versionCompare( pkg.version, initConfig.version ) === 1)) ) {
        return downloadTemplate( scaffold, function ( scaffold, tempPath ) {
            deliver( scaffold, tempPath, roadmap, templateName );
        } );
    }

    deliver( scaffold, initConfig.templatePath, roadmap, templateName );
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
        'Done!'
    );
}


function makeArray( arrayLike ) {
    return Array.prototype.slice.call( arrayLike );
}