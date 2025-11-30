<template>
  <div class="wrapper">
    <!-- 全套 -->
     <template v-if="isFull">
      <tpl ref="tpl" />
      <view class="back-to-top" v-if="showBackToTop" @tap="backToTop">
      </view>
    </template>
    <!-- 注册拉新 -->
    <template v-if="!isFull">
    <view class="qrcode-container">
      <view class="content-wrapper">
        <view class="logo-section">
          <image class="logo-img" :src="iconLogo" mode="aspectFit"></image>
          <text class="welcome-text">欢迎使用</text>
          <text class="app-name">服务商中心</text>
        </view>
        <view class="button-section">
          <button class="qrcode-btn" @tap="goToQRCode">
            <text class="btn-text">查看我的二维码</text>
            <text class="btn-icon">→</text>
          </button>
        </view>
      </view>
    </view>
  </template>
  </div>
</template>
<script>
import tpl from "@/pages/tabbar/home/views.vue";
import * as API_Trade from "@/api/trade";
import storage from "@/utils/storage";
import util from '@/lib/util.js'
import * as apiMember from '@/api/members'
import { watch } from "vue";
import { computed } from "vue";
export default {
  data() {
    return {
      showBackToTop: false,      //是否显示回到顶部
      scrollTop: 0,      // 记录滚动距离
			iconLogo: `${this.iconCommon}/static/v1/s-logo.jpg`,
      userInfo: {},
      userInfoLoaded: false,
    }
  },
  components: {
    tpl,
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    // 当滚动距离大于700时显示回到顶部按钮
    this.showBackToTop = this.scrollTop > 700;
  },
  computed:{
    isFull(){
      return this.$store.state.isFull
    }
  },
  methods: {
    // 获取全局配置
		loadConfig() {
			API_Trade.getConfig().then(res => {
				if (res.data.success) {
					// 更新全局配置中的isFull值
					// #ifdef APP-PLUS
					this.$store.commit('updateIsFull', true);
					// #endif
					// #ifdef H5
					this.updateTabBarByIsFull(this.$store.state.isFull);
					// #endif
					// #ifdef MP-WEIXIN
					let isFull = false;
					if(res.data.result == 0){
						isFull = true
					}else if(res.data.result == 1){
						isFull = false;
					}
					this.$store.commit('updateIsFull', isFull);
					// #endif
				}
			}).catch(err => {
				console.error('获取配置失败:', err);
			});
		},
    // 根据isFull动态调整tabBar
		updateTabBarByIsFull(isFull) {
			// 只在H5下处理
			// #ifdef H5
      console.log("调整tabbar",isFull)
			// 分类index:1，购物车index:2
			if (!isFull) {
				// 隐藏分类和购物车
				uni.setTabBarItem({ index: 1 ,visible : false});
				uni.setTabBarItem({ index: 2 ,visible : false});
			}
			// #endif
		},
    // 加载用户信息
    loadUserInfo: function () {
        apiMember.getUserInfo().then((user) => {
            if (user.data.success) {
              this.userInfo = user.data.result
              this.userInfoLoaded = true;
            }
        })
    },
    // 跳转到二维码页面
    goToQRCode() {
      let token = this.$options.filters.isLogin('auth')
      if (token) {
        if (!this.userInfoLoaded){
          uni.showToast({
            title: '信息初始化中，请稍候',
            icon: 'none'
          })
          return;
        }
        // 如果是普通用户，不是服务商，则不可生成二维码
        if(this.userInfo.distributorState == 4 && this.userInfo.distributorId){
          uni.navigateTo({
            url: '/pages/profile/qrcode'
          });

        }else{
          uni.showModal({
            title: '提示',
            content: '普通用户无法生成二维码',
            showCancel: false,
            confirmText: '确定'
          });
        }
      } else {
        uni.navigateTo({
          url: '/pages/login/login'
        });
    }
  },
    loadCartList: function () {
      API_Trade.getCarts().then(res => {
        if (res.data.success) {
          let cartDetail = res.data.result;
          if (cartDetail.cartList.length > 0) {
            let arrNums = cartDetail.cartList.map(item => {
              return item.checkedSkuList.length
            })
            let shopNums = 0;
            for (let i = 0; i < arrNums.length; i++) {
              shopNums += arrNums[i]
            }
            if (shopNums) {
              uni.setTabBarBadge({
                index: 2,
                text: shopNums.toString()
              })
            } else {
              uni.removeTabBarBadge({
                index: 2
              })
            }
          }
        }
      })
    },
    // 回到顶部
    backToTop() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300 // 滚动时间，单位ms
      });
    }
  },
  onLoad: function (options) {
    const token = storage.getAccessToken()
    if (token) {
      this.loadCartList()
    }
    if (options.q) {
      let q = decodeURIComponent(options.q)
      let url = util.queryURLparams(q)
      // 接收邀请服务商扫码过来带的参数
      console.log(url,"url")
      if (url['distributorNumber'] !== undefined && url['distributorNumber'] !== "") {
        uni.setStorageSync('distributorNumber', url['distributorNumber'])
      }
    }
    if (options.distributorNumber) {
      uni.setStorageSync('distributorNumber', options.distributorNumber)
    }
  },
  onShow() {
    const token = storage.getAccessToken()
    this.loadConfig()
    if (token) {
      this.loadCartList()
      // 如果不是全屏，则加载用户信息用于查看当前用户是否是服务商
      if(!this.isFull){
        this.loadUserInfo()
      }
    } else {
      uni.removeTabBarBadge({
        index: 2,
      })
    }
  },
  onReachBottom() {
    // 给子级监听触底加载
    this.$refs.tpl.reachBottom();
  },

  onPullDownRefresh() {
    this.$refs.tpl.initData();
    // uni.stopPullDownRefresh();
  }
};
</script>

<style lang="scss" scoped>
.qrcode-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.qrcode-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40rpx;
  position: relative;
  z-index: 2;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 100rpx;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-img {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 40rpx;
  border-radius: 30rpx;
  box-shadow: 0 20rpx 40rpx rgba(0,0,0,0.2);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 2rpx solid rgba(255,255,255,0.2);
}

.welcome-text {
  font-size: 36rpx;
  color: rgba(255,255,255,0.8);
  margin-bottom: 10rpx;
  font-weight: 300;
  letter-spacing: 2rpx;
}

.app-name {
  font-size: 48rpx;
  color: #fff;
  font-weight: bold;
  text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.3);
  letter-spacing: 4rpx;
}

.button-section {
  animation: fadeInUp 1s ease-out 0.3s both;
}

.qrcode-btn {
  width: 480rpx;
  height: 110rpx;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #ce1c00 100%);
  color: #fff;
  border: none;
  border-radius: 55rpx;
  font-size: 36rpx;
  font-weight: 700;
  box-shadow: 0 20rpx 40rpx rgba(255, 107, 107, 0.4), 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  letter-spacing: 3rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.qrcode-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

.qrcode-btn:active::before {
  left: 100%;
}

.qrcode-btn:active {
  transform: translateY(4rpx) scale(0.96);
  box-shadow: 0 10rpx 20rpx rgba(255, 107, 107, 0.3), 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #ff5252 0%, #d32f2f 50%, #b71c1c 100%);
}

.btn-text {
  margin-right: 25rpx;
  letter-spacing: 3rpx;
  font-weight: 700;
}

.btn-icon {
  font-size: 36rpx;
  font-weight: bold;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0.9;
}

.qrcode-btn:active .btn-icon {
  transform: translateX(8rpx) scale(1.1);
  opacity: 1;
}

.back-to-top {
  position: fixed;
  right: 20rpx;
  bottom: 100rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  border: 1px solid #989898;
  background-color: #fff;
  ;
  display: inline-block;
  z-index: 1000;
}

.back-to-top::before {
  content: '';
  position: absolute;
  top: 57%;
  left: 50%;
  width: 20rpx;
  height: 20rpx;
  border-top: 2px solid #333;
  border-right: 2px solid #333;
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>
