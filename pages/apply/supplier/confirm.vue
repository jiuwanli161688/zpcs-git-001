<template>
	<view class="container">
		<view class="frm-sign">
			<view class="frm-title">
				<view class="name">法人授权</view>
			</view>
			<view class="rs-flex rs-line">
				<view class="s-lab">法人手机号</view>
				<view class="s-txt">{{objData.legalPhone}}</view>
			</view>
			<view class="rs-flex rs-line">
				<input class="s-text" v-model="objData.code" type="text" placeholder="请输入验证码" />
        <view class="s-link" @tap="sendSMS">{{btnSmsText}}</view>
			</view>
			<view class="frm-touse">
				<image :src="iconTips" mode="aspectFit" class="icon"></image>
				<view class="text">验证码发送至法人手机，录入验证即表示同意授权使用公章</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="handlerNext">下一步</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="APPLY_SUPPLIER" />
  </view>
</template>

<script>
  import storage from '@/utils/storage.js';
  import {sendMobile} from "../../../api/login";
  import myVerification from '@/components/verification/verification.vue'
  import {applySupplierFirstEcho, applySupplierThirdCheck} from "../../../api/store";
  import {getZpMemberInfo} from "../../../api/members";

  export default{
		name: '',
		components: {
      myVerification
		},
    watch: {
      async flage(val) {
        if (val) {
          // 向后端请求验证码
          uni.showLoading({title:"正在发送验证码"})
          this.submitting=true;
          let res = await sendMobile(this.objData.legalPhone,"APPLY_SUPPLIER")
          this.submitting=false;
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
		data(){
			return {
				isComplete: false,
				iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
        objData:{
          legalPhone:"加载中",
          code:""
        },
        smsSecond: 59,
        isSmsDisable: false,			// 能否点击发送验证码
        btnSmsText: '获取验证码',
        codeFlag:true,
        flage: false,
        submitting:false,
        source:""
			}
		},
		methods: {
			// 跳转企业签章
			handlerNext: function(){
        if (!this.submitting){
          this.submitting=true;
          uni.showLoading({title:"处理中"})
          applySupplierThirdCheck(this.objData).then(res=>{
            this.submitting=false;
            uni.hideLoading();
            if (res.data.code==200){
              storage.setZpMemberInfo(res.data.result)
              uni.navigateTo({
                url: "/pages/apply/supplier/signature?source="+this.source,
              });
            }else{
              this.$u.toast("校验失败 "+res.data.message);
            }
          })
        }
			},
      verification(val) {
        this.flage = val == this.$store.state.verificationKey
      },
      // 发送验证码
      sendSMS: function(){
        let _this = this
        if(_this.isSmsDisable){
          return
        }
        if (this.$u.test.mobile(this.objData.legalPhone)){
          //滑块验证
          if (!this.flage) {
            this.$refs.verification.error() //发送
            return false
          }
        }else{
          this.$u.toast("请输入正确的手机号码")
        }
      },
		},
		onLoad: function(options){
      this.source=options.source;
      applySupplierFirstEcho().then(res=>{
        if (res.data.code==200){
          this.objData.legalPhone=res.data.result.legalPhone;
        }else{
          this.$u.toast(res.data.message);
        }
      })
		},
		onShow: function(){

		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 20rpx;
}
</style>
