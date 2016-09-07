/**
 * loading
 */
var dom = require('../helper/dom');

/**
* show
*/
function show() {
    // 插入到body中
    dom.appendChilds(document.body, this);
    setTimeout(function() {
        dom.addClass(this, 'show');
    }.bind(this), 20);
}

function hide() {
    dom.removeClass(this, 'show');
    setTimeout(function() {
        dom.removeChilds(document.body, this);
    }.bind(this), 20);
}

var loading = {
    // 带支付logo的loading
    safeLoading: (function() {
        var node = dom.create('div');
        dom.addClass(node, 'safe-loading');
        node.innerHTML = [
            '<i></i>',
            '<p>百度钱包</p>',
            '<p class="safe-loading-container">',
                '<u></u>',
                '<u></u>',
                '<u></u>',
            '</p>'
        ].join('');

        return node;
    })(),

    // 普通的loading
    normalLoading: (function() {
        var node = dom.create('div');
        dom.addClass(node, 'normal-loading');
        node.innerHTML = [
            '<span class="normal-loading-container"></span>',
            '<span>正在加载...</span>'
        ].join('');

        return node;
    })()
};

for (var i in loading) {
    if (!loading.hasOwnProperty(i)) {
        continue;
    }
    var node  = loading[i];
    node.show = show.bind(node);
    node.hide = hide.bind(node);
}

module.exports = loading;
