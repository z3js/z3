# z3

## 思路

1. init git clone 获取最新模板
2. 读取模板配置文件
3. git checkout 模板配置文件
4. diff 配置文件，得到增量映射表
5. checkout & update
6. z3 list 显示现有模板
  - 名称
  - 描述
  - 版本号
7. z3 init 安装模板
8. z3 cw (create widget) 创建 widget
9. z3 iw (install widget) 安装 widget
10. TODO： 
  - z3 publish widget 发布 widget
  - github？gitlab？切换模板来源；z3 config set registry https://github.com
