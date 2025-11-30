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
				<sales-item :index="index" :sales="item" @door="handlerDoorExpress" @self="handlerSelfExpress"
					@detail="handlerDetail" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import SalesItem from "@/components/Hina/SalesItemForDealer";
import { getDealerAfterSaleList } from "@/api/dealerCenter.js";

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
				{ tag: 'ALL', name: '全部' },
				{ tag: 'WAIT_DISPOSE', name: '待处理' },
				{ tag: 'DISPOSING', name: '处理中' },
				{ tag: 'COMPLETED', name: '已完成' }
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10,
			},
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 加载售后信息
		loadBaseData: function () {
			let eCode = this.arrTab[this.curTab].tag				// 查询类型
			let params = { ...this.params, tag: eCode }
			getDealerAfterSaleList(params).then((res) => {
				this.isComplete = true
				let data = res.data.result.records;
				if (data.length > 0) {
					this.arrData.push(...data);
				}
				this.intResTotal = res.data.result.total
			});
		},

		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.params.pageNumber = 1
			this.arrData.splice(0, this.arrData.length)
			this.loadBaseData()
		},

		// 跳转上门取件
		handlerDoorExpress: function (e) {
			let eId = this.arrData[e.index].sn

		},
		// 跳转自行邮寄
		handlerSelfExpress: function (e) {
			let eId = this.arrData[e.index].sn
		},
		// 跳转售后详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].sn
			uni.navigateTo({
				url: '/pages/dealerCenter/salesDetail?afterSaleSn=' + eId
			})

		},

	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
	},
	onShow: function () {
		this.arrData = []
		this.params.pageNumber = 1
		this.params.pageSize = uni.getStorageSync("pageConfig")?.afterSaleListSize || 10;

		// 加载售后信息
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