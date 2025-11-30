<template>
    <view class="custom-video-player">
        <!-- 视频播放器 -->
        <DomVideoPlayerVue
            ref="domVideoPlayer"
            :src="src"
            :autoplay="autoplay"
            :loop="loop"
            :muted="muted"
            :controls="false"
            :objectFit="objectFit"
            :poster="poster"
            @play="onPlay"
            @pause="onPause"
            @timeupdate="onTimeUpdate"
            @durationchange="onDurationChange"
            @loadedmetadata="onLoadedMetadata"
            @fullscreenchange="onFullscreenChange"
            @error="onError"
            @ended="onEnded" />

        <!-- 自定义控制栏 -->
        <VideoControls
            :isPlaying="isPlaying"
            :currentTime="currentTime"
            :duration="duration"
            :bufferProgress="bufferProgress"
            :showControls="showControls"
            :isMuted="isMuted"
            @toggle-play="togglePlay"
            @toggle-fullscreen="toggleFullscreen"
            @toggle-mute="toggleMute"
            @seek="seekTo"
            @seeking="onSeeking"
            @dragging-start="onDraggingStart"
            @dragging-end="onDraggingEnd" />


        <!-- 点击区域，用于显示/隐藏控制栏 -->
        <view class="video-overlay" @click="toggleControls"></view>

        <!-- 加载状态 -->
        <view v-if="isLoading" class="loading-overlay">
            <view class="loading-spinner"></view>
        </view>
    </view>
</template>

<script>
import DomVideoPlayerVue from './DomVideoPlayer.vue'
import VideoControls from './VideoControls.vue'

export default {
    name: 'CustomVideoPlayer',
    components: {
        DomVideoPlayerVue,
        VideoControls
    },
    props: {
        src: {
            type: String,
            default: ''
        },
        autoplay: {
            type: Boolean,
            default: false
        },
        loop: {
            type: Boolean,
            default: false
        },
        muted: {
            type: Boolean,
            default: true
        },
        objectFit: {
            type: String,
            default: 'contain'
        },
        poster: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            bufferProgress: 0,
            showControls: true,
            isLoading: true,
            controlsTimer: null,
            autoHideDelay: 3000, // 3秒后自动隐藏控制栏
            isMuted: true, // 静音状态
            isDraggingProgress: false // 是否正在拖动进度条
        }
    },
    mounted() {
        this.startControlsTimer()
    },
    beforeDestroy() {
        this.clearControlsTimer()
    },
    methods: {
        // 播放事件
        onPlay() {
            this.isPlaying = true
            this.isLoading = false
            this.$emit('play')
        },

        // 暂停事件
        onPause() {
            this.isPlaying = false
            this.$emit('pause')
        },

        // 时间更新事件
        onTimeUpdate(time) {
            this.currentTime = time
            this.$emit('timeupdate', time)
        },

        // 时长变化事件
        onDurationChange(duration) {
            this.duration = duration
            this.$emit('durationchange', duration)
        },

        // 元数据加载完成
        onLoadedMetadata() {
            this.isLoading = false
            this.$emit('loadedmetadata')
        },

        // 全屏状态变化
        onFullscreenChange(isFullscreen) {
            console.log('CustomVideoPlayer: 全屏状态变化:', isFullscreen)
            this.$emit('fullscreenchange', isFullscreen)
        },

        // 错误事件
        onError(error) {
            this.isLoading = false
            this.$emit('error', error)
        },

        // 播放结束
        onEnded() {
            this.isPlaying = false
            this.$emit('ended')
        },

        // 切换播放/暂停
        togglePlay() {
            if (this.isPlaying) {
                this.$refs.domVideoPlayer.pause()
            } else {
                this.$refs.domVideoPlayer.play()
            }
        },

        // 切换全屏
        toggleFullscreen() {
            // 使用DomVideoPlayer的原生全屏功能
            if (this.$refs.domVideoPlayer) {
                this.$refs.domVideoPlayer.fullScreen()
            }
        },

        // 跳转到指定时间
        seekTo(time) {
            this.$refs.domVideoPlayer.toSeek(time)
        },

        // 拖拽进度条时
        onSeeking(time) {
            this.currentTime = time
            this.$emit('seeking', time)
        },

        // 开始拖动进度条
        onDraggingStart() {
            this.isDraggingProgress = true
            // 清除自动隐藏计时器，确保控制栏在拖动时保持显示
            this.clearControlsTimer()
            // 确保控制栏显示
            this.showControls = true
        },

        // 结束拖动进度条
        onDraggingEnd() {
            this.isDraggingProgress = false
            // 重新启动自动隐藏计时器
            this.startControlsTimer()
        },

        // 切换控制栏显示/隐藏
        toggleControls() {
            this.showControls = !this.showControls
            if (this.showControls) {
                this.startControlsTimer()
            } else {
                this.clearControlsTimer()
            }
        },

        // 开始控制栏自动隐藏计时器
        startControlsTimer() {
            this.clearControlsTimer()
            // 如果正在拖动进度条，不启动自动隐藏计时器
            if (this.isPlaying && !this.isDraggingProgress) {
                this.controlsTimer = setTimeout(() => {
                    this.showControls = false
                }, this.autoHideDelay)
            }
        },

        // 清除控制栏自动隐藏计时器
        clearControlsTimer() {
            if (this.controlsTimer) {
                clearTimeout(this.controlsTimer)
                this.controlsTimer = null
            }
        },

        // 公共方法：播放
        play() {
            this.$refs.domVideoPlayer.play()
        },

        // 公共方法：暂停
        pause() {
            this.$refs.domVideoPlayer.pause()
        },

        // 公共方法：跳转到指定时间
        seek(time) {
            this.$refs.domVideoPlayer.toSeek(time)
        },

        // 切换静音
        toggleMute() {
            this.isMuted = !this.isMuted
            this.$refs.domVideoPlayer.setMuted(this.isMuted)
            this.$emit('mutechange', this.isMuted)
        },

    },

    watch: {
        // 监听播放状态变化，自动隐藏控制栏
        isPlaying(newVal) {
            if (newVal) {
                this.startControlsTimer()
            } else {
                this.clearControlsTimer()
            }
        },
        // 监听静音状态变化
        muted(newVal) {
            this.isMuted = newVal
        }
    }
}
</script>

<style scoped>
.custom-video-player {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
}

.custom-video-player.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #000;
}

.custom-video-player.pseudo-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #000;
}

/* 全屏时的样式优化 */
.custom-video-player:fullscreen {
    background: #000;
    width: 100vw;
    height: 100vh;
}

.custom-video-player:-webkit-full-screen {
    background: #000;
    width: 100vw;
    height: 100vh;
}

.custom-video-player:-moz-full-screen {
    background: #000;
    width: 100vw;
    height: 100vh;
}

.custom-video-player:-ms-fullscreen {
    background: #000;
    width: 100vw;
    height: 100vh;
}


.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    cursor: pointer;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 15;
}

.loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    border-top: 4rpx solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
