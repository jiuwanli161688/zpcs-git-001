<template>
  <view class="container">
    <view class="frm-comm">
      <!-- 注意：如果初始未绑定手机号，不显示原手机号 -->
      <view class="rs rs-line">
        <view class="lab">绑定手机号</view>
        <view class="txt txt-r">{{ userInfo.mobile }}</view>
      </view>
      <view class="rs">
        <view class="lab">验证码</view>
        <view class="txt flex">
          <input class="s-code" type="text" v-model="objData.code" placeholder="请输入" />
          <view class="s-link" @tap="sendSMS">{{ btnSmsText }}</view>
        </view>
      </view>
    </view>
    <view style="color: red">为保护您的财产安全，请输入短信验证码以确认操作</view>


    <view class="lnk-common lnk-primary" @tap="submit">确认注销</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="CANCEL" />

    <view style="color: gray">
      <br />
      您正在申请注销中品维度商城账号，请您阅读并知悉如下内容：
      <br />
      <br />
      一、当前操作不是退出登录，而是注销账号，若错误操作，请返回；
      <br />
      <br />
      二、注销后，您当前账号关联的所有内容将被全部删除，包括但不限于您的账户余额、用户权益、个人信息、购物历史等，由此造成的损失由您个人负责；
      <br />
      <br />
      三、注销操作一经发生不可恢复，请您谨慎确认；
    </view>
  </view>
</template>

<script>

import storage from '@/utils/storage.js';
import { sendMobile, userCancellation } from "../../../api/login";
import myVerification from '@/components/verification/verification.vue'
import { bindMobile } from "../../../api/members";
import { navigateToLogin } from "../../../utils/filters"; //验证码模块
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
        let res = await sendMobile(this.userInfo.mobile, "CANCEL")
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
      userInfo: storage.getUserInfo(),
      objData: {
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
    submit() {
      if (!this.submitting) {
        this.submitting = true;
        uni.showLoading({ title: "处理中" })
        userCancellation({ code: this.objData.code }).then(res => {
          this.submitting = false;
          uni.hideLoading();
          if (res.data.code == 200) {
            uni.showModal({
              content: "注销成功，期待再次与你相遇中品。",
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  storage.setAccessToken("");
                  storage.setRefreshToken("");
                  storage.setUserInfo({});
                  navigateToLogin("redirectTo");
                  uni.reLaunch({
                    url: "/pages/login/login",
                  });
                }

              },
            })
          } else {
            this.$u.toast("注销失败 " + res.data.message);
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
      if (this.$u.test.mobile(this.userInfo.mobile)) {
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
