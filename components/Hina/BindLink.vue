<template>
	<view class="lnk-item" @tap="handlerBindTencent">
		<view class="text">{{text}}</view>
		<view class="link">{{flag ? '解绑' : '未绑定'}}</view>
	</view>
</template>

<script>

	export default{
		name: '',
		props: {
			text: {
				type: String,
				default: ''
			},
			flag: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {

			}
		},
		methods: {
			handlerBindTencent(){
				this.$emit('handlerBindTencent')
			}
		},
		onLoad: function(){

		},
		onShow: function(){

		}
	}
</script>

<style scoped>
.lnk-item{ height: 88rpx; line-height: 88rpx; font-size: 30rpx; position: relative; display: flex; justify-content: space-between; align-items: center; padding: 0 54rpx 0 24rpx;}
.lnk-item::after{ position: absolute; content: ""; width: 12rpx; height: 12rpx; border: 4rpx solid #d6d6d6; border-left: none; border-bottom: none; right: 40rpx; top: 50%; transform: rotate(45deg) translateY(-50%);}
.lnk-item>.text{ color: #333;}
.lnk-item>.link{ color: #E22221; font-size: 26rpx;}
</style>