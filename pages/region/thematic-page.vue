<template>
    <view class="thematic-page">
        <!-- 头部媒体区域 -->
        <view class="media-header">
            <view class="media-container">
                <!-- 视频显示 -->
                <template v-if="isVideoType">
                    <!-- #ifdef APP-PLUS -->
                    <!-- <CustomVideoPlayer
                        ref="customVideoPlayer"
                        :src="mediaUrl"
                        :autoplay="isAutoplay"
                        :loop="true"
                        :muted="true"
                        @play="onVideoPlay"
                        @pause="onVideoPause"
                        @timeupdate="onVideoTimeUpdate"
                        @durationchange="onVideoDurationChange"
                        @fullscreenchange="onVideoFullscreenChange"
                        @error="onVideoError"
                        @ended="onVideoEnded">
                    </CustomVideoPlayer> -->
                    <video
                        id="videoPlayer"
                        :src="mediaUrl"
                        class="video-player"
                        :controls="true"
                        :autoplay="isAutoplay"
                        :loop="true"
                        :muted="true"
                        :enable-progress-gesture="false"
                        :object-fit="'contain'"
                        :show-mute-btn="true"
                        @fullscreenchange="fullscreenchange"
                        @tap="toggleVideo"
                        @play="onVideoPlay"
                        @pause="onVideoPause"
                        @ended="onVideoEnded"
                        @error="onVideoError">
                     <!-- 使用cover-view实现全局悬浮返回按钮 -->
                <cover-view class="global-back-button" @tap="goBack"
                    >×
                </cover-view>
            </video>
                    <!-- #endif -->
                    <!-- #ifdef H5 -->
                    <video
                        id="videoPlayer"
                        :src="mediaUrl"
                        class="video-player"
                        :controls="true"
                        :autoplay="isAutoplay"
                        :loop="true"
                        :muted="true"
                        :enable-progress-gesture="false"
                        :object-fit="'contain'"
                        :show-mute-btn="true"
                        @tap="toggleVideo"
                        @play="onVideoPlay"
                        @pause="onVideoPause"
                        @ended="onVideoEnded"
                        @error="onVideoError"></video>
                    <!-- H5蒙层 -->
                    <view class="h5-overlay" v-if="!hasUserConfirmed">
                        <view class="overlay-content">
                            <view class="overlay-icon">
                                <u-icon name="volume-fill" color="#fff" size="80"></u-icon>
                            </view>
                            <view class="overlay-title">视频播放提示</view>
                            <view class="overlay-desc">点击下方按钮开始播放视频</view>
                            <view class="overlay-btn" @tap="startVideo"> 我知道了 </view>
                        </view>
                    </view>
                    <!-- #endif -->
                </template>

                <!-- 图片显示 -->
                <template v-else>
                    <image
                        :src="mediaUrl"
                        class="header-image"
                        mode="aspectFill">
                    </image>
                </template>
            </view>
        </view>

        <!-- 悬浮返回按钮 - 统一外层按钮 -->
        <view class="back-btn" :class="{ 'show-background': showBackgroundColor }" @tap="goBack">
            <u-icon name="arrow-left" :color="showBackgroundColor ? '#333' : '#fff'" size="40"></u-icon>
        </view>
        <!-- 商品列表 -->
        <view class="goods-container">
            <view class="goods-grid" v-if="goodsList.length > 0">
                <view class="goods-item" v-for="(item, index) in goodsList" :key="index">
                    <common-goods-item :goods="item" />
                </view>
            </view>
            <view v-show="recommendGoodsLoading" class="home-recommend-tip"> 正在加载，请稍后... </view>
            <view v-show="!recommendGoodsLoading && goodsList.length > 0" class="home-recommend-tip"> 暂无更多数据 </view>
            <empty-box v-if="!recommendGoodsLoading && goodsList.length === 0" text="暂无商品"></empty-box>
        </view>
        <!-- 活动状态弹窗 -->
        <view class="status-modal" v-if="isShowModal">
            <view class="modal-mask"></view>
            <view class="modal-content">
                <!-- 图标区域 -->
                <view class="modal-icon-container">
                    <image :src="modalIcon" class="modal-icon" mode="aspectFit"></image>
                </view>
                <!-- 文字区域 -->
                <view class="modal-text" >
                    {{ modalText }}
                </view>
                <!-- 按钮区域 -->
                <view class="modal-button-container">
                    <button class="confirm-button" @tap="closeModal">
                        确定
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import CommonGoodsItem from '@/components/Hina/CommonGoodsItem.vue'
import { getSpecialSectionDetailNew,getSpecialSectionGoodsList } from '@/api/region'
import CustomVideoPlayer from '@/components/video/CustomVideoPlayer.vue'
import EmptyBox from '@/components/Hina/EmptyBox.vue'

export default {
    name: 'ThematicPage',
    components: {
        CommonGoodsItem,
        CustomVideoPlayer,
        EmptyBox
    },
    // 页面配置
    onLoad(options) {
        this.id = options.id
        // 设置页面状态栏样式
        uni.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000',
            animation: {
                duration: 0,
                timingFunc: 'easeIn'
            }
        })

        // 设置状态栏为透明
        // #ifdef APP-PLUS
        plus.navigator.setStatusBarStyle('light')
        plus.navigator.setStatusBarBackground('#000000')
        // #endif

        // 检查是否是第一次进入页面
        this.checkFirstVisit()
    },
    data() {
        return {
            isVideoPlaying: false,
            videoContext: null,
            hasUserConfirmed: false, // 用户是否已确认播放
            mediaUrl: '', // 媒体URL，可以是视频或图片
            goodsList: [],
            recommendGoodsLoading: false,
            scrollTop: 0, // 滚动距离
            mediaHeight: 0, // 媒体区域高度
            showBackgroundColor: false, // 是否显示返回按钮背景色
            id: '', // 专题id
            isShowModal: false, // 是否显示授权弹窗
            endIcon: `${this.iconCommon}/static/region/end.png`,
            notStartIcon: `${this.iconCommon}/static/region/not-started.png`,
            modalIcon: '${this.iconCommon}/static/region/end.png',
            modalText: '',
            isAutoplay:true, // 是否自动播放
            isVideoType: false, // 是否是视频类型
            goodsParams: {
                pageNumber: 1,
                pageSize: 20
            },
            total: 0,
        }
    },
    computed: {
    },

    // 页面滚动监听
    onPageScroll(e) {
        this.scrollTop = e.scrollTop
        this.updateBackButtonStyle()
    },
    mounted() {
        // 创建视频上下文
        this.videoContext = uni.createVideoContext('videoPlayer', this)
        // 加载基本信息
        this.loadBaseData()
        // 加载商品列表
        this.loadGoodsListFirst()
        // 计算媒体区域高度
        this.calculateMediaHeight()
    },
    methods: {
        // 获取基本信息
        loadBaseData() {
            this.recommendGoodsLoading = true
            getSpecialSectionDetailNew({ specialSectionId: this.id }).then((res) => {
                this.recommendGoodsLoading = false
                if (res.data.success) {
                    this.mediaUrl = res.data.result.mediaUrl
                    if(res.data.result.specialSectionStatus == 'ENDED'){
                        this.isAutoplay = false
                        this.isShowModal = true
                        this.modalIcon = this.endIcon
                        this.modalText = '抱歉，本次活动已结束！'
                    }else if(res.data.result.specialSectionStatus == 'NOT_STARTED'){
                        this.isAutoplay = false
                        this.isShowModal = true
                        this.modalIcon = this.notStartIcon
                        this.modalText = '活动还未开始，敬请期待！'
                    }else{
                        this.isAutoplay = true
                        this.isShowModal = false
                        this.modalIcon = this.endIcon
                        this.modalText = '未知错误！'
                    }

                    if(res.data.result.mediaType === 'VIDEO'){
                        this.isVideoType = true
                    }else{
                        this.isVideoType = false
                    }
                }
            })
        },
        // 首次加载商品列表
        loadGoodsListFirst() {
            // 重置分页参数
            this.goodsParams.pageNumber = 1
            this.goodsList = []
            this.total = 0
            this.loadGoodsList()
        },
        // 分页加载商品列表
        loadGoodsList() {
            this.recommendGoodsLoading = true
            let params = {
                specialSectionId: this.id,
                pageNumber: this.goodsParams.pageNumber,
                pageSize: this.goodsParams.pageSize
            }
            getSpecialSectionGoodsList(params).then((res) => {
                this.recommendGoodsLoading = false
                if (res.data.success) {
                    // 总是设置total，不管返回多少条数据
                    this.total = res.data.result.total

                    res.data.result.records.forEach((item) => {
                        let price = item.price + ''
                        let integer = '00'
                        let decimal = '00'
                        if (price.indexOf('.') > -1) {
                            integer = price.split('.')[0]
                            decimal = price.split('.')[1]
                            if (decimal.length === 1) {
                                decimal += '0'
                            }
                        } else {
                            integer = price
                        }
                        this.goodsList.push({
                            id: item.id,
                            goodsId: item.goodsId,
                            icon: item.thumbnail,
                            name: item.goodsName,
                            buyCount: item.buyCount,
                            price: item.price,
                            integer: integer,
                            decimal: decimal,
                            quantity: item.quantity
                        })
                    })
                }
            })
        },
        // 加载更多商品
        loadMoreGoods() {
            // 检查是否还有更多数据可加载
            const hasMoreData = this.total > 0 && this.goodsList.length < this.total
            const notLoading = !this.recommendGoodsLoading

            if (notLoading && hasMoreData) {
                this.goodsParams.pageNumber++
                this.loadGoodsList()
            }
        },
        // 全屏状态变化
        fullscreenchange(e){
            if(!e.detail.fullScreen){ // 退出全屏，锁定竖屏
                plus.screen.lockOrientation('portrait-primary');
            }
        },
        // 切换视频播放状态
        toggleVideo() {
            if (this.isVideoPlaying) {
                this.videoContext.pause()
            } else {
                this.videoContext.play()
            }
        },

        // 视频开始播放
        onVideoPlay() {
            this.isVideoPlaying = true
            console.log('视频开始播放')
        },

        // 视频暂停
        onVideoPause() {
            this.isVideoPlaying = false
            console.log('视频暂停')
        },

        // 视频播放结束
        onVideoEnded() {
            this.isVideoPlaying = false
            console.log('视频播放结束')
        },

        // 视频播放错误
        onVideoError(e) {
            console.error('视频播放错误:', e)
            uni.showToast({
                title: '视频播放失败',
                icon: 'none'
            })
        },

        // 视频时间更新
        onVideoTimeUpdate(time) {
            // console.log('视频时间更新:', time)
        },

        // 视频时长变化
        onVideoDurationChange(duration) {
            console.log('视频时长:', duration)
        },

        // 视频全屏状态变化
        onVideoFullscreenChange(isFullscreen) {
            console.log('视频全屏状态变化:', isFullscreen)
        },

        // 开始播放视频（H5）
        startVideo() {
            this.hasUserConfirmed = true
            // 保存用户已确认的状态到本地存储
            uni.setStorageSync('video_play_confirmed', true)
            this.videoContext.play()
        },

        // 检查是否是第一次访问
        checkFirstVisit() {
            // #ifdef H5
            const hasConfirmed = uni.getStorageSync('video_play_confirmed')
            if (hasConfirmed) {
                this.hasUserConfirmed = true
            }
            // #endif
        },

        // 返回上一页
        goBack() {
            uni.navigateBack({
                delta: 1
            })
        },

        // 计算媒体区域高度
        calculateMediaHeight() {
            this.$nextTick(() => {
                const query = uni.createSelectorQuery().in(this)
                query.select('.media-header').boundingClientRect(data => {
                    if (data) {
                        this.mediaHeight = data.height
                    }
                }).exec()
            })
        },

        // 更新返回按钮样式
        updateBackButtonStyle() {
            // 当滚动距离超过媒体区域高度的80%时，显示背景色
            const threshold = this.mediaHeight * 0.8
            this.showBackgroundColor = this.scrollTop > threshold
        },

        // 关闭弹窗
        closeModal() {
            uni.navigateBack({
                delta: 1
            })
        }
    },
    // 触底事件
    onReachBottom() {
        this.loadMoreGoods()
    }
}
</script>

<style lang="scss" scoped>
::v-deep .uni-video-bar {
    // bottom: 20rpx !important;
}
::v-deep .uni-video-container {
    background-color: unset;
}

::v-deep .uni-video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
}

::v-deep video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
}

.thematic-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

// 媒体头部区域（视频或图片）
.media-header {
    position: relative;
    width: 100%;
    height: calc(56.25vw + var(--status-bar-height)); // 16:9比例
    overflow: hidden;
    background-color: #000;
    margin-top: calc(-1 * var(--status-bar-height));
    padding-top: var(--status-bar-height);
}

.media-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.video-player {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: relative;
}

.header-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    position: relative;
    display: block;
}

// H5蒙层样式
.h5-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
}

// 返回按钮样式 - 悬浮效果
.back-btn {
    position: fixed !important; /* 使用fixed确保悬浮效果 */
    top: 20rpx;
    left: 20rpx;
    width: 80rpx;
    height: 80rpx;
    background-color: transparent; /* 默认透明背景 */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none; /* 默认无阴影 */
    z-index: 999999999 !important; /* 超高层级确保在所有内容之上 */
    backdrop-filter: none; /* 默认无模糊效果 */
    -webkit-backdrop-filter: none; /* iOS兼容性 */
    border: none; /* 默认无边框 */
    transition: all 0.3s ease; /* 增加过渡时间 */

    /* 当显示背景色时的样式 */
    &.show-background {
        background-color: rgba(255, 255, 255, 0.95);
        // box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10rpx);
        -webkit-backdrop-filter: blur(10rpx);
        border: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    /* H5环境适配 */
    /* #ifdef H5 */
    position: fixed !important;
    top: calc(var(--status-bar-height) + 10px);
    left: 10px;
    width: 40px;
    height: 40px;
    /* #endif */

    /* APP环境适配 */
    /* #ifdef APP-PLUS */
    position: fixed !important;
    top: calc(var(--status-bar-height) + 10rpx);
    left: 20rpx;
    /* #endif */

    /* 小程序环境适配 */
    /* #ifdef MP */
    position: absolute;
    top: calc(var(--status-bar-height) + 20rpx);
    /* #endif */
}

.back-btn:active {
    transform: scale(0.95);
}

.back-btn.show-background:active {
    background-color: rgba(255, 255, 255, 0.8);
}

/* APP环境房子图标版本返回按钮 */
/* #ifdef APP-PLUS */
.back-btn-app {
    width: 80rpx !important;
    height: 80rpx !important;
    border-radius: 50% !important;
    padding: 0;
}
/* #endif */

.overlay-content {
    text-align: center;
    padding: 40rpx;
    max-width: 80%;
}

.overlay-icon {
    margin-bottom: 30rpx;
}

.overlay-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 20rpx;
}

.overlay-desc {
    font-size: 28rpx;
    color: #ccc;
    margin-bottom: 40rpx;
    line-height: 1.5;
}

.overlay-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 20rpx 60rpx;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: bold;
    display: inline-block;
    box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
}

.overlay-btn:active {
    transform: scale(0.95);
    box-shadow: 0 4rpx 10rpx rgba(102, 126, 234, 0.3);
}

.video-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 2rpx 2rpx 8rpx rgba(0, 0, 0, 0.5);
    z-index: 10;
}


// 商品列表容器
.goods-container {
    padding: 50rpx 20rpx;
    // border-radius: 20rpx 20rpx 0 0;
    background-color: #fafafa;
    // margin-top: -20rpx; /* 减少向上偏移，为视频控件留出更多空间 */
    z-index: 11;
    position: relative;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    min-height: calc(100vh - 56.25vw - var(--status-bar-height) + 20rpx); /* 确保容器填充剩余空间 */
    display: flex;
    flex-direction: column;

    // 添加顶部灰色小条
    &::before {
        content: '';
        position: absolute;
        top: 20rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 6rpx;
        background-color: #ccc;
        border-radius: 3rpx;
        z-index: 12;
    }
}

.goods-grid {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10rpx;
    flex: 1; /* 让商品网格占据剩余空间 */
}

.goods-item {
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 10rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
}

.home-recommend-tip {
    text-align: center;
    padding: 40rpx 20rpx;
    color: #999;
    font-size: 28rpx;
    flex-shrink: 0; /* 防止提示文字被压缩 */
}

// 活动状态弹窗样式
.status-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4rpx);
    -webkit-backdrop-filter: blur(4rpx);
}

.modal-content {
    position: relative;
    width: 600rpx;
    background-color: #fff;
    border-radius: 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: modalSlideIn 0.3s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 40rpx 40rpx;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.8) translateY(50rpx);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

// 图标容器
.modal-icon-container {
    width: 240rpx;
    height: 240rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    position: relative;
}

.modal-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

// 文字区域
.modal-text {
    font-size: 32rpx;
    color: #333;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 60rpx;
    font-weight: 500;
}

// 按钮容器
.modal-button-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.confirm-button {
    width: 254rpx;
    height: 88rpx;
    background-color: #E22221;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    border: none;
    border-radius: 44rpx;
    box-shadow: 0 8rpx 20rpx rgba(255, 71, 87, 0.3);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-button:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 10rpx rgba(255, 71, 87, 0.3);
}

// 小程序按钮样式重置
::v-deep .confirm-button {
    background-color: #ff4757 !important;
    color: #fff !important;
    border: none !important;
    outline: none !important;
}

::v-deep .confirm-button::after {
    border: none !important;
}

/* 全局悬浮返回按钮样式 - 兼容APP和H5 */
.global-back-button {
    position: fixed !important; /* 使用fixed确保悬浮效果 */
    top: 80rpx;
    left: 20rpx;
    width: 80rpx;
    height: 80rpx;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
    z-index: 99999 !important; /* 超高层级确保在所有内容之上 */
    backdrop-filter: blur(10rpx);
    -webkit-backdrop-filter: blur(10rpx); /* iOS兼容性 */
    transition: all 0.2s ease;
    font-size: 40rpx;
    font-family: 'SimSun, sans-serif';
    /* #ifdef APP-PLUS */
    line-height: 70rpx;
    /* #endif */
    /* #ifdef H5 */
    line-height: 80rpx;
    /* #endif */
}
</style>
