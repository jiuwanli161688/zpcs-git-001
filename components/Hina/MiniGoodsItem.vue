<template>
	<view class="cpn">
		<view class="icon" :style="{background: 'url('+ goods.icon +')'}"></view>
		<view class="name">{{goods.name}}</view>
		<view class="info">
			<!-- <view class="text">
				<view class="num">{{goods.integer}}</view>
				<view class="dot">.{{goods.decimal}}</view>
			</view>
			<view class="sell">{{goods.counter}}人购买</view> -->
			<view class="text-img" :style="{backgroundImage: 'url(https://zpwdsc.oss-cn-beijing.aliyuncs.com/static/v1/home/hot_sellers_price.png)' }">
				<view class="text-cont" :style="{ transform: priceTextContScale }" v-if="goods.integer">
					<text :style="{marginRight: '4rpx', }">¥</text>
					{{goods.integer+'.'+goods.decimal}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		name: '',
		components: {
			
		},
		props: {
			goods: {
				type: Object,
				default: () => {}
			}
		},
		data(){
			return {
				isComplete: false,
				iconHotSellersImgUrl: `${this.iconCommon}/static/v1/home/hot_sellers.png`,
				priceTextContScale: 'scale(1)',
			}
		},
		mounted() {
			this.computedPriceTextCont()
		},
		methods: {
			computedPriceTextCont(){
				const crtPriceTextCont = this.goods.integer + '.' + this.goods.decimal
				if(crtPriceTextCont.length > 6) {
					this.priceTextContScale = 'scale('+(1 - ((crtPriceTextCont.length / 5)/crtPriceTextCont.length ).toFixed(4))+')'
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
.cpn{
	.icon{
		width: 100%; 
		height: 0; 
		box-sizing: content-box; 
		padding: 0 0 100% 0; 
		background-size: cover !important; 
		background-position: 50% 50% !important; 
		// border-top-left-radius: 12rpx;
		// border-top-right-radius: 12rpx;
	}
	.name{
		margin: 12rpx 0 0;
		height: 72rpx;
		color: #333;
		font-size: 24rpx;
		line-height: 36rpx;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box; 
		-webkit-box-orient: vertical; 
		-webkit-line-clamp: 2; 
		overflow: hidden; 
		display: none;
	}
	.info{
		padding: 22rpx 0 22rpx;
		box-sizing: content-box;
		height: 48rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.text{
			color: #E22221;
			display: flex;
			align-items: baseline;
			.num{
				font-size: 30rpx;
				font-weight: 600;
			}
			.dot{
				font-size: 24rpx;
				font-weight: 600;
			}
		}
		.text-img {
			box-sizing: border-box;
			margin-right: 15rpx;
			width: 100%;
			height: 100%;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
			color: #ffffff;
			.text-cont {
				display: flex;
				align-items: baseline;
				justify-content: center;
				text-align: center;
				line-height: 1.2;
				margin-left: 10rpx;
				margin-top: 8rpx;
				font-size: 24rpx;
				.num{
					font-size: 30rpx;
					font-weight: 600;
				}
				.dot{
					font-size: 24rpx;
					font-weight: 600;
				}
			
			}
		}
		.sell{
			font-size: 23rpx;
			color: #999;
		}
	}
}
</style>