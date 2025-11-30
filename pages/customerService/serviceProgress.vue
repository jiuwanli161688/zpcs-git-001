<template>
    <view class="container">
        <view class="tab-comm" :style="{ top: `${envWinTopPX}px` }">
            <view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
                :data-index="index" @tap="handlerChange">
                <view class="text">{{ item.name }}</view>
            </view>
        </view>
        <!-- 其他tab内容 -->
        <view v-if="arrTab[curTab].tag == 'ALL'">
            <view class="box-null" v-if="isComplete && arrData.length == 0">
                <empty-box text="暂无售后申请记录" />
            </view>
            <view class="box-list">
                <view class="item" v-for="(item, index) in arrData" :key="index">
                    <sales-item :index="index" :sales="item" @door="handlerDoorExpress" @self="handlerSelfExpress"
                        @detail="handlerDetail" @cancel="cancelSales" />
                </view>
            </view>
        </view>
        <view v-if="arrTab[curTab].tag == 'BACKPHONE'">
            <view class="phone-appointment" v-if="bookingData.length > 0">
                <view class="order-card" v-for="(item, index) in bookingData" :key="index" @click="bookingDataDetail(item)">
                    <view class="time">
                        <view class="left">申请时间：{{ item.createTime }}</view>
                        <view class="right">
                            咨询类型：<text class="consultation-type">{{ consultationTypeObj[item.consultationType] }}</text>
                        </view>
                    </view>
                    <view class="info goods-child-info">
                        <!-- <u-avatar class="avatar" :src="item.thumbnail" mode="scaleToFill‌‌" size="144"></u-avatar> -->
                        <view class="text">
                            <text class="name">{{ item.consultationContent }}</text>
                            <!-- <text class="state" :class="item.status">{{ consultationStateObj[item.status] }}</text> -->
                        </view>
                    </view>
                    <view class="time item-bottom">
                        <view class="left">回电号码:{{ item.phoneNumber }}</view>
                        <view class="right" :class="item.status">{{ consultationStateObj[item.status] }}</view>
                    </view>
                </view>
            </view>
            <view class="phone-appointment-none" v-else>
                ~暂无数据~
            </view>
        </view>

        <view v-if="arrTab[curTab].tag == 'DISPUTE'" class="dispute">
            <view class="box-null" v-if="disputeData.length == 0">
                <empty-box text="暂无交易纠纷申请记录" />
            </view>

            <view class="record-list" v-else>
                <view class="record-item" v-for="(item, index) in disputeData" :key="index">
                    <view class="service-info">
                        <view class="service-number">服务单号：{{ item.complaintSn || item.sn }}</view>
                        <view class="complaint-type">{{ getComplaintType(item) }}</view>
                    </view>
                    <view class="goods-info">
                        <image
                            :src="item.goodsImage || (item.orderItem && item.orderItem.thumbnail ? item.orderItem.thumbnail : '/static/default_image.png')"
                            class="goods-image" mode="aspectFill"></image>
                        <view class="goods-detail">
                            <view class="goods-name">{{ item.orderItem && item.orderItem.goodsName ?
                                item.orderItem.goodsName : item.goodsName }}</view>
                            <view class="goods-quantity">数量：{{ item.orderItem && item.orderItem.num ? item.orderItem.num
                                : 1 }}</view>
                        </view>
                    </view>
                    <view class="service-footer">
                        <view class="status-box">
                            <view class="status-tag">{{ handleComplainStatus(item.complainStatus) }}</view>
                            <view class="status-message">{{ getStatusDescription(item.complainStatus) }}</view>
                        </view>
                        <view class="action-btn">
                            <u-button type="default" size="mini" @tap="handlerDisDetail(index)">查看服务单</u-button>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import EmptyBox from "@/components/Hina/EmptyBox";
import SalesItem from "@/components/Hina/SalesItemForUser";
import { getAfterSaleList, cancelAfterSale } from "@/api/after-sale.js";
import {
    getScheduledCallBack,
} from '@/api/customer.js'
import storage from '@/utils/storage.js' //缓存
import { getComplain } from "@/api/after-sale";

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
                { tag: 'ALL', name: '售后记录' },
                { tag: 'BACKPHONE', name: '回电记录' },
                { tag: 'DISPUTE', name: '纠纷记录' }
            ],
            curTab: 0,

            arrData: [],
            intPageCode: 1,						// 当前页面
            intResTotal: 0,						// 记录总数
            disputeTotal: 0,						// 记录总数
            params: {
                pageNumber: 1,
                pageSize: 10,
            },
            envWinTopPX: 0,// 导航栏高度
            temp: false,     		//如果页面触底和onShow同时触发，让页面触底后触发
            searchOrderSn: '',
            applyList: [],
            applyPage: 1,
            applyTotal: 0,
            applyLoading: false,
            userInfoObj: storage.getUserInfo(), // 用户信息
            consultationTypeObj: {
                ORDER: '订单类型',
                // CALLBACK: '售后类型' ,
                AFTER_SALE: '售后类型',
                ACCOUNT: '账户类型',
                OTHER: '其他类型',
            }, // 咨询类型
            consultationStateObj: {
                CANCEL: '已取消',
                CALLED_BACK: '已回电',
                WAIT_CALL_BACK: '待回电',
            }, // 咨询状态
            bookingDataParams: {
                memberId: '', // 
                pageSize: 10,
                pageNum: 1,
            }, // 预约回电 Params
            bookingDataPages: 0, //预约回电列表 总数
            bookingData: [], // 预约回电列表 数据
            disputeData: [], // 纠纷记录
            disputeParams: {
                pageNumber: 1,
                pageSize: 10,
            },
        }
    },
    methods: {
        // 加载售后信息
        loadBaseData: function () {
            let eCode = this.arrTab[this.curTab].tag				// 查询类型
            let params = { ...this.params, tag: eCode }
            getAfterSaleList(params).then((res) => {
                this.isComplete = true
                let data = res.data.result.records;
                if (data.length > 0) {
                    this.arrData.push(...data);
                }
                this.intResTotal = res.data.result.total;
                this.temp = false;
            });


        },

        // 切换查询类型
        handlerChange: function (e) {
            let eIndex = e.currentTarget.dataset.index
            this.curTab = eIndex
            this.params.pageNumber = 1
            this.bookingDataParams.pageNumber = 1
            this.disputeParams.pageNumber = 1
            this.intResTotal = 0
            this.disputeTotal = 0
            this.bookingDataPages = 0
            this.disputeData = []
            this.bookingData = []
            this.arrData.splice(0, this.arrData.length)
            if (this.arrTab[eIndex].tag == 'ALL') {
                this.loadBaseData()
            }
            if (this.arrTab[eIndex].tag == 'BACKPHONE') {
                this.getScheduledCallBackEve()
            }
            if (this.arrTab[eIndex].tag == 'DISPUTE') {
                this.loadBaseDisData()
            }
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
                url: '/pages/profile/afterSales/detail?afterSaleSn=' + eId
            })

        },

        //取消售后
        cancelSales(e) {
            let eId = this.arrData[e.index].sn
            uni.showModal({
                title: "提示",
                content: "是否取消售后",
                success: (res) => {
                    if (res.confirm) {
                        cancelAfterSale(eId).then(res => {
                            if (res.data.code == 200) {
                                this.arrData.splice(e.index, 1)
                                uni.navigateTo({
                                    url: '/pages/profile/afterSales/home'
                                })
                            }
                        })
                    }

                }
            })

        },
        // 跳转预约回电详情详情页
        bookingDataDetail(e) {
            uni.navigateTo({
                url: `/pages/customerService/phone?scheduledCallBackId=${e.id}`
            })
        },
        // 获取预约回电数据列表
        getScheduledCallBackEve() {
            this.bookingDataParams.memberId = this.userInfoObj.id
            getScheduledCallBack(this.bookingDataParams).then(res => {
                if (res.data.code == 200) {
                    this.bookingData.push(...res.data.data.records)
                    this.bookingDataPages = res.data.data.pages
                }
            })
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
        // 跳转投诉详情
        handlerDisDetail: function (index) {
            let eId = this.disputeData[index].id
            uni.navigateTo({
                url: '/pages/profile/complaint/detail?id=' + eId
            })
        },
        // 加载投诉信息
        loadBaseDisData: function () {
            // 加载已申请的纠纷记录
            let status = '';  // 空表示获取全部记录
            let params = {
                ...this.disputeParams,
                status: status
            };

            uni.showLoading({
                title: "加载中",
            });

            getComplain(params).then((res) => {
                this.isComplete = true;
                if (res.data.success) {
                    let data = res.data.result.records;
                    if (data.length > 0) {
                        this.disputeData = data
                    } else {
                        this.arrData = [];
                    }
                    this.disputeTotal = res.data.result.total;
                    console.log('disputeData', this.disputeData);
                } else {
                    this.disputeData = [];
                    this.disputeTotal = 0;
                }
                uni.hideLoading();
            }).catch(err => {
                console.error('Error fetching complaints:', err);
                this.disputeData = [];
                this.disputeTotal = 0;
                uni.hideLoading();
            });
        },
    },
    onLoad: function () {
        this.envWinTopPX = uni.getWindowInfo().windowTop
    },
    onShow: function () {
        this.arrData = []
        this.params.pageNumber = 1
        this.params.pageSize = uni.getStorageSync("pageConfig")?.afterSaleListSize || 10;
        if (this.arrTab[this.curTab].tag == 'ALL') {
            this.loadBaseData()
        }
        if (this.arrTab[this.curTab].tag == 'BACKPHONE') {
            this.getScheduledCallBackEve()
        }
        if (this.arrTab[this.curTab].tag == 'DISPUTE') {
            this.loadBaseDisData()
        }
    },
    onReachBottom: function () {
        if (this.intResTotal > this.arrData.length && !this.temp && this.arrTab[this.curTab].tag == 'ALL') {
            this.params.pageNumber++;
            this.temp = 1;
            this.loadBaseData();
        }
        if (this.bookingDataParams.pageNum != this.bookingDataPages && this.arrTab[this.curTab].tag == 'BOOKING') {
            this.bookingDataParams.pageNum += 1
            this.getScheduledCallBackEve()
        }
        if (this.disputeTotal > this.disputeData.length && this.arrTab[this.curTab].tag == 'DISPUTE') {
            this.disputeParams.pageNumber++
            this.loadBaseDisData()
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

    .apply-card {
        background: #fff;
        border-radius: 16rpx;
        margin: 24rpx 24rpx 0 24rpx;
        padding: 24rpx;
        box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.04);

        .order-title {
            font-size: 26rpx;
            color: #888;
            margin-bottom: 18rpx;
        }

        .apply-sku-row {
            display: flex;
            align-items: center;
            margin-bottom: 18rpx;

            .sku-img {
                width: 96rpx;
                height: 96rpx;
                border-radius: 8rpx;
                background: #f5f5f5;
                margin-right: 18rpx;
            }

            .sku-info {
                flex: 1;

                .sku-name {
                    font-size: 28rpx;
                    color: #222;
                    font-weight: 500;
                    margin-bottom: 8rpx;
                }

                .sku-price {
                    font-size: 24rpx;
                    color: #FF4D4F;
                }
            }

            .sku-btn {
                min-width: 120rpx;
                text-align: right;
            }
        }
    }
}

.phone-appointment {
    padding: 20rpx 0;

    .order-card {
        background: #ffffff;
        border-radius: 16rpx;
        padding: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 20rpx;

        .time {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16rpx;

            .left,
            .right {
                display: flex;
                align-items: center;
                font-size: 24rpx;
            }

            .left {
                color: #333333;
            }

            .right {
                color: #333333;
                margin-right: 24rpx;

                .consultation-type {
                    color: #0000ff;
                }
            }
        }

        .item-bottom {
            margin-top: 8px;
            margin-bottom: 0;

            .WAIT_CALL_BACK {
                color: #189CF9;
            }

            .CALLED_BACK {
                color: #02b207;
            }

            .CANCEL {
                color: #E40B25;
            }
        }

        .info {
            display: flex;
            gap: 16rpx;

            image {
                width: 96rpx;
                height: 96rpx;
                background-color: #ffffff;
            }

            .avatar {
                padding: 0;
            }

            .text {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                color: #333333;
                width: 100%;

                .name {
                    padding-right: 8rpx;
                    font-size: 28rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .state {
                    font-size: 28rpx;
                }
            }
        }

        .goods-child-info {
            padding: 20rpx 0;
            border-top: 2px solid #ececec;
            border-bottom: 2px solid #ececec;
        }

        .info-first {
            border-top: 2px solid transparent;
        }
    }

}

.phone-appointment-none {
    margin-top: 60rpx;
    text-align: center;
    color: #c5c5c5;
}

.dispute {
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

    .complaint-list,
    .record-list {
        padding: 0 20rpx;
    }

    .complaint-item,
    .record-item {
        background-color: #fff;
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        padding: 20rpx;
    }

    .order-info,
    .service-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;

        .order-number,
        .service-number {
            font-size: 28rpx;
            color: #333;
        }

        .order-status,
        .service-action {
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
