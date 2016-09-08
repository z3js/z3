/**
 * @file
 * @author
 */

/* global module, __dirname */

module.exports = function ( id, callback ) {
    var scaffold = new (require( 'fis-scaffold-kernel' ))( {
        type: 'gitlab',
        log : {
            level: 0
        }
    } );

    scaffold.download(
        id,
        function ( err, tempPath ) {
            if ( err ) {
                return console.log(
                    err
                );
            }

            var pkg;

            if ( scaffold.util.isFile( tempPath + '/package.json' ) ) {
                pkg = require( tempPath + '/package.json' );
            }

            callback && callback( scaffold, tempPath, pkg );
        }
    );
};

