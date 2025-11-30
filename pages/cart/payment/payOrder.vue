<template>
    <div class="wrapper">
        <div class="box">
            <div class="block block-1">
                <image class="img" src="@/pages/cart/static/pay.png" />
                <p class="ptips">收银台</p>
                <p class="ptips">
                    剩余支付时间：
                    <u-count-down :show-days="false" :show-border="true" font-size="28" color="#008ffa"
                        border-color="#008ffa" ref="uCountDown" :timestamp="autoCancel"></u-count-down>
                </p>
                <p class="ptips">
                    支付金额
                    <span>¥{{ cashierParams.price | unitPrice }}</span>
                </p>
            </div>
        </div>
        <div class="__pay_form__"></div>
        <div class="block-4" v-if="cashierParams.price > 0">
            <div class="payItem">支付方式</div>
            <div v-for="(item, index) in payList" :key="index">
                <!-- <div v-if="item === 'ALIPAY'" class="payItem">
                    <u-row class="row" @click="awaitPay(item, index)">
                        <div class="col1" size="100" style="text-align: left">
                            <u-icon class="method_icon" name="zhifubao-circle-fill" color="#008ffa" size="80"></u-icon>
                            <span class="method_name">支付宝</span>
                        </div>
                        <div class="col3" textAlign="right">
                            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
                        </div>
                    </u-row>
                </div>

                <div v-else-if="item === 'WECHAT'" class="payItem">
                    <u-row class="row" @click="awaitPay(item, index)">
                        <div class="col1" size="100" style="text-align: left">
                            <u-icon class="method_icon" name="weixin-circle-fill" color="#00c98b" size="80"></u-icon>
                            <span class="method_name">微信</span>
                        </div>
                        <div class="col3" textAlign="right">
                            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
                        </div>
                    </u-row>
                </div>

                <div v-else-if="item === 'UNIONPAY'" class="payItem">
                    <u-row class="row" @click="awaitPay(item, index)">
                        <div class="col1" size="100" style="text-align: left">
                            <div class="union">
                                <image class="icon" :src="iconUnion"></image>
                                <span class="name">云闪付</span>
                            </div>
                        </div>
                        <div class="col3" textAlign="right">
                            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
                        </div>
                    </u-row>
                </div> -->
				<div v-if="item === 'WALLET' && walletValue >= cashierParams.price" class="payItem">
				    <u-row class="row" @click="awaitPay(item, index)">
				        <div class="col1" size="100" style="text-align: left">
				            <u-icon class="method_icon" name="red-packet-fill" color="#dd6161" size="80"></u-icon>
				            <span class="method_name">余额支付(当前余额：¥{{ walletValue | unitPrice }})</span>
				        </div>
				        <div class="col3" textAlign="right">
				            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
				        </div>
				    </u-row>
				</div>

               <!-- <div v-else-if="item === 'WALLET' && walletValue >= cashierParams.price" class="payItem">
                    <u-row class="row" @click="awaitPay(item, index)">
                        <div class="col1" size="100" style="text-align: left">
                            <u-icon class="method_icon" name="red-packet-fill" color="#dd6161" size="80"></u-icon>
                            <span class="method_name">余额支付(当前余额：¥{{ walletValue | unitPrice }})</span>
                        </div>
                        <div class="col3" textAlign="right">
                            <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
                        </div>
                    </u-row>
                </div> -->
            </div>
            <!-- <div class="payItem" v-for="(item, index) in payList" :key="index">
                <u-row class="row">
                    <div class="col1" @tap="awaitPay(item, index)" size="100" style="text-align: left">
                        <div v-show="item == 'ALIPAY'">
                            <u-icon class="method_icon" name="zhifubao-circle-fill" color="#008ffa" size="80"></u-icon>
                            <span class="method_name">支付宝</span>
                        </div>

                        <div v-show="item == 'WECHAT'">
                            <u-icon class="method_icon" name="weixin-circle-fill" color="#00c98b" size="80"></u-icon>
                            <span class="method_name">微信</span>
                        </div>
                        <div v-show="item == 'UNIONPAY'">
													<div class="union">
														<image class="icon" :src="iconUnion" ></image>
														<span class="name">云闪付</span>
													</div>
                        </div>
                        <div v-show="item == 'WALLET'">
                            <u-icon class="method_icon" name="red-packet-fill" color="#dd6161" size="80"></u-icon>
                            <span class="method_name">余额支付(当前余额：¥{{ walletValue | unitPrice }})</span>
                        </div>
                    </div>
                    <div class="col3" @tap="awaitPay(item)" textAlign="right">
                        <u-icon size="26" color="#b1b1b1" name="arrow-right"></u-icon>
                    </div>
                </u-row>
            </div> -->
        </div>
    </div>
</template>
<script>
import * as API_Trade from '@/api/trade'
import { payCallback } from '@/api/members'
import config from '@/config/config'
import { mpAutoLogin } from '@/api/connect.js'
import storage from '@/utils/storage.js' //缓存
import { getUserInfo } from '@/api/members.js'

export default {
    data() {
        return {
            //路径传参
            routerVal: '',
            //收银台参数
            cashierParams: '',
            //支付方式集合
            payList: '',
            //支付sn
            sn: '',
            //订单类型
            orderType: '',
            //支付异常
            exception: {},
            //支付表单
            payForm: {},
            //支付类型 APP/WECHAT_MP/H5/NATIVE app/微信小程序/h5/二维码
            paymentType: 'APP',
            // 支付客户端 APP/NATIVE/JSAPI/H5
            paymentClient: 'APP',
            //余额
            walletValue: 0.0,
            // 支付倒计时
            autoCancel: 0,
            // 获取支付结果定时器
            payResultTimer: null,
            configs: config,
            userInfo: storage.getUserInfo(),
            iconUnion: `${this.iconCommon}/static/payment/icon-union.png`

        }
    },
    onLoad(val) {
        this.routerVal = val

        //初始化参数
        // #ifdef APP-PLUS
        this.paymentType = 'APP'
        this.paymentClient = 'APP'
        //#endif
        // #ifdef MP-WEIXIN
        this.paymentType = 'WECHAT_MP'
        this.paymentClient = 'MP'
        //#endif
        // #ifdef H5
        this.paymentClient = "H5";
        //如果是微信浏览器，则使用公众号支付，否则使用h5，
        // 区别是：h5是通过浏览器外部调用微信app进行支付，而JSAPI则是 在微信浏览器内部，或者小程序 调用微信支付
        // this.paymentClient = this.isWeiXin() ? "JSAPI" : "H5";
        //#endif

        //
    },
    onBackPress(e) {
        if (e.from == 'backbutton') {
            if (this.routerVal.recharge_sn) {
                uni.reLaunch({
                    url: '/pages/tabbar/user/my'
                })
            } else {
                uni.redirectTo({
                    url: '/pages/profile/order/home?state=1'
                })
            }
            return true //阻止默认返回行为
        }
    },
    mounted() {
        this.cashierData()
    },
    onUnload() {
        // 清除定时器
        if (this.payResultTimer) {
            clearInterval(this.payResultTimer);
            this.payResultTimer = null; // 避免内存泄漏
        }
    },
    methods: {
        /**
         * 支付成功后跳转
         */
        callback(paymentMethod) {
            uni.redirectTo({
                url: '/pages/cart/payment/success?paymentMethod=' + paymentMethod + '&payPrice=' + this.cashierParams.price + '&orderType=' + this.orderType + '&orderNo=' + this.cashierParams.orderSns
            })
        },

        /**
         * 获取收银详情
         */
        cashierData() {
            let parms = {}

            if (this.routerVal.recharge_sn) {
                // 判断当前是否是充值
                this.sn = this.routerVal.recharge_sn
                this.orderType = 'RECHARGE'
            } else if (this.routerVal.trade_sn) {
                this.sn = this.routerVal.trade_sn
                this.orderType = 'TRADE'
            } else {
                this.sn = this.routerVal.order_sn
                this.orderType = 'ORDER'
            }
            parms.sn = this.sn
            parms.orderType = this.orderType
            parms.clientType = this.paymentType

            API_Trade.getCashierData(parms).then((res) => {
                if (res.data.success) {
                    this.cashierParams = res.data.result
                    if (this.routerVal.recharge_sn) {
                        this.payList = res.data.result.support.filter((item) => {
                            return item != 'WALLET'
                        })
                    } else {
                        this.payList = res.data.result.support
                    }
                    // #ifdef MP-WEIXIN
                    if (this.routerVal.source == 'app') {
                        uni.showToast({ title: '点击打开云闪付小程序进行支付', icon: 'none' })
                        this.payList = res.data.result.support.filter((item) => {
                            return item == 'UNIONPAY'
                        })
                    } else {
                        this.payList = res.data.result.support.filter((item) => {
                            return item != 'ALIPAY'
                        })
                    }

                    // #endif


                    // #ifdef H5
                    //判断是否微信浏览器
                    var ua = window.navigator.userAgent.toLowerCase()
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        this.payList = res.data.result.support.filter((item) => {
                            return item != 'ALIPAY'
                        })
                        // 充值的话仅保留微信支付
                        if (this.orderType == 'RECHARGE') {
                            this.payList = res.data.result.support.filter((item) => {
                                return item == 'WECHAT'
                            })
                        }
                    }
                    // #endif

                    this.walletValue = res.data.result.walletValue
                    this.autoCancel = (res.data.result.autoCancel - new Date().getTime()) / 1000
                } else if (res.data.code == 32000) {
                    setTimeout(() => {
                        uni.redirectTo({
                            url: `/pages/profile/order/home?state=1`
                        })
                    }, 500)
                }
            })
        },

        awaitPay(payment) {
            this.$u.throttle(() => {
                this.pay(payment)
            }, 2000)
        },

        //订单支付
        async pay(payment) {
            // 支付编号
            const sn = this.sn
            // 交易类型【交易号|订单号】
            const orderType = this.orderType

            const clientType = this.paymentType
            let params = {
                sn,
                orderType,
                clientType
            }

            //支付方式 WECHAT/ALIPAY
            const paymentMethod = payment
            // 客户端类型 APP/NATIVE/JSAPI/H5
            const paymentClient = this.paymentClient

            uni.showLoading({
                title: '正在唤起支付...',
                mask: true
            })

          console.log(paymentClient,"client")

            // #ifdef APP-PLUS
            //APP pay
            // APP支付直接打开对应的小程序
            await API_Trade.initiatePay(paymentMethod, paymentClient, params).then((signXml) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                // let requestObj=JSON.parse(signXml.data.result.miniPayRequest);
                //如果支付异常
                if (!signXml.data.success) {
                    uni.showToast({
                        title: signXml.data.message,
                        duration: 2000,
                        icon: 'none'
                    })
                    return
                }

                let payForm = signXml.data.result
                if (paymentMethod === 'WALLET') {
                    uni.showToast({
                        icon: 'none',
                        title: '支付成功!'
                    })
                    this.callback(paymentMethod)
                } else {
                    clearInterval(this.payResultTimer)
                    const searchParams = {
                        ...params,
                        price: this.cashierParams
                    }
                    let _this = this
                    this.payResultTimer = setInterval(() => {
                        payCallback(searchParams).then((res) => {
                            if (res.data.result) {
                                clearInterval(_this.payResultTimer)
                                uni.showToast({ title: '支付成功' })
                                setTimeout(() => {
                                    uni.navigateTo({
                                        url: '/pages/profile/order/home'
                                    })
                                }, 1000)
                            }
                        })
                    }, 3000)
                    if (paymentMethod == 'WECHAT') {
                        plus.share.getServices(function (res) {
                            var sweixin = null
                            for (var i = 0; i < res.length; i++) {
                                var t = res[i]
                                if (t.id == 'weixin') {
                                    sweixin = t
                                }
                            }
                            if (sweixin) {
                                sweixin.launchMiniProgram({
                                    id: 'gh_a56911735ad2',
                                    path: 'pages/cart/payment/payOrder?trade_sn=' + params.sn + "&type=WECHAT&source=app",
                                    fail(res) {
                                        clearInterval(_this.payResultTimer)
                                    }
                                })
                            }
                        })
                    } if (paymentMethod === 'UNIONPAY') {
                        plus.share.getServices(function (res) {
                            var sweixin = null
                            for (var i = 0; i < res.length; i++) {
                                var t = res[i]
                                if (t.id == 'weixin') {
                                    sweixin = t
                                }
                            }
                            if (sweixin) {
                                // uni.showToast({title:"调起云闪付小程序...",icon:'none'})
                                // let miniPayRequest = JSON.parse(payForm.miniPayRequest)
                                // sweixin.launchMiniProgram({
                                //     id: 'gh_fb6d768e8e91',  // 小程序的原始 ID
                                //     path : miniPayRequest.cqpMpPath+'?tn=' + miniPayRequest.tn,  // 要跳转到的小程序页面路径，带参数
                                //     // path: 'pages/CQPApplet/index?tn=' + miniPayRequest.tn,  // 要跳转到的小程序页面路径，带参数
                                //     type: 0,  // 跳转类型，通常为 0（打开小程序）
                                //     success(res) {
                                //         console.log('成功跳转到小程序:', res)
                                //     },
                                //     fail(res) {
                                //         clearInterval(_this.payResultTimer)  // 跳转失败时清除定时器
                                //         console.error('跳转失败:', res)
                                //     }
                                // })
                                sweixin.launchMiniProgram({
                                    id: 'gh_a56911735ad2',
                                    path: 'pages/cart/payment/payOrder?trade_sn=' + params.sn + "&type=UNIONPAY&source=app",
                                    type: 0,
                                    fail(res) {
                                        clearInterval(_this.payResultTimer)  // 跳转失败时清除定时器
                                    }
                                })
                            }
                        })
                    } else {
                        uni.getProvider({
                            service: 'payment',
                            success: function (res) {
                                if (~res.provider.indexOf('alipay')) {
                                    uni.requestPayment({
                                        "provider": "alipay",   //固定值为"alipay"
                                        "orderInfo": payForm, //此处为服务器返回的订单信息字符串
                                        success: function (res) {
                                            var rawdata = JSON.parse(res.rawdata);
                                            console.log("支付成功");
                                        },
                                        fail: function (err) {
                                            console.log('支付失败:' + JSON.stringify(err));
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            })
            // #endif

            //#ifdef H5
            //H5 pay
            await API_Trade.initiatePay(paymentMethod, paymentClient, params).then((res) => {
                let response = res.data
                //如果非支付宝支付才需要进行判定，因为支付宝h5支付是直接输出的，没有返回所谓的消息状态
                if (paymentMethod !== 'ALIPAY') {
                    //如果支付异常
                    if (!response.success) {
                        uni.showToast({
                            title: response.message,
                            duration: 2000,
                            icon: 'none'
                        })
                        return
                    }
                }
                if (paymentMethod === 'ALIPAY') {
                    clearInterval(this.payResultTimer)
                    const searchParams = {
                        ...params,
                        price: this.cashierParams
                    }
                    let _this = this
                    this.payResultTimer = setInterval(() => {
                        payCallback(searchParams).then((res) => {
                            if (res.data.result) {
                                clearInterval(_this.payResultTimer)
                                uni.navigateTo({
                                    url: '/pages/profile/order/home?state=0'
                                })
                            }
                        })
                    }, 3000)
                    // document.write(response);
                } else if (paymentMethod === 'WECHAT') {
                    clearInterval(this.payResultTimer)
                    const searchParams = {
                        ...params,
                        price: this.cashierParams
                    }
                    let _this = this
                    this.payResultTimer = setInterval(() => {
                        payCallback(searchParams).then((res) => {
                            if (res.data.result) {
                                clearInterval(_this.payResultTimer)
                                uni.navigateTo({
                                    url: '/pages/profile/order/home?state=0'
                                })
                            }
                        })
                    }, 3000)
                    if (this.isWeiXin()) {
                        //微信公众号支付
                        WeixinJSBridge.invoke('getBrandWCPayRequest', response.result, (res) => {
                            if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                uni.showToast({
                                    icon: 'none',
                                    title: '支付成功!'
                                })
                                this.callback(paymentMethod)
                            } else {
                                uni.showModal({
                                    content: '支付失败,如果您已支付，请勿反复支付',
                                    showCancel: false
                                })
                            }
                        })
                        if (this.$store.state.isShowToast) {
                            uni.hideLoading()
                        }
                    } else {
                        // window.location.href = JSON.parse(response.result).h5_url;

                        if (this.$store.state.isShowToast) {
                            uni.hideLoading()
                        }
                    }
                } else if (paymentMethod === 'WALLET') {
                    uni.showToast({
                        title: response.message,
                        icon: 'none'
                    })
                    if (response.success) {
                        this.callback(paymentMethod)
                    }
                }else if (paymentMethod === 'UNIONPAY') {
                  plus.share.getServices(function (res) {
                    var sweixin = null
                    for (var i = 0; i < res.length; i++) {
                      var t = res[i]
                      if (t.id == 'weixin') {
                        sweixin = t
                      }
                    }
                    if (sweixin) {
                      // uni.showToast({title:"调起云闪付小程序...",icon:'none'})
                      // let miniPayRequest = JSON.parse(payForm.miniPayRequest)
                      // sweixin.launchMiniProgram({
                      //     id: 'gh_fb6d768e8e91',  // 小程序的原始 ID
                      //     path : miniPayRequest.cqpMpPath+'?tn=' + miniPayRequest.tn,  // 要跳转到的小程序页面路径，带参数
                      //     // path: 'pages/CQPApplet/index?tn=' + miniPayRequest.tn,  // 要跳转到的小程序页面路径，带参数
                      //     type: 0,  // 跳转类型，通常为 0（打开小程序）
                      //     success(res) {
                      //         console.log('成功跳转到小程序:', res)
                      //     },
                      //     fail(res) {
                      //         clearInterval(_this.payResultTimer)  // 跳转失败时清除定时器
                      //         console.error('跳转失败:', res)
                      //     }
                      // })
                      sweixin.launchMiniProgram({
                        id: 'gh_a56911735ad2',
                        path: 'pages/cart/payment/payOrder?trade_sn=' + params.sn + "&type=UNIONPAY&source=app",
                        type: 0,
                        fail(res) {
                          clearInterval(_this.payResultTimer)  // 跳转失败时清除定时器
                        }
                      })
                    }
                  })
                }
            })
            //H5pay
            // #endif

            //#ifdef MP-WEIXIN
            //微信小程序
            await API_Trade.initiatePay(paymentMethod, paymentClient, params).then((res) => {
                let payForm = res.data.result
                //如果支付异常
                if (!res.data.success) {
                    if (res.data.message == '微信支付需绑定微信或者使用微信登录') {
                        uni.showModal({
                            content: res.data.message + '，请点击确定绑定微信',
                            showCancel: false,
                            success: (res) => {
                                if (res.confirm) {
                                    this.getUserProfile(payment)
                                }
                            }
                        })
                    }
                }
                if (paymentMethod === 'WECHAT') {
                    // 仅作为示例，非真实参数信息。
                    let params = {
                        provider: 'wxpay',
                        timeStamp: String(Date.now()),
                        nonceStr: payForm.nonceStr,
                        package: payForm.package,
                        signType: payForm.signType,
                        paySign: payForm.paySign
                    }
                    uni.requestPayment({
                        provider: 'wxpay',
                        timeStamp: payForm.timeStamp,
                        nonceStr: payForm.nonceStr,
                        package: payForm.package,
                        signType: payForm.signType,
                        paySign: payForm.paySign,
                        success: function (res) {
                            console.log('success:' + JSON.stringify(res))
                        },
                        fail: function (err) {
                            console.log('fail:' + JSON.stringify(err))
                        }
                    })
                } else if (paymentMethod === 'UNIONPAY') {
                    clearInterval(this.payResultTimer)
                    const searchParams = {
                        ...params,
                        price: this.cashierParams
                    }
                    let _this = this
                    this.payResultTimer = setInterval(() => {
                        payCallback(searchParams).then((res) => {
                            if (res.data.result) {
                                clearInterval(_this.payResultTimer)
                                this.callback(paymentMethod)
                                // if(this.routerVal.source == 'app' ){
                                //     uni.showToast({ title: '支付成功，返回APP...' })
                                //     setTimeout(() => {
                                //     uni.showModal({
                                //         title: "支付成功",
                                //         content: "您已支付成功，请手动返回APP查看支付结果。",
                                //     })
                                //     }, 1000)
                                // }else{
                                //     this.callback(paymentMethod)
                                // }
                            }
                        })
                    }, 3000)
                    uni.showToast({ title: "调起云闪付小程序...", icon: 'none' })
                    let requestObj = JSON.parse(res.data.result.miniPayRequest);
                    uni.navigateToMiniProgram({
                        appId: requestObj.cqpMpAppId,
                        path: requestObj.cqpMpPath,
                        extraData: {
                            'tn': requestObj.tn
                        },
                        fail(res) {
                            clearInterval(_this.payResultTimer)
                        }
                    })
                }
                else {
                    uni.showToast({
                        icon: 'none',
                        title: '支付成功!'
                    })
                    this.callback(paymentMethod)
                }
            })
            // #endif
        },
        getUserProfile(payment) {
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
                                    storage.setAccessToken(apiRes.data.result.accessToken)
                                    storage.setRefreshToken(apiRes.data.result.refreshToken)

                                    //获取用户信息
                                    getUserInfo().then((user) => {
                                        storage.setUserInfo(user.data.result)
                                        storage.setHasLogin(true)
                                        this.pay(payment)
                                    })
                                })
                            } else {
                                uni.showToast({
                                    title: '系统异常，请联系管理员！',
                                    icon: 'none'
                                })
                            }
                        }
                    })
                },
                fail: (res) => { }
            })
        },
        isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true
            } else {
                return false
            }
        }
    }
}
</script>
<style scoped lang="scss">
.method_icon {
    vertical-align: middle;
}

.union {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .icon {
        width: 80rpx;
        height: 80rpx;
    }

    .name {
        font-size: 28rpx;
        color: #999;
        padding-left: 24rpx;
    }
}

.method_bank {
    width: 80rpx;
    height: 80rpx;
}

.method_name {
    font-size: 28rpx;
    color: #999;
    padding-left: 24rpx;
}

.row {
    display: flex;
    width: 100%;
}

/deep/ .u-row {
    width: 100% !important;
    display: flex;
    justify-content: space-between !important;
}

.method_name,
.col1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col1 {
    text-align: center;
    flex: 99;
}

.col3 {
    text-align: right;
    flex: 1;
}

.payItem {
    padding: 13px 25rpx;
    border-top: 1px solid #f9f9f9;

    line-height: 100rpx;
    font-size: 36rpx;
    color: #333;
}

.ptips {
    font-size: 32rpx;
    margin: 20rpx 0;
    color: #333;

    >span {
        font-size: 40rpx;
        color: #df5a52;
        margin-left: 10rpx;
    }
}

.img {
    width: 392rpx !important;
    height: 296rpx !important;
}

.wrapper {
    min-height: 100vh;
    height: auto;
    background: #f9f9f9;
}

.block-4 {
    background: #fff;
    color: $u-tips-color;

    >p {
        padding: 8rpx;
    }
}

.box {
    background: #fff;
    padding: 40rpx 0;
    //   justify-content: center; //这个是X轴居中
    //   align-items: center; //这个是 Y轴居中
}

.block {
    text-align: center;
    display: block;
    width: 100%;

    image {
        width: 200rpx;
        height: 200rpx;
    }
}

.block-1 {
    margin-top: 80rpx;
}

.btns {
    margin: 0 20rpx;
}
</style>
