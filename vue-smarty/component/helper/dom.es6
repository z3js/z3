/**
 * dom相关操作
 */
module.exports = {
    create: function(type = 'div') {
        return document.createElement(type);
    },
    createFragment: function() {
        return document.createDocumentFragment();
    },
    /**
     * addClass
     */
    addClass: function(node, ...args) {
        // 第一个是节点
        // 低版本浏览器不支持批量添加class
        args.forEach(function(item) {
            node.classList.add(item);
        });
    },

    /**
     * removeClass
     */
    removeClass: function(node, ...args) {
        args.forEach(function(item) {
            node.classList.remove(item);
        });
    },

    /**
     * hasClass
     */
    hasClass: function(node, className) {
        return node.classList.contains(className);
    },

    /**
     * 设置属性
     */
    attr: function(node, attrs) {
        for (let idx in attrs) {
            if (!attrs.hasOwnProperty(idx)) {
                continue;
            }
            if (idx !== "styles") {
                // 直接设置属性
                node.setAttribute(idx, attrs[idx]);
                continue;
            }
            // 解析style属性
            let arr = attrs.split(/; */);
            let pair, l, i;

            for (i = 0, l = arr.length; i < l; i ++) {
                pair = arr[i].split(/: */);
                node.style[pair[0]] = pair[1];
            }
        }
    },
    /**
     * 设置样式
     */
    css: function(node, styles) {
        for (let style in styles) {
            if (!styles.hasOwnProperty(style)) {
                continue;
            }
            // 首先判断style中是否包含大写字母
            style = style
                    .split('')
                    .map(function(item) {
                        console.log(item)
                        if (/[A-Z]/.test(item)) {
                            return '-' + item.toLocaleLowerCase();
                        }
                        return item;
                    })
                    .join('');

            node.style[style] = styles[style];
        }
    },

    /**
     * 添加多个子元素
     */
    appendChilds: function(...args) {
        var parent = args.shift();
        var fragment = this.createFragment();
        var i = 0;
        var l = args.length;

        for (; i < l; i ++) {
            fragment.appendChild(args[i]);
        }
        parent.appendChild(fragment);
    },
    /**
     * 移除多个子元素
     */
    removeChilds: function(...args) {
        var parent = args.shift();
        var i = 0;
        var l = args.length;

        for (; i < l; i ++) {
            // 这个地方最好判断一下
            parent.removeChild(args[i]);
        }
    }
};
