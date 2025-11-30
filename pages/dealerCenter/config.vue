<template>
    <view class="container">
        <!-- 判断下是否通过审核，为通过时显示tips -->
        <view v-if="dealerInfoObj.updateInfoStatus == 2" class="tips tips-reject">
            <view class="tips-content">
                <span class="tips-text">你的资料修改申请已被驳回，驳回原因：{{ dealerInfoObj.updateBankInfoRejectReason }}</span>
                <button class="audit-btn reject-btn" @tap="handlerRecovery">重填信息</button>
            </view>
        </view>
         <!-- 待审核显示tips -->
         <view class="tips" v-if="dealerInfoObj.updateInfoStatus == 0">
            <view class="tips-content">
                <span class="tips-text">你的资料修改申请正在审核中，请耐心等待。</span>
                <button class="audit-btn" @tap="handlerAudit">查看信息</button>
            </view>
         </view>
        <view class="frm-comm">
            <view class="frm-title">企业信息</view>
            <view class="rs rs-line">
                <view class="lab">服务商编号</view>
                <view class="txt flex">
                    <input disabled class="s-text" v-model="dealerInfoObj.distributorNumber" type="text"
                        placeholder="请输入" />
                </view>
            </view>
            <view class="frm-sign">
                <view class="min-photo">
                    <view class="col-12">
                        <view class="rs-file" data-type="company" @tap="handlerUpfile">
                            <image class="icon-company" :src="iconLicenseCompany" mode="aspectFit" v-if="!fileCompany">
                            </image>
                            <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany"> </image>
                        </view>
                    </view>
                </view>
                <view class="frm-touse">
                    <image :src="iconTips" mode="aspectFit" class="icon"></image>
                    <view class="text">点击上传企业营业执照，图片大小限制2M以内;</view>
                </view>
                <!-- <view class="rs rs-line">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text" v-model="dealerInfoObj.companyName" type="text" placeholder-class="s-text_place"
                        placeholder="请输入企业名称" />
                </view>
                <view class="rs rs-line">
                    <input class="s-text" :disabled="updateBankInfoFlagIsEdit" v-model="dealerInfoObj.socialCreditCode" type="text"
                        placeholder-class="s-text_place" placeholder="请输入统一社会信用代码" />
                </view> -->

            </view>
            <view class="rs rs-line">
                <view class="lab">企业名称</view>
                <view class="txt flex">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                        v-model="dealerInfoObj.companyName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">企业税号</view>
                <view class="txt flex">
                    <input class="s-text" :disabled="updateBankInfoFlagIsEdit" v-model="dealerInfoObj.socialCreditCode" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <u-checkbox :disabled="updateBankInfoFlagIsEdit" v-model="dealerInfoObj.longterm">营业执照长期有效</u-checkbox>
            </view>
            <view v-show="!dealerInfoObj.longterm" class="rs rs-line">
                <picker mode="date" :value="dealerInfoObj.endTime" @change="endTimeChange" :disabled="updateBankInfoFlagIsEdit">
                    <view class="uni-input">{{ dealerInfoObj.endTime ? dealerInfoObj.endTime : '请选择营业执照到期时间' }}</view>
                </picker>
            </view>
            <!-- <view class="rs rs-line">
                <view class="lab">企业类型</view>
                <view class="txt flex">
                    <picker disabled mode="selector" :range="enterpriseTypeList" :value="enterpriseIndex"
                        @change="enterpriseChange" range-key="label">
                        <view class="s-text" :class="{ 's-text_place': !enterpriseLabel }">{{ !enterpriseLabel ? '请选择企业类型' :
                            enterpriseLabel }}</view>
                    </picker>
                </view>
            </view> -->
            <view class="rs rs-line">
                <view class="lab">纳税资质</view>
                <view class="txt flex">
                    <picker mode="selector" :range="taxQualiOptionList" :value="curSelTaxQualiIndex" :disabled="updateBankInfoFlagIsEdit"
                        @change="taxQualiChange" range-key="label">
                        <view class="s-text" :class="{ 's-text_place': !curSelTaxQualiLabel }">{{ !curSelTaxQualiLabel ?
                            '请选择纳税资质' : curSelTaxQualiLabel }}</view>
                    </picker>
                </view>
            </view>
            <view class="frm-sign">
                <view class="frm-sign" v-if="dealerInfoObj.taxQuali === 0">
                    <view class="min-photo">
                        <view class="col-12">
                            <view class="rs-file" data-type="taxCertificate" @tap="handlerUpfile">
                                <image class="icon-company" :src="iconTaxpayer" mode="aspectFit"
                                    v-if="taxCertificate.length == 0"> </image>
                                <image class="file-company" :src="taxCertificate" mode="aspectFit"
                                    v-if="taxCertificate.length > 0"> </image>
                            </view>
                        </view>
                    </view>
                    <view class="frm-touse">
                        <image :src="iconTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击上传一般纳税人资质证明，图片大小限制2M以内;</view>
                    </view>
                </view>
                <view class="min-photo">
                    <view class="col-12">
                        <view class="rs-file" data-type="authorization" @tap="handlerUpfile">
                            <image class="icon-company" :src="iconCertificate" mode="aspectFit" v-if="!authorization">
                            </image>
                            <image class="file-company" :src="authorization" mode="aspectFit" v-if="authorization"> </image>
                        </view>
                    </view>
                </view>
                <view class="frm-touse">
                    <image :src="iconTips" mode="aspectFit" class="icon"></image>
                    <view class="text">点击上传法人授权书，图片大小限制2M以内;</view>
                </view>

                <view class="min-photo">
                    <view class="col-06">
                        <view class="rs-file" data-type="person-ps" @tap="handlerUpfile">
                            <image class="icon-person" :src="iconLicensePerson1" mode="aspectFit" v-if="!filePersonPs">
                            </image>
                            <image class="file-person" :src="filePersonPs" mode="aspectFit" v-if="filePersonPs"></image>
                        </view>
                    </view>
                    <view class="col-06">
                        <view class="rs-file" data-type="person-dt" @tap="handlerUpfile">
                            <image class="icon-person" :src="iconLicensePerson2" mode="aspectFit" v-if="!filePersonDt">
                            </image>
                            <image class="file-person" :src="filePersonDt" mode="aspectFit" v-if="filePersonDt"></image>
                        </view>
                    </view>
                </view>
                <view class="frm-touse">
                    <image :src="iconTips" mode="aspectFit" class="icon"></image>
                    <view class="text">点击上传法人身份证正反面，图片大小限制2M以内;</view>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">法人姓名</view>
                <view class="txt flex">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                        v-model="dealerInfoObj.legalPersonName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">法人身份证号</view>
                <view class="txt flex">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                        v-model="dealerInfoObj.legalPersonIdCard" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">法人电话</view>
                <view class="txt flex">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                        v-model="dealerInfoObj.legalPersonPhone" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">所在地</view>
                <view class="txt flex">
                    <picker :disabled="updateBankInfoFlagIsEdit" mode="multiSelector"
                        :range="newProvince" :value="curSelected" @change="pickerChange" @columnchange="pickerColumnChange">
                        <view class="s-text" :class="{ 's-text_place': !curSelectedLabel[0] }">{{ provinceText }}</view>
                    </picker>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">详细地址</view>
                <view class="txt flex">
                    <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                        v-model="dealerInfoObj.companyAddress" type="text" placeholder="请输入" />
                </view>
            </view>

            <view>
                <view class="frm-sign">
                    <view class="min-photo">
                        <view class="col-06">
                            <view class="rs-file" data-type="authorizedPersonIdCardPhoto" @tap="handlerUpfile">
                                <image class="icon-person" :src="iconLicensePerson1" mode="aspectFit"
                                    v-if="!dealerInfoObj.authorizedPersonIdCardPhoto"> </image>
                                <image class="file-person" :src="dealerInfoObj.authorizedPersonIdCardPhoto" mode="aspectFit"
                                    v-if="dealerInfoObj.authorizedPersonIdCardPhoto"></image>
                            </view>
                        </view>
                        <view class="col-06">
                            <view class="rs-file" data-type="authorizedPersonIdCardBackPhoto" @tap="handlerUpfile">
                                <image class="icon-person" :src="iconLicensePerson2" mode="aspectFit"
                                    v-if="!dealerInfoObj.authorizedPersonIdCardBackPhoto"> </image>
                                <image class="file-person" :src="dealerInfoObj.authorizedPersonIdCardBackPhoto"
                                    mode="aspectFit" v-if="dealerInfoObj.authorizedPersonIdCardBackPhoto"></image>
                            </view>
                        </view>
                    </view>
                    <view class="frm-touse">
                        <image :src="iconTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击上传分平台服务商身份证正反面，图片大小限制2M以内;</view>
                    </view>
                    <view class="rs">
                        <view class="lab">姓名</view>
                        <view class="txt flex">
                            <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                                v-model="dealerInfoObj.authorizedPersonName" type="text" placeholder="请输入" />
                        </view>
                    </view>
                    <view class="rs">
                        <view class="lab">电话</view>
                        <view class="txt flex">
                            <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                                v-model="dealerInfoObj.authorizedPersonPhone" type="text" placeholder="请输入" />
                        </view>
                    </view>
                    <view class="rs">
                        <view class="lab">身份证号</view>
                        <view class="txt flex">
                            <input :disabled="updateBankInfoFlagIsEdit" class="s-text"
                                v-model="dealerInfoObj.authorizedPersonIdNumber" type="text" placeholder="请输入" />
                        </view>
                    </view>
                </view>
            </view>
            <!-- <view class="rs">
                <view class="lab">客服在线</view>
                <view class="txt flex">
						<u-picker mode="time" v-model="startTimeShow" :params="params" @confirm="startTimeConfirm">
						</u-picker>
						<u-picker mode="time" v-model="endTimeShow" :params="params" @confirm="endTimeConfirm">
						</u-picker>
						<view @tap="clickPicker" class="in-picker" :class="{ 'in-picker_place': !dealerInfoObj.serviceTime}">{{ !dealerInfoObj.serviceTime ? '请选择时间区间' : dealerInfoObj.serviceTime }}</view>
                </view>
            </view> -->
        </view>
        <button :disabled="updateBankInfoFlagIsEdit" class="lnk-common lnk-primary lnk-mb24" :loading="isSubmitInfoLoading"
            @tap="handlerSubmitInfo">提交</button>
            <!-- 审核不通过时，显示恢复重新编辑 -->

        <view class="frm-comm">
            <view class="frm-title">分平台服务商银行卡信息</view>

            <view class="rs" v-if="dealerInfoObj.enterpriseType == 2">
                <view class="lab">姓名</view>
                <view class="txt flex">
                    <input class="s-text" v-model="dealerInfoObj.contactsName"
                        type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 2">
                <view class="lab">电话</view>
                <view class="txt flex">
                    <input class="s-text" v-model="dealerInfoObj.contactsPhone"
                        type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 2">
                <view class="lab">身份证号</view>
                <view class="txt flex">
                    <input class="s-text" v-model="dealerInfoObj.shopkeeperIdCard"
                        type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 2">
                <view class="lab">开户行</view>
                <view class="txt flex">
                    <input class="s-text"
                        v-model="dealerInfoObj.shopkeeperBankCardName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 2">
                <view class="lab">银行账号</view>
                <view class="txt flex">
                    <input class="s-text" v-model="dealerInfoObj.shopkeeperBankCard"
                        type="text" placeholder="请输入" />
                </view>
            </view>
            <view v-if="dealerInfoObj.enterpriseType == 1" class="frm-sign">
                <view class="min-photo">
                    <view class="col-12">
                        <view class="rs-file" data-type="settlementBankAccountInfoUrl" @tap="handlerUpfile">
                            <image class="icon-company" :src="iconCertificate" mode="aspectFit"
                                v-if="!dealerInfoObj.settlementBankAccountInfoUrl"> </image>
                            <image class="file-company" :src="dealerInfoObj.settlementBankAccountInfoUrl" mode="aspectFit"
                                v-if="dealerInfoObj.settlementBankAccountInfoUrl">
                            </image>
                        </view>
                    </view>
                </view>
                <view class="frm-touse">
                    <image :src="iconTips" mode="aspectFit" class="icon"></image>
                    <view class="text">点击上传基础存款账户信息，图片大小限制2M以内;</view>
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 1">
                <view class="lab">基础存款账户信息</view>
                <view class="txt flex">
                    <!-- 除非是营业执照变更，此处同一个字段会一起变更 -->
                    <input disabled class="s-text" v-model="dealerInfoObj.companyName"
                        type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 1" style="display: none">
                <view class="lab">对公账户银行</view>
                <view class="txt flex">
                    <input class="s-text"
                        v-model="dealerInfoObj.settlementBankAccountName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 1">
                <view class="lab">对公账户开户行</view>
                <view class="txt flex">
                    <input class="s-text"
                        v-model="dealerInfoObj.settlementBankBranchName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs" v-if="dealerInfoObj.enterpriseType == 1">
                <view class="lab">对公账户账号</view>
                <view class="txt flex">
                    <input class="s-text"
                        v-model="dealerInfoObj.settlementBankAccountNum" type="text" placeholder="请输入" />
                </view>
            </view>
        </view>
        <button class="lnk-common lnk-primary lnk-mb24" :loading="isSubmitBankLoading"
            @tap="handlerSubmit">提交</button>

        <!-- <view class="frm-view">
            <view class="frm-title">企业信息</view>
            <view class="rs">
                <view class="lab">企业名称</view>
                <view class="txt">{{ dealerInfoObj.companyName }}</view>
            </view>
            <view class="rs">
                <view class="lab">统一社会信用代码</view>
                <view class="txt">{{ dealerInfoObj.socialCreditCode }}</view>
            </view>
            <view class="rs">
                <view class="lab">经营地址</view>
                <view class="txt">{{ dealerInfoObj.companyRegion }}</view>
            </view>
            <view class="rs">
                <view class="lab">法人姓名</view>
                <view class="txt">{{ dealerInfoObj.legalPersonName }} / {{ dealerInfoObj.legalPersonPhone }}</view>
            </view>
        </view> -->

        <!--        <view class="lnk-common lnk-secondary" @tap="handlerPreview">查看平台签约协议</view>-->
        <!-- #ifdef APP-PLUS -->
        <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
        <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
        <!-- #endif -->
    </view>
</template>

<script>
import { getRegionsById, upload,businessLicenseOcr,idCardOcr,ocrBasicDepositAccount,uploadPrivateFile } from '@/api/common.js'
import storage from '@/utils/storage.js'
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import { getDealerCompanyInfo, updateDealerCompanyInfo, getCooperationAgreement, dealerUpdateData, getReturnAndWaitCompanyInfo } from '@/api/dealerCenter.js'
export default {
    name: '',
    components: {
        ykAuthpup
    },
    data() {
        return {
            isComplete: false,
            iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
            iconCertificate: `${this.iconCommon}/static/v1/apply/icon-certificate.png`,
            iconTaxpayer: `${this.iconCommon}/static/v1/apply/icon-taxpayer.png`,
            iconLicenseCompany: `${this.iconCommon}/static/v1/apply/icon-company.png`,
            iconLicensePerson1: `${this.iconCommon}/static/v1/apply/icon-person_1.png`,
            iconLicensePerson2: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
            iconAuthorization: `${this.iconCommon}/static/v1/apply/icon-person_2.png`,
            dealerInfoObj: {
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
                settlementBankAccountInfoUrl: '' // 基础存款账户信息
            },
            params: {
                year: false,
                month: false,
                day: false,
                hour: true,
                minute: true,
                second: true
            },
            startTimeShow: false,
            endTimeShow: false,
            startTime: '',
            endTime: '',
            isSubmitInfoLoading: false, // 企业信息提交loading
            isSubmitBankLoading: false, // 银行卡信息提交loading
            Agreement: '', // 合作协议url
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
            curSelTaxQualiIndex: '',
            curSelTaxQualiLabel: '',
            enterpriseIndex: 0,
            enterpriseLabel: '',
            newProvince: [[], [], []], // 待选省市区
            curSelected: [0, 0, 0], // 选中省市区下标
            curSelectedValue: ['', '', ''], // 选中省市区ID
            curSelectedLabel: ['', '', ''], // 选中省市区文本
            updateBankInfoFlagIsEdit: false, // 是否能编辑
            allProvince: [], // 全部省市区
            taxCertificate: '',
            fileCompany: '', // 营业执照路径
            filePersonPs: '', // 身份证正面
            filePersonDt: '', // 身份证背面
            authorization: '' // 法人授权书
        }
    },
    computed: {
        provinceText: function () {
            return !this.curSelectedLabel[0] ? '请手动选择企业归属地区' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
        }
    },
    methods: {
        // 点击审核tips
        handlerAudit() {
            uni.navigateTo({
                url: '/pages/dealerCenter/configAudit'
            })
        },
        // 选择所在地
        pickerChange: function (e) {
            this.curSelected = e.detail.value
            let curProvince = this.allProvince[this.curSelected[0]]
            let curCity = curProvince.sons[this.curSelected[1]]
            let curDistrict = curCity.sons[this.curSelected[2]]
            this.curSelectedValue = [curProvince.code, curCity.code, curDistrict.code]
            this.curSelectedLabel = [curProvince.name, curCity.name, curDistrict.name]
            this.dealerInfoObj.companyProvinceId = this.curSelectedValue[0]
            this.dealerInfoObj.companyCityId = this.curSelectedValue[1]
            this.dealerInfoObj.companyCountryId = this.curSelectedValue[2]
        },
        // 选择企业类型
        enterpriseChange(e) {
            this.enterpriseIndex = e.detail.value
            this.enterpriseLabel = this.enterpriseTypeList[e.detail.value].label
            this.dealerInfoObj.enterpriseType = this.enterpriseTypeList[e.detail.value].value + 1
        },
        // 选择纳税资质
        taxQualiChange(e) {
            this.curSelTaxQualiIndex = e.detail.value
            this.curSelTaxQualiLabel = this.taxQualiOptionList[e.detail.value].label
            this.dealerInfoObj.taxQuali = this.taxQualiOptionList[e.detail.value].value
        },
        // 选择营业执照到期时间
        endTimeChange(e) {
            this.dealerInfoObj.endTime = e.detail.value
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
        clickPicker() {
            this.startTimeShow = true
        },
        // 选择时间
        startTimeConfirm(e) {
            this.startTime = e.hour + ':' + e.minute + ':' + e.second
            this.startTimeShow = false
            this.endTimeShow = true
        },
        endTimeConfirm(e) {
            this.endTime = e.hour + ':' + e.minute + ':' + e.second
            this.dealerInfoObj.serviceTime = `${this.startTime}-${this.endTime}`
            this.endTimeShow = false
        },
        loadBaseData(type) {
            uni.showLoading()
            // 如果是恢复重新编辑，则请求提交审核被驳回的信息赋值 否则就正常加载已审核通过的信息
            let methodsApi = ''
            if (type == 'recovery') {
                methodsApi = getReturnAndWaitCompanyInfo
            }else{
                methodsApi = getDealerCompanyInfo
            }
            methodsApi().then((res) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.code == 200) {
                    this.isComplete = true
                    this.dealerInfoObj = res.data.result
                    this.$set(this.dealerInfoObj, 'endTime', this.dealerInfoObj.endTime ? this.dealerInfoObj.endTime : '')
                    this.curSelectedValue = this.dealerInfoObj.companyRegionId?.split(',')
                    this.curSelectedLabel = this.dealerInfoObj.companyRegion?.split(',') ? this.dealerInfoObj.companyRegion?.split(',') : []
                    let companyRegionIds = this.dealerInfoObj.companyRegionId.split(',')
                    this.dealerInfoObj.companyProvinceId = companyRegionIds[0]
                    this.dealerInfoObj.companyCityId = companyRegionIds[1]
                    this.dealerInfoObj.companyCountryId = companyRegionIds[2]
                    this.dealerInfoObj.enterpriseType = 1
                    if (this.dealerInfoObj.enterpriseType == 0 || this.dealerInfoObj.enterpriseType) {
                        this.enterpriseIndex = this.dealerInfoObj.enterpriseType == '1' ? 0 : 1
                        this.enterpriseLabel = this.dealerInfoObj.enterpriseType == '1' ? '自办公司' : '中品维度分公司'
                    }
                    if (this.dealerInfoObj.taxQuali == 0 || this.dealerInfoObj.taxQuali) {
                        this.curSelTaxQualiLabel = this.dealerInfoObj.taxQuali == '1' ? '一般纳税人' : '小规模纳税人'
                        this.curSelTaxQualiIndex = this.dealerInfoObj.taxQuali == '1' ? 0 : 1
                        this.dealerInfoObj.taxQuali = this.dealerInfoObj.taxQuali == '1' ? 0 : 1
                    }
                    this.taxCertificate = this.dealerInfoObj.taxCertificateUrl ? this.dealerInfoObj.taxCertificateUrl : ''
                    this.updateBankInfoFlagIsEdit = this.dealerInfoObj.updateInfoStatus == 0 ? true : false // 是否可编辑（待审核 0  时，禁止编辑）
                    this.authorization = this.dealerInfoObj.authorizationUrl
                    if (this.dealerInfoObj.legalPersonPhoto && this.dealerInfoObj.legalPersonPhoto.indexOf(',') > -1) {
                        let legalPersonIdCardImgArr = this.dealerInfoObj.legalPersonPhoto.split(',')
                        this.filePersonPs = legalPersonIdCardImgArr[0]
                        this.filePersonDt = legalPersonIdCardImgArr[1]
                    }
                    this.authorization = this.dealerInfoObj.authorizationUrl
                    this.fileCompany = this.dealerInfoObj.companyIdPhoto
                } else {
                    this.$u.toast(res.data.message)
                }
            })
        },
        // 获取协议
        loadAgreement() {
            getCooperationAgreement().then((res) => {
                if (res.data.code == 200) {
                    this.Agreement = res.data.result
                } else {
                    this.$u.toast(res.data.message)
                }
            })
        },
        // 查看协议
        handlerPreview() {
            // #ifdef H5
            window.open(this.Agreement)
            // #endif
            // #ifdef APP-PLUS || MP-WEIXIN
            uni.showLoading({
                title: '正在下载'
            })
            uni.downloadFile({
                url: this.Agreement,
                success: (res) => {
                    uni.hideLoading()
                    var filePath = res.tempFilePath
                    uni.openDocument({
                        filePath: filePath,
                        fileType: 'pdf',
                        showMenu: true,
                        success: (re) => {
                            console.log('打开文档成功', re)
                        },
                        fail: (err) => {
                            console.log('打开文档失败', err)
                        }
                    })
                },
                fail: (er) => {
                    uni.hideLoading()
                    console.log('下载失败', er)
                }
            })
            // #endif
        },
        // 提交资料修改
        handlerSubmitInfo() {
            // 企业信息校验
            if (!this.validCompanyInfo()) {
                return
            }

            // 设置loading状态
            this.isSubmitInfoLoading = true

            // 补齐缺失的字段赋值，参考 archives.vue 中的 handlerSubmit 方法
            this.dealerInfoObj.legalPersonPhoto = this.filePersonPs + ',' + this.filePersonDt
            this.dealerInfoObj.companyRegion = this.curSelectedLabel.join(',')
            this.dealerInfoObj.enterpriseType = 1
            this.dealerInfoObj.taxQuali = this.dealerInfoObj.taxQuali == 0 ? '1' : '2'
            this.dealerInfoObj.authorizationUrl = this.authorization
            this.dealerInfoObj.taxCertificateUrl = this.taxCertificate

            // 分平台服务商信息
            if (this.dealerInfoObj.enterpriseType == 1) {
                // 自办公司类型，需要分平台服务商信息
                this.dealerInfoObj.authorizedPersonIdCardPhoto = this.dealerInfoObj.authorizedPersonIdCardPhoto || ''
                this.dealerInfoObj.authorizedPersonIdCardBackPhoto = this.dealerInfoObj.authorizedPersonIdCardBackPhoto || ''
                this.dealerInfoObj.authorizedPersonName = this.dealerInfoObj.authorizedPersonName || ''
                this.dealerInfoObj.authorizedPersonIdNumber = this.dealerInfoObj.authorizedPersonIdNumber || ''
                this.dealerInfoObj.authorizedPersonPhone = this.dealerInfoObj.authorizedPersonPhone || ''
            } else if (this.dealerInfoObj.enterpriseType == 2) {
                // 中品维度分公司类型
                this.dealerInfoObj.contactsName = this.dealerInfoObj.contactsName || ''
                this.dealerInfoObj.contactsPhone = this.dealerInfoObj.contactsPhone || ''
                this.dealerInfoObj.shopkeeperIdCard = this.dealerInfoObj.shopkeeperIdCard || ''
                this.dealerInfoObj.shopkeeperBankCardName = this.dealerInfoObj.shopkeeperBankCardName || ''
                this.dealerInfoObj.shopkeeperBankCard = this.dealerInfoObj.shopkeeperBankCard || ''
            }

            // 对公账户信息
            if (this.dealerInfoObj.enterpriseType == 1) {
                this.dealerInfoObj.settlementBankAccountInfoUrl = this.dealerInfoObj.settlementBankAccountInfoUrl || ''
                this.dealerInfoObj.companyName = this.dealerInfoObj.companyName || ''
                this.dealerInfoObj.settlementBankBranchName = this.dealerInfoObj.settlementBankBranchName || ''
                this.dealerInfoObj.settlementBankAccountNum = this.dealerInfoObj.settlementBankAccountNum || ''
            }

            let params = {
                type: 1,
                ...this.dealerInfoObj
                // serviceTime: this.dealerInfoObj.serviceTime?this.dealerInfoObj.serviceTime:'',
            }

            updateDealerCompanyInfo(params).then((res) => {
                if (res.data.success) {
                    uni.navigateBack()
                    this.$u.toast('提交成功')
                    this.isSubmitInfoLoading = false
                } else {
                    this.$u.toast(res.data.message || '提交失败')
                    this.isSubmitInfoLoading = false
                }
            }).catch((err) => {
                this.$u.toast('提交失败，请稍后重试')
                this.isSubmitInfoLoading = false
            })
        },
        // 企业信息校验
        validCompanyInfo: function () {
            if (this.$u.test.isEmpty(this.dealerInfoObj.companyIdPhoto)) {
                this.$u.toast('请先上传营业执照')
                return false
            }

            if (this.$u.test.isEmpty(this.dealerInfoObj.companyName)) {
                this.$u.toast('企业名称不能为空，请检查')
                return false
            }
            if (!this.$u.test.rangeLength(this.dealerInfoObj.socialCreditCode, [18, 18])) {
                this.$u.toast('统一社会信用代码格式错误')
                return false
            }

            if (
                this.$u.test.isEmpty(this.dealerInfoObj.companyProvinceId) ||
                this.$u.test.isEmpty(this.dealerInfoObj.companyCityId) ||
                this.$u.test.isEmpty(this.dealerInfoObj.companyCountryId)
            ) {
                this.$u.toast('请选择完整的三级企业归属地区')
                return false
            }

            if (this.$u.test.isEmpty(this.dealerInfoObj.companyAddress)) {
                this.$u.toast('企业详细地址不能为空')
                return false
            }
            if (this.dealerInfoObj.enterpriseType === null || this.dealerInfoObj.enterpriseType === '' || this.dealerInfoObj.enterpriseType === undefined) {
                this.$u.toast('请选择企业类型')
                return false
            }
            if (this.dealerInfoObj.taxQuali === null || this.dealerInfoObj.taxQuali === '' || this.dealerInfoObj.taxQuali === undefined) {
                this.$u.toast('请选择纳税资质')
                return false
            }

            if (this.$u.test.isEmpty(this.authorization)) {
                this.$u.toast('请先上传法人授权书')
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

            if (this.$u.test.isEmpty(this.dealerInfoObj.legalPersonName)) {
                this.$u.toast('法人名称不能为空')
                return false
            }

            if (this.$u.test.isEmpty(this.dealerInfoObj.legalPersonIdCard)) {
                this.$u.toast('法人证件号码不能为空')
                return false
            }
            if (this.$u.test.isEmpty(this.dealerInfoObj.legalPersonPhone)) {
                this.$u.toast('法人电话格不能为空')
                return false
            }
            if (!this.$u.test.mobile(this.dealerInfoObj.legalPersonPhone)) {
                this.$u.toast('法人电话格式错误')
                return false
            }
            if (this.curSelTaxQualiLabel == '一般纳税人') {
                if (this.$u.test.isEmpty(this.taxCertificate)) {
                    this.$u.toast('请先上传纳税人资质证明')
                    return false
                }
            }

            // 分平台服务商信息验证（仅针对企业信息提交时的验证）
            if (this.dealerInfoObj.enterpriseType == 1) {
                if (this.$u.test.isEmpty(this.dealerInfoObj.authorizedPersonName)) {
                    this.$u.toast('分平台服务商姓名不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.authorizedPersonPhone)) {
                    this.$u.toast('分平台服务商联系电话不能为空')
                    return false
                }
                if (!this.$u.test.mobile(this.dealerInfoObj.authorizedPersonPhone)) {
                    this.$u.toast('分平台服务商联系电话格式错误')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.authorizedPersonIdNumber)) {
                    this.$u.toast('分平台服务商身份证号不能为空')
                    return false
                }
            }

            if (this.dealerInfoObj.enterpriseType == 2) {
                if (this.$u.test.isEmpty(this.dealerInfoObj.contactsName)) {
                    this.$u.toast('分平台服务商姓名不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.contactsPhone)) {
                    this.$u.toast('分平台服务商电话不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperIdCard)) {
                    this.$u.toast('分平台服务商证件号码不能为空')
                    return false
                }
                if (!this.$u.test.mobile(this.dealerInfoObj.contactsPhone)) {
                    this.$u.toast('分平台服务商电话格式错误')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperBankCard)) {
                    this.$u.toast('分平台服务商银行卡不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperBankCardName)) {
                    this.$u.toast('分平台服务商银行卡名称不能为空')
                    return false
                }
            }
            return true
        },

        // 分平台服务商银行卡信息校验
        validBankInfo: function () {
            if (this.dealerInfoObj.enterpriseType == 1) {
                if (this.$u.test.isEmpty(this.dealerInfoObj.settlementBankAccountInfoUrl)) {
                    this.$u.toast('基础存款账户信息图片不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.settlementBankBranchName)) {
                    this.$u.toast('对公账户开户行不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.settlementBankAccountNum)) {
                    this.$u.toast('对公银行账户不能为空')
                    return false
                }
            }
            if (this.dealerInfoObj.enterpriseType == 2) {
                if (this.$u.test.isEmpty(this.dealerInfoObj.contactsName)) {
                    this.$u.toast('分平台服务商姓名不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.contactsPhone)) {
                    this.$u.toast('分平台服务商电话不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperIdCard)) {
                    this.$u.toast('分平台服务商证件号码不能为空')
                    return false
                }
                if (!this.$u.test.mobile(this.dealerInfoObj.contactsPhone)) {
                    this.$u.toast('分平台服务商电话格式错误')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperBankCardName)) {
                    this.$u.toast('分平台服务商开户行不能为空')
                    return false
                }
                if (this.$u.test.isEmpty(this.dealerInfoObj.shopkeeperBankCard)) {
                    this.$u.toast('分平台服务商银行账号不能为空')
                    return false
                }
            }
            return true
        },
        // 提交银行卡信息修改
        handlerSubmit() {
            // 分平台服务商银行卡信息校验
            if (!this.validBankInfo()) {
                return
            }

            // 设置loading状态
            this.isSubmitBankLoading = true

            let params = {}
            if (this.dealerInfoObj.enterpriseType == 1) {
                params = {
                    type: 1,
                    enterpriseType: this.dealerInfoObj.enterpriseType,
                    settlementBankAccountName: this.dealerInfoObj.settlementBankAccountName,
                    settlementBankBranchName: this.dealerInfoObj.settlementBankBranchName,
                    settlementBankAccountNum: this.dealerInfoObj.settlementBankAccountNum,
                    settlementBankAccountInfoUrl: this.dealerInfoObj.settlementBankAccountInfoUrl
                }
            } else {
                params = {
                    type: 1,
                    enterpriseType: this.dealerInfoObj.enterpriseType,
                    shopkeeperIdCard: this.dealerInfoObj.shopkeeperIdCard,
                    contactsName: this.dealerInfoObj.contactsName,
                    contactsPhone: this.dealerInfoObj.contactsPhone,
                    shopkeeperBankCardName: this.dealerInfoObj.shopkeeperBankCardName,
                    shopkeeperBankCard: this.dealerInfoObj.shopkeeperBankCard
                }
            }
            dealerUpdateData(params).then((res) => {
                if (res.data.success) {
                    uni.navigateBack()
                    this.$u.toast('提交成功')
                    this.isSubmitBankLoading = false
                } else {
                    this.$u.toast(res.data.message || '提交失败')
                    this.isSubmitBankLoading = false
                }
            }).catch((err) => {
                this.$u.toast('提交失败，请稍后重试')
                this.isSubmitBankLoading = false
            })
        },
        // 上传证件
        handlerUpfile: function (e) {
            let _this = this
            let eType = e.currentTarget.dataset.type
            if (this.updateBankInfoFlagIsEdit && eType != 'settlementBankAccountInfoUrl') return
            // #ifdef APP-PLUS
            if (plus.os.name == 'Android') {
                this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
            }
            // #endif

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
                                    _this.dealerInfoObj.legalPersonName = ''
                                    _this.dealerInfoObj.legalPersonIdCard = ''
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.dealerInfoObj.legalPersonName = ocrRes.data.result.name
                                            _this.dealerInfoObj.legalPersonIdCard = ocrRes.data.result.idCardNumber
                                        } else {
                                            _this.filePersonPs = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'authorizedPersonIdCardPhoto') {
                                    _this.dealerInfoObj.authorizedPersonIdCardPhoto = data.result
                                    console.log(eType,_this.dealerInfoObj.authorizedPersonIdCardPhoto);
                                    uni.showLoading({ title: '正在识别信息' })
                                    idCardOcr({ idCardAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.dealerInfoObj.authorizedPersonName = ocrRes.data.result.name
                                            _this.dealerInfoObj.authorizedPersonIdNumber = ocrRes.data.result.idCardNumber
                                        } else {
                                            _this.dealerInfoObj.authorizedPersonIdCardPhoto = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else if (eType == 'authorizedPersonIdCardBackPhoto') {
                                    _this.dealerInfoObj.authorizedPersonIdCardBackPhoto = data.result
                                } else if (eType == 'person-dt') {
                                    _this.filePersonDt = data.result
                                } else if (eType == 'taxCertificate') {
                                    _this.taxCertificate = res.tempFilePaths[0]
                                    _this.dealerInfoObj.taxCertificateUrl = data.result
                                } else if (eType == 'authorization') {
                                    _this.authorization = data.result
                                } else if (eType == 'settlementBankAccountInfoUrl') {
                                    _this.dealerInfoObj.settlementBankAccountInfoUrl = data.result
                                    uni.showLoading({ title: '正在识别信息' })
                                    ocrBasicDepositAccount({ depositAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            // _this.dealerInfoObj.companyName = ocrRes.data.result.companyName
                                            _this.dealerInfoObj.settlementBankBranchName = ocrRes.data.result.bankName
                                            _this.dealerInfoObj.settlementBankAccountName = ocrRes.data.result.bankName
                                            _this.dealerInfoObj.settlementBankAccountNum = ocrRes.data.result.accountNumber.replace(/\s/g, '')
                                        } else {
                                            _this.settlementBankAccountInfoUrl = ''
                                            _this.$u.toast('未识别成功 ' + ocrRes.data.message)
                                        }
                                    })
                                } else {
                                    _this.fileCompany = res.tempFilePaths[0]
                                    // 注意：上传文件接口执行成功后渲染数组
                                    _this.dealerInfoObj.companyIdPhoto = data.result
                                    _this.dealerInfoObj.companyName = ''
                                    _this.dealerInfoObj.socialCreditCode = ''
                                    _this.dealerInfoObj.companyAddress = ''
                                    uni.showLoading({ title: '正在识别信息' })
                                    businessLicenseOcr({ businessLicenseAddress: data.result }).then((ocrRes) => {
                                        uni.hideLoading()
                                        if (ocrRes.data.code == 200) {
                                            _this.dealerInfoObj.companyName = ocrRes.data.result.unitName
                                            _this.dealerInfoObj.socialCreditCode = ocrRes.data.result.socialCreditCode
                                            _this.dealerInfoObj.companyAddress = ocrRes.data.result.address
                                        } else {
                                            _this.fileCompany = ''
                                            _this.dealerInfoObj.companyIdPhoto = ''
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
            console.log('权限已授权，可执行自己的代码逻辑了');
        },
        // 恢复重新编辑
        handlerRecovery() {
            // 请求接口赋值
            this.loadBaseData('recovery')
            // 解开禁用
            this.updateBankInfoFlagIsEdit = false
        }
    },
    onLoad: function () {
        this.loadBaseData()
        this.loadAgreement()
        // 初始化省市区
        this.loadInitProvince()
    },
    onShow: function () { }
}
</script>

<style lang="scss" scoped>
.popup-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    z-index: 999;
}

.container {
    background: #f1f1f1;
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

    .frm-comm {
        .lab {
            width: 240rpx !important;
        }

        .s-text {
            width: calc(100vw - 240rpx - 40rpx - 40rpx);
        }
    }

    .lnk-primary {
        border: unset;
    }
}
</style>
