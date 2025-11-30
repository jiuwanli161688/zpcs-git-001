<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无售后申请记录" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<sales-item :index="index" :sales="item" @detail="handlerDetail(item.sn)" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import SalesItem from "@/components/Hina/SalesItemForSupplier";
import { storeAfterSalePage } from "../../api/store";


export default {
	name: '',
	components: {
		EmptyBox,
		SalesItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ code: 'ALL', name: '全部' },
				{ code: 'WAIT_DISPOSE', name: '待处理' },
				{ code: 'DISPOSING', name: '处理中' },
				{ code: 'COMPLETED', name: '已完成' }
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 加载售后信息
		loadBaseData: function () {
			this.isComplete = true
			let that = this;
			let eCode = this.arrTab[this.curTab].code				// 查询类型
			let params = { pageNumber: this.intPageCode, tag: eCode }
			storeAfterSalePage(params).then(res => {
				if (res.data.code == 200) {
					res.data.result.records.forEach(item => {
						switch (item.serviceStatus) {
							case 'APPLY':
								item.statusText = '买家提交申请';
								break;
							case 'PASS':
								item.statusText = '卖家通过申请';
								break;
							case 'REFUSE':
								item.statusText = '卖家拒绝申请';
								break;
							case 'WAITING_RETURN':
								item.statusText = '等待商品回寄';
								break;
							case 'BUYER_RETURN':
								item.statusText = '等待卖家签收';
								break;
							case 'SELLER_CONFIRM':
								item.statusText = '卖家确认收货';
								break;
							case 'SELLER_REFUSE':
								item.statusText = '卖家拒绝收货';
								break;
							case 'WAITING_REISSUE':
								item.statusText = '等待商品补发';
								break;
							case 'PRODUCT_REPLACEMENT':
								item.statusText = '商品已补发';
								break;
							case 'SELLER_REFUSE_HANDLE':
								item.statusText = '卖家拒绝处理退换货';
								break;
							case 'SELLER_TERMINATION':
								item.statusText = '卖家终止售后';
								break;
							case 'BUYER_CANCEL':
								item.statusText = '买家取消申请';
								break;
							case 'WAIT_REFUND':
								item.statusText = '等待平台退款';
								break;
							case 'COMPLETE':
								item.statusText = '完成售后服务';
								break;
						}
					})
					that.arrData.push(...res.data.result.records)
					that.intResTotal = res.data.result.total;
				} else {
					that.$u.toast(res.data.message)
				}
			})
		},

		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.arrData.splice(0, this.arrData.length)
			this.intPageCode = 1;
			this.loadBaseData()
		},

		// 跳转售后详情
		handlerDetail: function (sn) {
			uni.navigateTo({
				url: `/pages/supplierCenter/salesDetail?sn=${sn}`
			})
		},

	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		// 加载售后信息
		this.loadBaseData()
	},
	onShow: function () {

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
		top: 0;
		background: #FFF;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 999;

		&::before {
			position: absolute;
			content: '';
			left: 0;
			bottom: 0;
			right: 0;
			height: 3rpx;
			background: rgba(0, 0, 0, 0.06);
		}

		.item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;

			.text {
				font-size: 28rpx;
				line-height: 88rpx;
				color: #969799;
			}
		}

		.item-hov {
			.text {
				color: #323233;
				font-weight: 600;
				position: relative;

				&::after {
					position: absolute;
					content: '';
					left: 0;
					bottom: 0;
					right: 0;
					height: 6rpx;
					background: #EE0A24;
					border-radius: 6rpx;
				}
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
