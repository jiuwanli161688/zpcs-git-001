import Vue from "vue";
import App from "./App";
import * as filters from "./utils/filters.js"; // global filter
import uView from "uview-ui";
import store from "./store";
import config from '@/config/config';
import airBtn from "@/components/m-airbtn/index.vue";
import GlobalPopup from './components/popups/GlobalPopup.vue';
import socketIO from './pages/mine/im/socket';
import ws from './lib/request/websocket.js'

// #ifdef APP-PLUS
// 测试-暂时注释
// const xinstall = uni.requireNativePlugin('xinstall-plugin');
// xinstall.init();
// #endif

/**
 * 仅在h5中显示唤醒app功能
 * 在h5页面手动挂载
 *
 */
// #ifdef H5
if (config.enableMiniBarStartUpApp) {
  let btn = Vue.component("airBtn", airBtn); //全局注册
  // document.body.appendChild(new btn().$mount().$el);
}
// #endif

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

/**
 * 全局filters
 */

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 引入Vuex
Vue.prototype.$store = store;
// Vue.prototype.socketIo = new socketIO();
Vue.use(uView);
Vue.config.productionTip = false;


/**
 * 注意！
 * 此处将常用的颜色嵌入到原型链上面
 * 颜色使用驼峰命名对应 uni.scss中全局颜色变量名
 * 如需更换主题请修改此处以及uni.scss中的全局颜色
 */
// 主题色
Vue.prototype.$mainColor = config.mainColor;
// 高亮主题色
Vue.prototype.$lightColor = config.lightColor;
// 辅助高亮颜色
Vue.prototype.$aiderLightColor = config.aiderLightColor;
// 设置微信小程序网络图片路径
Vue.prototype.iconCommon = 'https://zpwdsc.oss-cn-beijing.aliyuncs.com';
// Vue.prototype.iconCommon = 'https://zpyhsc.com/image';



Vue.prototype.ws = ws
App.mpType = "app";

const app = new Vue({
  ...App,
  mounted() {
    // // 创建弹窗组件的实例
    // const PopupConstructor = Vue.extend(GlobalPopup);
    // const popupInstance = new PopupConstructor();
    // const popupEl = popupInstance.$mount();


    // // #ifdef APP-PLUS
    // Vue.prototype.$globalPopup = new Vue({
    //   render: h => h(GlobalPopup)
    // }).$mount();
    // //该代码仅在app中生效
    // // #endif


    // // #ifdef H5
    // document.body.appendChild(popupEl.$el);      //该代码仅在h5中生效
    // Vue.prototype.$popup = popupInstance;
    // // #endif


    // // #ifdef MP
    // const queryAPP = uni.createSelectorQuery().in(this);
    // console.log('queryAPP', queryAPP.select('#app'))
    // console.log('queryAPP', popupEl.$el)
    // queryAPP.select('#app').node((res) => {
    //   res.node.appendChild(popupEl.$el);
    // }).exec();

    //该代码仅在小程序中生效
    // #endif

    // 将弹窗的 show 方法挂载到 Vue 原型上
  }
});
app.$mount();