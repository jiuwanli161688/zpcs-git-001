import Vue from "vue";
import Vuex from "vuex";
import storage from "@/utils/storage";
import config from "@/config/config";

Vue.use(Vuex);

// 判断当前平台
const getPlatform = () => {
  // #ifdef APP-PLUS
  return 'app';
  // #endif
  // #ifdef H5
  return 'h5';
  // #endif
  // #ifdef MP-WEIXIN
  return 'mp-weixin';
  // #endif
  return 'unknown';
};
const currentPlatform = getPlatform();
const store = new Vuex.Store({
  state: {
    isShowToast: false, // 是否在展示Toast中
    remark: [], //填写订单备注
    shareLink: "", //分享链接
    verificationKey: "", //获取key表示验证通过
    distributionId: "", //分销员Id 如果当前账户从未登录过时记录
    doorFaild: [], //上门服务失败
    hasLogin: storage.getHasLogin(),
    userInfo: storage.getUserInfo(),
    uuid: storage.getUuid(),
    token: "",
    config: {
      ...config,
    }, // 全局配置
    isFull: config.isFull || false, // 直接使用配置文件的值，如果没有则默认为false
    xInstallLoading: currentPlatform === 'app' ? true : false, // 是否在展示loading中，只在APP中生效
    cartCount: 0, // 购物车商品数量
  },
  mutations: {
    setXInstallLoading(state, loading) {
      // 只在APP平台设置loading状态
      if (currentPlatform === 'app') {
        state.xInstallLoading = loading;
      }
    },
    login(state, userInfo) {
      state.userInfo = userInfo || {};
      state.userName =
        userInfo.Name || userInfo.Nickname || userInfo.Username || "匿名用户";
      state.hasLogin = true;
    },
    logout(state) {
      state.userName = "";
      state.hasLogin = false;
    },

    // 设置填写订单中备注
    setRemark(state, remark) {
      state.remark = remark;
    },
    modifyDoor(state, sn) {
      state.doorFaild.push(sn)
    },
    modifyDoorTest(state, sn) {
      state.doorFaild = state.doorFaild.filter(item => item != sn)
    },
    // 更新全局配置中的isFull值
    updateIsFull(state, isFull) {
      state.isFull = isFull;
    },
    // 更新购物车数量
    updateCartCount(state, count) {
      state.cartCount = count;
    }
  },
  actions: {},
});

export default store;
