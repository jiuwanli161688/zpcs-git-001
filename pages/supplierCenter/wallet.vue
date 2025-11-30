<template>
	<view class="container">
		<view class="box-base" v-if="objBase.isComplete">
			<view class="hd">
				<image class="icon" :src="iconWallet" mode="aspectFit"></image>
				<view class="text">当前剩余</view>
			</view>
			<view class="bd">
				<view class="text">{{objBase.balance | unitPrice}}</view>
				<view class="lock">冻结金额：{{objBase.freezeMoney | unitPrice}}元</view>
			</view>
			<view class="ft">累计收入{{objBase.accumulateIncome}}元</view>

		</view>
<!--		<view class="btn-balance" @tap="handlerCashOut">我要提现</view>-->
		<empty-box v-if="objData.isComplete && objData.arrData.length == 0" text="暂无资金流水" />
		<view class="box-wrap" v-if="objData.isComplete && objData.arrData.length > 0">
			<view class="name">
				<view class="title">最近交易流水</view>
				<view class="arrow" @tap="handlerArrow">更多</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in objData.arrData" :key="index">
					<rec-number :rec="item" />
				</view>
			</view>

		</view>
	</view>
</template>

<script>

	import EmptyBox from "@/components/Hina/EmptyBox";
	import RecNumber from "@/components/Hina/RecNumber";
  import {getStoreMoney, getStoreWallet} from "@/api/distributor";
  import {handleServiceType} from "@/utils/filters";


	export default{
		name: '',
		components: {
			EmptyBox,
			RecNumber
		},
		data(){
			return {
				isComplete: false,
				iconWallet: `${this.iconCommon}/static/v1/wallet/icon-wallet.png`,
				// 基本信息
				objBase: {
					isComplete: false,	// 是否查询完成
          accumulateIncome: 0,						// 累计收入
					balance: 0,					// 当前余额
          freezeMoney: 0,			// 冻结金额
				},
				// 最新流水
				objData: {
					isComplete: false,
					arrData: []
				},
        params: {
          pageNumber: 1,
          pageSize: 10
        }

			}
		},
		methods: {
			// 余额信息
			loadBaseData: function(){
        getStoreMoney().then(res => {
          if (res.data.code == 200) {
            this.objBase = res.data.result
            this.objBase.isComplete = true
          }
        })
			},

			// 最新流水
			loadRecordData: function(){
        getStoreWallet(this.params).then((res) => {
          if (res.data.success) {
            this.objData.isComplete = true
            if (res.data.result.records.length != 0) {
              this.objData.arrData.push(...res.data.result.records)
              this.objData.arrData.forEach(item => {
                item.serviceTypeText=handleServiceType(item.serviceType)
              });
            }
          }
        })
			},

			// 我要提现
			handlerCashOut: function(){
				uni.navigateTo({
					url: '/pages/supplierCenter/operator'
				})
			},

			// 查看更多
			handlerArrow: function(){
				uni.navigateTo({
					url: '/pages/supplierCenter/transaction'
				})
			},
		},
		onLoad: function(){
			// 余额信息
			this.loadBaseData()
			// 最新流水
			this.loadRecordData()
		},
		onShow: function(){

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
		padding: 0 20rpx 20rpx;
		color: #FFF;
		.hd{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			line-height: 88rpx;
			.icon{
				width: 32rpx;
				height: 32rpx;
			}
			.text{
				font-size: 28rpx;
				padding: 0 0 0 16rpx;
			}
		}
		.bd{
			display: flex;
			justify-content: flex-start;
			align-items: baseline;
			.text{
				font-size: 56rpx;
				font-weight: 600;
			}
			.lock{
				padding: 0 0 0 12rpx;
				font-size: 28rpx;
			}
		}
		.ft{
			font-size: 24rpx;
			line-height: 72rpx;
		}

	}
	.btn-balance{
		font-size: 28rpx;
		font-weight: 600;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 12rpx;
		text-align: center;
		background: #E22221;
		color: #FFF;
		margin: 30rpx 20rpx 20rpx;
	}

	.box-wrap{
		padding: 0 20rpx;
		.name{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			line-height: 96rpx;
			padding: 0 0 0 20rpx;
			position: relative;
			&::after{ position: absolute; content: ''; left: 0; top: 50%; transform: translateY(-50%); width: 6rpx; height: 40rpx; border-radius: 6rpx; background: #E22221;}
			.title{
				font-size: 30rpx;
				color: #333;
				font-weight: 600;
			}
			.arrow{
				font-size: 26rpx;
			}
		}
		.list{
			background: #FFF;
			border-radius: 12rpx;
			.item{
				position: relative;
				padding: 0 16rpx;
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
}
</style>
