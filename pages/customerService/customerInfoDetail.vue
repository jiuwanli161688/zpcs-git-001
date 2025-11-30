<template>
	<view class="customer-info-detail">
		<!-- 内容 -->
		<view class="detail-content">
			<!-- 标题 -->
			<view class="detail-title">
				{{ infoDetailObj.title }}
			</view>
			<!-- 作者、时间 -->
			<view class="top-content">
				<text class="time-info">
					<!-- <text class="time-title">有效时间：</text> -->
					<text class="time-cont">{{`${infoDetailObj.effectivePeriodStart}~${infoDetailObj.effectivePeriodEnd}`}}</text>
				</text>
				<text class="author-info">
					<!-- <text class="author-title">作者：</text> -->
					<text class="author-cont">{{infoDetailObj.author}}</text>
				</text>
			</view>
			<!-- <view class="title">
				<view class="title-style"></view>内容
			</view> -->
			<view class="content-info" v-html="infoDetailObj.h5Content"></view>
			<!-- 图片 -->
			<view class="images" v-if="infoDetailObj.imagesUrl && imagesCont">
				<!-- <view class="title">
					<view class="title-style"></view>图片
				</view> -->
				<image style="width: 100%;":src="imagesCont.url" mode="scaleToFill"></image>
			</view>
			<!-- 视频 -->
			<view class="videos" v-if="infoDetailObj.videosUrl && videosCont">
				<!-- <view class="title">
					<view class="title-style"></view>视频
				</view> -->
				<video id="myVideo" style="width: 100%;" :src="videosCont.url"
				@error="videoErrorCallback" object-fit="cover" enable-danmuscaleToFill controls></video>
			</view>
		</view>
	</view>
</template>

<script>
import {
	getProblemDetailInfo,
	getVideosOrImagesCont,
} from '@/api/customer.js'
export default {
	name: 'CustomerInfoDetail',
	components: {},
	data() {
		return {
			customerInfoId: '', // 问题/公告 ID
			infoDetailObj: {}, // 信息详情
			imagesCont: null, // 图片内容
			videosCont: null, // 视频内容
		}
	},
	onLoad(e) {
		if(e.id) {
			this.customerInfoId = e.id
			this.getProblemDetailInfoEve()
		}
	},
	onShow() {
		
	},
	created() {
		
	},
	mounted() {
		
	},
	methods: {
		// 视频播放出错
        videoErrorCallback: function(e) {
            uni.showModal({
                content: e.target.errMsg,
                showCancel: false
            })
        },
		// 获取详情数据
		getProblemDetailInfoEve() {
			getProblemDetailInfo(this.customerInfoId).then(res => {
				if(res.data.code == 200) {
					// console.log('========',res.data.data)
					this.infoDetailObj = res.data.data
					if(this.infoDetailObj.imagesUrl) {
						getVideosOrImagesCont(this.infoDetailObj.imagesUrl).then(res => {
							if(res.data.code == 200) {
								this.imagesCont = res.data.data[0]
							}
						})
					}
					if(this.infoDetailObj.videosUrl) {
						getVideosOrImagesCont(this.infoDetailObj.videosUrl).then(res => {
							if(res.data.code == 200) {
								this.videosCont = res.data.data[0]
							}
						})
					}
				}
			})
		},
		// 加载遮罩
		LoadingEve() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		},
	},
	computed:{},
	
}
</script>

<style lang="scss" scoped>
.customer-info-detail {
	background-color: #f9f9f9;
	// padding:20rpx;
	.detail-title {
		text-align: center;
		font-size: 38rpx;
		font-weight: 600;
		padding: 15rpx;
	}
	.top-content {
		width: 100%;
		color: #b2b2b2;
		padding: 10rpx 0rpx;
		font-size: 22rpx;
		.author-info {
			margin-left: 20rpx;
			.author-title{}
			.author-cont {}
		}
		.time-info {
			.time-title {}
			.time-cont {}
		}
	}
	.detail-content {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding: 10rpx 20rpx 20rpx;
		border-radius: 10rpx;
		.content-info {
			padding: 0 20rpx;
			color: #909090;
		}
	}
	.images {
		background-color: #fff;
		padding: 20rpx 20rpx 10rpx;
		// margin-bottom: 20rpx;
		// padding: 10rpx 20rpx 20rpx;
		// border-radius: 10rpx;
	}
	.videos {
		background-color: #fff;
		margin-bottom: 20rpx;
		padding: 10rpx 20rpx 20rpx;
		border-radius: 10rpx;
	}
	.title {
		display: flex;
		align-items: center;
		padding: 10rpx 10rpx 15rpx;
		border-bottom: 4rpx solid #ededed;
		margin-bottom: 20rpx;
		.title-style {
			width: 10rpx;
			height: 30rpx;
			background-color: #E40B25;
			margin-right: 10rpx;
			border-radius: 10rpx;
		}
	}
}
</style>