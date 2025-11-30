<template>
    <view class="container">
        <!-- 等待 -->
        <view v-if="updateBankInfoFlag == '0'">
            <view class="status">
                <image class="icon" :src="iconWaiting" mode="aspectFit"></image>
                <view class="text">修改资料已提交，请您等待审核结果</view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
        </view>
        <!-- 成功 -->
        <view v-if="updateBankInfoFlag == '1'">
            <view class="status">
                <image class="icon" :src="iconSuccess" mode="aspectFit"></image>
                <view class="text">您已通过审核</view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
        </view>
        <!-- 成功 -->
        <!-- 注：申请成功信息不在这里显示 -->
        <!--
		<view class="status">
			<image class="icon" :src="iconSuccess" mode="aspectFit"></image>
			<view class="text">您的资料已通过审核，点击下一步线上签约</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerSigning">下一步</view>
		-->
        <!-- 失败 -->
        <view v-if="updateBankInfoFlag == '2'">
            <view class="status">
                <image class="icon" :src="iconFailed" mode="aspectFit"></image>
                <view class="text">审核失败：{{ reviewerReason }}</view>
            </view>
            <view class="lnk-common lnk-primary" @tap="handlerReback">重新填写</view>
        </view>
    </view>
</template>

<script>
import storage from '@/utils/storage.js'
import { getStoreInfo } from "@/api/store";


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
            reviewerReason: "",
            reviewTime: "",
            type: '',
            updateBankInfoFlag: ''
        }
    },
    methods: {
        // 返回用户中心
        handlerProfile: function () {
            uni.reLaunch({
                url: '/pages/tabbar/user/profile'
            })
        },

        // 跳转资料填写
        handlerReback: function () {
            if (this.type == '1') {
                uni.navigateTo({
                    url: '/pages/supplierCenter/information?text=1'
                })
            }
            if (this.type == '2') {
                uni.navigateTo({
                    url: '/pages/supplierCenter/foundation?text=1'
                })
            }
        },
    },
    onLoad: function (options) {
        this.type = options.type
        uni.showLoading({ title: "加载中" })
        getStoreInfo().then(res => {
            uni.hideLoading();
            if (res.data.code == 200) {
                this.updateBankInfoFlag = res.data.result.updateBankInfoFlag;
                if (this.updateBankInfoFlag == '2') {
                    this.reviewerReason = res.data.result.updateBankInfoRejectReason
                }
            } else {
                this.$u.toast(res.data.message);
            }
        })
    },
    onShow: function () {

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
