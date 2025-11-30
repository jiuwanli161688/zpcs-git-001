<template>
	<view class="content">
		<!-- 无缓存meta标签 -->
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
		<meta http-equiv="Pragma" content="no-cache">
		<meta http-equiv="Expires" content="0">

		<!-- 微信浏览器提示界面 -->
		<view v-if="isWechatBrowser" class="wechat-tip">
			<view class="tip-header">
				<view class="tip-icon">📱</view>
				<view class="tip-title">请在浏览器中打开</view>
			</view>
			<view class="tip-content">
				检测到您正在使用微信浏览器访问，为了更好的体验，请点击右上角菜单，选择"在浏览器中打开"
			</view>
			<view class="tip-steps">
				<view class="step">
					<view class="step-number">1</view>
					<view class="step-text">点击右上角"..."</view>
				</view>
				<view class="step">
					<view class="step-number">2</view>
					<view class="step-text">选择"在浏览器中打开"</view>
				</view>
				<view class="step">
					<view class="step-number">3</view>
					<view class="step-text">使用手机自带浏览器访问</view>
				</view>
			</view>
			<view class="tip-footer">
				<view class="browser-icon">🌐</view>
				<view class="footer-text">获得更好的下载体验</view>
			</view>
		</view>

		<!-- 正常下载界面 -->
		<view v-else class="download-container">
			<view class="download-header">
				<view class="app-icon">📱</view>
				<view class="app-title">中品维度商城</view>
				<view class="app-subtitle">智能购物新体验</view>
			</view>

			<view class="download-content">
				<!-- 设备已识别的情况 -->
				<view v-if="platform !== 'NO-APP'">
					<view class="platform-info">
						<view class="platform-icon">{{ platform === '苹果' ? '🍎' : '🤖' }}</view>
						<view class="platform-text">{{ platform }}设备</view>
					</view>

					<view class="download-message">
						感谢您下载中品维度商城，我们识别到您正在使用{{platform}}设备访问我们
					</view>

					<view class="download-tips">
						<span v-if="platform === '安卓'">我们计划5秒内为您自动启动安装包下载，请稍候。</span>
						<span v-if="platform === '苹果'">我们计划5秒内为您自动前往App Store界面，请稍候。</span>
					</view>

					<view class="loading-animation">
						<view class="loading-dots">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
						<view class="loading-text">正在准备下载...</view>
					</view>

					<!-- 手动跳转按钮 -->
					<view class="manual-download">
						<view class="manual-tip">如果自动跳转失败，请点击下方按钮</view>
						<view class="manual-btn" @click="manualDownload">
							<view class="manual-btn-icon">{{ platform === '苹果' ? '🍎' : '🤖' }}</view>
							<view class="manual-btn-text">立即下载{{ platform }}版本</view>
						</view>
					</view>
				</view>

				<!-- 设备未识别的情况 -->
				<view v-else class="manual-select">
					<view class="select-title">请选择您的设备类型</view>
					<view class="select-subtitle">我们无法自动识别您的设备，请手动选择</view>

					<view class="button-group">
						<view class="download-btn android-btn" @click="downloadAndroid">
							<view class="btn-icon">🤖</view>
							<view class="btn-content">
								<view class="btn-title">安卓版本</view>
								<view class="btn-desc">Android 6.0+</view>
							</view>
							<view class="btn-arrow">→</view>
						</view>

						<view class="download-btn ios-btn" @click="downloadIOS">
							<view class="btn-icon">🍎</view>
							<view class="btn-content">
								<view class="btn-title">苹果版本</view>
								<view class="btn-desc">iOS 12.0+</view>
							</view>
							<view class="btn-arrow">→</view>
						</view>
					</view>

					<view class="select-tips">
						<view class="tip-item">💡 不确定设备类型？</view>
						<view class="tip-item">• 安卓设备：华为、小米、OPPO、vivo、三星等</view>
						<view class="tip-item">• 苹果设备：iPhone、iPad等</view>
					</view>
				</view>
			</view>

			<view class="download-footer">
				<view class="footer-note">若无法正常下载，请刷新页面重试</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			platform: 'NO-APP',
			isWechatBrowser: false,
		}
	},
	methods: {
		// 检测是否为微信浏览器
		checkWechatBrowser() {
			const ua = navigator.userAgent.toLowerCase();
			const isWechat = ua.indexOf('micromessenger') !== -1;
			this.isWechatBrowser = isWechat;
			return isWechat;
		},

		// 下载安卓版本
		downloadAndroid() {
			// 这里添加安卓下载逻辑
      window.location.href = 'https://alioss.zpwdsc.com/apk/zpwdsc.apk';
		},

		// 下载苹果版本
		downloadIOS() {
			// 这里添加苹果下载逻辑
      window.location.href = 'https://apps.apple.com/cn/app/%E4%B8%AD%E5%93%81%E7%BB%B4%E5%BA%A6%E5%95%86%E5%9F%8E%E5%B9%B3%E5%8F%B0/id6747891024';
		},

		// 设置无缓存
		setNoCache() {
			// 方法1: 设置meta标签
			const meta = document.createElement('meta');
			meta.httpEquiv = 'Cache-Control';
			meta.content = 'no-cache, no-store, must-revalidate';
			document.head.appendChild(meta);

			// 方法2: 设置Pragma
			const pragmaMeta = document.createElement('meta');
			pragmaMeta.httpEquiv = 'Pragma';
			pragmaMeta.content = 'no-cache';
			document.head.appendChild(pragmaMeta);

			// 方法3: 设置Expires
			const expiresMeta = document.createElement('meta');
			expiresMeta.httpEquiv = 'Expires';
			expiresMeta.content = '0';
			document.head.appendChild(expiresMeta);

			// 方法4: 在URL中添加时间戳参数（如果当前URL有参数）
			if (window.location.search) {
				const timestamp = new Date().getTime();
				const separator = window.location.search.includes('?') ? '&' : '?';
				const newUrl = window.location.href + separator + '_t=' + timestamp;
				window.history.replaceState({}, document.title, newUrl);
			}

			// 方法5: 监听页面可见性变化，确保页面重新加载
			document.addEventListener('visibilitychange', () => {
				if (!document.hidden) {
					// 页面变为可见时，强制刷新某些数据
					this.refreshPageData();
				}
			});
		},

		// 刷新页面数据
		refreshPageData() {
			// 重新检测设备类型
			const ua = navigator.userAgent.toLowerCase();
			if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('ipod') !== -1) {
				this.platform = '苹果';
			} else if (ua.indexOf('android') !== -1) {
				this.platform = '安卓';
			} else {
				this.platform = 'NO-APP';
			}
		},

		// 手动下载
		manualDownload() {
			if (this.platform === '苹果') {
				window.location.href = 'https://apps.apple.com/cn/app/%E4%B8%AD%E5%93%81%E7%BB%B4%E5%BA%A6%E5%95%86%E5%9F%8E%E5%B9%B3%E5%8F%B0/id6747891024';
			} else if (this.platform === '安卓') {
				window.location.href = 'https://alioss.zpwdsc.com/apk/zpwdsc.apk';
			}
		}
	},
	mounted() {
		// 设置无缓存
		this.setNoCache();

		// 首先检测是否为微信浏览器
		if (this.checkWechatBrowser()) {
			return; // 如果是微信浏览器，不执行后续的下载逻辑
		}

		// 检测设备类型
		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1 || ua.indexOf('ipod') !== -1) {
			this.platform = '苹果';
			// 模拟跳转延迟
			setTimeout(() => {
        // 跳转到App Store
        window.location.href = 'https://apps.apple.com/cn/app/%E4%B8%AD%E5%93%81%E7%BB%B4%E5%BA%A6%E5%95%86%E5%9F%8E%E5%B9%B3%E5%8F%B0/id6747891024';
			}, 3000); // 延迟3秒后跳转
		} else if (ua.indexOf('android') !== -1) {
			this.platform = '安卓';
			// 模拟跳转延迟
			setTimeout(() => {
				// 下载APK文件
				window.location.href = 'https://alioss.zpwdsc.com/apk/zpwdsc.apk';
			}, 3000); // 延迟3秒后跳转
		} else {
			// 无法识别设备类型，保持默认值 'NO-APP'
			this.platform = 'NO-APP';
		}
	}
}
</script>

<style>
/* 主容器样式 */
.content {
	min-height: 100vh;
	background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40rpx;
	box-sizing: border-box;
}

/* 微信浏览器提示样式 */
.wechat-tip {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20rpx);
	border-radius: 30rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	max-width: 600rpx;
	width: 100%;
	animation: slideInUp 0.6s ease-out;
}

.tip-header {
	text-align: center;
	margin-bottom: 50rpx;
}

.tip-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	animation: pulse 2s infinite;
}

.tip-title {
	font-size: 48rpx;
	font-weight: bold;
	background: linear-gradient(135deg, #ff6b6b, #ee5a24);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 20rpx;
}

.tip-content {
	font-size: 32rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 50rpx;
	text-align: center;
}

.tip-steps {
	margin-bottom: 50rpx;
}

.step {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding: 20rpx;
	background: rgba(255, 107, 107, 0.1);
	border-radius: 15rpx;
	border-left: 6rpx solid #ff6b6b;
}

.step-number {
	width: 60rpx;
	height: 60rpx;
	background: linear-gradient(135deg, #ff6b6b, #ee5a24);
	color: white;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
	margin-right: 30rpx;
	flex-shrink: 0;
}

.step-text {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.tip-footer {
	text-align: center;
	padding-top: 30rpx;
	border-top: 1rpx solid rgba(0, 0, 0, 0.1);
}

.browser-icon {
	font-size: 60rpx;
	margin-bottom: 15rpx;
}

.footer-text {
	font-size: 26rpx;
	color: #999;
}

/* 下载界面样式 */
.download-container {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(20rpx);
	border-radius: 30rpx;
	padding: 60rpx 40rpx;
	box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
	border: 1rpx solid rgba(255, 255, 255, 0.2);
	max-width: 600rpx;
	width: 100%;
	animation: slideInUp 0.6s ease-out;
}

.download-header {
	text-align: center;
	margin-bottom: 50rpx;
}

.app-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	animation: bounce 2s infinite;
}

.app-title {
	font-size: 48rpx;
	font-weight: bold;
	background: linear-gradient(135deg, #ff6b6b, #ee5a24);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	margin-bottom: 15rpx;
}

.app-subtitle {
	font-size: 28rpx;
	color: #999;
	font-weight: 500;
}

.download-content {
	margin-bottom: 50rpx;
}

.platform-info {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	padding: 20rpx 30rpx;
	background: rgba(255, 107, 107, 0.1);
	border-radius: 25rpx;
	border: 2rpx solid rgba(255, 107, 107, 0.2);
}

.platform-icon {
	font-size: 40rpx;
	margin-right: 20rpx;
}

.platform-text {
	font-size: 32rpx;
	color: #ff6b6b;
	font-weight: bold;
}

.download-message {
	font-size: 32rpx;
	color: #333;
	line-height: 1.6;
	text-align: center;
	margin-bottom: 30rpx;
}

.download-tips {
	font-size: 28rpx;
	color: #666;
	text-align: center;
	margin-bottom: 40rpx;
	line-height: 1.5;
}

.loading-animation {
	text-align: center;
	margin-bottom: 40rpx;
}

.loading-dots {
	display: flex;
	justify-content: center;
	margin-bottom: 20rpx;
}

.dot {
	width: 20rpx;
	height: 20rpx;
	background: linear-gradient(135deg, #ff6b6b, #ee5a24);
	border-radius: 50%;
	margin: 0 10rpx;
	animation: loadingDot 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

.loading-text {
	font-size: 26rpx;
	color: #999;
}

.download-footer {
	text-align: center;
	padding-top: 30rpx;
	border-top: 1rpx solid rgba(0, 0, 0, 0.1);
}

.footer-note {
	font-size: 26rpx;
	color: #999;
}

/* 动画效果 */
@keyframes slideInUp {
	from {
		opacity: 0;
		transform: translateY(50rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pulse {
	0%, 100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.05);
	}
}

@keyframes bounce {
	0%, 20%, 50%, 80%, 100% {
		transform: translateY(0);
	}
	40% {
		transform: translateY(-20rpx);
	}
	60% {
		transform: translateY(-10rpx);
	}
}

@keyframes loadingDot {
	0%, 80%, 100% {
		transform: scale(0.8);
		opacity: 0.5;
	}
	40% {
		transform: scale(1);
		opacity: 1;
	}
}

/* 手动选择界面样式 */
.manual-select {
	text-align: center;
}

.select-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.select-subtitle {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 50rpx;
}

.button-group {
	margin-bottom: 50rpx;
}

.download-btn {
	display: flex;
	align-items: center;
	padding: 30rpx;
	margin-bottom: 30rpx;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 20rpx;
	border: 2rpx solid rgba(255, 107, 107, 0.2);
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.download-btn:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.android-btn {
	border-left: 6rpx solid #3ddc84;
}

.android-btn .btn-icon {
	color: #3ddc84;
}

.ios-btn {
	border-left: 6rpx solid #007aff;
}

.ios-btn .btn-icon {
	color: #007aff;
}

.btn-icon {
	font-size: 50rpx;
	margin-right: 30rpx;
	flex-shrink: 0;
}

.btn-content {
	flex: 1;
	text-align: left;
}

.btn-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.btn-desc {
	font-size: 24rpx;
	color: #999;
}

.btn-arrow {
	font-size: 36rpx;
	color: #ccc;
	font-weight: bold;
}

.select-tips {
	background: rgba(255, 107, 107, 0.05);
	border-radius: 15rpx;
	padding: 30rpx;
	border: 1rpx solid rgba(255, 107, 107, 0.1);
}

.tip-item {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 10rpx;
}

.tip-item:first-child {
	font-weight: bold;
	color: #ff6b6b;
	margin-bottom: 15rpx;
}

/* 手动下载按钮样式 */
.manual-download {
	text-align: center;
	margin-top: 40rpx;
}

.manual-tip {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
}

.manual-btn {
	display: flex;
	align-items: center;
	padding: 20rpx 40rpx;
	background: rgba(255, 107, 107, 0.8);
	border-radius: 20rpx;
	border: 2rpx solid rgba(255, 107, 107, 0.2);
	transition: all 0.3s ease;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.manual-btn:active {
	transform: scale(0.98);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.manual-btn-icon {
	font-size: 50rpx;
	margin-right: 20rpx;
}

.manual-btn-text {
	font-size: 32rpx;
	font-weight: bold;
	color: white;
}
</style>
