<template>
    <view class="container">
        <view class="frm-comm">
            <view class="rs rs-line">
                <view class="lab">用户名</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.username" type="text" placeholder="请输入" />
                </view>
            </view>

            <view class="rs rs-line">
                <view class="lab">密码</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.password" password type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">确认密码</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.confirmPassword" password type="text" placeholder="请输入" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">手机号</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.mobilePhone" type="tel" placeholder="请输入" maxlength="11" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">验证码</view>
                <view class="txt flex">
                    <input class="s-code" v-model="form.code" type="text" placeholder="请输入" />
                    <view class="s-link" @tap="sendSMS">{{ btnSmsText }}</view>
                </view>
            </view>
            <view class="rs">
                <view class="lab">服务商编码</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.distributorNumber" type="text" placeholder="请输入分平台服务商编码" />
                </view>
            </view>
        </view>
        <view class="tips-notice">
            <image :src="iconTips" mode="aspectFit" class="icon"></image>
            <view class="text">请输入要绑定的服务商编号，不填则默认绑定平台</view>
        </view>
        <view class="lnk-common lnk-primary" @tap="handlerLink">提交注册</view>
        <view class="tips">
            <checkbox-group @change="checkboxChange">
                <label>
                    <checkbox :checked="isAgree" style="transform: scale(0.7)"></checkbox>
                </label>
            </checkbox-group>
            <view class="txt">注册或者登录即代表您同意</view>
            <view class="lnk" data-type="USER_AGREEMENT" @tap="handlerLicense">《用户协议》</view>
            <view class="txt">和</view>
            <view class="lnk" data-type="PRIVACY_POLICY" @tap="handlerLicense">《隐私政策》</view>
        </view>
        <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="REGISTER" />
    </view>
</template>

<script>
import myVerification from '@/components/verification/verification.vue' //验证码模块
import { sendMobile, userRegister } from '../../api/login'
import { md5 } from '@/utils/md5.js'
import { getUserInfo } from "@/api/members"; //验证码模块
import storage from '@/utils/storage.js';

export default {
    name: '',
    components: {
        myVerification
    },
    data() {
        return {
            isComplete: false,
            smsSecond: 59,
            isSmsDisable: false, // 能否点击发送验证码
            btnSmsText: '获取验证码',
            form: {
                username: '', // 账号
                password: '', // 密码
                confirmPassword: '', // 确认密码
                mobilePhone: '', // 手机号
                code: '', // 验证码
                distributorNumber: '', // 分平台服务商编号

            },
            codeFlag: true, //验证开关，用于是否展示验证码
            flage: false, //是否验证码验证
            iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
            isAgree: false, //是否同意协议


        }
    },
    watch: {
        async flage(val) {
            if (val) {
                // 向后端请求验证码
                uni.showLoading({})
                let res = await sendMobile(this.form.mobilePhone, 'REGISTER')
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.success) {
                    this.btnSmsText = '60s后获取'
                    this.isSmsDisable = true // 开始时禁用按钮
                    let s = 60 // 倒计时秒数，根据需要调整
                    let counter = setInterval(() => {
                        s -= 1 // 先减少秒数
                        if (s === 0) {
                            this.btnSmsText = '重新获取' // 倒计时结束，更新按钮文案
                            this.isSmsDisable = false // 启用按钮
                            this.codeFlag = true // 组件制成true，重新渲染下组件
                            clearInterval(counter) // 清除计时器
                        } else {
                            this.btnSmsText = `${s}s后获取` // 更新按钮文案显示剩余秒数
                        }
                    }, 1000)
                    this.flage = false
                    this.codeFlag = false
                } else {
                    uni.showToast({
                        title: res.data.message,
                        duration: 2000,
                        icon: 'none'
                    })
                    this.flage = false
                    // 请求失败后也重置滑块验证
                    this.$refs.verification.getCode()
                    // 重置倒计时逻辑，允许用户重新尝试
                    this.isSmsDisable = false
                    this.btnSmsText = '获取验证码'
                }
            } else {
                this.$refs.verification.hide()
            }
        }
    },
    methods: {
        //同意协议
        checkboxChange(e) {
            this.isAgree = !this.isAgree
        },
        // 验证码验证
        verification(val) {

            this.flage = val == this.$store.state.verificationKey ? true : false
        },
        // 发送验证码
        async sendSMS() {
            let _this = this
            if (_this.isSmsDisable) {
                this.$u.toast('请倒计时结束后再发送!')
                return
            }
            if (!_this.form.mobilePhone) {
                this.$u.toast('手机号不能为空!')
                return
            }

            if (!this.$u.test.mobile(_this.form.mobilePhone)) {
                this.$u.toast('请填写正确手机号!')
                return false
            }

            if (this.btnSmsText == '重新获取') {
                if (!this.codeFlag) {
                    setTimeout(() => {
                        if (this.$refs.verification) {
                            this.$refs.verification.error() //发送
                        }
                    }, 100)
                }
            }

            if (!this.flage) {
                this.$refs.verification.error() //发送
                return false
            }
        },

        // 跳转绑定店铺
        // 提交注册
        handlerLink: function () {
            if (!this.form.username) {
                this.$u.toast('用户名不能为空!')
                return
            }
            // 用户名校验：只允许字母+数字，不允许@，不允许纯数字
            const usernameRegex = /^[a-zA-Z0-9]+$/
            const onlyNumbersRegex = /^[0-9]+$/

            if (!usernameRegex.test(this.form.username)) {
                this.$u.toast('用户名只能包含字母和数字!')
                return
            }
            if (onlyNumbersRegex.test(this.form.username)) {
                this.$u.toast('用户名不能为纯数字!')
                return
            }
            if (!this.form.password) {
                this.$u.toast('密码不能为空!')
                return
            }
            if (!this.$u.test.password(this.form.password)) {
                this.$u.toast('密码为8~20位数字和字母组合!')
                return
            }
            if (!this.form.confirmPassword) {
                this.$u.toast('请在再次输入密码!')
                return
            }
            if (this.form.confirmPassword != this.form.password) {
                this.$u.toast('两次输入的密码不一致!')
                return
            }
            if (!this.form.mobilePhone) {
                this.$u.toast('手机号不能为空!')
                return
            }
            if (!this.form.code) {
                this.$u.toast('验证码不能为空!')
                return
            }
            // if (!this.form.distributorNumber) {
            //     this.$u.toast('请输入分平台服务商编码')
            //     return
            // }
            if (this.form.distributorNumber && this.form.distributorNumber != 1 && this.form.distributorNumber.length != 7) {
                return this.$u.toast("服务商编码格式不正确")
            }
            // const formData = {
            //     ...this.form,
            //     password: md5(this.form.password)
            // }
            if (!this.isAgree) {
                this.$u.toast('请阅读并同意服务协议!')
                return
            }
            let params = {
                username: this.form.username,
                password: md5(this.form.password),
                mobilePhone: this.form.mobilePhone,
                code: this.form.code,
                distributorNumber: this.form.distributorNumber
            }
            let systemInfo = uni.getSystemInfoSync();
            let platform = systemInfo.uniPlatform;
            if (platform === 'app') {
                params.registerSource = 'APP'
            } else if (platform === 'mp-weixin') {
                params.registerSource = 'WECHAT_MP'
            } else if (platform === 'web') {
                params.registerSource = 'H5'
            } else {
                params.registerSource = 'UNKNOWN'
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            // 请求注册接口
            userRegister(params).then((res) => {
                if (res.data.success) {
                    storage.setAccessToken(res.data.result.accessToken)
                    storage.setRefreshToken(res.data.result.refreshToken)
                    if (uni.getStorageSync('distributorNumber')) {
                        uni.removeStorageSync('distributorNumber')
                    }
                    // uni.reLaunch({
                    //     url: "/pages/tabbar/user/profile",
                    // });
                    getUserInfo().then((user) => {
                        if (user.data.success) {
                            /**
                             * 个人信息存储到缓存userInfo中
                             */
                            storage.setUserInfo(user.data.result)
                            storage.setHasLogin(true)
                            storage.setAutoCp(0)
                            // 登录成功
                            this.$u.toast("注册成功");
                            uni.hideLoading()
                            uni.reLaunch({
                                url: "/pages/tabbar/user/profile",
                            });
                        } else {
                            uni.hideLoading()
                            uni.reLaunch({
                                url: '/pages/tabbar/home/index'
                            })
                        }
                    }).catch(() => {
                        uni.hideLoading()
                    })
                    // 跳转绑定店铺
                    // uni.redirectTo({
                    // 	url: '/pages/login/shop'
                    // })

                } else {
                    uni.hideLoading()
                }
            }).catch(() => {
                uni.hideLoading()
            })


        },
        // 跳转协议
        handlerLicense: function (e) {
            let eType = e.currentTarget.dataset.type
            uni.navigateTo({ url: `/pages/profile/license?type=${eType}` })
        },
    },
    onLoad: function () {
        // 如果有服务商编号，说明当前用户是被邀请过来的，给接口传参
        if (uni.getStorageSync('distributorNumber')) {
            this.form.distributorNumber = uni.getStorageSync('distributorNumber')
        }
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

.tips-notice {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 48rpx;
    box-sizing: content-box;

    .icon {
        width: 32rpx;
        height: 32rpx;
        margin: 4rpx 12rpx 0 0;
    }

    .text {
        font-size: 24rpx;
        color: #888;
        line-height: 40rpx;
    }
}

.tips {
    font-size: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 80rpx;

    .txt {
        color: #999;
    }

    .lnk {
        color: #3173c7;
    }
}
</style>
