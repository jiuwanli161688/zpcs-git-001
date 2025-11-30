<template>
    <view class="container">
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">企业信息</view>
                <view class="step">
                    <view class="cur">2</view>
                    <view class="sum">/4</view>
                </view>
            </view>

            <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type="company" @tap="handlerUpfile">
                        <image class="icon-company" :src="iconLicenseCompany" mode="aspectFit" v-if="!fileCompany"> </image>
                        <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany"> </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传企业营业执照，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.companyName" type="text" placeholder-class="s-text_place"
                    placeholder="请输入企业名称" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.socialCreditCode" type="text" placeholder-class="s-text_place"
                    placeholder="请输入统一社会信用代码" />
            </view>
            <view class="rs rs-line">
                <u-checkbox v-model="objData.longterm">营业执照长期有效</u-checkbox>
            </view>
            <view v-show="!objData.longterm" class="rs rs-line">
                <picker mode="date" :value="objData.endTime" @change="endTimeChange">
                    <view class="uni-input">{{ objData.endTime ? objData.endTime : '请选择营业执照到期时间' }}</view>
                </picker>
            </view>
            <view class="rs rs-line">
                <picker mode="multiSelector" :range="newProvince" :value="curSelected" @change="pickerChange"
                    @columnchange="pickerColumnChange">
                    <view class="s-text" :class="{ 's-text_place': !curSelectedLabel[0] }">{{ provinceText }}</view>
                </picker>
            </view>
            <view class="rs rs-line has-textarea">
                <textarea class="s-text s-textarea" v-model="objData.companyAddress" placeholder-class="s-text_place"
                    placeholder="请输入企业详细经营地址" auto-height />
            </view>
            <!-- <view class="rs rs-line">
        <picker mode="selector" :range="enterpriseTypeList" :value="enterpriseIndex" @change="enterpriseChange"
          range-key="label">
          <view class="s-text" :class="{ 's-text_place': !enterpriseLabel }">{{ !enterpriseLabel ? '请选择企业类型' :
            enterpriseLabel }}</view>
        </picker>
      </view> -->
            <view class="rs rs-line">
                <picker mode="selector" :range="taxQualiOptionList" :value="curSelTaxQualiIndex" @change="taxQualiChange"
                    range-key="label">
                    <view class="s-text" :class="{ 's-text_place': !curSelTaxQualiLabel }">{{ !curSelTaxQualiLabel ?
                        '请选择纳税资质' : curSelTaxQualiLabel }}</view>
                </picker>
            </view>
            <!-- <view class="rs rs-line">
        <input class="s-text" v-model="objData.goodsAndTaxCode" type="text" placeholder-class="s-text_place"
          placeholder="请输入商品和税收分类编码" />
      </view> -->

            <!-- <view class="rs rs-line" v-if="objData.enterpriseType == 1">
        <picker mode="selector" :range="digitalInvoiceOptionList" :value="curSelDigitalInvoiceIndex"
          @change="digitalInvoiceChange" range-key="label">
          <view class="s-text" :class="{ 's-text_place': !curSelDigitalInvoiceLabel }">{{
            !curSelDigitalInvoiceLabel ? '请选择是否支持数电发票' : curSelDigitalInvoiceLabel }}</view>
        </picker>
      </view> -->
            <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type="authorization" @tap="handlerUpfile">
                        <image class="icon-company" :src="iconCertificate" mode="aspectFit" v-if="!authorization"> </image>
                        <image class="file-company" :src="authorization" mode="aspectFit" v-if="authorization"> </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传法人授权书，图片大小限制2M以内;</view>
            </view>
            <view class="min-photo" v-if="objData.taxQuali === 0">
                <view class="col-12">
                    <view class="rs-file" data-type="taxCertificate" @tap="handlerUpfile">
                        <image class="icon-company" :src="iconTaxpayer" mode="aspectFit" v-if="taxCertificate.length == 0">
                        </image>
                        <image class="file-company" :src="taxCertificate" mode="aspectFit" v-if="taxCertificate.length > 0">
                        </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse" v-if="objData.taxQuali === 0">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传一般纳税人资质证明，图片大小限制2M以内;</view>
            </view>
        </view>
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">对公账户</view>
            </view>
            <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type="settlementBankAccountInfoUrl" @tap="handlerUpfile">
                        <image class="icon-company" :src="iconCertificate" mode="aspectFit"
                            v-if="!objData.settlementBankAccountInfoUrl"> </image>
                        <image class="file-company" :src="objData.settlementBankAccountInfoUrl" mode="aspectFit"
                            v-if="objData.settlementBankAccountInfoUrl"> </image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传基础存款账户信息，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.settlementAccountName" type="text" placeholder-class="s-text_place"
                    placeholder="请输入基础存款账户名称" />
            </view>
            <view class="rs rs-line" style="display: none;">
                <input class="s-text" v-model="objData.settlementBankAccountName" type="text"
                    placeholder-class="s-text_place" placeholder="请输入对公账户名称" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.settlementBankBranchName" type="text"
                    placeholder-class="s-text_place" placeholder="请输入开户行" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.settlementBankAccountNum" type="number"
                    placeholder-class="s-text_place" placeholder="请输入银行账户" />
            </view>
        </view>


        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">法人信息</view>
            </view>
            <view class="min-photo">
                <view class="col-06">
                    <view class="rs-file" data-type="person-ps" @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson1" mode="aspectFit" v-if="!filePersonPs"> </image>
                        <image class="file-person" :src="filePersonPs" mode="aspectFit" v-if="filePersonPs"></image>
                    </view>
                </view>
                <view class="col-06">
                    <view class="rs-file" data-type="person-dt" @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson2" mode="aspectFit" v-if="!filePersonDt"> </image>
                        <image class="file-person" :src="filePersonDt" mode="aspectFit" v-if="filePersonDt"></image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传法人身份证正反面，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalPersonName" placeholder-class="s-text_place"
                    placeholder="请输入企业法人姓名" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalPersonIdCard" placeholder-class="s-text_place"
                    placeholder="请输入法人身份证号" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalPersonPhone" placeholder-class="s-text_place"
                    placeholder="请输入法人联系电话" />
            </view>
        </view>
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">分平台服务商信息</view>
            </view>
            <view class="min-photo">
                <view class="col-06">
                    <view class="rs-file" data-type="authorizedPersonIdCardPhoto" @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson1" mode="aspectFit"
                            v-if="!objData.authorizedPersonIdCardPhoto"> </image>
                        <image class="file-person" :src="objData.authorizedPersonIdCardPhoto" mode="aspectFit"
                            v-if="objData.authorizedPersonIdCardPhoto"></image>
                    </view>
                </view>
                <view class="col-06">
                    <view class="rs-file" data-type="authorizedPersonIdCardBackPhoto" @tap="handlerUpfile">
                        <image class="icon-person" :src="iconLicensePerson2" mode="aspectFit"
                            v-if="!objData.authorizedPersonIdCardBackPhoto"> </image>
                        <image class="file-person" :src="objData.authorizedPersonIdCardBackPhoto" mode="aspectFit"
                            v-if="objData.authorizedPersonIdCardBackPhoto"></image>
                    </view>
                </view>
            </view>
            <view class="frm-touse">
                <image :src="iconTips" mode="aspectFit" class="icon"></image>
                <view class="text">点击上传分平台服务商身份证正反面，图片大小限制2M以内;</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.authorizedPersonName" placeholder-class="s-text_place"
                    placeholder="请输入分平台服务商姓名" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.authorizedPersonIdNumber"
                    placeholder-class="s-text_place" placeholder="请输入分平台服务商身份证号" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.authorizedPersonPhone" placeholder-class="s-text_place"
                    placeholder="请输入分平台服务商联系电话" />
            </view>
        </view>

        <view class="frm-sign" v-if="objData.enterpriseType == 2">
            <view class="frm-title">
                <view class="name">分平台服务商信息</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" placeholder-class="s-text_place" v-model="objData.contactsName"
                    placeholder="请输入分平台服务商姓名" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" placeholder-class="s-text_place" v-model="objData.contactsPhone"
                    placeholder="请输入分平台服务商电话" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.shopkeeperIdCard" type="text" placeholder-class="s-text_place"
                    placeholder="请输入分平台服务商身份证号" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.shopkeeperBankCardName" type="text" placeholder-class="s-text_place"
                    placeholder="请输入分平台服务商开户银行" />
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.shopkeeperBankCard" type="text" placeholder-class="s-text_place"
                    placeholder="请输入分平台服务商银行卡号" />
            </view>
        </view>

        <view class="lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
        <!-- #ifdef APP-PLUS -->
        <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
        <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
        <!-- #endif -->
    </view>
</template>

<script>
import storage from '@/utils/storage.js'
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { getRegionsById, ocrBasicDepositAccount } from '@/api/common.js'
import { businessLicenseOcr, idCardOcr, upload, uploadPrivateFile } from '../../../api/common'
import { distributorDetail, distributorSubmit } from '../../../api/distributor'
import UCheckbox from '../../../uview-ui/components/u-checkbox/u-checkbox.vue'
import { refreshTokenFn } from '@/api/login'
export default {
    name: '',
    components: {
        UCheckbox,
        ykAuthpup
    },
    computed: {
        provinceText: function () {
            return !this.curSelectedLabel[0] ? '请手动选择企业归属地区' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
        }
    },
    data() {
        return {
            source: 'new',
            isComplete: false,
            iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
            iconLicenseCompany: `${this.iconCommon}/static/v1/apply/icon-company.png`,
            iconLicensePerson1: `${this.iconCommon}/static/v1/apply/icon-person_1.png`,
            iconLicensePerson2: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
            iconAuthorization: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
            iconCertificate: `${this.iconCommon}/static/v1/apply/icon-certificate.png`,
            iconTaxpayer: `${this.iconCommon}/static/v1/apply/icon-taxpayer.png`,
            fileCompany: '', // 营业执照路径
            filePersonPs: '', // 身份证正面
            filePersonDt: '', // 身份证背面
            authorization: '', // 法人授权书

            taxCertificate: '', // 纳税人资质

            newProvince: [[], [], []], // 待选省市区
            curSelected: [0, 0, 0], // 选中省市区下标
            curSelectedValue: ['', '', ''], // 选中省市区ID
            curSelectedLabel: ['', '', ''], // 选中省市区文本

            allProvince: [], // 全部省市区
            submitting: false,
            objData: {
                companyName: '',
                socialCreditCode: '',
                companyAddress: '',
                legalPersonName: '',
                legalPersonIdCard: '',
                legalPersonPhone: '',
                contactsName: '',
                contactsPhone: '',
                goodsAndTaxCode: '',
                taxQuali: '',
                enterpriseType: '',
                shopkeeperBankCard: '',
                shopkeeperBankCardName: '',
                digitalInvoiceFlag: 1,
                settlementBankAccountName: '',
                settlementBankBranchName: '',
                settlementBankAccountNum: '',
                shopkeeperIdCard: '',
                longterm: false,
                endTime: '',
                authorizedPersonIdCardPhoto: '', // 分平台服务商身份证正面
                authorizedPersonIdCardBackPhoto: '', // 分平台服务商身份证背面
                authorizedPersonName: '', // 分平台服务商姓名
                authorizedPersonIdNumber: '', // 分平台服务商身份证号
                authorizedPersonPhone: '', // 分平台服务商联系电话
                settlementBankAccountInfoUrl: '', // 基础存款账户信息

            },
            rules: {
                companyName: [
                    {
                        required: true,
                        max: 255,
                        message: '请输入企业名称(255字以内)',
                        trigger: ['blur']
                    }
                ]
            },
            taxQualiOptionList: [
                {
                    value: 0,
                    label: '一般纳税人'
                },
                {
                    value: 1,
                    label: '小规模纳税人'
                }
            ],
            enterpriseTypeList: [
                {
                    value: 1,
                    label: '自办公司'
                },
                {
                    value: 2,
                    label: '中品维度分公司'
                }
            ],
            enterpriseIndex: 0,
            enterpriseLabel: '',
            curSelTaxQualiIndex: 0,
            curSelTaxQualiLabel: '',
            digitalInvoiceOptionList: [
                {
                    value: 0,
                    label: '否'
                },
                {
                    value: 1,
                    label: '是'
                }
            ],
            curSelDigitalInvoiceIndex: 0,
            curSelDigitalInvoiceLabel: '',
            objZP: {} //用户信息
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
            this.objData.companyProvinceId = this.curSelectedValue[0]
            this.objData.companyCityId = this.curSelectedValue[1]
            this.objData.companyCountryId = this.curSelectedValue[2]
        },
        endTimeChange: function (e) {
            this.objData.endTime = e.detail.value
        },
        // 选择纳税资质
        taxQualiChange(e) {
            this.curSelTaxQualiIndex = e.detail.value
            this.curSelTaxQualiLabel = this.taxQualiOptionList[e.detail.value].label
            this.objData.taxQuali = this.taxQualiOptionList[e.detail.value].value
        },
        // 选择企业类型
        enterpriseChange(e) {
            this.enterpriseIndex = e.detail.value
            this.enterpriseLabel = this.enterpriseTypeList[e.detail.value].label
            this.objData.enterpriseType = this.enterpriseTypeList[e.detail.value].value
            // 选择中品维度分公司，一定支持数电发票
            if (this.objData.enterpriseType == 2) {
                this.objData.digitalInvoiceFlag = 1
            }
        },
        // 选择是否支持数电发票
        digitalInvoiceChange(e) {
            this.curSelDigitalInvoiceIndex = e.detail.value
            this.curSelDigitalInvoiceLabel = this.digitalInvoiceOptionList[e.detail.value].label
            this.objData.digitalInvoiceFlag = this.digitalInvoiceOptionList[e.detail.value].value
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
                    await getRegionsById(curSelectedProvince.code).then((res) => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map((o) => {
                                curSelectedProvince.sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (tempRes.length == 0) {
                                curSelectedProvince.sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[1] = curSelectedProvince.sons.map((o) => {
                                return o.name
                            })
                        }
                    })
                } else {
                    _this.newProvince[1] = curSelectedProvince.sons.map((o) => {
                        return o.name
                    })
                }
                // 加载备选区级
                if (curSelectedProvince.sons[0].sons.length == 0) {
                    await getRegionsById(curSelectedProvince.sons[0].code).then((res) => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map((o) => {
                                curSelectedProvince.sons[0].sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (!tempRes) {
                                curSelectedProvince.sons[0].sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[2] = curSelectedProvince.sons[0].sons.map((o) => {
                                return o.name
                            })
                        }
                    })
                } else {
                    _this.newProvince[2] = curSelectedProvince.sons[0].sons.map((o) => {
                        return o.name
                    })
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
                    await getRegionsById(curSelectedProvince.sons[curSelectedIndex].code).then((res) => {
                        if (res.data.success) {
                            let tempRes = res.data.result
                            tempRes.map((o) => {
                                curSelectedProvince.sons[curSelectedIndex].sons.push({ code: o.id, name: o.name, sons: [] })
                            })
                            if (tempRes.length == 0) {
                                curSelectedProvince.sons[curSelectedIndex].sons.push({ code: '-1', name: '--', sons: [] })
                            }
                            _this.newProvince[2] = curSelectedProvince.sons[curSelectedIndex].sons.map((o) => {
                                return o.name
                            })
                        }
                    })
                } else {
                    _this.newProvince[2] = curSelectedProvince.sons[curSelectedIndex].sons.map((o) => {
                        return o.name
                    })
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
                tempRes.map((o) => {
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
                tempRes.map((o) => {
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
                tempRes.map((o) => {
                    curCity.sons.push({ code: o.id, name: o.name, sons: [] })
                    _this.newProvince[2].push(o.name)
                })
            }
        },

        // 提交资料
        handlerSubmit: function () {
            if (!this.submitting) {
                if (this.valid()) {
                    this.submitting = true
                    let that = this

                    this.objData.legalPersonPhoto = this.filePersonPs + ',' + this.filePersonDt
                    this.objData.taxQuali = this.objData.taxQuali == 0 ? '1' : '2'
                    this.objData.provinceAgentFlag = this.objZP.provinceAgentFlag
                    this.objData.districtAgentFlag = this.objZP.districtAgentFlag
                    this.objData.provinceCode = this.objZP.provinceCode
                    this.objData.cityCode = this.objZP.cityCode
                    this.objData.locationCode = this.objZP.locationCode
                    this.objData.provinceProxyCode = this.objZP.provinceProxyCode
                    this.objData.zpyhUserPhone = this.objZP.mobile
                    this.objData.authorizationUrl = this.authorization
                    // this.objData.enterpriseType = 1
                    this.authorization = this.objData.authorizationUrl
                    uni.showLoading({ title: '正在保存' })
                    distributorSubmit(this.objData).then(async (res) => {
                        that.submitting = false
                        uni.hideLoading()
                        if (res.data.code == 200) {
                            refreshTokenFn(storage.getRefreshToken()).then((r) => {
                                if (r.data.code == 200) {
                                    storage.setAccessToken(r.data.result.accessToken)
                                    storage.setRefreshToken(r.data.result.refreshToken)
                                }
                            })
                            if (this.objData.enterpriseType == 2) {
                                uni.navigateTo({
                                    url: '/pages/apply/dealer/signature?source=' + this.source
                                })
                                return
                            }
                            uni.navigateTo({
                                url: '/pages/apply/dealer/signature?source=' + this.source
                            })

                        } else {
                            that.$u.toast(res.data.message)
                        }
                    })
                } else {
                    this.submitting = false
                }
            }
        },
        valid: function () {
            if (this.$u.test.isEmpty(this.objData.companyIdPhoto)) {
                this.$u.toast('请先上传营业执照')
                return false
            }

            // if (this.$u.test.isEmpty(this.objData.legalPersonPhoto)) {
            //   this.$u.toast("请先上传法人证件");
            //   return false;
            // }

            if (this.$u.test.isEmpty(this.objData.companyName)) {
                this.$u.toast('企业名称不能为空，请检查')
                return false
            }
            if (!this.$u.test.rangeLength(this.objData.socialCreditCode, [18, 18])) {
                this.$u.toast('统一社会信用代码格式错误')
                return false
            }

            if (this.$u.test.isEmpty(this.objData.companyProvinceId) || this.$u.test.isEmpty(this.objData.companyCityId) || this.$u.test.isEmpty(this.objData.companyCountryId)) {
                this.$u.toast('请选择完整的三级企业归属地区')
                return false
            }

            if (this.$u.test.isEmpty(this.objData.companyAddress)) {
                this.$u.toast('企业详细地址不能为空')
                return false
            }
            if (this.objData.enterpriseType === null || this.objData.enterpriseType === '' || this.objData.enterpriseType === undefined) {
                this.$u.toast('请选择企业类型')
                return false
            }
            if (this.objData.taxQuali === null || this.objData.taxQuali === '' || this.objData.taxQuali === undefined) {
                this.$u.toast('请选择纳税资质')
                return false
            }
            // if (this.$u.test.isEmpty(this.objData.goodsAndTaxCode)) {
            //   this.$u.toast("商品和税收分类编码不能为空");
            //   return false;
            // }

            // if (this.objData.digitalInvoiceFlag === null || this.objData.digitalInvoiceFlag === '' || this.objData.digitalInvoiceFlag === undefined) {
            //   this.$u.toast("请选择是否支持数电发票");
            //   return false;
            // }
            if (this.$u.test.isEmpty(this.authorization)) {
                this.$u.toast('请先上传法人授权书')
                return false
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankAccountInfoUrl)) {
                this.$u.toast('请先上传基础存款账户信息')
                return false
            }
            if (this.$u.test.isEmpty(this.objData.settlementAccountName)) {
                this.$u.toast('基础存款账户名称不能为空')
                return false
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankBranchName)) {
                this.$u.toast('对公账户开户行不能为空')
                return false
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankAccountNum)) {
                this.$u.toast('对公银行账户不能为空')
                return false
            }

            if (this.$u.test.isEmpty(this.filePersonPs)) {
                this.$u.toast('请先上传法人证件')
                return false
            }

            if (this.$u.test.isEmpty(this.filePersonDt)) {
                this.$u.toast('请先上传法人证件')
                return false
            }

            if (this.$u.test.isEmpty(this.objData.legalPersonName)) {
                this.$u.toast('法人名称不能为空')
                return false
            }

            if (this.$u.test.isEmpty(this.objData.legalPersonIdCard)) {
                this.$u.toast('法人证件号码不能为空')
                return false
            }
            if (this.$u.test.isEmpty(this.objData.legalPersonPhone)) {
                this.$u.toast('法人电话格不能为空')
                return false
            }
            if (!this.$u.test.mobile(this.objData.legalPersonPhone)) {
                this.$u.toast('法人电话格式错误')
                return false
            }
            if (this.curSelTaxQualiLabel == '一般纳税人') {
                if (this.$u.test.isEmpty(this.taxCertificate)) {
                    this.$u.toast('请先上传纳税人资质证明')
                    return false
                }
            }

            // 分平台服务商信息验证
            if (this.objData.enterpriseType == 1) {

                // if (this.$u.test.isEmpty(this.objData.authorizedPersonIdCardPhoto)) {
                //     this.$u.toast('请先上传分平台服务商身份证正面')
                //     return false
                // }
                // if (this.$u.test.isEmpty(this.objData.authorizedPersonIdCardBackPhoto)) {
                //     this.$u.toast('请先上传分平台服务商身份证背面')
                //     return false
                // }
                if (this.$u.test.isEmpty(this.objData.authorizedPersonName)) {
                    this.$u.toast('分平台服务商姓名不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.authorizedPersonIdNumber)) {
                    this.$u.toast('分平台服务商身份证号不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.authorizedPersonPhone)) {
                    this.$u.toast('分平台服务商联系电话不能为空')
                    return false
                }
                if (!this.$u.test.mobile(this.objData.authorizedPersonPhone)) {
                    this.$u.toast('分平台服务商联系电话格式错误')
                    return false
                }
            }

            if (this.objData.enterpriseType == 2) {
                if (this.$u.test.isEmpty(this.objData.contactsName)) {
                    this.$u.toast('分平台服务商姓名不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.contactsPhone)) {
                    this.$u.toast('分平台服务商电话不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.shopkeeperIdCard)) {
                    this.$u.toast('分平台服务商证件号码不能为空')
                    return false
                }
                if (!this.$u.test.mobile(this.objData.contactsPhone)) {
                    this.$u.toast('分平台服务商电话格式错误')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.shopkeeperBankCard)) {
                    this.$u.toast('分平台服务商银行卡不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.objData.shopkeeperBankCardName)) {
                    this.$u.toast('分平台服务商银行卡名称不能为空')
                    return false
                }
            }
            return true
        },
        // 上传证件
        handlerUpfile: function (e) {
            // #ifdef APP-PLUS
            if (plus.os.name == 'Android') {
                this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
            }
            // #endif
            let _this = this
            let eType = e.currentTarget.dataset.type
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 从相册选择
                success: (res) => {
                    uni.showLoading({ title: '正在上传' })
                    uni.uploadFile({
                        url: uploadPrivateFile,
                        filePath: res.tempFilePaths[0],
                        name: 'file',
                        header: {
                            accessToken: storage.getAccessToken()
                        },
                        success: (uploadFileRes) => {
                            uni.hideLoading()
                            _this.$u.toast('上传成功')
                            let data = JSON.parse(uploadFileRes.data)
                            if (data.code == 200) {
                                if (eType == 'person-ps') {
                                    _this.filePersonPs = data.result
                                    _this.objData.legalPersonName = ''
                                    _this.objData.legalPersonIdCard = ''
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.legalPersonName = ocrRes.data.result.name
                                            _this.objData.legalPersonIdCard = ocrRes.data.result.idCardNumber
                                        } else {
                                            _this.filePersonPs = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'authorizedPersonIdCardPhoto') {
                                    _this.objData.authorizedPersonIdCardPhoto = data.result
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.authorizedPersonName = ocrRes.data.result.name
                                            _this.objData.authorizedPersonIdNumber = ocrRes.data.result.idCardNumber
                                        } else {
                                            _this.objData.authorizedPersonIdCardPhoto = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'authorizedPersonIdCardBackPhoto') {
                                    _this.objData.authorizedPersonIdCardBackPhoto = data.result
                                }
                                else if (eType == 'person-dt') {
                                    _this.filePersonDt = data.result
                                } else if (eType == 'taxCertificate') {
                                    _this.taxCertificate = res.tempFilePaths[0]
                                    _this.objData.taxCertificateUrl = data.result
                                } else if (eType == 'authorization') {
                                    _this.authorization = data.result
                                } else if (eType == 'settlementBankAccountInfoUrl') {
                                    _this.objData.settlementBankAccountInfoUrl = data.result
                                    uni.showLoading({ title: '正在识别信息' })
                                    ocrBasicDepositAccount({ depositAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.settlementAccountName = ocrRes.data.result.companyName
                                            _this.objData.settlementBankBranchName = ocrRes.data.result.bankName
                                            _this.objData.settlementBankAccountName = ocrRes.data.result.bankName
                                            _this.objData.settlementBankAccountNum = ocrRes.data.result.accountNumber.replace(/\s/g, '')
                                        } else {
                                            _this.objData.settlementBankAccountInfoUrl = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else {
                                    _this.fileCompany = res.tempFilePaths[0]
                                    // 注意：上传文件接口执行成功后渲染数组
                                    _this.objData.companyIdPhoto = data.result
                                    _this.objData.companyName = ''
                                    _this.objData.socialCreditCode = ''
                                    _this.objData.companyAddress = ''
                                    uni.showLoading({ title: '正在识别信息' })
                                    businessLicenseOcr({ businessLicenseAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.objData.companyName = ocrRes.data.result.unitName
                                            _this.objData.socialCreditCode = ocrRes.data.result.socialCreditCode
                                            _this.objData.companyAddress = ocrRes.data.result.address
                                        } else {
                                            _this.fileCompany = ''
                                            _this.objData.companyIdPhoto = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                }
                            } else {
                                this.$u.toast('上传失败，请稍后重试')
                            }
                        }
                    })
                    // 注意：上传文件接口执行成功后渲染网络路径
                    // 调用文件上传接口
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
            console.log('权限已授权，可执行自己的代码逻辑了');;
        },
    },
    onLoad: function (options) {

        this.objZP = storage.getZpMemberInfo() || {}
        this.source = options.source
        if (options.source == 'new') {
            let zpMemberInfo = storage.getZpMemberInfo()
            // storage.removeZpMemberInfo();
            if (zpMemberInfo && zpMemberInfo.companyName) {
                // 使用 Object.assign 保持响应式特性，而不是直接替换整个对象
                Object.assign(this.objData, zpMemberInfo)
                this.objData.zpyhUserPhone = zpMemberInfo.mobile
                this.objData.companyName = ''
                this.objData.districtLevelAgentFlag = this.objData.districtAgentFlag
                this.objData.provinceLevelAgentFlag = this.objData.provinceAgentFlag
                this.objData.companyAddress = this.objData.companyAddressDetail
                this.objData.companyIdPhoto = this.objData.businessLicenseImg
                this.objData.legalPersonPhoto = this.objData.legalPersonIdCardImg
                this.fileCompany = this.objData.companyIdPhoto
                this.objData.enterpriseType = 1
                if (this.objData.legalPersonPhoto && this.objData.legalPersonPhoto.indexOf(',') > -1) {
                    let legalPersonIdCardImgArr = this.objData.legalPersonPhoto.split(',')
                    this.filePersonPs = legalPersonIdCardImgArr[0]
                    this.filePersonDt = legalPersonIdCardImgArr[1]
                }
            }
        } else if (options.source == 'already') {
            distributorDetail().then((res) => {
                if (res.data.code == 200) {
                    // 使用 Object.assign 保持响应式特性，而不是直接替换整个对象
                    Object.assign(this.objData, res.data.result)
                    this.fileCompany = this.objData.companyIdPhoto
                    this.taxCertificate = this.objData.taxCertificateUrl ? this.objData.taxCertificateUrl : ''
                    if (this.objData.legalPersonPhoto?.indexOf(',') > -1) {
                        let legalPersonIdCardImgArr = this.objData.legalPersonPhoto.split(',')
                        this.filePersonPs = legalPersonIdCardImgArr[0]
                        this.filePersonDt = legalPersonIdCardImgArr[1]
                    }
                    this.authorization = this.objData.authorizationUrl
                    this.curSelectedValue = this.objData.companyRegionId?.split(',')
                    this.curSelectedLabel = this.objData.companyRegion?.split(',') ? this.objData.companyRegion?.split(',') : []
                    if (this.objData.taxQuali == 0 || this.objData.taxQuali) {
                        this.curSelTaxQualiLabel = this.objData.taxQuali == '1' ? '一般纳税人' : '小规模纳税人'
                        this.curSelTaxQualiIndex = this.objData.taxQuali == '1' ? 0 : 1
                        this.objData.taxQuali = this.objData.taxQuali == '1' ? 0 : 1
                    }
                    this.objData.enterpriseType = 1
                    this.objZP.provinceAgentFlag = this.objData.provinceAgentFlag
                    this.objZP.districtAgentFlag = this.objData.districtAgentFlag
                    this.objZP.provinceCode = this.objData.provinceCode
                    this.objZP.cityCode = this.objData.cityCode
                    this.objZP.locationCode = this.objData.locationCode
                    this.objZP.provinceProxyCode = this.objData.provinceProxyCode
                    this.objZP.mobile = this.objData.zpyhUserPhone
                    this.objData.zpyhUserPhone = this.objZP.mobile
                    if (this.objZP.settlementBankBranchName) {
                        this.$set(
                            this.objData,
                            'settlementBankBranchName',
                            this.objData.settlementBankBranchName ? this.objData.settlementBankBranchName : this.objZP.settlementBankBranchName
                        )
                    }
                    if (this.objZP.settlementBankAccountNum) {
                        this.$set(
                            this.objData,
                            'settlementBankAccountNum',
                            this.objData.settlementBankAccountNum ? this.objData.settlementBankAccountNum : this.objZP.settlementBankAccountNum
                        )
                    }
                    if (this.objZP.settlementBankAccountName) {
                        this.$set(
                            this.objData,
                            'settlementBankAccountName',
                            this.objData.settlementBankAccountName ? this.objData.settlementBankAccountName : this.objZP.settlementBankAccountName
                        )
                    }
                }
            })
        }

        // 初始化省市区
        this.loadInitProvince()
    },
    onShow: function () { }
}
</script>

<style lang="scss" scoped>
.container {
    background: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
}

// 添加textarea样式，支持自动换行
.s-textarea {
    min-height: 88rpx !important;
    height: auto !important;
    line-height: 1.5 !important;
    padding: 20rpx 0 !important;
    word-wrap: break-word !important;
    word-break: break-all !important;
    white-space: pre-wrap !important;
    resize: none !important;
}

.rs-line {
    .s-textarea {
        border: none !important;
        outline: none !important;
        background: transparent !important;
    }

    // 当包含textarea时，调整容器样式
    &:has(.s-textarea) {
        min-height: 88rpx !important;
        height: auto !important;
        align-items: flex-start !important;
        padding-bottom: 20rpx !important;
    }
}

// 为包含textarea的rs-line添加特殊样式
.rs-line.has-textarea {
    min-height: 88rpx !important;
    height: auto !important;
    align-items: flex-start !important;
    // padding-bottom: 30rpx !important;
    // margin-bottom: 20rpx !important;

    // 调整分割线位置，确保在内容下方
    &::after {
        bottom: 0 !important;
        top: auto !important;
    }

    // 调整textarea的底部间距
    .s-textarea {
        padding-bottom: 10rpx !important;
    }
}
</style>
