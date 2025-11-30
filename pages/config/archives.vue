<template>
	<view class="container">

		<view class="avatar">
			<image class="icon" :src="face" mode="aspectFill" @tap="handlerAvatar"></image>
			<view class="text">点击头像修改</view>
		</view>

		<view class="frm-comm">
			<view class="rs rs-line">
				<view class="lab">昵称</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.nickName" type="text" placeholder="请输入昵称" />
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">性别</view>
				<view class="txt flex">
					<picker mode="selector" @change="bindPickerGender" :value="curGender" :range="arrGender"
						range-key="label">
						<view class="in-picker" :class="{ 'in-picker_place': form.sex < 0 }">{{ form.sex < 0 ? '请选择' :
							form.sex == 1 ? '男' : '女' }}</view>
					</picker>
				</view>
			</view>
			<view class="rs rs-line">
				<view class="lab">生日</view>
				<view class="txt flex">
					<picker mode="date" :value="form.birthday" :start="sData" :end="eData" @change="bindPickerBirth">
						<view class="in-picker" :class="{ 'in-picker_place': !form.birthday }">{{ !form.birthday ? '请选择'
							: form.birthday }}</view>
					</picker>
				</view>
			</view>
			<view class="rs rs-line rs-auto">
				<view class="lab lab-require">省市区</view>
				<view class="txt flex">
					<view class="s-text region-input" @tap="showPicker" :class="{ 'placeholder': !form.regionPath }">
						{{ form.regionPath || '请选择所在省市区' }}
					</view>
				</view>
			</view>

			<view class="rs rs-line">
				<view class="lab">个人介绍</view>
				<view class="txt flex">
					<input class="s-text" v-model="form.intro" type="text" placeholder="一句话描述下自己吧~" />
				</view>
			</view>

		</view>

		<view class="frm-tags">
			<view class="title">选择兴趣爱好</view>
			<view class="paper">
				<view class="tag-item" :class="{ 'tag-item_hov': form.categoryIds.includes(item.id) }"
					v-for="(item, index) in arrTags" @tap="handlerSelectTag" :data-code="item.id" :key="index">
					{{ item.name }}</view>
			</view>
		</view>

		<view class="lnk-common lnk-primary" @tap="submit">提交</view>
		<m-city :provinceData="list" headTitle="区域选择" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="3">
		</m-city>
		<!-- #ifdef APP-PLUS -->
		<yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
		<yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
		<!-- #endif -->
	</view>
</template>

<script>
import { preferenceList } from '@/api/members.js'
import storage from "@/utils/storage.js";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { upload } from "@/api/common.js";
import { saveUserInfo } from "../../api/members";
import { getFirstCategory } from "../../api/goods";
import city from '@/components/m-city/m-city.vue'
export default {
	name: '',
	components: {
		'm-city': city,
		ykAuthpup
	},
	computed: {
		sData: function () {
			return this.getDate('s');
		},
		eData: function () {
			return this.getDate('e');
		}
	},
	data() {
		return {
			submitting: false,
			isComplete: false,

			arrGender: [
				{ label: '男', value: 1 },
				{ label: '女', value: 0 }
			],
			curGender: null,

			arrTags: [],
			// 表单回显
			form: {
				nickName: storage.getUserInfo().nickName || "",
				birthday: storage.getUserInfo().birthday || "",
				face: '',
				sex: storage.getUserInfo().sex, //性别
				regionPath: '',
				regionld: '',
			},
			face: '',
			list: [
				{
					id: '',
					localName: '请选择',
					children: []
				}
			],
			adCodeData: [],  //省市区信息
		}
	},
	methods: {
		submit: function () {
			if (!this.submitting) {
				this.submitting = true;
				uni.showLoading({ title: "正在保存" });
				saveUserInfo(this.form).then(res => {
					uni.hideLoading();
					this.submitting = false;
					if (res.data.code == 200) {
						storage.setUserInfo(this.form);
						uni.showToast({ title: "保存成功", icon: "none" })
					} else {
						uni.showToast({ title: "保存失败，" + res.data.message, icon: "none" })
					}
				})
			}
		},
		// 上传头像
		handlerAvatar: function () {
			// #ifdef APP-PLUS
			if (plus.os.name == 'Android') {
				this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
			}
			// #endif
			let _this = this
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], 					// 从相册选择
				success: (res) => {
					const tempFilePaths = res.tempFilePaths;
					// 调用文件上传接口
					uni.uploadFile({
						url: upload,
						filePath: tempFilePaths[0],
						name: "file",
						header: {
							accessToken: storage.getAccessToken(),
						},
						success: (uploadFileRes) => {
							let data = JSON.parse(uploadFileRes.data);
							console.log(data, "89987987")
							_this.face = data.result;
							_this.form.face = data.result;
						},
					});
				}
			})
		},
		// 用户相机授权权限后的回调
		changeAuthCamera() {
			this.$refs['authpup'].open(); // 调起相册权限目的弹框
		},

		// 用户相册授权权限后的回调
		changeAuth() {
			// 这里是权限通过后执行自己的代码逻辑
			console.log('权限已授权，可执行自己的代码逻辑了');
		},

		// 选择性别
		bindPickerGender: function (e) {
			this.curGender = e.detail.value
			this.form.sex = this.arrGender[e.detail.value].value
		},
		// 选择生日
		bindPickerBirth: function (e) {
			// this.form.birthday = e.detail.value
			this.$set(this.form, 'birthday', e.detail.value)
		},
		// 生成日期
		getDate: function (type) {
			const date = new Date()
			let sYear = date.getFullYear()
			let sMonth = date.getMonth() + 1
			let sDay = date.getDate()
			// if (type === 's') {
			// 	sYear = '1940'
			// 	sMonth = '01'
			// 	sDay = '01'
			// }
			// if (type === 'e') {
			// 	sYear = sYear
			// 	sMonth = sMonth > 9 ? sMonth : '0' + sMonth
			// 	sDay = sDay > 9 ? sDay : '0' + sDay
			// }
			// return `${sYear}-${sMonth}-${sDay}`
		},

		// 加载偏好
		loadTagsData: function () {
			uni.showLoading()
			getFirstCategory().then((res) => {
				if (this.$store.state.isShowToast) {
					uni.hideLoading()
				}
				if (res.data.code == 200) {
					this.isComplete = true
					this.arrTags = res.data.result;
				}
			})
		},

		// 点选偏好
		handlerSelectTag: function (e) {
			let eCode = e.currentTarget.dataset.code
			let eIndex = this.form.categoryIds.findIndex(o => o == eCode)
			if (eIndex > 0) {
				this.form.categoryIds.splice(eIndex, 1)
			} else {
				this.form.categoryIds.push(eCode)
			}
		},
		// 三级地址联动回调
		getpickerParentValue(e) {
			// 将需要绑定的地址设置为空，并赋值
			let name = ''
			this.adCodeData = []
			let regionId = []
			e.forEach((item, index) => {
				if (item.id) {
					name += item.localName + '/'
					this.adCodeData.push(item.adCode)
					regionId.push(item.id)
				}
				if (index == e.length - 1) {
					name = name.substring(0, name.length - 1)
					this.form.regionId = regionId.join(',')
					this.$set(this.form, 'regionPath', name)
					this.form.provinceCode = this.adCodeData[0]
					this.form.cityCode = this.adCodeData[1]
					this.form.districtCode = this.adCodeData[2]
				}
			})
		},
		// 显示三级地址联动
		showPicker() {
			this.$refs.cityPicker.show()
		}

	},
	onLoad: function () {
		// 加载偏好
		this.loadTagsData()
		this.form = storage.getUserInfo()
		this.face = this.form.face || `${this.iconCommon}/static/v1/profile/avatar.png`
		this.form.face = this.face
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
	padding: 20rpx;
}

.placeholder {
	color: #999;
}
</style>
