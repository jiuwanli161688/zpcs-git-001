<template>
	<view class="container">
		<view class="wrap">
			<view class="null" v-if="isComplete && arrData.length == 0">
				<empty-box text="您目前没有设置发票模板" />
			</view>
			<view class="list">
				<view class="item" @tap="selectItem(item.id,item.name)" v-for="(item, index) in arrData" :key="index">
					<view class="hd">
						<view class="flag">{{item.flag ? '企业' : '个人'}}</view>
						<view class="name">{{item.name}}</view>
					</view>
					<view class="bd">
						<view class="line">
							<view class="lab">发票抬头</view>
							<view class="inf">{{item.name}}</view>
						</view>
						<view class="line">
							<view class="lab">电子信箱</view>
							<view class="inf">{{item.mail}}</view>
						</view>
					</view>
					<view class="ft">
						<view class="link-item" v-if="mode!='select'" @tap="toEdit(item.id)">编辑</view>
						<view class="link-item link-primary" v-if="mode!='select'" @tap="delTemplate(item.id)">删除</view>
					</view>
				</view>
			</view>

			<view class="lnk-common lnk-primary" v-if="mode!='select'" @tap="toAdd">新增发票模板</view>
		</view>
	</view>
</template>

<script>

	import EmptyBox from '@/components/Hina/EmptyBox'
  import {delInvoiceTemplate, invoiceTemplate} from "../../../api/invoice";

	export default{
		name: '',
		components: {
			EmptyBox
		},
		data(){
			return {
				isComplete: false,
        mode : '',
				arrData: [],
			}
		},
		methods: {
			// 加载发票模板
			loadBaseData: function(){
				this.isComplete = true
        uni.showLoading({title:"正在加载发票模板"})
        invoiceTemplate().then(res=>{
          uni.hideLoading();
          if (res.data.code==200){
            res.data.result.forEach(item=>{
              this.arrData.push({
                flag: item.headerType=='ENTERPRISE',
                name: item.titleName,
                mail: item.mailbox,
                id: item.id
              })
            })
          }else{
            this.$u.toast(res.data.message);
          }
        })
			},
      toAdd:function () {
        uni.navigateTo({
          url: "/pages/config/invoice/insert",
        });
      },
      selectItem(id,name){
        if (this.mode=='select'){
          let pages = getCurrentPages() // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
          let prevPage = pages[pages.length - 2] //上一页页面实例
          uni.navigateBack({
            delta:1,
            success:() => {
              prevPage.$vm.pickInvoiceTemplate({id:id,name:name}) // 给上一页绑定方法otherFun,传参地址id
            }
          })
        }
      },
      toEdit:function (id) {
        uni.navigateTo({
          url: "/pages/config/invoice/update?id="+id,
        });
      },
      delTemplate:function (id) {
        let that=this;
        uni.showModal({
          title:"谨慎确认",
          content:"确认删除吗",
          success(res){
            if (res.confirm){
              uni.showLoading({title:"正在删除"})
              delInvoiceTemplate({id:id}).then(delRes=>{
                uni.hideLoading();
                if (delRes.data.code==200){
                  that.$u.toast("删除成功")
                  that.arrData=[];
                  that.loadBaseData();
                }else{
                  that.$u.toast(delRes.data.message)

                }
              })
            }
          }
        })
      }
		},
		onLoad: function(options){
      this.mode = options.mode;
		},
		onShow: function(){
      this.arrData=[];
      // 加载发票模板
      this.loadBaseData()
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;
	.wrap{
		padding: 20rpx;
		.null{

		}
		.list{
			.item{
				background: #FFF;
				border-radius: 8rpx;
				margin: 0 0 20rpx;
				padding: 0 20rpx;
				&:last-of-type{
					margin: 0;
				}
				.ft{
					display: flex;
					justify-content: flex-end;
					align-items: center;
					height: 96rpx;
					.link-item{
						border: 3rpx solid #DCDEE0;
						padding: 0 16rpx;
						height: 64rpx;
						box-sizing: border-box;
						border-radius: 12rpx;
						line-height: 58rpx;
						font-size: 28rpx;
						color: #323232;
						text-align: center;
						margin: 0 0 0 16rpx;
					}
					.link-primary{
						border: 3rpx solid #EE0A24;
						color: #EE0A24;
					}
				}
				.hd{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					height: 80rpx;
					position: relative;
					&::after{ position: absolute; content: ''; left: 0; right: 0; height: 3rpx; background: #EBEDF0; bottom: 0;}
					.flag{
						font-size: 24rpx;
						color: #FFF;
						background: #FF6C00;
						padding: 0 8rpx;
						margin: 0 16rpx 0 0;
						border-radius: 8rpx;
					}
					.name{
						color: #333;
						font-weight: 600;
						font-size: 28rpx;
					}
				}
				.bd{
					padding: 16rpx 0;
					position: relative;
					&::after{ position: absolute; content: ''; left: 0; right: 0; height: 3rpx; background: #EBEDF0; bottom: 0;}
					.line{
						display: flex;
						justify-content: flex-start;
						align-items: center;
						line-height: 48rpx;
						.lab{
							color: #999;
							min-width: 140rpx;
							font-size: 26rpx;
							position: relative;
							&::after{
								position: relative;
								content: '：';
							}
						}
						.inf{
							font-size: 26rpx;
							color: #333;
							font-weight: 400;
						}
					}
				}
			}
		}
	}
}
</style>
