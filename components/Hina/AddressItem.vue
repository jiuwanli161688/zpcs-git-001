<template>
	<view class="cpn">
		<view class="info" @tap.stop="onUpdate">
			<view class="hd">
				<view class="name">{{ address.name }}</view>
				<view class="phone">{{ address.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}</view>
				<view class="flag" v-if="address.isDefault">默认地址</view>
			</view>
			<view class="bd">{{ address.consigneeAddressPath }}{{ address.detail }}</view>
		</view>
		<view class="link" @tap.stop="onDel" v-if="!address.move && !isSel">删除
			<!-- <image class="icon" :src="iconUpdate" mode="aspectFit"></image> -->
		</view>
		<view class="link" v-if="isSel" @tap.stop="Update">编辑</view>
	</view>
</template>

<script>

export default {
	name: '',
	props: {
		index: {
			type: Number,
			default: 0
		},
		address: {
			type: Object,
			default: () => { }
		},
		isSel: {
			type: Boolean,
			default: false
		},
		mobile: {
			type: String,
			default: ""
		},
	},
	data() {
		return {
			isComplete: false,
		}
	},
	computed: {

	},

	methods: {
		onUpdate: function (e) {
			// isSel为true说明是选择地址跳转过来的，直接触发选择地址的方法
			if (this.isSel) {
				this.$emit('selAddress', { index: this.index, code: this.address.id })
			} else {
				this.$emit('update', { index: this.index, code: this.address.id })
			}
		},
		Update: function (e) {
			this.$emit('update', { index: this.index, code: this.address.id })
		},
		onDel: function (e) {
			this.$emit('del', { index: this.index, code: this.address.id })
		},
	},
	onLoad: function () {

	},
	onShow: function () {

	},
}
</script>

<style scoped>
.cpn {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.cpn>.info {
	width: calc(100vw - 48rpx - 120rpx);
	box-sizing: border-box;
	padding: 10rpx 0 20rpx 20rpx;
}

.cpn>.info>.hd {
	height: 70rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.cpn>.info>.hd>.flag {
	font-size: 23rpx;
	line-height: 40rpx;
	padding: 0 12rpx;
	color: #1FCA7E;
	background: rgba(31, 202, 126, 0.05);
	border: 3rpx solid #1FCA7E;
	border-radius: 8rpx;
}

.cpn>.info>.hd>.name {
	font-size: 28rpx;
	color: #333;
	font-weight: 600;
}

.cpn>.info>.hd>.phone {
	font-size: 28rpx;
	color: #333;
	font-weight: 600;
	margin: 0 10rpx;
}

.cpn>.info>.bd {
	font-size: 28rpx;
	height: 40rpx;
	line-height: 40rpx;
	color: #666;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.cpn>.link {
	width: 120rpx;
	height: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: red;
}

.cpn>.link>.icon {
	width: 32rpx;
	height: 32rpx;
}
</style>