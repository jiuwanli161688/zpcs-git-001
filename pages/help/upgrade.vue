<template>
    <view class="upgrade-container">
        <view class="upgrade-content">
            <!-- 红色图标 -->
            <view class="icon-container">
                <view class="icon-wrapper">
                    <image :src="upgradeIcon" mode="aspectFit"></image>
                </view>
            </view>
            <!-- 标题 -->
            <view class="title">系统升级通知</view>
            <!-- 分割线 -->
            <view class="divider"></view>
            <!-- 消息内容 -->
            <view class="message">
                <text class="message-text">抱歉! 9月8日晚22点至9月9日早8点系统正在升级中,请耐心等待升级完成。中品维度商城将继续为您提供优质服务。</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'Upgrade',
    data() {
        return {
            upgradeIcon: `${this.iconCommon}/static/upgrade/upgrade-icon.png`,
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.upgrade-container {
    min-height: 100vh;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 20rpx;
}

.upgrade-content {
    width: 100%;
    height: 1378rpx;
    text-align: center;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 60rpx 32rpx;
}

.icon-container {
    margin-bottom: 40rpx;
}

.icon-wrapper {
    display: inline-block;
    width: 78rpx;
    height: 78rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
}

.icon {
    font-size: 60rpx;
    color: #ff6b6b;
    width: 78rpx;
    height: 78rpx;
}

.title {
    font-size: 48rpx;
    font-weight: bold;
    color: #E22221;
    margin-bottom: 30rpx;
    line-height: 1.2;
    position: relative;
    display: inline-block;
    z-index: 2;
}

.title::after {
    content: '';
    position: absolute;
    bottom: -8rpx;
    left: -20rpx;
    width: calc(100% + 40rpx);
    height: 60%;
    background: #FFE8E8;
    z-index: -1;
    border-radius: 6rpx;
}

.divider {
    width: 100%;
    height: 2rpx;
    background: linear-gradient(to right, transparent, #ffb3b3, transparent);
    border-top: 2rpx dashed #ffb3b3;
    margin: 30rpx 0 40rpx 0;
}

.message {
    text-align: left;
    padding: 0 20rpx;
}

.message-text {
    display: block;
    font-size: 32rpx;
    color: #666666;
    line-height: 1.8;
    margin-bottom: 10rpx;
    word-break: break-all;
    text-indent: 2em;
}
</style>