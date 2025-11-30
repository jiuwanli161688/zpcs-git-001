<template>
  <view class="page">
    <!-- 顶部搜索 -->
    <search-header
      :city="currentCity"
      :keyword.sync="searchKeyword"
      placeholder="搜索城市/区县"
      @choose-city="chooseCity"
      @search="handleSearch"
      @scan="handleScan"
    />

    <!-- 主内容区 -->
    <view class="main-content">
      <!-- Banner 区域 -->
      <banner-grid
        :main-banner="mainBanner"
        :sub-banners="subBanners"
        @click-main="navToZone"
        @click-sub="navToZone"
      />

      <!-- 乡愁导航 -->
      <region-nav
        :list="regionList"
        @item-click="navToRegion"
        @more-click="viewMoreRegions"
      />

      <!-- 热卖商品 -->
      <product-scroll
        title="热卖商品"
        :list="hotProducts"
        @item-click="navToProduct"
        @more-click="viewMoreProducts"
      />

      <template v-if="false">
        <!-- 服务分类 -->
        <service-grid
          :list="serviceList"
          @item-click="navToService"
        />

        <!-- 筛选栏 -->
        <filter-bar
          :list="filterList"
          @filter-change="handleFilterChange"
        />

        <!-- 商家列表 -->
        <view class="shop-list">
          <shop-card
            v-for="(shop, index) in shopList"
            :key="index"
            :shop="shop"
            @click="navToShop"
          />
        </view>
      </template>

      <!-- 加载更多 -->
      <view class="load-more">
        <uni-load-more :status="loadStatus"></uni-load-more>
      </view>
    </view>
  </view>
</template>

<script>
// 导入组件
import SearchHeader from './components/home/search-header.vue'
import BannerGrid from './components/home/banner-grid.vue'
import RegionNav from './components/home/region-nav.vue'
import ProductScroll from './components/home/product-scroll.vue'
import ServiceGrid from './components/home/service-grid.vue'
import FilterBar from './components/home/filter-bar.vue'
import ShopCard from './components/home/shop-card.vue'

import CategoryNav from './components/category-nav.vue';
import FilterBarIndex from './components/filter-bar.vue';
import FilterDropdown from './components/filter-dropdown.vue';

export default {
  components: {
    SearchHeader,
    BannerGrid,
    RegionNav,
    ProductScroll,
    ServiceGrid,
    FilterBar,
    ShopCard,
    CategoryNav,
    FilterBarIndex,
    FilterDropdown,
  },
  
  data() {
    return {
      currentCity: '北京市',
      searchKeyword: '',
      currentTab: 0,
      loadStatus: 'more',
      
      // Banner 数据
      mainBanner: {
        title: '山东省',
        subtitle: '地标产品专区',
        image: '/static/cbd/shop/detail/test-img.png',
        flag: '/static/cbd/shop/detail/test-img.png',
        code: 'shandong'
      },
      subBanners: [
        { title: '内蒙古专区', image: '/static/cbd/shop/detail/test-img.png', code: 'neimenggu' },
        { title: '海南专区', image: '/static/cbd/shop/detail/test-img.png', code: 'hainan' }
      ],
      
      // 地区列表
      regionList: [
        { name: '山东', image: '/static/cbd/shop/detail/test-img.png', code: 'shandong' },
        { name: '内蒙古', image: '/static/cbd/shop/detail/test-img.png', code: 'neimenggu' },
        { name: '四川', image: '/static/cbd/shop/detail/test-img.png', code: 'sichuan' }
      ],
      
      // 热卖商品
      hotProducts: [
        { id: 1, name: '铁棍山药', image: '/static/cbd/shop/detail/test-img.png' },
        { id: 2, name: '五常大米', image: '/static/cbd/shop/detail/test-img.png' },
        { id: 3, name: '宁夏枸杞', image: '/static/cbd/shop/detail/test-img.png' },
        { id: 4, name: '信阳毛尖', image: '/static/cbd/shop/detail/test-img.png' },
        { id: 5, name: '烟台苹果', image: '/static/cbd/shop/detail/test-img.png' }
      ],
      
      // 服务分类
      serviceList: [
        { name: '奶茶咖啡', icon: '/static/icons/coffee.png', bgColor: '#f3e5f5' },
        { name: '美食', icon: '/static/icons/food.png', bgColor: '#e8f5e9' },
        { name: '休闲玩乐', icon: '/static/icons/play.png', bgColor: '#fff3e0' },
        { name: '美人丽发', icon: '/static/icons/beauty.png', bgColor: '#ffebee' },
        { name: '按摩洗浴', icon: '/static/icons/spa.png', bgColor: '#e3f2fd' }
      ],
      
      // 筛选项
      filterList: [
        { label: '分类', type: 'category', active: false },
        { label: '附近', type: 'nearby', active: false },
        { label: '排序', type: 'sort', active: false }
      ],
      
      // 商家列表
      shopList: [
        {
          id: 1,
          name: '咱家小院铁锅炖（亦庄店）',
          image: '/static/images/shop1.png',
          score: 3.8,
          isOpen: true,
          category: '东北菜',
          area: '亦庄',
          distance: '365m',
          coupon: '消费1元兑付0.5水机兑换券'
        },
        {
          id: 2,
          name: '咱家小院铁锅炖（亦庄店）',
          image: '/static/images/shop1.png',
          score: 3.8,
          isOpen: true,
          category: '东北菜',
          area: '亦庄',
          distance: '365m',
          coupon: '消费1元兑付0.5水机兑换券'
        }
      ],
      
      // TabBar
      tabList: [
        { name: '地域', icon: 'location', badge: '' },
        { name: '维度精品', icon: 'star', badge: '' },
        { name: '购物车', icon: 'cart', badge: '1' },
        { name: '我的', icon: 'person', badge: '' }
      ]
    }
  },
  
  onLoad() {
    // 移除 calcScrollHeight 方法调用
  },
  
  methods: {
    // 选择城市
    chooseCity() {
      uni.navigateTo({ url: '/pages/city/city' })
    },
    
    // 搜索
    handleSearch(keyword) {
      if (!keyword.trim()) {
        return uni.showToast({ title: '请输入搜索内容', icon: 'none' })
      }
      uni.navigateTo({ url: `/pages/search/search?keyword=${keyword}` })
    },
    
    // 扫码结果
    handleScan(result) {
      console.log('扫码结果:', result)
    },
    
    // 跳转专区
    navToZone(item) {
      uni.navigateTo({ url: `/pages/zone/zone?code=${item.code}` })
    },
    
    // 跳转地区
    navToRegion(item) {
      uni.navigateTo({ url: `/pages/region/region?code=${item.code}` })
    },
    
    // 查看更多地区
    viewMoreRegions() {
      uni.navigateTo({ url: '/pages/region/list' })
    },
    
    // 跳转商品详情
    navToProduct(item) {
      uni.navigateTo({ url: `/pages/product/detail?id=${item.id}` })
    },
    
    // 查看更多商品
    viewMoreProducts() {
      uni.navigateTo({ url: '/pages/product/list' })
    },
    
    // 跳转服务分类
    navToService(item) {
      uni.navigateTo({ url: `/pages/service/list?type=${item.name}` })
    },
    
    // 筛选变更
    handleFilterChange(item) {
      this.filterList.forEach(f => {
        f.active = f.type === item.type ? !f.active : false
      })
    },
    
    // 跳转商家详情
    navToShop(shop) {
      uni.navigateTo({ url: `/pages/shop/detail?id=${shop.id}` })
    },
    
    // 加载更多
    loadMore() {
      if (this.loadStatus !== 'more') return
      this.loadStatus = 'loading'
      setTimeout(() => {
        this.loadStatus = 'more'
      }, 1000)
    },
    
    // 切换 Tab
    switchTab(index) {
      this.currentTab = index
      const pages = ['/pages/index/index', '/pages/featured/featured', '/pages/cart/cart', '/pages/mine/mine']
      uni.switchTab({ url: pages[index] })
    }
  },
  
  onReachBottom() {
    this.loadMore()
  }
}
</script>

<style lang="scss">
$bg-page: #f8f8f8;

/* 添加页面级滚动条隐藏样式 */
page {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* 隐藏页面滚动条 */
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page {
  min-height: 100vh;
  background-color: $bg-page;
  padding: 0 20rpx;
  box-sizing: border-box;
  /* 隐藏容器滚动条 */
  overflow: hidden;
}

.main-content {
  margin: calc(var(--status-bar-height) + 180rpx) 0 0 0;
  box-sizing: border-box;
  overflow: hidden;
  /* 添加底部 padding 避免被 tabbar 遮挡 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);
}

.shop-list {
  padding-bottom: 30rpx;
}

.load-more {
  padding: 20rpx 0;
}
</style>
