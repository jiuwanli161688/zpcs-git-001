<template>
  <view class="service-grid">
    <view 
      class="service-item" 
      v-for="(item, index) in list" 
      :key="index"
      @click="onItemClick(item)"
    >
      <view class="service-item__icon" :style="{ backgroundColor: item.bgColor }">
        <image class="service-item__img" :src="item.icon" mode="aspectFit"></image>
      </view>
      <text class="service-item__name">{{ item.name }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ServiceGrid',
  props: {
    // 服务列表
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onItemClick(item) {
      this.$emit('item-click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
$text-placeholder: #999;

.service-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12rpx;
  }
  
  &__img {
    width: 48rpx;
    height: 48rpx;
  }
  
  &__name {
    font-size: 22rpx;
    color: $text-placeholder;
  }
}
</style>
