<%extends file="./layout.tpl"%>
<%block name="main"%>
    <app-titlebar
        :title="title"></app-titlebar>
    <router-view></router-view>
    <%require name="projectname:static/index/index.es6"%>
<%/block%>
