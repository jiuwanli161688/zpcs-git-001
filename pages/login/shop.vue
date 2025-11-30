<template>
	<view class="container">
		<view class="loading-container" v-if="loading">
			<view class="loading-wrapper">
				<view class="logo-container">
					<image :src="iconLogo" class="logo-image" mode="aspectFit"></image>
					<view class="pulse-ring"></view>
					<view class="pulse-ring delay-1"></view>
					<view class="pulse-ring delay-2"></view>
				</view>
				<view class="loading-text">
					<text class="text-main">正在加载</text>
					<view class="dots">
						<text class="dot" :class="{ 'active': dotIndex >= 1 }">.</text>
						<text class="dot" :class="{ 'active': dotIndex >= 2 }">.</text>
						<text class="dot" :class="{ 'active': dotIndex >= 3 }">.</text>
					</view>
				</view>
			</view>
		</view>
		<view class="main" v-else>
			<view class="logo">
				<image :src="iconLogo" class="icon" mode="aspectFit"></image>
			</view>

			<view class="bin-dealer">
				<view class="hd">请输入分平台服务商编号</view>
				<view class="bd">
					<input class="text" v-model="curStoreDistributorNumber" type="text" placeholder="请输入分平台服务商编码" />
					<image class="icon" :src="iconScan" mode="aspectFit"></image>
				</view>
			</view>
			<view class="tips-notice">
				<image :src="iconTips" mode="aspectFit" class="icon"></image>
				<view class="text">请输入要绑定的服务商编号，不填则默认绑定平台</view>
			</view>
			<view class="lnk-common lnk-primary" @tap="handlerBind">立即绑定</view>
			<!-- <view class="lnk-common lnk-secondary" @tap="handlerNear">绑定我附近的中品店</view> -->

		</view>

	</view>
</template>

<script>
  import {distributorBind} from "@/api/login";

	export default{
		name: '',
		components: {

		},
		data(){
			return {

				isComplete: false,
				iconLogo: `${this.iconCommon}/static/v1/s-logo.jpg`,
				iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
				iconScan: `${this.iconCommon}/static/v1/login/icon-scan.png`,
        		curStoreDistributorNumber: '',
				dotIndex: 0,
				dotTimer: null,
			}
		},
		computed: {
			loading: function(){
				return this.$store.state.xInstallLoading
			}
		},
		methods: {

			// 执行绑定返回我的
			handlerBind: function(){
        // if(!this.curStoreDistributorNumber) {
        //   this.$u.toast('请输入分平台服务商编码')
        //   return
        // }
		if(this.curStoreDistributorNumber&&this.curStoreDistributorNumber!=1&&this.curStoreDistributorNumber.length!=7){
			return this.$u.toast("服务商编码格式不正确")
		}
        distributorBind({distributorNumber: this.curStoreDistributorNumber}).then(res => {
          let data = res.data
          if(data.code == 200 && data.success) {
            this.$u.toast('绑定成功');
			// if(uni.getStorageSync('distributorNumber')){
            //     uni.removeStorageSync('distributorNumber')
            //   }
			setTimeout(() => {
				uni.reLaunch({
					url: '/pages/tabbar/user/profile'
				})
			},1500)
          } else {
            this.$u.toast(data.message)
          }
        })
			},

			// 跳转附近分平台服务商
			handlerNear: function(){
				uni.navigateTo({
					url: '/pages/login/near'
				})
			},

			// 开始loading动画
			startLoadingAnimation() {
				this.dotTimer = setInterval(() => {
					this.dotIndex = (this.dotIndex + 1) % 4;
				}, 500);
			},

			// 停止loading动画
			stopLoadingAnimation() {
				if (this.dotTimer) {
					clearInterval(this.dotTimer);
					this.dotTimer = null;
				}
			}
		},
		onLoad: function(){
			if(uni.getStorageSync('distributorNumber')){
				// 如果本地有绑定分平台服务商编码，则给loading赋值false
				// #ifdef APP-PLUS
				this.$store.commit('setXInstallLoading', false)
				// #endif
				this.curStoreDistributorNumber = uni.getStorageSync('distributorNumber')
				this.handlerBind()
			}

		},
		onShow: function(){

		},
		watch: {
			loading(newVal) {
				if (newVal) {
					this.startLoadingAnimation();
				} else {
					this.stopLoadingAnimation();
				}
			}
		},
		beforeDestroy() {
			this.stopLoadingAnimation();
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding-top: 0;
	padding-left: 20rpx;
	padding-right: 20rpx;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	.loading-container{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
		background: linear-gradient(135deg, #F1F1F1 0%, #E8E8E8 100%);
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: -50%;
			left: -50%;
			width: 200%;
			height: 200%;
			background: radial-gradient(circle, rgba(226, 34, 33, 0.05) 0%, transparent 70%);
			animation: rotate 20s linear infinite;
		}

		.loading-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			z-index: 1;
			position: relative;
			width: 100%;
			max-width: 600rpx;
		}

		.logo-container {
			position: relative;
			width: 160rpx;
			height: 160rpx;
			margin-bottom: 60rpx;
		}

		.logo-image {
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
			box-shadow: 0 8rpx 32rpx rgba(226, 34, 33, 0.2);
			animation: logoFloat 3s ease-in-out infinite;
		}

		.pulse-ring {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 160rpx;
			height: 160rpx;
			border: 4rpx solid rgba(226, 34, 33, 0.3);
			border-radius: 50%;
			animation: pulse 2s ease-out infinite;

			&.delay-1 {
				animation-delay: 0.5s;
			}

			&.delay-2 {
				animation-delay: 1s;
			}
		}

		.loading-text {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			color: #333;
			font-weight: 500;
			width: 100%;
			text-align: center;

			.text-main {
				margin-right: 8rpx;
			}

			.dots {
				display: flex;
				align-items: center;
			}

			.dot {
				font-size: 44rpx;
				color: #ccc;
				transition: color 0.3s ease;
				margin-left: 4rpx;

				&.active {
					color: #e22221;
					animation: dotPulse 0.5s ease;
				}
			}
		}
	}

	.main{
		width: calc(100vw - 40rpx);
		.logo{
			height: 320rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			.icon{
				width: 180rpx;
				height: 180rpx;
			}
		}
		.bin-dealer{
			background: #FFF;
			border-radius: 12rpx;
			margin: 0 0 24rpx;
			.hd{
				height: 88rpx;
				line-height: 88rpx;
				padding: 0 20rpx;
				font-size: 28rpx;
				color: #333;
				font-weight: 600;
				position: relative;
				&::after{ position: absolute; content: ''; left: 20rpx; right: 20rpx; height: 3rpx; background: #EBEDF0; bottom: 0;}
			}
			.bd{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx;
				.icon{
					width: 48rpx;
					height: 48rpx;
				}
				.text{
					width: calc(100vw - 40rpx - 40rpx - 60rpx);
					height: 80rpx;
					line-height: 80rpx;
				}
			}
		}
		.tips-notice{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			min-height: 48rpx;
			box-sizing: content-box;
			.icon{
				width: 32rpx;
				height: 32rpx;
				margin: 4rpx 12rpx 0 0;
			}
			.text{
				font-size: 24rpx;
				color: #888;
				line-height: 40rpx;
			}
		}
	}

}

@keyframes rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

@keyframes logoFloat {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10rpx);
	}
}

@keyframes pulse {
	0% {
		transform: translate(-50%, -50%) scale(0.8);
		opacity: 1;
	}
	100% {
		transform: translate(-50%, -50%) scale(1.5);
		opacity: 0;
	}
}

@keyframes dotPulse {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}
</style>
