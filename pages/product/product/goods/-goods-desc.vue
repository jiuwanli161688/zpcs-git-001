<template>
    <view class="recommend-box">
        <h4 class="goods-recommend-title">售后服务</h4>
        <view class="content">
            <view class="content-box">
                <view class="text-box">
                    <image class="icon" :src="iconA" mode="aspectFill"></image>
                    <view class="txt">平台承诺</view>
                </view>
                <view class="desc">{{ objService.promiseDescription }}</view>
            </view>
            <view class="content-box">
                <view class="text-box">
                    <image class="icon" :src="iconC" mode="aspectFill"></image>
                    <view class="txt">正品行货</view>
                </view>
                <view class="desc">{{ objService.authenticDescription }}</view>
            </view>
           <!-- <view class="content-box">
                <view class="text-box">
                    <image class="icon" :src="iconD" mode="aspectFill"></image>
                    <view class="txt">配送说明</view>
                </view>
                <view class="desc">当前配送区域：{{ freightArea.supported }}</view>
                <view class="desc" v-if="freightArea.unsupported">暂不配送区域：{{ freightArea.unsupported }}</view>
            </view> -->
            <view class="content-box">
                <view class="text-box">
                    <image class="icon" :src="iconB" mode="aspectFill"></image>
                    <view class="txt">{{ objService.serve }}</view>
                </view>
                <view class="desc">{{ serviceDesc }}</view>
            </view>

        </view>
    </view>
</template>

<script>
export default {
    props: ["objService", "serviceDesc",'freightArea'],
    data() {
        return {
            iconA: "/static/icon-tips_1.png",
            iconB: "/static/icon-tips_2.png",
            iconC: "/static/icon-tips_3.png",
            iconD: "/static/icon-tips_4.png",

        }
    }
}
</script>

<style lang="scss" scoped>
@import "../product.scss";

.content {
    display: flex;
    flex-direction: column;

    .content-box {
        display: flex;
        flex-direction: column;
        margin: 20rpx 0;
        font-family: Arial, Helvetica, sans-serif;

        .text-box {
            display: flex;

            .icon {
                width: 50rpx;
                height: 50rpx;
                padding: 0 10rpx;
            }

            .txt {
                color: #f00;
                font-size: 30rpx;
                font-weight: bold;
                padding-top: 5rpx;
            }


        }

        .desc {
            padding-top: 8rpx;
            padding-left: 68rpx;
            word-wrap: break-word;
            font-size: 24rpx;
            color: #333;
        }


    }


}
</style>