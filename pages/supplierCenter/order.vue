<template>
	<view class="container">
		<scroll-view class="tab-comm" :style="{ top: `${envWinTopPX}px` }" scroll-x="true" show-scrollbar="false">
			<view class="tab-container">
				<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
					:data-index="index" @tap="handlerChange">
					<view class="text">{{ item.name }}</view>
				</view>
			</view>
		</scroll-view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无订单记录" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<order-item :order="item" :goods="item.orderItems" :total="item.orderItems.length" :index="index"
					@express="handlerExpress(item.sn)" @detail="handlerDetail" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import OrderItem from "@/components/Hina/OrderItemForSupplier";
import { storeOrderList } from "../../api/store";

export default {
	name: '',
	components: {
		EmptyBox,
		OrderItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ code: 'ALL', name: '全部' },
				{ code: 'WAIT_PAY', name: '待付款' },
				{ code: 'WAIT_SEND', name: '待发货' },
				{ code: 'WAIT_TAKE', name: '待收货' },
				{ code: 'WAIT_EVALUATE', name: '已完成' },
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			envWinTopPX: 0,      //导航栏高度

		}
	},
	methods: {
		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.arrData.splice(0, this.arrData.length)
			this.intPageCode = 1;
			this.loadBaseData()
		},

		// 加载订单信息
		loadBaseData: function () {
			this.isComplete = true
			let that = this;
			let eCode = this.arrTab[this.curTab].code				// 查询类型
			let params = { pageNumber: this.intPageCode, tag: eCode }
			uni.showLoading();
			storeOrderList(params).then(res => {
				uni.hideLoading();
				if (res.data.code == 200) {
					res.data.result.records.forEach(item => {
						switch (item.orderStatus) {
							case 'UNPAID':
								item.statusText = '待付款';
								break;
							case 'PAID':
								item.statusText = '已付款';
								break;
							case 'UNDELIVERED':
								item.statusText = '待发货';
								break;
							case 'DELIVERED':
								item.statusText = '待收货';
								break;
							case 'COMPLETED':
								item.statusText = '已完成';
								break;
							case 'FINISH':
								item.statusText = '已结束';
								break;
							case 'AFTERSALES':
								item.statusText = '售后中';
								break;
							case 'STAY_PICKED_UP':
								item.statusText = '待自提';
								break;
							case 'CANCEL':
								item.statusText = '取消';
								break;
							case 'TAKE':
								item.statusText = '待核验';
								break;
							case 'CANCELLED':
								item.statusText = '已关闭';
								break;
						}
					})
					that.arrData.push(...res.data.result.records)
					that.intResTotal = res.data.result.total;
				} else {
					that.$u.toast(res.data.message);
				}
			})
		},

		// 跳转立即发货
		handlerExpress: function (sn) {
			uni.navigateTo({
				url: '/pages/supplierCenter/orderExpress?sn=' + sn
			})
		},

		// 跳转订单详情
		handlerDetail: function (e) {
			let eSn = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/supplierCenter/orderDetail?sn=' + eSn
			})
		},
	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
	},
	onShow: function () {
		// 加载订单信息
		this.arrData = [];
		this.intPageCode = 1;
		this.loadBaseData()
	},
	onReachBottom: function () {
		if (this.intResTotal > this.arrData.length) {
			this.intPageCode++
			this.loadBaseData()
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding: 0 0 20rpx;

	.tab-comm {
		position: sticky;
		left: 0;
		right: 0;
		z-index: 999;
		background: #F1F1F1;
		padding: 20rpx 0;

		/* 隐藏滚动条 */
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
		}

		.tab-container {
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			justify-content: space-between;
		}

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			padding: 8rpx 20rpx;
			border-radius: 10rpx;
			white-space: nowrap;
			flex-shrink: 0;
			transition: all 0.3s ease;
			font-size: 28rpx;
			margin-right: 20rpx;

			&:last-child {
				margin-right: 0;
			}

			.text {
				font-size: 28rpx;
				color: #333333;
				transition: color 0.3s ease;
			}
		}

		.item-hov {
			background-color: #FFE6E6;

			.text {
				color: #F10100;
				font-weight: 400;
			}
		}
	}

	.box-list {
		padding: 20rpx 20rpx 0;

		.item {
			position: relative;
			margin: 20rpx 0 0;

			&:first-of-type {
				margin: 0;
			}
		}
	}
}
</style>
