<template>
	<view class="cpn">
		<image class="icon" :src="iconPath"></image>
		<view class="text" v-if="text.length > 0">{{text}}</view>
	</view>
</template>

<script>
	export default {
		name: 'EmptyBox',
		props: {
			mode: {
				type: String,
				default: 'common'
			},
			text: {
				type: String,
				default: ''
			}
		},
		computed: {
			iconPath: function() {
				return `${this.iconCommon}/static/v1/empty/empty-${this.$props.mode}.png`
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.cpn{ 
	padding: 24rpx; 
	display: flex; 
	justify-content: center; 
	align-items: center; 
	flex-direction: column;
	.icon{ width: 480rpx; height: 480rpx;}
	.text{ height: 80rpx; line-height: 80rpx; text-align: center; color: #808080; font-size: 26rpx;}
}
</style>
