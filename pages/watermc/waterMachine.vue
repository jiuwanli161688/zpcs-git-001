<template>
	<view class="container">
		<!-- 头部 -->
		<view class="head">
			<view class="head-nav">
				<view class="head-nav-go"></view>
				<label @click="historyReturn">
					<text class="head-nav-text">智能水机</text>
					<view class="head-nav-coupon" @click="clickCouponHistory"></view>

				</label>
			</view>
			<!-- 视频区域（支持双击/双击触摸进入全屏） -->
			<view class="head-video" @touchend="handleVideoTap">
				<video id="mainVideo" ref="mainVideo" class="video" :src="videoUrl"
				show-center-play-btn="true"
				enable-play-gesture="true"
				show-progress="true"
				controls></video>
			</view>
			<!-- 兑换券区域 -->
			<view class="head-coupon">
				<view class="coupon-title-row">
					<text class="coupon-title">当前兑换券统计</text>
					<view class="coupon-rule">
						<view class="coupon-ruleV"></view>
						<text class="coupon-ruleT"
						@click="clickCouponRules"
						 >兑换券规则</text>
					</view>
				</view>

				<view class="coupon-progress-row">
					<view class="progress-track">
						<view class="progress-fill"
						:style="{ width:progressBar + '%' }"></view>
						<view class="pig-icon"
						:style="{ left: progressBar + '%'  }">
							<image class="pig-icon-image" src="../../static/cbd/iconProgress.png"></image>
						</view>
					</view>
					<text class="progress-percent">30%</text>
				</view>

				<view class="coupon-main">
					<view class="coupon-amount">
						<image class="coupon-amount-image" src="../../static/cbd/couponRed.png"></image>
						<text class="amount">5000</text>
						<text class="amount-unit">兑换券</text>
					</view>
					<text class="coupon-desc">距离兑换第一台智能饮水机还需要 <text class="highlight">25000</text> 兑换券</text>
				</view>

				<view class="coupon-action">
					<button class="exchange-btn disabled" @click="clickBtn" disabled>立即兑换</button>
				</view>

			</view>
		</view>
		<!-- 图片 -->
		<view class="imgs">
			<view class="imgs-center">
				<image class="imgs-inner" src="../../static/cbd/introduction.png" mode="aspectFill"></image>
			</view>
		</view>
		<!-- 底部商品列表 -->
		<view class="commodity">
			<view class="commodity-tab">
				<!-- 选项卡内容 -->
				<view
				v-for="(item,ind) in tabListL"
				@click="clickTab(ind)"
				:class="['commodity-tab-item', tabActive===ind ? 'commodity-tab-active' : '']"
				:key="ind"
				>{{ item }}</view>

			</view>
			<view class="commodity-list">
				<block v-for="(item, idx) in commodityList" :key="idx">
					<view class="commodity-card" @click="clickListItem(item.id)">
						<image class="commodity-img" :src="item.productFile.split(',')[0]" mode="aspectFill"></image>
						<view class="commodity-body">
							<text class="commodity-title">{{ item.productName }}</text>
							<view class="commodity-foot">
								<view class="price-wrap">
									<text class="price-num">{{ item.price }}</text>
									<text class="price-unit"> 兑换券</text>
								</view>
								<view class="exchange-badge"></view>
							</view>
						</view>
					</view>
				</block>

        <no-data v-if="commodityList.length === 0" />
			</view>
		</view>
	</view>
</template>

<script>
import NoData from '@/components/no-data.vue';
import {getWatermcProductList} from "@/api/cbd/waterc";

export default {
	name: "waterMachine",
  components: { NoData },
	data() {
		return {
			videoUrl: "your-video-url.mp4",// 视频地址
			progressBar:30,// 进度条
			tabActive:0,// 选项卡
			tabListL:['全部','智能水机','水机配件'],
			commodityTotalList:{},//商品总列表以及包含分类
			commodityList: [// 商品展示列表
				{ img: '../../static/cbd/caomei.png', title: '即热式饮水机家用智能饮水机中品2代深灰版', price: '5000' },
				{ img: '../../static/cbd/nverhong.png', title: '绍兴上虞女儿红1000ml', price: '8000' },
				{ img: '../../static/cbd/caomei.png', title: '即热式饮水机家用智能饮水机中品2代深灰版', price: '5000' },
				{ img: '../../static/cbd/nverhong.png', title: '绍兴上虞女儿红1000ml', price: '8000' }
			],
      intResTotal: 0, // 总条数
			// 双击检测
			_lastVideoTapTime: 0,
			isVideoFullscreen: false,
      // 查询参数
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
		}
	},
	methods: {
		// 点击兑换券历史记录
		clickCouponHistory() {
			console.log('兑换券历史记录功能待实现')
		},
		//返回上一页
		historyReturn(){
			console.log('返回上一页功能待实现')
		},
		// 点击兑换券规则
		 clickCouponRules() {
			console.log('点击兑换券规则功能待实现')
		 },
		 //立即兑换按钮
		 clickBtn(){
			console.log('立即兑换按钮功能待实现')
		 },
		 // 减少数量
		 decQty() {
			if (this.couponProduct && this.couponProduct.qty > 1) {
				this.couponProduct.qty--;
			}
		 },
		 // 增加数量
		 incQty() {
			if (this.couponProduct && this.couponProduct.qty < this.couponProduct.stock) {
				this.couponProduct.qty++;
			}
		 },
		 //商品tabbat切换
		 clickTab(index){
			// 切换选中索引，控制类名变化
			this.tabActive = index;
		 },
		 // 点击商品
		 clickListItem(id){
       uni.navigateTo({
         url: '/pages/watermc/waterMachineItem?id='+id
       })
			console.log('点击商品功能待实现')
		 },

		// 处理 video 区域的触摸以检测双击/双触：若连续两次 tap 在 300ms 内则视为双击
		handleVideoTap(e) {
			const now = Date.now();
			if (now - this._lastVideoTapTime <= 300) {
				// 双击
				this.toggleVideoFull();
			}
			this._lastVideoTapTime = now;
		},

		// 切换 video 全屏（兼容 uni.createVideoContext 与 浏览器 fullscreen API）
		toggleVideoFull() {
			try {
				// 优先使用 uni.createVideoContext（uni-app 平台）
				if (typeof uni !== 'undefined' && uni.createVideoContext) {
					const ctx = uni.createVideoContext && uni.createVideoContext('mainVideo', this);
					if (ctx) {
						if (!this.isVideoFullscreen) {
							if (ctx.requestFullScreen) {
								// 某些平台命名为 requestFullScreen
								ctx.requestFullScreen({ direction: 0 });
							} else if (ctx.requestFullScreen) {
								ctx.requestFullScreen();
							}
						} else {
							if (ctx.exitFullScreen) ctx.exitFullScreen();
						}
						this.isVideoFullscreen = !this.isVideoFullscreen;
						return;
					}
				}

				// H5 fallback: 使用 DOM Fullscreen API
				const vref = this.$refs && this.$refs.mainVideo;
				const el = vref && (vref.nodeName ? vref : (vref.$el || vref));
				if (el) {
					// element could be a uni-view wrapper — try to find actual video element
					const videoEl = (el.tagName && el.tagName.toLowerCase() === 'video') ? el : (el.querySelector ? el.querySelector('video') : null) || el;
					if (!document.fullscreenElement && !document.webkitFullscreenElement) {
						if (videoEl.requestFullscreen) videoEl.requestFullscreen();
						else if (videoEl.webkitRequestFullscreen) videoEl.webkitRequestFullscreen();
						else if (videoEl.mozRequestFullScreen) videoEl.mozRequestFullScreen();
						else if (videoEl.msRequestFullscreen) videoEl.msRequestFullscreen();
						this.isVideoFullscreen = true;
					} else {
						if (document.exitFullscreen) document.exitFullscreen();
						else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
						else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
						else if (document.msExitFullscreen) document.msExitFullscreen();
						this.isVideoFullscreen = false;
					}
				}
			} catch (err) {
				console.warn('toggleVideoFull error', err);
			}
		},

		// 获取列表
    getList() {
      uni.showLoading({
        title: "加载中",
      });
      getWatermcProductList(this.params).then((res) => {
        uni.stopPullDownRefresh();
        if (this.$store.state.isShowToast){ uni.hideLoading() };
        if (res.statusCode == 200) {
          this.isComplete = true
          let data = res.data.result.records;
          this.intResTotal=res.data.result.total
          this.commodityList.push(...data);
        }
      });
    }

	},
  onLoad: function(){
    this.commodityList=[]
    // 加载商品数组
    this.getList()
  },
  onReachBottom: function(){
    if(this.intResTotal > this.commodityList.length){
      this.params.pageNumber++
      this.getList()
    }
  }
}
</script>




<style lang="scss">
$ca: calc(100% - 40rpx); //预设左右边距

ul li {
	list-style: none
}

.container {
	width: 100%;
	height: 100rpx;
	background-color: #F5F5F5;
}

.head {
	width: 100%;
	height: auto;
}

.head-nav {
	width: 100%;
	height: 46rpx;
	background: white;
	box-sizing: border-box;
	padding: 46rpx 20rpx;
}

.head-nav-go {
	width: 17rpx;
	height: 30rpx;
	background: url(@/static/cbd/headGo.png) no-repeat;
	background-size: 100% 100%;
	float: left;
	margin-top: -14rpx;

}
.head-nav-text {
	float: left;
	display: inline-block;
	margin-left: 20rpx;
	line-height: 2rpx;
	font-weight: 400;

}

.head-nav-coupon {
	width: 40rpx;
	height: 32rpx;
	background: url(@/static/cbd/headCoupon.png) no-repeat;
	background-size: 100% 100%;
	float: right;
	margin-top: -14rpx;
	margin-right: 6rpx;
}

.head-video {
	width: 100%;
	height: auto;
	background-color: white;
}

.video {
	width: $ca;
	height: 368rpx;
	margin: 20rpx 20rpx 0;
	border-radius: 20rpx;
}

.head-coupon {
	width: 100%;
	padding: 20rpx;
	background-color: #FFF;
	border-radius: 0 0 20rpx 20rpx;
}

.coupon-card {
	background: #FFFFFF;
	border-radius: 12rpx;
	padding: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.coupon-title-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 18rpx;
}

.coupon-title {
	font-size: 28rpx;
	color: #333333;
	font-weight: 400;
}

.coupon-rule {
	display: flex;
	align-items: center;
	color: #999999;
	height: 44rpx;
	font-size: 24rpx;
}

.coupon-ruleV {
	width: 24.5rpx;
	height: 24.5rpx;
	background: url(@/static/cbd/couponRules.png) no-repeat;
	background-size: cover;
	flex: 0 0 24.5rpx;
	margin-right: 8rpx;
}

.coupon-ruleT {
	font-size: 24rpx;
	color: #999999;
}

.coupon-progress-row {
	display: flex;
	align-items: center;
	margin-bottom: 18rpx;
}

.progress-track {
	position: relative;
	flex: 1;
	height: 28rpx;
	background: #FFE4E4;
	border-radius: 100rpx;
	/* overflow: hidden; */
}

.progress-fill {
	height: 100%;
	/* 对角条纹（斜杠）样式：深红与淡红交替，条纹从左向右移动 */
	background-color: #ffdede; /* 底色，避免空白 */
	background-image: repeating-linear-gradient(125deg, #ff3b30 0, #ff3b30 14px, #ffdede 14px, #ffdede 23px);
	background-size: 34px 34px;
	border-radius: 100rpx;
	// transition: width 400ms ease; /* 宽度平滑过渡 */
	// animation: stripes-move 7s linear infinite ;
}


.pig-icon {
	position: absolute;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 44rpx;
	height: 64rpx;
}

.pig-icon-image {
	width: 100%;
	height: 100%;
}

.progress-percent {
	margin-left: 14rpx;
	font-size: 20rpx;
	font-weight: 400;
	color: #FF0101;
}

.coupon-main {
	display: flex;
	flex-direction: column;
	margin-bottom: 18rpx;
}

.coupon-amount {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	gap: 8rpx;
	margin-bottom: 8rpx;
	white-space: nowrap;
}

.coupon-amount>* {
	white-space: nowrap;
}

.money-icon {
	width: 44rpx;
	height: 36rpx;
}

.amount {
	color: #FF3B30;
	font-size: 36rpx;
	font-weight: 700;
	margin-right: 6rpx;
}

.amount-unit {
	color: #FF3B30;
	font-size: 30rpx;
	font-weight: 400;
}

.coupon-desc {
	color: #999999;
	font-size: 22rpx;
	font-size: 700;
}

.highlight {
	color: #FF3B30;
	font-weight: 600;
}

.coupon-action {
	display: flex;
	justify-content: center;
	margin-top: 6rpx;
}

.exchange-btn {
	width: calc(100% - 20rpx);
	height: 80rpx;
	border-radius: 14rpx;
	font-size: 28rpx;
	border: none;
	line-height: 80rpx;
}

.exchange-btn.disabled {
	background: #F0F0F0;
	color: #BFBFBF;
}

/* 统一设置边框弧度 */
.imgs,
.imgs-center {

	border-radius: 20rpx 20rpx 20rpx 20rpx;
}

.imgs {
	width: 100%;
	height: 2078rpx;
	background: #FFF;
	margin-top: 50rpx;
}

.imgs-center {
	width: $ca;
	height: $ca;
	float: left;
	margin: 20rpx;
	background: node;
}

.imgs-center .imgs-inner{
    width: 100%;
    height: 100%;
    display: block;
}

.coupon-amount-image{
	width: 44rpx;
	height: 36rpx;
}

.commodity {
	width: 100%;
	height: auto;
	margin-top: 16rpx;
}

.commodity-tab {
	width: 100%;
	height: 96rpx;
	display: flex;
	justify-content: center;
}

.commodity-tab view {
	flex: 1;
	text-align: center;
	line-height: 96rpx;
	font-weight: 700;
}

.commodity-tab-active {
	color: #E1332C;
	position: relative;
}

.commodity-tab-active::after {
	content: '';
	position: absolute;
	left: calc(50% - 24rpx);
	bottom: 12rpx;
	width: 48rpx;
	height: 6rpx;
	background: #E1332C;
	border-radius: 6rpx;
}

.commodity-list {
	/* grid container */
	display: flex;
	flex-wrap: wrap;
	gap: 24rpx;
	padding: 0 16rpx 20rpx;
	background: transparent;
	width: calc(100% - 0rpx);
	height: auto;
	margin-top: 16rpx;
}

.commodity-card {
	width: calc(50% - 16rpx);
	height: 440rpx;
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	margin-left: 4rpx;
}

.commodity-img {
	width: 244rpx;
	height: 244rpx;
	display: block;
	margin: 0 auto;
	padding-top: 32rpx;
	background: #FFF;
}

.commodity-body {
	padding: 18rpx;
}

.commodity-title {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	overflow: hidden;
	font-size: 24rpx;
	font-weight: 500;
	color: #333333;
	line-height: 32rpx;
	height: 64rpx;
	margin-bottom: 12rpx;
    box-sizing: border-box;
}

.commodity-foot {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.price-wrap {
	display: flex;
	align-items: baseline;
}

.price-num {
	color: #FF3B30;
	font-size: 32rpx;
	font-weight: 700;
}

.price-unit {
	color: #FF3B30;
	font-size: 24rpx;
	font-weight:400 ;
	margin-left: 6rpx;
}

.exchange-badge {
	width: 48rpx;
	height: 48rpx;
	background: url(@/static/cbd/iconExchange.png) no-repeat;
	background-size:100% 100%;
}


</style>
