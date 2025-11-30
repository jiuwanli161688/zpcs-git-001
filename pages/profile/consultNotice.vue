<template>
    <view class="container">
        <view class="content" v-for="item in noticeList" :key="item.id">
            <view class="bd">
                <view v-if="item.thumbnail" class="icon" :style="{ background: 'url(' + item.thumbnail + ')' }">
                </view>
                <view v-else class="icon-null">暂无图片</view>
                <view class="info" @tap="goNoticeDetail(item.id)">
                    <view class="title">{{ item.informationTitle }}</view>
                    <view class="txt">{{ item.abStract }}</view>
                    <view class="inf">
                        <view class="price">公告</view>
                        <view class="count">{{ item.releaseTime }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getNoticeList } from "../../api/home";
export default {
    name: '',
    data() {
        return {
            noticeList: []
        }
    },
    methods: {
        goNoticeDetail(id) {
            uni.navigateTo({
                url: '/pages/profile/noticeDetail?id=' + id
            })
        }
    },
    onLoad: function () {
        getNoticeList().then(res => {
            this.noticeList = res.data.result.records
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

.content {
    background: #FFF;
    border-radius: 12rpx;
    padding: 0 10rpx;
    margin-bottom: 20rpx;
}

.icon-null {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180rpx;
    height: 180rpx;
    color: #8B8B8B;
}

.bd {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20rpx 0;
    position: relative;

    .icon {
        width: 180rpx;
        height: 180rpx;
        background-size: cover !important;
        background-position: 50% 50% !important;
    }

    .info {
        width: calc(100vw - 40rpx - 40rpx - 160rpx - 20rpx);
        height: 180rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;

        .title {
            height: 40rpx;
            line-height: 40rpx;
            font-size: 28rpx;
            color: #333;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            font-weight: 600;
        }

        .txt {
            height: 72rpx;
            line-height: 36rpx;
            font-size: 28rpx;
            color: #8B8B8B;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .inf {
            display: flex;
            align-items: center;
            line-height: 40rpx;
            color: #8B8B8B;
            font-size: 26rpx;

            .price {
                font-weight: 600;
                margin-right: 40rpx;
            }
        }
    }
}
</style>