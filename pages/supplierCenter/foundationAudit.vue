<template>
    <view class="container">
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">企业信息</view>
            </view>
            <view class="min-photo">
                <view class="col-12">
                    <view class="rs-file" data-type='company'>
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
                    placeholder="请输入统一社会信用代码"  disabled />
            </view>
            <view class="rs rs-line">
                <picker mode="multiSelector" :range="newProvince" :value="curSelected"
                 disabled>
                    <view class="s-text" :class="{ 's-text_place': curSelectedLabel[0].length == 0 }">{{ provinceText }}
                    </view>
                </picker>
            </view>
            <view class="rs rs-line">
                <u-checkbox v-model="objData.longterm" disabled>营业执照长期有效</u-checkbox>
            </view>
            <view v-show="!objData.longterm" class="rs rs-line">
                <picker mode="date" :value="endTime" disabled>
                    <view class="uni-input">{{ endTime ? endTime : '请选择营业执照到期时间' }}</view>
                </picker>
            </view>
            <view class="rs rs-line">
                <input class="s-text" v-model="objData.storeAddressDetail" type="text" placeholder-class="s-text_place"
                    placeholder="请输入企业详细经营地址" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.companyEmail" placeholder-class="s-text_place"
                    placeholder="请输入企业邮箱" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.channelManagerName" placeholder-class="s-text_place"
                    placeholder="请输入渠道负责人" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.channelManagerPhone" placeholder-class="s-text_place"
                    placeholder="请输入渠道负责人电话" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.afterSaleManagerName" placeholder-class="s-text_place"
                    placeholder="请输入售后负责人" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.afterSaleManagerPhone" placeholder-class="s-text_place"
                    placeholder="请输入售后负责人电话" disabled />
            </view>
        </view>

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
                    placeholder="请输入企业法人姓名" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalId" placeholder-class="s-text_place"
                    placeholder="请输入法人身份证号" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.legalPhone" placeholder-class="s-text_place"
                    placeholder="请输入法人联系电话" disabled />
            </view>

        </view>

        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">联系人信息</view>
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.linkName" placeholder-class="s-text_place"
                    placeholder="请输入联系人姓名" disabled />
            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.linkPhone" placeholder-class="s-text_place"
                    placeholder="请输入联系人电话" disabled />
            </view>
        </view>
    </view>
</template>

<script>

import { getRegionsById } from "@/api/common.js";
import { getReturnAndWaitCompanyInfo } from "@/api/store";
export default {
    name: '',
    components: {

    },
    computed: {
        provinceText: function () {
            return this.curSelectedLabel[0].length == 0 ? '请选择企业归属地区' : `${this.curSelectedLabel[0]} / ${this.curSelectedLabel[1]} / ${this.curSelectedLabel[2]}`
        },
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

        loadBaseData(type) {
            uni.showLoading();
            getReturnAndWaitCompanyInfo().then(res => {
                if (res.data.code == 200) {
                    this.objData = { ...res.data.result };
                    this.endTime = this.objData.endTime;
                    this.fileCompany = this.objData.licencePhoto ? this.objData.licencePhoto : '';
                    this.filePersonDt = this.objData.legalPhotoBack ? this.objData.legalPhotoBack : '';
                    this.filePersonPs = this.objData.legalPhoto ? this.objData.legalPhoto : '';
                    this.curSelectedValue = this.objData.storeAddressIdPath ? this.objData.storeAddressIdPath.split(',') : [];
                    this.curSelectedLabel = this.objData.storeAddressPath ? this.objData.storeAddressPath.split(',') : ['', '', ''];
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
