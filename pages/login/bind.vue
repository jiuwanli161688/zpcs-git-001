<template>
  <view class="container">
    <u-navbar :background="navObj" :title-color="titleColor" :is-back="false" title="绑定手机"></u-navbar>
    <view class="frm-comm">
      <!-- 注意：如果初始未绑定手机号，不显示原手机号 -->
      <view class="rs rs-line">
        <view class="lab">手机号</view>
        <view class="txt flex">
          <input class="s-text" type="tel" v-model="objData.mobile" placeholder="请输入" maxlength="11" />
        </view>
      </view>
      <view class="rs rs-line">
        <view class="lab">验证码</view>
        <view class="txt flex">
          <input class="s-code" type="text" v-model="objData.code" placeholder="请输入" />
          <view class="s-link" @tap="sendSMS">{{ btnSmsText }}</view>
        </view>
      </view>
      <view class="rs">
        <view class="lab">服务商编码</view>
        <view class="txt flex">
          <input class="s-text" type="text" v-model="objData.distributorNumber" placeholder="请输入分平台服务商编码" />
        </view>
      </view>
    </view>
    <view class="tips-notice">
      <image :src="iconTips" mode="aspectFit" class="icon"></image>
      <view class="text">请输入要绑定的服务商编号，不填则默认绑定平台</view>
    </view>
    <view class="lnk-common lnk-primary" @tap="submit">提交</view>
    <view class="lnk-common lnk-secondary" @tap="quit">安全退出</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="BIND_MOBILE" />
  </view>
</template>

<script>

import storage from '@/utils/storage.js';
import { sendMobile } from "@/api/login";
import myVerification from '@/components/verification/verification.vue'
import { getUserInfo, bindMobile } from "@/api/members"; //验证码模块
import { md5 } from '@/utils/md5.js'
import { quiteLoginOut } from "@/utils/filters";
export default {
  name: '',
  components: {
    myVerification
  },
  watch: {
    async flage(val) {
      if (val) {
        // 向后端请求验证码
        uni.showLoading({ title: "正在发送验证码" })
        this.submitting = true;
        let res = await sendMobile(this.objData.mobile, "BIND_MOBILE")
        this.submitting = false;
        if (this.$store.state.isShowToast) {
          uni.hideLoading()
        }
        if (res.data.success) {
          this.btnSmsText = '60s后获取'
          this.isSmsDisable = true // 开始时禁用按钮
          let s = 60 // 倒计时秒数，根据需要调整
          let counter = setInterval(() => {
            s -= 1 // 先减少秒数
            if (s === 0) {
              this.btnSmsText = '重新获取' // 倒计时结束，更新按钮文案
              this.isSmsDisable = false // 启用按钮
              this.codeFlag = true // 组件制成true，重新渲染下组件
              clearInterval(counter) // 清除计时器
            } else {
              this.btnSmsText = `${s}s后获取` // 更新按钮文案显示剩余秒数
            }
          }, 1000)
          this.flage = false
          this.codeFlag = false
        } else {
          uni.showToast({
            title: res.data.message,
            duration: 2000,
            icon: 'none'
          })
          this.flage = false
          // 请求失败后也重置滑块验证
          this.$refs.verification.getCode()
          // 重置倒计时逻辑，允许用户重新尝试
          this.isSmsDisable = false
          this.btnSmsText = '获取验证码'
        }
      } else {
        this.$refs.verification.hide()
      }
    }
  },
  data() {
    return {
      navObj: {
        background: '#e22221'
      },
      titleColor: '#fff',
      isComplete: false,
      objData: {
        mobile: '',
        code: '',
        distributorNumber: '', // 分平台服务商编号

      },
      codeFlag: true,
      flage: false,
      smsSecond: 59,
      isSmsDisable: false,			// 能否点击发送验证码
      btnSmsText: '获取验证码',
      submitting: false,
      iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,

    }
  },
  methods: {
    quit: function () {
      quiteLoginOut();
    },
    submit() {
      if (!this.submitting) {
        if (!this.objData.mobile) {
          return this.$u.toast("请输入手机号")
        }
        if (!this.objData.code) {
          return this.$u.toast("请输入验证码")
        }
        // if (!this.objData.distributorNumber) {
        //   return this.$u.toast("请输入服务商编码")
        // }
        if (this.objData.distributorNumber && this.objData.distributorNumber != 1 && this.objData.distributorNumber.length != 7) {
          return this.$u.toast("服务商编码格式不正确")
        }
        let params = {
          mobile: this.objData.mobile,
          code: this.objData.code,
          distributorNumber: this.objData.distributorNumber,
        }
        this.submitting = true;
        uni.showLoading({ title: "处理中" })
        bindMobile(params).then(res => {
          this.submitting = false;
          uni.hideLoading();
          if (res.data.code == 200) {
            storage.setAccessToken(res.data.result.accessToken)
            storage.setRefreshToken(res.data.result.refreshToken)
            if (uni.getStorageSync('distributorNumber')) {
              uni.removeStorageSync('distributorNumber')
            }
            getUserInfo().then((user) => {
              if (user.data.success) {
                /**
                 * 个人信息存储到缓存userInfo中
                 */
                storage.setUserInfo(user.data.result)
                storage.setHasLogin(true)
                storage.setAutoCp(0)
                // 登录成功
                this.$u.toast("绑定成功");
                // if(user.data.result != '' && user.data.result != null && user.data.result.bindDistributorId == null) {
                //   uni.redirectTo({
                //     url: "/pages/login/shop",
                //   })
                // }else{
                uni.reLaunch({
                  url: "/pages/tabbar/user/profile",
                });
                // }
              } else {
                uni.reLaunch({
                  url: '/pages/tabbar/home/index'
                })
              }
            })

          } else {
            this.$u.toast("变更失败" + res.data.message);
          }
        })
      }
    },
    verification(val) {
      this.flage = val == this.$store.state.verificationKey

    },
    // 发送验证码
    sendSMS: function () {
      let _this = this
      if (_this.isSmsDisable) {
        return
      }
      if (this.$u.test.mobile(this.objData.mobile)) {
        //滑块验证
        if (!this.flage) {
          this.$refs.verification.error() //发送
          return false
        }
      } else {
        this.$u.toast("请输入正确的手机号码")
      }

    },
  },
  onLoad: function () {
    // 如果有服务商编号，说明当前用户是被邀请过来的，给接口传参
    if (uni.getStorageSync('distributorNumber')) {
      this.objData.distributorNumber = uni.getStorageSync('distributorNumber')
    }
  },
  onShow: function () {

  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #F1F1F1;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;
}

.tips-notice {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 48rpx;
  box-sizing: content-box;

  .icon {
    width: 32rpx;
    height: 32rpx;
    margin: 4rpx 12rpx 0 0;
  }

  .text {
    font-size: 24rpx;
    color: #888;
    line-height: 40rpx;
  }
}</style>
