<template>
    <view class="container">
        <view class="wrapper">
            <view class="box-base" :style="{ background: 'url(' + iconHeader + ')' }" v-if="objBase.isComplete">
                <view class="hd" @tap="goIntegral">
                    <view class="l">当前剩余</view>
                    <view class="r">
                        <image class="ico" :src="iconIntegral" mode="aspectFit"></image>
                        <view class="num">积分：{{ objBase.point ? objBase.point : 0 }}</view>
                    </view>
                </view>
                <view class="bd">
                    <view class="text">{{ objBase.memberWallet | unitPrice }}</view>
                    <view class="lock">冻结金额：{{ objBase.memberFrozenWallet | unitPrice }}元</view>
                </view>
                <view class="lk">
                    <!-- <view class="item">
                        <view class="btn-common btn-secondary" @tap="handlerRecharge">我要充值</view>
                    </view> -->
                    <view class="item">
                        <view class="btn-common btn-primary" @tap="handlerCashOut">我要提现</view>
                    </view>
                    <view class="item">
                        <view class="btn-common btn-secondary" @tap="goMyBank">管理我的银行卡</view>
                    </view>
                </view>
            </view>
            <!-- <view class="lnk-common lnk-primary" @tap="goMyBank">管理我的银行卡</view> -->
            <view class="tit-name">
                <view class="title">最近交易流水</view>
                <view class="arrow" @tap="handlerArrow">更多</view>
            </view>
            <empty-box v-if="objData.isComplete && objData.arrData.length == 0" text="暂无资金流水" />
            <view class="box-list" v-if="objData.isComplete && objBase.isComplete">
                <view class="item" v-for="(item, index) in objData.arrData" :key="index">
                    <rec-number :rec="item" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import EmptyBox from '@/components/Hina/EmptyBox'
import RecNumber from '@/components/Hina/RecNumber'
import { getUserWallet, getWalletLog, getUserInfo } from '@/api/members.js'

export default {
    name: '',
    components: {
        EmptyBox,
        RecNumber
    },
    data() {
        return {
            isComplete: false,
            iconIntegral: `${this.iconCommon}/static/v1/wallet/icon-integral.png`,
            iconHeader: `${this.iconCommon}/static/v1/wallet/bg.png`,
            // 基本信息
            objBase: {
                isComplete: false, // 是否查询完成
                integral: 0, // 当前积分
                memberWallet: 0, // 剩余余额
                memberFrozenWallet: 0 // 冻结金额
            },
            // 最新流水
            objData: {
                isComplete: false,
                arrData: []
            },
            params: {
                pageNumber: 1,
                pageSize: 10
            }
        }
    },
    methods: {
        // 余额信息
        loadBaseData: function () {
            getUserWallet().then((res) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.code == 200) {
                    this.objBase = res.data.result
                    this.objBase.isComplete = true
                }
            })
        },
        // 跳转积分页面
        goIntegral() {
            uni.navigateTo({ url: '/pages/profile/wallet/integral' })
        },
        // 如果进行实名认证跳转银行卡页面否则跳转实名认证界面
        goMyBank() {
            getUserInfo().then(res => {
                if (res.data.result.authenticationFlag) {
                    uni.navigateTo({ url: '/pages/profile/wallet/bankAccount' })
                } else {
                    uni.navigateTo({ url: '/pages/config/security/authentication?type=1' })
                }
            })
            //
        },
        // 最新流水
        loadRecordData: function () {
            getWalletLog(this.params).then((res) => {
                if (res.data.success) {
                    this.objData.isComplete = true
                    if (res.data.result.records.length != 0) {
                        this.objData.arrData.push(...res.data.result.records)
                        this.objData.arrData.forEach(item => {
                            item.serviceTypeText = this.handleServiceType(item.serviceType)
                        });
                    }
                }
            })
        },
        // 处理提现类型
        handleServiceType(serviceType) {
            switch (serviceType) {
                case 'WALLET_WITHDRAWAL':
                    return '余额提现'
                    break
                case 'WALLET_PAY':
                    return '余额支付'
                    break
                case 'WALLET_REFUND':
                    return '余额退款'
                    break
                case 'WALLET_RECHARGE':
                    return '余额充值'
                    break
                case 'WALLET_COMMISSION':
                    return '佣金提成'
                    break
                default:
                    break
            }
        },
        // 我要提现
        handlerCashOut: function () {
            uni.navigateTo({
                url: '/pages/profile/wallet/operator'
            })
        },

        // 我要充值
        handlerRecharge: function () {
            uni.navigateTo({
                url: '/pages/profile/wallet/recharge'
            })
        },

        // 查看更多
        handlerArrow: function () {
            uni.navigateTo({
                url: '/pages/profile/wallet/transaction'
            })
        }
    },
    onLoad: function () {
    },
    onShow: function () {
        // 余额信息
        this.loadBaseData()
        this.objData.arrData = [];
        this.params.pageNumber = 1;
		this.params.pageSize = uni.getStorageSync("pageConfig")?.flowListSize || 10;
        // 最新流水
        this.loadRecordData()
    },
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: 100vh;
    box-sizing: border-box;

    .wrapper {
        padding: 20rpx 20rpx 0;
        background: #fff;

        .box-base {
            background-position: top center !important;
            background-size: cover !important;
            background-repeat: no-repeat;
            height: 360rpx;
            border-radius: 12rpx;
            padding: 0 30rpx;
            margin: 0 0 20rpx;
            color: #fff;

            .hd {
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 120rpx;

                .l {
                    font-size: 28rpx;
                }

                .r {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    .ico {
                        width: 32rpx;
                        height: 32rpx;
                    }

                    .num {
                        padding: 0 0 0 12rpx;
                        font-size: 28rpx;
                    }
                }
            }

            .bd {
                display: flex;
                justify-content: flex-start;
                align-items: baseline;
                padding: 0 0 30rpx;

                .text {
                    font-size: 56rpx;
                    font-weight: 600;
                }

                .lock {
                    padding: 0 0 0 12rpx;
                    font-size: 28rpx;
                }
            }

            .lk {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0 -16rpx;

                .item {
                    flex: 1;
                    -ms-flex: 0 0 50%;
                    flex: 0 0 50%;
                    max-width: 50%;
                    box-sizing: border-box;
                    padding: 0 16rpx;

                    .btn-common {
                        box-sizing: border-box;
                        font-size: 28rpx;
                        font-weight: 600;
                        height: 88rpx;
                        line-height: 88rpx;
                        border: 3rpx solid #fff;
                        border-radius: 88rpx;
                        text-align: center;
                    }

                    .btn-primary {
                        background: #fff;
                        color: #e22221;
                    }

                    .btn-secondary {
                        background: transparent;
                    }
                }
            }
        }

        .tit-name {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 96rpx;
            line-height: 96rpx;
            padding: 0 0 0 20rpx;
            position: relative;

            &::after {
                position: absolute;
                content: '';
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 6rpx;
                height: 40rpx;
                border-radius: 6rpx;
                background: #e22221;
            }

            .title {
                font-size: 30rpx;
                color: #333;
                font-weight: 600;
            }

            .arrow {
                font-size: 26rpx;
            }
        }
    }

    .box-list {
        background: #fff;

        .item {
            position: relative;

            &::after {
                position: absolute;
                content: '';
                left: 0;
                right: 0;
                bottom: 0;
                height: 3rpx;
                background: #e7e7e7;
            }

            &:last-of-type {
                &::after {
                    display: none;
                }
            }
        }
    }
}
</style>
