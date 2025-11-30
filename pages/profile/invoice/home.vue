<template>
	<view class="container">
		<view class="wrap">
			<view class="null" v-if="isComplete && arrData.length == 0">
				<empty-box text="暂无订单记录" />
			</view>
			<view class="list" v-if="isComplete && arrData.length > 0">
				<view class="item" v-for="(item, index) in arrData" :key="index">
					<invoice-item :order="item" :goods="item.orderItems" :total="item.flowPrice" :index="index"
						@apply="handlerApply" @reopen="handlerReopen" @detail="handlerDetail" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>

import EmptyBox from "@/components/Hina/EmptyBox";
import InvoiceItem from "@/components/Hina/InvoiceItem";
import { getReceiptList } from "@/api/invoice.js"
import { getOrderList } from '@/api/order.js'
export default {
	name: "",
	components: {
		EmptyBox,
		InvoiceItem
	},
	data() {
		return {
			isComplete: false,

			arrData: [],
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10,
				orderStatus: 'COMPLETED_AND_FINISH',
				invoiceFlag: true
			},
		}
	},
	methods: {
		// 跳转详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/detail?orderSn=' + eId
			})
		},
		// 跳转申请
		handlerApply: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/apply?orderSn=' + eId
			})
		},
		// 跳转重开
		handlerReopen: function (e) {
			let eId = this.arrData[e.index].sn 		// 获取订单ID
			uni.navigateTo({
				url: '/pages/profile/invoice/reopen?orderSn=' + eId
			})
		},
		// 加载订单信息
		loadBaseData: function () {
			uni.showLoading()
			let params = { ...this.params }
			getOrderList(params).then((res) => {
				if (this.$store.state.isShowToast) {
					uni.hideLoading()
				}
				if (res.data.code == 200) {
					this.isComplete = true
					let data = res.data.result.records;
					data.forEach(item => {
						item.invoiceStatusText = this.handleReceiptStatus(item.receiptStatus)
					});
					if (data.length > 0) {
						this.arrData.push(...data);
					}
					this.intResTotal = res.data.result.total
				}
			})

		},
		// 处理订单状态
		handleReceiptStatus(receiptStatus) {
			switch (receiptStatus) {
				case '0':
					return '未开票'
					break;
				case '1':
					return '开票中'
					break;
				case '2':
					return '待重开'
					break;
				case '3':
					return '已开票'
					break;
				default:
					break;
			}
		},
	},
	onLoad: function () {
	},
	onShow: function () {
		this.arrData = []
		this.params.pageNumber = 1
		this.loadBaseData()
	},
	onReachBottom: function () {
		if (this.intResTotal > this.arrData.length) {
			this.params.pageNumber++
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
	padding: 20rpx;

	.list {
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