<template>
	<view class="container">
		<view class="frm-comm">
			<!-- 注意：如果初始未设置登录账号，不显示原登录账号 -->
			<view class="rs rs-line">
				<view class="lab">原登录账号</view>
				<view class="txt txt-r">dbwin2k</view>
			</view>
			<view class="rs">
				<view class="lab">输入新账号</view>
				<view class="txt flex">
					<input class="s-text" type="text" placeholder="请输入" />
				</view>
			</view>
		</view>

		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">手机号</view>
				<view class="txt txt-r">13623851992</view>
			</view>
			<view class="rs">
				<view class="lab">验证码</view>
				<view class="txt flex">
					<input class="s-code" type="text" placeholder="请输入" />
					<view class="s-link" @tap="sendSMS">{{btnSmsText}}</view>
				</view>
			</view>
		</view>
		<view class="lnk-common lnk-primary">提交</view>

	</view>
</template>

<script>


	export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,

				objData: {
					mobile: '',
					code: '',
				},

				smsSecond: 59,
				isSmsDisable: false,			// 能否点击发送验证码
				btnSmsText: '获取验证码',
			}
		},
		methods: {
			// 发送验证码
			sendSMS: function(){
				let _this = this
				if(_this.isSmsDisable){
					return
				}


				_this.btnSmsText = '60s后获取'
				_this.isSmsDisable = true
				let s = _this.smsSecond
				let counter = setInterval(()=>{
					_this.btnSmsText = `${s}s后获取`
					if(s == 0){
						_this.btnSmsText = '获取验证码'
						_this.isSmsDisable = false
						clearInterval(counter)
					}else{
						s--
					}
				},1000)


			},
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
