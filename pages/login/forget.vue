<template>
  <view class="container">
    <view class="frm-comm">
      <view class="rs rs-line">
        <view class="lab">手机号</view>
        <view class="txt flex">
          <input class="s-text" type="tel" v-model="objData.mobile" placeholder="请输入" maxlength="11" />
        </view>
      </view>
      <view class="rs">
        <view class="lab">验证码</view>
        <view class="txt flex">
          <input class="s-code" type="text" v-model="objData.code" placeholder="请输入" />
          <view class="s-link" @tap="sendSMS">{{ btnSmsText }}</view>
        </view>
      </view>
    </view>

    <view class="lnk-common lnk-primary" @tap="handlerLink">下一步</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="FIND_USER" />

  </view>
</template>

<script>

import myVerification from '@/components/verification/verification.vue'
import { sendMobile } from "../../api/login";
import { memberResetByMobile } from "../../api/members";


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
        let res = await sendMobile(this.objData.mobile, "FIND_USER")
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
      isComplete: false,

      objData: {
        mobile: '',
        code: '',
      },

      codeFlag: true,
      flage: false,
      smsSecond: 59,
      isSmsDisable: false,			// 能否点击发送验证码
      btnSmsText: '获取验证码',
      submitting: false,
    }
  },
  methods: {
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

    // 跳转修改密码
    handlerLink: function () {
      let that = this;
      if (!this.submitting) {
        this.submitting = true;
        if (!this.objData.code || this.objData.code.length != 6) {
          this.$u.toast("请输入正确的6位数字验证码")
          this.submitting = false;
        } else {
          uni.showLoading()
          memberResetByMobile(this.objData).then(res => {
            that.submitting = false;
            uni.hideLoading();
            if (res.data.code == 200) {
              uni.redirectTo({
                url: '/pages/login/rePassword?mobile=' + this.objData.mobile
              })
            } else {
              that.$u.toast(res.data.message);
            }
          })
        }
      }

    },
  },
  onLoad: function (options) {
    if (options.mobile) {
      this.objData.mobile = options.mobile;
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
</style>
