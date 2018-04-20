/**
 * 主要是为了 z3 publish 命令，暂时简单粗暴一点
 */
let config = require( '../lib/config' );
let logger = require( '../lib/logger' );

module.exports = function ( key, value ) {

    let CONFIG = config.get();

    function print( key ) {
        let val = CONFIG[key];
        return val
            ? logger.success( `[ ${key} ]: ${val}` )
            : logger.fatal( ` Unknown token ${key}` );
    }

    if ( !key ) {
        return (() => {
            for ( let k in CONFIG ) {
                print( k );
            }
        })();
    }

    if ( key && !value ) {
        return print( key );
    }

    config.update( key, value );
};
