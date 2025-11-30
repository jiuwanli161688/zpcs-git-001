<template>
    <view class="map-container">
        <!-- 地图组件 -->
        <view class="map-wrapper">
            <map
                :latitude="latitude"
                :longitude="longitude"
                :scale="scale"
                :markers="markers"
                :controls="controls"
                class="map-component"
                @markertap="onMarkerTap"
                @tap="onMapTap"
                @longpress="onMapLongPress"
                @regionchange="onRegionChange">
                <!-- 使用cover-view实现全局悬浮返回按钮 -->
                <cover-view class="global-back-button" @tap="onBackClick"
                    >×
                    <!-- <cover-view class="back-icon">×</cover-view> -->
                </cover-view>
            </map>
        </view>

        <!-- 搜索和商品列表卡片 -->
        <view class="content-card">
            <!-- 搜索栏 -->
            <view class="search-container">
                <view class="search-wrapper">
                    <view class="custom-search" @tap="onSearchFocus">
                        <u-icon name="search" color="#999" size="32" class="search-icon"></u-icon>
                        <input
                            class="search-input"
                            v-model="goodsParams.keyword"
                            placeholder="搜索商品或地点"
                            placeholder-class="search-placeholder"
                            :disabled="true"
                            @input="onSearchInput" />
                        <view class="clear-btn" v-if="goodsParams.keyword" @tap="onClearSearch">
                            <u-icon name="close-circle-fill" color="#ccc" size="32"></u-icon>
                        </view>
                    </view>
                    <view class="map-search-btn" @tap="onSearchFocus">
                        <u-icon name="map" color="#e22221" size="46"></u-icon>
                    </view>
                </view>
            </view>

            <!-- 商品列表 -->
            <view class="home-goods">
                <view class="list">
                    <view class="item" v-for="(item, index) in goodsList" :key="index">
                        <common-goods-item :goods="item" />
                    </view>
                </view>
            </view>
            <view v-show="loading" class="home-recommend-tip"> 正在加载，请稍后... </view>
            <!-- 缺省页显示 -->
            <EmptyBox
                v-show="!hasMore && !loading && goodsList.length === 0"
                mode="common"
                text="暂无商品数据" />
            <!-- 没有更多数据提示 -->
            <view v-show="!hasMore && !loading && goodsList.length > 0" class="home-recommend-tip"> 暂无更多数据 </view>
        </view>
    </view>
</template>

<script>
import { getRegionalGoods, getRegionByLatLng } from '@/api/region'
import { getAdCodeByRegionName, extractFirstLevelRegion } from '@/utils/regionUtils'

import commonGoodsItem from '@/components/Hina/CommonGoodsItem.vue'
import EmptyBox from '@/components/Hina/EmptyBox.vue'

export default {
    name: 'MapPage',
    components: {
        commonGoodsItem,
        EmptyBox
    },
    data() {
        return {
            // 地图相关
            latitude: 39.90923,
            longitude: 116.397428,
            scale: 4,
            markers: [],
            controls: [
                {
                    id: 1,
                    position: {
                        left: 20,
                        top: 200,
                        width: 50,
                        height: 50
                    },
                    clickable: true
                }
            ],
            // 商品列表相关
            goodsList: [],
            loading: false,
            hasMore: true,
            // 商品查询参数
            goodsParams: {
                pageNumber: 1,
                pageSize: 10,
                keyword: '',
                provinceCode: ''
            },
            curRegion: ''
        }
    },

    onLoad(options) {
        // 获取当前位置并初始化
        this.getCurrentLocationAndSearch()
        // 防止页面显示时自动滚动到某个位置
         this.$nextTick(() => {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
        })
    },
    onShow() {

    },
    onReady() {
        // 页面渲染完成后确保从顶部开始显示
        this.$nextTick(() => {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
        })
    },

    methods: {
        // 获取当前位置并执行搜索
        getCurrentLocationAndSearch() {
            uni.showLoading({
                title: '获取位置中...'
            })
            uni.getLocation({
                type: 'gcj02', // 返回可以用于uni.openLocation的经纬度
                success: async (res) => {
                    // 更新地图中心点
                    this.latitude = res.latitude
                    this.longitude = res.longitude
                    // 添加当前位置标记
                    this.addLocationMarker({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        title: '我的位置',
                        content: '当前位置',
                        bgColor: '#007aff',
                        textColor: '#ffffff'
                    })
                    uni.hideLoading()

                    // 获取当前位置的省份
                    this.curRegion = await this.loadRegionByLatLng(res.longitude, res.latitude)
                    // 将省份转换为provinceCode
                    this.goodsParams.provinceCode = getAdCodeByRegionName(this.curRegion)
                    // 将提取的省份赋值给搜索关键词显示
                    this.goodsParams.keyword = this.curRegion
                    // 重置分页状态
                    this.goodsParams.pageNumber = 1
                    this.hasMore = true
                    // 加载附近商品
                    this.loadGoodsList()
                },
                fail: (err) => {
                    console.error('获取位置失败:', err)
                    uni.hideLoading()
                    uni.showToast({
                        title: '获取位置失败，使用默认位置',
                        icon: 'none'
                    })
                    // 使用默认位置添加标记
                    this.addLocationMarker({
                        title: '默认位置',
                        content: '默认位置',
                        bgColor: '#999999',
                        textColor: '#ffffff'
                    })
                    // 重置分页状态
                    this.goodsParams.pageNumber = 1
                    this.hasMore = true
                    // 使用默认位置加载商品
                    this.loadGoodsList()
                }
            })
        },
        // 根据当前经纬度获取地区
        async loadRegionByLatLng(longitude, latitude) {
            let params = {
                location: longitude + ',' + latitude
            }
            const res = await getRegionByLatLng(params)
            return res.data.result.province || ''
        },

        // 地图点击事件
        onMapTap(e) {
            console.log('地图点击:', e)
        },
        // 地图长按事件
        onMapLongPress(e) {
            console.log('地图长按:', e)
        },
        // 标记点击事件
        onMarkerTap(e) {
            console.log('标记点击:', e)
            const markerId = e.detail.markerId
            const marker = this.markers.find((m) => m.id === markerId)
            if (marker) {
                uni.showToast({
                    title: marker.title || '标记点',
                    icon: 'none'
                })
            }
        },
        // 地图区域变化
        onRegionChange(e) {

        },
        // 搜索输入
        onSearchInput(e) {
            this.goodsParams.keyword = e.detail.value
        },
        // 搜索聚焦
        onSearchFocus() {
            uni.chooseLocation({
                success: (res) => {
                    console.log('res', res)
                    // 提取一级行政区
                    this.curRegion = extractFirstLevelRegion(res)
                    // 更新地图中心点到选择的位置
                    this.latitude = res.latitude
                    this.longitude = res.longitude
                    // 将provinceCode作为关键词传给后端
                    this.goodsParams.provinceCode = getAdCodeByRegionName(this.curRegion)
                    // 将提取的省份赋值给搜索关键词显示
                    this.goodsParams.keyword = this.curRegion
                    this.goodsParams.pageNumber = 1 // 重置页码
                    this.hasMore = true
                    // 添加选择位置的标记
                    this.addLocationMarker({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        title: res.name || '选择的位置',
                        content: res.address || '选择的位置',
                        bgColor: '#ffffff',
                        textColor: '#333333'
                    })
                    // 重新加载商品
                    this.loadGoodsList()
                },
                fail: (err) => {
                    console.error('选择位置失败:', err)
                }
            })
        },
        // 清除搜索
        onClearSearch() {
            this.goodsParams.keyword = ''
            this.goodsParams.provinceCode = ''
            this.curRegion = ''
            this.goodsParams.pageNumber = 1 // 重置页码
            this.hasMore = true // 重置分页状态
            this.loadGoodsList()
        },
        // 加载商品列表
        async loadGoodsList() {
            if (this.loading || !this.hasMore) return
            this.loading = true
            let params = {
                pageNumber: this.goodsParams.pageNumber,
                pageSize: this.goodsParams.pageSize,
                provinceCode: this.goodsParams.provinceCode
            }
            const res = await getRegionalGoods(params)
            if (res.data && res.data.success) {
                if (this.goodsParams.pageNumber === 1) this.goodsList = []
                if (res.data.result.records.length != this.goodsParams.pageSize) {
                    this.hasMore = false
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
                    const goodsItem = {
                        id: item.id,
                        goodsId: item.goodsId,
                        icon: item.thumbnail,
                        name: item.goodsName,
                        buyCount: item.buyCount,
                        price: item.price,
                        integer: integer,
                        decimal: decimal
                    }
                    this.goodsList.push(goodsItem)
                })
            }
            this.loading = false
        },
        // 加载更多商品
        loadMoreGoods() {
            if (this.hasMore && !this.loading) {
                this.goodsParams.pageNumber = this.goodsParams.pageNumber + 1
                this.loadGoodsList()
            }
        },
        // 添加位置标记（通用方法）
        addLocationMarker(options = {}) {
            // 清除所有标记
            this.markers = []

            // 默认参数
            const defaults = {
                latitude: this.latitude,
                longitude: this.longitude,
                title: '位置',
                content: '位置',
                bgColor: '#007aff',
                textColor: '#ffffff'
            }

            // 合并参数
            const config = { ...defaults, ...options }

            // 添加位置标记
            const locationMarker = {
                id: 1,
                latitude: config.latitude,
                longitude: config.longitude,
                iconPath: config.iconPath,
                width: 30,
                height: 30,
                title: config.title,
                callout: {
                    content: config.content,
                    color: config.textColor,
                    fontSize: 12,
                    borderRadius: 4,
                    bgColor: config.bgColor,
                    padding: 4,
                    display: 'BYCLICK'
                }
            }
            this.markers.push(locationMarker)
        },

        // 返回按钮点击事件
        onBackClick() {
            uni.navigateBack({
                delta: 1
            })
        },

        // 商品点击
        onGoodsClick(goods) {
            uni.navigateTo({
                url: `/pages/product/goods?id=${goods.id}&goodsId=${goods.goodsId}`
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
.map-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.map-wrapper {
    height: 600rpx;
    position: relative;
}

.map-component {
    width: 100%;
    height: 100%;
}

/* 搜索和商品列表统一卡片容器 */
.content-card {
    background-color: #ffffff;
    border-radius: 20rpx 20rpx 0 0;
    box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 600rpx); /* 确保内容区域至少占满剩余高度 */

    // 添加顶部灰色小条
    &::before {
        content: '';
        position: absolute;
        top: 20rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 80rpx;
        height: 6rpx;
        background-color: #e0e0e0;
        border-radius: 3rpx;
        z-index: 11;
    }
}

.search-container {
    padding: 50rpx 20rpx 20rpx 20rpx;
}

/* 搜索包装器 */
.search-wrapper {
    display: flex;
    align-items: center;
}

/* 自定义搜索框样式 */
.custom-search {
    display: flex;
    align-items: center;
    background-color: #f3f3f3;
    border-radius: 20rpx;
    height: 80rpx;
    padding: 0 20rpx;
    flex: 1;
}

/* 地图搜索按钮 */
.map-search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
    background-color: #f3f3f3;
    border-radius: 50%;
    margin-left: 20rpx;
    transition: all 0.2s ease;
}

.map-search-btn:active {
    transform: scale(0.95);
    background-color: #d0d0d0;
}

.search-icon {
    margin-right: 16rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    background: transparent;
    border: none;
    outline: none;
}

.search-input[disabled] {
    color: #333;
    opacity: 1;
}

.search-placeholder {
    color: #999;
}

.clear-btn {
    margin-left: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.home-goods {
    padding: 0 24rpx 24rpx;

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

.global-back-button:active {
    transform: scale(0.95);
}

.back-icon {
    display: inline-block;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    line-height: 32rpx;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
}

.home-recommend-tip {
    text-align: center;
    margin-bottom: 20px;
}
</style>
