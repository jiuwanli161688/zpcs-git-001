<template>
	<view class="permission-modal-mask" v-if="show" @click="handleMaskClick">
		<view class="permission-modal" @click.stop>
			<view class="modal-header">
				<text class="modal-title">位置权限申请</text>
			</view>
			
			<view class="modal-content">
				<view class="modal-icon">
					<uni-icons type="location" size="48" color="#007aff"></uni-icons>
				</view>
				<text class="modal-message">{{ message }}</text>
			</view>
			
			<view class="modal-actions">
				<view class="modal-btn modal-btn--cancel" @click="handleCancel">
					<text class="btn-text">暂不授权</text>
				</view>
				<view class="modal-btn modal-btn--confirm" @click="handleConfirm">
					<text class="btn-text">去设置</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'LocationPermissionModal',
	props: {
		show: {
			type: Boolean,
			default: false
		},
		message: {
			type: String,
			default: '需要您授权位置权限才能获取附近商家信息'
		}
	},
	methods: {
		handleMaskClick() {
			// 点击遮罩层不关闭，必须选择操作
		},
		handleCancel() {
			this.$emit('cancel')
		},
		handleConfirm() {
			this.$emit('confirm')
		}
	}
}
</script>

<style lang="scss" scoped>
.permission-modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.permission-modal {
	width: 600rpx;
	background-color: #fff;
	border-radius: 24rpx;
	overflow: hidden;
}

.modal-header {
	padding: 40rpx 40rpx 20rpx;
	text-align: center;
}

.modal-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.modal-content {
	padding: 40rpx;
	text-align: center;
}

.modal-icon {
	margin-bottom: 30rpx;
	display: flex;
	justify-content: center;
}

.modal-message {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.modal-actions {
	display: flex;
	border-top: 1rpx solid #eee;
}

.modal-btn {
	flex: 1;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&--cancel {
		border-right: 1rpx solid #eee;
		
		.btn-text {
			color: #666;
		}
	}
	
	&--confirm {
		.btn-text {
			color: #007aff;
			font-weight: 500;
		}
	}
}

.btn-text {
	font-size: 32rpx;
}
</style>

