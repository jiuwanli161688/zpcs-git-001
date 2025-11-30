<template>
	<view class="container">
		<view class="box-tips" v-if="goodsInfo.authFlag=='REFUSE'">
			<view class="wrap">
				<view class="hd">
					<image class="icon" :src="iconTips" mode="aspectFit"></image>
					<view class="text">商品审核失败</view>
				</view>
				<view class="bd">
					{{goodsInfo.authMessage}}
				</view>
			</view>
		</view>
		<view class="box-name">概要信息</view>
		<view class="box-wrap">
			<!-- 商品类目 -->
			<view class="line">{{ goodsInfo.categoryName.join(" / ") }}</view>
			<!-- 商品标题 -->
			<view class="area">{{goodsInfo.goodsName}}</view>
		</view>

		<view class="box-name">产品卖点</view>
		<view class="box-wrap">
			<view class="area">{{goodsInfo.sellingPoint}}</view>
		</view>

		<view class="box-name">发货时效与运费</view>
		<view class="box-wrap">
			<!-- 运费模板 -->
			<view class="line" v-if="freightTemplate">{{ freightTemplate.name }}</view>
			<view class="line" v-if="!freightTemplate">未设置运费模板</view>
			<!-- 发货时效 -->
			<view class="line">{{ goodsInfo.deliveryTimeliness }}</view>
		</view>

<!--		<view class="box-name">自定义属性</view>
		<view class="box-wrap">
			<view class="list">
				<view class="prop">
					<view class="lab">温区</view>
					<view class="txt">单温区</view>
				</view>
				<view class="prop">
					<view class="lab">能效等级</view>
					<view class="txt">一级能效</view>
				</view>
				<view class="prop">
					<view class="lab">容量</view>
					<view class="txt">≤100L</view>
				</view>
				<view class="prop">
					<view class="lab">类型</view>
					<view class="txt">卧式冷柜</view>
				</view>
				<view class="prop">
					<view class="lab">控温方式</view>
					<view class="txt">机械控温</view>
				</view>
			</view>
		</view>-->

		<!-- 商品规格 -->
		<view class="box-name">商品规格</view>
		<view class="box-skus">
			<view class="list">
				<view class="item" v-for="item in goodsInfo.skuList">
					<view class="hd">
						<image class="icon" :src="item.thumbnail" mode="aspectFill"></image>
						<view class="info">
							<view class="r">
								<view class="lab">出厂价</view>
								<view class="txt">{{item.cost}}</view>
							</view>
							<view class="r">
								<view class="lab">销售价</view>
								<view class="txt">{{item.price}}</view>
							</view>
							<view class="r">
								<view class="lab">库存量</view>
								<view class="txt">{{ item.quantity }}</view>
							</view>
						</view>
					</view>
					<view class="bd">
						<view v-for="itm in item.specList" v-if="itm.specValue" class="tag-item">{{ itm.specValue }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品相册 -->
		<view class="box-name">商品相册</view>
		<view class="box-grid">
			<view class="list">
				<view class="item" v-for="item in goodsInfo.goodsGalleryList">
					<image class="ico" :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="box-name">商品详情</view>
		<view class="box-html">
			<u-parse
			  class="html"
			  :lazy-load="true"
			  :use-cache="true"
			  :show-with-animation="true"
			  :html="goodsInfo.mobileIntro"
			  :tag-style="htmlStyle"
			></u-parse>
		</view>


	</view>
</template>

<script>

	import {getGoodsMessage} from "../../api/goods";
  import {storeGoodsSkuInfo} from "../../api/store";

  export default{
		name: '',
		components: {

		},
		data(){
			return {
        id:"",
				isComplete: false,
				iconTips: `${this.iconCommon}/static/v1/goods/icon-tips.png`,
				iconDemo: `${this.iconCommon}/static/v1/demo/r4.jpg`,
				htmlDemo: `<p><img src="${this.iconCommon}/static/v1/demo/detail00.jpg" /></p>
				<p><img src="${this.iconCommon}/static/v1/demo/detail01.jpg" /></p>
				<p><img src="${this.iconCommon}/static/v1/demo/detail02.jpg" /></p>
				<p><img src="${this.iconCommon}/static/v1/demo/detail03.jpg" /></p>
				<p><img src="${this.iconCommon}/static/v1/demo/detail04.jpg" /></p>`,
        goodsInfo:{},
        htmlStyle: { img: 'display:block'},
        freightTemplate:{}
			}
		},
		methods: {
      loadBaseData:function () {
        let that=this;
        uni.showLoading({})
        getGoodsMessage(this.id).then(goodsRes=>{
          if (goodsRes.data.code==200){
            that.goodsInfo=goodsRes.data.result;
            this.freightTemplate=this.goodsInfo.freightTemplateVO
          }else{
            that.$u.toast(goodsRes.data.message);
          }

        })

      }
		},
		onLoad: function(options){
      this.id = options.id;
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
	.box-tips{
		padding: 20rpx 0 0;
		.wrap{
			border-radius: 12rpx;
			background: #ffe9e9;
			padding: 0 20rpx 20rpx;
			min-height: 48rpx;
			.hd{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 72rpx;
				.icon{
					width: 36rpx;
					height: 36rpx;
					margin: 4rpx 12rpx 0 0;
				}
				.text{
					color: #E22221;
					font-size: 28rpx;
					font-weight: 600;
				}
			}
			.bd{
				font-size: 26rpx;
				color: #666;
				line-height: 40rpx;
			}
		}
	}
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
		.list{
			padding: 16rpx 0;
			.prop{
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				padding: 10rpx 0;
				line-height: 28rpx;
				font-size: 28rpx;
				.lab{
					color: #666;
					position: relative;
					&::after{
						position: relative;
						content: '：';
					}
				}
				.txt{
					color: #999;
				}
			}
		}

	}
	.box-skus{
		.list{
			.item{
				background: #FFF;
				border-radius: 12rpx;
				padding: 20rpx;
				margin: 20rpx 0 0;
				&:first-of-type{
					margin: 0;
				}
				.hd{
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin: 0 0 20rpx;
					.icon{
						width: 160rpx;
						height: 160rpx;
					}
					.info{
						width: calc(100vw - 40rpx - 40rpx - 160rpx);
						box-sizing: border-box;
						padding: 0 0 0 20rpx;
						.r{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							line-height: 48rpx;
							.lab{
								color: #666;
								position: relative;
								&::after{
									position: relative;
									content: '：';
								}
							}
							.txt{
								color: #E22221;
							}
						}
					}
				}
				.bd{
					margin: -16rpx 0 0;
					display: flex;
					flex-wrap: wrap;
					.tag-item{
						border-radius: 8rpx;
						padding: 0 12rpx;
						height: 60rpx;
						line-height: 60rpx;
						text-align: center;
						font-size: 26rpx;
						background: #E22221;
						color: #FFF;
						margin: 16rpx 16rpx 0 0;
					}
				}
			}
		}
	}
	.box-html{
		background: #FFF;
		border-radius: 12rpx;
		padding: 20rpx;
		::v-deep .html{
			width: 100%;
			overflow: hidden;
		}
		::v-deep img{
		  display: block !important;
		}
	}
	.box-grid{
		background: #FFF;
		border-radius: 12rpx;
		padding: 20rpx;
		.list{
			display: flex;
			flex-wrap: wrap;
			margin: -20rpx -10rpx 0;
			.item{
				flex: 1;
				-ms-flex: 0 0 33.33%;
				flex: 0 0 33.33%;
				max-width: 33.33%;
				box-sizing: border-box;
				padding: 0 10rpx;
				margin-top: 20rpx;
				height: calc((100vw - 40rpx - 40rpx) * 0.3333 - 20rpx);
				.ico{
					width: calc((100vw - 40rpx - 40rpx) * 0.3333 - 20rpx);
					height: calc((100vw - 40rpx - 40rpx) * 0.3333 - 20rpx);
				}
			}
		}
	}
}
</style>
