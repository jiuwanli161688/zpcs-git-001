<template>
	<view class="container">
		<view class="box-wrap" v-if="isComplete">
			<view class="line" v-for="(item, index) in arrCounter" :key="index">
				<view class="inf">
					<view class="lab">{{ item.lab }}交易额</view>
					<view class="num">({{ item.num }}笔)</view>
				</view>
				<view class="rmb">￥{{ item.rmb | unitPrice }}</view>
			</view>
			<view class="link">
				<view class="lnk-item">
					<view class="btn-fast" @tap="getToday(0)">今日</view>
				</view>
				<view class="lnk-item">
					<view class="btn-fast" @tap="getToday(1)">昨日</view>
				</view>
				<view class="lnk-item">
					<view class="btn-fast" @tap="getToday(2)">前日</view>
				</view>
				<view class="lnk-lang">
					<view class="btn-fast" @tap="getToday(14)">最近15天订单</view>
				</view>
			</view>
			<view class="form">
				<view class="txt">
					<image class="icon" :src="iconCalendar" mode="aspectFit"></image>
					<picker mode="multiSelector" :value="pickerValue" :range="pickerRange" @change="bindPickerDate">
						<view class="in-picker" :class="{ 'in-picker_place': queryDate.length == 0 }">{{
							queryDate.length == 0 ? '请选择' : queryDate }}</view>
					</picker>

				</view>
				<view class="lnk" @tap="handlerQuery">查询</view>
			</view>
		</view>
	</view>
</template>

<script>

import { statistics } from "../../api/dealerCenter";

export default {
	name: '',
	components: {

	},
	computed: {
		sData: function () {
			return this.getDate('s');
		},
		eData: function () {
			return this.getDate('e');
		}
	},
	data() {
		return {
			isComplete: false,
			iconCalendar: `${this.iconCommon}/static/v1/common/icon-calendar.png`,
			arrCounter: [],
			queryDate: '',
			startDate: '',
			endDate: '',
			pickerValue: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
			pickerRange: [
				Array.from({ length: 15 }, (_, i) => {
					const date = new Date();
					date.setDate(date.getDate() + i - 15);
					return date.toISOString().substr(0, 10);
				}),
				Array.from({ length: 15 }, (_, i) => {
					const date = new Date();
					date.setDate(date.getDate() + i);
					return date.toISOString().substr(0, 10);
				}),
			]

		}
	},
	methods: {
		// 跳转结果
		handlerQuery: function () {
			if (this.queryDate == '') {
				this.$u.toast('请选择日期')
				return
			}
			uni.navigateTo({
				url: '/pages/dealerCenter/orderResult?createTime=' + this.startDate + '&endTime=' + this.endDate
			})
		},
		// 选择日期
		bindPickerDate: function (e) {
			let timeCompare = this.pickerRange[0][e.detail.value[0]] > this.pickerRange[1][e.detail.value[1]]
			if (timeCompare) {
				this.$u.toast('开始时间不能大于结束时间')
				return
			}
			this.startDate = this.pickerRange[0][e.detail.value[0]]
			this.endDate = this.pickerRange[1][e.detail.value[1]]
			this.queryDate = this.pickerRange[0][e.detail.value[0]] + ' -- ' + this.pickerRange[1][e.detail.value[1]]
		},
		// 生成日期
		getDate: function (type) {
			const date = new Date()
			let sYear = date.getFullYear()
			let sMonth = date.getMonth() + 1
			let sDay = date.getDate()
			if (type === 's') {
				sYear = '1940'
				sMonth = '01'
				sDay = '01'
			}
			return `${sYear}-${sMonth}-${sDay}`
		},

		// 加载交易统计
		loadBaseData: function () {
			this.isComplete = true
			statistics().then(res => {
				let data = res.data
				if (data.code == 200 && data.success) {
					this.arrCounter.push({ lab: '今日', num: data.result.todayOrderNum, rmb: data.result.todayPrice })
					this.arrCounter.push({ lab: '昨天', num: data.result.yesterdayOrderNum, rmb: data.result.yesterdayPrice })
					this.arrCounter.push({ lab: '前天', num: data.result.beforeOrderNum, rmb: data.result.beforePrice })
					this.arrCounter.push({ lab: '最近15天', num: data.result.fifteenOrderNum, rmb: data.result.fifteenPrice })
				}
			})
		},
		getToday(num) {
			if (num != 14) {
				const today = new Date();
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - num);
				this.queryDate = this.formatDate(yesterday) + ' -- ' + this.formatDate(yesterday)
				this.startDate = this.formatDate(yesterday);
				this.endDate = this.formatDate(yesterday);
			} else {
				this.queryDate = this.pickerRange[0][0] + ' -- ' + this.pickerRange[1][0];
				this.startDate = this.pickerRange[0][0];
				this.endDate = this.pickerRange[1][0];
			}
		},
		formatDate(date) {
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			return `${year}-${month}-${day}`;
		},

	},
	onLoad: function () {
		// 加载交易统计
		this.loadBaseData()

	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	box-sizing: border-box;
	min-height: 100vh;
	padding: 20rpx;

	.box-wrap {
		background: #FFF;
		border-radius: 12rpx;
		padding: 0 20rpx;

		.line {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			position: relative;

			&::after {
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				height: 3rpx;
				background: #EBEDF0;
				bottom: 0;
			}

			.inf {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 26rpx;

				.lab {
					color: #666;
				}

				.num {
					color: #FC8D00;
				}
			}

			.rmb {
				color: #EE1009;
				font-size: 26rpx;
			}
		}

		.link {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			margin: 0 -10rpx;

			.lnk-item {
				flex: 1;
				-ms-flex: 0 0 20%;
				flex: 0 0 20%;
				max-width: 20%;
				box-sizing: border-box;
				padding: 0 10rpx;
			}

			.lnk-lang {
				flex: 1;
				-ms-flex: 0 0 40%;
				flex: 0 0 40%;
				max-width: 40%;
				box-sizing: border-box;
				padding: 0 10rpx;
			}

			.btn-fast {
				border-radius: 6rpx;
				font-size: 26rpx;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				box-sizing: border-box;
				border: 3rpx solid #dedede;
			}
		}

		.form {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 0 20rpx;

			.txt {
				width: calc(100vw - 40rpx - 40rpx - 20rpx - 160rpx);
				height: 72rpx;
				box-sizing: border-box;
				border: 3rpx solid #dedede;
				border-radius: 6rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 0 20rpx;

				.icon {
					width: 32rpx;
					height: 32rpx;
					margin: 0 16rpx 0 0;
				}

				.in-picker {
					width: calc(100vw - 40rpx - 40rpx - 20rpx - 160rpx - 40rpx - 32rpx - 16rpx);
					height: 72rpx;
					line-height: 72rpx;
					font-size: 26rpx;
					box-sizing: border-box;
					text-align: left;
				}

				.in-picker_place {
					color: #A3A3A3 !important;
					font-weight: 400 !important;
				}

			}

			.lnk {
				width: 160rpx;
				height: 72rpx;
				line-height: 72rpx;
				background: #E22221;
				text-align: center;
				font-size: 26rpx;
				color: #FFF;
				border-radius: 6rpx;
			}

		}

		.mask {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.5);


			.times {
				position: fixed;
				top: 50%;
				margin-top: -250rpx;
				width: 100%;
				height: 500rpx;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;


				.btn-close {
					background-color: #E22221;
					color: #fff;
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 10rpx;
					position: absolute;
					right: 3%;
					top: 3%;
				}

				.sure {
					position: absolute;
					bottom: 10%;
					right: 8%;
				}

			}
		}
	}
}
</style>