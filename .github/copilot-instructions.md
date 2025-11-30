# Copilot 使用指南（针对本仓库）

目的：帮助 AI 代码代理快速上手本项目，说明架构要点、常见开发/构建流程、约定与典型代码示例。

1. 项目概览（大局）
- 技术栈：基于 Uni-app + Vue (Vue2) 开发，目标平台包含 H5、APP（APP-PLUS）和微信小程序（MP-WEIXIN）。查看 `main.js` 和 `manifest.json` 获取平台相关配置。
- 路由/页面：所有页面由 `pages.json` 管理（含 `subPackages`）。新增页面必须在此文件注册以被 uni 构建器识别。
- UI：使用 `uview-ui`（在 `uview-ui/`）和若干自定义组件（`components/`、`components/Hina/` 等）。

2. 关键目录与文件（快速参考）
- 路由/页面：`pages.json`
- 启动与全局设置：`main.js`（全局 filter、uView mixin、Vue.prototype 上挂载的全局属性）
- API 配置：`config/api.js`（各环境 baseURL，注意有条件编译覆盖 MP/APP）
- 全局配置：`config/config.js`
- 网络请求封装：`utils/request.js`（在此实现 token header、签名、刷新逻辑，示例参考下方）
- 后端接口定义：`api/` 目录下多个文件（如 `login.js`、`goods.js`）
- 状态管理：`store/index.js`（Vuex）
- 本地存储工具：`utils/storage.js`
- 原生/插件配置：`manifest.json`（包含 nativePlugins、sdkConfigs 等）

3. 项目特有约定与模式（必须遵守）
- 条件编译：大量代码使用 `// #ifdef <PLATFORM>` / `// #endif`（如 `MP-WEIXIN`、`APP-PLUS`、`H5`）。在修改平台相关逻辑时，保持这些编译指令正确。
- API 环境切换：`config/api.js` 基于 `process.env.NODE_ENV` 切换 dev/prod，且对小程序/APP 有显式覆盖（`// #ifdef MP-WEIXIN || APP-PLUS`）。不要直接改硬编码 URL，优先在该文件调整。
- Token 流程：鉴权与刷新在 `utils/request.js` 实现。关键点：
  - 请求时将 `accessToken` 放入 `config.header.accessToken`；并在 params 中加入 `nonce/timestamp/sign`（见 `utils/request.js`）。
  - 返回 403 或 data.status===403 时，会调用 `refreshTokenFn`（来自 `api/login.js`）去刷新 token，刷新期间会队列化重试请求。
  - 如果刷新失败，会调用 `cleanStorage()` 并导航到登录页（`/pages/login/login`）。
- 全局 prototype：主题色、store 等挂载在 `Vue.prototype`（例如 `$mainColor`、`$store`、`ws`），请优先使用这些全局值而非硬编码。

4. 构建 / 运行 / 调试（可被发现的方式）
- 主要通过 HBuilderX 打包/运行（`manifest.json` 指定了 APP 和小程序的 native/plugins 配置）。
- 若需要 H5 本地调试，manifest 的 `h5.devServer` 有 `disableHostCheck` 配置；但仓库未包含根级 `package.json`（即没有可见 npm 脚本）。因此：
  - 推荐使用 HBuilderX 的“运行/发行”菜单来启动不同平台。
  - 可以在 HBuilderX 中打开该项目目录并运行“运行到浏览器/微信小程序/APP”以便调试。
- 日志去除：`vue.config.js` 中（注释）表明构建时可通过 terser 去除 console（生产时通常移除日志），修改时注意该文件。

5. 协作/编码建议（面向 AI 代理）
- 小改动优先在 `pages/` 或 `components/` 下对应文件实现，并保证在 `pages.json`/`manifest.json` 中的相关配置同步（如页面样式、subPackage）。
- 网络调用：新增接口请在 `api/` 下新增或修改对应模块，遵循现有导出（例：`export default { ... }` 或命名导出），并在需要的位置使用 `import api from '@/config/api.js'` 获取 baseURL。若需要改变行为（超时/签名等），优先在 `utils/request.js` 调整拦截器。
- 状态：对全局状态的改动应通过 `store/index.js` 的 mutations 来实现，避免直接修改 state。
- 原生功能：任何涉及原生插件（如 xinstall、支付）的改动必须同时检查 `manifest.json` 的 `nativePlugins` 或 `sdkConfigs`，并在 HBuilderX 中完成打包验证。

6. 常见示例（摘自仓库）
- token 刷新与队列化（主要逻辑在 `utils/request.js`）：
  - 若 response 返回 403 且存在 refresh token，则调用 `refreshTokenFn`，成功后把新的 `accessToken` 写入 storage 并重试请求队列。
- 增加页面：在 `pages/` 新建目录/文件后，记得向 `pages.json` 添加对应 `path`，并配置 `style`（导航栏/下拉刷新等）。

7. 其他注意事项
- 静态资源：`static/` 文件夹用于图片等资源，线上 CDN 有可能被使用（见 `config/config.js` 中的 `logo` 和 `iconCommon`）。
- 构建产物：`unpackage/` 下包含编译/打包输出和平台相关运行时代码，通常不直接编辑。
- 查找入口：若要定位某个 API 的调用栈，先在 `api/` 下查找接口定义，再跟踪 `utils/request.js` 的拦截器。

如果某部分信息不清楚（例如本地运行是否有自定义 npm 脚本，或团队使用的 HBuilderX 版本），请告诉我你想要我补充的项，我会基于仓库继续更新此文件。
