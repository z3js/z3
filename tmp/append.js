
routes.push( {
    path     : '/{template}',
    component: component( ( resolve ) => {
        require.async(
            '/page/{template}',
            ( component ) => {
                resolve( component['{template}'] );
            }, onComponentLoadError( resolve )
        );
    } )
} );