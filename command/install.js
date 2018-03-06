let logger = require( '../lib/logger' );
let componentPath;

module.exports = function ( name ) {
    let pkg           = require( '../package.json' );
    let download      = require( '../lib/download' );
    let findComponent = require( '../lib/util' ).findComponent
    let check         = require( '../lib/util' ).checkTemplate;

    download( pkg.z3conf.template )
        .then( res => findComponent( name, res.path ) )
        .then( setGlobalComponentPath )
        .then( path => check( name, path ) )
        .then( files => build( name ) )
        .catch( logger.fatal );
};


/**
 * 缓存一下已找到的组件库路径
 */
function setGlobalComponentPath( path ) {
    componentPath = path;
    return componentPath;
}

function build( name ) {
    let {getScaffold} = require( '../lib/util' );
    let path          = require( 'path' );
    let process       = require( 'process' );

    getScaffold().util.move(
        componentPath,
        path.join( process.cwd(), 'component', name )
    );
    logger.success( `  Install component <${name}> success` );
}
