<template>
	<view class="container">
		<view class="box-base" v-if="isComplete">
			<view class="hd">
				<image class="icon" :src="iconWallet" mode="aspectFit"></image>
				<view class="text">当前剩余</view>
			</view>
			<view class="bd">
				<view class="text">{{objBase.balance | unitPrice}}</view>
				<view class="lock">冻结金额：{{objBase.freezeMoney | unitPrice}}元</view>
			</view>
		</view>
		<view class="frm-balance">
			<view class="r-money">
				<view class="unit">￥</view>
				<input class="text" type="digit" :placeholder="formattedMemberWalletPlaceholder" />
			</view>
		</view>
		<view class="lnk-balance">立即提现</view>
	</view>
</template>

<script>
	import {getStoreMoney} from "@/api/distributor";

  export default{
		name: '',
		components: {
			
		},
		data(){
			return {
				isComplete: false,
				iconWallet: `${this.iconCommon}/static/v1/wallet/icon-wallet.png`,
				
				objBase: {
					balance: 0,
          freezeMoney: 0
				}
			}
		},
    computed: {
      // 生成 placeholder 文本
      formattedMemberWalletPlaceholder() {
        const formattedWallet = this.$options.filters.unitPrice(this.objBase.balance);
        return '当前可提现金额' + formattedWallet;
      }
    },
		methods: {
			// 加载余额信息
			loadBaseData: function(){
        getStoreMoney().then(res => {
          this.isComplete = true
          if (res.data.code == 200) {
            this.objBase = res.data.result
            this.objBase.isComplete = true
          }
        })
			}
		},
		onLoad: function(){
			// 加载余额信息
			this.loadBaseData()
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
		padding: 0 20rpx 90rpx 20rpx;
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
	}
}	
</style>