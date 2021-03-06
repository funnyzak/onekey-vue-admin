# OneKey-VUE-Admin [![Release Version](https://img.shields.io/github/release/funnyzak/onekey-vue-admin.svg)](https://github.com/funnyzak/onekey-vue-admin/releases/latest) [![Latest Release Download](https://img.shields.io/github/downloads/funnyzak/onekey-vue-admin/latest/total.svg)](https://github.com/funnyzak/onekey-vue-admin/releases/latest) [![Total Download](https://img.shields.io/github/downloads/funnyzak/onekey-vue-admin/total.svg)](https://github.com/funnyzak/onekey-vue-admin/releases)

基于 [vue-element-admin 4.2.1](https://github.com/PanJiaChen/vue-element-admin) 开发的通用后台管理系统。

项目使用的 API接口 基于开源项目  **[OneKey-Java](https://github.com/funnyzak/onekey-java)** 。

- 演示地址： [oconsole.niuqi.cc](http://oconsole.niuqi.cc)
- GitHubPage: [https://funnyzak.github.io/onekey-vue-admin](https://funnyzak.github.io/onekey-vue-admin)

[![演示](.docs/assets/img/demo.gif)](https://funnyzak.github.io/onekey-vue-admin)

---

## 开始

```bash

# 克隆项目
git clone -b master git@github.com:funnyzak/onekey-vue-admin.git

# 进入文件夹
cd onekey-vue-admin

# 安装依赖：建议使用 node=>v 10.13.1，避免依赖冲突
npm install

# 开发启动
npm run dev
```

This will automatically open http://localhost:2081

## 构建

```bash
# 测试环境
npm run build:stage

# 生产打包
npm run build:prod
```

## 进一步

```bash

# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码检查
npm run lint

# 代码检查 + 自动修复
npm run lint -- --fix
```

--

## 赞赏

![赞赏](.docs/assets/img/coffee.png)

## Author

| [![twitter/funnyzak](https://s.gravatar.com/avatar/c2437e240644b1317a4a356c6d6253ee?s=70)](https://twitter.com/funnyzak 'Follow @funnyzak on Twitter') |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [funnyzak](https://yycc.me/)                                                                                                                           |

## License

Apache-2.0 License © 2021 [funnyzak](https://github.com/funnyzak)
