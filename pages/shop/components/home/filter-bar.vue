<template>
  <view class="filter-bar">
    <view 
      class="filter-bar__item" 
      v-for="(item, index) in list" 
      :key="index"
      @click="onFilterClick(item)"
    >
      <text :class="['filter-bar__text', { 'filter-bar__text--active': item.active }]">
        {{ item.label }}
      </text>
      <uni-icons 
        type="bottom" 
        size="12" 
        :color="item.active ? '#ffc107' : '#666'"
      ></uni-icons>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    // 筛选项列表
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onFilterClick(item) {
      this.$emit('filter-change', item)
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #ffc107;
$text-secondary: #666;
$bg-page: #f8f8f8;

.filter-bar {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  background-color: $bg-page;
  position: sticky;
  top: calc(var(--status-bar-height) + 160rpx);
  z-index: 50;
  
  &__item {
    display: flex;
    align-items: center;
  }
  
  &__text {
    font-size: 28rpx;
    color: $text-secondary;
    margin-right: 6rpx;
    
    &--active {
      color: $primary-color;
      font-weight: 500;
    }
  }
}
</style>
