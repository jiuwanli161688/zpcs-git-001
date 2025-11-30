<template>
    <view class="content">
        <view class="cen">
            <view class="cen-title">
                <view class="">预授权</view>
                <text>服务商邀请商家入驻，需获得预入驻商圈的商家同意。</text>
                <text>1.商家已注册成为中品维度app用户</text>
                <text>2.商家注册时已绑定您的服务商编号</text>
            </view>
            <view class="cen-inp">
                <input class="mobiles" v-model="form.mobile" type="text" maxlength="11" placeholder="请输入商家中品维度手机号"  />

                <view class="mobiless">
                    <input class="mobiles" style="margin-top: 20rpx;" v-model="form.code" type="text"
                    maxlength="6" placeholder="请输入验证码"  />
                    <view class="obtain" @tap="sendSMS">
                        获取验证码
                    </view>
                </view>
                
            </view>
            <view class="cen-btn" @click="goEnter">
                下一步
            </view>
        </view>
    </view>
</template>
<script>

export default {
    data(){
        return{
            mobile:'',
            code:"",
			seconds: 60, //默认验证码等待时间
            isSmsDisable: false, // 能否点击发送验证码
            btnSmsText: '获取验证码',
            form:{
                username: '', // 账号
                password: '', // 密码
                mobile: '', // 手机号
                code: '' // 验证码
            },
            codeFlag: true, //验证开关，用于是否展示验证码
            flage: false, //是否验证码验证
        }
    },
    methods:{
        // 验证码验证
        verification(val) {
            console.log(this.$refs.verification)

            this.flage = val == this.$store.state.verificationKey ? true : false
        },
        // 发送验证码
        async sendSMS() {
            console.log(this.form)
            let _this = this
            if (_this.isSmsDisable) {
                this.$u.toast('请倒计时结束后再发送!')
                return
            }
            if (!_this.form.mobile) {
                this.$u.toast('手机号不能为空!')
                return
            }
            if (!this.$u.test.mobile(_this.form.mobile)) {
                this.$u.toast('请填写正确手机号!')
                return false
            }
            if (this.btnSmsText == '重新获取') {
                if (!this.codeFlag) {
                    setTimeout(() => {
                        if (this.$refs.verification) {
                            this.$refs.verification.error() //发送
                        }
                    }, 100)
                }
            }

            if (!this.flage) {
                this.$refs.verification.error() //发送
                return false
            }
        },
        goEnter(){
            //跳转到录入商家资料
            uni.navigateTo({
                url: '/pages/service/center/addEnter' // 拼接参数
            });
            if(!flage) return; 
        }
    }
}
</script>
<style lang="scss" scoped>
$yi:100%;

.content {
	width: 100%;
	height: calc(100vh - 88rpx);
    background: #f8f8f8;
}
.cen{
    width: 100%;
    height: auto;
    padding: 0 56rpx;
}

.cen-title{
    width: 100%;
    height: auto;
    margin-bottom: 40rpx;
    view{
        font-weight: 500;
        font-size: 32rpx;
        margin-bottom: 20rpx;
    }
    text{
        display: inline-block;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
    }
}
.cen-inp{
    width: 100%;
    height: auto;
}
:deep(.uni-input){
    height: 88rpx ;
}
.mobiles{
    background-color: transparent;
    width: 100%;
    height:88rpx ;
    text-indent: 20rpx;
    line-height: 88rpx;
    font-size: 28rpx !important;
    font-weight: 400;
    color: #999999;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    background-color: white;
}
.mobiless{
    width: auto;
    height: auto;
    position: relative;
}
.obtain{
    position: absolute;
    top: 0;
    right: 20rpx;
    height: 88rpx;
    width: 160rpx;
    text-align: center;
    line-height: 88rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #FF0101;
}
.cen-btn{
    width: 100%;
    height: 86rpx;
    background-color: #FF0101;
    border-radius: 20rpx;
    margin-top: 100rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #fff;
}


</style>