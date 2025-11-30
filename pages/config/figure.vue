<template>
	<view class="container">
		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">身高</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.height" type="digit" placeholder="请输入身高" />
					<view class="s-unit">cm</view>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">体重</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.weight" type="digit" placeholder="请输入体重" />
					<view class="s-unit">kg</view>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">胸围</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.chest" type="digit" placeholder="请输入胸围" />
					<view class="s-unit">cm</view>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">腰围</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.waist" type="digit" placeholder="请输入腰围" />
					<view class="s-unit">cm</view>
				</view>
			</view>
			<view class="rs">
				<view class="lab">臀围</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.hip" type="digit" placeholder="请输入臀围" />
					<view class="s-unit">cm</view>
				</view>
			</view>
		</view>

		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">臂长</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.arm" type="digit" placeholder="请输入臂长" />
					<view class="s-unit">cm</view>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">肩宽</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.shoulder" type="digit" placeholder="请输入肩宽" />
					<view class="s-unit">cm</view>
				</view>
			</view>
			<view class="rs">
				<view class="lab">腿长</view>
				<view class="txt flex">
					<input class="s-nums" v-model="form.leg" type="digit" placeholder="请输入腿长" />
					<view class="s-unit">cm</view>
				</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="handlerSave">提交</view>

	</view>
</template>

<script>
	import { saveUserFigure,getMemberFigure } from "@/api/members.js";
	export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				form:{
					height:'',
					weight:'',
					waist:'',
					chest:'',
					hip:'',
					arm:'',
					shoulder:'',
					leg:''
				},
				isCanSubmit:true,//默认可点击
			}
		},
		methods: {
			// 加载初始数据
			loadBaseData: function () {
            uni.showLoading()
            getMemberFigure().then((res) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.code == 200) {
                    this.isComplete = true
                    this.form = res.data.result;
                }
            })
        },
			handlerSave: function () {
				if(!this.isCanSubmit)return
				this.isCanSubmit = false
				saveUserFigure(this.form).then((res) => {
					if (res.data.success) {
						this.$u.toast('保存成功')
						uni.navigateBack()
					}
					this.isCanSubmit=true
				})
        },
		},
		onLoad: function(){
		},
		onShow: function(){
			this.loadBaseData()
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