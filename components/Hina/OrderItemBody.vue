<template>
	<view class="bd">
		<view class="alone" v-if="goods.length == 1">
			<view class="icon" :style="{background: 'url('+ alone.image +')'}"></view>
			<view class="info">
				<view class="txt">
					 <view class="name">{{ alone.name }}</view>
					 <view class="price">
						<view>
							<span>￥</span><span>{{alone.goodsPrice | unitPrice}}</span>
						</view>
						<view class="inf">
							<view class="count">×{{alone.num}}</view>
						</view>
					</view>
				</view>
				<view class="time-info">
					<view class="time-text" v-if="alone.returnTimeliness">{{ alone.returnTimeliness }}天退货</view>
					<view class="time-text m-l" v-if="alone.exchangeTimeliness">{{ alone.exchangeTimeliness }}天换货</view>
				</view>
			</view>
		</view>
		<view class="group" v-if="goods.length > 1">
			<view class="array">
				<view class="item" v-show="index < 3" v-for="(item, index) in goods" :key="index">
					<image :src="item.image" mode="aspectFit" class="thumb"></image>
				</view>
			</view>
			<view class="count">共{{goodsNumber}}件</view>
		</view>
		<view class="total">
			<view class="lab">实付款</view>
			<view class="num"><span>￥</span><span>{{total | unitPrice}}</span></view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			goods: {
				type: Array,
				default: () => []
			},
			total: {
				type: Number,
				default: 0
			}
		},
		computed: {
			alone: function() {
				return this.$props.goods[0]
			},
		},
		data(){
			return {
        goodsNumber: 0,
				isComplete: false,

			}
		},
		created() {
      this.$props.goods.forEach(item=>{
        this.goodsNumber+=parseInt(item.num);
      })
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
.bd{
	.alone{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0 0;
		.icon{
			width: 160rpx;
			height: 160rpx;
			background-size: cover !important;
			background-position: 50% 50% !important;
			border-radius: 10rpx;
		}
		.info{
			width: calc(100vw - 40rpx - 40rpx - 160rpx - 20rpx);
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			// &::after{
			// 	position: absolute;
			// 	content: '';
			// 	left: 0;
			// 	right: 0;
			// 	bottom: 0;
			// 	height: 3rpx;
			// 	background: #E7E7E7;
			// }
			.txt{
				height: 88rpx;
				font-size: 28rpx;
				color: #333;
				display: flex;
				justify-content: space-between;
				align-content: center;
				.name{
					margin-right: 20rpx;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.price{
					white-space: nowrap;
					span:first-child{
						font-size: 24rpx;
						color: #333333;
					}
					span:last-child{
						font-size: 32rpx;
						font-weight: 700;
					}
				}
				.name-lab {
					background: #E22221;
					color: #fff;
					display: inline-block;
					margin: 0 8rpx 0 0;
					padding: 4rpx 8rpx;
					line-height: 36rpx;
					font-size: 24rpx;
					border-radius: 6rpx;
					// padding: 5px 8px;
					// font-size: 12px;
					// margin-right: 5px;
					// border-radius: 8rpx;
					// background: red;
				}
				// .name-ext {
				// 	display: inline-block;
				// }
			}
			.time-info{
				display: flex;
				margin-top: 26rpx;
				.time-text{
					color: #A17600;
					font-size: 22rpx;
					font-weight: 400;
				}
				.m-l{
					margin-left: 40rpx;
				}
			}
			.inf{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				line-height: 60rpx;
				.price{
					color: #E22221;
					font-size: 26rpx;
					font-weight: 600;
				}
				.count{
					color: #666666;
					font-size: 20rpx;
				}
			}
		}
	}
	.group{
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 20rpx 0 0;
		.array{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: calc(100vw - 40rpx - 40rpx - 160rpx);
			.item{
				width: 160rpx;
				height: 160rpx;
				margin: 0 12rpx 0 0;
				&:last-of-type{
					margin: 0;
				}
				.thumb{
					width: 160rpx;
					height: 160rpx;
					border-radius: 10rpx;
				}
			}
		}
		.count{
			width: 160rpx;
			height: 160rpx;
			line-height: 160rpx;
			border-radius: 8rpx;
			text-align: center;
			background: rgba(0, 0, 0, 0.01);
			font-size: 24rpx;
			color: #888;
		}
	}
	.total{
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 28rpx;
		font-weight: 600;
		.lab{
			color: #333333;
			font-size: 22rpx;
			font-weight: 400;
		}
		.num{
			margin-left: 14rpx;
			span:first-child{
				font-size: 24rpx;
			}
			span:last-child{
				font-size: 32rpx;
				font-weight: 700;
			}
		}
	}
}

</style>
