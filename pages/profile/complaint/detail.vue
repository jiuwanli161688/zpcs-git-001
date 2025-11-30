<template>
	<view class="container">
		<!-- 投诉状态 -->
		<view class="wrap-state" v-if="isComplete">
			<image class="icon" :src="iconStatus" mode="aspectFit"></image>
			<view class="text">{{ statusText }}</view>
		</view>
		<!-- 商品信息 -->
		<view class="wrap-alone" v-if="isComplete">
			<view class="bd">
				<view class="icon" :style="{ background: 'url(' + objComplaint.goodsImage + ')' }"></view>
				<view class="base">
					<view class="txt">{{ objComplaint.goodsName }}</view>
					<view class="sku">
						<text class="sku-item">{{ objComplaint.sku }}</text>
					</view>
					<view class="inf">
						<view class="price">￥{{ objComplaint.goodsPrice | unitPrice }}</view>
						<view class="count">×{{ objComplaint.buyCount }}</view>
					</view>
				</view>
			</view>
			<view class="ft">
				<view class="lab">实付</view>
				<view class="txt">{{ objComplaint.flowPrice | unitPrice }}</view>
			</view>
		</view>

		<!-- 投诉内容 -->
		<view class="wrap-service">
			<view class="name">投诉信息</view>
			<view class="info">
				<view class="rs">
					<view class="lab">订单单号</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.orderSn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">售后单号</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.afterSaleSn }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">客户诉求</view>
					<view class="inf">
						<view class="txt">{{ serviceType }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab" v-if="serviceType == '[退货]'">退货数量</view>
					<view class="lab" v-if="serviceType == '[换货]'">换货数量</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.num }}</view>
					</view>
				</view>
				<view class="rs" v-if="serviceType == '[退货]' && objComplaint.expectRefundPrice">
					<view class="lab">退款金额</view>
					<view class="inf">
						<view class="num">￥{{ objComplaint.expectRefundPrice }}</view>
					</view>
				</view>
				<view class="rs" v-if="serviceType == '[退货]' && objComplaint.expectRefundPoints">
					<view class="lab">退款积分</view>
					<view class="inf">
						<view class="num">{{ objComplaint.expectRefundPoints }} 积分</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">投诉主题</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.complaintTheme }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">问题描述</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.description }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">提交日期</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.createTime }}</view>
					</view>
				</view>
				<view class="rs" v-if="complaintImages.length > 0">
					<view class="lab">相关截图</view>
				</view>
				<view class="ic" v-if="complaintImages.length > 0">
					<view class="ic-item" v-for="(item, index) in complaintImages" :key="index" v-if="item">
						<video class="ico" :src="item" v-if="item.slice(-3) === 'mp4'" id="myVideo" controls
							@play="handlePlay" objectFit="contain"></video>

						<image v-else class="ico" :src="item" mode="aspectFill" @tap="preview(complaintImages, index)">
						</image>
					</view>
				</view>
			</view>
		</view>
		<!-- 客户举证后：后续买卖双方的举证循环显示 -->
		<view class="wrap-service" v-for="(item, index) in objComplaint.orderComplaintEvidenceVOList" :key="index">
			<view class="name">{{ item.type == 'BUYER' ? '客户回复' : '商家回复' }}</view>
			<view class="info">
				<view class="rs">
					<view class="lab">问题描述</view>
					<view class="inf">
						<view class="txt">{{ item.description }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">提交日期</view>
					<view class="inf">
						<view class="txt">{{ item.createTime }}</view>
					</view>
				</view>
				<template v-if="item.imgs">
					<view class="rs">
						<view class="lab">相关截图</view>
					</view>
					<view class="ic">
						<view class="ic-item" v-for="(items, index) in item.imgs" :key="index">
							<image class="ico" :src="items" mode="aspectFill" @tap="preview(item.imgs, index)">
							</image>
						</view>
					</view>
				</template>
			</view>
		</view>
		<!-- 状态为已完成时不显示按钮容器 -->
		<view class="wrap-control" v-if="objComplaint.complainStatus != 'COMPLETE'">
			<!-- 状态为【等待商家举证、等待平台仲裁】时显示 -->
			<template v-if="objComplaint.complainStatus == 'WAIT_ARBITRATION' || objComplaint.complainStatus == 'NEW'">
				<view class="lnk-common lnk-primary" @tap="handlerContinue">继续举证</view>
				<view class="lnk-common lnk-secondary" @tap="handlerCancel">取消投诉</view>
			</template>
		</view>
		<!-- 平台仲裁 -->
		<view class="wrap-service" v-if="objComplaint.complainStatus == 'COMPLETE'">
			<view class="name">平台仲裁</view>
			<view class="info">
				<view class="rs">
					<view class="lab">仲裁时间</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.arbitrationTime }}</view>
					</view>
				</view>
				<view class="rs">
					<view class="lab">仲裁结果</view>
					<view class="inf">
						<view class="txt">{{ getArbitrationResultLabel(objComplaint.arbitrationResult) }}</view>
					</view>
				</view>
				<view class="rs"
					v-if="objComplaint.arbitrationResult == 'AGREE_REFUND_RETURN_SHIP' || objComplaint.arbitrationResult == 'AGREE_EXCHANGE_SHIP'">
					<view class="lab">商品处理</view>
					<view class="inf">
						<view class="txt">{{ getGoodsHandlingLabel(objComplaint.arbitrationResult) }}</view>
					</view>
				</view>
				<view class="rs"
					v-if="objComplaint.arbitrationResult == 'AGREE_REFUND_RETURN_SHIP' || objComplaint.arbitrationResult == 'AGREE_REFUND_NO_SHIP'">
					<view class="lab">退款方式</view>
					<view class="inf">
						<view class="txt">原路退回</view>
					</view>
				</view>
				<view class="rs"
					v-if="objComplaint.arbitrationResult == 'AGREE_REFUND_RETURN_SHIP' || objComplaint.arbitrationResult == 'AGREE_REFUND_NO_SHIP'">
					<view class="lab">退款金额</view>
					<view class="inf">
						<view class="num">￥{{ objComplaint.applyRefundPrice | unitPrice }}</view>
					</view>
				</view>
				<!-- 仲裁备注说明 -->
				<view class="rs" v-if="objComplaint.refusalReason">
					<view class="lab">备注说明</view>
					<view class="inf">
						<view class="txt">{{ objComplaint.refusalReason }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="lnk-chat" @tap="goIm">
			<image class="ico" :src="iconChat" mode="aspectFit"></image>
			<view class="txt">还有疑问？点击这里咨询客服</view>
		</view>
	</view>
</template>

<script>
import { getComplainDetail, clearComplain } from "@/api/after-sale";
import { createChatPool } from "../../../api/im";

export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			iconBasePath: `${this.iconCommon}/static/v1/sales`,
			iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
			objComplaint: {},
			complaintImages: []
		}
	},
	computed: {
		statusText() {
			const statusText = {
				'NEW': '等待商家举证',
				'WAIT_ARBITRATION': '等待平台仲裁',
				'COMPLETE': '平台完成仲裁',
				'CANCEL': '客户取消投诉',
			};
			return statusText[this.objComplaint.complainStatus] || '';
		},
		// 投诉状态图标
		iconStatus() {
			const iconStatus = {
				'NEW': `${this.iconBasePath}/icon-process.png`,
				'WAIT_ARBITRATION': `${this.iconBasePath}/icon-process.png`,
				'COMPLETE': `${this.iconBasePath}/icon-complete.png`,
				'CANCEL': `${this.iconBasePath}/icon-complete.png`,
			};
			return iconStatus[this.objComplaint.complainStatus] || '';
		},

		// 售后类型
		serviceType() {
			const serviceType = {
				'RETURN_GOODS': '[退货]',
				'EXCHANGE_GOODS': '[换货]',
			};
			return serviceType[this.objComplaint.serviceType] || '';
		},

	},
	methods: {
		// 跳转im页面
		goIm() {
			createChatPool().then(res => {
				if (res.data.code == 200) {
					uni.navigateTo({
						url: `/pages/Im/Chat?complaintId=${this.objComplaint.id}&storeId=${this.objComplaint.storeId}&memberId=${this.objComplaint.memberId}`
					});
				}
			})
		},
		/**
		 * 点击图片放大或保存
		 */
		preview(urls, index) {
			uni.previewImage({
				current: index,
				urls: urls,
				longPressActions: {
					itemList: ["保存图片"],
					success: function (data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function (err) {
						console.log(err.errMsg);
					},
				},
			});
		},
		// 获取仲裁结果标签文本
		getArbitrationResultLabel(result) {
			switch (result) {
				case 'REJECT_REFUND_RETURN':
					return '拒绝退款退货';
				case 'REJECT_EXCHANGE':
					return '拒绝换货';
				case 'AGREE_REFUND_RETURN_SHIP':
					return '同意退款，买家寄回';
				case 'AGREE_REFUND_NO_SHIP':
					return '同意退款，无需寄回';
				case 'AGREE_EXCHANGE_NO_SHIP':
					return '同意换货，无需寄回';
				case 'AGREE_EXCHANGE_SHIP':
					return '同意换货，买家寄回';
				default:
					return '';
			}
		},
		// 获取商品处理方式标签文本
		getGoodsHandlingLabel(result) {
			switch (result) {
				case 'REJECT_REFUND_RETURN':
					return '邮寄退回';
				case 'AGREE_REFUND_RETURN_SHIP':
				case 'AGREE_EXCHANGE_SHIP':
					return '买家寄回';
				case 'REJECT_EXCHANGE':
				case 'AGREE_REFUND_NO_SHIP':
				case 'AGREE_EXCHANGE_NO_SHIP':
					return '无需退回';
				default:
					return '';
			}
		},
		// 加载投诉信息
		loadBaseData: function () {
			uni.showLoading({
				title: "加载中",
			});
			getComplainDetail(this.id).then((res) => {
				if (res.data.success) {
					this.isComplete = true
					this.objComplaint = res.data.result;
					this.complaintImages = this.objComplaint.images ? this.objComplaint.images.split(',') : []
				} else {
					uni.showToast({
						title: res.data.message,
						duration: 2000,
						icon: "none",
					});
				}
				if (this.$store.state.isShowToast) { uni.hideLoading() };
			});
		},

		// 跳转继续举证
		handlerContinue: function () {
			uni.navigateTo({
				url: '/pages/profile/complaint/continue?id=' + this.objComplaint.id
			})
		},
		// 执行取消投诉
		handlerCancel: function () {
			uni.showModal({
				title: "谨慎操作",
				content: "您确定要撤销投诉吗？",
				confirmText: "确定",
				confirmColor: "#FF0000",
				cancelText: "取消",
				success: (res) => {
					if (res.confirm) {
						clearComplain(this.objComplaint.id).then((res) => {
							if (res.data.success) {
								uni.showToast({
									title: "已撤销",
									duration: 2000,
									icon: "none",
								});
								this.loadBaseData()
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
		handlePlay() {
			const videoContext = uni.createVideoContext("myVideo", this);
			videoContext.requestFullScreen({ direction: 0 }); // direction 参数表示屏幕方向（0 表示竖屏，90 表示横屏）
		}
	},
	onLoad: function (options) {
		this.id = options.id
		// 设置页面标题为"服务进度"
		uni.setNavigationBarTitle({
			title: "服务进度"
		})
	},
	onShow: function () {
		// 加载投诉信息
		this.loadBaseData()
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
}

.lnk-chat {
	background: #E22221;
	margin: 24rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 12rpx;

	.ico {
		width: 40rpx;
		height: 40rpx;
	}

	.txt {
		padding: 0 0 0 16rpx;
		color: #FFF;
		font-size: 26rpx;
	}
}
</style>