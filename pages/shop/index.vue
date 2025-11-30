<template>
  <view class="container">
    <view v-if="!isHeaderFixed && isOpenFilter" class="fixed-white"></view>
    <!-- 头部区域 -->
    <view
      class="header-section"
      :style="{ paddingTop: sysInfo.statusBarHeight + 'px' }"
    >
      <image
        class="header-bg"
        src="/static/header-bg.png"
        mode="aspectFill"
      ></image>

      <!-- 自定义导航栏 -->
      <view class="custom-nav" :style="{ height: sysInfo.navBarHeight + 'px' }">
        <view class="nav-left">
          <uni-icons type="left" size="24" color="#333"></uni-icons>
          <text class="nav-title">商圈</text>
        </view>
        <view class="nav-location">
          <image
            class="shop-avatar"
            src="/static/icon/shop-icon.png"
            mode="aspectFill"
          ></image>

          <view class="user-info">
            <text class="user-name">小胖</text>
            <text class="user-desc">消费领水机</text>
          </view>
        </view>
        <view class="location-btn">
          <uni-icons type="location" size="16" color="#333"></uni-icons>
          <text>北京市</text>
          <uni-icons type="right" size="14" color="#666"></uni-icons>
        </view>
      </view>

      <!-- 使用搜索栏组件 -->
			<search-bar :read-only="true" @search="goPage" @click="goPage" />
    </view>

    <!-- 使用分类导航组件 -->
    <category-nav
      :categories="categoryList"
      :current="currentCategoryIndex"
      @change="onCategoryClick"
    />

    <!-- 吸顶固定区域 -->
    <view class="fixed-header" v-if="isHeaderFixed">
      <view class="fixed-content">
        <!-- 吸顶搜索栏 -->
        <view class="header-row">
          <uni-icons
            type="left"
            size="24"
            color="#333"
            class="back-icon"
          ></uni-icons>
          <search-bar :mini="true" :disabled="true" :showOrder="false" />
          <view class="order-icon-small">
            <image
              class="icon-img"
              src="/static/icon/order.png"
              mode="aspectFill"
            ></image>
            <text>订单</text>
          </view>
        </view>

        <!-- 吸顶简化Tab -->
        <scroll-view scroll-x class="simple-tabs" :show-scrollbar="false">
          <view
            class="tab-item"
            v-for="(item, index) in categoryList"
            :key="index"
            :class="{ active: currentCategoryIndex === index }"
            @click="onCategoryClick(index)"
          >
            {{ item.name }}
            <view
              class="active-line"
              v-if="currentCategoryIndex === index"
            ></view>
          </view>
        </scroll-view>

        <!-- 吸顶筛选栏 -->
        <filter-bar
          :current="currentFilter"
          :categoryName="selectedCategoryName"
          :nearbyName="selectedNearbyName"
          :sortName="selectedSortName"
          :isFixed="true"
          @filter-click="toggleFilter"
        />

      </view>
      <filter-dropdown
        :visible="!!currentFilter"
        :type="currentFilter"
        :data="currentFilterData"
        :leftIndex="currentLeftIndex"
        :selectedValue="currentSelectedValue"
        @left-click="handleLeftClick"
        @select="handleSelect"
        @close="closeFilter"
      />
      <!-- 遮罩层 -->
      <view
        class="mask"
        v-if="currentFilter"
        @click="closeFilter"
        @touchmove.stop.prevent
      ></view>
    </view>
    <!-- 使用筛选栏组件 -->
    <view v-else class="filter-bar-wrapper" id="filter-bar">
      <filter-bar
        :current="currentFilter"
        :categoryName="selectedCategoryName"
        :nearbyName="selectedNearbyName"
        :sortName="selectedSortName"
        :isFixed="isHeaderFixed"
        @filter-click="toggleFilter"
      />
      <filter-dropdown
        :visible="!!currentFilter"
        :type="currentFilter"
        :data="currentFilterData"
        :leftIndex="currentLeftIndex"
        :selectedValue="currentSelectedValue"
        @left-click="handleLeftClick"
        @select="handleSelect"
        @close="closeFilter"
      />
    </view>

    <!-- 列表区域 -->
    <view class="shop-list" :style="{ paddingTop: '0' }">
      <block v-for="(item, index) in shopList" :key="index">
        <shop-item :item="item" @click="goDetail(item)"></shop-item>
      </block>
      <uni-load-more :status="loadingStatus"></uni-load-more>
    </view>
  </view>
</template>

<script>
import shopItem from "./components/shop-item.vue";
import searchBar from "./components/search-bar.vue";
import categoryNav from "./components/category-nav.vue";
import filterBar from "./components/filter-bar.vue";
import filterDropdown from "./components/filter-dropdown.vue";

export default {
  components: {
    shopItem,
    searchBar,
    categoryNav,
    filterBar,
    filterDropdown,
  },
  data() {
    return {
      sysInfo: {
        statusBarHeight: 20,
        navBarHeight: 44,
        windowHeight: 0,
      },
      categoryList: [
        { name: "推荐", icon: "/static/icon/import.png" },
        { name: "美食", icon: "/static/icon/food.png" },
        { name: "休闲娱乐", icon: "/static/icon/play.png" },
        { name: "美人丽发", icon: "/static/icon/beauty.png" },
        { name: "按摩洗浴", icon: "/static/icon/bathing.png" },
      ],
      filterData: {
        category: [
          {
            name: "全部分类",
            children: [
              { name: "全部分类", id: 0 },
              { name: "火锅", id: 1 },
              { name: "烧烤烤肉", id: 2 },
              { name: "地方菜系", id: 3 },
              { name: "异域料理", id: 4 },
              { name: "自助餐", id: 5 },
              { name: "鱼肉海鲜", id: 6 },
              { name: "小吃快餐", id: 7 },
              { name: "饮品店", id: 8 },
              { name: "面包甜品", id: 9 },
              { name: "食品生鲜", id: 10 },
            ],
          },
        ],
        nearby: [
          {
            name: "我的附近",
            children: [
              { name: "附近", value: "nearby" },
              { name: "500m", value: "500" },
              { name: "1000m", value: "1000" },
              { name: "3000m", value: "3000" },
              { name: "5000m", value: "5000" },
              { name: "10km", value: "10000" },
            ],
          },
          {
            name: "行政区",
            children: [
              { name: "朝阳区", value: "chaoyang" },
              { name: "大兴区", value: "daxing" },
              { name: "通州区", value: "tongzhou" },
              { name: "丰台区", value: "fengtai" },
              { name: "海淀区", value: "haidian" },
              { name: "东城区", value: "dongcheng" },
              { name: "西城区", value: "xicheng" },
              { name: "房山区", value: "fangshan" },
              { name: "密云区", value: "miyun" },
              { name: "顺义区", value: "shunyi" },
            ],
          },
        ],
        sort: [
          { name: "综合排序", value: "default" },
          { name: "距离排序", value: "distance" },
          { name: "评价排序", value: "rating" },
          { name: "销量排序", value: "sales" },
        ],
      },
      isOpenFilter: false,
      currentFilter: "",
      currentLeftIndex: 0,
      selectedCategory: { name: "全部分类", id: 0 },
      selectedNearby: { name: "3000m", value: "3000" },
      sortValue: "default",
      currentCategoryIndex: 0,
      shopList: [],
      loadingStatus: "more",
      isHeaderFixed: false,
      filterTopThreshold: 0,
      fixedContentHeight: 0,
    };
  },
  computed: {
    listPaddingTop() {
      return this.fixedContentHeight;
    },
    selectedCategoryName() {
      return this.selectedCategory.name === "全部分类"
        ? "全部分类"
        : this.selectedCategory.name;
    },
    selectedNearbyName() {
      return this.selectedNearby.name;
    },
    selectedSortName() {
      const item = this.filterData.sort.find((i) => i.value === this.sortValue);
      return item ? (item.name === "综合排序" ? "排序" : item.name) : "排序";
    },
    currentFilterData() {
      if (this.currentFilter === "category") return this.filterData.category;
      if (this.currentFilter === "nearby") return this.filterData.nearby;
      if (this.currentFilter === "sort") return this.filterData.sort;
      return [];
    },
    currentSelectedValue() {
      if (this.currentFilter === "category") return this.selectedCategory;
      if (this.currentFilter === "nearby") return this.selectedNearby;
      if (this.currentFilter === "sort") return this.sortValue;
      return null;
    },
  },
  onLoad() {
    this.initSystemInfo();
    this.loadData();
  },
  onPageScroll(e) {
    if (this.filterTopThreshold > 0) {
      const shouldFixed = e.scrollTop > this.filterTopThreshold;
      if (this.isHeaderFixed !== shouldFixed && !this.currentFilter) {
        this.isHeaderFixed = shouldFixed;
      }
    }
  },
  methods: {
    goPage() {
      uni.navigateTo({
        url: "/pages/merchant-detail/merchant-search",
      });
    },
    initSystemInfo() {
      const info = uni.getSystemInfoSync();
      this.sysInfo.statusBarHeight = info.statusBarHeight || 20;
      this.sysInfo.windowHeight = info.windowHeight;

      const rpxRatio = info.windowWidth / 750;
      this.filterTopThreshold = 50 * rpxRatio;
      this.fixedContentHeight = this.sysInfo.statusBarHeight + 44 + 40 + 40;
    },
    toggleFilter(type) {
      console.log(this.currentFilter, "toggleFilter", type);

      if (this.currentFilter === type) {
        this.closeFilter();
      } else {
        this.currentFilter = type;
        if (type === "category") {
          this.currentLeftIndex = 0;
        } else if (type === "nearby") {
          this.currentLeftIndex = this.filterData.nearby.findIndex((group) =>
            group.children.some(
              (child) => child.value === this.selectedNearby.value
            )
          );
          if (this.currentLeftIndex === -1) this.currentLeftIndex = 0;
        }
      }
      if (this.currentFilter) {
        this.isOpenFilter = true;
      }
      // this.isOpenFilter = !this.isOpenFilter;
    },
    closeFilter() {
      this.currentFilter = "";
      const query = uni.createSelectorQuery().in(this);
      query
        .selectViewport()
        .scrollOffset((res) => {
          if (res.scrollTop < this.filterTopThreshold) {
            this.isHeaderFixed = false;
          }
        })
        .exec();
      this.isOpenFilter = false;
    },
    handleLeftClick(index) {
      this.currentLeftIndex = index;
    },
    handleSelect(item) {
      if (this.currentFilter === "category") {
        this.selectedCategory = item;
      } else if (this.currentFilter === "nearby") {
        this.selectedNearby = item;
      } else if (this.currentFilter === "sort") {
        this.sortValue = item.value;
      }
      this.isOpenFilter = false;

      this.refreshList();
      this.closeFilter();
    },
    refreshList() {
      this.shopList = [];
      this.loadingStatus = "more";
      this.loadData();
    },
    onCategoryClick(index) {
      this.currentCategoryIndex = index;
      this.refreshList();
    },
    loadData() {
      if (this.loadingStatus === "loading") return;
      this.loadingStatus = "loading";

      // 测试数据
      setTimeout(() => {
        const newItems = Array.from({ length: 5 }, (_, i) => ({
          id: this.shopList.length + i,
          name: `咱家小院铁锅炖 (亦庄店) ${this.shopList.length + i}`,
          rating: 3.3,
          tags: ["东北菜", "亦庄"],
          distance: "365m",
          isOpen: true,
          status: "营业中",
          promo: "消费1元兑付0.5水机兑换券",
          img: "https://via.placeholder.com/150",
          coupon: "消费1元兑0.5水机兑换券",
        }));
        this.shopList = [...this.shopList, ...newItems];
        this.loadingStatus = "more";
      }, 500);
    },
    goDetail(item) {
      uni.navigateTo({
        url: `/pages/merchant-detail/index?id=${item.id}`,
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-section {
  position: relative;
  z-index: 20;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 350rpx;
  z-index: 0;
}

.custom-nav {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  z-index: 1;

  .nav-left {
    display: flex;
    align-items: center;

    .nav-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
      margin-left: 10rpx;
    }
  }

  .nav-location {
    display: flex;
    align-items: center;
    flex: 1;

    .shop-avatar {
      width: 68rpx;
      height: 98rpx;
      border-radius: 50%;
      // margin: 0 20rpx;
      margin-left: 18rpx;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      margin-right: 20rpx;

      .user-name {
        font-size: 20rpx;
        color: #3d3d3d;
      }

      .user-desc {
        font-size: 20rpx;
        color: #3d3d3d;
      }
    }
  }

  .location-btn {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #333;

    text {
      margin: 0 4rpx;
    }
  }
}

.filter-bar-wrapper {
  padding: 20rpx 0;
}

.shop-list {
  padding: 0 20rpx;
  box-sizing: border-box;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  background-color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .fixed-content {
    background: #fff;
    position: relative;
    z-index: 1001;
  }

  .header-row {
    display: flex;
    align-items: center;
    padding: 10rpx 20rpx;
    .back-icon {
      margin-right: 20rpx;
    }

    .order-icon-small {
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20rpx;
    }
  }

  .simple-tabs {
    white-space: nowrap;
    height: 80rpx;
    border-bottom: 1px solid #f0f0f0;

    .tab-item {
      display: inline-block;
      padding: 0 28rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      color: #666;
      position: relative;

      &.active {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .active-line {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40rpx;
        height: 6rpx;
        background: #ffc300;
        border-radius: 3rpx;
      }
    }
  }
}
.icon-img {
  width: 34rpx;
  height: 34rpx;
}
.fixed-white {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 50vh;
  // background: red;
  background: #fff;
  z-index: 2;
}
</style>
