/**
 * index.tpl对应的js文件
 */

// 加载一些插件
Vue.use(require('/component/vue-hover/vue-hover'));

 var App = Vue.extend({
     data: function() {
         return {
            // titlebar中显示的标题
            title: '标题'
         }
     },
     components: {
         'app-titlebar': require('/widget/titlebar/titlebar')
     }
 });

 var router = new VueRouter();

 router.go({
     path: '/'
 });

 /**
  * 配置路由
  */
 router.map({
     '/': {
       component: require('/widget/simple/simple')
     }
 });

 router.start(App, '#app');
