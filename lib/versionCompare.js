/**
 *
 * Semantic Versioning,see:
 *
 *      http://semver.org/
 *
 * 版本对比
 * v1 < v2  ===> -1
 * v1 > v2  ===> 1
 * v1 == v2 ===> 0
 *
 * e.g :
 *
 *      versionCompare( '1.0.0.1', '1.0.0.2' ); // output -1
 *      versionCompare( '2.0.0.1', '1.0.0.2' ); // output 1
 *      versionCompare( '1.0', '1.0' );         // output 0
 *
 *
 * @param v1 1-N位版本
 * @param v2 1-N位版本
 * @returns {number}
 */
function versionCompare( v1, v2 ) {

    // 两方恒等，不过逻辑
    if ( v1 === v2 ) {
        return 0;
    }

    v1 = v1.split( '.' );
    v2 = v2.split( '.' );

    var length = Math.max( v1.length, v2.length );

    var i = 0;
    var a;
    var b;

    for ( ; i < length; i++ ) {

        a = parseInt( v1[i] || 0 );
        b = parseInt( v2[i] || 0 );

        if ( a > b ) {
            return 1;
        }

        if ( a < b ) {
            return -1;
        }

    }

    return 0;
}

module.exports = versionCompare;