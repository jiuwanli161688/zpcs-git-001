<template>
	<view class="cpn" @tap="handlerDetail">
		<view class="hd">
			<view class="store-info">
				<view class="lab">【{{ order.storeName }}】</view>
				<view class="txt">{{ order.orderStatusText }}</view>
			</view>
		</view>
		<order-item-body :goods="goods" :total="total" />
	</view>
</template>

<script>

	import OrderItemBody from './OrderItemBody'

	export default{
		name: '',
		components: {
			OrderItemBody
		},
		props: {
			order: {
				type: Object,
				default: () => {}
			},
			goods: {
				type: Array,
				default: () => []
			},
			total: {
				type: Number,
				default: 0
			},
			index: {
				type: Number,
				default: 0
			}
		},
		computed: {
			alone: function() {
				return this.$props.goods[0]
			}
		},
		data(){
			return {
				isComplete: false,

			}
		},
		methods: {
			// 触发详情
			handlerDetail: function(e){
				this.$emit('detail', {index: this.$props.index})
			},
		}
	}
</script>

<style lang="scss" scoped>
.cpn{
	background: #FFF;
	border-radius: 12rpx;
	padding: 24rpx 20rpx;
	.hd{
		position: relative;
		.store-info{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.lab{
				color: #333333;
				min-width: 140rpx;
				font-weight: 500;
			}
			.txt{
				font-size: 28rpx;
				color: #F10100;
			}
		}
	}
}
</style>