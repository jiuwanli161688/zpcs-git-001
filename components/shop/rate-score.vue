<template>
  <view class="rate-container">
    <!-- 星星区域 -->
    <view class="stars-box">
      <view 
        class="star-item" 
        v-for="(item, index) in 5" 
        :key="index"
        :style="getStarStyle(index + 1)"
      >
        <!-- 使用 uni-icons，颜色设为白色，覆盖在背景上 -->
        <!-- 注意：如果项目未引入 uni-ui，需先去插件市场导入或使用简单的 SVG/image 替换 -->
        <uni-icons type="star-filled" size="13" color="#ffffff"></uni-icons>
      </view>
    </view>
    
    <!-- 分数文字 -->
    <text v-if="showNum" class="score-text">{{ score }}</text>
  </view>
</template>

<script>
export default {
  name: 'RateScore',
  props: {
    // 评分数值，如 3.8
    score: {
      type: [Number, String],
      default: 0
    },
    // 激活颜色（橙红色）
    activeColor: {
      type: String,
      default: '#FF5533' 
    },
    // 未激活颜色（灰色）
    voidColor: {
      type: String,
      default: '#CCCCCC'
    },
    // 是否展示评分
    showNum: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 计算每个星星的背景样式
    getStarStyle(index) {
      const score = Number(this.score);
      let style = {
        background: this.voidColor // 默认灰色
      };

      // 1. 满星情况：当前星星序号 <= 分数 (例如 index 3 <= 3.8)
      if (index <= score) {
        style.background = this.activeColor;
      } 
      // 2. 半星/小数情况：当前星星处于分数区间 (例如 index 4, 分数 3.8,  3 < 3.8 < 4)
      else if (index > score && index - 1 < score) {
        // 计算小数部分百分比，例如 3.8 -> 0.8 -> 80%
        const decimal = (score % 1) * 100;
        // 使用 CSS 线性渐变实现精确的百分比填充
        style.background = `linear-gradient(to right, ${this.activeColor} 0%, ${this.activeColor} ${decimal}%, ${this.voidColor} ${decimal}%, ${this.voidColor} 100%)`;
      }
      
      return style;
    }
  }
}
</script>

<style lang="scss" scoped>
.rate-container {
  display: flex;
  align-items: center;
}

.stars-box {
  display: flex;
  align-items: center;
}

.star-item {
  width: 30rpx;
  height: 30rpx;
  border-radius: 4rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4rpx;
  overflow: hidden;
  
  padding-bottom: 2rpx; 
  box-sizing: border-box;
}

.score-text {
  font-size: 26rpx;
  font-weight: bold;
  color: #FF5533;
  margin-left: 12rpx;
}
</style>