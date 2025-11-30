<template>
	<view class="container">
		<empty-box v-if="isComplete && arrData.length == 0" text="尚未添加帮助信息" />
		<view class="list" v-if="isComplete && arrData.length > 0">
			<view class="item" v-for="(item, index) in arrData" :key="index" :data-code="item.code" @tap="handlerDetail">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	import EmptyBox from "@/components/Hina/EmptyBox";
  import {getArticlePageByCategory} from "../../api/article";

	export default{
		name: '',
		components: {
			EmptyBox
		},
		data(){
			return {
				isComplete: false,
				curCategoryId: 0,
				arrData: [],
				intPageCode: 1,						// 当前页面
				intResTotal: 0,						// 记录总数
			}
		},
		methods: {
			// 加载列表
			loadBaseData: function(){
				let params = { pageNo: this.intPageCode, pageSize: 20, categoryId: this.curCategoryId}
				this.isComplete = true
        getArticlePageByCategory(params).then(res=>{
          if (res.data.code==200){
            res.data.result.records.forEach(item=>{
              this.arrData.push({code: item.id, name: item.title})
            })
          }else{
            uni.showToast({title:"文章加载失败",icon:"none"})
          }
        })
			},
			// 跳转详情
			handlerDetail: function(e){
				let eCode = e.currentTarget.dataset.code
				uni.navigateTo({
					url: `/pages/help/detail?code=${eCode}`
				})
			}
		},
		onLoad: function(option){
			this.curCategoryId = option.category
			// 加载列表
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
.list{
	background: #FFF;
	padding: 0 24rpx;
	.item{
		position: relative;
		color: #000;
		font-size: 28rpx;
		width: calc(100vw- 48rpx);
		height: 88rpx;
		line-height: 88rpx;
		box-sizing: border-box;
		padding: 0 60rpx 0 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		&::after{
			position: absolute;
			content: '';
			background: #f4f4f4;
			height: 3rpx;
			left: 0;
			right: 0;
			bottom: 0;
		}
		&::before{
			position: absolute;
			content: '';
			width: 12rpx;
			height: 12rpx;
			border: 4rpx solid #d6d6d6;
			border-left: none;
			border-bottom: none;
			right: 20rpx;
			top: 50%;
			transform: rotate(45deg) translateY(-50%);
		}
		&:last-of-type{
			&::after{
				display: none;
			}
		}
	}
}
</style>
