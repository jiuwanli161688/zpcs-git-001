<template>
	<view class="container">
		<view class="box-base" v-if="isComplete">
			<image class="ico" :src="userAvatar" mode="aspectFill"></image>
			<view class="inf">
				<view class="name">{{objUserInfo.nickName}}</view>
				<view class="grade">
					<image class="icon" :src="objUserInfo.gradeIcon" mode="aspectFit"></image>
					<view class="text">{{objUserInfo.gradeText}}</view>
				</view>
			</view>
		</view>
		<view class="frm-bind">
			<u-tabs :list="tabsList" :active-color="mainColor" @click="click" :current="current" @change="changeTab"></u-tabs>
			<!-- 手机号验证码 -->
			<template v-if="isComplete&&current==0">
				<view class="rs">
					<image class="icon" :src="iconTel" mode="aspectFit"></image>
					<input class="text" v-model="objData.mobile" type="text" placeholder="请输入中品一号水机销售(合伙人系统)手机号" />
				</view>
				<view class="rs">
					<image class="icon" :src="iconSms" mode="aspectFit"></image>
					<input class="code" v-model="objData.code" type="text" placeholder="请输入验证码" />
					<view class="link" @tap="sendSMS">{{btnSmsText}}</view>
				</view>
			</template>
			<!-- 账号密码 -->
			<template v-if="current == '1'">
				<view class="rs">
					<image class="icon" :src="iconTel" mode="aspectFit"></image>
					<input class="text" v-model="objData.mobile" type="text" placeholder="请输入中品一号水机销售(合伙人系统)手机号" />
				</view>
				<view class="rs">
					<image class="icon" :src="iconSms" mode="aspectFit"></image>
					<input class="text" password v-model="objData.password" type="password" placeholder="请输入密码" />
				</view>
			</template>
		</view>

		<view class="lnk-bind" @tap="submit">立即绑定</view>
    <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="BIND_ZPMEMBER" />


	</view>
</template>

<script>

import { bindUpdateByType, getUserInfo} from "../../api/members";
  import storage from '@/utils/storage.js' //缓存
  import myVerification from '@/components/verification/verification.vue'
import {sendMobile} from "../../api/login";
import { md5 } from '@/utils/md5.js';

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
          let res = await sendMobile(this.objData.mobile,"BIND_ZPMEMBER")
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
				iconTel: `${this.iconCommon}/static/v1/profile/icon-tel.png`,
				iconSms: `${this.iconCommon}/static/v1/profile/icon-sms.png`,
				// 消费者
				iconGrade1: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
				// 分平台服务商
				iconGrade2: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
				// 供应商
				iconGrade3: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
        		isLogin: false,
				objUserInfo: {
					icon: `${this.iconCommon}/static/v1/profile/avatar.png`,								// 默认头像
					nickname: '',						// 用户昵称
					grade: 0,								// 用户类型
					gradeIcon: '',					// 用户类型图标
					gradeText: '',					// 用户类型文本
				},
				objData:{
					type: 'PHONE',
					mobile: '',
					code: '',
					password: ''
				},
				codeFlag:true,
				flage: false,
				smsSecond: 59,
				isSmsDisable: false,			// 能否点击发送验证码
				btnSmsText: '获取验证码',
        		submitting:false,
				tabsList: [
					{
					name: '手机号',
					},
					{
					name: '账号密码',
					}
				],
				current: 0,
				mainColor: this.$mainColor, //主色调
			}
		},
    computed:{
      userAvatar() {
        // 检查用户头像是否存在
        if (this.objUserInfo.face) {
          return this.objUserInfo.face
        } else {
          // 返回默认头像路径
          return `${this.iconCommon}/static/v1/profile/avatar.png`
        }
      },
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
      submit(){
		// 根据当前tab选择不同的校验数据
        let checkData = {};
		if (!this.objData.mobile) {
            this.$u.toast("请输入中品一号水机销售(合伙人系统)手机号");
            return;
          }
		  if (!this.$u.test.mobile(this.objData.mobile)){
            this.$u.toast("请输入正确的手机号码")
            return false
          }
        if (this.current == 0) {
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
        if (!this.submitting){
          this.submitting=true;
          uni.showLoading({title:"处理中"})
          bindUpdateByType(checkData).then(res=>{
            this.submitting=false;
            uni.hideLoading();
            if (res.data.code==200){
              uni.showModal({
                content: "绑定成功！",
                showCancel: false,
                success: () => {
                  uni.reLaunch({
                    url: "/pages/tabbar/user/profile",
                  });
                },
              })
            }else{
              this.$u.toast("绑定失败 "+res.data.message);
            }
          })
        }
      },
      verification(val) {
        this.flage = val == this.$store.state.verificationKey
      },
      // 用户等级处理
      gradeDispose() {
        switch (this.objUserInfo.type) {
          case '1':
            this.objUserInfo.gradeText = '消费者'
            this.objUserInfo.gradeIcon = `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
            break
          case '2':
            this.objUserInfo.gradeText = '分平台服务商'
            this.objUserInfo.gradeIcon = `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
            break
          case '3':
            this.objUserInfo.gradeText = '供应商'
            this.objUserInfo.gradeIcon = `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
            break
          default:
            break
        }
      },
			// 加载用户信息
			loadUserInfo: function(){
				this.isComplete = true
        if (this.isLogin) {
          getUserInfo().then((user) => {
            if (user.data.success) {
              /**
               * 个人信息存储到缓存userInfo中
               */
              storage.setUserInfo(user.data.result)
              storage.setHasLogin(true)
              storage.setAutoCp(0)
              this.objUserInfo = user.data.result
              this.gradeDispose()
            } else {
              // 跳转登录
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
          // this.objUserInfo = this.$options.filters.isLogin();
        } else {
          // 跳转登录
          uni.redirectTo({
            url: '/pages/login/login'
          })
        }
			},

			// 发送验证码
			sendSMS: function(){
        let _this = this
        if(_this.isSmsDisable){
          return
        }
        if (this.$u.test.mobile(this.objData.mobile)){
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
		onLoad: function(){

		},
		onShow: function(){
      this.isLogin = this.$options.filters.isLogin('auth')
      // 加载用户信息
      this.loadUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	position: relative;
	&::before{
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		top: 0;
		height: 280rpx;
		background: #E22221;
	}
	.box-base{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		z-index: 1;
		padding: 30rpx 20rpx;
		.ico{
			width: 120rpx;
			height: 120rpx;
		}
		.inf{
			padding: 0 0 0 20rpx;
			.name{
				font-size: 30rpx;
				font-weight: 600;
				line-height: 60rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #FFF;
			}
			.grade{
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 48rpx;
				line-height: 48rpx;
				padding: 0 20rpx 0 12rpx;
				.icon{
					width: 48rpx;
					height: 48rpx;
				}
				.text{
					color: #FFF;
					font-size: 24rpx;
				}
			}
		}
	}
	.frm-bind{
		background: #FFF;
		position: relative;
		margin: 0 20rpx;
		border-radius: 12rpx;
		padding: 20rpx 0 30rpx;
		.rs{
			padding: 0 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			position: relative;
			&::after{
				position: absolute;
				content: '';
				left: 20rpx;
				right: 20rpx;
				bottom: 0;
				height: 3rpx;
				background: #EBEDF0;
			}
			.icon{
				width: 36rpx;
				height: 36rpx;
			}
			.text{
				width: calc(100vw - 40rpx - 40rpx - 36rpx);
				font-size: 28rpx;
				height: 72rpx;
				line-height: 72rpx;
				color: #323232;
				box-sizing: border-box;
				padding: 0 20rpx;
			}
			.code{
				width: calc(100vw - 40rpx - 40rpx - 160rpx);
				font-size: 28rpx;
				height: 72rpx;
				line-height: 72rpx;
				color: #323232;
				box-sizing: border-box;
				padding: 0 20rpx;
			}
			.link{
				width: 160rpx;
				height: 64rpx;
				line-height: 64rpx;
				background: #E22221;
				text-align: center;
				font-size: 26rpx;
				color: #FFF;
				border-radius: 4rpx;
			}
		}
	}
	.lnk-bind{
		margin: 24rpx 20rpx 0;
		border-radius: 12rpx;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		font-size: 28rpx;
		background: #E22221;
		border: 3rpx solid #E22221;
		color: #FFF;
	}

}
</style>
