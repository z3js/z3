/**
 * titlebar
 */

var device = require('/component/helper/device');
var util   = require('/component/helper/util');

module.exports = Vue.extend({
    template: __inline('titlebar.jade'),
    replace : true,
    props: ['title'],
    data: function() {
        return {
            showTitleBar: true
        };
    },
    created: function() {
        // 如果是钱包app或者手百轻应用环境或者url中有titlebar=0
        if (device.isWalletApp() ||
            device.isLightApp() ||
            util.getQueryString('titlebar') == '0') {
            // 隐藏header
            this.showTitleBar = false;
        }
    },
    methods: {
        // 点击返回
        back: function() {
            history.go(-1);
        }
    }
});
