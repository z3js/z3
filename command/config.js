/**
 * 主要是为了 z3 publish 命令，暂时简单粗暴一点
 */

module.exports = function ( key, value ) {
    require( '../lib/config' ).update( key, value );
};
