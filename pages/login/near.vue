<template>
	<view class="container">
		<view class="wrap-city" :style="{ top: `${envWinTopPX}px` }">
			<view class="this">
				<image class="icon" :src="iconLocation" mode="aspectFit"></image>
				<view class="text">{{ addresName }}</view>
			</view>
			<view class="more" @tap="showPicker">其他区域</view>
		</view>
		<view class="wrap-shop">
			<view class="list">
				<view class="item" v-for="(item, index) in arrData" :key="index">
					<dealer-item :dealer="item" :index="index"
						:checked="item.distributorNumber == curStoreDistributorNumber" @selected="handlerSelect" />
				</view>
			</view>
		</view>
		<view class="foot-checked">
			<view class="check" @tap="handlerBind">我要绑定选中的分平台服务商</view>
		</view>

		<m-city :provinceData="list" headTitle="区域选择" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="3">
		</m-city>
	</view>
</template>

<script>

import EmptyBox from "@/components/Hina/EmptyBox";
import DealerItem from "@/components/Hina/DealerItem";
import city from '@/components/m-city/m-city.vue';
import { distributorCheckInfo, distributorBind } from "@/api/login";

export default {
	name: "",
	components: {
		'm-city': city,
		EmptyBox,
		DealerItem
	},
	data() {
		return {
			isComplete: false,
			iconLocation: `${this.iconCommon}/static/v1/login/icon-location.png`,
			curStoreDistributorNumber: '',
			data: {

			},
			arrData: [],
			list: [
				{
					id: '',
					localName: '请选择',
					children: []
				}
			],
			addresName: '',
			intResTotal: 0,
			params: {
				pageNumber: 1,
				pageSize: 10,
				distributorStatus: '4'
			},
			envWinTopPX: 0,// 导航栏高度
		}
	},
	methods: {
		// 加载所在区域分平台服务商
		loadCityShop: function () {
			distributorCheckInfo(this.params).then(res => {
				if (res.data.code == 200) {
					this.arrData.push(...res.data.result.records);
					this.intResTotal = res.data.result.total
					if (this.arrData.length > 0) {
						this.curStoreDistributorNumber = this.arrData[0].distributorNumber
					}
				}
			})
		},

		// 选择分平台服务商
		handlerSelect: function (e) {
			this.curStoreDistributorNumber = e.distributorNumber
		},

		// 执行绑定返回我的
		handlerBind: function () {
			if (this.curStoreDistributorNumber == '') {
				this.$u.toast('请选择分平台服务商')
				return
			}
			distributorBind({ distributorNumber: this.curStoreDistributorNumber }).then(res => {
				let data = res.data
				if (data.code == 200 && data.success) {
					this.$u.toast('绑定成功');

					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/tabbar/user/profile'
						})
					}, 1500)
				} else {
					this.$u.toast(data.message)
				}
			})
		},

		// 显示三级地址联动
		showPicker() {
			this.$refs.cityPicker.show()
		},

		// 三级地址联动回调
		getpickerParentValue(e) {
			// 将需要绑定的地址设置为空，并赋值
			this.addresName = e[0].localName + ',' + e[1].localName + ',' + e[2].localName

			this.data = {
				companyProvinceId: e[0].id,
				companyCityId: e[1].id,
				companyCountryId: e[2].id,
			}
			this.arrData = []
			this.loadCityShop();
		},
	},
	onLoad: function () {
		this.arrData = [];
		this.loadCityShop();
		this.envWinTopPX = uni.getWindowInfo().windowTop
	},
	onShow: function () {

	},
	onReachBottom: function () {
		if (this.intResTotal > this.arrData.length) {
			this.params.pageNumber++
			this.loadCityShop();
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	padding-top: 0;
	padding-left: 0;
	padding-right: 0;
	padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx + 100rpx);
	padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx + 100rpx);

	.wrap-city {
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
		padding: 0 20rpx;

		&::before {
			position: absolute;
			content: '';
			left: 0;
			bottom: 0;
			right: 0;
			height: 3rpx;
			background: rgba(0, 0, 0, 0.06);
		}

		.this {
			flex: 1;
			line-height: 48rpx;
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.icon {
				width: 36rpx;
				height: 36rpx;
			}

			.text {
				margin: 0 0 0 12rpx;
				max-width: calc(100vw - 180rpx);
				font-size: 26rpx;
				color: #666;
			}
		}

		.more {
			color: #999;
			font-size: 26rpx;
		}
	}

	.wrap-shop {
		padding: 20rpx 0 0;

		.list {
			padding: 0 20rpx;

			.item {
				margin: 0 0 20rpx;

				&:last-of-type {
					margin: 0;
				}
			}
		}
	}

	.foot-checked {
		padding-top: 20rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: calc(constant(safe-area-inset-bottom) + 20rpx);
		padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
		position: fixed;
		z-index: 999;
		left: 0;
		right: 0;
		bottom: 0;

		.check {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			background: #E22221;
			color: #FFF;
			border-radius: 12rpx;
		}
	}
}
</style>
