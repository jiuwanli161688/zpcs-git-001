<template>
	<view class="container">
		<!-- Tabs -->
		<view class="tab-comm">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				@tap="handlerChange(index)">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>

        <!-- Search Bar -->
        <view class="search-bar">
            <view class="search-input-box">
                <u-icon name="search" color="#999" size="28"></u-icon>
                <input type="text" v-model="searchKeyword" placeholder="请输入订单号查询" class="input" confirm-type="search" @confirm="onSearch" />
            </view>
            <view class="search-btn" @tap="onSearch">查询</view>
        </view>

		<!-- Date Filter Bar -->
		<view class="filter-bar">
			<view class="date-range" @tap="showFilter = true">
				<view class="date-box">{{ startDate }}</view>
				<view class="separator">-</view>
				<view class="date-box">{{ endDate }}</view>
			</view>
			<view class="filter-btn" @tap="showFilter = true">
				<image class="icon" :src="iconFilter" mode="aspectFit"></image>
				<text>筛选</text>
			</view>
		</view>

		<!-- List -->
		<view class="list-content">
			<view class="item" v-for="(item, index) in filteredData" :key="index" @click="goDetail(item)">
				<view class="row">
					<text class="label">流水号</text>
					<text class="value">{{ item.flowNo }}</text>
				</view>
				<view class="row">
					<text class="label">订单号</text>
					<text class="value">{{ item.orderNo }}</text>
				</view>
				<view class="row">
					<text class="label">交易金额</text>
					<text class="value">¥ {{ item.amount }}</text>
				</view>
				<view class="row">
					<text class="label">交易时间</text>
					<text class="value">{{ item.time }}</text>
				</view>
				<view class="row">
					<text class="label">交易状态</text>
					<text class="value">{{ item.status }}</text>
				</view>
			</view>
            <view class="box-null" v-if="filteredData.length == 0">
                <u-empty text="暂无数据" mode="list"></u-empty>
            </view>
		</view>

		<!-- Filter Popup -->
		<u-popup v-model="showFilter" mode="bottom" border-radius="24">
			<view class="popup-content">
				<view class="popup-title">时间筛选</view>
				<view class="quick-select">
					<view class="tag" :class="{ active: quickSelectIndex === 0 }" @tap="selectQuick(0)">今日</view>
					<view class="tag" :class="{ active: quickSelectIndex === 1 }" @tap="selectQuick(1)">昨日</view>
					<view class="tag" :class="{ active: quickSelectIndex === 2 }" @tap="selectQuick(2)">近一周</view>
					<view class="tag" :class="{ active: quickSelectIndex === 3 }" @tap="selectQuick(3)">近一月</view>
				</view>
				<view class="date-picker-row">
					<view class="picker-box" :class="{ active: pickerType === 'start' && showDatePicker }" @tap="openPicker('start')">{{ tempStartDate || '开始日期' }}</view>
					<view class="separator">-</view>
					<view class="picker-box" :class="{ active: pickerType === 'end' && showDatePicker }" @tap="openPicker('end')">{{ tempEndDate || '结束日期' }}</view>
				</view>
				<view class="confirm-btn" @tap="confirmFilter">确定</view>
			</view>
		</u-popup>

        <u-picker v-model="showDatePicker" mode="time" :params="params" @confirm="onDateConfirm"></u-picker>
	</view>
</template>

<script>
import iconFilter from '@/static/cbd/filter.png';

export default {
	data() {
		return {
			iconFilter,
			curTab: 0,
			arrTab: [
				{ name: '全部' },
				{ name: '收入' },
                { name: '支出' }
			],
            searchKeyword: '',
			startDate: '2025-11-18 00:00:00',
			endDate: '2025-11-18 00:00:00',
			showFilter: false,
            showDatePicker: false,
            pickerType: 'start', // 'start' or 'end'
            params: {
				year: true,
				month: true,
				day: true,
				hour: false,
				minute: false,
				second: false
			},
            tempStartDate: '2025-09-20',
            tempEndDate: '2025-09-20',
            quickSelectIndex: 0,
			arrData: [
                // Mock Data
				{
					flowNo: 'D2045024',
					orderNo: 'D2045024',
					amount: '100.00',
					time: '2025-10-28 20:30:48',
					status: '成功',
                    type: 'income' // 收入
				},
				{
					flowNo: 'D2045025',
					orderNo: 'D2045025',
					amount: '200.00',
					time: '2025-10-29 10:30:48',
					status: '成功',
                    type: 'income' // 收入
				},
                {
					flowNo: 'D2045026',
					orderNo: 'D2045026',
					amount: '150.00',
					time: '2025-10-30 15:30:48',
					status: '成功',
                    type: 'expense' // 支出
				}
			]
		};
	},
    computed: {
        filteredData() {
            let data = this.arrData;
            
            // Tab Filter
            if (this.curTab === 1) { // Income
                data = data.filter(item => item.type === 'income');
            } else if (this.curTab === 2) { // Expense
                data = data.filter(item => item.type === 'expense');
            }
            
            // Search Filter
            if (this.searchKeyword) {
                data = data.filter(item => item.orderNo.includes(this.searchKeyword));
            }
            
            return data;
        }
    },
	methods: {
		handlerChange(index) {
			this.curTab = index;
		},
        onSearch() {
            // Triggered by search button or enter key
            console.log('Search:', this.searchKeyword);
        },
        selectQuick(index) {
            this.quickSelectIndex = index;
            const today = new Date();
            let start = new Date();
            let end = new Date();

            if (index === 0) { // Today
                // start and end are already today
            } else if (index === 1) { // Yesterday
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
            } else if (index === 2) { // Last Week
                start.setDate(today.getDate() - 7);
            } else if (index === 3) { // Last Month
                start.setMonth(today.getMonth() - 1);
            }

            this.tempStartDate = this.formatDate(start);
            this.tempEndDate = this.formatDate(end);
        },
        openPicker(type) {
            this.pickerType = type;
            this.showDatePicker = true;
        },
        onDateConfirm(e) {
            const dateStr = `${e.year}-${e.month}-${e.day}`;
            if (this.pickerType === 'start') {
                this.tempStartDate = dateStr;
            } else {
                this.tempEndDate = dateStr;
            }
        },
        confirmFilter() {
            this.startDate = this.tempStartDate + ' 00:00:00';
            this.endDate = this.tempEndDate + ' 00:00:00';
            this.showFilter = false;
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        goDetail(item) {
            uni.navigateTo({
                url: '/pages/mine/businessDistrict/flowDetail'
            });
        }
	},
    onLoad() {
        // Init dates
        this.selectQuick(0);
        this.confirmFilter();
    }
};
</script>

<style lang="scss" scoped>
.container {
	background: #F5F5F5;
	min-height: 100vh;
    padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

	.tab-comm {
		background: #fff;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1rpx solid #eee;

		.item {
			height: 100%;
			display: flex;
			align-items: center;
            position: relative;

			.text {
				font-size: 30rpx;
				color: #999;
			}

			&.item-hov {
				.text {
					color: #333;
					font-weight: bold;
				}
                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40rpx;
                    height: 6rpx;
                    background: #E22221;
                    border-radius: 3rpx;
                }
			}
		}
	}
    
    .search-bar {
        background: #fff;
        padding: 20rpx;
        display: flex;
        align-items: center;
        
        .search-input-box {
            flex: 1;
            background: #F5F5F5;
            height: 70rpx;
            border-radius: 35rpx;
            display: flex;
            align-items: center;
            padding: 0 30rpx;
            
            .input {
                flex: 1;
                font-size: 28rpx;
                margin-left: 20rpx;
                color: #333;
            }
        }
        
        .search-btn {
            margin-left: 20rpx;
            background: #FF0101;
            color: #fff;
            font-size: 28rpx;
            padding: 10rpx 30rpx;
            border-radius: 30rpx;
        }
    }

	.filter-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		background: #fff;
        margin-top: 1rpx; // Separator

		.date-range {
			display: flex;
			align-items: center;

			.date-box {
				border: 1rpx solid #E22221;
				border-radius: 10rpx;
				padding: 0 20rpx;
                height: 60rpx;
                line-height: 60rpx;
                display: flex;
                align-items: center;
                justify-content: center;
				font-size: 24rpx;
				color: #666;
			}

			.separator {
				margin: 0 10rpx;
				color: #999;
			}
		}

		.filter-btn {
			display: flex;
			align-items: center;
			color: #E22221;
			font-size: 28rpx;

			.icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}
		}
	}

	.list-content {
		padding: 20rpx;

		.item {
			background: #fff;
			border-radius: 18rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
            
            &:active {
                opacity: 0.8;
            }

			.row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 16rpx;
				font-size: 26rpx;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					color: #333;
				}

				.value {
					color: #999999;
                    text-align: right;
                    flex: 1;
                    margin-left: 20rpx;
				}
			}
		}
	}

	.popup-content {
		padding: 30rpx;
        background: #fff;

		.popup-title {
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.quick-select {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.tag {
				background: #F5F5F5;
				border-radius: 8rpx;
				font-size: 26rpx;
				color: #666;

				&.active {
					background: #FFF0F0;
					color: #E22221;
                    border: 1rpx solid #E22221;
				}
			}
		}

		.date-picker-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 40rpx;

			.picker-box {
				flex: 1;
				background: #F5F5F5;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 8rpx;
				font-size: 28rpx;
                border: 1rpx solid transparent;
                &.active {
                    border-color: #E22221;
                    background: #FFF0F0;
                    color: #E22221;
                }
			}

			.separator {
				margin: 0 20rpx;
				color: #999;
			}
		}

		.confirm-btn {
			background: #E22221;
			color: #fff;
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			border-radius: 44rpx;
			font-size: 32rpx;
		}
	}
}
</style>
