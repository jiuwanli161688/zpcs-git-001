<template>
    <view class="container">
        <!-- 链接操作 -->
        <view class="lnk-wrapper">
            <view class="list">
                <view class="item" v-for="(item, index) in arrLink" :key="index">
                    <text-link :text="item.text" :link="item.link" />
                </view>
            </view>
        </view>

        <!-- 绑定操作 -->
        <!-- 绑定：小程序端：显示小程序  h5端: qq+微博 app：全都要 -->
        <view class="lnk-wrapper">
            <view class="list">
                <!-- 绑定QQ -->
                <!-- #ifdef H5 -->
                <view class="item">
                    <bind-link text="绑定QQ" :flag="isBindQQ" @handlerBindTencent="handlerBindTencent" />
                </view>
                <!-- #endif -->
                <!-- 绑定微信 -->
                <!-- #ifdef APP -->
                <view class="item">
                    <bind-link text="绑定微信" :flag="isBindWechat" @handlerBindTencent="handlerBindWechat" />
                </view>
                <view class="item">
                    <bind-link text="绑定QQ" :flag="isBindQQ" @handlerBindTencent="handlerBindTencent" />
                </view>
                <view class="item">
                    <bind-link text="新浪微博" :flag="isBindWeibo" @handlerBindTencent="handlerBindWeibo" />
                </view>
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <view class="item">
                    <bind-link text="绑定微信" :flag="isBindWechat" @handlerBindTencent="handlerBindWechat" />
                </view>
                <!-- #endif -->
                <!-- 绑定新浪 -->
                <!-- #ifdef H5 -->
                <view class="item">
                    <bind-link text="新浪微博" :flag="isBindWeibo" @handlerBindTencent="handlerBindWeibo" />
                </view>
                <!-- #endif -->
            </view>
        </view>
    </view>
</template>

<script>
import storage from '@/utils/storage.js' //缓存
import TextLink from '@/components/Hina/TextLink'
import BindLink from '@/components/Hina/BindLink'
import { getAuthenticationFlag, getUserInfo } from '@/api/members.js'
import { unBindWebLogin, webLogin, webloginCallback } from '@/api/login.js'
import { openIdLogin } from '@/api/connect.js'
import config from '@/config/config'
import { mpAutoLogin } from "@/api/connect.js";
export default {
    name: '',
    components: {
        TextLink,
        BindLink
    },
    data() {
        return {
            isComplete: false,
            arrLink: [],
            isBindQQ: false, // 是否绑定QQ
            isBindWechat: false, // 是否绑定微信
            isBindWeibo: true, // 是否绑定微博
            isAuthentication: false, // 是否实名认证
            userInfo: storage.getUserInfo(),
            configs: config,

        }
    },
    methods: {
        // app绑定三方登录
        handlerAppLogin(service) {
            let _this = this
            let source = 'WECHAT'
            if (service == 'weixin') {
                source = 'WECHAT'
            } else if (service == 'qq') {
                source = 'QQ'
            } else if (service == 'sinaweibo') {
                source = 'WEIBO'
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
                                    source: source,
                                    // access_token: accessToken,
                                    unionid: unioinid,
                                    memberId: _this.userInfo.id,
                                    registerSource: 'APP',
                                  }
                                  console.log(data,"上报data")
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
                                uni.hideLoading()
                                console.log(eror, 'eroreroreror')
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
        // 小程序绑定
        getUserProfile(e) {
            uni.showLoading({
                title: '授权中'
            })
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            uni.getUserProfile({
                desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: (res) => {
                    //获取code
                    uni.login({
                        success: (loginRes) => {
                            if (loginRes.errMsg === 'login:ok') {
                                this.code = loginRes.code
                                this.nickName = res.userInfo.nickName
                                this.image = res.userInfo.avatarUrl
                                /**
                                 * 根据公有的配置设置登录方式
                                 */
                                console.log(this.configs.enableFetchMobileLogin, '公有的配置')

                                if (this.configs.enableFetchMobileLogin) {
                                    this.phoneAuthPopup = true
                                    return false
                                }
                                let iv = res.iv
                                let encryptedData = res.encryptedData

                                let code = this.code
                                let image = this.image
                                let nickName = this.nickName
                                let memberId = this.userInfo.id
                                mpAutoLogin({
                                    encryptedData,
                                    iv,
                                    code,
                                    image,
                                    nickName,
                                    memberId
                                }).then((apiRes) => {
                                    this.getUserInfoMethods(apiRes)
                                })
                            } else {
                                uni.showToast({
                                    title: '系统异常，请联系管理员！',
                                    icon: 'none'
                                })
                                uni.hideLoading()
                            }
                        }
                    })
                },
                fail: (res) => {
                    uni.hideLoading()
                }
            })
        },
        // 判断用户是否实名认证过
        loadAuthentication() {
            getAuthenticationFlag().then((res) => {
                if (res.data.success) {
                    this.isAuthentication = res.data.result
                    if (!this.isAuthentication) {
                        this.arrLink.unshift({ text: '实名认证', link: '/pages/config/security/authentication' })
                    }
                }
            })
        },
        // 绑定QQ
        handlerBindTencent: function () {
            if (this.isBindQQ) {
                unBindWebLogin('QQ').then((res) => {
                    if (res.data.success) {
                        let userInfo = storage.getUserInfo()
                        userInfo.bindingQQ = false
                        storage.setUserInfo(userInfo)
                        this.isBindQQ = false
                        this.$u.toast('腾讯QQ登录解除绑定!')
                    } else {
                        this.$u.toast(res.message)
                    }
                })
            } else {
                // #ifdef APP
                this.handlerAppLogin('qq')
                // #endif
                // #ifdef H5
                webLogin('QQ', '/pages/config/security/home')
                // #endif
            }
        },
        // 绑定微信
        handlerBindWechat: function () {
            if (this.isBindWechat) {
                unBindWebLogin('WECHAT').then((res) => {
                    if (res.data.success) {
                        let userInfo = storage.getUserInfo()
                        userInfo.bindingWechat = false
                        storage.setUserInfo(userInfo)
                        this.isBindWechat = false
                        this.$u.toast('微信登录解除绑定!')
                    } else {
                        this.$u.toast(res.message)
                    }
                })
            } else {
                // #ifdef APP
                this.handlerAppLogin('weixin')
                // #endif
                // #ifdef MP-WEIXIN
                this.getUserProfile()
                // #endif
                // // #ifdef H5
                // let type='WECHAT_PC'
                // webLogin(type, '/pages/config/security/home')
                // // #endif
            }
        },
        // 绑定微博
        handlerBindWeibo: function () {
            if (this.isBindWeibo) {
                unBindWebLogin('WEIBO').then((res) => {
                    if (res.data.success) {
                        let userInfo = storage.getUserInfo()
                        userInfo.bindingWeibo = false
                        storage.setUserInfo(userInfo)
                        this.isBindWeibo = false
                        this.$u.toast('微博登录解除绑定!')
                    } else {
                        this.$u.toast(res.message)
                    }
                })
            } else {
                // #ifdef APP
                this.handlerAppLogin('sinaweibo')
                // #endif
                // #ifdef H5
                webLogin('WEIBO', '/pages/config/security/home')
                // #endif
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
                        this.isBindQQ = user.data.result.bindingQQ
                        this.isBindWechat = user.data.result.bindingWechat
                        this.isBindWeibo = user.data.result.bindingWeibo
                    } else {
                        uni.reLaunch({
                            url: '/pages/tabbar/home/index'
                        })
                    }
                })
            }
        },
        // 处理登录成功
        handlerSuccessLogin: function (access, refresh) {
            storage.setAccessToken('accessToken', access)
            storage.setRefreshToken('refreshToken', refresh)
            getUserInfo().then((res) => {
                if (res.data.success) {
                    let tempRes = res.result
                    storage.setUserInfo('userInfo', tempRes)
                    this.isBindingQQ = tempRes.bindingQQ
                    this.isBindingWechat = tempRes.bindingWechat
                    this.isBindingWeibo = tempRes.bindingWeibo
                }
            })
        }
    },
    onLoad: function (options) {
        this.loadAuthentication()
        this.arrLink.push({ text: '变更密码', link: '/pages/login/forget?mobile=' + storage.getUserInfo().mobile })
        this.arrLink.push({ text: '变更手机', link: '/pages/config/security/changeOldMobile' })
        this.arrLink.push({ text: '变更邮箱', link: '/pages/config/security/changeMail' })
        let userInfo = storage.getUserInfo()
        this.isBindQQ = userInfo.bindingQQ
        this.isBindWechat = userInfo.bindingWechat
        this.isBindWeibo = userInfo.bindingWeibo
        // 通过第三方账号登录
        let objRouteQuery = options
        if (objRouteQuery.state) {
            webloginCallback(objRouteQuery.state).then((res) => {
                this.handlerSuccessLogin(res.result.accessToken, res.result.refreshToken)
            })
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

    .lnk-wrapper {
        background: #fff;
        border-radius: 12rpx;
        margin: 0 0 20rpx;

        .list {
            .item {
                position: relative;

                &::before {
                    position: absolute;
                    content: '';
                    left: 24rpx;
                    right: 24rpx;
                    bottom: 0;
                    height: 3rpx;
                    background: #f0f2f5;
                }

                &:last-of-type {
                    &::before {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>
