<template>
	<view class="container">
		<view class="pay-base">
			<view class="num">
				<view class="min">￥</view>
				<view class="txt">150</view>
				<view class="min">.00</view>
			</view>
		</view>
		<view class="pay-type">
			<view class="r-check" v-for="(item, index) in arrPayment" :key="index" :data-code='item.code' @tap="handlerChangePay">
				<view class="title">
					<image :src="item.icon" mode="aspectFit" class="icon"></image>
					<view class="name">{{item.name}}</view>
				</view>
				<image :src="item.code == curPayment ? iconCheckHov : iconCheck" mode="aspectFit" class="check"></image>
			</view>
			<view class="lnk-common lnk-primary" @tap="handlerPay">确认支付</view>
		</view>
		
	</view>
</template>

<script>
	
	export default{
		name: '',
		components: {
			
		},
		data(){
			return {
				isComplete: false,
				iconCheck: `${this.iconCommon}/static/v1/common/icon-check.png`,
				iconCheckHov: `${this.iconCommon}/static/v1/common/icon-check_hov.png`,
				arrPayment: [],
				curPayment: '',		// 当前支付方式
			}
		},
		methods: {
			// 加载支付类型
			loadBaseData: function(){
				this.isComplete = true
				this.arrPayment.push({name: '支付宝', icon: `${this.iconCommon}/static/v1/common/icon-alipay.png`, code: 'alipay'})
				this.arrPayment.push({name: '微信', icon: `${this.iconCommon}/static/v1/common/icon-wechat.png`, code: 'wechat'})
			},
			
			// 变更支付方式
			handlerChangePay: function(e){
				let eCode = e.currentTarget.dataset.code
				this.curPayment = eCode
			},
			
			// 跳转支付结果
			handlerPay: function(){
				uni.redirectTo({
					url: '/pages/profile/order/result'
				})
			},
		},
		onLoad: function(){
			// 加载支付类型
			this.loadBaseData()
		},
		onShow: function(){
			
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	position: relative;
	padding: 0 0 20rpx;
	&::before{
		position: absolute;
		content: '';
		left: 0;
		right: 0;
		top: 0;
		background: #E22221;
		height: 180rpx;
	}
	.pay-base{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 180rpx;
		position: relative;
		z-index: 1;
		color: #FFF;
		.num{
			display: flex;
			justify-content: center;
			align-items: baseline;
			.txt{
				font-size: 48rpx;
				font-weight: 600;
			}
			.min{
				font-size: 32rpx;
			}
		}
		
	}
	.pay-type{
		padding: 0 20rpx;
		.r-check{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 140rpx;
			border-radius: 12rpx;
			background: #FFF;	
			box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.06); 
			margin: 20rpx 0 0;
			padding: 0 24rpx;
			.title{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				.icon{
					width: 60rpx;
					height: 60rpx;
				}
				.name{
					margin: 0 0 0 16rpx;
					color: #333;
					font-size: 30rpx;
					font-weight: 600;
				}
			}
			.check{
				width: 36rpx;
				height: 36rpx;
			}
		}
	}
}
</style>