/**
 * 一些公共函数
 */

module.exports = {
    extend: function() {
        var args  = Array.prototype.slice.call(arguments);
        if (!args.length) {
            return;
        }
        var first = args[0];
        for (var i = 0, item; item = args[++i];) {
            for (var prop in item) {
                if (item.hasOwnProperty(prop)) {
                    first[prop] = item[prop];
                }
            }
        }
        return first;
    },
    /**
     * 将对象序列化为查询字符串
     */
    serialize: function(obj) {
        // console.log(obj);
        var res = [];
        for (var item in obj) {
            if (!obj.hasOwnProperty(item)) {
                continue;
            }
            res.push(item + '=' + encodeURIComponent(obj[item]));
        }
        return res.join('&');
    },
    /**
     * 是否是一个空对象
     */
    isEmptyObject: function(object) {
        if (!object) {
            return false;
        }
        for (var i in object) {
            return false;
        }
        return true;
    },
    /**
     * 获取一个随机数
     * [a, b)
     */
    randint64: function(a, b) {
        if (!b) {
            // 如果只有一个参数，就取[0, a)
            b = a;
            a = 0;
        }
        // 0|(Math.random() * (b - a)) + a;
        return Math.floor((Math.random() * (b - a)) + a);
    },
    getHash: function(url) {
        if (!~url.indexOf('#')) {
            return '';
        }
        return url.slice(url.lastIndexOf('#') + 1);
    },
    /**
     * 获取url参数
     */
    getQueryString: function(name) {
        var search = location.search;
        if (search === '') {
            return '';
        }
        // 过滤掉第一个问号
        search = search.slice(1).split('&');
        for (var i = 0, l = search.length; i < l; i ++) {
            var item = search[i].split('=');
            if (name === item[0]) {
                try {
                    return decodeURIComponent(item[1]);
                } catch(e) {
                    return item[1];
                }
            }
        }
        return '';
    }
}
