<template>
    <view class="container">
        <view class="wrap-service">
            <view class="info">
                <view class="rs">
                    <view class="lab">是否有未完成订单</view>
                    <view class="inf">
                        <view class="txt">{{ objCancel.hasUnsettledOrder == true ? '是' : '否' }}</view>
                    </view>
                </view>
                <view class="rs">
                    <view class="lab">是否有未完成售后</view>
                    <view class="inf">
                        <view class="txt">{{ objCancel.hasUnfinishedAfterSales == true ? '是' : '否' }}</view>
                    </view>
                </view>
                <view class="rs">
                    <view class="lab">是否有未提现金额</view>
                    <view class="inf">
                        <view class="txt">{{ objCancel.hasRemainderMoney == true ? '是' : '否' }}</view>
                    </view>
                </view>
                <view class="rs">
                    <view class="lab">是否有未完成投诉</view>
                    <view class="inf">
                        <view class="txt">{{ objCancel.hasUnfinishedComplaints == true ? '是' : '否' }}</view>
                    </view>
                </view>
                <view class="rs" v-if="!isSubmit">
                    <view class="txt" style="color:#FF0000">请先完成上面未完成事件在提交注销申请</view>
                </view>
            </view>
        </view>
        <view class="lnk-common lnk-primary" v-if="isSubmit" @tap="cancellation">下一步</view>
    </view>
</template>

<script>
import { cancelCheck, applyCancelDisAndSup } from "../../../api/login";
import storage from '@/utils/storage.js';

export default {
    name: '',
    data() {
        return {
            userInfo: storage.getUserInfo(),
            objCancel: {},
            isSubmit: true,
        }
    },
    methods: {
        cancellation() {
            uni.navigateTo({
                url: '/pages/config/security/userCancellation'
            })
        }
    },
    onLoad: function () {
        cancelCheck().then(res => {
            if (res.data.code == 200) {
                this.objCancel = res.data.result.selfMember;
                for (let key in this.objCancel) {
                    if (this.objCancel[key] == true) {
                        this.isSubmit = false;
                        break;
                    }
                }
            }
        })
    },
    onShow: function () {

    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #F1F1F1;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
}
</style>
