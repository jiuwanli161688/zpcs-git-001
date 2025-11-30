<template>
	<view class="container">
		<view class="box-name">概要信息</view>
		<view class="box-wrap">
			<!-- 商品类目 -->
			<view class="line">{{goodsInfo.categoryName.join(" / ")}}</view>
			<!-- 商品标题 -->
			<view class="area">{{goodsInfo.goodsName}}</view>
		</view>
		<view class="box-name">编辑库存</view>
		<view class="frm-comm" v-for="item in skuList">
			<view class="ag rs-line">
				<view class="ag-item">{{ item.goodsName }}</view>
				<view class="ag-item">{{ item.simpleSpecs }}</view>
			</view>
			<view class="rs">
				<view class="lab">库存量</view>
				<view class="txt flex">
					<input class="s-text" v-model="item.quantity" type="digit" placeholder="请输入库存" />
				</view>
			</view>
		</view>
		<view class="lnk-common lnk-primary" @tap="submit">保存</view>
	</view>
</template>

<script>

import {storeGoodsSkuInfo, storeGoodsUpdateStock} from "../../api/store";
import {getGoodsMessage} from "../../api/goods";

  export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
        id:"",
        skuList:[],
        submitting:false,
        goodsInfo:{}
			}
		},
		methods: {

      submit:function () {
        let that=this;
        if (!this.submitting){
          let updateStockList=[];
          let valid=true;
          this.skuList.forEach(item=>{
            if (isNaN(item.quantity)||item.quantity<0||item.quantity.toString().includes(".")){
              valid=false;
            }
            updateStockList.push({
              goodsId:item.goodsId,
              skuId:item.id,
              quantity:item.quantity
            })
          })
          if (!valid){
            this.$u.toast("库存必须是大于等于0的正整数")
            return;
          }
          uni.showLoading({});
          storeGoodsUpdateStock(updateStockList).then(res=>{
            uni.hideLoading();
            that.submitting=false;
            if (res.data.code==200){
              that.$u.toast("保存成功")
            }else{
              that.$u.toast(res.data.message);
            }
          })
        }

      },
      loadBaseData:function () {
        let that=this;
        uni.showLoading({})
        getGoodsMessage(this.id).then(goodsRes=>{
          if (goodsRes.data.code==200){
            that.goodsInfo=goodsRes.data.result;
            storeGoodsSkuInfo(this.id).then(res=>{
              uni.hideLoading()
              if (res.data.code==200){
                that.skuList = res.data.result;
              }else{
                that.$u.toast(res.data.message);
              }
            })
          }else{
            that.$u.toast(goodsRes.data.message);
          }

        })

      }
		},
		onLoad: function(options){
      this.id=options.id;
      this.loadBaseData();
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
	padding: 0 20rpx 20rpx;
	.box-name{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
		color: #333;
		font-weight: 600;
		height: 96rpx;
		line-height: 96rpx;
		padding: 0 0 0 20rpx;
		position: relative;
		&::after{ position: absolute; content: ''; left: 0; top: 50%; transform: translateY(-50%); width: 6rpx; height: 40rpx; border-radius: 6rpx; background: #E22221;}
	}
	.box-wrap{
		background: #FFF;
		border-radius: 12rpx;
		padding: 0 20rpx;
		.line{
			line-height: 88rpx;
			font-size: 28rpx;
			position: relative;
			color: #333;
			&::after{ position: absolute; content: ''; left: 0; right: 0; height: 3rpx; background: #EBEDF0; bottom: 0;}
			&:last-of-type{
				&::after{
					display: none;
				}
			}
		}
		.area{
			padding: 20rpx 0;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #333;
		}
	}
}
</style>
