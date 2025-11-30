<template>
    <!-- <view class="fixedd" v-if="visible" @tap="tapMessage">{{ message }}</view> -->
    <view class="fixedd" v-if="visible"  @tap="tapMessage">
        <image class="logo" mode="heightFix" :src="messageLogo" style="width: 100%;"></image>
        <view class="message-content">
            <view class="message-title">消息通知</view>
            <view>收到一条新消息，立即点击查看详情 > ></view>
        </view>
    </view>
</template>
<script>
import storage from '@/utils/storage.js';
export default {
    data() {
        return {
            visible: true,
            message: '',
            orderInfo: {},
            messageLogo: `${this.iconCommon}/static/message-logo.png`,
        };
    },
    mounted() {

    },
    methods: {
        show(message, duration = 2000) {
            this.message = message;
            this.visible = true;
            setTimeout(() => {
                this.visible = false;
            }, duration);
        },
        tapMessage() {
            this.orderInfo = storage.getOrderInfo()
            uni.navigateTo({
                url: `/pages/Im/Chat?orderSn=${this.orderInfo.orderSn}&storeId=${this.orderInfo.orderStoreId}&type=business&memberId=${this.orderInfo.memberId}`
            })
        }
    },
};
</script>
<style lang="scss" scoped>
.fixedd {
    position: fixed;
    top: 3%;
    left: 8%;
    text-align: center;
    width: 85%;
    color: #000;
    border-radius: 20rpx;
    font-size: 32rpx;
    z-index: 999999;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    opacity: 0.9;
    .logo{
        width: 72px;
        height: 72px;
    }
    .message-content{
        font-size: 28rpx;
        color: #999;
        text-align: left;
        padding-right: 20rpx;
        .message-title{
            font-size: 32rpx;
            color: #333;
        }
    }
}
</style>