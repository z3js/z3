const open     = require( 'open' );
const download = require( '../lib/download' );

module.exports = function ( templateName ) {

    download( require( '../package.json' ).z3conf.template )
        .then( res => {
            let {pkg} = res;
            open( pkg.data.documentPrefix + templateName + '.md' );
        } );


};
