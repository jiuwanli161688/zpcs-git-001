<template>
    <u-popup closeable border-radius="28" @close="close" mode="bottom" height="80%" v-model="show">
        <div class="wrapper">
            <!-- 发票类型 -->
            <div class="invoice-title">发票类型</div>
            <div class="flex">
                <div class="invoice-item" @tap="handleClickInvoiceType(typeItem, index, invoiceType)"
                    :class="{ active: typeItem.active, disabled: typeItem.disabled }"
                    v-for="(typeItem, index) in invoiceType" :key="index">
                    {{ typeItem.title }}
                </div>
            </div>
            <div class="tips">
                {{ tips }}
            </div>
            <div class="divider"></div>
            <!-- 发票抬头 -->
            <div class="invoice-title">发票抬头</div>
            <div class="flex">
                <div class="invoice-item" @tap="handleClickHeader(headerItem, index, invoiceHeader)"
                    :class="{ active: headerItem.active, disabled: headerItem.disabled }"
                    v-for="(headerItem, index) in invoiceHeader" :key="index">
                    {{ headerItem.title }}
                </div>
            </div>
            <div>
                <div class="form-item" v-if="title == '单位'">
                    <span>企业发票模板</span>
                    <view @tap="toInvoiceTemplate">{{ selectedInvoiceTemplateLabel }}</view>
                </div>
                <div class="form-item" v-if="title == '单位'">
                    <span> {{ title }}名称</span>
                    <u-input :placeholder="'请输入' + title + '名称'" v-model="submitData.unitName" @input="loadCompanyInfo" @blur="hideCompanyList" />
                    <view class="company-list-box" v-if="isShowCompanyList">
                        <view class="company-list" v-for="(item, index) in companyList" :key="index">
                            <view class="name" @tap="selCompany(item)">{{ item.name }}</view>
                        </view>
                    </view>
                </div>
                <div class="form-item" v-if="title == '个人'">
                    <span> {{ title }}名称</span>
                    <u-input :placeholder="'请输入' + title + '名称'" v-model="submitData.receiptTitle" />
                </div>
                <div v-else>
                    <div class="form-item">
                        <span>纳税人识别号</span>
                        <u-input placeholder="请输入纳税人识别号" v-model="submitData.taxpayerId" />
                    </div>
                    <div class="form-item">
                        <span>单位地址</span>
                        <u-input placeholder="请输入单位地址" v-model="submitData.unitAddress" />
                    </div>
                    <div class="form-item">
                        <span>单位电话</span>
                        <u-input type="digit" placeholder="请输入单位电话" v-model="submitData.phone" />
                    </div>
                    <div class="form-item">
                        <span>开户银行</span>
                        <u-input placeholder="请输入开户银行" v-model="submitData.bankAccount" />
                    </div>
                    <div class="form-item">
                        <span>银行账户</span>
                        <u-input placeholder="请输入银行账户" v-model="submitData.bankAccountNo" />
                    </div>
                </div>

                <div class="form-item">
                    <span>电子邮箱</span>
                    <u-input placeholder="请输入电子邮箱" v-model="submitData.email" />
                </div>
            </div>
            <div class="divider"></div>
            <div class="invoice-title">发票信息</div>
            <div class="flex">
                <div class="invoice-item" @tap="handleClickHeader(goodsItem, index, goodsType)"
                    :class="{ active: goodsItem.active, disabled: goodsItem.disabled }"
                    v-for="(goodsItem, index) in goodsType" :key="index">
                    {{ goodsItem.title }}
                </div>
            </div>

            <div class="submit" @tap="submitInvoice()">确定</div>
        </div>
    </u-popup>
</template>
<script>
import { addReceipt } from '@/api/members'
import { getIseSetInvoice } from '@/api/invoice'
import { detailInvoiceTemplate, invoiceTemplate, getCompanyInfo } from '../../../api/invoice'
export default {
    props: ['res'],
    data() {
        return {
            selectedInvoiceTemplate: '',
            selectedInvoiceTemplateLabel: '请选择企业发票模板',
            submitData: {
                unitName: '', // 单位名称
                receiptTitle: '', // 个人名称
                taxpayerId: '', //纳税人
                receiptContent: '',
                unitAddress: '',
                phone: '',
                bankAccount: '',
                bankAccountNo: '',
                email: '',
                receiptType: 'GENERAL',
                receiptTitleType: 'PERSONAL'
            },
            invoiceTemplates: [],
            show: true,
            title: '个人',
            tips: '电子发票即电子增值税发票，是税局认可的有效凭证，其法律效力、基本用途及使用规定同纸质发票。',
            //   发票类型
            invoiceType: [
                {
                    title: '电子普通发票',
                    receiptType: 'GENERAL',
                    active: false
                },
                {
                    title: '增值税专用发票',
                    receiptType: 'SPECIAL',
                    active: false,
                    disabled: true
                }
            ],
            //   发票抬头
            invoiceHeader: [
                {
                    title: '个人',
                    active: false,
                    receiptTitleType: 'PERSONAL',
                    disabled: false
                },
                {
                    title: '单位',
                    receiptTitleType: 'COMPANY',
                    active: false,
                    disabled: false
                }
            ],
            //   商品类型
            goodsType: [
                {
                    title: '商品明细',
                    active: false
                }
                // {
                //   title: "商品类别",
                //   active: false,
                // },
            ],
            companyList: [], // 公司列表
            isShowCompanyList: false
        }
    },
    watch: {
        invoiceHeader: {
            handler(val) {
                val.forEach((item) => {
                    if (item.active == true) {
                        this.title = item.title
                    }
                })
            },
            deep: true
        },
        goodsType: {
            handler(val) {
                this.submitData.receiptContent = val.filter((item) => {
                    return item.active == true
                })[0].title
            },
            deep: true
        }
    },
    mounted() {
        if (this.res) {
            // this.submitData.unitAddress = this.res.unitAddress;
            // this.submitData.taxpayerId = this.res.taxpayerId; //纳税人

            this.submitData = this.res
            this.submitData.receiptContent = this.res.receiptContent

            if (this.res.receiptContent == '商品明细') {
                this.goodsType[0].active = true
            } else {
                this.goodsType[1].active = true
            }

            // 纳税人id
            if (this.res.taxpayerId) {
                this.invoiceHeader[1].active = true // 单位选中
            } else {
                this.invoiceHeader[0].active = true
            }

            this.invoiceType.forEach((item) => {
                if (this.res.receiptType == item.receiptType) {
                    item.active = true
                } else {
                    item.active = false
                }
            })

            // 增值税专用发票
            if (this.res.receiptType == 'SPECIAL') {
                this.invoiceHeader[0].active = false
                this.invoiceHeader[0].disabled = true
            }
        } else {
            this.invoiceHeader[0].active = true
            this.invoiceHeader[0].disabled = false
            this.goodsType[0].active = true
            this.invoiceType[0].active = true
            this.invoiceType[0].disabled = false
        }
        this.getIsEnterpriseSetInvoice()
    },
    methods: {
        // 根据公司名称获取公司信息
        loadCompanyInfo() {
            if (this.title == '个人' || !this.submitData.unitName) {
                this.isShowCompanyList = false
                return
            }
            getCompanyInfo({ companyName: this.submitData.unitName }).then((res) => {
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
            this.submitData.unitName = item.name
            this.submitData.taxpayerId = item.taxId
            this.submitData.unitAddress = item.location
            this.submitData.bankAccount = item.bank
            this.submitData.bankAccountNo = item.bankAccount
            this.submitData.phone = item.mobilePhone
        },
        // 隐藏公司列表
        hideCompanyList() {
            setTimeout(() => {
                this.isShowCompanyList = false;
            }, 200);
        },
        // 获取是否设置过企业发票模板
        getIsEnterpriseSetInvoice() {
            getIseSetInvoice().then((res) => {
                if (res.data.success) {
                    // res.result为true代表设置了企业发票，把disabled制成false
                    if (res.data.result) {
                        this.$set(this.invoiceType[1], 'disabled', false) // 使用this.$set更新数组中的元素
                        //加载用户的企业模板
                        invoiceTemplate().then((res) => {
                            this.invoiceTemplates = res.data.result
                        })
                    }
                }
            })
        },
        handleClickInvoiceType(val, index, arr) {
            if (val.disabled) {
                return
            }
            arr = arr.map((item) => {
                return (item.active = false)
            })
            val.active = true
            this.submitData.receiptType = val.receiptType
            // 增值税专用发票
            if (this.submitData.receiptType == 'SPECIAL') {
                this.invoiceHeader[1].active = true // 单位选中

                this.invoiceHeader[0].disabled = true // 个人不可选
                this.invoiceHeader[0].active = false // 个人不可选
                this.submitData.receiptTitleType = 'COMPANY'
            } else {
                this.invoiceHeader[0].disabled = false // 个人可选
                this.invoiceHeader[0].active = false // 个人不可选
                this.submitData.receiptTitleType = 'PERSONAL'
            }
        },
        pickInvoiceTemplate(e) {
            this.selectedInvoiceTemplate = e.id
            this.selectedInvoiceTemplateLabel = e.name
            //获取发票模板详情
            uni.showLoading()
            detailInvoiceTemplate({ id: e.id }).then((res) => {
                uni.hideLoading()
                if (res.data.code == 200) {
                    let result = res.data.result
                    this.submitData.unitName = result.titleName
                    this.submitData.taxpayerId = result.unitTaxpayerIdentificationNumber
                    this.submitData.unitAddress = result.address
                    this.submitData.phone = result.mobile
                    this.submitData.bankAccount = result.unitBank
                    this.submitData.bankAccountNo = result.unitAccountNumber
                    this.submitData.email = result.mailbox
                } else {
                    this.$u.toast('加载失败')
                }
            })
        },
        handleClickHeader(val, index, arr) {
            arr = arr.map((item) => {
                return (item.active = false)
            })
            val.active = true
            if (val.receiptTitleType) {
                this.submitData.receiptTitleType = val.receiptTitleType
            }
            if (this.submitData.receiptType == 'SPECIAL') {
                this.invoiceHeader[1].active = true
                this.invoiceHeader[1].disabled = false
                this.invoiceHeader[0].disabled = true
                this.invoiceHeader[0].active = false
            }
        },
        toInvoiceTemplate() {
            uni.navigateTo({ url: '/pages/config/invoice/home?mode=select' })
        },
        /**
         * 监听关闭
         */
        close(val) {
            this.$emit('closeInvoice', val)
        },
        submitInvoice() {
            /**
             * 验证
             */
            const { unitName, receiptTitle, taxpayerId, receiptContent, email, phone, unitAddress, bankAccount, bankAccountNo, receiptType } = this.submitData
            if (this.$u.test.isEmpty(receiptType)) {
                uni.showToast({
                    title: '请您选择发票类型!',
                    duration: 2000,
                    icon: 'none'
                })
                return false
            }
            if (this.invoiceHeader[0].active == true) {
                if (this.$u.test.isEmpty(receiptTitle)) {
                    uni.showToast({
                        title: '请您填写个人名称!',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
            } else {
                if (this.$u.test.isEmpty(unitName)) {
                    uni.showToast({
                        title: '请您填写单位名称!',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
                if (!this.$u.test.isEmpty(unitName) && this.$u.test.isEmpty(taxpayerId)) {
                    uni.showToast({
                        title: '请您填写纳税人识别号!',
                        duration: 2000,
                        icon: 'none'
                    })

                    return false
                }
                if (this.$u.test.isEmpty(unitAddress)) {
                    uni.showToast({
                        title: '请您填写单位地址!',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
                if (this.$u.test.isEmpty(phone)) {
                    uni.showToast({
                        title: '请输入固定电话或手机号码',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
                if (!this.$u.test.mobile(phone) && !this.$u.test.TEL(phone)) {
                    this.$u.toast('请填写固定电话格式如区号-电话号码，或填写完整的手机号')
                    return
                }
                if (this.$u.test.isEmpty(bankAccount)) {
                    uni.showToast({
                        title: '请您填写开户行!',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
                if (this.$u.test.isEmpty(bankAccountNo)) {
                    uni.showToast({
                        title: '请您填写银行账号!',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false
                }
            }

            if (this.$u.test.isEmpty(email)) {
                uni.showToast({
                    title: '请您填写电子信箱!',
                    duration: 2000,
                    icon: 'none'
                })
                return false
            }
            this.show = false
            if (this.title == '个人') {
                const obj = {
                    unitName: '', // 单位名称
                    taxpayerId: '', //纳税人
                    unitAddress: '',
                    phone: '',
                    bankAccount: '',
                    bankAccountNo: '',
                    receiptType: 'GENERAL',
                    receiptTitleType: 'PERSONAL'
                }
                this.submitData = { ...this.submitData, ...obj }
            } else {
                this.submitData.receiptTitle = ''
            }
            this.$emit('callbackInvoice', this.submitData)
            this.close(this.submitData)
        }
    }
}
</script>
<style scoped lang="scss">
.form-item {
    display: flex;
    margin: 30rpx 0;
    align-items: center;
    position: relative;

    >span {
        margin-right: 50rpx;
    }
}

.submit {
    width: 100%;
    margin-top: 100rpx;
    background: $main-color;
    text-align: center;
    line-height: 80rpx;
    height: 80rpx;
    margin: 100rpx auto 0 auto;
    color: #f2f2f2;
    border-radius: 100px;
}

.invoice-item {
    margin-right: 30rpx;
    color: #333;
    font-weight: 24rpx;

    padding: 12rpx 46rpx;
    border-radius: 100px;
    background: #eee;
    min-width: 100rpx;
    text-align: center;
}

.active {
    font-weight: bold;
    color: $main-color;
    border: 2rpx solid $main-color;
    background: rgba($color: $main-color, $alpha: 0.1);
}

.disabled {
    color: #b5b5b6;
}

.wrapper {
    padding: 30rpx;
}

.invoice-title {
    margin-bottom: 30rpx;
    font-weight: bold;
    font-size: 30rpx;
}

.tips {
    margin-top: 30rpx;
    color: #999;
    font-size: 24rpx;
}

.divider {
    margin: 30rpx 0;
    height: 1rpx;
    border-bottom: 1px solid #f2f3f5;
}

.flex {
    display: flex;
}

.company-list-box {
    background-color: #fff;
    position: absolute;
    z-index: 99;
    top: 88rpx;
    right: 0;
    overflow: scroll;
    width: 76vw;
    min-height: 72rpx;
    max-height: 432rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2), 0 6rpx 20rpx rgba(0, 0, 0, 0.19);

    .company-list {
        padding: 0 24rpx;
        position: relative;
        height: 72rpx;
        line-height: 72rpx;
        font-size: 28rpx;

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
}
</style>
