<script>
/**
 * vuex管理登录状态，具体可以参考官方登录模板示例
 */
import { mapMutations } from 'vuex'
import APPUpdate from '@/plugins/APPUpdate'
import { getClipboardData } from '@/js_sdk/h5-copy/h5-copy.js'
import config from '@/config/config'
import storage from '@/utils/storage'
import { getPageConfig } from '@/api/common.js'
import { createUser } from '@/api/im.js'
import * as API_Trade from '@/api/trade'
import { whetherNavigate } from '@/utils/Foundation' //登录跳转
import { getSetIntervalXInstallInfo } from '@/utils/xinstall_util'
import { switchTab } from '@/utils/tabbar.js' // 导入自定义tabbar跳转函数

import { getUpgradeStatus } from '@/api/common.js'

/**
 * 路由监听并删除路由
 * https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html
 * */

// #ifdef MP-WEIXIN
wx.onAppRoute((res) => {
    const pages = getCurrentPages()
    if (pages.length > 3) {
        delete getCurrentPages()[2]
    }
})
// #endif

export default {
    data() {
        return {
            config
        }
    },
    /**
     * 监听返回
     */
    onBackPress(e) {
        if (e.from == 'backbutton') {
            let routes = getCurrentPages()
            let curRoute = routes[routes.length - 1].options
            routes.forEach((item) => {
                if (item.route == 'pages/tabbar/cart/cartList' || item.route.indexOf('pages/product/goods') != -1) {
                    uni.redirectTo({
                        url: item.route
                    })
                }
            })

            if (curRoute.addId) {
                uni.reLaunch({
                    url: '/pages/tabbar/cart/cartList'
                })
            } else {
                uni.navigateBack()
            }
            return true //阻止默认返回行为
        }
    },
    onLaunch: function () {
        // 立即设置默认的isFull值，避免首页显示undefined
        // this.$store.commit('updateIsFull', this.config.isFull);

        // #ifdef H5
        // this.updateTabBarByIsFull(this.config.isFull);
        // #endif
        // #ifdef APP-PLUS
		getSetIntervalXInstallInfo(this.successCallback, this.errorCallback)
        this.checkArguments() // 检测启动参数
        APPUpdate()

        // 重点是以下： 一定要监听后台恢复 ！一定要
        plus.globalEvent.addEventListener('newintent', (e) => {
            this.checkArguments() // 检测启动参数
        })
        // #endif

        // #ifdef MP-WEIXIN
        this.applyUpdateWeChat()
        // #endif
        this.loadPageConfig() // 获取分页数量配置
    },

    onShow() {
        this.getUpgradeStatus()
        whetherNavigate('', 2)
        // let objUserInof = storage.getUserInfo()
        // if (objUserInof.type == 1) {
        // 	this.getImToken(false, false)
        // }
        // if (objUserInof.type == 2) {
        // 	this.getImToken(true, false)
        // }
        // if (objUserInof.type == 3) {
        // 	this.getImToken(false, true)
        // }
        this.loadConfig() // 获取全局配置
        this.updateCartCount() // 更新购物车数量

        // #ifndef H5
        if (this.config.enableGetClipboard) {
            this.getClipboard()
        }
        // #endif
        // #ifdef APP-PLUS

        if (storage.getShow()) {
            if (uni.getSystemInfoSync().platform == 'ios') {
                this.$u.route('/pages/tabbar/screen/fullScreen')
            }
        }
        // #endif
    },
    methods: {
        ...mapMutations(['login']),
          // #ifdef APP-PLUS
        errorCallback(data){
            this.$store.commit('setXInstallLoading', false)
        },
		successCallback(data) {
            this.$store.commit('setXInstallLoading', false)
            // uni.showModal({
            //     title: '在app.vue，定时任务有值',
            //     content: JSON.stringify(data),
            //     success: function (res) {
            //         if (res.confirm) {
            //             console.log('用户点击确定')
            //         } else if (res.cancel) {
            //             console.log('用户点击取消')
            //         }
            //     }
            // })
            let userInfo = storage.getUserInfo()
            let xInstallGoodsObj = uni.getStorageSync('xInstallGoodsObj')
            // 未登录有商品id，则跳转商品详情页
            if ((!userInfo || userInfo == '' || Object.keys(userInfo).length == 0) && (xInstallGoodsObj && xInstallGoodsObj.goodsId )) {
                uni.redirectTo({
                url: `/pages/product/goods?id=${xInstallGoodsObj.id}&goodsId=${xInstallGoodsObj.goodsId}`
                })
                uni.removeStorageSync('xInstallGoodsObj')
                return
            }
            // 已登录并且绑定服务商并且有商品id，则跳转商品详情页
            if (userInfo && userInfo !== '' && Object.keys(userInfo).length > 0 && userInfo.bindDistributorId && xInstallGoodsObj && xInstallGoodsObj.goodsId ) {
                uni.redirectTo({
                url: `/pages/product/goods?id=${xInstallGoodsObj.id}&goodsId=${xInstallGoodsObj.goodsId}`
                })
                uni.removeStorageSync('xInstallGoodsObj')
                return
            }
        },
        // #endif
        // 获取升级状态
        getUpgradeStatus() {
            getUpgradeStatus().then((res) => {
                if(res.data.success) {
                    if(res.data.result.status == 2){
                        uni.reLaunch({
                            url: '/pages/help/upgrade'
                        })
                    }
                }
            })
        },
        // 获取分页数量配置
        loadPageConfig() {
            getPageConfig().then((res) => {
                uni.setStorageSync('pageConfig', res.data.result)
            })
        },
        // 获取全局配置
        loadConfig() {
            API_Trade.getConfig()
                .then((res) => {
                    if (res.data.success) {
                        // 更新全局配置中的isFull值
                        // #ifdef APP-PLUS
                        this.$store.commit('updateIsFull', true)
                        // #endif
                        // #ifdef H5
                        this.updateTabBarByIsFull(this.$store.state.isFull)
                        // #endif
                        // #ifdef MP-WEIXIN
                        let isFull = false
                        if (res.data.result == 0) {
                            isFull = true
                        } else if (res.data.result == 1) {
                            isFull = false
                        }
                        this.$store.commit('updateIsFull', isFull)
                        // #endif
                    }
                })
                .catch((err) => {
                    console.error('获取配置失败:', err)
                })
        },
        // 获取token
        getImToken(distributorFlag, storeFlag) {
            createUser({ distributorFlag, storeFlag }).then((res) => {
                if (res.statusCode == 200) {
                    uni.setStorageSync('him-token', res.data.data)
                    if (!this.ws.wsIsConnected) {
                        this.ws.wsConnect(uni.getStorageSync('him-token'))
                    }
                }
            })
        },
        /**
         * 微信小程序版本提交更新版本 解决缓存问题
         */
        applyUpdateWeChat() {
            const updateManager = uni.getUpdateManager()

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
            })

            updateManager.onUpdateReady(function (res) {
                uni.showModal({
                    title: '更新提示',
                    content: '发现新版本，是否重启应用？',
                    success(res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })
            })
            updateManager.onUpdateFailed(function (res) {
                // 新的版本下载失败
            })
        },

        //  TODO 开屏广告 后续优化添加
        launch() {
            try {
                // 获取本地存储中launchFlag标识 开屏广告
                const value = uni.getStorageSync('launchFlag')
                if (!value) {
                    // this.$u.route("/pages/index/agreement");
                } else {
                    //app启动时打开启动广告页
                    var w = plus.webview.open(
                        '/hybrid/html/advertise/advertise.html',
                        '本地地址',
                        {
                            top: 0,
                            bottom: 0,
                            zindex: 999
                        },
                        'fade-in',
                        500
                    )
                    //设置定时器，4s后关闭启动广告页
                    setTimeout(function () {
                        plus.webview.close(w)
                        APPUpdate()
                    }, 3000)
                }
            } catch (e) {
                // error
                uni.setStorage({
                    key: 'launchFlag',
                    data: true,
                    success: function () {}
                })
            }
        },

        /**
         * 获取粘贴板数据
         */
        async getClipboard() {
            let res = await getClipboardData()

            /**
             * 解析粘贴板数据
             */

            if (res.indexOf(config.shareLink) != -1 && res != this.$store.state.shareLink) {
                this.$store.state.shareLink = res
                uni.showModal({
                    title: '提示',
                    content: '检测到一个分享链接是否跳转？',
                    confirmText: '跳转',
                    success: function (callback) {
                        if (callback.confirm) {
                            const path = res.split(config.shareLink)[1]
                            if (path.indexOf('tabbar') != -1) {
                                uni.reLaunch({
                                    url: path
                                })
                            } else {
                                uni.navigateTo({
                                    url: path
                                })
                            }
                        }
                    }
                })
            }
        },

        /**
         * h5中打开app获取跳转app的链接并跳转
         */
        checkArguments() {
            // #ifdef APP-PLUS
            setTimeout(() => {
                const args = plus.runtime.arguments
                if (args) {
                    const argsStr = decodeURIComponent(args)
                    const path = argsStr.split('//')[1]
                    if (path.indexOf('tabbar') != -1) {
                        uni.reLaunch({
                            url: `/${path}`
                        })
                    } else {
                        uni.navigateTo({
                            url: `/${path}`
                        })
                    }
                }
            })
            // #endif
        },
        // 根据isFull动态调整tabBar
        updateTabBarByIsFull(isFull) {
            // 只在H5下处理
            // #ifdef H5
            // 分类index:1，购物车index:2
            if (!isFull) {
                // 隐藏分类和购物车
                uni.setTabBarItem({ index: 1, visible: false })
                uni.setTabBarItem({ index: 2, visible: false })
            }
            // #endif
        },
        // 更新购物车数量
        updateCartCount() {
            if (storage.getHasLogin()) {
                const API_Trade = require('@/api/trade')
                API_Trade.getCarts().then((res) => {
                    if (res.data && res.data.success) {
                        let cartDetail = res.data.result;
                        if (cartDetail.cartList && cartDetail.cartList.length > 0) {
                            // 只统计有效商品数量（checkedSkuList中的商品）
                            let arrNums = cartDetail.cartList.map(item => {
                                return item.checkedSkuList.length
                            })
                            let shopNums = 0;
                            for (let i = 0; i < arrNums.length; i++) {
                                shopNums += arrNums[i]
                            }
                            this.$store.commit('updateCartCount', shopNums)
                        } else {
                            this.$store.commit('updateCartCount', 0)
                        }
                    } else {
                        this.$store.commit('updateCartCount', 0)
                    }
                }).catch(() => {
                    this.$store.commit('updateCartCount', 0)
                })
            } else {
                this.$store.commit('updateCartCount', 0)
            }
        }
    }
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import url('./static/fonts/iconfont/iconfont.css');
._xbanner{
    // bottom:env(safe-area-inset-bottom);
    // padding-bottom:calc(env(safe-area-inset-bottom) - 10rpx);
 td{
    height: 80px!important;
 }
}
.fixed-link {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding-top: 24rpx;
    padding-left: 24rpx;
    padding-right: 24rpx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);

    &::after {
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        top: 0;
        height: 3rpx;
        background: rgba(0, 0, 0, 0.08);
    }
}

.container-patch {
    padding-bottom: calc(constant(safe-area-inset-bottom) + 48rpx + 80rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 48rpx + 80rpx);
}

// -------适配底部安全区  苹果x系列刘海屏

// #ifdef MP-WEIXIN
.mp-iphonex-bottom {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
    height: auto !important;
    padding-top: 10rpx;
}

// #endif

body {
    background-color: $bg-color;
}

/************************ */
.w200 {
    width: 200rpx !important;
}

.flex1 {
    flex: 1; //必须父级设置flex
}
</style>
