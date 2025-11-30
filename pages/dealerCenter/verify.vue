<template>
    <view class="container" v-if="isComplete">
        <!-- 等待 -->
        <view>
            <view v-if="objData.refreshFlag" class="timeout-container">
				<view class="timeout-header">
					<view class="timeout-icon">⚠️</view>
					<view class="timeout-content">
						<view class="timeout-title">验真信息即将过期</view>
						<view class="timeout-desc">当前验真信息即将过期/已过期，过期后作废，打款无效。</view>
					</view>
				</view>
				<button class="timeout-btn" @click="handleReGet">重新生成验真信息</button>
			</view>
            <view class="status">
                <view class="text">请联系公司财务在<span style="color:#FF5F5F">{{ objData.checkEndTime
                }}</span>前用对公账户向{{ objData.settlementBankInfoSetting.companyName
}}完成以下汇款，过期将失效。汇款完成后我们将1个工作日内完成处理，请您耐心等待。账户验真通过后验证金额将原路退还。</view>
            </view>
            <view class="frm-sign">
                <view class="frm-title">
                    <view class="name">请向以下账号汇入指定金额</view>
                </view>
            </view>
            <view class="content">
                <view class="item">
                    <view class="label">验证金额：</view>
                    <view class="value">
                        <view class="price">￥{{ objData.checkMoney }}</view>
                        <view class="txt">请汇入指定金额，非指定金额将验证失败</view>
                    </view>
                </view>
                <view class="item">
                    <view class="label">收款账号：</view>
                    <view class="value">
                        <view class="code">{{ objData.settlementBankInfoSetting.bankAccount }}
                            <button @click="copyCode" class="copy-btn">复制</button>
                        </view>
                        <view class="txt">每个开通账号对应的收款信息不同，请勿重复打款</view>
                    </view>
                </view>
                <view class="item">
                    <view class="label">开户银行：</view>
                    <view class="value">
                        <view class="text">{{ objData.settlementBankInfoSetting.bankName }}</view>
                    </view>
                </view>
                <view class="item">
                    <view class="label">收款公司名：</view>
                    <view class="value">
                        <view class="text">{{ objData.settlementBankInfoSetting.companyName }}</view>
                    </view>
                </view>
                <view class="hr"></view>
                <view class="item">
                    <view class="label"><span style="color:#FF5F5F">注意：</span>汇款需使用与主体一致的对公账号</view>
                </view>
                <view class="item">
                    <view class="label">汇款账户名称：</view>
                    <view class="value">
                        <view class="text">{{ objData.settlementBankBranchName }}</view>
                    </view>
                </view>
                <view class="item">
                    <view class="label">汇款银行账户：</view>
                    <view class="value">
                        <view class="text">{{ objData.settlementBankAccountNum }}</view>
                    </view>
                </view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerSure">我已转账</view>
        </view>
    </view>
</template>

<script>
import storage from '@/utils/storage.js'
import { getVerify, getVerifyPrice, reGetVerify } from "@/api/distributor";


export default {
    name: '',
    components: {

    },
    data() {
        return {
            isComplete: false,
            userInfo: storage.getUserInfo(),
            reviewReason: "",
            storeDisable: "",
            objData: {},
            source: '',
            distributorStatus: 0,// 验真状态 9已验真，不显示返回上一步按钮
        }
    },
    methods: {

        // 确认转账
        handlerSure: function () {
            getVerifyPrice(1).then(res => {
                if (res.data.code == 200) {
                    if (res.data.result == 'IN_PROGRESS') {
                        this.$u.toast('还未收到您的转账信息，请您确认已经转账,并耐心等待。', 3000)
                        return
                    }
                    if (res.data.result == 'VERIFIED') {
                       uni.redirectTo({
                            url: '/pages/dealerCenter/addSettlement'
                        })
                    }
                }
            })

        },
        copyCode: function () {
            uni.setClipboardData({
                data: this.objData.settlementBankInfoSetting.bankAccount,
                success: function () {
                    uni.showToast({
                        title: '复制成功',
                        icon: 'none'
                    })
                },
                fail: function () {
                    uni.showToast({
                        title: '复制失败',
                        icon: 'none'
                    })
                }
            })
        },
        handleReGet: function () {
			reGetVerify().then(res => {
				if (res.data.code == 200) {
					this.objData = { ...res.data.result }
				}else{
					this.$u.toast(res.data.message)
				}
			})
		},

    },
    onLoad: function (options) {
        this.source = options.source;
        this.distributorStatus = options.distributorStatus
    },
    onShow: function () {
        uni.showLoading({ title: "加载中" })
        getVerify(1).then(res => {
            uni.hideLoading();
            if (res.data.code == 200) {
                this.objData = res.data.result;
                this.isComplete = true
            } else {
                this.$u.toast(res.data.message);
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #FFF;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;

    .timeout-container {
        background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
        border: 2rpx solid #ff6b6b;
        border-radius: 16rpx;
        padding: 24rpx;
        margin-bottom: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.15);

        .timeout-header {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20rpx;

            .timeout-icon {
                font-size: 40rpx;
                margin-right: 16rpx;
                margin-top: 4rpx;
                flex-shrink: 0;
            }

            .timeout-content {
                flex: 1;

                .timeout-title {
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #d63031;
                    margin-bottom: 8rpx;
                    line-height: 1.4;
                }

                .timeout-desc {
                    font-size: 26rpx;
                    color: #e17055;
                    line-height: 1.5;
                }
            }
        }

        .timeout-btn {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
            color: #fff;
            border: none;
            border-radius: 12rpx;
            padding: 6rpx 24rpx;
            font-size: 26rpx;
            font-weight: 500;
            box-shadow: 0 4rpx 8rpx rgba(255, 107, 107, 0.3);
            width: 100%;
            box-sizing: border-box;
        }
    }

    .status {
        min-height: 320rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;


        .text {
            font-size: 26rpx;
            line-height: 72rpx;
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .item {
            display: flex;
            margin-bottom: 20rpx;

            .label {
                font-size: 28rpx;
                color: #514d4d
            }

            .value {
                display: flex;
                flex-direction: column;

                .price {
                    color: #FF5F5F;
                    font-size: 34rpx;
                }

                .txt {
                    font-size: 24rpx;
                    color: #877c7c
                }

                .code {
                    font-size: 30rpx;

                    .copy-btn {
                        height: 40rpx;
                        font-size: 26rpx;
                        line-height: 40rpx;
                        border: 1px solid #f00;
                        background-color: transparent;
                        color: #f00;
                        display: inline-flex;
                        margin-left: 20rpx;
                    }
                }

                .text {
                    font-size: 29rpx;
                }

            }
        }

        .hr {
            height: 1px;
            background-color: #cfcdcd;
            margin: 40rpx 0;
            margin-top: 20rpx;
        }
    }
}
</style>
