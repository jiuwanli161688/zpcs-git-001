<template>
	<view class="container">
		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">快递公司</view>
				<view class="txt flex">
					<picker mode="selector" @change="bindPickerCompany" :value="curCompanyIndex" :range="arrCompany" range-key="label">
					  <view class="in-picker" :class="{'in-picker_place': objExpress.logisticsId.length == 0 }">{{ objExpress.logisticsId.length == 0 ? '请选择快递公司' : curCompanyLabel }}</view>
					</picker>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">快递单号</view>
				<view class="txt flex">
					<input class="s-text" type="text" v-model="objExpress.reissueLogisticsNo" placeholder="请输入快递单号" />
				</view>
			</view>
			<view class="rs">
				<view class="lab">手机尾号</view>
				<view class="txt flex">
					<input class="s-text" type="text"  maxlength="4" v-model="objExpress.contactPhone" placeholder="请输入收件人/寄件人手机尾号或隐私号" />
				</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="submit">提交</view>
	</view>
</template>

<script>
  import {storeAfterSaleReissue, storeLogistics,getLastDeliveryPhone} from "../../api/store";
	export default{
		name: '',
		components: {

		},
		data(){
			return {
        sn:"",
				isComplete: false,
				arrCompany: [],
				curCompanyIndex: null,
				curCompanyLabel: null,

				objExpress: {
          logisticsId: '',			// 快递公司
          reissueLogisticsNo: ''			// 快递单号
				},
        submitting:false,
			}
		},
		methods: {
			// 选择快递公司
			bindPickerCompany: function (e) {
				this.curCompanyIndex = e.detail.value
				this.curCompanyLabel = this.arrCompany[e.detail.value].label
			  this.objExpress.logisticsId = this.arrCompany[e.detail.value].value
			},

			// 加载快递公司
			loadBaseData: function(){
        storeLogistics().then(res=>{
          if (res.data.code==200){
            res.data.result.forEach(item=>{
              this.arrCompany.push({label: item.name, value: item.logisticsId})
            })
          }else{
            this.$u.toast(res.data.message);
          }
        })
			},
      submit:function () {
        let that=this;
        if (!this.submitting){
          if (!this.objExpress.logisticsId){
            this.$u.toast("请选择快递公司")
            return;
          }
          if (!this.objExpress.reissueLogisticsNo){
            this.$u.toast("请输入快递单号")
            return;
          }
		  if (!this.objExpress.contactPhone) {
			this.$u.toast("请输入收件人/寄件人手机尾号或隐私号");
			return;
		}
		// 验证手机尾号必须是四位数字
		if (!/^\d{4}$/.test(this.objExpress.contactPhone)) {
			this.$u.toast("手机尾号必须是四位数字");
			return;
		}
          this.submitting=true;
          uni.showLoading({})
          storeAfterSaleReissue(this.sn,this.objExpress).then(res=>{
            that.submitting=false;
            uni.hideLoading();
            if (res.data.code==200){
              that.$u.toast("补发成功");
              setTimeout(()=>{
                uni.navigateBack();
              },1000)
            }else{
              that.$u.toast(res.data.message);
            }
          })
        }


      },
	   // 加载上次填写的寄件人手机号
		loadLastContactPhone: function () {
			getLastDeliveryPhone().then(res => {
				if (res.data.code == 200) {
					this.objExpress.contactPhone = res.data.result?res.data.result:''
				}
			})
		}
		},
		onLoad: function(options){
      this.sn=options.sn;
			this.objExpress.contactPhone = options.contactPhone;
			// 加载快递公司
			this.loadBaseData()
			// 加载上次填写的寄件人手机号
			// this.loadLastContactPhone()
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
	.lab{
		width: 200rpx;
	}
	.txt{
		width: calc(100vw - 99px - 22px - 22px - 24rpx);
	}
}
</style>
