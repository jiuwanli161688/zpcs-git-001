<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无投诉申请记录" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<complaint-item :index="index" :complaint="item" @detail="handlerDetail" @continue="handlerContinue" />
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import ComplaintItem from "@/components/Hina/ComplaintItemForSupplier";
import { storeComplainPage } from "../../api/store";


export default {
	name: '',
	components: {
		EmptyBox,
		ComplaintItem
	},
	data() {
		return {
			isComplete: false,
			arrTab: [
				{ code: '', name: '全部' },
				{ code: 'NEW', name: '待处理' },
				{ code: 'WAIT_ARBITRATION', name: '处理中' },
				{ code: 'COMPLETE', name: '已完成' }
			],
			curTab: 0,

			arrData: [],
			intPageCode: 1,						// 当前页面
			intResTotal: 0,						// 记录总数
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 加载投诉信息
		loadBaseData: function () {
			this.isComplete = true
			let eCode = this.arrTab[this.curTab].code				// 查询类型
			let params = { pageNumber: this.intPageCode, status: eCode }
			storeComplainPage(params).then(res => {
				if (res.data.code == 200) {
					res.data.result.records.forEach(item => {
						switch (item.complainStatus) {
							case 'NEW':
								item.statusText = '新提交'
								break;
							case 'CANCEL':
								item.statusText = '已取消'
								break;
							case 'WAIT_ARBITRATION':
								item.statusText = '等待仲裁'
								break;
							case 'COMPLETE':
								item.statusText = '已完成'
								break;
						}
					})
					this.arrData.push(...res.data.result.records)
					this.intResTotal = res.data.result.total
				} else {
					this.$u.toast(res.data.message);
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


		// 跳转提交举证
		handlerContinue: function (e) {
			let eId = this.arrData[e.index].complaintId
			uni.navigateTo({
				url: `/pages/supplierCenter/complaintDetail?id=${eId}`
			})
		},

		// 跳转投诉详情
		handlerDetail: function (e) {
			let eId = this.arrData[e.index].id
			uni.navigateTo({
				url: `/pages/supplierCenter/complaintDetail?id=${eId}`
			})
		}
	},
	onLoad: function () {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		// 加载投诉信息
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
