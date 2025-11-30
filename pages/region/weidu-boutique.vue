<template>
    <view class="weidu-boutique">
        <!-- 搜索栏 -->
        <view class="search-container">
            <view class="search-bar" @tap="toSearch">
                <u-icon name="search" size="40" color="#D62C1F"></u-icon>
                <text class="search-input">搜索</text>
            </view>
            <view class="customer-service" @tap="goToCustomerService">
                <image :src="iconCustomerService" class="customer-service-icon" mode="aspectFit"></image>
            </view>
        </view>

        <!-- 分类导航 -->
<!--        <view class="category-container">-->
<!--            <view class="category-list">-->
<!--                <view v-for="(item, index) in categoryList" :key="index" class="category-item" :class="{ active: selectedCategoryIndex === index }" @tap="selectCategory(index)">-->
<!--                    <view class="category-bg" :style="{ backgroundImage: getCategoryBgImage(index) }"></view>-->
<!--                    <image-->
<!--                        :src="item.img"-->
<!--                        class="category-icon"-->
<!--                        :class="{ 'category-icon-expanded': selectedCategoryIndex === index }"-->

<!--                        @tap.stop="selectCategory(index)"></image>-->
<!--                    <text class="category-text">{{ item.name }}</text>-->
<!--                </view>-->
<!--            </view>-->
<!--        </view>-->

        <!-- 连接背景区域 -->
        <view class="connection-bg">
            <image :src="iconSelZone" class="connection-image" mode="aspectFill"></image>
        </view>

        <!-- 广告横幅 -->
        <view class="ad-banner" @tap="onAdBannerClick">
          <u-swiper
            :list="bannerList"
            :autoplay="true"
            :interval="3000"
            :duration="300"
            :name="'img'"
            mode="round"
            indicator-pos="bottomCenter"
            :height="300"
            :border-radius="10"
            :bg-color="'#fff'"
            img-mode="aspectFill"
            @tap="onAdBannerClick"/>
<!--            <image :src="adBannerImage" class="banner-image" mode="aspectFill"></image>-->
        </view>

        <!-- 超级爆款和热销榜单区域 -->
        <view class="featured-section">
            <!-- 超级爆款 -->
            <view class="super-hot-deals" :style="{ backgroundImage: `url(${iconSuperExplosionBg})` }">
                <u-swiper
                    class="deals-swiper"
                    :list="superHotDeals"
                    :autoplay="true"
                    :interval="3000"
                    :duration="500"
                    keyName="img"
                    mode="round"
                    indicator-pos="bottomCenter"
                    :height="338"
                    :border-radius="10"
                    :bg-color="'#fff'"
                    img-mode="aspectFit"
                    @tap="onClickSuperHotDeals"
                    >
                </u-swiper>
            </view>

            <!-- 热销榜单 -->
            <view class="bestsellers-list" :style="{ backgroundImage: `url(${iconSuperHotDeals})` }">
                <view class="section-header">
                    <view class="section-title"></view>
                    <view class="view-ranking-btn" @tap="viewRanking">
                        <text class="view-ranking-text">看榜单</text>
                        <image :src="iconRightArrow" class="right-arrow" mode="aspectFit"></image>
                    </view>
                </view>
                <view class="rankings">
                    <view v-for="(item, index) in hotSalesRank" :key="index" class="ranking-item" @tap="hotGoodClick(item.id, item.goodsId)">
                        <image :src="hotTagIcons[index]" class="hot-tag-icon" mode="aspectFit"></image>
                        <image :src="item.thumbnail" class="product-image" mode="aspectFit"></image>
                        <view class="product-info">
                            <text class="product-name">{{ item.goodsName }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 商品标签页 -->
        <scroll-view class="product-tabs" scroll-x="true" show-scrollbar="false" :scrollbar="false">
            <view class="tabs-container">
                <view v-for="(tab, index) in arrFloorList" :key="index" class="tab-item" :class="{ active: selectedTabIndex === index }" @tap="selectTab(tab,index)">
                    <text class="tab-text">{{ tab.name }}</text>
                </view>
            </view>
        </scroll-view>

        <!-- 商品列表 -->
        <view class="home-goods">
            <view class="list">
                <view class="item" v-for="(item, index) in categoryGoods" :key="index">
                    <common-goods-item :goods="item" />
                </view>
            </view>
        </view>
        <view v-show="categoryGoodsLoading" class="home-recommend-tip"> 正在加载，请稍后... </view>
        <view v-show="!haveNextCategoryPage  && !categoryGoodsLoading" class="home-recommend-tip"> 暂无更多数据 </view>

        <!-- 底部安全区域占位 -->
        <view class="tabbar-placeholder"></view>

        <!-- 自定义tabbar -->
        <custom-tabbar :current="1"></custom-tabbar>
    </view>
</template>

<script>
import CommonGoodsItem from '@/components/Hina/CommonGoodsItem.vue'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import { getAdvertisement,getHotSalesRank,getPopularCategoryTree } from '@/api/region'
import { handleNavigation, JUMP_TYPE } from '@/utils/navigation.js'
import { getGoodsList } from '@/api/goods'
import USwiper from "../../uview-ui/components/u-swiper/u-swiper.vue";
export default {
    components: {
      USwiper,
        CommonGoodsItem,
        CustomTabbar
    },

    data() {
        return {
            selectedCategoryIndex: 0,
            selectedTabIndex: 0,
            expandedIconIndex: -1, // 记录当前展开的图标索引
            iconCustomerService: `${this.iconCommon}/static/region/customer-service.png`,
            iconSelZone: `${this.iconCommon}/static/region/selZone.png`,
            iconSuperExplosionBg: `${this.iconCommon}/static/region/explosion-bg.png`,
            iconSuperHotDeals: `${this.iconCommon}/static/region/hot-bg.png`,
            iconRightArrow: `${this.iconCommon}/static/region/right-arrow.png`,
            hotTagIcons: [`${this.iconCommon}/static/region/hot-01.png`, `${this.iconCommon}/static/region/hot-02.png`, `${this.iconCommon}/static/region/hot-03.png`],
            categoryList: [], // 改为空数组，由后端数据填充
            bannerList: [],
            adBannerImage: '',
            // 广告数据存储
            bannerData: {
                DIMENSION_BANNER1: null, // 对应金刚位1
                DIMENSION_BANNER2: null, // 对应金刚位2
                DIMENSION_BANNER3: null, // 对应金刚位3
                DIMENSION_BANNER4: null // 对应金刚位4
            },
            currentBannerData: null, // 当前显示的广告数据
            superHotDeals: [], // 超级爆款
            hotSalesRank: [], // 热销榜单
            arrFloorList: [], // 楼层分类列表
            categoryGoods: [], // 分类商品列表
            categoryGoodsLoading: false, // 分类商品加载状态
            haveNextCategoryPage : true, // 分类商品是否有下一页
            categoryGoodsParams: { categoryId: 0, terminal: 'MOBILE', pageNumber: 1, pageSize: 10 }
        }
    },
    methods: {
        loadAdvertisement() {
            uni.showLoading({
                title: '加载中...'
            })
            getAdvertisement({ platform: 'MOBILE' }).then((res) => {
                if (res.data.success) {
                    uni.hideLoading()
                    // 重置数据
                    this.bannerData = {
                        DIMENSION_BANNER1: null,
                        DIMENSION_BANNER2: null,
                        DIMENSION_BANNER3: null,
                        DIMENSION_BANNER4: null
                    }
                    // 先处理分类图标数据，分别获取4个位置的图标
                     const iconData1 = res.data.result.find((item) => item.location === 'DIMENSION_ICON1')
                     const iconData2 = res.data.result.find((item) => item.location === 'DIMENSION_ICON2')
                     const iconData3 = res.data.result.find((item) => item.location === 'DIMENSION_ICON3')
                     const iconData4 = res.data.result.find((item) => item.location === 'DIMENSION_ICON4')

                     // 构建分类列表，每个位置对应一个分类图标
                     this.categoryList = [
                         { ...iconData1 },
                         { ...iconData2 },
                         { ...iconData3 },
                         { ...iconData4 }
                     ]

                     // 再处理广告横幅数据，分别获取4个位置的广告横幅数据
                     const banner1 = res.data.result.find((item) => item.location === 'DIMENSION_BANNER1')
                     const banner2 = res.data.result.find((item) => item.location === 'DIMENSION_BANNER2')
                     const banner3 = res.data.result.find((item) => item.location === 'DIMENSION_BANNER3')
                     const banner4 = res.data.result.find((item) => item.location === 'DIMENSION_BANNER4')

                     // 存储广告横幅数据到bannerData对象中
                     this.bannerData = {
                         DIMENSION_BANNER1: banner1,
                         DIMENSION_BANNER2: banner2,
                         DIMENSION_BANNER3: banner3,
                         DIMENSION_BANNER4: banner4
                     }
                     console.log('bannerList', banner1)
                     this.bannerList = [
                         { ...banner1 },
                         { ...banner2 },
                         { ...banner3 },
                         { ...banner4 }
                     ]
                    // 设置默认广告横幅（第一个分类）
                    this.updateAdBanner('DIMENSION_BANNER1')

                    // 处理超级爆款数据
                    const superHotDeals = res.data.result.filter((item) => item.location === 'HOT_PRODUCT')
                    this.superHotDeals = superHotDeals.map((item) => ({ ...item, image: item.img }))
                }else{
                    uni.hideLoading()
                }
            })
        },
        //加载楼层分类
        loadFloorList() {
            getPopularCategoryTree({version:2}).then(res => {
                if (res.data.success) {
                    // 只取一级分类
                    res.data.result.forEach(item => {
                        this.arrFloorList.push({ name: item.name, id: item.id, categoryId: item.id })
                    })
                     // 给分类id赋值默认第一个分类id
                     if (this.arrFloorList.length > 0) {
                        this.categoryGoodsParams.categoryId = this.arrFloorList[0].categoryId
                    }
                    this.loadRecommendGoods()
                }
            })
        },
        // 分类商品列表
        loadRecommendGoods() {
            this.categoryGoodsLoading = true
            getGoodsList(this.categoryGoodsParams).then((res) => {
                this.categoryGoodsLoading = false
                if (res.data.success) {
                    if (this.categoryGoodsParams.pageNumber === 1) this.categoryGoods = []
                    if (res.data.result.records.length != this.categoryGoodsParams.pageSize) {
                        this.haveNextCategoryPage  = false
                    }
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
                        this.categoryGoods.push({
                            id: item.id,
                            goodsId: item.goodsId,
                            icon: item.thumbnail,
                            name: item.goodsName,
                            buyCount: item.buyCount,
                            price: item.price,
                            integer: integer,
                            decimal: decimal,
                        })
                    })
                }
            })
        },
        // 热销榜单商品
        loadHotSalesRank() {
            getHotSalesRank().then((res) => {
                if (res.data.success) {
                    // 只取前三条记录
                    this.hotSalesRank = res.data.result
                }
            })
        },
        //触底事件
        reachBottom: function () {
            if (!this.categoryGoodsLoading && this.haveNextCategoryPage ) {
                this.categoryGoodsParams.pageNumber = this.categoryGoodsParams.pageNumber + 1
                this.loadRecommendGoods()
            }
        },
        selectCategory(index) {
            this.selectedCategoryIndex = index
            // 更新对应的广告横幅
            const bannerKey = `DIMENSION_BANNER${index + 1}`
            this.updateAdBanner(bannerKey)
        },
        selectTab(item,index) {
            this.selectedTabIndex = index
            this.categoryGoodsParams.pageNumber = 1
            this.categoryGoodsParams.categoryId = item.categoryId
            this.haveNextCategoryPage = true
            this.categoryGoodsLoading = false
            this.loadRecommendGoods()
        },
        goToCustomerService() {
            // 使用公共导航方法跳转到客服页面
            handleNavigation({
                path: '/pages/customerService/servicecenter'
            })
        },
        viewRanking() {
            // 跳转到热销榜单商品列表
            handleNavigation({
                path: '/pages/region/hotSellingRank'
            })
        },
        // 跳转热销榜单商品详情
        hotGoodClick(id, goodsId) {
            console.log(id,goodsId);

            handleNavigation({
                path: '/pages/product/goods?id=' + id + '&goodsId=' + goodsId
            })
        },
        getCategoryBgImage(index) {
            // 只有选中的分类才显示对应的背景图
            if (this.selectedCategoryIndex === index) {
                // 固定4个分类，根据位置选择背景图
                if (index === 0) {
                    return `url(${this.iconCommon}/static/region/selZone-left.png)`
                } else if (index === 3) {
                    return `url(${this.iconCommon}/static/region/selZone-right.png)`
                } else {
                    return `url(${this.iconCommon}/static/region/selZone-center.png)`
                }
            }
            return ''
        },

        // 更新广告横幅
        updateAdBanner(bannerKey) {
            const bannerData = this.bannerData[bannerKey]
            if (bannerData && bannerData.img) {
                this.adBannerImage = bannerData.img
                // 存储当前广告数据用于点击跳转
                this.currentBannerData = bannerData
            }
        },
        // 广告横幅点击处理
        onAdBannerClick(index) {
          console.log(this.bannerList[index])
            if (this.bannerList[index]) {
                // 使用公共导航方法处理跳转
                handleNavigation(this.bannerList[index])
            }
        },
        // 点击超级爆款
        onClickSuperHotDeals(index) {
            let currentBanner = {}
			if (index > 0 || index == 0) {
				currentBanner = this.superHotDeals[index];
			}
            handleNavigation(currentBanner)
        },
         // 跳转搜索页
         toSearch: function () {
			uni.navigateTo({
				url: '/pages/search/search'
			});
		},

    },
    // 触底事件
    onReachBottom() {
        this.reachBottom()
    },
    onLoad() {
        // 获取广告
        this.loadAdvertisement()
        // 获取热销榜单
        this.loadHotSalesRank()
        // 获取楼层分类
        this.loadFloorList()
    }
}
</script>

<style lang="scss" scoped>
.weidu-boutique {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: calc(var(--status-bar-height)) 0 40rpx 0;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
}

// 搜索栏样式
.search-container {
    display: flex;
    align-items: center;
    padding: 20rpx 20rpx;
}

.search-bar {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 4rpx solid #d62c1f;
    border-radius: 50rpx;
    padding: 10rpx 30rpx;
    margin-right: 30rpx;
}

.search-input {
    flex: 1;
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #999;
}

.customer-service {
    display: flex;
    flex-direction: column;
    align-items: center;
    .customer-service-icon {
        width: 42rpx;
        height: 68rpx;
    }
}

.service-text {
    font-size: 20rpx;
    color: #666;
    margin-top: 8rpx;
}

// 分类导航样式
.category-container {
    margin: 0;
    position: relative;
    z-index: 2;
    overflow: hidden;
}

.category-list {
    display: flex;
    align-items: center;
    position: relative;
    .category-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20rpx 0;
        border-radius: 20rpx;
        transition: all 0.3s ease;
        position: relative;
        flex: 1;
        &.active {
            .category-text {
                color: #fff !important;
                font-weight: 600;
                background: linear-gradient(313deg, #e22221 0%, #ff6d6c 100%) !important;
                padding: 4rpx 18rpx;
                border-radius: 20rpx;
                margin-top: 16rpx;
            }
        }

        .category-text {
            font-size: 24rpx;
            color: #333;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
            white-space: nowrap;
        }
    }
}

.category-bg {
    width: 260rpx;
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20rpx;
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position-y: 100%;
}

.category-icon {
    width: 70rpx;
    height: 70rpx;
    margin-bottom: 15rpx;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    z-index: 2;
}

.category-icon-expanded {
    width: 80rpx !important;
    height: 80rpx !important;
    transform: scale(1.25);
}

// 连接背景区域样式
.connection-bg {
    position: relative;
    margin: -10rpx 0 0 0;
    height: 180rpx;
    overflow: hidden;
    z-index: 1;
    width: 100%;
}

.connection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

// 广告横幅样式
.ad-banner {
    position: relative;
    margin: -150rpx 20rpx 40rpx 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
    height: 300rpx;
    z-index: 2;
}

.banner-image {
    width: 100%;
    height: 100%;
}

// 超级爆款和热销榜单区域
.featured-section {
    display: flex;
    padding: 0 20rpx;
}

.super-hot-deals {
    flex: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    padding: 100rpx 30rpx 20rpx 30rpx;
    position: relative;
    margin-right: 20rpx;
    min-height: 346rpx;
}

.bestsellers-list {
    flex: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    padding: 30rpx;
    min-height: 346rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.view-ranking-btn {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: absolute;
    position: absolute;
    right: 0;
    top: 6rpx;
}

.view-ranking-text {
    font-size: 20rpx;
    color: #d08c20;
    margin-right: 6rpx;
}

.right-arrow {
    width: 18rpx;
    height: 18rpx;
}

.hot-tag {
    background-color: #e2282f;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
}

.tag-text {
    color: #fff;
    font-size: 20rpx;
    font-weight: bold;
}

.view-all {
    font-size: 24rpx;
    color: #999;
}

.deals-swiper {
}
/deep/ .u-indicator-item-round {
    width: 8rpx !important;
    height: 8rpx !important;
}
/deep/ .u-indicator-item-round-active {
    width: 24rpx !important;
    background-color: #666666 !important;
}
.button-text {
    color: #fff;
    font-size: 28rpx;
    font-weight: bold;
}

.rankings {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
}

.ranking-item {
    display: flex;
    align-items: center;
    height: 114rpx;
}

.ranking-item:nth-child(2) {
    // margin: 32rpx 0rpx;
}

.hot-tag-icon {
    width: 36rpx;
    height: 30rpx;
}

.rank-number {
    font-size: 36rpx;
    font-weight: bold;
    color: #e2282f;
    min-width: 60rpx;
    margin-right: 20rpx;
}

.product-image {
    width: 80rpx;
    height: 80rpx;
    border-radius: 10rpx;
    margin: 0 10rpx;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-name {
    font-size: 20rpx;
    color: #333;
    font-weight: 500;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

// 商品标签页
.product-tabs {
    white-space: nowrap;
    /* 隐藏滚动条 */
    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        background: transparent;
    }
    /* 兼容不同平台 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.tabs-container {
    display: flex;
    min-width: 100%;
}

.tabs-container::before,
.tabs-container::after {
    content: '';
    flex-shrink: 0;
    width: 20rpx; /* 使用伪元素创建左右边距 */
}

.tab-item {
    padding: 30rpx 20rpx;
    position: relative;
    flex-shrink: 0;
    white-space: nowrap;
}

.tab-text {
    font-size: 28rpx;
    color: #666;
    // transition: all 0.3s ease;
    white-space: nowrap;
}

.tab-item.active {
    .tab-text {
        color: #e2282f;
        font-weight: bold;
        font-size: 32rpx;
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 16rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 6rpx;
        background-color: #e2282f;
        border-radius: 2rpx;
    }
}

// 商品列表
.product-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin-bottom: 40rpx;
}

.product-item {
    width: calc(50% - 10rpx);
    position: relative;
    margin-bottom: 20rpx;
    margin-right: 20rpx;
}

.product-item:nth-child(2n) {
    margin-right: 0;
}

// 已售罄蒙层
.sold-out-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 12rpx;
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    padding: 30rpx;
}

.sold-out-banner {
    background-color: #fff;
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    transform: rotate(45deg);
    transform-origin: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.sold-out-text {
    color: #333;
    font-size: 24rpx;
    font-weight: bold;
}
.home-recommend-tip {
    text-align: center;
    margin: 40rpx 20rpx;
}
// 底部商品列表
.home-goods {
    padding: 0 8rpx;
    .list {
        display: flex;
        flex-wrap: wrap;
        .item {
            flex: 0 0 50%;
            max-width: 50%;
            box-sizing: border-box;
            padding: 0 12rpx 0;
            margin: 24rpx 0 0;
        }
    }
}

// tabbar占位区域
.tabbar-placeholder {
    height: 98rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
