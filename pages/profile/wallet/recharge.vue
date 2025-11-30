<template>
	<view class="container">
		<view class="box-base" v-if="isComplete">
			<view class="hd">
				<image class="icon" :src="iconWallet" mode="aspectFit"></image>
				<view class="text">当前剩余</view>
			</view>
			<view class="bd">
				<view class="text">{{objBase.memberWallet | unitPrice}}</view>
			</view>
		</view>
		<view class="frm-balance">
			<view class="r-money">
				<view class="unit">￥</view>
        <input class="uni-input text"  v-model="rechargeMoney" @input="handleInput" type="digit" placeholder="请输入充值金额" />
			</view>
			<view class="r-check" v-for="(item, index) in arrPayment" :key="index" :data-code='item.code' @tap="handlerChangePay">
				<view class="title">
					<image :src="item.icon" mode="aspectFit" class="icon"></image>
					<view class="name">{{item.name}}</view>
				</view>
				<image :src="item.code == curPayment ? iconCheckHov : iconCheck" mode="aspectFit" class="check"></image>
			</view>
		</view>
		<view class="lnk-balance" @tap="recharge">立即充值</view>
	</view>
</template>

<script>
	import { getUserWallet,withdrawalApply } from '@/api/members.js'
  import {recharge} from "../../../api/members";
  import {initiatePay} from "../../../api/trade";
	export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				iconCheck: `${this.iconCommon}/static/v1/common/icon-check.png`,
				iconCheckHov: `${this.iconCommon}/static/v1/common/icon-check_hov.png`,
				iconWallet: `${this.iconCommon}/static/v1/wallet/icon-wallet.png`,

				objBase: {
					memberWallet: 0,
					memberFrozenWallet: 0,
				},

				arrPayment: [],		// 支付方式数组
				curPayment: '',		// 当前支付方式
        rechargeMoney:'',
        recharging:false,
			}
		},
		methods: {
      handleInput(event) {
        // 获取输入框的值
        let value = event.target.value;
        // 判断是否包含小数点
        if (value.includes('.')) {
          // 分割小数和整数部分
          const parts = value.split('.');
          // 限制小数位数
          value = parts[0] + '.' + parts[1].substr(0, 2);
        }
        // 更新输入值
        let that=this;
        setTimeout(()=>{
          that.rechargeMoney = value
        },100)
      },
			// 加载余额信息
			loadBaseData: function(){
				// 加载余额信息
				getUserWallet().then((res) => {
					if (this.$store.state.isShowToast) {
						uni.hideLoading()
					}
					if (res.data.code == 200) {
						this.objBase = res.data.result
						this.isComplete = true
					}
            	})
			},
			// 充值
			recharge(){
        if (!this.recharging){
          if (isNaN(this.rechargeMoney)||this.rechargeMoney<1){
            uni.showToast({icon:"none",title:"单次充值最少1元"})
            return;
          }
          this.recharging=true;
          let that=this;
          uni.showLoading({title:"连接充值通道..."});
          recharge({price:this.rechargeMoney}).then(res=>{
            uni.hideLoading();
            if (res.data.code==200){
              uni.showLoading({title:"正在充值..."});
              //todo 需要区分支付通道和当前客户端
              initiatePay('WECHAT','H5',{orderType:'RECHARGE',sn:res.data.result.rechargeSn,clientType:'H5'}).then(payRes=>{
                uni.hideLoading();
                if (payRes.data.code==200){
                  uni.showModal({title:"充值成功，本次充值【"+that.rechargeMoney+"元】。"})
                  this.loadBaseData();
                  this.recharging=false;
                  this.rechargeMoney="";
                }else{
                  uni.showToast({title:'充值失败，'+payRes.data.message,icon:'none'})
                  this.recharging=false;
                }
              })
            }else{
              uni.showToast({title:'充值通道连接失败：'+res.data.message,icon:'none'})
              this.recharging=false;
            }
          })
        }

			},
			// 变更支付方式
			handlerChangePay: function(e){
				let eCode = e.currentTarget.dataset.code
				this.curPayment = eCode
			},
		},
		onLoad: function(){
			// 加载余额信息
			this.loadBaseData()

			// 支付方式
			this.arrPayment.push({name: '支付宝', icon: `${this.iconCommon}/static/v1/common/icon-alipay.png`, code: 'alipay'})
			this.arrPayment.push({name: '微信', icon: `${this.iconCommon}/static/v1/common/icon-wechat.png`, code: 'wechat'})
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
