<template>
    <view class="container">
        <view class="tab-comm">
            <view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index" :data-index="index" @tap="handlerChange">
                <view class="text">{{ item.name }}</view>
            </view>
        </view>
        <view class="search-box">
            <view class="search-input">
                <view class="input-wrapper">
                    <u-icon class="input-icon" name="search" size="28" color="#969799"></u-icon>
                    <input
                        class="input-field"
                        type="text"
                        v-model="settlementNumber"
                        placeholder="请输入结算单编号"
                        @input="onSearchInput"
                    />
                    <u-icon
                        v-if="settlementNumber"
                        class="clear-icon"
                        name="close-circle-fill"
                        size="32"
                        color="#c8c9cc"
                        @click="clearSearch"
                    ></u-icon>
                </view>
                <view class="search-btn" :class="{ 'search-btn-loading': searchLoading }" @tap="handleSearch">
                    <text class="search-btn-text">{{ searchLoading ? '搜索中...' : '搜索' }}</text>
                </view>
            </view>
            <view class="search-content">
                <view class="date-range-display">
                    <view class="date-item" :class="{ placeholder: !startDate }">
                        {{ startDate }}
                    </view>
                    <text class="date-separator">——</text>
                    <view class="date-item" :class="{ placeholder: !endDate }">
                        {{ endDate }}
                    </view>
                </view>
                <view class="action-buttons">
                    <view class="filter-btn" @tap="handlerFilter">
                        <image class="filter-icon" :src="screeningIcon" mode="aspectFit"></image>
                        <text class="filter-text">筛选</text>
                    </view>
                    <view class="divider-line"></view>
                    <view class="add-btn" @tap="handlerAdd">
                        <image class="add-icon" :src="addIcon" mode="aspectFit"></image>
                        <text class="add-text">新增</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="box-null" v-if="isComplete && arrData.length == 0">
            <empty-box text="暂无结算信息记录" />
        </view>
        <view class="box-list" v-if="isComplete && arrData.length > 0">
            <view class="item" v-for="(item, index) in arrData" :key="index">
                <settlement-item :settlement="item" :index="index" @detail="handlerDetail" />
            </view>

            <!-- 加载更多提示 -->
            <view class="load-more" v-if="loading && arrData.length > 0">
                <text class="loading-text">正在加载...</text>
            </view>

            <!-- 没有更多数据提示 -->
            <view class="no-more" v-if="!hasMore && arrData.length > 0 && !loading">
                <text class="no-more-text">没有更多数据了</text>
            </view>
        </view>

        <!-- 日期筛选弹窗 -->
        <view class="date-popup-mask" v-if="showDatePopup" @tap="closeDatePopup">
            <view class="date-popup" @tap.stop>
                <view class="popup-header">
                    <text class="popup-title">时间筛选</text>
                </view>

                <view class="quick-select">
                    <view class="quick-btn" :class="{ active: selectedQuick === 'today' }" @tap="selectQuickDate('today')">今日</view>
                    <view class="quick-btn" :class="{ active: selectedQuick === 'yesterday' }" @tap="selectQuickDate('yesterday')">昨日</view>
                    <view class="quick-btn" :class="{ active: selectedQuick === 'week' }" @tap="selectQuickDate('week')">近一周</view>
                    <view class="quick-btn" :class="{ active: selectedQuick === 'month' }" @tap="selectQuickDate('month')">近一月</view>
                </view>

                <!-- 简化的日期选择区域 -->
                <view class="date-range-selector">
                    <view class="date-input-row">
                        <picker mode="date" :value="tempStartDate" @change="onStartDateChange">
                            <view class="date-input" :class="{ selected: focusedDateInput === 'start' }" @tap="onDateInputFocus('start')">
                                {{ tempStartDate || '开始日期' }}
                            </view>
                        </picker>
                        <text class="date-separator">—</text>
                        <picker mode="date" :value="tempEndDate" @change="onEndDateChange">
                            <view class="date-input" :class="{ selected: focusedDateInput === 'end' }" @tap="onDateInputFocus('end')">
                                {{ tempEndDate || '结束日期' }}
                            </view>
                        </picker>
                    </view>
                </view>

                <view class="popup-footer">
                    <view class="confirm-btn" @tap="confirmDateSelection">确定</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import EmptyBox from '@/components/Hina/EmptyBox'
import SettlementItem from '@/components/Hina/SettlementItem'
import { getSettlementManage } from '@/api/dealerCenter'
export default {
    name: '',
    components: {
        EmptyBox,
        SettlementItem
    },
    data() {
        return {
            isComplete: false,
            curTab: 0, // 当前选中的tab

            arrData: [],
            intPageCode: 1, // 当前页面
            intResTotal: 0, // 记录总数
            loading: false, // 加载状态
            hasMore: true, // 是否还有更多数据
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            envWinTopPX: 0, // 导航栏高度
            arrTab: [
                { tag: 'ALL', name: '全部' },
                { tag: 'WAIT_AUDIT', name: '待审核' },
                { tag: 'WAIT_INVOICE', name: '待上传发票' },
                { tag: 'AUDIT_FAIL', name: '审核未通过' },
                { tag: 'COMPLETED', name: '平台完成分账' }
            ],

            // 搜索相关数据
            settlementNumber: '', // 搜索关键词 结算单编号
            startDate: '', // 开始日期
            endDate: '', // 结束日期
            searchLoading: false, // 搜索按钮防重复点击状态

            // 弹窗相关数据
            showDatePopup: false, // 是否显示日期选择弹窗
            selectedQuick: '', // 当前选中的快捷选择
            tempStartDate: '', // 临时开始日期
            tempEndDate: '', // 临时结束日期
            focusedDateInput: '', // 当前聚焦的日期输入框：'start' 或 'end'
            addIcon: `${this.iconCommon}/static/settlement/add-icon.png`,
            screeningIcon: `${this.iconCommon}/static/settlement/screening.png`,
        }
    },
    methods: {
        // 切换查询类型
        handlerChange: function (e) {
            let eIndex = e.currentTarget.dataset.index
            this.curTab = eIndex
            this.arrData.splice(0, this.arrData.length)
            this.params.pageNumber = 1
            this.hasMore = true
            this.loading = false
            this.searchLoading = false // 重置搜索状态

            // 清除日期筛选参数和搜索关键词
            this.settlementNumber = ''
            delete this.params.startDate
            delete this.params.endDate

            this.loadBaseData()
        },
        // 新增结算单
        handlerAdd: function () {
            uni.navigateTo({
                url: `/pages/dealerCenter/addSettlement`
            })
        },
        // 筛选按钮点击事件 - 打开弹窗
        handlerFilter: function () {
            this.showDatePopup = true
            // 设置临时日期为当前选中的日期或默认日期
            this.tempStartDate = this.startDate || this.getCurrentDate()
            this.tempEndDate = this.endDate || this.getCurrentDate()
        },

        // 关闭弹窗
        closeDatePopup: function () {
            this.showDatePopup = false
            this.selectedQuick = ''
            this.focusedDateInput = '' // 清除焦点状态
        },

        // 快捷日期选择
        selectQuickDate: function (type) {
            this.selectedQuick = type
            this.focusedDateInput = '' // 清除焦点状态
            const today = new Date()
            let startDate, endDate

            switch (type) {
                case 'today':
                    startDate = endDate = this.formatDate(today)
                    break
                case 'yesterday':
                    const yesterday = new Date(today)
                    yesterday.setDate(today.getDate() - 1)
                    startDate = endDate = this.formatDate(yesterday)
                    break
                case 'week':
                    const weekAgo = new Date(today)
                    weekAgo.setDate(today.getDate() - 7)
                    startDate = this.formatDate(weekAgo)
                    endDate = this.formatDate(today)
                    break
                case 'month':
                    const monthAgo = new Date(today)
                    // 先设置为上个月的同一天
                    monthAgo.setMonth(today.getMonth() - 1)
                    // 如果上个月没有这一天（比如3月31日->2月31日不存在），会自动调整到下个月初
                    // 为了避免这种情况，我们需要处理月末的特殊情况
                    if (monthAgo.getMonth() !== (today.getMonth() - 1 + 12) % 12) {
                        // 如果月份不对，说明发生了溢出，设置为上个月的最后一天
                        monthAgo.setDate(0)
                    }
                    startDate = this.formatDate(monthAgo)
                    endDate = this.formatDate(today)
                    break
            }

            this.tempStartDate = startDate
            this.tempEndDate = endDate
        },

        // 开始日期改变
        onStartDateChange: function (e) {
            this.tempStartDate = e.detail.value
            this.selectedQuick = '' // 清除快捷选择状态
        },

        // 结束日期改变
        onEndDateChange: function (e) {
            this.tempEndDate = e.detail.value
            this.selectedQuick = '' // 清除快捷选择状态
        },

        // 日期输入框获得焦点
        onDateInputFocus: function (type) {
            this.focusedDateInput = type
        },

        // 确认日期选择
        confirmDateSelection: function () {
            if (!this.tempStartDate || !this.tempEndDate) {
                uni.showToast({
                    title: '请选择完整的日期范围',
                    icon: 'none'
                })
                return
            }

            if (new Date(this.tempStartDate) > new Date(this.tempEndDate)) {
                uni.showToast({
                    title: '开始时间不能大于结束时间',
                    icon: 'none'
                })
                return
            }

            // 应用选择的日期
            this.startDate = this.tempStartDate
            this.endDate = this.tempEndDate

            // 关闭弹窗
            this.closeDatePopup()

            // 重置数据并重新加载
            this.arrData.splice(0, this.arrData.length)
            this.params.pageNumber = 1
            this.hasMore = true
            this.loading = false
            this.params.startDate = this.startDate
            this.params.endDate = this.endDate
            this.loadBaseData()
        },

        // 获取当前日期
        getCurrentDate: function () {
            const today = new Date()
            return this.formatDate(today)
        },

        // 格式化日期
        formatDate: function (date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },

        // 初始化默认日期范围（过去90天）
        initDefaultDateRange: function () {
            const today = new Date()
            const ninetyDaysAgo = new Date(today)
            ninetyDaysAgo.setDate(today.getDate() - 90)

            this.startDate = this.formatDate(ninetyDaysAgo)
            this.endDate = this.formatDate(today)
        },

        // 搜索输入事件
        onSearchInput: function(e) {
            this.settlementNumber = e.detail.value
        },

        // 搜索按钮点击事件
        handleSearch: function() {
            // 防重复点击
            if (this.searchLoading) {
                return
            }

            if (!this.settlementNumber.trim()) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                })
                return
            }

            // 设置搜索状态为加载中
            this.searchLoading = true

            // 重置数据并重新加载
            this.arrData.splice(0, this.arrData.length)
            this.params.pageNumber = 1
            this.hasMore = true
            this.loading = false
            this.loadBaseData()
        },

        // 清空搜索
        clearSearch: function() {
            this.settlementNumber = ''
            this.searchLoading = false // 重置搜索状态
            this.arrData.splice(0, this.arrData.length)
            this.params.pageNumber = 1
            this.hasMore = true
            this.loading = false
            this.loadBaseData()
        },
        // 加载结算信息
        loadBaseData: function () {
            this.isComplete = true
            this.loading = true
            uni.showLoading({})

            // 构建请求参数，包含当前选中的tab状态
            let requestParams = {
                ...this.params,
                statusGroup: this.arrTab[this.curTab].tag
            }

            // 如果有日期筛选，添加到参数中
            if (this.startDate && this.endDate) {
                requestParams.startDate = this.startDate
                requestParams.endDate = this.endDate
            }

            // 如果有搜索关键词，添加到参数中
            if (this.settlementNumber && this.settlementNumber.trim()) {
                requestParams.settlementNumber = this.settlementNumber.trim()
            }

            getSettlementManage(requestParams).then((res) => {
                uni.hideLoading()
                this.loading = false
                this.searchLoading = false // 重置搜索状态
                if (res.data.code == 200) {
                    const records = res.data.result.records || []
                    records.forEach((item) => {
                        this.arrData.push({
                            id: item.id,
                            settlementNumber: item.settlementNumber,
                            settlementTotalAmount: item.settlementTotalAmount,
                            settlementStatus: item.settlementStatus,
                            settlementStatusDesc: item.settlementStatusDesc,
                            statusGroup: item.statusGroup,
                            createTime: item.createTime,
                            statusGroupDesc: item.statusGroupDesc,
                        })
                    })
                    this.intResTotal = res.data.result.total || res.data.total || 0

                    // 判断是否还有更多数据
                    this.hasMore = this.arrData.length < this.intResTotal
                }
            }).catch((error) => {
                uni.hideLoading()
                this.loading = false
                this.searchLoading = false // 重置搜索状态
                console.error('加载数据失败:', error)
            })
        },

        // 跳转结算详情
        handlerDetail: function (e) {
            let eId = this.arrData[e.index].id
            uni.navigateTo({
                url: `/pages/dealerCenter/settlementDetail?id=${eId}`
            })
        }
    },
    onLoad: function () {
        // 初始化默认日期范围（过去90天）
        this.initDefaultDateRange()

    },
    onShow: function () {
        this.arrData = []
        this.params.pageNumber = 1
        this.hasMore = true
        this.loading = false
        // 加载结算信息
        this.loadBaseData()
    },
    onReachBottom: function () {
        if (this.hasMore && !this.loading && this.intResTotal > this.arrData.length) {
            this.params.pageNumber++
            this.loadBaseData()
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: calc(100vh - var(--window-top));
    box-sizing: border-box;
    padding: 0 0 20rpx;
    .tab-comm {
        position: sticky !important;
        left: 0;
        right: 0;
        top: var(--window-top);
        background: #fff;
        height: 88rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
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
            .text {
                font-size: 26rpx;
                line-height: 88rpx;
                color: #999999;
            }
        }

        .item-hov {
            .text {
                color: #3D3D3D;
                font-weight: 600;
                position: relative;
                font-size: 28rpx;

                &::after {
                    position: absolute;
                    content: '';
                    left: 0;
                    bottom: 0;
                    right: 0;
                    height: 6rpx;
                    background: #ee0a24;
                    border-radius: 6rpx;
                }
            }
        }
    }

    .search-box {
        position: sticky;
        top: calc(var(--window-top) + 88rpx);
        z-index: 999;
        background: #fff;
        padding: 20rpx;
        border-radius: 12rpx;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);

        .search-input {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
            gap: 20rpx;

            .input-wrapper {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;

                .input-icon {
                    position: absolute;
                    left: 24rpx;
                    z-index: 1;
                    pointer-events: none;
                }

                .clear-icon {
                    position: absolute;
                    right: 24rpx;
                    z-index: 1;
                    cursor: pointer;
                }

                .input-field {
                    width: 100%;
                    height: 66rpx;
                    line-height: 66rpx;
                    padding: 0 64rpx 0 64rpx;
                    font-size: 26rpx;
                    color: #323233;
                    background: #f7f8fa;
                    border: 2rpx solid #e5e5e5;
                    border-radius: 33rpx;
                    box-sizing: border-box;
                    transition: all 0.3s ease;

                    &:focus {
                        border-color: #ee0a24;
                        background: #fff;
                    }

                    &::placeholder {
                        color: #969799;
                        font-size: 28rpx;
                    }
                }
            }

            .search-btn {
                height: 56rpx;
                padding: 0 32rpx;
                background: #ee0a24;
                border-radius: 33rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 4rpx 12rpx rgba(238, 10, 36, 0.3);

                &:active {
                    background: #d60a21;
                    transform: translateY(2rpx);
                    box-shadow: 0 2rpx 8rpx rgba(238, 10, 36, 0.4);
                }

                &.search-btn-loading {
                    background: #cccccc;
                    box-shadow: 0 4rpx 12rpx rgba(204, 204, 204, 0.3);
                    pointer-events: none;
                }

                .search-btn-text {
                    color: #ffffff;
                    font-size: 24rpx;
                }
            }
        }

        .search-content {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .date-range-display {
                flex: 1;
                display: flex;
                align-items: center;
                margin-right: 20rpx;

                .date-item {
                    padding: 0 10rpx;
                    flex: 1;
                    height: 60rpx;
                    line-height: 60rpx;
                    text-align: center;
                    font-size: 26rpx;
                    color: #666666;
                    background: #f7f8fa;
                    border-radius: 60rpx;
                    border: 2rpx solid #f0f0f0;

                    &.placeholder {
                        color: #999;
                    }
                }

                .date-separator {
                    font-size: 28rpx;
                    color: #969799;
                    margin: 0 16rpx;
                    font-weight: 500;
                }
            }

            .action-buttons {
                display: flex;

                .filter-btn,
                .add-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 60rpx;
                    padding: 0 10rpx;
                    font-size: 24rpx;

                    .filter-icon,
                    .add-icon {
                        width: 32rpx;
                        height: 32rpx;
                        margin-right: 6rpx;
                    }

                    .filter-text,
                    .add-text {
                        font-size: 24rpx;
                        font-weight: 500;
                    }
                }

                .divider-line {
                    width: 1rpx;
                    height: 24rpx;
                    background: #ee0a24;
                    margin: 0 12rpx;
                    align-self: center;
                }

                .add-btn {
                    margin-left: 0;
                }

                .filter-btn {
                    color: #ee0a24;

                    &:active {
                        opacity: 0.7;
                    }
                }

                .add-btn {
                    color: #ee0a24;

                    &:active {
                        opacity: 0.7;
                    }
                }
            }
        }
    }

    // 日期筛选弹窗样式
    .date-popup-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: flex-end;

        .date-popup {
            width: 100%;
            background: #ffffff;
            border-radius: 24rpx 24rpx 0 0;
            padding: 0;
            animation: slideUp 0.3s ease-out;

            .popup-header {
                padding: 32rpx 0 24rpx;
                text-align: center;

                .popup-title {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #323233;
                }
            }

            .quick-select {
                display: flex;
                margin: 20rpx;
                .quick-btn {
                    flex: 1;
                    height: 64rpx;
                    line-height: 64rpx;
                    text-align: center;
                    font-size: 26rpx;
                    color: #646566;
                    background: #f7f8fa;
                    border-radius: 8rpx;
                    transition: all 0.2s;
                    margin: 0 5px;
                    &.active {
                        background: #fff2f0;
                        color: #ee0a24;
                    }
                }
            }

            .date-range-selector {
                padding: 20rpx 26rpx;

                .date-input-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .date-input {
                        flex: 1;
                        height: 72rpx;
                        line-height: 72rpx;
                        text-align: center;
                        font-size: 28rpx;
                        color: #323233;
                        background: #f7f8fa;
                        border-radius: 8rpx;
                        border: 2rpx solid transparent;
                        padding: 0 16rpx;
                        box-sizing: border-box;
                        width: 300rpx;
                        &.selected {
                            border-color: #ee0a24;
                            background: #fff2f0;
                            color: #ee0a24;
                        }
                    }

                    .date-separator {
                        font-size: 28rpx;
                        color: #969799;
                        font-weight: 500;
                        margin: 0 20rpx;
                        flex-shrink: 0;
                    }
                }
            }

            .popup-footer {
                padding: 32rpx;

                .confirm-btn {
                    width: 100%;
                    height: 88rpx;
                    line-height: 88rpx;
                    text-align: center;
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #ffffff;
                    background: #ee0a24;
                    border-radius: 12rpx;

                    &:active {
                        background: #d60a21;
                    }
                }
            }
        }
    }

    @keyframes slideUp {
        from {
            transform: translateY(100%);
        }
        to {
            transform: translateY(0);
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

        // 加载更多样式
        .load-more {
            padding: 30rpx 0;
            text-align: center;

            .loading-text {
                font-size: 26rpx;
                color: #969799;
            }
        }

        // 没有更多数据样式
        .no-more {
            padding: 30rpx 0;
            text-align: center;

            .no-more-text {
                font-size: 26rpx;
                color: #969799;
            }
        }
    }
}
</style>
