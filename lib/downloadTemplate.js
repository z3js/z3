/**
 * @file
 * @author
 */

/* global module, __dirname */

var path       = require( 'path' );
var initConfig = require( '../command/init-conf.json' );

module.exports = function ( scaffold, callback ) {
    scaffold = scaffold || new (require( 'fis-scaffold-kernel' ))( {
            type: 'gitlab',
            log : {
                level: 0
            }
        } );

    scaffold.download(
        'z3/z3-warehouse@master',
        function ( err, tempPath ) {
            if ( err ) {
                return console.log(
                    err
                );
            }

            // 更新path、version
            initConfig.templatePath = tempPath;
            initConfig.version      = require( initConfig.templatePath + '/package.json' ).version;

            callback && callback( scaffold, tempPath );

            scaffold.util.write(
                '../command/init-conf.json',
                JSON.stringify( initConfig, null, 4 ),
                'utf8'
            );
        }
    );
};

