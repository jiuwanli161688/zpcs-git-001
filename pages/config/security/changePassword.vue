<template>
	<view class="container">
		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">原始密码</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.password" password type="safe-password" placeholder="请输入原始密码" />
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">新的密码</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.newPassword" password type="safe-password" placeholder="请输入新的密码" />
				</view>
			</view>
			<view class="rs">
				<view class="lab">确认密码</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.rePassword" password type="safe-password" placeholder="请再次确认密码" />
				</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="submit">提交</view>

	</view>
</template>

<script>
import {
  md5
} from "@/utils/md5.js";
import {modifyPass} from "../../../api/login";

	export default{
		name: '',
		components: {

		},
		data(){
			return {
        submitting:false,
				isComplete: false,
        form:{

        }
			}
		},
		methods: {
      submit:function (){
        if (!this.submitting){
          if (this.form.newPassword!=this.form.rePassword){
            uni.showToast({title:"新密码和确认密码不相同，请检查",icon:"none"})
            return;
          }
          if (this.form.newPassword==this.form.password){
            uni.showToast({title:"新密码和旧密码不能相同",icon:"none"})
            return;
          }
          //格式校验
          if (!this.$u.test.password(this.form.newPassword)){
            uni.showToast({title:"密码为8~20位数字和字母组合!",icon:"none"})
            return;
          }
          this.submitting=true;
          uni.showLoading({title:"正在处理"})
          modifyPass({password:md5(this.form.password),newPassword:md5(this.form.newPassword)}).then(res=>{
            this.submitting=false;
            uni.hideLoading();
            if (res.data.code==200){
              uni.showToast({title:"密码修改成功",icon:"none"})
            }else{
              uni.showToast({title:"修改失败，"+res.data.message,icon:"none"})
            }
          })
        }

      }

		},
		onLoad: function(){

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
