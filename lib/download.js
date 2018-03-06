module.exports = function ( id ) {

    const spinner = require( 'ora' )( 'downloading template' );
    spinner.start();

    let scaffold = new (require( 'fis-scaffold-kernel' ))( {
        type: 'gitlab',
        log : {
            level: 0
        }
    } );

    return new Promise( ( reslove, reject ) => {
        scaffold.download( id,
            function ( err, tempPath ) {
                spinner.stop();
                if ( err ) {
                    return reject( err )
                }

                let pkg;

                if ( scaffold.util.isFile( tempPath + '/package.json' ) ) {
                    pkg = require( tempPath + '/package.json' );
                }

                reslove( {
                    path: tempPath,
                    pkg : pkg
                } );
            }
        );
    } );
};

