<template>
    <view class="container">
        <!-- 图片展示区（占位） -->
        <view class="image-area">
            <view class="image-wrap">
                <!--  弹幕区域: 从下往上滚动 -->
                <view class="bulletChat" ref="bulletContainer">
                    <view class="bulletChat-track" ref="bulletTrack">
                        <block v-for="(msg, idx) in bulletListConcat" :key="idx">
                            <view class="bullet-item">{{ msg }}</view>
                        </block>
                    </view>
                </view>
                <view class="mage-wrap-box">
                    <!-- 滑动视口 -->
                    <view class="slider-viewport" ref="imageWrap" @touchstart="onTouchStart" @touchmove="onTouchMove"
                        @touchend="onTouchEnd">
                        <view class="slider-track" :style="trackStyle">
                            <block v-for="(src, i) in imageList" :key="i">
                                <image @click="magnifyImg(src)"  class="slide-image" :src="src" mode="aspectFill"></image>
                            </block>
                        </view>
                    </view>
                </view>
                <!-- 返回按钮（左上角） -->
                <view class="back-btn" @click="historyBack">
                    <image class="back-btn-img" src="../../static/cbd/iconReturn.png"></image>
                </view>
                <!-- 分享功能 -->
                <view class="share-btn" @click="share">
                    <image class="share-btn-img" src="../../static/cbd/share.png"></image>
                </view>
                <!-- 索引提示 -->
                <view class="index-indicator">{{ currentIndex + 1 }}/{{ imageList.length }}</view>
            </view>
            <!-- 劵区域 -->
            <view class="coupon">

                <!-- 商品信息展示（默认图片为空占位） -->
                <view class="coupon-product">

                    <view class="product-info">
                        <view class="product-price-row">
                            <image class="product-img" src="../../static/cbd/couponRed.png" mode="aspectFill"></image>
                            <text class="product-price">{{ couponProduct.price }}</text>
                            <text class="product-dh">兑换劵</text>
                            <text class="product-old">{{ couponProduct.oldPrice }}</text>
                            <text class="product-replaced">已兑换600+</text>
                        </view>
                        <text class="product-title">{{ couponProduct.productName }}</text>
                        <view class="product-meta">
                            <view style="margin-bottom: 20rpx;">库存数量：{{ couponProduct.stock }}</view>
                            <view style="margin-bottom: 20rpx;">适配机型：{{ couponProduct.compatibleModelName }}</view>
                        </view>
                        <view class="product-actions">
                            <view class="qty-control">
                                <text style="color: #999;font-size: 24rpx;">兑换数量：</text>
                                <view class="qty-btn" @click="decQty">-</view>
                                <input class="qty-input" type="number" v-model.number="qty" />
                                <view class="qty-btn" @click="incQty">+</view>
                            </view>
                            <view class="submit-exchange" @click="clickBtn">提交兑换</view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 展示商品区域 -->
            <view class="item-img-display">
                <view class="imgs-center">
                  <u-parse
                      class="vhtml"
                      :lazy-load="true"
                      :use-cache="true"
                      :show-with-animation="true"
                      :html="couponProduct.description"
                      :tag-style="style"
                  ></u-parse>
                </view>
            </view>
        </view>

        <shares v-if="enableShare && id" :link="'/pages/watermc/waterMachineItem?id=' +
        id + '&distributorNumber=' + objUserInfo.bindDistributorNumber"  :goodsName="couponProduct.productName" :thumbnail="imageList[0]" type="watermc"
                @close="enableShare = false" />
    </view>
</template>

<script>
import {getWatermcProductDetail} from "../../api/cbd/waterc";
import storage from "@/utils/storage.js";
import shares from "@/components/m-share/index"; //分享

export default {
    name: "waterMachineItem",
    components: { shares },
    mounted() {
        // start bullet after render
        this.$nextTick(() => {
            this.startBullet();
        });
    },
    beforeDestroy() {
        this.stopBullet();
    },
    data() {
        return {
            videoUrl: "your-video-url.mp4",// 视频地址
            videoList: [],//视频图片
            imageList: [], //轮播list
            currentIndex: 0,
            // 触控滑动状态
            //触摸开始时的X坐标
            touchStartX: 0,
            // 触摸开始时的Y坐标
            touchStartY: 0,
            //触摸移动时的X坐标
            touchMoveX: 0,
            // 触摸移动时的Y坐标
            touchMoveY: 0,
            //是否正在滑动
            isSwiping: false,
            //滑动阈值
            swipeThreshold: 60,
            //是否正在拖动
            isDragging: false,
            //拖动时的X坐标
            dragX: 0,
            viewportWidth: 0,
            // 导航中标记，避免在返回动画/导航期间触发滑动手势
            isNavigating: false,
            // 弹幕消息列表
            bulletList: [
                '1小时前用户132****3345兑换中品3代饮水机北京版',
                '刚刚用户138****1122使用5000兑换了水机',
                '2分钟前用户139****6677抢到限量配件'
            ],
            // 用于视图渲染的 translateY
            bulletTranslate: 0,
            // 控制动画的 raf id
            _bulletRaf: null,
            // 滚动速度（像素/帧），可微调
            bulletSpeed: 0.5,
            couponProduct: {},//数据
            qty: 1,//兑换数量
            id: '',
            style: {
              img:"display:block"
            },
            objUserInfo: {},
            enableShare: false,
        }
    },
    computed: {
        trackStyle() {
            // 在拖动过程中包含dragPercent
            const base = -this.currentIndex * 50
            const dragPercent = this.isDragging && this.viewportWidth ? (this.dragX / this.viewportWidth) * 50 : 0
            const translate = base + dragPercent
            const trans = `translateX(${translate}%)`
            const transition = this.isDragging ? 'none' : 'transform 300ms ease'
            return {
                transform: trans,
                transition: transition,
                width: `${this.imageList.length * 100}%`
            }
        },
        // 将弹幕数组重复一次用于无缝循环渲染
        bulletListConcat() {
            return [...this.bulletList, ...this.bulletList];
        }
    },
    methods: {
        init() {
          getWatermcProductDetail(this.id).then(res => {
            this.couponProduct = res.data.result
            this.imageList = this.couponProduct.productFile.split(',')
          })
        },
        // 返回上一级
        historyBack() {
            try {
                // 标记为正在导航，阻止短时间内的滑动处理
                this.isNavigating = true;
                // 使用短延时保证标记生效并且避免竞争条件
                if (typeof uni !== 'undefined' && uni.navigateBack) {
                    setTimeout(() => {
                        uni.navigateBack({ delta: 1 });
                    }, 80);
                } else if (this.$router && this.$router.back) {
                    setTimeout(() => {
                        this.$router.back();
                    }, 80);
                }
            } catch (e) {
                // fallback: window history
                if (typeof window !== 'undefined' && window.history && window.history.length) {
                    setTimeout(() => { window.history.back(); }, 80);
                }
            }
        },

        // 右上角附加操作已移除
        // 滑块处理
        onTouchStart(e) {
            const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0])
            if (!t) return
            this.touchStartX = t.clientX
            this.touchStartY = t.clientY
            this.touchMoveX = this.touchStartX
            this.touchMoveY = this.touchStartY
            this.isSwiping = true
            this.isDragging = true
            this.dragX = 0
            // get viewport width
            try {
                const info = (typeof uni !== 'undefined' && uni.getSystemInfoSync) ? uni.getSystemInfoSync() : { windowWidth: 375 }
                this.viewportWidth = info.windowWidth || 375
            } catch (err) {
                this.viewportWidth = 375
            }
        },
        // 当用户在屏幕上滑动时触发此函数
        onTouchMove(e) {
            // 如果当前不是拖动状态，则直接返回
            if (!this.isDragging) return
            // 获取触摸点信息，优先使用touches[0]，如果没有则使用changedTouches[0]
            const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0])
            // 如果没有触摸点信息，则直接返回
            if (!t) return
            // 记录当前触摸点的X坐标
            this.touchMoveX = t.clientX
            // 记录当前触摸点的Y坐标
            this.touchMoveY = t.clientY
            // 计算并更新拖动距离（X轴方向）
            this.dragX = this.touchMoveX - this.touchStartX
        },
        //  触摸结束事件处理函数 ,当用户结束触摸操作时调用，用于判断是否触发滑动切换图片
        onTouchEnd(e) {
            // 如果当前没有在拖动状态，则直接返回
            if (!this.isDragging) return
            // 重置拖动和滑动状态标志
            this.isDragging = false
            this.isSwiping = false
            // 获取当前拖动的X轴距离和Y轴移动距离
            const dx = this.dragX
            const dy = this.touchMoveY - this.touchStartY
            // 如果水平滑动且超过阈值
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.swipeThreshold) {
                if (dx < 0) {
                    // left -> next
                    if (this.currentIndex < this.imageList.length - 1) this.currentIndex++
                } else {
                    // right -> prev
                    if (this.currentIndex > 0) this.currentIndex--
                }
            }
            // 重置
            this.dragX = 0
        },
        //图片放大
        magnifyImg(url) {
            uni.previewImage({
                urls: [url]
            })
        },
        //减
        decQty() {
            if (this.qty > 1) {
                this.qty--;
            }
        },
        // 加
        incQty() {
            if (this.qty < this.couponProduct.stock) {
                this.qty++;
            }
        },
            // 提交兑换逻辑待实现
        clickBtn() {
            uni.showToast({
              title: '兑换卷不足',
              duration: 2000,
              icon: 'none'
            })
        },
        // 分享（微信）
        share() {
            this.enableShare = true
            // const title = this.couponProduct && this.couponProduct.title ? this.couponProduct.title : '智能水机';
            // const summary = this.couponProduct && this.couponProduct.price ? `仅需 ${this.couponProduct.price} 兑换劵` : '智能水机兑换中';
            // const imageUrl = this.couponProduct && this.couponProduct.img ? this.couponProduct.img : '../../static/cbd/share.png';
            // const href = (typeof location !== 'undefined' && location.href) ? location.href + '&distributorNumber=' + this.objUserInfo.bindDistributorNumber : '';
            //
            // const doShare = (scene) => {
            //     if (typeof uni !== 'undefined' && uni.share) {
            //         uni.share({
            //             provider: 'weixin',
            //             scene: scene, // 'WXSceneSession' / 'WXSceneTimeline'
            //             type: 2, // 网页类型分享（title/href/imageUrl/summary）
            //             title: title,
            //             summary: summary,
            //             href: href,
            //             imageUrl: imageUrl,
            //             success: () => {
            //                 try { uni.showToast({ title: '分享成功', icon: 'none' }); } catch (e) {}
            //             },
            //             fail: (err) => {
            //                 try {
            //                     uni.showModal({ title: '分享失败', content: '分享失败，请在微信环境中重试或检查是否安装微信。' });
            //                 } catch (e) {}
            //                 console.warn('share fail', err);
            //             }
            //         });
            //     } else {
            //         try { uni.showModal({ title: '提示', content: '当前环境不支持一键分享，请在微信中打开本页面或复制链接进行分享。' }); } catch (e) {}
            //     }
            // };
            //
            // // 先弹出选项，让用户选择分享到会话或朋友圈
            // if (typeof uni !== 'undefined' && uni.showActionSheet) {
            //     uni.showActionSheet({
            //         itemList: ['发送给朋友', '分享到朋友圈'],
            //         success: (res) => {
            //             if (res.tapIndex === 0) doShare('WXSceneSession');
            //             else doShare('WXSceneTimeline');
            //         },
            //         fail: () => {
            //             // 若用户取消或不支持 actionSheet，默认分享到会话
            //             doShare('WXSceneSession');
            //         }
            //     });
            // } else {
            //     // 兜底直接分享会话
            //     doShare('WXSceneSession');
            // }
        },
        // ---------- 弹幕滚动逻辑 ----------
        startBullet() {
            // 先停止现有的循环
            this.stopBullet();
            const container = this.$refs.bulletContainer;
            const track = this.$refs.bulletTrack;
            if (!container || !track) return;
            // 尝试读取高度；使用安全值作为备用方案
            let totalH = 0;
            try { totalH = track.offsetHeight || track.clientHeight || 0; } catch (e) { totalH = 0 }
            // 单组高度 = 复制轨道的一半
            const singleH = totalH / 2 || 1;
            // 确保起始偏移量将第二个副本恰好放在下方
            if (this.bulletTranslate <= -singleH) this.bulletTranslate += singleH;

            const step = () => {
                this.bulletTranslate -= this.bulletSpeed;
                if (Math.abs(this.bulletTranslate) >= singleH) {
                    // 通过添加 singleH 进行重置，以保持连贯性
                    this.bulletTranslate += singleH;
                }
                this._bulletRaf = requestAnimationFrame(step);
            };
            this._bulletRaf = requestAnimationFrame(step);
        },
        stopBullet() {
            if (this._bulletRaf) {
                cancelAnimationFrame(this._bulletRaf);
                this._bulletRaf = null;
            }
        }
    },
    onLoad(options) {
      this.objUserInfo = storage.getUserInfo() || {}
      if (options.id) {
        this.id = options.id
        this.init()
      }
    }
}
</script>




<style lang="scss">
$ca: calc(100% - 40rpx); //预设左右边距

ul li {
    list-style: none
}

.container {
    width: 100%;
    height: 1000rpx;
    background-color: #999;
}

/* 图片区样式 */
.image-area {
    width: 100%;
    height: 700rpx;
    background: #fff;
}

.image-wrap {
    position: relative;
    width: 100%;
    height: 700rpx;
    /* 自适应高度 */
    overflow: hidden;
    display: block;
}

//弹幕区域
.bulletChat {
    position: absolute;
    right: 14rpx;
    top: 100rpx;
    width: 468rpx;
    height: 200rpx;
    overflow: hidden;
    display: block;
    z-index: 10;
}

.bulletChat-list {
    float: right;
    width: 100%;
    height: 46rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 20rpx;
    font-size: 18rpx;
    font-weight: 400;
    text-indent: 10rpx;
    line-height: 46rpx;
    color: #fff;
}

/* 新的弹幕轨道与条目样式（自下而上滚动） */
.bulletChat-track{
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* 右对齐文本 */
    gap: 12rpx;
    padding: 6rpx 0;
    /* 默认使用 CSS 动画从下往上滚动：动画循环移动到 -50%（因为我们重复渲染了数组） */
    animation: bullet-scroll 6s linear infinite;
}
.bullet-item{
    background: rgba(0,0,0,0.5);
    color: #fff;
    font-size: 18rpx;
    padding: 8rpx 12rpx;
    border-radius: 20rpx;
    white-space: nowrap;
    margin-right: 6rpx;
}

@keyframes bullet-scroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
}

.mage-wrap-box {
    width: 100%;
    height: auto;
}

.main-image {
    width: 100%;
    height: 700rpx;
    object-fit: cover;
    transition: opacity 240ms ease-in-out;
}

.slider-viewport {
    width: 100%;
    height: 700rpx;
    overflow: hidden;
    /* 防止左右边缘触发浏览器/系统的横向回退手势 */
    overscroll-behavior-x: none;
    /* 只允许纵向滚动手势，尽量避免水平边缘手势干扰（现代内核支持） */
    touch-action: pan-y;
}

.slider-track {
    display: flex;
    height: auto;
}

.slide-image {
    width: 100%;
    height: 700rpx;
    object-fit: cover;
}

/* nav-arrow removed */
.back-btn {
    position: absolute;
    left: 16rpx;
    top: 28rpx;
    width: 54rpx;
    height: 54rpx;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
}

.back-btn-img {
    width: 100%;
    height: 100%;
}

/* right-action removed */
.share-btn {
    position: absolute;
    right: 16rpx;
    top: 28rpx;
    width: 54rpx;
    height: 54rpx;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
    font-size: 18rpx;
    font-weight: 400;
}

.share-btn-img {
    width: 100%;
    height: 100%;
}

.index-indicator {
    position: absolute;
    right: 0rpx;
    bottom: 16rpx;
    width: 119rpx;
    height: 49rpx;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    line-height: 49rpx;
    border-radius: 60rpx 0 0 60rpx;
    font-size: 32rpx;
    font-weight: 400;
    letter-spacing: 4rpx;
}

.coupon {
    width: 100%;
    height: auto;
    background: #FFF;
}

/* 优惠券产品块 */
.coupon-product {
    display: flex;
    gap: 20rpx;
    padding: 26rpx 16rpx 16rpx 16rpx;
    border-radius:0 0  12rpx 12rpx;
    background: #FFF;
    align-items: flex-start;
}



.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.price-symbol {
    color: #FF3B30;
    font-size: 22rpx;
}



.product-price-row{
    width: 100%;
    height:80rpx ;
    padding: 10rpx 0;
    margin-bottom: 26rpx;
}
.product-img {
    width: 60rpx;
    height: 50rpx;
    float: left;
    margin-top: 10px;
}
.product-price {
    color: #FF3B30;
    font-size: 48rpx;
    font-weight: 700;
    float: left;
    line-height: 98rpx;
    margin-left: 16rpx;
}
.product-dh{
    color: #FF3B30;
    font-weight: 400;
    font-size: 30rpx;
    margin-left: 8rpx;
    line-height: 106rpx;
}
.product-old{
    color:#999999;
    font-size: 24rpx;
    font-weight: 400;
    margin-left:8rpx;
    text-decoration: line-through;
}
.product-replaced {
    float: right;
    color: #999;
    font-size: 24rpx;
    font-weight: 400;
    line-height: 100rpx;
}

.product-title {
    width: 100%;
    color: #333;
    font-size: 32rpx;
    font-weight: 500;
    margin-bottom: 16rpx;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 限制显示的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-meta {
    color: #999;
    font-size: 24rpx;
    font-weight: 400;
}

.product-actions {
    display: flex;
    justify-content: space-between;
    align-items: center
}

.qty-control {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-weight: 400;
    font-size: 24rpx;
}

.qty-btn {
    width: 38rpx;
    height: 38rpx;
    border-radius: 8rpx;
    background: #FFF;
    line-height: 32rpx;
    font-size: 28rpx;
    text-align: center;
    border: 1rpx solid #EAEAEA
}

.qty-input {
    width: 96rpx;
    height: 56rpx;
    text-align: center;
    border-radius: 8rpx;
}

.submit-exchange {
    float: right;
    display: block;
    background: #FF3B30;
    color: #FFF;
    width: 166rpx;
    height:52rpx;
    border-radius: 10rpx;
    text-align: center;
    line-height:52rpx;
    font-size: 24rpx
}


/* 统一设置边框弧度 */
.item-img-display,
.imgs-center {

	border-radius: 20rpx 20rpx 20rpx 20rpx;
}

.item-img-display {
	width: 100%;
	height: 2078rpx;
	background: #FFF;
	margin-top: 20rpx;
}

.imgs-center {
	width: $ca;
	height: $ca;
	float: left;
	margin: 20rpx;
	background: node;
}

.imgs-center .imgs-inner{
    width: 100%;
    height: 100%;
    display: block;
}
</style>
