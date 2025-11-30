<template>
	<view class="container">
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无邀请厂商" />
		</view>
		<view class="box-list" v-if="isComplete && arrData.length > 0">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<invite-store-item :inviteStore="item" :index="index" />
			</view>
		</view>
	</view>
</template>

<script>
	import EmptyBox from "@/components/Hina/EmptyBox";
	import InviteStoreItem from "@/components/Hina/InviteStoreItem";
	import {getInviteStoreList} from "@/api/dealerCenter";
	export default{
		name: '',
		components: {
			EmptyBox,
			InviteStoreItem
		},
		data(){
			return {
				isComplete: false,
				arrData: [],
				intPageCode: 1,						// 当前页面
				intResTotal: 0,						// 记录总数
				params: {
					pageNumber: 1,
					pageSize: 10
				},
			}
		},
		methods: {
			// 加载邀请厂商列表
			loadBaseData: function(){
				this.isComplete = true
				uni.showLoading({})
				getInviteStoreList(this.params).then(res=>{
					uni.hideLoading();
					if (res.data.code==200){
						res.data.result.records.forEach(item=>{
							this.arrData.push({
								storeNumber: item.storeNumber, storeName: item.storeName, createTime: item.createTime,linkPhone: item.linkPhone
							})
						})
						this.intResTotal=res.data.result.total;
					}
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