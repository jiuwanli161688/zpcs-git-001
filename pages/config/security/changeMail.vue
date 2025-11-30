<template>
  <view class="container">
    <view class="frm-comm">
      <!-- 注意：如果初始未绑定手机号，不显示原手机号 -->
      <view class="rs rs-line">
        <view class="lab">原绑定信箱</view>
        <view class="txt txt-r">{{ userInfo.mailBox ? userInfo.mailBox : '暂未绑定信箱' }}</view>
      </view>
      <view class="rs rs-line">
        <view class="lab">新绑定信箱</view>
        <view class="txt flex">
          <input class="s-text" v-model="form.mailBox" type="text" placeholder="请输入" />
        </view>
      </view>
      <view class="rs">
        <view class="lab">验证码</view>
        <view class="txt flex">
          <input class="s-code" v-model="form.code" type="text" placeholder="请输入" />
          <view class="s-link" @tap="sendMailCode">{{ btnSmsText }}</view>
        </view>
      </view>
    </view>

    <view class="lnk-common lnk-primary" @tap="submit">提交</view>

    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="BIND_MAIL" />


  </view>
</template>

<script>
import storage from '@/utils/storage.js';

import myVerification from '@/components/verification/verification.vue'
import { sendMailCode, sendMobile } from "../../../api/login";
import { bindMailBox } from "../../../api/members";

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
        let res = await sendMailCode(this.form.mailBox, "BIND_MAIL")
        this.submitting = false;
        if (this.$store.state.isShowToast) {
          uni.hideLoading()
        }
        if (res.data.success) {
          this.btnSmsText = '60s后获取'
          this.isMailCodeDisable = true // 开始时禁用按钮
          let s = 60 // 倒计时秒数，根据需要调整
          let counter = setInterval(() => {
            s -= 1 // 先减少秒数
            if (s === 0) {
              this.btnSmsText = '重新获取' // 倒计时结束，更新按钮文案
              this.isMailCodeDisable = false // 启用按钮
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
          this.isMailCodeDisable = false
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
      userInfo: storage.getUserInfo(),
      smsSecond: 59,
      isMailCodeDisable: false,			// 能否点击邮件验证码
      btnSmsText: '获取验证码',
      form: {},
      codeFlag: true,
      flage: false,
      submitting: false
    }
  },
  methods: {
    submit() {
      if (!this.submitting) {
        this.submitting = true;
        bindMailBox(this.form).then(res => {
          this.submitting = false;
          if (res.data.code == 200) {
            let userInfo = this.userInfo;
            userInfo.mailBox = this.form.mailBox;
            storage.setUserInfo(userInfo);
            uni.showModal({
              title: "成功绑定邮箱" + this.form.mailBox,
              showCancel: false,
              success: () => {
                uni.redirectTo({
                  url: "/pages/config/security/home",
                });
              },
            })
          } else {
            this.$u.toast("变更邮箱失败 " + res.data.message);
          }
        })
      }
    },

    verification(val) {
      this.flage = val == this.$store.state.verificationKey
    },

    // 发送邮件验证码
    sendMailCode: function () {
      let _this = this
      if (_this.isMailCodeDisable) {
        return
      }
      if (this.$u.test.email(this.form.mailBox)) {
        //滑块验证
        if (!this.flage) {
          this.$refs.verification.error() //发送
          return false
        }
      } else {
        this.$u.toast("请输入正确的邮箱")
      }
    },
  },
  onLoad: function () {

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
