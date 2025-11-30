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
				<input class="text" v-model="price" type="digit" :placeholder="formattedMemberWalletPlaceholder" />
			</view>
		</view>
		<view class="lnk-balance" @tap="withdraw">立即提现</view>
	</view>
</template>

<script>
import { withdrawalApply } from '@/api/members.js'
import {getDistributorMoney} from "../../api/dealerCenter";
	export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				iconWallet: `${this.iconCommon}/static/v1/wallet/icon-wallet.png`,

				objBase: {
          balance: 0, // 当前积分
          freezeMoney: 0, // 冻结金额
				},
				isCanSubmit:true,//默认可点击
				price:null
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
        getDistributorMoney().then((res) => {
          if (this.$store.state.isShowToast) {
            uni.hideLoading()
          }
          if (res.data.code == 200) {
            this.objBase = res.data.result
            this.isComplete = true
          }
        })
			},
			withdraw(){
				if(!this.price){
					this.$u.toast('请输入提现金额')
					return
				}
				let params = { price: this.price };
				if(!this.isCanSubmit)return
				this.isCanSubmit = false
				withdrawalApply(params).then((res) => {
					if (res.data.success) {
						this.$u.toast('提交成功')
						this.loadBaseData()
						uni.navigateBack()
					}
					this.isCanSubmit=true
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
			display: flex;
			justify-content: flex-start;
			align-items: baseline;
			line-height: 60rpx;
			.text{
				font-size: 48rpx;
				font-weight: 600;
			}
			.lock{
				font-size: 24rpx;
				padding: 0 0 0 16rpx;
			}
		}
	}
}
</style>