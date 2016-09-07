/**
 * fis-conf
 */
fis.require('smarty')(fis);

fis.set('namespace', 'projectname');

fis.media('dev').match('*', {
    useHash: false,
    optimizer: null
})
.set('smarty', {
    'left_delimiter': '<%',
    'right_delimiter': '%>'
});

/**
 * 异构语言
 */
fis
.match('*.es6', {
    parser: fis.plugin('es6-babel'),
    rExt  : '.js'
})
.match('*.less', {
    parser: fis.plugin('less'),
    rExt  : '.css'
})
.match('*.jade', {
    parser: fis.plugin('jade'),
    rExt  : '.html'
});

/**
 * 对widget,component下的资源打包
 */
fis.match('/{widget,component}/**/*.{js,es6}', {
    isMod: true,
    postprocessor: fis.plugin('jswrapper')
});

/**
 * 同名依赖
 */
fis.match('/{static,widget,component}/**', {
    useSameNameRequire: true
});
