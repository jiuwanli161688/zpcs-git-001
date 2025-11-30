<template>
	<view class="container">
		<view class="tab-comm">
			<view class="item" :class="{ 'item-hov': curTab == index }" v-for="(item, index) in arrTab" :key="index"
				:data-index="index" @tap="handlerChange">
				<view class="text">{{ item.name }}</view>
			</view>
		</view>
		<view class="box-null" v-if="isComplete && arrData.length == 0">
			<empty-box text="暂无资金流水" />
		</view>
		<view class="box-list">
			<view class="item" v-for="(item, index) in arrData" :key="index">
				<rec-number :rec="item" />
			</view>
		</view>
	</view>
</template>

<script>
	
	import EmptyBox from "@/components/Hina/EmptyBox";
	import RecNumber from "@/components/Hina/RecNumber";
  import {getStoreWallet} from "@/api/distributor";
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
				arrTab: [
          { code: 0, name: '全部' , operateType: ""},
          { code: 1, name: '收入' , operateType: "INCOME"},
          { code: 2, name: '支出' , operateType: "OUTLAY"}
				],
				curTab: 0,
				
				arrData: [],
				intPageCode: 1,						// 当前页面
				intResTotal: 0,						// 记录总数
        params: {
          operateType: "",
          pageNumber: 1,
          pageSize: 15
        }
			}
		},
		methods: {
			// 加载流水信息
			loadBaseData: function(){
        getStoreWallet(this.params).then((res) => {
          if (res.data.success) {
            this.isComplete = true
            this.intResTotal = res.data.result.total
            if (res.data.result.records.length != 0) {
              this.arrData.push(...res.data.result.records)
              this.arrData.forEach(item => {
                item.serviceTypeText=handleServiceType(item.serviceType)
              });
            }
          }
        })
			},
			
			// 切换查询类型
			handlerChange: function(e){
				let eIndex = e.currentTarget.dataset.index
				this.curTab = eIndex
				this.arrData.splice(0, this.arrData.length)
        this.params.operateType=this.arrTab[eIndex].operateType;
        this.params.pageNumber=1;
				this.loadBaseData()
			}
		},
		onLoad: function(){
			// 加载流水信息
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
	.tab-comm {
		position: sticky;
		left: 0;
		right: 0;
		top: 0;
		background: #FFF;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 999;
		&::before{
			position: absolute;
			content: '';
			left: 0;
			bottom: 0;
			right: 0;
			height: 3rpx;
			background: rgba(0, 0, 0, 0.06);
		}
		.item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			.text{
				font-size: 28rpx;
				line-height: 88rpx;
				color: #969799;
			}
		}
		.item-hov{
			.text{
				color: #323233;
				font-weight: 600;
				position: relative;
				&::after{
					position: absolute;
					content: '';
					left: 0;
					bottom: 0;
					right: 0;
					height: 6rpx;
					background: #EE0A24;
					border-radius: 6rpx;
				}
			}
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