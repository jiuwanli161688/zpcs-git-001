<template>
  <view class="filter-bar" :class="{ fixed: isFixed }">
    <view
      class="filter-item"
      :class="{
        active: current === 'category',
        'filter-item-large': categoryName.length > 2,
        'filter-item-small': categoryName.length < 3,
      }"
      @click="handleClick('category')"
    >
      <text>{{ categoryName }}</text>
      <image
        class="arrow"
        :src="`/static/icon/${current === 'category' ? 'up' : 'down'}.png`"
        mode="aspectFill"
      ></image>
    </view>
    <view
      class="filter-item"
      :class="{
        active: current === 'nearby',
        'filter-item-large': nearbyName.length > 2,
        'filter-item-small': nearbyName.length < 3,
      }"
      @click="handleClick('nearby')"
    >
      <text>{{ nearbyName }}</text>
      <image
        class="arrow"
        :src="`/static/icon/${current === 'nearby' ? 'up' : 'down'}.png`"
        mode="aspectFill"
      ></image>
    </view>
    <view
      class="filter-item"
      :class="{
        active: current === 'sort',
        'filter-item-large': sortName.length > 2,
        'filter-item-small': sortName.length < 3,
      }"
      @click="handleClick('sort')"
    >
      <text>{{ sortName }}</text>
      <image
        class="arrow"
        :src="`/static/icon/${current === 'sort' ? 'up' : 'down'}.png`"
        mode="aspectFill"
      ></image>
    </view>
    <!-- <view class="filter-tag">智能水机兑换券</view> -->
    <view class="filter-tag">
      <image
        class="coupon-icon"
        src="/static/icon/coupon.png"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<script>
export default {
  name: "FilterBar",
  props: {
    current: {
      type: String,
      default: "",
    },
    categoryName: {
      type: String,
      default: "全部分类",
    },
    nearbyName: {
      type: String,
      default: "附近",
    },
    sortName: {
      type: String,
      default: "排序",
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(type) {
      this.$emit("filter-click", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 20rpx;
  z-index: 20;

  &.fixed {
    // padding: 0 20rpx;
    padding: 20rpx;
  }
  .filter-item-large {
    width: 160rpx;
  }
  .filter-item-small {
    width: 120rpx;
  }
  .filter-item {
    display: flex;
		justify-content: center;
    align-items: center;
    margin-right: 16rpx;
    height: 48rpx;
    line-height: 48rpx;
    background: #fff;
    border-radius: 24rpx;
    font-size: 24rpx;
		text-align: center;
    color: #666;

    text {
      margin-right: 8rpx;
    }

    .arrow {
      width: 16rpx;
      height: 10rpx;
    }

    &.active {
      background: #f7c54d;
      color: #fff;
    }
  }

  .filter-tag {
    // font-variation-settings: "opsz" auto;
    // font-feature-settings: "kern" on;
    // background: linear-gradient(90deg, #ff7b00 5%, #ff0101 99%);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    // background-clip: text;
    // text-fill-color: transparent;

    // font-family: DingTalk JinBuTi;
    // font-size: 24rpx;
    // font-weight: normal;
    // line-height: normal;
    // letter-spacing: 0em;
		padding: 4rpx 18rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
    .coupon-icon {
      width: 164rpx;
			height: 23rpx;
    }
  }
}
</style>
