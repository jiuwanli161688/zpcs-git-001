<template>
    <view class="container">
        <view class="frm-comm">
            <view class="rs">
                <view class="lab">转账金额</view>
                <view class="flex">
                    <input class="s-text" v-model="form.transferMoney" type="number" placeholder="请输入转账金额" />
                </view>
            </view>
            <view class="rs">
                <view class="lab">转账时间</view>
                <view class="txt flex">
                    <view class="s-text" :class="{ 'time-input-empty': !form.transferDate }" @tap="showBirthday = true">{{
                        form.transferDate || '请选择转账时间' }}</view>
                    <u-picker v-model="showBirthday" mode="time" :params="{
                        year: true,
                        month: true,
                        day: true,
                    }" @confirm="handleTransferDate"></u-picker>
                </view>
            </view>
            <view class="rs">
                <view class="lab">转账银行</view>
                <view class="flex">
                    <input class="s-text" v-model="form.transferBank" type="idcard" placeholder="请输入转账银行" />
                </view>
            </view>
            <view class="rs">
                <view class="lab">转账银行账号</view>
                <view class="flex">
                    <input class="s-text" v-model="form.transferBankNumber" type="number" placeholder="请输入转账银行账号" />
                </view>
            </view>
            <view class="rs">
                <view class="lab">转账留言</view>
                <view class="flex">
                    <input class="s-text" v-model="form.transferMessage" type="text" placeholder="请输入转账留言" />
                </view>
            </view>
            <!-- <view class="rs">
                <view class="lab">转账类型</view>
                <view class="txt flex">
                    <input class="s-text" v-model="depositTransferTypeLabel" placeholder="请选择转账类型" @tap="depositTransferTypeShow = true" />
                    <u-picker
                        mode="selector"
                        v-model="depositTransferTypeShow"
                        :range="depositTransferTypeOption"
                        range-key="label"
                        @confirm="handleDepositTransferType"
                    ></u-picker>
                </view>
            </view> -->
            <view class="frm-comm">
                <view class="frm-title">附件图片</view>
                <view class="min-photo">
                    <view class="col-06">
                        <view class="rs-file" data-type="person-ps" @tap="handlerUpfile">
                            <image class="ico" mode="aspectFit" :src="iconCamera" v-if="form.attachment.length == 0">
                            </image>
                            <image class="file-person" :src="form.attachment" mode="scaleToFill"
                                v-if="form.attachment.length > 0"></image>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="lnk-common lnk-primary" @tap="handlerSave">提交</view>
        <!-- #ifdef APP-PLUS -->
        <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
        <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
        <!-- #endif -->
    </view>
</template>

<script>
import { depositPayment } from '@/api/distributor.js'
import storage from '@/utils/storage.js'
import { uploadPrivateFile } from '@/api/common.js'
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
export default {
    name: '',
    components: {
        ykAuthpup
    },
    data() {
        return {
            isComplete: false,
            iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
            showBirthday: false,
            depositTransferTypeShow: false,
            form: {
                transferMoney: '', // 转账金额
                transferDate: '', // 转账时间
                transferBank: '', // 转账银行
                transferBankNumber: '', // 转账银行账号
                attachment: '', // 附件图片
                transferMessage: '', // 转账留言
                depositTransferType: '' // 转账类型
            },
            // depositTransferTypeLabel: '', // 转账类型
            depositTransferTypeOption: [
                {
                    value: 'SETTLED',
                    label: '入驻转账'
                },
                {
                    value: 'DEDUCTION_DEPOSIT',
                    label: '抵扣保证金'
                },
                {
                    value: 'DEDUCTION_PENALTY',
                    label: '抵扣罚款'
                },
                {
                    value: 'DEDUCTION_PAYMENT',
                    label: '抵扣货款'
                },
                {
                    value: 'DEDUCTION_SHIPPING',
                    label: '抵扣运费'
                },
                {
                    value: 'EVACUATE',
                    label: '退出平台'
                }
            ], // 转账类型
            isCanSubmit: true, //默认可点击
            maxMoney: 0,// 可缴纳的最大金额
        }
    },
    methods: {
        // handleDepositTransferType(e) {
        //     this.form.depositTransferType = this.depositTransferTypeOption[e[0]].value
        //     this.depositTransferTypeLabel = this.depositTransferTypeOption[e[0]].label
        // },
        // 选择时间回调
        handleTransferDate(e) {
            this.form.transferDate = `${e.year}-${e.month}-${e.day}`
        },
        // 上传
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
                    let tempFilePaths = res.tempFilePaths
                    // 调用文件上传接口
                    uni.uploadFile({
                        url: uploadPrivateFile,
                        filePath: tempFilePaths[0],
                        name: 'file',
                        header: {
                            accessToken: storage.getAccessToken()
                        },
                        success: (uploadFileRes) => {
                            let data = JSON.parse(uploadFileRes.data)
                            _this.form.attachment = data.result
                        }
                    })
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
        handlerSave: function () {
            let form = this.form
            if (!form.transferMoney) {
                this.$u.toast('请输入转账金额')
                return
            }
            if (form.transferMoney > this.maxMoney) {
                this.$u.toast('转账金额不能大于未缴纳金额')
                return
            }
            if (!form.transferDate) {
                this.$u.toast('请输入转账时间')
                return
            }
            if (!form.transferBank) {
                this.$u.toast('请输入转账银行')
                return
            }
            if (!form.transferBankNumber) {
                this.$u.toast('请输入转账银行账号')
                return
            }
            if (!form.attachment) {
                this.$u.toast('请上传附件图片')
                return
            }
            // if (!form.depositTransferType) {
            //     this.$u.toast('请选择转账类型')
            //     return
            // }

            if (!this.isCanSubmit) return
            this.isCanSubmit = false
            depositPayment(this.form).then((res) => {
                if (res.data.success) {
                    this.$u.toast('提交成功')
                    uni.navigateBack()
                }
                this.isCanSubmit = true
            })
        }
    },
    onLoad: function (option) {
        this.maxMoney = option.maxMoney
    },
    onShow: function () { }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
}

.frm-comm .rs-file {
    background-color: #F7F8FA;
}

.ico {
    width: 100rpx;
    height: 100rpx;
}


.time-input-empty {
    color: grey;
}
</style>
