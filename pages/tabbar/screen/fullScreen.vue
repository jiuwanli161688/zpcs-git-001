<template>
  <u-modal v-model="show" cancelText="不同意" confirmText="同意" showCancelButton title="服务协议和隐私政策" @confirm="confirm"
    @cancel="cancel">
    <view class="u-update-content">本应用尊重并保护所有用户的个人隐私权，为了给您提供更准确、更有个性化的服务，
      本应用会按照隐私政策的规定使用和披露您的个人信息。
      可阅读
      <a @tap="gotoLink">《服务协议》</a>
      和
      <a @tap="gotoB"> 《隐私政策》</a>了解详细信息。
      如果您同意，请点击下面按钮开始接受我们的服务。
    </view>
  </u-modal>
</template>

<script>
import storage from "@/utils/storage";
export default {
  created() {
    //先进入 created
    // if (storage.getShow()) {
    //   //展示的话进入  true
    //   console.log(this.show); //如果上面没读缓存  此时 this.show 为true
    //   if (!this.show) {
    //     //如果等于 false 了 就跳到主页
    //     this.show = storage.getShow(); //这里就为false
    //     setTimeout(() => {
    //       //然后这里就跳转到  首页
    //       uni.reLaunch({
    //         //跳转到 首页
    //         url: "/pages/tabbar/home/index",
    //       });
    //     }, 500);
    //   }
    // }
  },
  data() {
    return {
      show: true, //展示
      btnShow: true,
      a: "",
    };
  },
  //   onReady() {
  //     this.show = true;
  //   },
  methods: {
    gotoLink() {
      uni.navigateTo({
        //点击跳转到浏览器
        url:
          "/pages/profile/license?type=USER_AGREEMENT",
      });
      // uni.navigateTo({
      //   //点击跳转到浏览器
      //   url:
      //     "/pages/tabbar/home/web-view?src=https://mobile.zpwdsc.com/pages/profile/license?type=USER_AGREEMENT",
      // });
    },
    gotoB() {
      uni.navigateTo({
        url:
          "/pages/profile/license?type=PRIVACY_POLICY",
      });
      // uni.navigateTo({
      //   url:
      //     "/pages/tabbar/home/web-view?src=https://mobile.zpwdsc.com/pages/profile/license?type=PRIVACY_POLICY",
      // });
    },
    //取消
    cancel() {
      // #ifdef APP-PLUS
      // 获取平台信息
      const platform = uni.getSystemInfoSync().platform;
      if (platform === 'ios') {
        // iOS 退出应用
        plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
      } else if (platform === 'android') {
        // Android 退出应用
        plus.runtime.quit()
      }
      // #endif
    },
    confirm() {
      //点击
      this.show = false; // 让这个框为false
      storage.setShow(this.show); //存入缓存
      if (!this.show) {
        // 他如果 不展示  就跳转到主页
        setTimeout(() => {
          uni.reLaunch({
            //跳转到 首页
            url: "/pages/tabbar/home/index",
          });
        }, 500);
      }
    },
  },
};
</script>

<style scoped>
.u-update-content {
  line-height: 1.8;
  font-size: 26rpx;
  padding: 30rpx;
}

a {
  text-decoration: blue;
  color: blue;
}
</style>
