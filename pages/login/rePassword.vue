<template>
  <view class="container">
    <view class="frm-comm">
      <view class="rs rs-line">
        <view class="lab">您的账号</view>
        <view class="txt txt-r">{{ username }}</view>
      </view>
      <view class="rs rs-line">
        <view class="lab">绑定手机</view>
        <view class="txt txt-r">{{ mobile }}</view>
      </view>
      <view class="rs rs-line">
        <view class="lab">新的密码</view>
        <view class="txt flex">
          <input class="s-text" v-model="objData.password" password type="safe-password" placeholder="请输入新的密码"/>
        </view>
      </view>
      <view class="rs">
        <view class="lab">确认密码</view>
        <view class="txt flex">
          <input class="s-text" v-model="objData.rePassword" password type="safe-password" placeholder="请再次确认密码"/>
        </view>
      </view>
    </view>

    <view class="lnk-common lnk-primary" @tap="submit">提交</view>

  </view>
</template>

<script>

import {md5} from "../../utils/md5";
import {getUserNameByMobile, memberRePassword} from "../../api/members";

export default {
  name: '',
  components: {},
  data() {
    return {
      isComplete: false,
      objData: {
        password: "",
        rePassword:""
      },
      mobile: "",
      username:"",
      submitting:false,
    }
  },
  methods: {
    submit:function (){
      if (!this.submitting){
        if (this.objData.password!=this.objData.rePassword){
          uni.showToast({title:"新密码和确认密码不相同，请检查",icon:"none"})
          return;
        }
        //格式校验
        if (!this.$u.test.password(this.objData.password)){
          uni.showToast({title:"密码为8~20位数字和字母组合!",icon:"none"})
          return;
        }
        this.submitting=true;
        uni.showLoading({title:"正在处理"})
        memberRePassword({password:md5(this.objData.password)}).then(res=>{
          uni.hideLoading();
          if (res.data.code==200){
            uni.showToast({title:"密码重置成功",icon:"none"})
            setTimeout(()=>{
              uni.navigateBack();
            },1000)
          }else{
            this.submitting=false;
            uni.showToast({title:"重置失败，"+res.data.message,icon:"none"})
          }
        })
      }

    }
  },
  onLoad: function (options) {
    this.mobile=options.mobile;
    uni.showLoading();
    let that=this;
    getUserNameByMobile({mobile:this.mobile}).then(res=>{
      if (res.data.code==200){
        that.username=res.data.result;
      }else{
        that.$u.toast(res.data.message);
      }
    })
  },
  onShow: function () {

  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #F1F1F1;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20 rpx;
}
</style>
