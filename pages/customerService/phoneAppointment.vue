<template>
	<view class="phone-appointment" v-if="bookingData.length > 0">
		<view class="order-card" v-for="(item, index) in bookingData" :key="index" @click="bookingDataDetail(item)" >
			<view class="time">
				<view class="left">申请时间：{{ item.createTime }}</view>
				<view class="right">
					咨询类型：<text class="consultation-type">{{ consultationTypeObj[item.consultationType] }}</text>
				</view>
			</view>
			<view class="info goods-child-info">
				<!-- <u-avatar class="avatar" :src="item.thumbnail" mode="scaleToFill‌‌" size="144"></u-avatar> -->
				<view class="text">
					<text class="name">{{ item.consultationContent }}</text>
					<!-- <text class="state" :class="item.status">{{ consultationStateObj[item.status] }}</text> -->
				</view>
			</view>
			<view class="time item-bottom">
				<view class="left">回电号码:{{ item.phoneNumber }}</view>
				<view class="right" :class="item.status">{{ consultationStateObj[item.status] }}</view>
			</view>
		</view>
	</view>
	<view class="phone-appointment-none" v-else>
		~暂无数据~
	</view>
</template>

<script>
import {
	getScheduledCallBack,
} from '@/api/customer.js'
import storage from '@/utils/storage.js' //缓存
export default {
	name: 'phoneAppointment',
	components: {},
	data() {
		return {
		  userInfoObj: storage.getUserInfo(), // 用户信息
		  consultationTypeObj:{
			ORDER: '订单类型' ,
			// CALLBACK: '售后类型' ,
			AFTER_SALE: '售后类型' ,
			ACCOUNT: '账户类型' ,
			OTHER: '其他类型' ,
		  }, // 咨询类型
		  consultationStateObj:{
			  CANCEL: '已取消',
			  CALLED_BACK: '已回电',
			  WAIT_CALL_BACK: '待回电',
		  }, // 咨询状态
		  bookingDataParams: {
			memberId: '', // 
			pageSize: 10,
			pageNum: 1,
		  }, // 预约回电 Params
		  bookingDataPages:0, //预约回电列表 总数
		  bookingData:[], // 预约回电列表 数据
		}
	},
	onLoad() {
		this.getScheduledCallBackEve()
	},
	onShow() {
		
	},
	created() {
		
	},
	mounted() {
		
	},
	onReachBottom() {
		if(this.bookingDataParams.pageNum != this.bookingDataPages) {
			this.bookingDataParams.pageNum += 1
			this.getScheduledCallBackEve()
		}
	},
	methods: {
		// 跳转预约回电详情详情页
		bookingDataDetail(e) {
			uni.navigateTo({
				url: `/pages/customerService/phone?scheduledCallBackId=${e.id}`
			})
		},
		// 获取预约回电数据列表
		getScheduledCallBackEve() {
		  this.bookingDataParams.memberId = this.userInfoObj.id
		  getScheduledCallBack(this.bookingDataParams).then(res => {
			if (res.data.code == 200) {
			  this.bookingData.push(...res.data.data.records)
			  this.bookingDataPages = res.data.data.pages
			}
		  })
		},
	},
}

</script>

<style lang="scss" scoped>
.phone-appointment {
	padding: 20rpx 0;
	.order-card {
		background: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 20rpx;

		.time {
			display: flex;
			justify-content: space-between;
			margin-bottom: 16rpx;

			.left,
			.right {
				display: flex;
				align-items: center;
				font-size: 24rpx;
			}

			.left {
				color: #333333;
			}

			.right {
				color: #333333;
				margin-right: 24rpx;
				.consultation-type {
					color: #0000ff;
				}
			}
		}
		.item-bottom {
			margin-top: 8px;
			margin-bottom: 0;
			.WAIT_CALL_BACK {
				color: #189CF9;
			}
			.CALLED_BACK {
				color: #02b207;
			}
			.CANCEL {
				color: #E40B25;
			}
		}
		.info {
			display: flex;
			gap: 16rpx;

			image {
				width: 96rpx;
				height: 96rpx;
				background-color: #ffffff;
			}

			.avatar {
				padding: 0;
			}

			.text {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				color: #333333;
				width: 100%;

				.name {
					padding-right: 8rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.state {
					font-size: 28rpx;
				}
			}
		}

		.goods-child-info {
			padding: 20rpx 0;
			border-top: 2px solid #ececec;
			border-bottom: 2px solid #ececec;
		}

		.info-first {
			border-top: 2px solid transparent;
		}
	}

}
.phone-appointment-none {
	margin-top: 60rpx;
	text-align: center;
	color: #c5c5c5;
}
</style>