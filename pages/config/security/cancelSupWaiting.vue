<template>
    <view class="container">
        <!-- 等待 -->
        <view v-if="objCancel.logoutStatus == '1'">
            <view class="status">
                <image class="icon" :src="iconWaiting" mode="aspectFit"></image>
                <view class="text">注销申请已提交，等待审核</view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
        </view>
        <view v-if="objCancel.logoutStatus == '5'">
            <view class="status">
                <image class="icon" :src="iconFailed" mode="aspectFit"></image>
                <view class="text">审核未通过</view>
            </view>
            <view class="wrap-service">
                <view class="info">
                    <view class="rs">
                        <view class="lab">原因</view>
                        <view class="inf">
                            <view class="txt">{{ objCancel.refuseRemark ? objCancel.refuseRemark : "暂无" }}</view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerReback">重新提交</view>
        </view>
        <view v-if="objCancel.logoutStatus == '2'">
            <view class="status">
                <image class="icon" :src="iconSuccess" mode="aspectFit"></image>
                <view class="text">初审通过（待财务审核）</view>
            </view>
            <view class="wrap-service">
                <view class="info">
                    <view class="rs">
                        <view class="lab">备注</view>
                        <view class="inf">
                            <view class="txt">{{ objCancel.initialApprovalRemark ? objCancel.initialApprovalRemark : "暂无" }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerReback">重新提交</view>
        </view>

        <view v-if="objCancel.logoutStatus == '3'">
            <view class="status">
                <view class="status">
                    <image class="icon" :src="iconSuccess" mode="aspectFit"></image>
                    <view class="text">财务审核通过</view>
                </view>
                <view class="wrap-service" style="background:#ececec;width:100%;border-radius: 10rpx;">
                    <view class="info">
                        <view class="rs">
                            <view class="lab">相关截图</view>
                        </view>
                        <view class="ic">
                            <image class="ico" :src="objCancel.financialDepositImg" mode="aspectFit"></image>
                        </view>
                        <view class="rs">
                            <view class="lab">备注</view>
                            <view class="inf">
                                <view class="txt">{{ objCancel.financialApprovalsRemark ? objCancel.financialApprovalsRemark
                                    : "暂无" }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerSubmit">确认注销</view>
        </view>

    </view>
</template>

<script>
import storage from '@/utils/storage.js'
import { getCancelRecord, cancelDisAndSup } from '@/api/login'

export default {
    name: '',
    components: {

    },
    data() {
        return {
            isComplete: false,
            iconSuccess: `${this.iconCommon}/static/v1/common/icon-success.png`,
            iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
            iconWaiting: `${this.iconCommon}/static/v1/common/icon-waiting.png`,
            userInfo: storage.getUserInfo(),
            objCancel: {},
        }
    },
    methods: {
        // 返回用户中心
        handlerProfile: function () {
            uni.reLaunch({
                url: '/pages/tabbar/user/profile'
            })
        },
        //重新注销
        handlerReback: function () {
            uni.navigateTo({
                url: '/pages/config/security/supplierCancellation'
            })
        },
        //确认注销
        handlerSubmit: function () {
            uni.showModal({
                title: '提示',
                content: '确认注销？您将无法再享受中品供应商商相关权益',
                success: (res) => {
                    if (res.confirm) {
                        uni.showLoading({ title: "加载中" })
                        cancelDisAndSup("1").then(res => {
                            uni.hideLoading();
                            if (res.data.code == 200) {
                                this.$u.toast("注销成功");
                                setTimeout(() => {
                                    uni.reLaunch({
                                        url: '/pages/tabbar/user/profile'
                                    })
                                }, 1000)
                            }
                        })
                    }
                }
            })
        }
    },
    onLoad: function () {

    },
    onShow: function () {
        uni.showLoading({ title: "加载中" })
        getCancelRecord("1").then(res => {
            uni.hideLoading();
            if (res.data.code == 200) {
                this.objCancel = res.data.result
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

    .status {
        min-height: 320rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .icon {
            width: 140rpx;
            height: 140rpx;
        }

        .text {
            font-size: 26rpx;
            line-height: 72rpx;
        }
    }
}
</style>
