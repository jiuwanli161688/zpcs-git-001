<template>
  <view class="container">
    <u-tabs :list="tabsList" :active-color="mainColor" @click="click" :current="current" @change="changeTab"></u-tabs>

    <!-- 手机号校验 -->
    <view class="frm-sign" v-if="current == '0'">
      <view class="frm-title">
        <view class="name">手机号校验</view>
        <view class="step">
          <view class="cur">1</view>
          <view class="sum">/4</view>
        </view>
      </view>
      <view class="rs rs-line">
        <input class="s-text" v-model="objData.mobile" type="text" placeholder="请输入中品一号水机销售(合伙人系统)手机号" />
      </view>
      <view class="rs rs-line rs-flex">
        <input class="s-code" v-model="objData.code" type="text" placeholder="请输入短信验证码" />
        <view class="s-link" @tap="sendSMS">{{ btnSmsText }}</view>
      </view>
      <view class="rs-tips">请输入中品一号水机销售(合伙人系统)手机号</view>
    </view>

    <!-- 账号密码校验 -->
    <view class="frm-sign" v-if="current == '1'">
      <view class="frm-title">
        <view class="name">账号密码校验</view>
        <view class="step">
          <view class="cur">1</view>
          <view class="sum">/4</view>
        </view>
      </view>
      <view class="rs rs-line">
        <input class="s-text" v-model="objData.mobile" type="text" placeholder="请输入中品一号水机销售(合伙人系统)手机号" />
      </view>
      <view class="rs rs-line rs-flex">
        <input class="s-code" password v-model="objData.password" type="password" placeholder="请输入密码" />
      </view>
      <view class="rs-tips">请输入中品一号水机销售(合伙人系统)账号</view>
    </view>

    <view class="lnk-common lnk-primary" @tap="submit">提交校验</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification"
      business="CHECK_ZP_LEGAL_PERSON_PHONE" />
  </view>
</template>

<script>
import storage from '@/utils/storage.js';
import { sendMobile } from "../../../api/login";
import myVerification from '@/components/verification/verification.vue'
import { bindMobile, applyDealerCheckAccount } from "../../../api/members";
import { md5 } from '@/utils/md5.js';
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
        let res = await sendMobile(this.objData.mobile, "CHECK_ZP_LEGAL_PERSON_PHONE")
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
      smsSecond: 59,
      isSmsDisable: false,			// 能否点击发送验证码
      btnSmsText: '获取验证码',
      codeFlag: true,
      flage: false,
      submitting: false,
      objData: {
        type: 'PHONE',
        mobile: '',
        code: '',
        password: ''
      },
      tabsList: [
        {
          name: '手机号校验',
        },
        {
          name: '账号密码校验',
        }
      ],
      current: 0,
      mainColor: this.$mainColor, //主色调

    }
  },
  methods: {
    /** 点击tab */
    changeTab(index) {
      this.current = index;
      if (index == 0) {
        this.objData.mobile = '';
        this.objData.code = '';
      } else {
        this.objData.mobile = '';
        this.objData.password = '';
      }
    },
    submit() {
      if (!this.submitting) {
        // 根据当前tab选择不同的校验数据
        let checkData = {};
        if (this.current == 0) {
          if (!this.objData.mobile) {
            this.$u.toast("请输入手机号");
            return;
          }
          if (!this.objData.code) {
            this.$u.toast("请输入验证码");
            return;
          }
          checkData = {
            mobile: this.objData.mobile,
            code: this.objData.code
          };
          checkData.type = 'PHONE';
        } else if (this.current == 1) {
          if (!this.objData.mobile) {
            this.$u.toast("请输入手机号");
            return;
          }
          if (!this.objData.password) {
            this.$u.toast("请输入密码");
            return;
          }
          checkData = {
            mobile: this.objData.mobile,
            password: md5(this.objData.password)
          };
          checkData.type = 'ACCOUNT';
        }
        this.submitting = true;
        uni.showLoading({ title: "处理中" })
        applyDealerCheckAccount(checkData).then(res => {
          this.submitting = false;
          uni.hideLoading();
          if (res.data.code == 200) {
            res.data.result.mobile = this.objData.mobile
            storage.setZpMemberInfo(res.data.result)
            uni.navigateTo({
              url: "/pages/apply/dealer/serviceBrief",
            });
          } else {
            this.$u.toast("校验失败 " + res.data.message);
          }
        })
      }
    },
    verification(val) {
      this.flage = val == this.$store.state.verificationKey
    },
    // 发送验证码
    sendSMS: function () {
      console.log("发送", this.isSmsDisable, this.current)
      let _this = this
      if (_this.isSmsDisable) {
        return
      }
      // 只在手机号校验模式下才能发送验证码
      if (this.current != '0') {
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

  },
  onShow: function () {

  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #FFF;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;
}

.rs-tips {
  font-size: 28rpx;
  color: #666;
  padding: 15rpx 10rpx;
  margin: 20rpx 0;
  border-left: 4rpx solid #E22221;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}
</style>
