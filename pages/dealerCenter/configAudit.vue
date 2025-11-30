<template>
    <view class="container">
        <!-- 判断下是否通过审核，为通过时显示tips -->
        <view v-if="dealerInfoObj.updateInfoStatus == 2" class="tips">{{ dealerInfoObj.updateBankInfoRejectReason }}
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

            </view>
            <view class="rs rs-line">
                <view class="lab">企业名称</view>
                <view class="txt flex">
                    <input disabled class="s-text"
                        v-model="dealerInfoObj.companyName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">企业税号</view>
                <view class="txt flex">
                    <input disabled class="s-text" v-model="dealerInfoObj.socialCreditCode" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <u-checkbox disabled v-model="dealerInfoObj.longterm">营业执照长期有效</u-checkbox>
            </view>
            <view v-show="!dealerInfoObj.longterm" class="rs rs-line">
                <picker mode="date" :value="dealerInfoObj.endTime" disabled>
                    <view class="uni-input">{{ dealerInfoObj.endTime ? dealerInfoObj.endTime : '请选择营业执照到期时间' }}</view>
                </picker>
            </view>
            <view class="rs rs-line">
                <view class="lab">纳税资质</view>
                <view class="txt flex">
                    <picker mode="selector" :range="taxQualiOptionList" :value="curSelTaxQualiIndex" disabled
                      range-key="label">
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
                    <input disabled class="s-text"
                        v-model="dealerInfoObj.legalPersonName" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">法人身份证号</view>
                <view class="txt flex">
                    <input disabled class="s-text"
                        v-model="dealerInfoObj.legalPersonIdCard" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">法人电话</view>
                <view class="txt flex">
                    <input disabled class="s-text"
                        v-model="dealerInfoObj.legalPersonPhone" type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">所在地</view>
                <view class="txt flex">
                    <picker disabled mode="multiSelector"
                        :range="newProvince" :value="curSelected" >
                        <view class="s-text" :class="{ 's-text_place': !curSelectedLabel[0] }">{{ provinceText }}</view>
                    </picker>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">详细地址</view>
                <view class="txt flex">
                    <input disabled class="s-text"
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
                            <input disabled class="s-text"
                                v-model="dealerInfoObj.authorizedPersonName" type="text" placeholder="请输入" />
                        </view>
                    </view>
                    <view class="rs">
                        <view class="lab">电话</view>
                        <view class="txt flex">
                            <input disabled class="s-text"
                                v-model="dealerInfoObj.authorizedPersonPhone" type="text" placeholder="请输入" />
                        </view>
                    </view>
                    <view class="rs">
                        <view class="lab">身份证号</view>
                        <view class="txt flex">
                            <input disabled class="s-text"
                                v-model="dealerInfoObj.authorizedPersonIdNumber" type="text" placeholder="请输入" />
                        </view>
                    </view>
                </view>
            </view>

        </view>

    </view>
</template>

<script>
import { getRegionsById } from '@/api/common.js'
import storage from '@/utils/storage.js'
import { getReturnAndWaitCompanyInfo } from '@/api/dealerCenter.js'
export default {
    name: '',
    components: {

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
        handlerUpfile(e) {
            console.log(e,'e');
        },
        loadBaseData() {
            uni.showLoading()
            getReturnAndWaitCompanyInfo().then((res) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.code == 200) {
                    this.isComplete = true
                    this.dealerInfoObj = res.data.result
                    this.curSelectedValue = this.dealerInfoObj.companyRegionId?.split(',')
                    this.curSelectedLabel = this.dealerInfoObj.companyRegion?.split(',') ? this.dealerInfoObj.companyRegion?.split(',') : []
                    let companyRegionIds = this.dealerInfoObj.companyRegionId.split(',')
                    this.dealerInfoObj.companyProvinceId = companyRegionIds[0]
                    this.dealerInfoObj.companyCityId = companyRegionIds[1]
                    this.dealerInfoObj.companyCountryId = companyRegionIds[2]

                    if (this.dealerInfoObj.taxQuali == 0 || this.dealerInfoObj.taxQuali) {
                        this.curSelTaxQualiLabel = this.dealerInfoObj.taxQuali == '1' ? '一般纳税人' : '小规模纳税人'
                        this.curSelTaxQualiIndex = this.dealerInfoObj.taxQuali == '1' ? 0 : 1
                        this.dealerInfoObj.taxQuali = this.dealerInfoObj.taxQuali == '1' ? 0 : 1
                    }
                    this.taxCertificate = this.dealerInfoObj.taxCertificateUrl ? this.dealerInfoObj.taxCertificateUrl : ''
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
    },
    onLoad: function () {
        this.loadBaseData()
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
        font-size: 26rpx;
        color: #fc8d00;
        padding: 20rpx;
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
