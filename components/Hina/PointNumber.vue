<template>
	<view class="cpn">
		<view class="hd">{{rec.content}}</view>
		<view class="bd">
			<view class="txt">{{rec.createTime}}</view>
			<view class="num" :class="{'num-inc': parseInt(rec.point) - parseInt(rec.beforePoint) <0}">{{parseInt(rec.point) - parseInt(rec.beforePoint)}}</view>
		</view>
	</view>
</template>

<script>

	export default{
		name: '',
		components: {

		},
		props: {
			rec: {
				type: Object,
				default: () => {}
			}
		},
		data(){
			return {
				isComplete: false,

			}
		},
		methods: {

		},
		onLoad: function(){

		},
		onShow: function(){

		}
	}
</script>

<style lang="scss" scoped>
.cpn{
	padding: 20rpx 0;
	font-size: 28rpx;
	.hd{

		height: 48rpx;
		line-height: 48rpx;
		padding: 0 40rpx 0 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		position: relative;
		color: #333;
	}
	.bd{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 48rpx;
		.txt{
			color: #999;
		}
		.num{
			color: #07C160;
		}
		.num-inc{
			color: #E22221;
		}
	}
}
</style>
