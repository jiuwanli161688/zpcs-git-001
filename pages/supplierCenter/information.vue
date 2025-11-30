<template>
    <view class="container">
        <view class="frm-sign">
            <view class="frm-title">
                <view class="name">企业信息</view>

            </view>
            <view class="rs rs-line">
                <input class="s-text" type="text" v-model="objData.companyName" placeholder-class="s-text_place"
                    placeholder="请输入企业名称" />
            </view>
        </view>
        <view class="frm-sign">
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
        </view>
        <view class="lnk-common lnk-primary" @tap="handlerSubmit">提交</view>

    </view>
</template>

<script>
import { updateInformation, getStoreInfo } from "@/api/store";
export default {
    name: '',
    components: {

    },
    data() {
        return {
            isComplete: false,

            objData: {

            },
            submitting: false,
        }
    },
    methods: {

        // 提交资料
        handlerSubmit: function () {
            if (!this.submitting) {
                this.submitting = true;
                this.objData.type = '2'
                let that = this;
                if (this.valid()) {
                    uni.showLoading({ title: "正在保存" })
                    updateInformation(this.objData).then(res => {
                        uni.hideLoading();
                        if (res.data.code == 200) {
                            if (res.data.result) {
                                uni.redirectTo({
                                    url: '/pages/supplierCenter/verify'
                                })
                            } else {
                                this.$u.toast('修改成功!')
                                setTimeout(() => {
                                    uni.reLaunch({
                                        url: '/pages/tabbar/user/profile'
                                    })
                                }, 1000)
                            }
                        } else {
                            that.$u.toast(res.data.message)
                        }
                        that.submitting = false;
                    })
                } else {
                    this.submitting = false;
                }
            }

        },
        valid: function () {
            if (this.$u.test.isEmpty(this.objData.companyName)) {
                this.$u.toast("企业名称不能为空，请检查");
                return false;
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankAccountName)) {
                this.$u.toast("对公账户银行名称不能为空");
                return false;
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankBranchName)) {
                this.$u.toast("对公账户开户行不能为空");
                return false;
            }
            if (this.$u.test.isEmpty(this.objData.settlementBankAccountNum)) {
                this.$u.toast("对公银行账户不能为空");
                return false;
            }
            return true;
        },
    },
    onLoad: function (options) {
        uni.showLoading();
        getStoreInfo().then(res => {
            if (res.data.code == 200) {
                this.objData = res.data.result;
                uni.hideLoading();
                if (options.text != 1) {
                    if (this.objData.updateBankInfoFlag == '3') {
                        uni.redirectTo({
                            url: '/pages/supplierCenter/verify'
                        })
                    }
                    if (this.objData.updateBankInfoFlag == '0') {
                        uni.redirectTo({
                            url: '/pages/supplierCenter/status?type=1'
                        })
                    }
                    if (this.objData.updateBankInfoFlag == '2') {
                        uni.redirectTo({
                            url: '/pages/supplierCenter/status?type=1'
                        })
                    }
                }
            } else {
                this.$u.toast(res.data.message);
            }
        })
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
}
</style>
