<template>
    <view class="region-container" :style="{ backgroundImage: `url(${regionBgPath})` }">
        <!-- 内容区域 -->
        <view class="content-section">
            <!-- 顶部区域 -->
            <view class="header-section">
                <view class="logo-section">
                    <image :src="logoPath" mode="aspectFit" class="logo"></image>
                    <text class="slogan">从产地到品质的信任之选</text>
                </view>
                <!-- <view class="search-container" @tap="toSearch">
                    <image :src="iconSearch" mode="aspectFill" class="search-icon"></image>
                </view> -->
            </view>

            <!-- 区域横幅 -->
            <view class="banner-section">
                <!-- 主焦点广告位 -->
                <view class="banner-left" v-if="bannerData.REGION_LEFT_BANNER" @tap="bannerClick(bannerData.REGION_LEFT_BANNER)">
                    <image :src="bannerData.REGION_LEFT_BANNER.img" mode="aspectFill" class="banner-image"></image>
                </view>

                <!-- 侧边广告位 -->
                <view class="banner-right" v-if="bannerData.REGION_RIGHT_BANNER || bannerData.REGION_BOTTOM_BANNER">
                    <view class="banner-top" v-if="bannerData.REGION_RIGHT_BANNER" @tap="bannerClick(bannerData.REGION_RIGHT_BANNER)">
                        <image :src="bannerData.REGION_RIGHT_BANNER.img" mode="aspectFill" class="banner-image"></image>
                    </view>
                    <view class="banner-bottom" v-if="bannerData.REGION_BOTTOM_BANNER" @tap="bannerClick(bannerData.REGION_BOTTOM_BANNER)">
                        <image :src="bannerData.REGION_BOTTOM_BANNER.img" mode="aspectFill" class="banner-image"></image>
                    </view>
                </view>
            </view>

            <!-- 导航区域 -->
            <view class="navigation-section">
                <view class="nav-container">
                    <!-- 左侧固定元素 -->
                    <image :src="iconRegionTopLeft" mode="aspectFill" class="fixed-icon-left" @tap="goMap"></image>
                    <!-- 中间滚动区域 -->
                    <view class="nav-scroll-container">
                        <view class="nav-scroll-content" :style="{ transform: `translateX(${scrollOffset}px)` }">
                            <view class="nav-item" v-for="(city, index) in displayCities" :key="index">
                                <view class="nav-icon" @tap="goThematicPage(city)">
                                    <image :src="city.img" mode="aspectFill"></image>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- 右侧固定元素 -->
                    <image :src="iconRegionTopRight" mode="aspectFill" class="fixed-icon" @tap="goRegionZone"></image>
                </view>
            </view>

            <!-- 热卖商品 -->
            <view class="hot-products-section">
                <view class="section-header">
                    <text class="section-title">热卖商品</text>
                    <view class="view-more" @tap="goHotProducts">
                        <text class="view-more-text">查看更多</text>
                        <image :src="iconViewMore" mode="aspectFit" class="view-more-icon"></image>
                    </view>
                </view>
                <scroll-view class="products-scroll" scroll-x="true">
                    <view class="products-list">
                        <view class="product-card" v-for="(product, index) in hotProducts" :key="index" @tap="hotGoodClick(product.id, product.goodsId)">
                            <image :src="product.goodsIcon" mode="aspectFill" class="product-image"></image>
                            <text class="product-name">{{ product.displayText }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 楼层专区 -->
            <view class="organic-section" v-for="(product, index) in organicProducts" :key="index">
                <view class="section-banner" @tap="bannerClick(product)">
                    <image :src="product.floorIcon" mode="aspectFill" class="banner-bg" ></image>
                </view>
                <view class="products-grid" v-if="product.goodsList.length > 0">
                    <view class="product-item" v-for="(item, index) in product.goodsList" :key="index" @tap="hotGoodClick(item.id, item.goodsId)">
                        <image :src="item.thumbnail" mode="aspectFill" class="product-image"></image>
                        <text class="product-name">{{ item.displayText }}</text>
                    </view>
                </view>
            </view>
            <!-- 楼层商品 -->
            <view class="home-goods">
                <view class="search-box">
                  <view class="nav-item" :class="{ current: filterIndex === 0 }" @tap="tabClick(0, 'rank')">
                    <text :class="['nav-text', {'current': filterIndex === 0}]">综合</text>
                    <view class="p-box">
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowUpAtv" v-if="recommendGoodsParams.sort === 'rank' && recommendGoodsParams.order === 'asc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowUp" v-else mode="aspectFit"></image>
                      </view>
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowDownAtv"
                               v-if="recommendGoodsParams.sort === 'rank' && recommendGoodsParams.order === 'desc'" mode="aspectFit"></image>
                        <image class="img" :src="arrowDown" v-else mode="aspectFit"></image>
                      </view>
                    </view>
                  </view>
                  <view class="nav-item" :class="{ current: filterIndex === 1 }" @tap="tabClick(1, 'buy_count')">
                    <text :class="['nav-text', {'current': filterIndex === 1}]">销量</text>
                    <view class="p-box">
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowUpAtv" v-if="recommendGoodsParams.sort === 'buy_count' && recommendGoodsParams.order === 'asc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowUp" v-else mode="aspectFit"></image>
                      </view>
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowDownAtv"
                               v-if="recommendGoodsParams.sort === 'buy_count' && recommendGoodsParams.order === 'desc'" mode="aspectFit"></image>
                        <image class="img" :src="arrowDown" v-else mode="aspectFit"></image>
                      </view>
                    </view>
                  </view>
                  <view class="nav-item" :class="{ current: filterIndex === 2 }" @tap="tabClick(2, 'price')">
                    <text :class="['nav-text', {'current': filterIndex === 2}]">价格</text>
                    <view class="p-box">
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowUpAtv" v-if="recommendGoodsParams.sort === 'price' && recommendGoodsParams.order === 'asc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowUp" v-else mode="aspectFit"></image>
                      </view>
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowDownAtv" v-if="recommendGoodsParams.sort === 'price' && recommendGoodsParams.order === 'desc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowDown" v-else mode="aspectFit"></image>
                      </view>
                    </view>
                  </view>
                  <view class="nav-item" :class="{ current: filterIndex === 3}" @tap="tabClick( 3, 'listingTime')">
                    <text :class="['nav-text', {'current': filterIndex === 3}]">上架时间</text>
                    <view class="p-box">
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowUpAtv" v-if="recommendGoodsParams.sort === 'listingTime' && recommendGoodsParams.order === 'asc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowUp" v-else mode="aspectFit"></image>
                      </view>
                      <view class="index-nav-arrow">
                        <image class="img" :src="arrowDownAtv" v-if="recommendGoodsParams.sort === 'listingTime' && recommendGoodsParams.order === 'desc'"
                               mode="aspectFit"></image>
                        <image class="img" :src="arrowDown" v-else mode="aspectFit"></image>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="list">
                    <view class="item" v-for="(item, index) in arrHomeGoods" :key="index">
                        <common-goods-item :goods="item" />
                    </view>
                </view>
            </view>
            <view v-show="recommendGoodsLoading" class="home-recommend-tip"> 正在加载，请稍后... </view>
            <view v-show="!haveNextRecomendPage && !recommendGoodsLoading" class="home-recommend-tip"> 暂无更多数据 </view>
        </view>

        <!-- 底部安全区域占位 -->
        <view class="tabbar-placeholder"></view>

        <!-- 自定义tabbar -->
        <custom-tabbar :current="0"></custom-tabbar>
    </view>
</template>

<script>
import CommonGoodsItem from '@/components/Hina/CommonGoodsItem'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import { getAdvertisement,getHotProducts,getFloorDetail,getRecommendGoods, pageRecommendGoods } from '@/api/region'
import { handleNavigation, JUMP_TYPE } from '@/utils/navigation.js'
import { getUpgradeStatus } from '@/api/common'
import { redirectToWebsite } from '@/utils/tools.js'

export default {
    name: 'Region',
    components: {
        CommonGoodsItem,
        CustomTabbar
    },
    data() {
        return {
            scrollOffset: 0,
            scrollSpeed: 1,
            itemWidth: 0, // 动态获取的城市项宽度
            displayCities: [],
            iconRegionTopRight: `${this.iconCommon}/static/region/icon2.png`,
            iconRegionTopLeft: `${this.iconCommon}/static/region/icon1.png`,
            iconSearch: `${this.iconCommon}/static/region/search.png`,
            logoPath: `${this.iconCommon}/static/region/logo.png`,
            iconViewMore: `${this.iconCommon}/static/region/more.png`,
            regionBgPath: `${this.iconCommon}/static/region/regionbg.png`,
            cities: [],
            hotProducts: [],
            organicProducts: [],
            arrHomeGoods: [],
            currentFloor: '0',
            recommendGoodsParams: {
              pageNumber: 1,
              pageSize: 10,
              sort: 'rank',
              order: 'asc'
            },
            recommendGoodsLoading: false,
            haveNextRecomendPage: true,
            bannerData: {
                REGION_LEFT_BANNER: null,        // 主焦点广告
                REGION_RIGHT_BANNER: null,  // 侧边上方广告
                REGION_BOTTOM_BANNER: null // 侧边下方广告
            }, // 广告数据对象
            filterIndex: 0,
            arrowUp: `${this.iconCommon}/static/v1/profile/arrow-up.png`,
            arrowUpAtv: `${this.iconCommon}/static/v1/profile/arrow-up-atv.png`,
            arrowDown: `${this.iconCommon}/static/v1/profile/arrow-down.png`,
            arrowDownAtv: `${this.iconCommon}/static/v1/profile/arrow-down-atv.png`,
        }
    },

    onLoad() {
        this.goToWebsite()
        // 获取升级状态
        this.getUpgradeStatus()
        this.loadRecommendGoods()
        // 获取广告
        this.loadAdvertisement()
        // 获取热卖商品
        this.loadHotProducts()
        // 获取楼层商品
        this.loadFloorDetail()
    },
  mounted() {
    const { windowWidth, windowHeight } = uni.getSystemInfoSync();

    let topHeight = 0;
    let navHeight = 0;

    uni.getSystemInfo({
      success: function (res) {
        // res - 各种参数

        let top = uni.createSelectorQuery().select('.u-navbar');
        top.boundingClientRect(function (data) {
          if (data && data.height) {
            //data - 各种参数
            topHeight = data.height; // 获取元素宽度
          }
        }).exec();
        let nav = uni.createSelectorQuery().select('.navbar');
        nav.boundingClientRect(function (data) {
          if (data && data.height) {
            //data - 各种参数
            navHeight = data.height; // 获取元素宽度
          }
        }).exec();
      }
    });
    this.goodsHeight = windowHeight - navHeight - topHeight;
    // #ifdef APP-PLUS
    this.goodsHeight = this.goodsHeight - 100;
    // #endif
    this.goodsHeight += 'px';
  },
    beforeDestroy() {
        this.stopScroll()
    },
    onShow() {
        // 页面显示时，如果有数据且需要轮播，重新启动
        if (this.cities.length > 3 && !this.scrollTimer) {
            this.startScroll()
        }
    },
    onHide() {
        // 页面隐藏时停止轮播，节省性能
        this.stopScroll()
    },
    // 触底事件
    onReachBottom() {
        this.reachBottom()
    },
    methods: {
        // 跳转热卖商品
        hotGoodClick(id, goodsId) {
            handleNavigation({
                path: '/pages/product/goods?id=' + id + '&goodsId=' + goodsId
            })
        },
        // 获取升级状态
    getUpgradeStatus() {
        getUpgradeStatus().then((res) => {
            if(res.data.success) {
              if(res.data.result.status == 2){
                uni.reLaunch({
                  url: '/pages/help/upgrade'
                })
              }
            }
        })
    },
        // 跳转搜索页
        toSearch: function () {
			uni.navigateTo({
				url: '/pages/search/search?regionFlag=true'
			});
		},
        // 跳转商品列表
        goHotProducts() {
            handleNavigation({
                path: '/pages/navigation/search/searchPage?keyword=&sort=buyCount&order=desc'
            })
        },
        loadAdvertisement() {
            getAdvertisement({ platform: 'MOBILE' }).then(res => {
                if (res.data.success) {
                    // 重置数据
                    this.bannerData = {
                        REGION_LEFT_BANNER: null,
                        REGION_RIGHT_BANNER: null,
                        REGION_BOTTOM_BANNER: null
                    }
                    res.data.result.forEach(item => {
                        const bannerItem = {...item}
                        // 根据位置分类存储
                        if (item.location === 'REGION_LEFT_BANNER') {
                            this.bannerData.REGION_LEFT_BANNER = bannerItem
                        } else if (item.location === 'REGION_RIGHT_BANNER') {
                            this.bannerData.REGION_RIGHT_BANNER = bannerItem
                        } else if (item.location === 'REGION_BOTTOM_BANNER') {
                            this.bannerData.REGION_BOTTOM_BANNER = bannerItem
                        }
                    })
                    // 获取logo
                    this.logoPath = res.data.result.find(item => item.location === 'REGION_ICON')?.img
                    // 圆形banner
                    this.cities = res.data.result.filter(item => item.location === 'REGION_BANNER')
                    // 先停止之前的轮播
                    this.stopScroll()
                    // 清空之前的displayCities，避免数据累积
                    this.displayCities = []
                    // 重新设置displayCities，为了实现无限轮播，我们需要至少两份数据
                    if(this.cities.length > 3) {
                        this.displayCities = [...this.cities, ...this.cities]
                    }else{
                        this.displayCities = this.cities
                    }
                    // 重置滚动偏移
                    this.scrollOffset = 0
                    // 三个以上才轮播
                    if(this.cities.length > 3) {
                        this.startScroll()
                    }

                }
            })
        },
        // 获取热卖商品
        loadHotProducts() {
            getHotProducts().then(res => {
                if (res.data.success) {
                    this.hotProducts = res.data.result
                }
            })
        },
        // 获取楼层商品
        loadFloorDetail() {
            getFloorDetail().then(res => {
                if (res.data.success) {
                    this.organicProducts = res.data.result
                  console.log('organicProducts', this.organicProducts)
                }
            })
        },
        // 广告点击处理
        bannerClick(banner) {
            if (!banner) return
            // 使用公共导航方法处理跳转
            handleNavigation(banner)
        },
        // 跳转地图
        goMap() {
            handleNavigation({
                path: '/pages/region/map'
            })
        },
        // 跳转地域专区
        goRegionZone() {
            handleNavigation({
                path: '/pages/region/region-zone'
            })
        },
        // 跳转专题页
        goThematicPage(item){
            console.log(item,'item');

            handleNavigation(item)
        },
        // 首页热卖商品列表
        loadRecommendGoods() {
           this.recommendGoodsLoading = true;
           pageRecommendGoods(this.recommendGoodsParams).then((res) => {
             this.recommendGoodsLoading = false
                if (res.data.success) {
                    if (this.recommendGoodsParams.pageNumber === 1) {
                      this.arrHomeGoods = []
                    }
                    if (res.data.result.records.length != this.recommendGoodsParams.pageSize) {
                        this.haveNextRecomendPage = false
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
                        this.arrHomeGoods.push({
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
            }).finally(() => {
              this.recommendGoodsLoading = false
            })
        },
        //触底事件
        reachBottom: function () {
            if (!this.recommendGoodsLoading && this.haveNextRecomendPage) {
                this.recommendGoodsParams.pageNumber = this.recommendGoodsParams.pageNumber + 1
                this.loadRecommendGoods()
            }
        },
        startScroll() {
            // 获取单个城市项的宽度，动态计算而不是硬编码
            this.$nextTick(() => {
                const query = uni.createSelectorQuery().in(this)
                query
                    .select('.nav-item')
                    .boundingClientRect((data) => {
                        if (data) {
                            this.itemWidth = data.width
                        } else {
                            // 备用方案：根据屏幕宽度估算，100rpx约等于50px
                            const systemInfo = uni.getSystemInfoSync()
                            this.itemWidth = (100 * systemInfo.windowWidth) / 750
                        }
                        this.scrollTimer = setInterval(() => {
                            this.scrollOffset -= this.scrollSpeed
                            // 当滚动距离达到一个完整数组长度时，重置位置实现无限循环
                            if (Math.abs(this.scrollOffset) >= this.cities.length * this.itemWidth) {
                                this.scrollOffset = 0
                            }
                        }, 50)
                    })
                    .exec()
            })
        },
        stopScroll() {
            if (this.scrollTimer) {
                clearInterval(this.scrollTimer)
                this.scrollTimer = null
            }
        },
        // 跳转到网站（根据设备类型自动选择）
        goToWebsite() {
            redirectToWebsite()
        },
      tabClick(index, type) {
        this.haveNextRecomendPage = true
        this.recommendGoodsParams.pageNumber = 1;
        this.recommendGoodsParams.pageSize = uni.getStorageSync("pageConfig")?.goodListSize || 10;
        // this.params.order = "desc";
        if (this.recommendGoodsParams.sort == type) {
          this.recommendGoodsParams.order == 'asc' ? (this.recommendGoodsParams.order = 'desc') : (this.recommendGoodsParams.order = 'asc');

          this.$set(this.recommendGoodsParams, 'sort', type);
        } else {
          this.recommendGoodsParams.order = 'desc';
          this.$set(this.recommendGoodsParams, 'sort', type);
        }

        this.filterIndex = index;
        this.loadRecommendGoods();
      },
    }
}
</script>
<style>
page{
    background-color: #f5f5f5 !important;
}
</style>
<style lang="scss" scoped>

.region-container {
    background-size: contain;
    background-repeat: no-repeat;
    padding: calc(var(--status-bar-height)) 0 0 0;
    // min-height: 100vh;

}

// 内容区域
.content-section {
    padding: 20rpx;
    background: linear-gradient(to bottom, transparent 0%, transparent 45%, #f5f5f5 45%, #f5f5f5 100%);
    //   min-height: 100vh;
}

// 顶部区域
.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .logo-section {
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        .logo {
            width: 184rpx;
            height: 68rpx;
            margin-bottom: 10rpx;
        }

        .slogan {
            font-size: 24rpx;
            color: #333;
        }
    }

    .search-container {
        display: flex;
        align-items: center;
        border-radius: 25rpx;

        .search-icon {
            width: 38rpx;
            height: 62rpx;
            margin-right: 10rpx;
        }
    }
}

// 区域横幅
.banner-section {
    display: flex;
    margin-bottom: 40rpx;

    .banner-left {
        width: 482rpx;
        height: 346rpx;
        border-radius: 20rpx;
        overflow: hidden;
        margin-right: 20rpx;

        .banner-image {
            width: 100%;
            height: 100%;
        }
    }

    .banner-right {
        flex: 1;
        display: flex;
        flex-direction: column;

        .banner-top {
            width: 210rpx;
            height: 164rpx;
            border-radius: 20rpx;
            overflow: hidden;
            margin-bottom: 20rpx;

            .banner-image {
                width: 100%;
                height: 100%;
            }
        }

        .banner-bottom {
            width: 210rpx;
            height: 164rpx;
            border-radius: 20rpx;
            overflow: hidden;

            .banner-image {
                width: 100%;
                height: 100%;
            }
        }
    }
}

// 导航区域
.navigation-section {
    margin-bottom: 30rpx;

    .nav-container {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .fixed-icon {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10rpx;
        flex-shrink: 0;
    }

    .fixed-icon-left {
        width: 160rpx;
        height: 110rpx;
        overflow: hidden;
    }

    .nav-scroll-container {
        flex: 1;
        overflow: hidden;
        margin: 0 10rpx;
        /* 隐藏滚动条 */
        ::-webkit-scrollbar {
            display: none;
        }
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
    }

    .nav-scroll-content {
        display: flex;
        width: max-content;
    }

    .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
        font-weight: 500;
    }

    .nav-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 10rpx;
        position: relative;

        image {
            width: 100%;
            height: 100%;
        }
    }
}

// 热卖商品
.hot-products-section {
    margin-bottom: 30rpx;

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .section-title {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }

        .view-more {
            display: flex;
            align-items: center;

            .view-more-text {
                font-size: 24rpx;
                color: #3d3d3d;
                margin-right: 10rpx;
            }

            .view-more-icon {
                width: 10rpx;
                height: 16rpx;
            }
        }
    }

    .products-scroll {
        white-space: nowrap;
        /* 隐藏滚动条 */
        ::-webkit-scrollbar {
            display: none;
        }
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */

        .products-list {
            display: flex;

            .product-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 128rpx;
                margin-right: 20rpx;

                .product-image {
                    width: 128rpx;
                    height: 128rpx;
                    border-radius: 15rpx;
                    margin-bottom: 10rpx;
                }

                .product-name {
                    font-size: 24rpx;
                    color: #333;
                    text-align: center;
                }
            }
        }
    }
}

// 绿色有机专区
.organic-section {
    display: flex;
    margin-bottom: 30rpx;
    position: relative;

    .section-banner {
        flex: 1;
        margin-right: 20rpx;

        .banner-bg {
            width: 214rpx;
            height: 200rpx;
        }
    }

    .products-grid {
        position: absolute;
        top: 6rpx; // 压在左边图片上大概五分之一
        display: flex;
        align-items: center;
        justify-content: space-around;
        background-color: #fff;
        padding: 20rpx;
        border-radius: 16rpx;
        left: 180rpx; // 往左边压住banner图大概五分之一的位置
        width: calc(100% - 180rpx); // 100%减去左边banner宽度和右边间距

        .product-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            max-width: 120rpx;

            .product-image {
                width: 114rpx;
                height: 114rpx;
                border-radius: 10rpx;
                margin-bottom: 8rpx;
            }

            .product-name {
                font-size: 24rpx;
                color: #333;
                text-align: center;
                line-height: 1.2;
            }
        }
    }
}

// 底部商品列表
.home-goods {
    .list {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -12rpx;

        .item {
            flex: 1;
            -ms-flex: 0 0 50%;
            flex: 0 0 50%;
            max-width: 70%;
            box-sizing: border-box;
            padding: 0 12rpx 0;
            margin: 24rpx 0 0;
        }
    }
}
.home-recommend-tip {
    text-align: center;
    margin: 40rpx;
}

// tabbar占位区域
.tabbar-placeholder {
    height: 98rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
// 响应式设计
@media screen and (max-width: 1200rpx) {
    .nav-fixed-left,
    .nav-fixed-right,
    .nav-item {
        width: 140rpx !important;
    }

    .nav-icon {
        width: 120rpx !important;
        height: 120rpx !important;
    }

    .fixed-icon {
        width: 120rpx !important;
        height: 120rpx !important;
    }
}
.search-box {
  display: flex;
  width: 100%;
  height: 80rpx;
  background: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
  border-radius: 12rpx;

  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 28rpx;
    color: $font-color-dark;
    position: relative;
    .nav-text {
      font-weight: 600;
      margin-right: 10rpx;
    }
    .current {
      color: #e22221;
    }
  }

  .p-box {
    display: flex;
    flex-direction: column;

    .yticon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30rpx;
      height: 14rpx;
      line-height: 1;
      margin-left: 4rpx;
      font-size: 26rpx;
      color: #888;
    }

    .xia {
      transform: scaleY(-1);
    }
  }
  .index-nav-arrow:last-child {
    margin-top: -22rpx;
  }
  .img {
    width: 20rpx;
    height: 20rpx;
  }
}
</style>
