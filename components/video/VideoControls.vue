<template>
    <view class="video-controls" :class="{ 'controls-hidden': !showControls }">
        <!-- 单行控制栏 -->
        <view class="controls-row">
            <!-- 播放/暂停按钮 -->
            <view class="control-btn play-btn" @tap="togglePlay">
                <u-icon :name="isPlaying ? 'pause' : 'play-right-fill'" color="#fff" size="36"></u-icon>
            </view>

            <!-- 当前时间 -->
            <view class="time-display">
                <text class="time-text">{{ formatTime(currentTime) }}</text>
            </view>

            <!-- 进度条容器 -->
            <view class="progress-container" @touchstart="handleProgressTouch" @touchmove="handleProgressMove" @touchend="handleProgressEnd">
                <view class="progress-bar">
                    <view class="progress-buffer" :style="{ width: bufferProgress + '%' }"></view>
                    <view class="progress-played" :style="{ width: playProgress + '%' }"></view>
                    <view class="progress-thumb" :style="{ left: playProgress + '%' }" :class="{ 'thumb-active': isDragging }"></view>
                </view>
            </view>

            <!-- 总时长 -->
            <view class="time-display">
                <text class="time-text">{{ formatTime(duration) }}</text>
            </view>

            <!-- 静音按钮 -->
            <view class="control-btn" @tap="toggleMute">
                <u-icon :name="isMuted ? 'volume-off' : 'volume'" color="#fff" size="32"></u-icon>
            </view>

            <!-- 全屏按钮 -->
            <view class="control-btn" @tap="toggleFullscreen">
                <image :src="iconFullScreen" class="fullscreen-icon" mode="aspectFit"></image>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'VideoControls',
    props: {
        // 是否正在播放
        isPlaying: {
            type: Boolean,
            default: false
        },
        // 当前播放时间（秒）
        currentTime: {
            type: Number,
            default: 0
        },
        // 视频总时长（秒）
        duration: {
            type: Number,
            default: 0
        },
        // 缓冲进度（百分比）
        bufferProgress: {
            type: Number,
            default: 0
        },
        // 是否显示控制栏
        showControls: {
            type: Boolean,
            default: true
        },
        // 是否静音
        isMuted: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isDragging: false,
            dragStartX: 0,
            dragStartProgress: 0,
            progressBarWidth: 0,
            progressBarLeft: 0,
            iconFullScreen: `${this.iconCommon}/static/region/full-screen.png`
        }
    },
    computed: {
        // 播放进度百分比
        playProgress() {
            if (this.duration <= 0) return 0
            return (this.currentTime / this.duration) * 100
        }
    },
    beforeDestroy() {
        // 清理事件监听器
        document.removeEventListener('touchmove', this.handleProgressMove)
        document.removeEventListener('touchend', this.handleProgressEnd)
    },
    methods: {
        // 切换播放/暂停
        togglePlay() {
            this.$emit('toggle-play')
        },

        // 切换全屏
        toggleFullscreen() {
            // 直接触发事件给父组件，让父组件决定使用哪种全屏模式
            this.$emit('toggle-fullscreen')
        },

        // 切换静音
        toggleMute() {
            this.$emit('toggle-mute')
        },

        // 格式化时间显示
        formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '00:00'

            const hours = Math.floor(seconds / 3600)
            const minutes = Math.floor((seconds % 3600) / 60)
            const secs = Math.floor(seconds % 60)

            if (hours > 0) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            } else {
                return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            }
        },

        // 处理进度条触摸开始
        handleProgressTouch(e) {
            e.preventDefault()
            const touch = e.touches[0]
            this.isDragging = true
            this.dragStartX = touch.clientX

            // 通知父组件开始拖动，防止控制栏隐藏
            this.$emit('dragging-start')

            // 获取进度条宽度和位置
            const query = uni.createSelectorQuery().in(this)
            query
                .select('.progress-container')
                .boundingClientRect((rect) => {
                    if (rect) {
                        this.progressBarWidth = rect.width
                        this.progressBarLeft = rect.left
                        const touchX = touch.clientX - rect.left
                        const progress = Math.max(0, Math.min(100, (touchX / rect.width) * 100))
                        const newTime = (progress / 100) * this.duration
                        this.$emit('seek', newTime)

                        // 添加移动和结束事件监听
                        document.addEventListener('touchmove', this.handleProgressMove, { passive: false })
                        document.addEventListener('touchend', this.handleProgressEnd)
                    }
                })
                .exec()
        },

        // 处理进度条拖动
        handleProgressMove(e) {
            if (!this.isDragging) return
            e.preventDefault()

            const touch = e.touches[0]

            // 直接使用缓存的位置信息，避免重复查询DOM
            if (this.progressBarWidth > 0 && this.progressBarLeft !== undefined) {
                const touchX = touch.clientX - this.progressBarLeft
                const progress = Math.max(0, Math.min(100, (touchX / this.progressBarWidth) * 100))
                const newTime = (progress / 100) * this.duration
                this.$emit('seek', newTime)
            }
        },

        // 处理进度条拖动结束
        handleProgressEnd(e) {
            if (!this.isDragging) return

            this.isDragging = false
            this.dragStartX = 0
            this.progressBarWidth = 0
            this.progressBarLeft = 0

            // 通知父组件拖动结束，可以恢复控制栏自动隐藏
            this.$emit('dragging-end')

            // 移除事件监听
            document.removeEventListener('touchmove', this.handleProgressMove)
            document.removeEventListener('touchend', this.handleProgressEnd)
        }
    }
}
</script>

<style scoped>
.video-controls {
    position: absolute;
    bottom: 20rpx;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: opacity 0.3s ease;
    z-index: 10;
}

.controls-hidden {
    opacity: 0;
    pointer-events: none;
}

/* 单行控制栏 */
.controls-row {
    display: flex;
    align-items: center;
    padding: 15rpx 20rpx;
    height: 70rpx;
}

/* 进度条容器 */
.progress-container {
    flex: 1;
    margin: 0 20rpx;
    position: relative;
    padding: 15rpx 0; /* 增大触摸区域 */
    cursor: pointer;
    /* 防止意外触摸行为 */
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x;
}

.progress-bar {
    position: relative;
    height: 4rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2rpx;
    cursor: pointer;
    /* 确保进度条也能响应触摸 */
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x;
}

.progress-buffer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3rpx;
    transition: width 0.1s ease;
}

.progress-played {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #fff;
    border-radius: 2rpx;
    transition: width 0.1s ease;
}

.progress-thumb {
    position: absolute;
    top: 50%;
    width: 24rpx;
    height: 24rpx;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
}

/* 增大滑块触摸区域 */
.progress-thumb::after {
    content: '';
    position: absolute;
    top: -15rpx;
    left: -15rpx;
    right: -15rpx;
    bottom: -15rpx;
    border-radius: 50%;
}

.progress-thumb.thumb-active {
    width: 28rpx;
    height: 28rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);
    transform: translate(-50%, -50%) scale(1.1);
}

/* 控制按钮样式 */
.play-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    cursor: pointer;
}

.control-btn {
    width: 50rpx;
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;
    cursor: pointer;
}

/* 时间显示 */
.time-display {
    color: #fff;
    font-size: 24rpx;
    min-width: 80rpx;
    text-align: center;
}

.time-text {
    font-family: 'Courier New', monospace;
    font-weight: 400;
}

/* 全屏图标样式 */
.fullscreen-icon {
    width: 32rpx;
    height: 32rpx;
}

/* 使用uview图标，无需自定义图标样式 */
</style>
