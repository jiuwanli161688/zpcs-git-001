<template>
    <view class="message-item user-msg">
        <view class="user-message">
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>
.message-item {

    margin: 20rpx 0;

    .user-message {
        max-width: 80%;
        background-color: #FFEBEB;
        padding: 24rpx;
        border-radius: 16rpx;
        font-size: 24rpx;
        color: #333333;
    }
}

.user-msg {
    display: flex;
    flex-direction: row-reverse;
}
</style>