/**
 * dialog弹窗组件
 */

var util = require('../helper/util');
var dom  = require('../helper/dom');

function Dialog(opts) {
    // 如果已经有弹窗了
    if (document.querySelector('.dialog')) {
        return;
    }
    var self = this;
    var body = document.body;

    this.button  = opts.button;

    this.dialog  = dom.create('div');
    this.header  = dom.create('header');
    this.content = dom.create('article');
    this.footer  = dom.create('footer');
    // console.log(this.footer)
    // this.close   = dom.create('span');

    // this.header.appendChild(this.close);
    dom.addClass(this.dialog, 'dialog');
    dom.addClass(this.header, 'dialog-header');
    dom.addClass(this.footer, 'dialog-footer', 'border-top');
    dom.addClass(this.content,'dialog-content');
    // dom.addClass(this.close,  'dialog-close');
    // 根据类型添加不同的class
    if (opts.type === 'alert') {
        dom.addClass(this.dialog, 'alert');
    }
    else if (opts.type === 'confirm') {
        dom.addClass(this.dialog, 'confirm');
    }
    // 点击关闭弹窗
    this.closeHandle = function(e) {
        // 触发关闭事件
        e.stopPropagation();
        // 销毁自身
        self.destroy();
    };

    // 绑定关闭事件
    // this.close.addEventListener('click', this.closeHandle, false);

    // 设置按钮
    this.button.forEach(function(btn, idx) {
        // 添加
        var node = btn.node;
        node.addEventListener('touchstart', function(e) {
            // e.stopPropagation();
            e.preventDefault();
            dom.addClass(this, 'dialog-button-hover');
        });

        node.addEventListener('touchend', function(e) {
            e.preventDefault();
            self.destroy();
            btn.handle &&
            btn.handle.call(self, e);
        });

        self.footer.appendChild(node);
    });
    var content = [];
    // 设置标题
    var title = opts.title || '提示';
    content.push('<h4>'+ title +'</h4>');
    // 设置内容
    content.push('<div class="content">'+ opts.content +'</div>');
    this.content.innerHTML = content.join('');
    // 把所有部件都加到dialog里
    dom.appendChilds(this.dialog, this.header, this.content, this.footer);

    body.appendChild(this.dialog);
    // 默认展现overlay
    if (!opts.hasOwnProperty('showOverlay') || opts.showOverlay) {
        this.overlay = dom.create('div');
        dom.addClass(this.overlay,'dialog-overlay');
        body.appendChild(this.overlay);

        this.overlay.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
    }
    // 添加弹出动画
    setTimeout(() => {
        dom.addClass(self.dialog, 'show');
    }, 20);

    this.dialog.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

}

util.extend(Dialog.prototype, {
    /**
     * 销毁实例
     */
    destroy: function() {
        var body = document.body;
        // 移除事件
        // this.close.removeEventListener('click', this.closeHandle, false);
        // 移除元素
        if (this.overlay) {
            body.removeChild(this.overlay);
        }
        body.removeChild(this.dialog);
    }
});

/**
 * toast 提示
 */
Dialog.toast = (content, time = 2000) => {
    // 时间不得小于500
    if (time < 500) {
        time = 500;
    }
    var body = document.body;
    // 如果dom中已有toast
    if (body.querySelector('.toast')) {
        return;
    }
    var node = dom.create();
    // 添加class
    dom.addClass(node, 'toast');
    node.innerHTML = content;

    body.appendChild(node);
    // 一定时间后移除
    setTimeout(function() {
        dom.addClass(node, 'show');
    }, 20);

    setTimeout(() => {
        body.removeChild(node);
    }, time);
};

/**
 * alert
 */
Dialog.alert = (opts) => {
    // 只有一个按钮
    var button = dom.create('span');
    dom.addClass(button, 'dialog-button');
    // 对button进行处理
    var text   = '我知道了';
    var handle = null;

    if (typeof opts === 'string' ||
        typeof opts === 'number' ||
        typeof opts === 'boolean') {
        opts = {
            content: opts
        };
    } else if (opts.button) {
        if (opts.button.text) {
            text = opts.button.text;
        }
        if (opts.button.handle) {
            handle = opts.button.handle;
        }
    }
    button.innerHTML = text;
    opts.type = 'alert';
    opts.button = [{
        node  : button,
        handle: handle
    }];
    return new Dialog(opts);
};

/**
 * confirm
 */
Dialog.confirm = (opts) => {
    var button = [];
    if (typeof opts === 'string' ||
        typeof opts === 'number' ||
        typeof opts === 'boolean') {
        opts = {
            content: opts,
            buttons: [
                {text: '确定'},
                {text: '取消'}
            ]
        };
    }
    var i = 0;
    var l = opts.buttons.length;
    for (; i < l; i ++) {
        var btn = dom.create('span');
        if (i !== (l - 1)) {
            dom.addClass(btn, 'dialog-button', 'border-right');
        } else {
            dom.addClass(btn, 'dialog-button');
        }
        btn.innerHTML = opts.buttons[i].text;
        button.push({
            node: btn,
            handle: opts.buttons[i].handle
        });
    }
    opts.buttons = null;
    delete opts.buttons;

    opts.type = 'confirm';
    opts.button = button;
    return new Dialog(opts);
};

module.exports = Dialog;
