<template>
    <view class="container" :style="{ '--bg-url': `url(${bgUrl})` }">
        <view class="main">
            <view class="logo">
                <image :src="iconLogo" class="icon" mode="aspectFit"></image>
            </view>
            <view class="tabs">
                <view class="item" :class="{ 'item-hov': isCodeLogin }" @tap="handlerChangeMode" :data-mode="0">手机验证码登录
                </view>
                <view class="item" :class="{ 'item-hov': !isCodeLogin }" @tap="handlerChangeMode" :data-mode="1">帐号密码登录
                </view>
            </view>
            <!-- 手机验证码登录表单 -->
            <view class="form" v-if="isCodeLogin">
                <view class="rs">
                    <input class="text" type="text" v-model="form.mobile" placeholder="请输入手机号" />
                </view>
                <view class="rs">
                    <input class="code" type="text" v-model="form.code" maxlength="6" placeholder="请输入验证码" />
                    <view class="link" @tap="sendSMS">{{ btnSmsText }}</view>
                </view>
            </view>
            <!-- 账号密码登录表单 -->
            <view class="form" v-if="!isCodeLogin">
                <view class="rs">
                    <input class="text" type="text" v-model="form.username" placeholder="请输入账号/手机号/信箱" />
                </view>
                <view class="rs">
                    <input class="text" type="text" v-model="form.password" password placeholder="请输入登录密码" />
                </view>
            </view>
            <!-- <button class="lnk-common lnk-primary" :loading="loading" @tap="login">登录</button> -->
            <!-- #ifdef APP -->
            <button class="lnk-common lnk-primary" :loading="loading" @tap="login('APP')">登录</button>
            <!-- #endif -->
            <!-- #ifdef H5 -->
            <button class="lnk-common lnk-primary" :loading="loading" @tap="login('H5')">登录</button>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <button class="lnk-common lnk-primary" :loading="loading" @tap="login('WECHAT_MP')">登录</button>
            <!-- #endif -->
            <view class="lnk-common btn-nologin" @tap="noLogin">暂不登录</view>
            <!-- 判断微信小程序时展示 -->
            <!-- #ifdef MP-WEIXIN -->
            <view class="lnk-common lnk-secondary" @tap="toMpLogin">使用微信快捷登录</view>
            <!-- #endif -->
            <view class="tips">
                <view @tap="handlerLink" data-link="/pages/login/sign">立即注册</view>
                <view @tap="handlerLink" data-link="/pages/login/forget">忘记密码</view>
            </view>
        </view>
        <view class="fast">
            <!-- 判断其他类终端时展示 -->
            <!-- #ifdef APP -->
            <view class="name">其他登录方式</view>
            <!-- #endif -->
            <view class="list">
                <!--#ifdef H5 -->
               <!-- <view class="item" @click="handlerWebLogin" data-type="QQ">
                    <image :src="iconQQ" mode="aspectFit" class="icon"></image>
                </view> -->
                <!-- #endif -->
                <!-- #ifdef APP -->
                <view class="item" @click="handlerAppLogin" data-type="WECHAT">
                    <image :src="iconWechat" mode="aspectFit" class="icon"></image>
                </view>
                <view class="item" @click="handlerAppLogin" data-type="QQ">
                    <image :src="iconQQ" mode="aspectFit" class="icon"></image>
                </view>
                <view class="item" @click="handlerAppLogin" data-type="WEIBO">
                    <image :src="iconWeibo" mode="aspectFit" class="icon"></image>
                </view>
                <view v-if="isIos" class="item" @click="handlerAppLogin" data-type="APPLE">
                    <image :src="iconApple" mode="aspectFit" class="icon"></image>
                </view>
                <!-- #endif -->
                <!-- #ifdef H5 -->
                <!-- <view class="item" @click="handlerWebLogin" data-type="WEIBO">
                    <image :src="iconWeibo" mode="aspectFit" class="icon"></image>
                </view> -->
                <!-- #endif -->
            </view>
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
        </view>
        <myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification" business="LOGIN" />
    </view>
</template>

<script>
import { getCategoryList } from '@/api/goods.js'
import { userLogin, sendMobile, smsLogin, webLogin, webloginCallback, checkMemberLicenseEndTime } from '../../api/login'
import myVerification from '@/components/verification/verification.vue' //验证码模块
import { md5 } from '@/utils/md5.js'
import storage from '@/utils/storage.js' //缓存
import { getUserInfo } from '@/api/members'
import { whetherNavigate } from '@/utils/Foundation' //登录跳转
import { openIdLogin } from '@/api/connect.js'
export default {
    name: '',
    components: {
        myVerification
    },
    data() {
        return {
            isAgree: false, // 同意协议
            isComplete: false,
            iconLogo: `${this.iconCommon}/static/login/login-logo.png`,
            iconQQ: `${this.iconCommon}/static/v1/login/icon-qq.png`,
            iconWechat: `${this.iconCommon}/static/v1/login/icon-wechat.png`,
            iconWeibo: `${this.iconCommon}/static/v1/login/icon-weibo.png`,
            iconApple: `${this.iconCommon}/static/v1/login/icon-apple.png`,
            isCodeLogin: true, // 是否通过验证码登录

            smsSecond: 59,
            isSmsDisable: false, // 能否点击发送验证码
            btnSmsText: '获取验证码',
            form: {
                username: '', // 账号
                password: '', // 密码
                mobile: '', // 手机号
                code: '' // 验证码
            },
            codeFlag: true, //验证开关，用于是否展示验证码
            flage: false, //是否验证码验证
            isIos: false, //是否是ios
            bgUrl: `${this.iconCommon}/static/login/login-bg.png`,
            loading: false
        }
    },
    watch: {
        async flage(val) {
            if (val) {
                if (!this.isCodeLogin) {
                    this.login()
                    return
                    // 执行登录
                } else {
                    // 向后端请求验证码
                    uni.showLoading({})
                    let res = await sendMobile(this.form.mobile)
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
                }
            } else {
                this.$refs.verification.hide()
            }
        }
    },
    onLoad() {
        // #ifdef APP-PLUS
        this.isIos = plus.os.name == "iOS";
        //#endif
    },
    onShow() { },
    mounted() {
        // 通过第三方账号登录
        // let objRouteQuery = this.$route.query
        // console.log(objRouteQuery)
        // if(objRouteQuery.state){
        //     webloginCallback(objRouteQuery.state).then(res => {
        //         this.getUserInfoMethods(res)
        //     })
        // }
        /**
         * 条件编译判断当前客户端类型
         */
        //#ifdef H5
        this.clientType = 'H5'
        //#endif

        //#ifdef APP-PLUS
        // this.clientType = 'APP'
        /**如果是app 加载支持的登录方式*/
        // let _this = this
        // uni.getProvider({
        //     service: 'oauth',
        //     success: (result) => {
        //         _this.loginList = result.provider.map((value) => {
        //             //展示title
        //             let title = ''
        //             //系统code
        //             let code = ''
        //             //颜色
        //             let color = '#8b8b8b'
        //             //图标
        //             let icon = ''
        //             //uni 联合登录 code
        //             let appcode = ''
        //             switch (value) {
        //                 case 'weixin':
        //                     icon = 'weixin-circle-fill'
        //                     color = '#00a327'
        //                     title = '微信'
        //                     code = 'WECHAT'
        //                     break
        //                 case 'qq':
        //                     icon = 'qq-circle-fill'
        //                     color = '#38ace9'
        //                     title = 'QQ'
        //                     code = 'QQ'
        //                     break
        //                 case 'apple':
        //                     icon = 'apple-fill'
        //                     color = '#000000'
        //                     title = 'Apple'
        //                     code = 'APPLE'
        //                     break
        //             }
        //             return {
        //                 title: title,
        //                 code: code,
        //                 color: color,
        //                 icon: icon,
        //                 appcode: value
        //             }
        //         })
        //     },
        //     fail: (error) => {
        //         uni.showToast({
        //             title: '获取登录通道失败' + error,
        //             duration: 2000,
        //             icon: 'none'
        //         })
        //     }
        // })
        //#endif

        // //特殊平台，登录方式需要过滤
        // // #ifdef H5
        // this.methodFilter(['QQ'])
        // // #endif

        // //微信小程序，只支持微信登录
        // // #ifdef MP-WEIXIN
        // this.methodFilter(['WECHAT'])
        // // #endif
    },
    methods: {
        //同意协议
        checkboxChange(e) {
            this.isAgree = !this.isAgree
        },
        // 跳转三方登录
        handlerWebLogin: function (e) {
            let registerSource = 'H5'
            if (!this.isAgree) {
                this.$u.toast('请阅读并同意服务协议!')
                return
            }
            // #ifdef H5
            if (e.currentTarget.dataset.type == 'WECHAT') {
                e.currentTarget.dataset.type = 'WECHAT_PC'
            }
            // #endif
            webLogin(e.currentTarget.dataset.type, registerSource, '/pages/login/login')
        },
        //暂不登录重定向到首页
        noLogin() {
            uni.reLaunch({
                url: '/pages/tabbar/home/index'
            })
        },

        // 切换登录方式
        handlerChangeMode: function (e) {
            let eMode = parseInt(e.currentTarget.dataset.mode)
            this.isCodeLogin = eMode == 0 ? true : false
        },

        // 跳转协议
        handlerLicense: function (e) {
            let eType = e.currentTarget.dataset.type
            uni.navigateTo({ url: `/pages/profile/license?type=${eType}` })
        },

        // 链接跳转
        handlerLink: function (e) {
            let eLink = e.currentTarget.dataset.link
            uni.navigateTo({ url: eLink })
        },
        toMpLogin() {
            uni.redirectTo({ url: '/pages/passport/wechatMPLogin' })
        },

        // #ifdef APP-PLUS
        // app调起三方登录
        handlerAppLogin(e) {
            if (!this.isAgree) {
                this.$u.toast('请阅读并同意服务协议!')
                return
            }
            let eType = e.currentTarget.dataset.type
            let _this = this
            let service = 'weixin'
            if (eType == 'WECHAT') {
                service = 'weixin'
            } else if (eType == 'QQ') {
                service = 'qq'
            } else if (eType == 'WEIBO') {
                service = 'sinaweibo'
            } else if (eType == 'APPLE') {
                service = 'apple'
            }
            uni.getProvider({
                service: 'oauth',
                success: function (res) {
                    if (~res.provider.indexOf(service)) {
                        uni.showLoading({
                            title: '授权中'
                        })
                        uni.login({
                            provider: service,
                            success: (loginRes) => {
                              let accessToken = loginRes.authResult.access_token;
                              let openid = loginRes.authResult.openid;
                              if (service == "sinaweibo") {
                                openid = loginRes.authResult.uid;
                              }
                              uni.getUserInfo({
                                provider: service,
                                success: function(info) {
                                  let unioinid = info.userInfo.unionId;
                                  if (service == "qq"){
                                    unioinid = info.userInfo.unionid;
                                  }
                                  let data = {
                                    uuid: openid,
                                    type: 'APP',
                                    source: eType,
                                    access_token: accessToken,
                                    unionid: unioinid,
                                    registerSource: 'APP',
                                  }
                                  openIdLogin(data, 'APP').then((res) => {
                                    if (!res.data.success) {
                                      let errormessage = '授权登录失败'
                                      uni.showToast({
                                        // title: '未绑定第三方账号',
                                        title: errormessage,
                                        icon: 'none',
                                        duration: 3000
                                      })
                                      return
                                    } else {
                                      _this.getUserInfoMethods(res)
                                    }
                                  })
                                },
                                fail: (eror) => {
                                  uni.hideLoading();
                                  uni.showToast({
                                    title: '获取三方信息失败',
                                    icon: 'none',
                                    duration: 3000
                                  })
                                }
                              })

                            },
                            fail: (eror) => {
                                uni.hideLoading();
                                uni.showToast({
                                  // title: '未绑定第三方账号',
                                  title: '登录失败',
                                  icon: 'none',
                                  duration: 3000
                                })
                            }
                        })
                    }
                },
                fail: function (er) {
                    console.log(er, 'erer')
                    _this.$Toast.message(er)
                }
            })
        },
        // #endif
        login(e) {
            // 防重复点击
            if (this.loading) {
                return
            }

            if (!this.isAgree) {
                this.$u.toast('请阅读并同意服务协议!')
                return
            }

            // 验证码登录
            if (this.isCodeLogin) {
                if (!this.form.mobile) {
                    this.$u.toast('手机号不能为空!')
                    return
                }
                if (!this.$u.test.mobile(this.form.mobile)) {
                    this.$u.toast('请正确输入手机号!')
                    return
                }
                if (!this.form.code) {
                    this.$u.toast('验证码不能为空!')
                    return
                }

                // 设置loading状态
                this.loading = true
                uni.showLoading({
                    title: '登录中...',
                    mask: true
                })

                // 清空当前账号信息
                storage.setHasLogin(false)
                storage.setAccessToken('')
                storage.setRefreshToken('')
                storage.setUserInfo({})

                // 检验验证码是否正确
                smsLogin(
                    {
                        mobile: this.form.mobile,
                        code: this.form.code,
                        registerSource: e
                    },
                    this.clientType
                ).then((res) => {
                    this.getUserInfoMethods(res)
                }).catch((error) => {
                    console.error('验证码登录失败:', error)
                    uni.showToast({
                        title: '登录失败，请重试',
                        icon: 'none'
                    })
                    // 登录失败时重置状态
                    this.loading = false
                    uni.hideLoading()
                })
            }
            // 账号密码登录
            else {
                if (!this.form.username) {
                    uni.showToast({
                        title: '账号不能为空!',
                        icon: 'none'
                    })
                    return
                }
                if (!this.form.password) {
                    uni.showToast({
                        title: '密码不能为空!',
                        icon: 'none'
                    })
                    return
                }

                // 设置loading状态
                this.loading = true
                uni.showLoading({
                    title: '登录中...',
                    mask: true
                })

                let params = {
                    username: this.form.username,
                    password: md5(this.form.password)
                }

                // 请求登录接口
                userLogin(params).then((res) => {
                    if (res.data.success) {
                        this.getUserInfoMethods(res)
                    } else {
                        uni.showToast({
                            title: res.data.message || '登录失败',
                            icon: 'none'
                        })
                        // 登录失败时重置状态
                        this.loading = false
                        uni.hideLoading()
                    }
                }).catch((error) => {
                    console.error('账号密码登录失败:', error)
                    uni.showToast({
                        title: '登录失败，请重试',
                        icon: 'none'
                    })
                    // 登录失败时重置状态
                    this.loading = false
                    uni.hideLoading()
                })
            }
        },
        // 登录成功之后获取用户信息
        getUserInfoMethods(res) {
            if (res.data.success) {
                storage.setAccessToken(res.data.result.accessToken)
                storage.setRefreshToken(res.data.result.refreshToken)
                /**
                 * 登录成功后获取个人信息
                 */
                getUserInfo().then((user) => {
                    if (user.data.success) {
                        /**
                         * 个人信息存储到缓存userInfo中
                         */
                        storage.setUserInfo(user.data.result)
                        storage.setHasLogin(true)
                        storage.setAutoCp(0)
                        // 登录成功
                        uni.showToast({
                            title: '登录成功!',
                            icon: 'none'
                        })
                        whetherNavigate('',1)

                        // 检查会员许可证到期时间
                        checkMemberLicenseEndTime().then(res => {
                            if (res.data.code == 200) {
                                let result = res.data.result;
                                let message = "";
                                if (result.licenseEndFlag) {
                                    // 2是服务商 3是供应商
                                    if(user.data.result.type == '2'){
                                        message = message + "" + "您的营业执照即将过期，请在过期前及时更新，以免影响您的业务开展。（营业执照过期后将关闭结算通道。）\n"
                                    }else if(user.data.result.type == '3'){
                                        message = message + "" + "您的营业执照即将过期，请在过期前及时更新，以免影响您的业务开展。（营业执照过期后将自动下架供应商品，关闭结算通道。）\n"
                                    }
                                }
                                if (result.categoryCompetencyEndInfoList.length > 0) {
                                    message = message + "\n" + "您的以下类目资质即将过期，请及时更新，否则将自动下架商品。"
                                    result.categoryCompetencyEndInfoList.forEach(item => {
                                        message = message + "\n" + item.categoryName + "：" + item.categoryCompetencyName
                                    })
                                    message = message + "\n"
                                }
                                if (result.brandEndInfoList.length > 0) {
                                    message = message + "\n" + "您的以下品牌授权即将过期，请及时更新，否则将自动下架商品。"
                                    result.brandEndInfoList.forEach(item => {
                                        message = message + "\n" + item.categoryName + "：" + item.brandName
                                    })
                                }
                                if (message) {
                                    setTimeout(() => {
                                        uni.showModal({
                                            title: '提示',
                                            content: message,
                                            showCancel: false,
                                        });
                                    }, 1000)
                                }
                            }
                        }).catch((error) => {
                            console.error('检查会员许可证失败:', error)
                        }).finally(() => {
                            // 所有用户信息获取完成后才重置loading状态
                            this.loading = false
                            uni.hideLoading()
                        })
                    } else {
                        uni.reLaunch({
                            url: '/pages/tabbar/home/index'
                        })
                        // 获取用户信息失败时也要重置loading状态
                        this.loading = false
                        uni.hideLoading()
                    }
                }).catch((error) => {
                    console.error('获取用户信息失败:', error)
                    uni.showToast({
                        title: '获取用户信息失败',
                        icon: 'none'
                    })
                    // 获取用户信息失败时重置loading状态
                    this.loading = false
                    uni.hideLoading()
                })
            } else {
                // 登录接口返回失败时重置loading状态
                this.loading = false
                uni.hideLoading()
            }
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
            if (!_this.form.mobile) {
                this.$u.toast('手机号不能为空!')
                return
            }
            if (!this.$u.test.mobile(_this.form.mobile)) {
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
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    padding-top: calc(88rpx + var(--status-bar-height));
    // padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
    // padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
    padding-left: 30rpx;
    padding-right: 30rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-image: var(--bg-url);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;

    .main {
        width: calc(100vw - 60rpx);
        .lnk-primary{
            background: linear-gradient( 265deg, #E22221 45%, #FF9500 100%);
            border-radius: 50rpx;
            border: none;
        }
            .lnk-common{
                margin: 20rpx 30rpx;
            }
        .btn-nologin {
            color: #666666;
            border-radius: 50rpx;
            border: 2rpx solid #F18E8D;
        }

        .logo {
            height: 320rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 60rpx;
            .icon {
                width: 130rpx;
                height: 130rpx;
            }
        }

        .tabs {
            height: 88rpx;
            margin: 0 0 20rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;

            .item {
                flex: 1;
                line-height: 88rpx;
                color: #999;
                font-size: 32rpx;
                text-align: center;
            }

            .item-hov {
                color: #e22221;
                font-weight: 600;
                position: relative;

                &::after {
                    position: absolute;
                    content: '';
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -10rpx;
                    width: 120rpx;
                    height: 10rpx;
                    background: linear-gradient( 90deg, #E22221 0%, #E22221 10%, rgba(226,34,33,0) 40%, rgba(226,34,33,0) 100%);
                    border-radius: 10rpx;
                }
            }
        }

        .form {
            margin: 60rpx 30rpx;
            .rs {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 96rpx;
                position: relative;
                margin: 0 0 16rpx;

                &::after {
                    position: absolute;
                    content: '';
                    left: 0;
                    right: 0;
                    bottom: 0;
                    height: 3rpx;
                    background: #ebedf0;
                }

                .text {
                    width: calc(100vw - 60rpx);
                    font-size: 28rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    color: #323232;
                    box-sizing: border-box;
                    padding: 0 20rpx;
                }

                .code {
                    width: calc(100vw - 60rpx - 160rpx);
                    font-size: 28rpx;
                    height: 72rpx;
                    line-height: 72rpx;
                    color: #323232;
                    box-sizing: border-box;
                    padding: 0 20rpx;
                }

                .link {
                    width: 160rpx;
                    height: 64rpx;
                    line-height: 64rpx;
                    text-align: center;
                    font-size: 28rpx;
                    color: #CD3A18;
                    border-radius: 4rpx;
                    white-space: nowrap;
                }
            }
        }

        .tips {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 26rpx;
            color: #999;
            line-height: 88rpx;
            margin: 0 30rpx;
        }
    }

    .fast {
        width: calc(100vw - 60rpx);

        .name {
            font-size: 24rpx;
            color: #999;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 88rpx;

            &::before {
                position: relative;
                content: '';
                width: 160rpx;
                height: 3rpx;
                background: #f1f1f1;
                margin: 0 16rpx;
            }

            &::after {
                position: relative;
                content: '';
                width: 160rpx;
                height: 3rpx;
                background: #f1f1f1;
                margin: 0 16rpx;
            }
        }

        .list {
            display: flex;
            justify-content: center;
            align-items: center;

            .item {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 20rpx;

                .icon {
                    width: 80rpx;
                    height: 80rpx;
                }
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
    }
}
</style>
