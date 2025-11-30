<template>
  <view class="text-input">
    <textarea
      class="textarea"
      :value="currentValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :placeholder-style="placeholderStyle"
      @input="handleInput"
      @blur="handleBlur"
    />
    <view class="char-count">(
      <text class="current">{{ currentLength }}</text>
      <text class="separator">/</text>
      <text class="max">{{ maxlength }}</text>)
    </view>
  </view>
</template>

<script>
export default {
  name: 'TextInput',
  
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    maxlength: {
      type: Number,
      default: 100
    }
  },
  
  data() {
    return {
      currentValue: this.value,
      placeholderStyle: 'color: #ccc; font-size: 28rpx;'
    }
  },
  
  computed: {
    currentLength() {
      return this.currentValue.length
    }
  },
  
  watch: {
    value(val) {
      this.currentValue = val
    }
  },
  
  methods: {
    handleInput(e) {
      this.currentValue = e.detail.value
      this.$emit('input', e.detail.value)
      this.$emit('change', e.detail.value)
    },
    
    handleBlur(e) {
      this.$emit('blur', e.detail.value)
    }
  }
}
</script>

<style scoped>
.text-input {
  background-color: #fff;
  padding: 20rpx 20rpx 0 20rpx;
  position: relative;
  border-radius: 12rpx 12rpx 0 0;
}

.textarea {
  width: 100%;
  height: 240rpx;
  font-size: 24rpx;
  color: #333;
  line-height: 1.6;
}

.char-count {
  position: absolute;
  right: 30rpx;
  bottom: 30rpx;
  font-size: 24rpx;
  color: #999;
}

.current {
  color: #999;
}

.separator {
  margin: 0 4rpx;
}
</style>
