<template>
	<view class="container">
		<view class="article" v-if="isComplete">
			<view class="arc-name">{{objData.title}}</view>
			<view class="arc-info">
				<view class="source">{{objData.editor}}</view>
				<view class="date">{{objData.date}}</view>
			</view>
			<!-- <view class="arc-wrap" v-html="objData.content"></view> -->
			<rich-text :nodes="objData.content"></rich-text>
		</view>
		<view class="lnk-chat" @tap="goIm">
			<image class="ico" :src="iconChat" mode="aspectFit"></image>
			<view class="txt">还有疑问？点击这里咨询客服</view>
		</view>
	</view>
</template>

<script>

	import {getArticleDetail} from "../../api/article";
	import {createChatPool} from "../../api/im";

  export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				iconChat: `${this.iconCommon}/static/v1/help/icon-chat.png`,
				curDetailId: 0,
				objData: {
					title: '', date: '', editor: '中品维度', content: ''
				},
			}
		},
		methods: {
			// 处理富文本内容
			processRichText(content) {
				if (!content) return '';

				let processedContent = content;

				// 处理图片
				processedContent = processedContent.replace(/<img/g, "<img style='max-width:100%;height:auto;display:block;margin:10rpx auto;'");

				// 处理表格
				processedContent = processedContent.replace(/<table[^>]*>/gi, '<table style="width:100%;border-collapse:collapse;margin:20rpx 0;font-size:28rpx;border:1px solid #ccc;">');
				processedContent = processedContent.replace(/<td[^>]*>/ig, '<td style="border:1px solid #ccc;padding:20rpx;text-align:center;word-break:break-all;vertical-align:middle;">');
				processedContent = processedContent.replace(/<th[^>]*>/ig, '<th style="border:1px solid #ccc;padding:20rpx;text-align:center;background-color:#f5f5f5;font-weight:bold;vertical-align:middle;">');
				processedContent = processedContent.replace(/<tr[^>]*>/ig, '<tr style="border:1px solid #ccc;">');

				// 处理其他标签
				processedContent = processedContent.replace(/<br[^>]*V>/gi, "");
				processedContent = processedContent.replace(/<p[^>]*>/gi, '<p style="margin:10rpx 0;line-height:48rpx;">');

				return processedContent;
			},
			// 跳转im页面
			goIm(){
				createChatPool().then(res=>{
				if (res.data.code==200){
					uni.navigateTo({
						url: `/pages/customerService/servicecenter`
					});
				}})
			},
			// 加载帮助详情
			loadBaseData: function(){
        getArticleDetail(this.curDetailId).then(res=>{
          if (res.data.code==200){
            let result=res.data.result;
            this.objData.title = result.title;
            this.objData.date = result.createTime;
            this.objData.content = this.processRichText(result.content);
          }else{
            uni.showToast({title:"文章加载失败",icon:"none"})
          }
        })
				this.isComplete = true
			}
		},
		onLoad: function(option){
			this.curDetailId = option.code
			// 加载资讯详情
			this.loadBaseData()
		},
		onShow: function(){

		}
	}
</script>
<style>
/* 富文本表格样式 */
.article rich-text table {
    width: 100%;
    border-collapse: collapse;
    margin: 20rpx 0;
    font-size: 28rpx;
    table-layout: fixed;
}

.article rich-text table th,
.article rich-text table td {
    border: 1px solid #ccc;
    padding: 20rpx;
    text-align: center;
    word-break: break-all;
    vertical-align: middle;
    min-width: 80rpx;
}

.article rich-text table th {
    background-color: #f5f5f5;
    font-weight: bold;
}

.article rich-text table tr {
    border: 1px solid #ccc;
}

/* 响应式表格处理 */
@media screen and (max-width: 750rpx) {
    .article rich-text table {
        font-size: 24rpx;
    }

    .article rich-text table th,
    .article rich-text table td {
        padding: 15rpx 10rpx;
    }
}

/* 富文本内容样式 */
.article rich-text {
    font-size: 28rpx;
    line-height: 48rpx;
    color: #333;
}

.article rich-text img {
    max-width: 100%;
    height: auto;
    margin: 10rpx 0;
}

/* 确保表格内容不会溢出 */
.article rich-text table {
    overflow-x: auto;
    display: block;
}
</style>
<style lang="scss" scoped>
.container{
	padding: 0 0 24rpx;
	.lnk-chat{
		background: #E22221;
		margin: 0 24rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 12rpx;
		.ico{
			width: 40rpx;
			height: 40rpx;
		}
		.txt{
			padding: 0 0 0 16rpx;
			color: #FFF;
			font-size: 26rpx;
		}
	}
	.article{
		color: #333;
		background: #FFF;
		padding: 24rpx;
		margin: 0 0 24rpx;
		.arc-name{
			font-size: 32rpx;
			min-height: 48rpx;
			line-height: 48rpx;
			color: #333;
			font-weight: 600;
			box-sizing: border-box;
		}
		.arc-info{
			height: 72rpx;
			line-height: 72rpx;
			font-size: 24rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			color: #999;
			.source{
				margin: 0 20rpx 0 0;
			}
		}
		.arc-wrap{
			font-size: 28rpx;
			line-height: 48rpx;
			font-weight: 500;
			color: #333;
		}
	}

}

</style>
