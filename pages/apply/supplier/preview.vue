<template>
	<view class="container">
		<view class="frm-view">
			<view class="frm-title">企业信息</view>
			<view class="rs">
				<view class="lab">企业名称</view>
				<view class="txt">{{ objData.storeName }}</view>
			</view>
			<view class="rs">
				<view class="lab">统一社会信用代码</view>
				<view class="txt">{{ objData.licenseNum }}</view>
			</view>
			<view class="rs">
				<view class="lab">经营地址</view>
				<view class="txt">{{ objData.storeAddressDetail }}</view>
			</view>
			<view class="rs">
				<view class="lab">法人姓名</view>
				<view class="txt">{{ objData.legalName+' / '+ objData.legalPhone }}</view>
			</view>
			<view class="rs">
				<view class="lab">企业联系人</view>
				<view class="txt">{{ objData.linkName+' / '+ objData.linkPhone }}</view>
			</view>
		</view>

		<view class="frm-view">
			<view class="frm-title">证件上传</view>
			<view class="min-title">营业执照</view>
			<view class="min-photo">
				<view class="col-company">
					<view class="file">
						<image class="icon" :src="objData.licencePhoto" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
			<view class="min-title">法人证件</view>
			<view class="min-photo">
				<view class="col-person">
					<view class="file">
						<image class="icon" :src="objData.legalPhoto" mode="scaleToFill"></image>
					</view>
				</view>
				<view class="col-person">
					<view class="file">
						<image class="icon" :src="objData.legalPhotoBack" mode="scaleToFill"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="frm-view">
			<view class="frm-title">经营类目</view>
      <view v-for="(item,index) in objData.storeCategoryApplyVOList">
        <view class="rs">
          <view class="lab">类目{{index+1}}</view>
          <view class="txt">{{item.categoryName}}</view>
        </view>
        <view v-for="(itm,idx) in item.storeCategoryCompetencyApplyVOS">
          <view class="min-title">{{ itm.categoryCompetencyName }}</view>
          <view class="min-photo">
            <view class="col-company">
              <view class="file">
                <image class="icon" :src="itm.fileUrl" mode="scaleToFill"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
		</view>
		<view class="lnk-common lnk-primary" @tap="handlerNext">下一步</view>
		<view class="lnk-common lnk-secondary" @tap="handlerPrev">返回修改</view>
	</view>
</template>

<script>

	import {applySupplierEcho} from "../../../api/store";

  export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				iconDemoCompany: `${this.iconCommon}/static/v1/demo/yingyezhizhao.jpg`,
				iconDemoPerson1: `${this.iconCommon}/static/v1/demo/shenfenzheng.jpg`,
				iconDemoPerson2: `${this.iconCommon}/static/v1/demo/shenfenzheng.jpg`,
        objData:{
          storeName:"",
          chopPhoto:"",
          goodsManagementCategory:"",
          legalId:"",
          legalName:"",
          legalPhone:"",
          legalPhoto:"",
          legalPhotoBack:"",
          licencePhoto:"",
          licenseNum:"",
          linkName:"",
          linkPhone:"",
          signNamePhoto:"",
          storeAddressDetail:"",
          storeAddressIdPath:"",
          storeCategoryApplyVOList:[]
        }
			}
		},
		methods: {
			// 跳转法人授权
			handlerNext: function(){
				uni.navigateTo({
					url: '/pages/apply/supplier/confirm'
				})
			},

			// 跳转返回编辑
			handlerPrev: function(){
				uni.navigateBack({
					delta: 1
				})
			},
		},
		onLoad: function(){
      uni.showLoading();
      applySupplierEcho().then(res=>{
        uni.hideLoading();
        if (res.data.code==200){
          this.objData=res.data.result;
        }else{
          this.$u.toast(res.data.message);
        }
      })
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
	padding: 20rpx;
}
</style>
