#!/usr/bin/env node


var program = require( 'commander' );
var version = require( '../package' ).version;

program.version( version ).usage( '<command> [options]' );

program
    .command( 'init <templateName>' )
    .description( 'Generate a new project from a template' )
    .action( require( '../command/init' ) );

program
    .command( 'install <componentName>' )
    .description( 'Install components' )
    .action( require( '../command/install' ) );

program
    .command( 'list' )
    .description( 'List available official templates or components' )
    .option( '-t, --templates', 'List available official templates' )
    .option( '-c, --components', 'List available official components' )
    .action( require( '../command/list' ) );

program
    .command( 'create <pageName> [templateName]' )
    .description( 'Create a page under the specified template' )
    .action( require( '../command/create' ) );

program
    .command( 'doc <templateName>' )
    .description( 'Docs for a z3-template in a web browser maybe' )
    .action( require( '../command/doc' ) );

program
    .command( 'wfe-init' )
    .description( 'Initialize a new project from wfe template' )
    .action( require( '../command/wfe-init' ) );

program
    .command( 'publish [componentName]' )
    .description( 'Publish a component' )
    .action( require( '../command/publish' ) );

program
    .command( 'config [key] [value]' )
    .description( 'Generate user config' )
    .action( require( '../command/config' ) );

program.parse( process.argv );

if ( !program.args.length ) {
    program.help();
}
