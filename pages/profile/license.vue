<template>
	<view class="container">
		<view class="wrapper" v-if="isComplete">
			<view class="name">{{ objData.name }}</view>
			<view class="text" v-html="objData.html"></view>
		</view>
	</view>
</template>

<script>

	import {getArticleDetailByType} from "../../api/article";

  export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				curType: '',							// 协议类型标识
				objData: {
					name: '',								// 标题
					html: ''								// 内容
				},
			}
		},
		methods: {
			// 加载协议内容
			loadBaseData: function(){
        getArticleDetailByType(this.curType).then(res=>{
          if (res.data.code==200){
            let result=res.data.result;
            this.objData.name=result.title;
            this.objData.html=result.content;
          }else{
            uni.showToast({
              title: '文章加载失败',
              icon: 'none'
            });
          }
        })
				this.isComplete = true
				this.objData.name = ''
				this.objData.html = ''
			}
		},
		onLoad: function(option){
			// 参数校验
			this.curType = option.type
			if(this.curType == ''){
				uni.navigateBack({ delta: 1})
			}else{
				// 加载协议内容
				this.loadBaseData()
			}
		},
		onShow: function(){

		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #FFF;
	min-height: 100vh;
	box-sizing: border-box;
	.wrapper{

		padding: 0 20rpx 20rpx;
		.name{
			font-size: 32rpx;
			font-weight: 600;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
		}
		.text{
			line-height: 48rpx;
			font-size: 28rpx;
		}
	}
}
</style>
