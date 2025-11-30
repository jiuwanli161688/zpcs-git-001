<template>
	<view class="container">
		<view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>

		<!-- 纠纷申请选项卡 -->
		<view v-if="curTab === 0">
			<view class="search-box">
				<view class="search-input">
					<u-icon name="search" size="40" color="#999"></u-icon>
					<input type="text" v-model="orderParams.keywords" placeholder="请输入商品名称/订单号" @input="onOrderSearchInput" />
				</view>
			</view>

			<view class="complaint-list" v-if="orderList.length > 0">
				<view class="complaint-item" v-for="(item, index) in orderList" :key="index">
					<view class="order-info">
						<view class="order-number">订单号：{{ item.orderSn }}</view>
						<view class="order-status">完成</view>
					</view>
					<view class="order-time">下单时间：{{ item.orderTime }}</view>
					<view class="goods-info">
						<image :src="item.goodsImage || '/static/default_image.png'" class="goods-image" mode="aspectFill"></image>
						<view class="goods-detail">
							<view class="goods-name">{{ item.goodsName }}</view>
							<view class="goods-quantity">数量：{{ item.num }}</view>
						</view>
					</view>
					<view class="invalid-tip" v-if="item.refuseReason">
						<view>售后拒绝原因：{{ item.refuseReason }}</view>
					</view>
					<view class="complaint-footer">
						<view class="apply-btn" :class="{'disabled': !canApply(item)}" @tap="applyComplaint(item)">
							申请
						</view>
					</view>
				</view>
			</view>

			<view class="load-more" v-if="orderList.length > 0 && orderList.length < orderTotal && !orderLoading" @tap="loadMoreOrders">
				<text>点击加载更多</text>
			</view>

			<view class="loading" v-if="orderLoading">
				<text>加载中...</text>
			</view>

			<view class="box-null" v-if="isComplete && orderList.length === 0">
				<empty-box text="暂无可申请交易纠纷的订单" />
			</view>
		</view>

		<!-- 申请记录选项卡 -->
		<view v-else>
			<view class="search-box">
				<view class="search-input">
					<u-icon name="search" size="40" color="#999"></u-icon>
					<input type="text" v-model="searchKeyword" placeholder="请输入商品名称/订单号" @input="onSearchInput" />
				</view>
			</view>

			<view class="box-null" v-if="isComplete && arrData.length == 0">
				<empty-box text="暂无交易纠纷申请记录" />
			</view>

			<view class="record-list" v-else>
				<view class="record-item" v-for="(item, index) in arrData" :key="index">
					<view class="service-info">
						<view class="service-number">服务单号：{{ item.complaintSn || item.sn }}</view>
						<view class="complaint-type">{{ getComplaintType(item) }}</view>
					</view>
					<view class="goods-info">
						<image :src="item.goodsImage || (item.orderItem && item.orderItem.thumbnail ? item.orderItem.thumbnail : '/static/default_image.png')" class="goods-image" mode="aspectFill"></image>
						<view class="goods-detail">
							<view class="goods-name">{{ item.orderItem && item.orderItem.goodsName ? item.orderItem.goodsName : item.goodsName }}</view>
							<view class="goods-quantity">数量：{{ item.orderItem && item.orderItem.num ? item.orderItem.num : 1 }}</view>
						</view>
					</view>
					<view class="service-footer">
						<view class="status-box">
							<view class="status-tag">{{ handleComplainStatus(item.complainStatus) }}</view>
							<view class="status-message">{{ getStatusDescription(item.complainStatus) }}</view>
						</view>
						<view class="action-btn">
							<u-button type="default" size="mini" @tap="handlerDetail(index)">查看服务单</u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import ComplaintItem from "@/components/Hina/ComplaintItemForUser";
import { getComplain, clearComplain, getCanComplainOrders } from "@/api/after-sale";

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
				{ status: 'APPLY', name: '纠纷申请' },
				{ status: 'RECORD', name: '申请记录' }
			],
			curTab: 0,

			arrData: [],
			intResTotal: 0,						// 记录总数
			params: {
				pageNumber: 1,
				pageSize: 10,
			},
			orderList: [], // 可申请纠纷的订单列表
			orderTotal: 0, // 可申请纠纷的订单总数
			orderParams: {
				// pageNo: 1,
				pageNumber: 1,
				pageSize: 10,
				keywords: ''
			},
			orderLoading: false, // 订单列表加载状态
			searchKeyword: '', // 搜索关键词
			envWinTopPX: 0,// 导航栏高度
			searchTimer: null, // 搜索防抖计时器
		}
	},
	computed: {

	},
	methods: {
		// 加载投诉信息
		loadBaseData: function () {
			if (this.curTab === 0) {
				// 加载可申请纠纷的订单列表
				this.loadOrderList();
			} else {
				// 加载已申请的纠纷记录
				let status = '';  // 空表示获取全部记录
				let params = {
					...this.params,
					status: status
				};

				// 添加搜索关键词
				if (this.searchKeyword && this.searchKeyword.trim()) {
					params.keywords = this.searchKeyword.trim();
				}

				uni.showLoading({
					title: "加载中",
				});

				console.log('Search params:', params); // 用于调试

				getComplain(params).then((res) => {
					this.isComplete = true;
					if (res.data.success && res.data.result && res.data.result.records) {
						let data = res.data.result.records;
						if (data.length > 0) {
							this.arrData = data;
						} else {
							this.arrData = [];
						}
						this.intResTotal = res.data.result.total;
					} else {
						this.arrData = [];
						this.intResTotal = 0;
					}
					uni.hideLoading();
				}).catch(err => {
					console.error('Error fetching complaints:', err);
					this.arrData = [];
					this.intResTotal = 0;
					uni.hideLoading();
				});
			}
		},

		// 搜索订单输入监听
		onOrderSearchInput() {
			// 防抖处理，避免频繁请求
			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
			}
			this.searchTimer = setTimeout(() => {
				// this.orderParams.pageNo = 1;
				this.orderParams.pageNumber = 1;
				this.orderList = [];
				this.loadOrderList();
			}, 500);
		},

		// 加载更多订单
		loadMoreOrders() {
			if (this.orderLoading) return;
			// this.orderParams.pageNo++;
			this.orderParams.pageNumber++;
			this.loadOrderList(true);
		},

		// 加载可申请纠纷的订单列表
		loadOrderList: function(append = false) {
			this.orderLoading = true;

			if (!append) {
				uni.showLoading({
					title: "加载中",
				});
			}

			getCanComplainOrders(this.orderParams).then(res => {
				this.orderLoading = false;
				this.isComplete = true;

				if (res.data.success && res.data.result) {
					const records = res.data.result.records || [];
					if (append) {
						this.orderList = [...this.orderList, ...records];
					} else {
						this.orderList = records;
					}
					this.orderTotal = res.data.result.total || 0;
				} else {
					if (!append) {
						this.orderList = [];
					}
					this.orderTotal = 0;
				}

				uni.hideLoading();
			}).catch(err => {
				console.error('获取可申请纠纷订单列表失败：', err);
				this.orderLoading = false;
				this.isComplete = true;
				if (!append) {
					this.orderList = [];
				}
				uni.hideLoading();
				uni.showToast({
					title: '获取订单列表失败',
					icon: 'none'
				});
			});
		},

		// 判断是否可以申请
		canApply(item) {
			return !item.isProcessed && !item.isComplaining;
		},

		// 申请交易纠纷
		applyComplaint: function(item) {
			if (!this.canApply(item)) {
				uni.showToast({
					title: '该订单无法申请交易纠纷',
					icon: 'none'
				});
				return;
			}
			
			uni.navigateTo({
				url: `/pages/profile/complaint/insert?orderSn=${item.orderSn}&afterSaleSn=${item.afterSaleSn}&goodsId=${item.goodsId}&skuId=${item.skuId}&afterSaleId=${item.afterSaleId || ''}`
			});
		},

		// 获取投诉类型
		getComplaintType(item) {
			if (item.serviceType === 'RETURN_GOODS') {
				return '退货';
			} else if (item.serviceType === 'EXCHANGE_GOODS') {
				return '换货';
			} else if (item.serviceType === 'RETURN_MONEY') {
				return '退款';
			} else {
				return '交易纠纷';
			}
		},

		// 处理投诉状态
		handleComplainStatus(complainStatus) {
			switch (complainStatus) {
				case 'NEW':
					return '等待商家举证';
				case 'WAIT_ARBITRATION':
					return '等待平台仲裁';
				case 'COMPLETE':
					return '完成';
				case 'CANCEL':
					return '已取消';
				default:
					return '处理中';
			}
		},

		// 获取状态描述
		getStatusDescription(complainStatus) {
			switch (complainStatus) {
				case 'NEW':
					return '商家正在核实您的申请，请耐心等待';
				case 'WAIT_ARBITRATION':
					return '平台正在审核您的申请，请耐心等待结果';
				case 'COMPLETE':
					return '服务已完成，感谢您对中品维度的支持';
				case 'CANCEL':
					return '您已取消此次交易纠纷申请';
				default:
					return '您的申请正在处理中，请耐心等待';
			}
		},

		// 切换查询类型
		handlerChange: function (e) {
			let eIndex = e.currentTarget.dataset.index
			this.curTab = eIndex
			this.searchKeyword = '';
			this.loadBaseData();
		},

		// 执行取消投诉
		handlerCancel: function (e) {
			let eId = this.arrData[e.index].id
			uni.showModal({
				title: "谨慎操作",
				content: "您确定要撤销投诉吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						clearComplain(eId).then((res) => {
							if (res.data.success) {
								uni.showToast({
									title: "已撤销",
									duration: 2000,
									icon: "none",
								});
								this.loadBaseData();
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
							}
						});
					}
				},
			});
		},

		// 跳转继续举证
		handlerContinue: function (e) {
			let eId = this.arrData[e.index].id
			uni.navigateTo({
				url: '/pages/profile/complaint/continue?id=' + eId
			})
		},

		// 跳转投诉详情
		handlerDetail: function (index) {
			let eId = this.arrData[index].id
			uni.navigateTo({
				url: '/pages/profile/complaint/detail?id=' + eId
			})
		},

		// 搜索输入监听
		onSearchInput() {
			// 防抖处理，避免频繁请求
			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
			}
			this.searchTimer = setTimeout(() => {
				this.params.pageNumber = 1;
				this.arrData = [];
				this.loadBaseData();
			}, 500);
		},
	},
	onLoad: function (options) {
		this.envWinTopPX = uni.getWindowInfo().windowTop
		uni.setNavigationBarTitle({
			title: "交易纠纷"
		})
		// 如果有tab参数，则设置当前tab
		if (options.tab) {
			// this.curTab = parseInt(options.tab)
		}
		// 如果有tab参数，则设置当前tab
		if (options.tab) {
			this.curTab = parseInt(options.tab)
		}
		if(options.sn) {
			this.orderParams.keywords = options.sn
		}
	},
	onShow: function () {
		this.arrData = []
		this.params.pageNumber = 1
		this.params.pageSize = uni.getStorageSync("pageConfig")?.complaintListSize || 10;
		// 加载投诉信息
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

	.search-box {
		padding: 20rpx;

		.search-input {
			display: flex;
			align-items: center;
			background-color: #fff;
			border-radius: 40rpx;
			padding: 10rpx 30rpx;

			input {
				flex: 1;
				height: 60rpx;
				font-size: 28rpx;
				margin-left: 10rpx;
			}
		}
	}

	.complaint-list, .record-list {
		padding: 0 20rpx;
	}

	.complaint-item, .record-item {
		background-color: #fff;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
	}

	.order-info, .service-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10rpx;

		.order-number, .service-number {
			font-size: 28rpx;
			color: #333;
		}

		.order-status, .service-action {
			font-size: 28rpx;
			color: #EE0A24;
		}

		.service-label {
			font-size: 28rpx;
			color: #666;
		}
	}

	.order-time {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.goods-info {
		display: flex;
		margin-bottom: 20rpx;

		.goods-image {
			width: 140rpx;
			height: 140rpx;
			background-color: #f8f8f8;
			border-radius: 8rpx;
		}

		.goods-detail {
			flex: 1;
			margin-left: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.goods-quantity {
				font-size: 26rpx;
				color: #999;
			}
		}
	}

	.invalid-tip {
		font-size: 24rpx;
		color: #FF9900;
		background-color: #FFF9EC;
		padding: 16rpx;
		border-radius: 8rpx;
		margin-top: 16rpx;
	}

	.complaint-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 20rpx;
		padding-top: 16rpx;
		border-top: 1px solid #f5f5f5;

		.apply-btn {
			color: #EE0A24;
			font-size: 30rpx;
			padding: 10rpx 30rpx;
			background-color: #fff;
			border-radius: 6rpx;
			border: 1px solid #EE0A24;

			&.disabled {
				color: #c8c9cc;
				border-color: #ebedf0;
				background-color: #f7f8fa;
			}
		}
	}

	.service-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1px solid #f5f5f5;

		.status-box {
			flex: 1;
			background-color: #f8f8f8;
			padding: 16rpx;
			border-radius: 8rpx;
		}

		.status-tag {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			margin-bottom: 8rpx;
		}

		.status-message {
			font-size: 24rpx;
			color: #999;
		}

		.action-btn {
			margin-left: 20rpx;

			/deep/ .u-button {
				border-radius: 4rpx;
				border: 1px solid #dcdee0;
				color: #333;
				font-size: 28rpx;
				height: 64rpx;
				line-height: 64rpx;
				padding: 0 32rpx;
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

	.complaint-type {
		font-size: 28rpx;
		color: #EE0A24;
		font-weight: bold;
	}

	.service-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		border-bottom: 1px solid #f5f5f5;
		padding-bottom: 16rpx;

		.service-number {
			font-size: 28rpx;
			color: #666;
		}

		.service-action {
			font-size: 28rpx;
			color: #EE0A24;
		}
	}

	.load-more {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 8rpx;
		margin: 20rpx 20rpx 0;

		text {
			font-size: 28rpx;
			color: #333;
		}
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 8rpx;
		margin: 20rpx 20rpx 0;

		text {
			font-size: 28rpx;
			color: #333;
		}
	}
}
</style>
