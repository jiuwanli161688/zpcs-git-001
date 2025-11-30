<template>
    <view class="container">
         <!-- 判断下是否通过审核，为通过时显示tips -->
         <view v-if="objData.updateInfoStatus == 2" class="tips tips-reject">
            <view class="tips-content">
                <span class="tips-text">你的资料修改申请已被驳回，驳回原因：{{ objData.rejectReason }}</span>
                <button class="audit-btn reject-btn" @tap="handlerRecovery">重填信息</button>
            </view>
        </view>
         <!-- 待审核显示tips -->
         <view class="tips" v-if="objData.updateInfoStatus == 0">
            <view class="tips-content">
                <span class="tips-text">你的资料修改申请正在审核中，请耐心等待。</span>
                <button class="audit-btn" @tap="handlerAudit">查看信息</button>
            </view>
         </view>
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">企业信息</view>
            </view>
            <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type='company' @tap="handlerUpfile">
                        <image class="icon-company" :src="iconLicenseCompany" mode="aspectFit" v-if="!fileCompany"></image>
                        <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany.length > 0">
                        </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传企业营业执照，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.storeName" placeholder-class="s-text_place"
                    placeholder="请输入企业名称" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.licenseNum" placeholder-class="s-text_place"
                    placeholder="请输入统一社会信用代码" disabled />
            </view>
            <view class="rs rs-line">
                <picker mode="multiSelector" :range="newProvince" :value="curSelected" @change="pickerChange"
                    @columnchange="pickerColumnChange" :disabled="isDisabled">
                    <view class="s-text" :class="{ 's-text_place': curSelectedLabel[0].length == 0 }">{{ provinceText }}
                    </view>
                </picker>
            </view>
            <view class="rs rs-line">
                <u-checkbox v-model="objData.longterm" :disabled="isDisabled">营业执照长期有效</u-checkbox>
            </view>
            <view v-show="!objData.longterm" class="rs rs-line">
                <picker mode="date" :value="endTime" @change="endTimeChange" :disabled="isDisabled">
                    <view class="uni-input">{{ endTime ? endTime : '请选择营业执照到期时间' }}</view>
                </picker>
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.storeAddressDetail" type="text" placeholder-class="s-text_place"
                    placeholder="请输入企业详细经营地址" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.companyEmail" placeholder-class="s-text_place"
                    placeholder="请输入企业邮箱" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.channelManagerName" placeholder-class="s-text_place"
                    placeholder="请输入渠道负责人" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.channelManagerPhone" placeholder-class="s-text_place"
                    placeholder="请输入渠道负责人电话" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.afterSaleManagerName" placeholder-class="s-text_place"
                    placeholder="请输入售后负责人" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.afterSaleManagerPhone" placeholder-class="s-text_place"
                    placeholder="请输入售后负责人电话" :disabled="isDisabled" />
            </view>
            <!-- <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type='taxCertificate' @tap="handlerUpfile">
                        <image class="icon-company" :src="iconTaxpayer" mode="aspectFit" v-if="taxCertificate.length == 0">
                        </image>
                        <image class="file-company" :src="taxCertificate" mode="aspectFit" v-if="taxCertificate.length > 0">
                        </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传纳税人资质，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.receiptType" disabled type="text" placeholder-class="s-text_place"
                    placeholder="请输入开票种类" />
            </view> -->
        </view>
        <!-- <view class="frm-sign">
			<view class="frm-title">
				<view class="name">对公账户</view>
			</view>
			<view class="rs rs-line">
				<input class="s-text" v-model="objData.settlementBankAccountName" type="text"
					placeholder-class="s-text_place" placeholder="请输入银行名称" />
			</view>
			<view class="rs rs-line">
				<input class="s-text" v-model="objData.settlementBankBranchName" type="text"
					placeholder-class="s-text_place" placeholder="请输入开户行" />
			</view>
			<view class="rs rs-line">
				<input class="s-text" v-model="objData.settlementBankAccountNum" type="text"
					placeholder-class="s-text_place" placeholder="请输入银行账户" />
			</view>
		</view> -->
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">法人信息</view>
            </view>
            <view class="min-photo">
                <view class="col-06">
                    <view class="rs-file" data-type='person-ps' @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson1" mode="aspectFit"
                            v-if="filePersonPs.length == 0"></image>
                        <image class="file-person" :src="filePersonPs" mode="aspectFit" v-if="filePersonPs.length > 0">
                        </image>
                    </view>
                </view>
                <view class="col-06">
                    <view class="rs-file" data-type='person-dt' @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson2" mode="aspectFit"
                            v-if="filePersonDt.length == 0"></image>
                        <image class="file-person" :src="filePersonDt" mode="aspectFit" v-if="filePersonDt.length > 0">
                        </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传法人身份证正反面，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalName" placeholder-class="s-text_place"
                    placeholder="请输入企业法人姓名" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalId" placeholder-class="s-text_place"
                    placeholder="请输入法人身份证号" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalPhone" placeholder-class="s-text_place"
                    placeholder="请输入法人联系电话" :disabled="isDisabled" />
            </view>

        </view>

        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">联系人信息</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.linkName" placeholder-class="s-text_place"
                    placeholder="请输入联系人姓名" :disabled="isDisabled" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.linkPhone" placeholder-class="s-text_place"
                    placeholder="请输入联系人电话" :disabled="isDisabled" />
            </view>
        </view>
        <button class="lnk-common lnk-primary" @tap="handlerSubmit" :loading="submitting" :class="{ 'disabled': isDisabled }" :style="{ opacity: isDisabled ? 0.5 : 1 }">提交</button>
        <!-- #ifdef APP-PLUS -->
        <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
        <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
        <!-- #endif -->
    </view>
</template>

<script>

import storage from '@/utils/storage.js';
import { getRegionsById } from "@/api/common.js";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { businessLicenseOcr, idCardOcr, uploadPrivateFile } from "@/api/common";
import { updateBasicInformation, getStoreInfo, getReturnAndWaitCompanyInfo } from "@/api/store";
export default {
    name: '',
    components: {

    },
    computed: {
        provinceText: function () {
            return this.curSelectedLabel[0].length == 0 ? '请选择企业归属地区' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
        },
        isDisabled: function () {
            return this.objData.updateInfoStatus == 0
        }
    },
    data() {
        return {
            isComplete: false,
            iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
            iconLicenseCompany: `${this.iconCommon}/static/v1/apply/icon-company.png`,
            iconLicensePerson1: `${this.iconCommon}/static/v1/apply/icon-person_1.png`,
            iconLicensePerson2: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
            iconTaxpayer: `${this.iconCommon}/static/v1/apply/icon-taxpayer.png`,
            fileCompany: '',										// 营业执照路径
            filePersonPs: '',										// 身份证正面
            filePersonDt: '',										// 身份证背面
            taxCertificate: '',                                      // 纳税人资质

            newProvince: [[], [], []],					// 待选省市区
            curSelected: [0, 0, 0],							// 选中省市区下标
            curSelectedValue: ['', '', ''],			// 选中省市区ID
            curSelectedLabel: ['', '', ''],			// 选中省市区文本

            allProvince: [],										// 全部省市区
            objData: {
                storeName: "",
                licencePhoto: "",
                licenseNum: "",
                storeAddressIdPath: "",
                storeAddressDetail: "",
                legalPhoto: "",
                legalPhotoBack: "",
                endTime: "",
                longterm: false,
                legalName: "",
                legalId: "",
                legalPhone: "",
                receiptType: '增值税专票'
            },
            submitting: false,
            source: "new",
            endTime: "",
        }
    },
    methods: {
        pickerChange: function (e) {
            this.curSelected = e.detail.value
            let curProvince = this.allProvince[this.curSelected[0]]
            let curCity = curProvince.sons[this.curSelected[1]]
            let curDistrict = curCity.sons[this.curSelected[2]]
            this.curSelectedValue = [curProvince.code, curCity.code, curDistrict.code]
            this.curSelectedLabel = [curProvince.name, curCity.name, curDistrict.name]
        },
        endTimeChange: function (e) {
            this.endTime = e.detail.value
        },
        pickerColumnChange: async function (e) {
            let _this = this
            let curSelectedIndex = e.detail.value
            // 切换省
            if (e.detail.column === 0) {
                _this.curSelected.splice(0, 1, curSelectedIndex)
                let curSelectedProvince = _this.allProvince[curSelectedIndex]
                // 加载备选市级
                if (curSelectedProvince.sons.length == 0) {
                    await getRegionsById(curSelectedProvince.code).then(res => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map(o => {
                                curSelectedProvince.sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (tempRes.length == 0) {
                                curSelectedProvince.sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[1] = curSelectedProvince.sons.map(o => { return o.name })
                        }
                    })
                } else {
                    _this.newProvince[1] = curSelectedProvince.sons.map(o => { return o.name })
                }
                // 加载备选区级
                if (curSelectedProvince.sons[0].sons.length == 0) {
                    await getRegionsById(curSelectedProvince.sons[0].code).then(res => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map(o => {
                                curSelectedProvince.sons[0].sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (tempRes.length == 0) {
                                curSelectedProvince.sons[0].sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[2] = curSelectedProvince.sons[0].sons.map(o => { return o.name })
                        }
                    })
                } else {
                    _this.newProvince[2] = curSelectedProvince.sons[0].sons.map(o => { return o.name })
                }
                // 默认选择下标0市
                _this.curSelected.splice(1, 1, 0)
                // 默认选择下标0区
                _this.curSelected.splice(2, 1, 0)
            }

            // 切换市
            if (e.detail.column === 1) {
                _this.curSelected.splice(1, 1, curSelectedIndex)
                let curSelectedProvince = _this.allProvince[_this.curSelected[0]]
                // 加载备选区级
                if (curSelectedProvince.sons[curSelectedIndex].sons.length == 0) {
                    await getRegionsById(curSelectedProvince.sons[curSelectedIndex].code).then(res => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map(o => {
                                curSelectedProvince.sons[curSelectedIndex].sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (tempRes.length == 0) {
                                curSelectedProvince.sons[curSelectedIndex].sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[2] = curSelectedProvince.sons[curSelectedIndex].sons.map(o => { return o.name })
                        }
                    })
                } else {
                    _this.newProvince[2] = curSelectedProvince.sons[curSelectedIndex].sons.map(o => { return o.name })
                }
                // 默认选择下标0区
                _this.curSelected.splice(2, 1, 0)
            }
            // 切换区
            if (e.detail.column === 2) {
                _this.curSelected.splice(2, 1, curSelectedIndex)
            }
        },

        // 加载地区
        loadInitProvince: async function () {
            let _this = this
            // 加载省级
            let resProvince = await getRegionsById(0)
            if (resProvince.data.success) {
                let tempRes = resProvince.data.result
                tempRes.map(o => {
                    _this.allProvince.push({ code: o.id, name: o.name, sons: [] })
                    _this.newProvince[0].push(o.name)
                })
            }
            // 默认下标0省
            let curProvince = _this.allProvince[0]
            // 加载市级
            let resCity = await getRegionsById(curProvince.code)
            if (resCity.data.success) {
                let tempRes = resCity.data.result
                tempRes.map(o => {
                    curProvince.sons.push({ code: o.id, name: o.name, sons: [] })
                    _this.newProvince[1].push(o.name)
                })
            }
            // 默认下标0市
            let curCity = curProvince.sons[0]
            // 加载区级
            let resDistrict = await getRegionsById(curCity.code)
            if (resDistrict.data.success) {
                let tempRes = resDistrict.data.result
                tempRes.map(o => {
                    curCity.sons.push({ code: o.id, name: o.name, sons: [] })
                    _this.newProvince[2].push(o.name)
                })
            }
        },

        // 提交资料
        handlerSubmit: function () {
            if (this.isDisabled) {
                return;
            }
            this.objData.storeAddressIdPath = this.curSelectedValue.length == 3 ? this.curSelectedValue.join(",") : "";
            let that = this;
            this.objData.companyProvinceId = this.curSelectedValue[0];
            this.objData.companyCityId = this.curSelectedValue[1];
            this.objData.companyCountryId = this.curSelectedValue[2];
            if (this.objData.longterm) {
                this.objData.endTime = ''
            } else {
                this.objData.endTime = this.endTime
            }
            if (this.valid()) {
                uni.showLoading({ title: "正在保存" })
                this.submitting = true;
                updateBasicInformation(this.objData).then(res => {
                    uni.hideLoading();
                    if (res.data.code == 200) {
                        uni.navigateBack()
                        this.submitting = false;
                        // uni.redirectTo({
                        //     url: '/pages/supplierCenter/status?type=2'
                        // })
                    } else {
                        that.$u.toast(res.data.message)
                        this.submitting = false;
                    }
                })
            } else {
                this.submitting = false;
            }

        },
        valid: function () {
            if (this.$u.test.isEmpty(this.objData.licencePhoto)) {
                this.$u.toast("请先上传营业执照");
                return false;
            }

            // if (this.$u.test.isEmpty(this.objData.taxCertificateUrl)) {
            //     this.$u.toast("请先上传纳税人资质");
            //     return false;
            // }

            if (this.$u.test.isEmpty(this.objData.legalPhoto)) {
                this.$u.toast("请先上传法人身份证正面");
                return false;
            }

            if (this.$u.test.isEmpty(this.objData.legalPhotoBack)) {
                this.$u.toast("请先上传法人身份证反面");
                return false;
            }

            if (this.$u.test.isEmpty(this.objData.storeName)) {
                this.$u.toast("企业名称不能为空，请检查");
                return false;
            }
            if (!this.$u.test.rangeLength(this.objData.licenseNum, [18, 18])) {
                this.$u.toast("统一社会信用代码格式错误");
                return false;
            }

            if (this.$u.test.isEmpty(this.objData.storeAddressIdPath)) {
                this.$u.toast("请选择完整的三级企业归属地区");
                return false;
            }

            if (this.$u.test.isEmpty(this.objData.storeAddressDetail)) {
                this.$u.toast("企业详细地址不能为空");
                return false;
            }
            // if (this.$u.test.isEmpty(this.objData.receiptType)) {
            //     this.$u.toast("请输入开票种类");
            //     return false;
            // }

            if (this.$u.test.isEmpty(this.objData.legalName)) {
                this.$u.toast("法人名称不能为空");
                return false;
            }

            if (!this.$u.test.idCard(this.objData.legalId)) {
                this.$u.toast("法人证件号码格式错误");
                return false;
            }

            if (!this.$u.test.mobile(this.objData.legalPhone)) {
                this.$u.toast("法人电话格式错误");
                return false;
            }

            if (this.$u.test.isEmpty(this.objData.linkName)) {
                this.$u.toast("联系人姓名不能为空");
                return false;
            }
            if (!this.$u.test.mobile(this.objData.linkPhone)) {
                this.$u.toast("联系人电话格式错误");
                return false;
            }


            return true;
        },
        // 上传证件
        handlerUpfile: function (e) {
            if (this.isDisabled) {
                return;
            }
            // #ifdef APP-PLUS
            if (plus.os.name == 'Android') {
                this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
            }
            // #endif
            let _this = this
            let eType = e.currentTarget.dataset.type
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], 					// 从相册选择
                success: (res) => {
                    uni.showLoading({ title: "正在上传" })
                    uni.uploadFile({
                        url: uploadPrivateFile,
                        filePath: res.tempFilePaths[0],
                        name: "file",
                        header: {
                            accessToken: storage.getAccessToken(),
                        },
                        success: (uploadFileRes) => {
                            uni.hideLoading();
                            _this.$u.toast("上传成功")
                            let data = JSON.parse(uploadFileRes.data);
                            if (data.code == 200) {
                                if (eType == 'person-ps') {
                                    _this.filePersonPs = res.tempFilePaths[0]
                                    _this.objData.legalPhoto = data.result;
                                    uni.showLoading({ title: "正在识别信息" })
                                    idCardOcr({ idCardAddress: data.result }).then(ocrRes => {
                                        uni.hideLoading();
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.legalName = ocrRes.data.result.name;
                                            _this.objData.legalId = ocrRes.data.result.idCardNumber;
                                        } else {
                                            _this.filePersonPs = ''
                                            _this.objData.legalPhoto = ''
                                            _this.$u.toast("未识别成功 " + ocrRes.data.message)
                                        }
                                    })

                                } else if (eType == 'person-dt') {
                                    _this.filePersonDt = res.tempFilePaths[0]
                                    _this.objData.legalPhotoBack = data.result;
                                } else if (eType == 'taxCertificate') {
                                    _this.taxCertificate = res.tempFilePaths[0]
                                    _this.objData.taxCertificateUrl = data.result;
                                } else {
                                    _this.fileCompany = res.tempFilePaths[0]
                                    // 注意：上传文件接口执行成功后渲染数组
                                    _this.objData.licencePhoto = data.result
                                    // uni.showLoading({ title: "正在识别信息" })
                                    // businessLicenseOcr({ businessLicenseAddress: data.result }).then(ocrRes => {
                                    //     uni.hideLoading();
                                    //     if (ocrRes.data.code == 200) {
                                    //         _this.objData.storeName = ocrRes.data.result.unitName;
                                    //         _this.objData.licenseNum = ocrRes.data.result.socialCreditCode;
                                    //         _this.objData.storeAddressDetail = ocrRes.data.result.address;
                                    //     } else {
                                    //         _this.fileCompany = ''
                                    //         _this.objData.licencePhoto = ''
                                    //         _this.$u.toast("未识别成功 " + ocrRes.data.message)
                                    //     }
                                    // })
                                }
                            } else {
                                this.$u.toast("上传失败，请稍后重试")
                            }


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
        // 点击审核tips
        handlerAudit() {
            uni.navigateTo({
                url: '/pages/supplierCenter/foundationAudit'
            })
        },
         // 恢复重新编辑
         handlerRecovery() {
            // 请求接口赋值
            this.loadBaseData('recovery')
            // 解开禁用
            this.isDisabled = false
        },
        loadBaseData(type) {
            uni.showLoading();
            // 如果是恢复重新编辑，则请求提交审核被驳回的信息赋值 否则就正常加载已审核通过的信息
            let methodsApi = ''
            if (type == 'recovery') {
                methodsApi = getReturnAndWaitCompanyInfo
            }else{
                methodsApi = getStoreInfo
            }
            methodsApi().then(res => {
                if (res.data.code == 200) {
                    this.objData = { ...res.data.result };
                    this.$set(this.objData, 'endTime', this.objData.endTime ? this.objData.endTime : '')
                    this.endTime = this.objData.endTime;
                    this.fileCompany = this.objData.licencePhoto ? this.objData.licencePhoto : '';
                    this.filePersonDt = this.objData.legalPhotoBack ? this.objData.legalPhotoBack : '';
                    this.filePersonPs = this.objData.legalPhoto ? this.objData.legalPhoto : '';
                    this.curSelectedValue = this.objData.storeAddressIdPath ? this.objData.storeAddressIdPath.split(',') : [];
                    this.curSelectedLabel = this.objData.storeAddressPath ? this.objData.storeAddressPath.split(',') : ['', '', ''];
                    // this.taxCertificate = this.objData.taxCertificateUrl ? this.objData.taxCertificateUrl : '';
                    if (options.text != 1) {
                        if (this.objData.updateBankInfoFlag == '0') {
                            uni.redirectTo({
                                url: '/pages/supplierCenter/status?type=2'
                            })
                        }
                        if (this.objData.updateBankInfoFlag == '2') {
                            uni.redirectTo({
                                url: '/pages/supplierCenter/status?type=2'
                            })
                        }
                    }
                } else {
                    this.$u.toast(res.data.message);
                }
            })
        }
    },
    onLoad: function (options) {
        this.loadBaseData()
        // 初始化省市区
        this.loadInitProvince()
    },
    onShow: function () {

    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #FFF;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
    .tips {
        margin: 0 0 10rpx 0;
        background: rgba(252, 141, 0, 0.1);
        font-size: 28rpx;
        color: #fc8d00;
        padding: 20rpx;

        &.tips-reject {
            background: rgba(255, 77, 79, 0.1);
            color: #ff4d4f;
        }

        .tips-content {
            margin-bottom: 15rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .tips-text {
                flex: 1;
                margin-right: 20rpx;
            }
        }

        .audit-btn {
            background: linear-gradient(135deg, #fc8d00, #ff6b35);
            color: #fff;
            border: none;
            border-radius: 16rpx;
            padding: 10rpx 26rpx;
            font-size: 25rpx;
            font-weight: 500;
            box-shadow: 0 2rpx 8rpx rgba(252, 141, 0, 0.3);
            transition: all 0.3s ease;
            display: inline-block;
            vertical-align: middle;
            line-height: 1.4;
            white-space: nowrap;

            &:active {
                transform: translateY(1rpx);
                box-shadow: 0 1rpx 4rpx rgba(252, 141, 0, 0.4);
            }

            &:hover {
                background: linear-gradient(135deg, #ff6b35, #fc8d00);
            }

            &.reject-btn {
                background: linear-gradient(135deg, #ff4d4f, #ff7875);
                box-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.3);

                &:active {
                    box-shadow: 0 1rpx 4rpx rgba(255, 77, 79, 0.4);
                }

                &:hover {
                    background: linear-gradient(135deg, #ff7875, #ff4d4f);
                }
            }
        }
    }

}
</style>
