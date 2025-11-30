<template>
	<view class="container" :class="{'container-patch': isEditMode}">
		<view class="tips" v-if="isComplete && arrData.length > 0">
			<view class="text">为您展示最多100条收藏信息</view>
			<view class="link">
				<view class="lnk-item" @tap="handlerAllDelete" v-if="!isEditMode">清空</view>
				<view class="lnk-item" @tap="handlerChangeMode">{{isEditMode ? '完成' : '编辑'}}</view>
			</view>
		</view>
		<view class="null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无收藏信息" />
		</view>
		<view class="list" v-if="isComplete && arrData.length > 0">
			<view class="item" :class="{'item-hov': item.move}" v-for="(item, index) in arrData"
			:key="index" :data-index="index"
			>
			<!-- @touchstart="bindTouchStart"
			@touchmove="bindTouchMove" -->
				<view class="info">
					<base-goods-item :goods="item" :isCheck="item.isCheck" :isEdit="isEditMode" :index="index" @checked="handlerCheck" />
				</view>
				<view class="link" :data-index="index" @tap="handlerDelete">删除</view>
			</view>
		</view>

		<view class="fixed-link" v-if="isEditMode">
			<view class="full-control">
				<view class="chk-wrap" @tap="handlerAllCheck">
					<image class="ico" :src="flagAllChecked ? iconCheckHov : iconCheck" mode="aspectFit"></image>
					<view class="txt">全选</view>
				</view>
				<view class="lnk-wrap">
					<view class="item item-primary" @tap="handlerSelDelete">删除</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>

	import EmptyBox from "@/components/Hina/EmptyBox";
	import BaseGoodsItem from "@/components/Hina/BaseGoodsItem";
	import { getGoodsCollection,deleteGoodsCollection,delMyCollectList } from "@/api/members.js";
	export default{
		name: '',
		components: {
			EmptyBox,
			BaseGoodsItem
		},
		data(){
			return {
				isComplete: false,
				iconCheck: `${this.iconCommon}/static/v1/common/icon-check.png`,
				iconCheckHov: `${this.iconCommon}/static/v1/common/icon-check_hov.png`,

				arrData: [],
				arrChecked: [],						// 选中商品ID数组
				flagAllChecked: false,		// 是否全选

				intResTotal: 0,						// 记录总数

				isEditMode: false,				// 是否编辑模式，编辑模式禁止滑动

				startX: 0, //开始坐标
				startY: 0,
				params: {
							pageNumber: 1,
							pageSize: 10,
						},
				isCanSubmit:true,//默认可点击
			}
		},
		methods: {
			// 加载商品数组
			loadBaseData: function(){
				uni.showLoading({
					title: "加载中",
				});
				getGoodsCollection(this.params, "GOODS").then((res) => {
					 if (this.$store.state.isShowToast){ uni.hideLoading() };
					uni.stopPullDownRefresh();
					if (res.data.success) {
						this.isComplete = true
						let data = res.data.result.records;
						this.intResTotal=res.data.result.total
						if (data.length > 0) {
							data.forEach(item => {
								item.icon = item.image;
							});
							this.arrData.push(...data);
						}
					}
				});
				// this.arrData.push({move: false, isDisable: false, isChecked: false, icon: `${this.iconCommon}/static/v1/demo/r1.jpg`, id: 1, name: '贝特阿斯 高硼硅耐热玻璃饭盒微波炉560+760ml双隔断保鲜盒RLG2-07B+包', price: 750})

			},
			// 全选
			handlerAllCheck() {
				this.flagAllChecked = !this.flagAllChecked; // 切换全选标志的状态
				this.arrData.forEach(item => {
					item.isCheck = this.flagAllChecked; // 根据全选标志的状态来统一设置每个项目的选中状态
				})
				// 重新计算选中的商品列表
				this.recalculateCheckedItems();
			},
			// 重新计算选中的商品列表
			recalculateCheckedItems: function() {
				this.arrChecked = this.arrData.filter(item => item.isCheck).map(item => item.skuId);
			},
			// 变更渲染模式
			handlerChangeMode: function(){
				this.isEditMode = !this.isEditMode
			},

			// 删除选中商品
			handlerDelete: function(e){
				if(!this.isCanSubmit)return
				this.isCanSubmit = false
				// 执行接口删除
				let eIndex = e.currentTarget.dataset.index
				deleteGoodsCollection([this.arrData[eIndex].skuId]).then((res) => {
					if (res.data.code == 200) {
						// 数据列表中商品ID
						let eId = this.arrData[eIndex].skuId
						// 选中数组中，查找eId索引值
						let eCheckIndex = this.arrChecked.findIndex(o => o == eId)
						if(eCheckIndex >= 0){
							this.arrChecked.splice(eCheckIndex, 1)
						}
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none",
						});
					}
					this.isCanSubmit=true
				});
				this.arrData.splice(eIndex, 1)
			},

			// 删除全部商品
			handlerAllDelete: function(){
				if(!this.isCanSubmit)return
				this.isCanSubmit = false
				// 执行接口删除
				delMyCollectList().then((res) => {
					if (res.data.code == 200) {
						this.arrData.splice(0, this.arrData.length)
						this.arrChecked.splice(0, this.arrChecked.length)

					} else {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none",
						});
					}
					this.isCanSubmit = true
				});
				this.flagAllChecked = false
			},

			// 删除选中商品
			handlerSelDelete: function(){
				if(!this.isCanSubmit)return
				this.isCanSubmit = false
				// let ids=this.arrChecked.join(',')
				// 先执行接口删除
				deleteGoodsCollection(this.arrChecked).then((res) => {
					if (res.data.code == 200) {
						this.arrChecked.forEach(o => {
						let eIndex = this.arrData.findIndex(item => item.skuId == o)
						if(eIndex >= 0){
							this.arrData.splice(eIndex, 1)
						}
					})
					this.arrChecked.splice(0, this.arrChecked.length)
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none",
						});
					}
					this.isCanSubmit = true
				});

				this.flagAllChecked = false
				this.isEditMode = false
			},
			// 选中商品
			handlerCheck: function(e){
				let eIndex = e.index
				this.arrData[eIndex].isCheck = !this.arrData[eIndex].isCheck
        this.arrData = [...this.arrData] ;
        // 重新计算选中的商品列表
				this.recalculateCheckedItems();
				// 检查是否所有项都被选中
				const allChecked = this.arrData.every(item => item.isCheck);
				// 更新全选按钮的状态以反映当前的选中情况
				this.flagAllChecked = allChecked;
			},

			bindTouchStart: function(e){
				let _this = this
				let _arrTemp = _this.arrData
				let eIndex = e.currentTarget.dataset.index
				if(_this.isEditMode){
					return
				}
				//开始触摸时 重置所有删除
				for (let i = 0 ; i < _arrTemp.length ; i++){
					if( eIndex != i && _arrTemp[i].move){
						_arrTemp[i].move = false
					}
				}
				_this.startX = e.changedTouches[0].clientX
				_this.startY = e.changedTouches[0].clientY
			},

			bindTouchMove: function(e){
				let _this = this
				let _arrTemp = _this.arrData
				let index = e.currentTarget.dataset.index
				if(_this.isEditMode){
					return
				}
				let touchMoveX = e.changedTouches[0].clientX  //滑动变化坐标
				let touchMoveY = e.changedTouches[0].clientY  //滑动变化坐标
				//获取滑动角度
				let angle = _this.angle({ X: _this.startX, Y: _this.startY }, { X: touchMoveX, Y: touchMoveY });
				let touchFlag = false

				for(let i = 0 ; i < _arrTemp.length ; i++){
					_arrTemp[i].move = touchFlag
					if (Math.abs(angle) > 30) return;
					if (i == index){
						if (touchMoveX > _this.startX){
							_arrTemp[i].move = false
						}else{
							_arrTemp[i].move = true
						}
					}
				}
			},

			angle: function (start, end) {
				let _X = end.X - start.X
				let _Y = end.Y - start.Y
				//返回角度 /Math.atan()返回数字的反正切值
				return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
			},
		},
		onLoad: function(){
			this.arrData=[]
			// 加载商品数组
			this.loadBaseData()
		},
		onShow: function(){

		},
		onReachBottom: function(){
			if(this.intResTotal > this.arrData.length){
				this.params.pageNumber++
				this.loadBaseData()
			}
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	.tips{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		font-size: 26rpx;
		padding: 0 20rpx;
		.text{
			color: #666;
		}
		.link{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.lnk-item{
				margin: 0 0 0 16rpx;
				color: #323232;
				&:last-of-type{
					color: #E22221;
				}
			}
		}
	}
	.list{
		padding: 0 0 20rpx;
		.item{
			position: relative;
			overflow: hidden;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #FFF;
			&::after{
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 3rpx;
				background: rgba(0, 0, 0, 0.08);
			}
			&:last-of-type{
				margin: 0;
			}
			.info{
				width: 100vw;
				padding: 20rpx 0;
				box-sizing: border-box;
				margin-left: -100rpx;
				transition: all 0.4s;
				-webkit-transition: all 0.4s;
				-webkit-transform: translateX(100rpx);
				transform: translateX(100rpx);
				-webkit-transform: translateX(100rpx);
			}
			.link{
				background: #E22221;
				color: #FFF;
				width: 100rpx;
				height: 200rpx;
				font-size: 26rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				transform: translateX(100rpx);
				-webkit-transform: translateX(100rpx);
				transition: all 0.4s;
				-webkit-transition: all 0.4s;
			}
		}
		.item-hov{
			.info{
				transform: translateX(0);
				-webkit-transform: translateX(0);
			}
			.link{
				transform: translateX(0);
				-webkit-transform: translateX(0);
			}
		}
	}

	.full-control{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		.chk-wrap{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.ico{
				width: 32rpx;
				height: 32rpx;
			}
			.txt{
				padding: 0 0 0 16rpx;
				font-size: 26rpx;
				color: #333;
			}
		}
		.lnk-wrap{
			.item{
				font-size: 28rpx;
				min-width: 160rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
			}
			.item-primary{
				color: #FFF;
				background: #E22221;
			}
		}
	}
}
</style>
