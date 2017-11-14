/**
 * @file
 * @author
 */

/* global module, __dirname */

'use strict';

let process = require( 'process' );
let path    = require( 'path' );

let co     = require( 'co' );
let prompt = require( 'co-prompt' );
let chalk  = require( 'chalk' );
let ora    = require( 'ora' );

let download = require( '../lib/download' );
let build    = require( '../lib/build' );
let util     = require( '../lib/util' );
let logger   = require( '../lib/logger' );

let pkg = require( '../package.json' );

module.exports = function ( templateName ) {

    if ( typeof templateName !== 'string' ) {
        return templateName.help();
    }

    const spinner = ora( 'downloading template' );
    spinner.start();
    return download( pkg.z3conf.template, function ( scaffold, tempPath ) {
        spinner.stop();
        deliver( scaffold, {
            tempPath    : tempPath,
            templateName: templateName
        } );
    } );
};

function deliver( scaffold, options ) {

    let {tempPath, templateName} = options;

    let cwd      = process.cwd();
    let fromPath = path.join( tempPath, 'templates', templateName );

    let files = scaffold.util.find( fromPath );

    if ( files.length === 0 ) {
        return logger.fatal( 'Failed to download repo [ ' + templateName + ' ]' );
    }

    co( function* () {
        let projectName = util.getLocalDirName();
        let namespace   = yield prompt( util.getAskDescription( 'Project Name', projectName ) );

        if ( namespace === '' ) {
            namespace = projectName;
        }

        process.stdin.pause();

        files.forEach( val => {
            val = val.replace( fromPath, '' ).replace( /^\\/g, '' );
            console.log( chalk.yellow( '  Installing ' ) + val );
        } );

        scaffold.util.move(
            fromPath,
            cwd
        );

        build( namespace, cwd );
    } );
}