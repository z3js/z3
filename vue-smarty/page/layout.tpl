<%html framework="/static/lib/mod.js"%>
    <%head%>
        <meta charset="gbk">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="format-detection" content="telephone=no">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <title>project title</title>
        <link rel="stylesheet" href="../component/ui/common.less">
    <%/head%>
    <%body%>
        <div id="app">
            <%block name="main"%><%/block%>
        </div>
        <script src="//www.baifubao.com/content/resource/libs/vue/v1-0-26/vue.min.js"></script>
        <script src="//www.baifubao.com/content/resource/libs/vue-router/v0-7-13/vue-router.min.js"></script>
    <%/body%>
<%/html%>
