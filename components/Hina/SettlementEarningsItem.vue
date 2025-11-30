<template>
    <view class="cpn">
        <view class="hd">
            <view class="line">
                <view class="lab">订单编号：</view>
                <view class="txt">{{ settlement.orderSn }}</view>
            </view>
            <view class="line">
                <view class="lab">完成时间：</view>
                <view class="txt">{{ settlement.completeTime }}</view>
            </view>
        </view>
        <view class="ft">
            <view class="txt">待结算<span class="price-icon">￥</span><span class="num">{{ settlement.estimatedRevenue }}</span></view>
        </view>
    </view>
</template>

<script>
export default {
    name: '',
    components: {},
    props: {
        settlement: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.cpn {
    background: #fff;
    border-radius: 12rpx;
    padding: 0 20rpx;
    .hd {
        position: relative;
        padding: 16rpx 0;
        .line {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 48rpx;
            line-height: 48rpx;
			font-size: 26rpx;
            .lab {
                color: #999;
                position: relative;
            }
            .txt {
                color: #666;
            }
        }
        &::after {
            position: absolute;
            content: '';
            left: 0;
            right: 0;
            bottom: 0;
            height: 3rpx;
            background: #e7e7e7;
        }
    }

    .ft {
        height: 96rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .txt {
            font-size: 24rpx;
            color: #999;
        }
        .price-icon {
            color: #e22221;
            font-size: 24rpx;
            font-weight: 700;
			margin-left: 20rpx;
        }
        .num {
            color: #e22221;
            font-size: 30rpx;
            font-weight: 700;
        }
    }
}
</style>
