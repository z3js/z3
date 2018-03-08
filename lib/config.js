let path      = require( 'path' );
let HOME_DIR  = require( 'os' ).homedir();
const RC_PATH = path.join( HOME_DIR, '/.z3rc' );

let fs = require( 'fs-extra' );

function getRc() {

    if ( fs.pathExistsSync( RC_PATH ) ) {
        return fs.readJsonSync( RC_PATH );
    }

    return {
        token: ''
    }
}

function updateRC( key, value ) {
    let $data  = getRc();
    $data[key] = value;
    fs.writeJSONSync( RC_PATH, $data );
}

module.exports = {
    update: updateRC,
    get   : getRc
};
