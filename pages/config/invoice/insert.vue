<template>
    <view class="container">
        <view class="frm-comm">
            <view class="rs rs-line">
                <view class="lab">抬头类型</view>
                <view class="txt">
                    <view class="flex">
                        <picker mode="selector" @change="bindPickerType" :value="curInvoiceTypeIndex" :range="arrInvoice"
                            range-key="label">
                            <view class="in-picker" :class="{ 'in-picker_place': curInvoiceTypeLabel.length == 0 }">
                                {{ curInvoiceTypeLabel.length == 0 ? '请选择' : curInvoiceTypeLabel }}
                            </view>
                        </picker>
                    </view>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">发票抬头</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.titleName" type="text" placeholder="请输入发票抬头"
                            @input="loadCompanyInfo" @blur="hideCompanyList" />
                        <view class="company-list-box" v-if="isShowCompanyList">
                            <view class="company-list" v-for="(item, index) in companyList" :key="index">
                                <view class="name" @tap="selCompany(item)">{{ item.name }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">电子信箱</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.mailbox" type="text" placeholder="请输入电子信箱" />
                    </view>
                </view>
            </view>
            <view class="rs rs-line" v-if="objData.headerType == 'ENTERPRISE'">
                <view class="lab">纳税人识别号</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.unitTaxpayerIdentificationNumber" type="text"
                            placeholder="请输入纳税人识别号" />
                    </view>
                </view>
            </view>
            <view class="rs rs-line" v-if="objData.headerType == 'ENTERPRISE'">
                <view class="lab">单位地址</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.address" type="text" placeholder="请输入单位地址" />
                    </view>
                </view>
            </view>
            <view class="rs rs-line" v-if="objData.headerType == 'ENTERPRISE'">
                <view class="lab">单位电话</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.mobile" type="text" placeholder="请输入联系电话" />
                    </view>
                </view>
            </view>
            <view class="rs rs-line" v-if="objData.headerType == 'ENTERPRISE'">
                <view class="lab">开户银行</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.unitBank" type="text" placeholder="请输入开户银行" />
                    </view>
                </view>
            </view>
            <view class="rs rs-line" v-if="objData.headerType == 'ENTERPRISE'">
                <view class="lab">银行账户</view>
                <view class="txt">
                    <view class="flex">
                        <input class="s-text" v-model="objData.unitAccountNumber" type="text" placeholder="请输入银行账户" />
                    </view>
                </view>
            </view>
        </view>

        <view class="lnk-common lnk-primary" @tap="handlerSubmit">提交</view>
    </view>
</template>

<script>
import { addInvoiceTemplate, getCompanyInfo } from '../../../api/invoice'

export default {
    name: '',
    components: {},
    data() {
        return {
            isComplete: false,
            objData: {
                headerType: 'PERSONAL' // 抬头类型
            },

            curInvoiceTypeIndex: 0,
            curInvoiceTypeLabel: '个人',
            arrInvoice: [
                { label: '个人', value: 'PERSONAL' },
                { label: '企业', value: 'ENTERPRISE' }
            ],
            companyList: [], // 公司列表
            isShowCompanyList: false
        }
    },
    methods: {
        // 选择发票抬头类型
        bindPickerType: function (e) {
            this.curInvoiceTypeIndex = e.detail.value
            this.curInvoiceTypeLabel = this.arrInvoice[e.detail.value].label
            this.objData.headerType = this.arrInvoice[e.detail.value].value
        },
        // 根据公司名称获取公司信息
        loadCompanyInfo() {
            if (this.objData.headerType == 'PERSONAL' || !this.objData.titleName) {
                this.isShowCompanyList = false
                return
            }
            getCompanyInfo({ companyName: this.objData.titleName }).then((res) => {
                if (res.data.code == 200) {
                    this.companyList = res.data.result
                    if (this.companyList.length > 0) {
                        this.isShowCompanyList = true
                    } else {
                        this.isShowCompanyList = false
                    }
                } else {
                    this.$u.toast(res.data.message)
                }
            })
        },
        // 选择公司
        selCompany(item) {
            this.isShowCompanyList = false
            this.objData.titleName = item.name
            this.objData.unitTaxpayerIdentificationNumber = item.taxId
            this.objData.address = item.location
            this.objData.unitBank = item.bank
            this.objData.unitAccountNumber = item.bankAccount
            this.objData.mobile = item.mobilePhone
        },
        // 隐藏公司列表
		hideCompanyList() {
			setTimeout(() => {
				this.isShowCompanyList = false;
			}, 200);
		},
        // 提交保存
        handlerSubmit: function () {
            if (!this.objData.headerType) {
                this.$u.toast('请选择发票类型')
                return
            }
            if (!this.objData.titleName) {
                this.$u.toast('请填写发票抬头')
                return
            }

            if (!this.objData.mailbox) {
                this.$u.toast('请填写电子信箱')
                return
            }
            if (!this.$u.test.email(this.objData.mailbox)) {
                this.$u.toast('请输入正确的电子信箱地址')
                return
            }

            if (this.objData.headerType == 'ENTERPRISE') {
                if (!this.objData.unitTaxpayerIdentificationNumber) {
                    this.$u.toast('请填写纳税人识别号')
                    return
                }
                if (!this.objData.address) {
                    this.$u.toast('请填写单位地址')
                    return
                }
                if (!this.objData.mobile) {
                    this.$u.toast('请输入固定电话或手机号码')
                    return
                }
                if (!this.$u.test.mobile(this.objData.mobile) && !this.$u.test.TEL(this.objData.mobile)) {
                    this.$u.toast('请填写固定电话格式如区号-电话号码，或填写完整的手机号')
                    return
                }
                if (!this.objData.unitBank) {
                    this.$u.toast('请填写开户行')
                    return
                }
                if (!this.objData.unitAccountNumber) {
                    this.$u.toast('请填写银行账号')
                    return
                }
            }



            uni.showLoading({ title: '正在保存' ,mask:true})
            addInvoiceTemplate(this.objData).then((res) => {
                uni.hideLoading()
                if (res.data.code == 200) {
                    this.$u.toast('保存成功')
                    uni.navigateBack();
                    // uni.navigateTo({ url: '/pages/config/invoice/home' })
                } else {
                    this.$u.toast(res.data.message)
                }
            })
        }
    },
    onLoad: function () { },
    onShow: function () { }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20 rpx;
}

.company-list-box {
    background-color: #fff;
    position: absolute;
    z-index: 99;
    top: 88rpx;
    overflow: scroll;
    width: 76vw;
    min-height: 72rpx;
    max-height: 432rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2), 0 6rpx 20rpx rgba(0, 0, 0, 0.19);

    .company-list {
        padding: 0 24rpx;
        position: relative;

        &::after {
            position: absolute;
            content: '';
            left: 20rpx;
            right: 20rpx;
            bottom: 0;
            height: 3rpx;
            background: #ebedf0;
        }

        .name {
            white-space: nowrap;
            /* 确保文本在一行内显示 */
            overflow: hidden;
            /* 隐藏超出容器的文本 */
            text-overflow: ellipsis;
            /* 超出部分显示为省略号 */
            width: 70vw;
        }
    }
}</style>
