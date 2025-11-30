<template>
	<view class="cpn">
		<view class="hd">
			<view class="line">
				<view class="lab">用户昵称</view>
				<view class="txt">{{inviteUser.nickName}}</view>
			</view>
			<view class="line">
				<view class="lab">手机号</view>
				<view class="txt">{{inviteUser.mobile}}</view>
			</view>
			<view class="line">
				<view class="lab">邀请时间</view>
				<view class="txt">{{inviteUser.createTime}}</view>
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
			inviteUser: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				isComplete: false,

			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
.cpn{
	background: #FFF;
	border-radius: 12rpx;
	padding: 0 20rpx;
	.hd{
		position: relative;
		padding: 16rpx 0;
		.line{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			height: 48rpx;
			line-height: 48rpx;
			.lab{
				color: #999;
				min-width: 140rpx;
				position: relative;
				&::after{
					position: relative;
					content: '：';
				}
			}
			.txt{
				color: #666;
			}
		}
		&::after{
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
	}
	.bd{
		padding: 16rpx 0;
		position: relative;
		&::after{
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			bottom: 0;
			height: 3rpx;
			background: #E7E7E7;
		}
		.rs{
			display: flex;
			justify-content: space-between;
			align-items: center;
			line-height: 48rpx;
			.lab{
				color: #999;
				min-width: 140rpx;
				font-size: 28rpx;
				position: relative;
			}
			.inf{
				font-size: 28rpx;
				color: #333;
				font-weight: 400;
			}
		}
	}
	.ft{
		height: 96rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.link-item{
			border: 3rpx solid #DCDEE0;
			min-width: 144rpx;
			height: 64rpx;
			border-radius: 12rpx;
			line-height: 64rpx;
			font-size: 28rpx;
			color: #323232;
			text-align: center;
			margin: 0 0 0 16rpx;
			border: 3rpx solid #EE0A24;
			color: #EE0A24;
		}
	}
}
</style>