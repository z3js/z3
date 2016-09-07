
var util = require('../helper/util');

// 一个简单的冒泡
function bubble(root, node, klass, cb) {
    while (node && node !== root) {
        if (node.classList &&
            node.classList.contains(klass)) {
            cb(node);
            break;
        }
        node = node.parentNode;
    }
}

module.exports = {
    install: function(Vue, options) {
        // 定义指令
        Vue.directive('hover', {
            // bind
            bind: function() {
                var klass = this.expression;
                var modifiers = this.modifiers;
                // 没有参数，直接将事件绑定在当前元素上
                if (util.isEmptyObject(modifiers)) {
                    this.hoverIn = function() {
                        if (~Array.prototype.indexOf.call(this.classList, 'disable')) {
                            return;
                        }
                        this.classList.add(klass);
                    };
                    this.hoverOut = function() {
                        this.classList.remove(klass);
                    };

                } else {
                    var child = Object.keys(modifiers)[0];
                    this.hoverIn = function(event) {
                        // alert('111')
                        // target可能是需要代理的元素的子元素
                        bubble(this, event.target, child, function(node) {
                            if (~Array.prototype.indexOf.call(node.classList, 'disable')) {
                                return;
                            }
                            node.classList.add(klass);
                        });
                    };
                    this.hoverOut = function(event) {
                        bubble(this, event.target, child, function(node) {
                            node.classList.remove(klass);
                        });
                    };
                }
                this.el.addEventListener('touchstart', this.hoverIn, false);
                this.el.addEventListener('touchend', this.hoverOut, false);
            },
            // 不需要update
            unbind: function() {
                this.el.removeEventListener('touchstart', this.hoverIn, false);
                this.el.removeEventListener('touchend', this.hoverOut, false);
                this.hoverIn  = null;
                this.hoverOut = null;
            }
        });
    }
};
