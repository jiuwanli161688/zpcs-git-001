<template>
	<view>
		<view class="container u-skeleton">
			<!-- 用户信息区域 -->
			<view class="box-base" v-if="!loading">
				<image class="ico" :src="userAvatar" mode="aspectFill"></image>
				<view class="inf">
					<view class="name">{{objUserInfo.nickName}}</view>
					<view class="grade">
						<image class="icon" :src="userGrade.gradeIcon" mode="aspectFit"></image>
						<view class="text">{{userGrade.gradeText}}</view>
					</view>
				</view>
			</view>

			<!-- 骨架屏用户信息区域 -->
			<view class="box-base" v-if="loading">
				<view class="ico u-skeleton-circle"></view>
				<view class="inf">
					<view class="name u-skeleton-name u-skeleton-rect"></view>
					<view class="grade u-skeleton-grade u-skeleton-fillet"></view>
				</view>
			</view>

			<!-- 服务商信息区域 -->
			<view class="distributor-info" v-if="!loading && objUserInfo.distributorNumber">
				<view class="distributor-number">
					<text class="label">我的服务商编号：</text>
					<text class="number">{{objUserInfo.distributorNumber}}</text>
				</view>
			</view>

			<!-- 骨架屏服务商信息区域 -->
			<view class="distributor-info" v-if="loading">
				<view class="distributor-number u-skeleton-number u-skeleton-fillet"></view>
			</view>

			<!-- 提示文字 -->
			<view class="tip" v-if="!loading">{{ tip }}</view>
			<view class="tip u-skeleton-rect" v-if="loading"></view>

			<!-- 二维码区域 -->
			<view class="uqrcode" v-if="!loading && qrCodeSrcs">
				<uqrcode
					style="position: absolute;top: 30%;left: 18%;text-align: center;"
					ref="uqrcode"
					canvas-id="qrcode"
					:value="qrCodeSrcs"
					size="500"
					sizeUnit="rpx"
					:options="qrCodeOptions"
					:start="false"
				>
				<template v-slot:loading>
					<u-loading mode="flower" size="40"></u-loading>
				</template>
				</uqrcode>
			</view>

			<!-- 骨架屏二维码区域 -->
			<view class="uqrcode u-skeleton-uqrcode u-skeleton-fillet" v-if="loading"></view>
		</view>

		<!-- 骨架屏组件 -->
		<u-skeleton :loading="loading" :animation="true" bgColor="#F1F1F1"></u-skeleton>
	</view>
</template>

<script>

import {getUserInfo} from "../../api/members";
  import storage from '@/utils/storage.js'
  export default{
		name: '',
		components: {
		},
		data(){
			return {
        qrCodeSrc:"data:image/png;base64,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",
        qrCodeSrcs: '',
        qrCodeOptions: {
          margin: 10,
          foregroundImageSrc: `${this.iconCommon}/static/login/login-logo.png`,
          foregroundImagePadding: 4,
          foregroundImageBorderRadius: 8,
          foregroundImageShadowOffsetX: 0,
          foregroundImageShadowOffsetY: 2,
          foregroundImageShadowBlur: 10,
          foregroundImageShadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        tip:'',
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
				loading: true,
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
	  // 用户等级处理
	  userGrade() {
			if(this.objUserInfo.type){
				if(this.objUserInfo.type == '1'){
					return {
						gradeText: '中品维度用户',
						gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
					}
				}
				if(this.objUserInfo.type == '2'){
					if (this.objUserInfo.zpyhUserType == 1) {
						return {
							gradeText: '中品C类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.objUserInfo.zpyhUserType == 2) {
						return {
							gradeText: '中品B类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.objUserInfo.zpyhUserType == 3) {
						return {
							gradeText: '中品A类服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else if (this.objUserInfo.zpyhUserType == 4) {
						return {
						gradeText: '中品A+类服务商',
						gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					} else {
						return {
							gradeText: '分平台服务商',
							gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
						}
					}
				}
				if(this.objUserInfo.type == '3'){
					return {
						gradeText: '中品供应商',
						gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
					}
				}
			}else{
				return {
					gradeText: '中品维度用户',
					gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
				}
			}
		}
    },
		methods: {

			// 加载用户信息
			loadUserInfo: function(){
        if (this.isLogin) {
          getUserInfo().then((user) => {
            if (user.data.success) {
              /**
               * 个人信息存储到缓存userInfo中
               */
              storage.setUserInfo(user.data.result)
              storage.setHasLogin(true)
              storage.setAutoCp(0)
              this.objUserInfo = user.data.result || {}
              let distributorNumber = this.objUserInfo.bindDistributorNumber
              if (!distributorNumber || this.objUserInfo.distributorState != 4){
                // 用户信息加载完成，但无法生成二维码
                this.loading = false
                uni.showModal({
                  title: '提示',
                  content: '普通用户无法生成二维码',
                  showCancel: false,
                  confirmText: '确定'
                });
                return;
              }
              // #ifndef MP-WEIXIN
              this.tip="扫码下载中品维度商城APP"
              this.qrCodeSrcs = "http://app.zpyhsc.com/xztz/popularize.html"
              // #endif
              // #ifdef MP-WEIXIN
              //   this.qrCodeSrcs = "http://app.zpyhsc.com/xztz/toMpIndex.html?distributorNumber=" + distributorNumber
              this.qrCodeSrcs = 'https://mobile.zpwdsc.com/wechat/inviteService?distributorNumber=' + distributorNumber
              this.tip="扫码注册，绑定我的分平台服务商"
              // #endif
              // #ifdef H5
              // this.qrCodeSrcs = 'http://192.168.1.110:8080?distributorNumber=' + distributorNumber
              this.qrCodeSrcs = 'https://regh5.zpwdsc.com?distributorNumber=' + distributorNumber
              this.tip="扫码注册，绑定我的分平台服务商"
              // #endif
			  // #ifdef APP-PLUS
				// this.qrCodeSrcs = 'http://192.168.0.127:5500/pages/help/inviteDownApp.html?distributorNumber=' + distributorNumber
				this.qrCodeSrcs = 'https://mobile.zpwdsc.com/inviteDownApp.html?distributorNumber=' + distributorNumber
				this.tip="扫码下载中品维度商城APP，绑定我的分平台服务商"
				// #endif
				// 用户信息加载完成，显示用户信息
				this.loading = false
				// 生成二维码
				this.$nextTick(() => {
					if (this.$refs.uqrcode) {
						this.$refs.uqrcode.make({
							success: () => {
								console.log('生成成功')
							},
							fail: (err) => {
								console.log(err)
							}
						})
					}
				})

            } else {
              // 跳转登录
              this.loading = false
              uni.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
          // this.objUserInfo = this.$options.filters.isLogin();
        } else {
          // 跳转登录
          this.loading = false
          uni.redirectTo({
            url: '/pages/login/login'
          })
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
	.distributor-info{
		position: relative;
		z-index: 1;
		padding: 0 20rpx 20rpx;
		.distributor-number{
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.9);
			border-radius: 24rpx;
			padding: 16rpx 24rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.3);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
			.label{
				color: #666;
				font-size: 24rpx;
				margin-right: 12rpx;
				font-weight: 500;
			}
			.number{
				color: #E22221;
				font-size: 28rpx;
				font-weight: 700;
				letter-spacing: 2rpx;
				text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.1);
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

  .uqrcode {
    margin: 0 auto;
  }
  .tip{
    display: none;
  }

  /* 骨架屏样式调整 */
  .u-skeleton-rect {
    height: 40rpx;
    margin: 10rpx 0;
  }

  .u-skeleton-circle {
    width: 120rpx;
    height: 120rpx;
  }

  .u-skeleton-fillet {
    height: 40rpx;
    margin: 10rpx 0;
  }

  /* 二维码骨架屏样式 */
  .u-skeleton-uqrcode {
    width: 500rpx;
    height: 500rpx;
    margin: 200rpx auto;
    border-radius: 20rpx;
    background: #FFF;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }
  .u-skeleton-name{
	width: 200rpx;
  }
  .u-skeleton-grade{
	width: 260rpx;
  }
  .u-skeleton-number{
	height: 60rpx;
  }
}
</style>
