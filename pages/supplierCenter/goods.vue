<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无商品信息" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<goods-item :index="index" :goods="item" @detail="handlerDetail" @stock="handlerStock" @price="handlerPrice"
					@delete="handlerDelete" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import GoodsItem from "@/components/Hina/GoodsItemForSupplier";
import { getStoreGoodsList } from "../../api/store";

export default {
	name: '',
	components: {
		EmptyBox,
		GoodsItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ code: 0, name: '正在销售' },
				{ code: 1, name: '等待审核' },
				{ code: 2, name: '审核失败' },
				{ code: 3, name: '仓库商品' }
			],
			curTab: 0,
			params: {
				pageNumber: 1,
				marketEnable: 'UPPER',
				authFlag: 'PASS'
			},
			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			envWinTopPX: 0,            //导航栏高度

		}
	},
	methods: {
		// 加载商品列表
		loadBaseData: function () {
			let that = this;
			this.isComplete = true
			uni.showLoading({})
			getStoreGoodsList(this.params).then(res => {
				if (res.data.code == 200) {
					this.arrData.push(...res.data.result.records)
					this.intResTotal = res.data.result.total;
				} else {
					that.$u.toast(res.data.message);
				}
			})
		},
		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			let tab = this.arrTab[eIndex];
			if (tab.code == 0) {
				this.params.marketEnable = 'UPPER';
				this.params.authFlag = 'PASS';
			} else if (tab.code == 1) {
				this.params.marketEnable = '';
				this.params.authFlag = 'TOBEAUDITED';
			} else if (tab.code == 2) {
				this.params.marketEnable = '';
				this.params.authFlag = 'REFUSE';
			} else if (tab.code == 3) {
				this.params.marketEnable = 'DOWN';
				this.params.authFlag = 'PASS';
			}
			this.arrData.splice(0, this.arrData.length)
			this.params.pageNumber = 1;
			this.loadBaseData()
		},
		// 跳转商品详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].id
			uni.navigateTo({
				url: `/pages/supplierCenter/goodsDetail?id=${eId}`
			})
		},
		// 执行删除操作
		handlerDelete: function (e) {
			let eId = this.arrData[e.index].id
			// 调用接口成功后执行删除
			this.arrData.splice(e.index, 1)
			setTimeout(() => {
				this.$u.toast("操作成功");
			}, 500)
		},
		// 跳转商品库存
		handlerStock: function (e) {
			let eId = this.arrData[e.index].id
			uni.navigateTo({
				url: `/pages/supplierCenter/goodsStock?id=${eId}`
			})
		},
		// 跳转商品改价
		handlerPrice: function (e) {
			let eId = this.arrData[e.index].id
			uni.navigateTo({
				url: `/pages/supplierCenter/goodsPrice?id=${eId}`
			})
		},
		// 执行上架下架
		handlerState: function (e) {
			let eId = this.arrData[e.index].id
			// 调用接口成功后执行删除
			this.arrData.splice(e.index, 1)
		},
	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		// 加载商品列表
		this.loadBaseData()
	},
	onShow: function () {

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
