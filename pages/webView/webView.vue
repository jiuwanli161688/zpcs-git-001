<template>
	<view class="order-container">
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				src: '',
			}
		},
		methods: {
		},
		onLoad: function(option){
			if(option.type){
				this.src = 'https://zpwdsc.com/License?type=' + option.type
				uni.setNavigationBarTitle({
					title: option.title
				})
				return
			}
			if(!option.src) {
				uni.navigateBack()
				return
			}
			this.src = decodeURIComponent(option.src)

			if (this.src.indexOf('?') < 0) {
				this.src = this.src + '?appid=wxdac69e0b1b6fe606'
			} else {
				this.src = this.src + '&appid=wxdac69e0b1b6fe606'
			}
		},
	}
</script>

<style>

</style>
