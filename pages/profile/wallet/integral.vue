<template>
	<view class="container">
		<view class="box-base" v-if="objBase.isComplete">
			<view class="hd">
				<image class="icon" :src="iconIntegral" mode="aspectFit"></image>
				<view class="text">当前积分</view>
			</view>
			<view class="bd">{{objBase.integral}}</view>
			<view class="ft">累计获得积分：{{objBase.totalIntegral}}</view>
		</view>
		<view class="box-list" v-if="objData.isComplete && objBase.isComplete&&objData.arrData.length > 0">
			<view class="item" v-for="(item, index) in objData.arrData" :key="index">
				<point-number :rec="item" />
			</view>
		</view>
		<empty-box v-if="objData.isComplete && objData.arrData.length == 0" text="暂无积分" />
	</view>
</template>

<script>
	import PointNumber from "@/components/Hina/PointNumber";
	import {getMemberPointSum,getPointsList} from "@/api/members"
	import EmptyBox from '@/components/Hina/EmptyBox'

	export default{
		name: '',
		components: {
			PointNumber,
			EmptyBox
		},
		data(){
			return {
				isComplete: false,
				iconIntegral: `${this.iconCommon}/static/v1/wallet/icon-integral.png`,
				// 基本信息
				objBase: {
					isComplete: false,	// 是否查询完成
					integral: 0,				// 当前积分
					totalIntegral: 0		// 累计积分
				},
				// 最新流水
				objData: {
					isComplete: false,
					arrData: []
				},
				params:{
					pageNumber: 1,
          			pageSize: 10
				},
				intResTotal: 0,
			}
		},
		methods: {
			// 当前积分
			loadBaseData: function(){
				getMemberPointSum().then((res)=>{
					this.objBase.isComplete = true
					if(res.data.success){
						this.objBase.integral=res.data.result.point
						this.objBase.totalIntegral=res.data.result.totalPoint
					}
				})
			},

			// 最新流水
			loadRecordData: function(){
				getPointsList(this.params).then((res)=>{
					this.objData.isComplete = true
					if(res.data.success){
						this.intResTotal = res.data.result.total
						this.objData.arrData.push(...res.data.result.records)
					}
				})
			},
		},
		onLoad: function(){
			// 当前积分
			this.loadBaseData()
			// 最新流水
			this.loadRecordData()
		},
		onShow: function(){

		},
		onReachBottom: function(){
			if(this.intResTotal > this.objData.arrData.length){
       			 this.params.pageNumber++
				this.loadRecordData()
			}
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	box-sizing: border-box;
	.box-base{
		background: #E22221;
		color: #FFF;
		height: 250rpx;
		padding: 20rpx 30rpx 0;
		.hd{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			line-height: 80rpx;
			.icon{
				width: 32rpx;
				height: 32rpx;
			}
			.text{
				padding: 0 0 0 12rpx;
				font-size: 28rpx;
			}
		}
		.bd{
			font-size: 48rpx;
			line-height: 60rpx;
			font-weight: 600;
		}
		.ft{
			line-height: 60rpx;
			font-size: 28rpx;
		}
	}
	.box-list{
		padding: 0 20rpx;
		background: #FFF;
		.item{
			position: relative;
			&::after{
				position: absolute;
				content: '';
				left: 0;
				right: 0;
				bottom: 0;
				height: 3rpx;
				background: #E7E7E7;
			}
			&:last-of-type{
				&::after{
					display: none;
				}
			}
		}
	}
}
</style>