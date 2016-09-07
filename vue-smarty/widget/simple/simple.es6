/**
 * simple page
 */

var dialog  = require('/component/dialog/dialog');

var loading = require('/component/loading/loading').safeLoading;

module.exports = Vue.extend({
    template: __inline('simple.jade'),
    replace : true,
    methods : {
        openDialog: function() {
            dialog.confirm("haha");
        }
    }
});

loading.show();
