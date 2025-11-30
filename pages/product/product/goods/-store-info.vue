<template>
    <view class="recommend-box">
        <h4 class="goods-recommend-title">供应商信息</h4>
        <view class="content">
            <view class="content-box">
                <view class="text-box">
                    <image class="icon" :src="storeLogoAndGradeVO.storeLogo || defaultAvatar" mode="aspectFill"></image>
                    <view class="txt-box">
                        <view class="txt">{{ storeLogoAndGradeVO.storeName }}</view>
                        <view class="dec">{{ storeLogoAndGradeVO.storeNumber }}</view>
                        <view class="dec">{{ storeLogoAndGradeVO.storeAddressPath }}</view>
                    </view>
                </view>
            </view>
            <view class="goods-rate">
                <!-- <view class="name">店铺评分</view> -->
                <view class="rate">
                    <view class="rate-line">
                        <view class="txt">商品质量</view>
                        <view class="ico">
                            <view class="star" v-for="(item, index) in arrScoreDescription" :data-index="index" :key="index">
                                <image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
                            </view>
                        </view>
                        <view class="val">{{ storeLogoAndGradeVO.descriptionScore }}</view>
                    </view>
                    <view class="rate-line">
                        <view class="txt">物流履约</view>
                        <view class="ico">
                            <view class="star" v-for="(item, index) in arrScoreDelivery" :data-index="index" :key="index">
                                <image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
                            </view>
                        </view>
                        <view class="val">{{ storeLogoAndGradeVO.deliveryScore }}</view>
                    </view>
                    <view class="rate-line">
                        <view class="txt">商家服务</view>
                        <view class="ico">
                            <view class="star" v-for="(item, index) in arrScoreService" :data-index="index" :key="index">
                                <image class="light" :src="item == 1 ? iconStarHov : iconStar" mode="aspectFit"></image>
                            </view>
                        </view>
                        <view class="val">{{ storeLogoAndGradeVO.serviceScore }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: ['storeLogoAndGradeVO'],
    data() {
        return {
            iconStar: `${this.iconCommon}/static/v1/common/icon-star.png`,
            iconStarHov: `${this.iconCommon}/static/v1/common/icon-star_hov.png`,
            defaultAvatar: require('@/static/default-store-avatar.png'),
        }
    },
    computed: {
        arrScoreDescription: function () {
            let tempArr = [1, 1, 1, 1, 1]
            for (let i = 0; i < 5; i++) {
                tempArr[i] = this.storeLogoAndGradeVO.descriptionScore > i ? 1 : 0
            }
            return tempArr
        },
        arrScoreDelivery: function () {
            let tempArr = [1, 1, 1, 1, 1]
            for (let i = 0; i < 5; i++) {
                tempArr[i] = this.storeLogoAndGradeVO.deliveryScore > i ? 1 : 0
            }
            return tempArr
        },
        arrScoreService: function () {
            let tempArr = [1, 1, 1, 1, 1]
            for (let i = 0; i < 5; i++) {
                tempArr[i] = this.storeLogoAndGradeVO.serviceScore > i ? 1 : 0
            }
            return tempArr
        },
        getGrade() {
            return (grade) => {
                const gradeText = {
                    GOOD: '好评',
                    MODERATE: '中评',
                    WORSE: '差评'
                }
                return gradeText[grade] || ''
            }
        }
    },
    methods: {},
    mounted() {
        console.log(this.storeLogoAndGradeVO, '11222')
    }
}
</script>

<style lang="scss" scoped>
@import '../product.scss';

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
                width: 140rpx;
                height: 140rpx;
                padding: 0 20rpx 0 10rpx;
            }
            .txt-box {
                .txt {
                    color: black;
                    font-size: 30rpx;
                    font-weight: bold;
                    padding-top: 5rpx;
                }
                .dec {
                    font-size: 24rpx;
                    color: #757272;
                    margin-top: 14rpx;
                }
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
    .goods-rate {
        background: #fff;
        padding: 0 20rpx 20rpx;
        margin: 20rpx 0 0;

        .name {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 88rpx;
            color: #333;
            font-size: 28rpx;
            font-weight: 600;
            position: relative;
        }

        .rate {
            .rate-line {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 60rpx;
                .txt {
                    font-size: 26rpx;
                    color: #333;
                }
                .val {
                    font-size: 26rpx;
                    color: #999;
                }

                .ico {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin: 0 16rpx;
                    width: 240rpx;
                    height: 48rpx;

                    .star {
                        width: 48rpx;
                        height: 48rpx;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .light {
                            width: 32rpx;
                            height: 32rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>
