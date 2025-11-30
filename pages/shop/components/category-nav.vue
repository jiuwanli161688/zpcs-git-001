<template>
  <view class="category-nav">
    <view
      class="nav-item"
      v-for="(item, index) in categories"
      :key="index"
      @click="handleClick(index)"
    >
      <view
        class="icon-wrap"
        :class="['icon-' + index, current === index ? 'nav-icon-active' : '']"
      >
        <image class="icon-img" :src="item.icon" mode="aspectFill"></image>
      </view>
      <text class="nav-text" :class="{ active: current === index }">{{
        item.name
      }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "CategoryNav",
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    current: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleClick(index) {
      this.$emit("change", index);
    },
  },
};
</script>

<style lang="scss" scoped>
.category-nav {
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  padding: 0;
  z-index: 20;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon-wrap {
      width: 110rpx;
      height: 110rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
    }

    .icon-img {
      width: 76rpx;
      height: 76rpx;
      border-radius: 50%;
    }
    .nav-text {
      font-size: 26rpx;
      color: #666;

      &.active {
        font-weight: bold;
        color: #333;
      }
    }
  }
  .nav-icon-def {
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      rgba(255, 255, 255, 0) 100%
    );
  }

  .nav-icon-active {
    background: url(./../../../static/icon/active_cicle.png) no-repeat;
    background-size: 100% 100%;
    background-position: center center;
  }
}
</style>
