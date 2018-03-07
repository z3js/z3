module.exports = function ( options ) {

    if ( typeof  options !== 'object' ) {
        return console.log( 'Unknown option [ %s ]!', options );
    }

    let download = require( '../lib/download' );
    let pkg      = require( '../package.json' );
    let each     = require( '../lib/util' ).each;
    let chalk    = require( 'chalk' );

    let snippet = 'templates';

    if ( options.components ) {
        snippet = 'components';
    }

    download( pkg.z3conf.template )
        .then( res => {
            let {pkg} = res;
            console.log();
            console.log( '  Available official %s:', snippet );
            console.log();
            each(
                pkg.data.templates, function ( repo ) {
                    console.log(
                        '  ' + chalk.yellow( '★' ) +
                        '  ' + chalk.blue( repo.name ) +
                        ' - ' + (repo.description || '') );
                }
            );
            console.log();
        } );
};
