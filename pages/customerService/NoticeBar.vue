<template>
  <view class="vertical-carousel" @mouseenter="pause" @mouseleave="resume" :style="{ height: containerHeight }">
    <view class="carousel-track" :style="trackStyle" @transitionend="handleTransitionEnd">
      <view class="carousel-item" v-for="(item, index) in displayItems" :key="index">
        <view class="carousel-item-title" @click="clickCarouselItemEve(item)">{{ item.title }}</view>
      </view>
    </view>

    <view class="control-buttons">
      <view @click="goPrev" class="control-btn">▲</view>
      <view @click="goNext" class="control-btn">▼</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'noticeColumn',
  data() {
    return {
      carouselInfoModalState: false, // 公告弹窗状态
      carouselInfoObj: {}, // 选中公告详情
      currentGroup: 0,
      totalGroups: 0,
      transitionEnabled: true,
      timer: null
    }
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    interval: {
      type: Number,
      default: 3000
    },
    itemHeight: {
      type: Number,
      default: 60 // 单个项目高度
    }
  },
  computed: {
    // 容器总高度（显示3条）
    containerHeight() {
      return `${this.itemHeight * 1}rpx`
    },
    // 拼接数据实现无缝滚动
    displayItems() {
      return [...this.items]
    },
    // 轨道样式
    trackStyle() {
      if (this.items.length > 1) {
        return {
          transform: `translateY(-${this.currentGroup * this.itemHeight * 1}rpx)`,
          transition: this.transitionEnabled ? 'transform 0.6s ease' : 'none'
        }
      }
    }
  },
  watch: {
    items: {
      immediate: true,
      handler() {
        // this.totalGroups = Math.ceil(this.items.length ) - 1
		this.totalGroups = Math.ceil(this.items.length )
        // this.totalGroups = Math.ceil(this.items.length / 3) - 1
      }
    }
  },
  mounted() {
    this.startAutoPlay()
  },
  beforeDestroy() {
    this.pause()
  },
  methods: {
    // 点击轮播内容查看详情
    clickCarouselItemEve(row) {
      // this.carouselInfoModalState = true
      // this.carouselInfoObj = row
      // this.$emit("choiceCarouselInfo",this.carouselInfoObj)

	  uni.navigateTo({
	  	url: `/pages/customerService/customerInfoDetail?id=${row.id}`
	  })
    },
    // 自动播放控制
    startAutoPlay() {
      this.timer = setInterval(() => {
        this.goNext()
      }, this.interval)
    },
    pause() {
      clearInterval(this.timer)
    },
    resume() {
      this.timer = setInterval(() => {
        this.goNext()
      }, this.interval)
    },

    // 切换控制
    goNext() {
      this.transitionEnabled = true
      if (this.currentGroup > Math.ceil(this.items.length )) {
        this.currentGroup = 0
        this.totalGroups = 0
      } else {
        this.currentGroup += 1
      }
    },
    goPrev() {
      this.transitionEnabled = true
      this.currentGroup = this.currentGroup > 0 ? this.currentGroup - 1 : this.totalGroups - 1
    },

    // 处理滚动结束事件
    handleTransitionEnd() {
      if (this.currentGroup >= this.totalGroups) {
        this.transitionEnabled = false
        this.currentGroup = 0
        this.$nextTick(() => {
          this.transitionEnabled = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  /* border: 1rpx solid #eee; */
  border-radius: 4rpx;
}

.carousel-track {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.carousel-item {
  width: 100%;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 550;
  /* border-bottom: 1rpx solid #f0f0f0; */
}
.carousel-item-title:hover {
  color: #009dff;
}
.control-buttons {
  position: absolute;
  right: 10rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
}

.control-btn {
  width: 20rpx;
  height: 20rpx;
  border: 1rpx solid transparent;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12rpx;
  transition: all 0.3s;
  color: #BE7800;
}

.control-btn:hover {
  background: #ffead5;
  // box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}
.carousel-info-box {
  width: 100%;
  .carousel-info-item {
    width: 100%;
    display: flex;
    padding: 10rpx 0;
    font-size: 14rpx;
    .info-item-title {
      width: 100rpx;
      text-align: right;
      font-weight: 550;
    }
    .info-item-cont {
      width: calc(100% - 110rpx);
    }
  }
}
</style>
