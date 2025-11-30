<template>
	<view class="container">
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无结算信息记录" />
		</view>
		<view class="box-list" v-if="isComplete && arrData.length > 0">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<settlement-item-supplier :settlement="item" :index="index" @detail="handlerDetail(item.id)" />
			</view>
		</view>
	</view>
</template>

<script>
	import EmptyBox from "@/components/Hina/EmptyBox";
	import SettlementItemSupplier from "@/components/Hina/SettlementItemSupplier";
  import {getStoreSettlementInfo} from "../../api/store";

	export default{
		name: '',
		components: {
			EmptyBox,
			SettlementItemSupplier
		},
		data(){
			return {
				isComplete: false,

				arrData: [],
				intPageCode: 1,						// 当前页面
				intResTotal: 0,						// 记录总数
			}
		},
		methods: {
			// 加载结算信息
			loadBaseData: function(){
        let that=this;
				this.isComplete = true
				let params = { pageNumber: this.intPageCode}
        uni.showLoading({})
        getStoreSettlementInfo(params).then(res=>{
          uni.hideLoading();
          if (res.data.code==200){
            res.data.result.records.forEach(item=>{
              this.arrData.push({
                id: item.id, code: item.settlementNumber, status: item.settlementStatus, statusText: '',
                origin: item.settlementTotalAmount, fact: item.settlementActualPayment, integral: item.settlementTotalPoints, postage: item.transportationTotalAmount, money: item.finalTotalAmount
              })
            })
            that.intResTotal=res.data.total;
            this.arrData.forEach(o => {
              if(o.status == 1){
                // 平台审核账单 - 待审核
                o.statusText = '平台审核账单 - 待审核'
              } else if(o.status == 2){
                // 平台审核账单 - 未通过
                o.statusText = '平台审核账单 - 未通过'
              }else if(o.status == 3){
                // 等待提交发票
                o.statusText = '等待提交发票'
              }else if(o.status == 4){
                // 平台核验发票 - 待审核
                o.statusText = '平台核验发票 - 待审核'
              }else if(o.status == 5){
                // 平台核验发票 - 未通过
                o.statusText = '平台核验发票 - 未通过'
              }else{
                // 平台完成分账
                o.statusText = '平台完成分账'
              }
            })
          }else{
            that.$u.toast(res.data.message);
          }
        })
			},

			// 跳转结算详情
			handlerDetail: function(id){
				uni.navigateTo({
					url: `/pages/supplierCenter/settlementDetail?id=${id}`
				})
			},
		},
		onLoad: function(){
			// 加载结算信息
			this.loadBaseData()
		},
		onShow: function(){

		},
		onReachBottom: function(){
			if(this.intResTotal > this.arrData.length){
				this.intPageCode++
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
	padding: 0 0 20rpx;
	.box-list{
		padding: 20rpx 20rpx 0;
		.item{
			position: relative;
			margin: 20rpx 0 0;
			&:first-of-type{
				margin: 0;
			}
		}
	}
}
</style>
