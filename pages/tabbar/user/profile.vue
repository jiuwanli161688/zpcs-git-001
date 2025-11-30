<template>
    <view class="container" :style="{ '--gradient-bg-url': `url(${gradientBg_1})`, 'background-size': dynamicBgSize }">
        <view class="wrapper">
            <!-- 用户信息 -->
            <view class="wrap-user">
                <view class="base"></view>
                <view class="link" v-if="isLogin">
                    <!-- 链接二维码 -->
                    <view v-if="objUserInfo.type == '2'" class="lnk-item" data-link="/pages/profile/qrcode" @tap="handlerLink">
                        <image :src="iconQrCode" class="icon"></image>
                    </view>
                    <!-- 系统设置 -->
                    <view class="lnk-item" @tap="goIm" v-if="isFull">
                        <image :src="iconChat" class="icon"></image>
                    </view>
                    <view class="lnk-item" data-link="/pages/config/config" @tap="handlerLink">
                        <image :src="iconConfig" class="icon"></image>
                    </view>
                </view>
            </view>

            <!-- 用户钱包信息 -->
            <view class="wrap-balance" :style="{ background: `url(${profileBg})` }">
                <view class="user-info">
                    <image class="ico" :src="userAvatar" mode="aspectFill"></image>
                    <view class="inf" v-if="isLogin">
                        <view class="name">{{ objUserInfo.nickName }}</view>
                        <view class="grade">
                            <view class="text">{{ userGrade.gradeText }}</view>
                        </view>
                    </view>
                    <view class="log" v-if="!isLogin" data-link="/pages/login/login" @tap="handlerLink">登录/注册</view>
                </view>
                <view class="list">
                    <view class="item">
                        <view class="lab">余额</view>
                        <view class="num">{{ objUserInfo.memberWallet == null ? 0 : objUserInfo.memberWallet }}<text class="unit">元</text></view>
                    </view>
                    <view class="item">
                        <view class="lab">积分</view>
                        <view class="num">{{ objUserInfo.point == null ? 0 : objUserInfo.point }}</view>
                    </view>
                </view>
                <view class="bind" v-if="!objUserInfo.zhongpinMemberPhone && isFull" data-link="/pages/profile/bindMember"
                    @tap="handlerLink">
                    <image class="icon" :src="iconTips" mode="aspectFit"></image>
                    <view class="text text-box">
                        <view>未绑定中品一号水机销售（合伙人系统）手机号</view>
                        <view>同步积分可抵扣订单</view>
                    </view>
                </view>
                <view class="bind" v-if="objUserInfo.zhongpinMemberPhone && isFull">
                    <view class="text text-box">
                        <view>绑定的合伙人手机号：{{ objUserInfo.zhongpinMemberPhone }}</view>
                    </view>
                </view>
            </view>

            <!-- 订单列表链接 -->
            <view class="wrap-menu" v-if="isFull">
                <view class="list">
                    <view class="item" :data-link="item.link" v-for="(item, index) in arrOrderLink" :key="index"
                        @tap="handlerLink">
                        <image :src="item.icon" class="icon" mode="aspectFit"></image>
                        <view class="text">{{ item.text }}</view>
                    </view>
                </view>
            </view>
            <!-- 资讯公告 -->
            <view class="wrap-news">
                <image class="icon" :src="iconNotice" mode="aspectFit" @tap="handleNoticeList"></image>
                <view class="info">
                    <swiper :indicatorDots="false" :autoplay="true" :interval="2500" :duration="500" class="swiper"
                        :vertical="true">
                        <swiper-item v-for="(item, index) in noticeList" :key="index">
                            <view class="notice-item" @tap="handleNoticeDetail(item.code)">
                                {{ '[' + item.date + ']' + item.name }}
                            </view>
                        </swiper-item>
                    </swiper>
                </view>

            </view>
            <!-- 其他操作菜单 -->
            <view class="wrap-menu" v-if="isFull">
                <view class="list">
                    <view class="item" :data-link="item.link" v-for="(item, index) in arrOtherMenu" :key="index"
                        @tap="handlerLink">
                        <image :src="item.icon" class="icon" mode="aspectFit"></image>
                        <view class="text">{{ item.text }}</view>
                    </view>
                </view>
            </view>

            <!-- 普通用户时始终显示申请 -->
            <view class="wrap-sign" v-if="objUserInfo.type == 1 && objUserInfo.applyType == '0'">
                <view class="list">
                    <view class="item">
                        <view class="lnk" @tap="handlerLink" data-link="/pages/apply/dealer/checkIdentity">
                            <view class="text">
                                <view>申请认证</view>
                                <view>分平台服务商</view>
                            </view>
                            <image class="icon" :src="iconDealer" mode="aspectFit"></image>
                        </view>
                    </view>
                    <view class="item">
                        <view class="lnk" @tap="handlerLink" data-link="/pages/apply/supplier/archives">
                            <view class="text">
                                <view>申请认证</view>
                                <view>供应商</view>
                            </view>
                            <image class="icon" :src="iconSupplier" mode="aspectFit"></image>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 有分平台服务商供应商身份显示 -->
            <view class="link-profile" v-if="objUserInfo.applyType != '0' || objUserInfo.type != 1">
                <!-- 查看申请进度 -->
                <!-- 未审核或者待缴保证金 -->
                <view class="lnk-style lnk-style lnk-mb24 lnk-login"
                    v-if="objUserInfo.type == 1 || objUserInfo.storeDisable == 'WAIT_SETTING_DEPOSIT' || objUserInfo.storeDisable == 'WAIT_DEPOSIT'"
                    @tap="cancelApply">
                    取消申请</view>
                <!-- 未审核或者待缴保证金 -->
                <view class="lnk-style lnk-apply"
                    v-if="objUserInfo.type == 1 || objUserInfo.storeDisable == 'WAIT_SETTING_DEPOSIT' || objUserInfo.storeDisable == 'WAIT_DEPOSIT'"
                    @tap="toApplyStatus" data-link="/pages/apply/dealer/status">查看申请进度</view>
                <!-- 进入控制面板 -->
                <!-- 审核通过并且已缴纳保证金 -->
                <view class="lnk-style lnk-login"
                    v-if="objUserInfo.type == 2 || (objUserInfo.type == 3 && objUserInfo.storeDisable == 'OPEN')"
                    @tap="toWorkCenter" data-type="worktop">
                    进入我的工作台</view>
                <!-- 服务续签 -->
                <!-- <view class="lnk-style lnk-login renew-box" -->
                <view class="lnk-style lnk-login renew-box"
                    v-if="isShowRenewBox && (!renewStatus || renewStatus == 'REFUSE')" @tap="handlerRenewLink">合同续签</view>
            </view>
        </view>

        <!-- 底部安全区域占位 -->
        <view class="tabbar-placeholder"></view>

        <!-- 自定义tabbar -->
        <custom-tabbar :current="3" @change="onTabbarChange"></custom-tabbar>
    </view>
</template>

<script>
import * as func from "@/utils/Foundation";
import * as apiMember from '@/api/members'
import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue'
import storage from '@/utils/storage.js'
import { applyCancel } from "../../../api/members"; //缓存
import * as API_Trade from "@/api/trade";
import { navigateToLogin } from "../../../utils/filters";
import { logout } from "../../../api/login";
// import '../../../static/fonts/iconfont/iconfont.css';
import { getNoticeList } from "../../../api/home";
import { createChatPool } from "@/api/im";
import { getUpgradeStatus } from '@/api/common.js'

export default {
    name: '',
    components: {
        CustomTabbar
    },
    data() {
        return {
            isComplete: false,
            iconChat: `${this.iconCommon}/static/v1/help/icon-chat.png`,
            iconTips: `${this.iconCommon}/static/v1/profile/icon-tips.png`,
            iconQrCode: `${this.iconCommon}/static/v1/profile/icon-qrcode.png`,
            iconConfig: `${this.iconCommon}/static/v1/profile/icon-config.png`,
            iconDealer: `${this.iconCommon}/static/v1/profile/icon-dealer.png`,
            iconSupplier: `${this.iconCommon}/static/v1/profile/icon-supplier.png`,
            iconNotice: `${this.iconCommon}/static/profile/announcement-icon.png`,

            // 消费者
            iconGrade1: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
            // 分平台服务商
            iconGrade2: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
            // 供应商
            iconGrade3: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`,
            isLogin: false,
            arrOrderLink: [],
            arrOtherMenu: [],
            objUserInfo: {
                face: `${this.iconCommon}/static/v1/profile/avatar.png`, // 默认头像
                nickName: '', // 用户昵称
                grade: 0, // 用户类型
                gradeIcon: '', // 用户类型图标
                gradeText: '', // 用户类型文本
                isBindMember: false, // 是否绑定中品用户系统
                memberWallet: 0, // 钱包余额
                totalPoint: 0 // 用户积分
            },
            noticeList: [],
            isShowRenewBox: false, // 是否展示合同续签
            renewStatus: '', // 续签状态
            profileBg: `${this.iconCommon}/static/profile/profile-bg.png`,
            gradientBg_1: `${this.iconCommon}/static/profile/gradient-bg_1.png`,
        }
    },
    computed: {
      isFull(){
        return this.$store.state.isFull
      },
        // 动态调整背景高度 - 未登录时减去link高度
        dynamicBgSize() {
            const linkHeight = 64; // .link 的高度
            const appHeight = 712; // APP端基础高度
            const h5Height = 624; // H5端基础高度

            if (!this.isLogin) {
                // 未登录状态，减去link高度
                // #ifdef APP-PLUS
                return `100% ${appHeight - linkHeight}rpx`;
                // #endif
                // #ifdef H5
                return `100% ${h5Height - linkHeight - 20}rpx`;
                // #endif
            } else {
                // 已登录状态，使用原始高度
                // #ifdef APP-PLUS
                return `100% ${appHeight}rpx`;
                // #endif
                // #ifdef H5
                return `100% ${h5Height}rpx`;
                // #endif
            }
        },
        userAvatar() {
            // 检查用户头像是否存在
            if (this.objUserInfo.face) {
                return this.objUserInfo.face
            } else {
                // 返回默认头像路径
                return `${this.iconCommon}/static/v1/profile/avatar.png`
            }
        },
        // 用户等级处理
        userGrade() {
            if (this.objUserInfo.type) {
                if (this.objUserInfo.type == '1') {
                    return {
                        gradeText: '中品维度用户',
                        gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                    }
                }
                if (this.objUserInfo.type == '2') {
                    if (this.objUserInfo.zpyhUserType == 1) {
                        return {
                            gradeText: '中品C类服务商',
                            gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                        }
                    } else if (this.objUserInfo.zpyhUserType == 2) {
                        return {
                            gradeText: '中品B类服务商',
                            gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                        }
                    } else if (this.objUserInfo.zpyhUserType == 3) {
                        return {
                            gradeText: '中品A类服务商',
                            gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                        }
                    } else if (this.objUserInfo.zpyhUserType == 4) {
                        return {
                            gradeText: '中品A+类服务商',
                            gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                        }
                    } else {
                        return {
                            gradeText: '分平台服务商',
                            gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                        }
                    }
                }
                if (this.objUserInfo.type == '3') {
                    return {
                        gradeText: '中品供应商',
                        gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                    }
                }
            } else {
                return {
                    gradeText: '中品维度用户',
                    gradeIcon: `${this.iconCommon}/static/v1/profile/icon-grade_1.png`
                }
            }
        }
    },
    methods: {
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
        cancelApply: function () {
            let that = this;
            if (!this.canceling) {
                uni.showModal({
                    title: "确认取消吗",
                    success(res) {
                        if (res.confirm) {
                            that.canceling = true;
                            uni.showLoading({ title: "正在取消" })
                            applyCancel().then(res => {
                                that.canceling = false
                                uni.hideLoading();
                                if (res.data.code == 200) {
                                    that.loadUserInfo();
                                } else {
                                    that.$u.toast(res.data.message);
                                }
                            })
                        }
                    }
                })
            }
        },
        toApplyStatus: function () {
            if (this.objUserInfo.applyType == '1') {
                uni.navigateTo({ url: '/pages/apply/dealer/status' })
            } else if (this.objUserInfo.applyType == '2' || this.objUserInfo.applyType == '0') {  // applytype 0未申请(审核通过) 1申请分平台服务商 2申请供应商
                if (this.objUserInfo.storeDisable == 'APPLYING' || this.objUserInfo.storeDisable == 'WAIT_SETTING_DEPOSIT' || this.objUserInfo.storeDisable == 'WAIT_SIGN' || this.objUserInfo.storeDisable == 'APPLY' || this.objUserInfo.storeDisable == 'REFUSED') {
                    uni.navigateTo({ url: '/pages/apply/supplier/status' })
                } else if (this.objUserInfo.storeDisable == 'WAIT_DEPOSIT') {
                    uni.navigateTo({ url: '/pages/apply/supplier/bond' })
                } else if (this.objUserInfo.storeDisable == 'CHECK_ACCOUNT') {
                    uni.navigateTo({ url: '/pages/apply/supplier/archives?source=already' })
                } else if (this.objUserInfo.storeDisable == 'PAYMENT_FINISHED') {
                    uni.navigateTo({ url: '/pages/apply/supplier/verify?source=already&status=PAYMENT_FINISHED' })
                }
            }
        },
        toWorkCenter: function () {
            if (this.objUserInfo.type == '2') {
                uni.navigateTo({ url: '/pages/dealerCenter/home' })

            } else if (this.objUserInfo.type == '3') {
                uni.navigateTo({ url: '/pages/supplierCenter/home' })
            }
        },
        // 合约续签页面跳转
        handlerRenewLink: function () {
            if (this.objUserInfo.type == '2') { // 服务商
                uni.navigateTo({ url: '/pages/apply/dealer/signature?renewState=true' })

            } else if (this.objUserInfo.type == '3') { // 供应商
                uni.navigateTo({ url: '/pages/apply/supplier/signature?renewState=true' })
            }
        },
        // 链接跳转:注意仅限普通页面
        handlerLink: function (e) {
            let eType = e.currentTarget.dataset.type
            let eLink = e.currentTarget.dataset.link
            // 分平台服务商中心
            if (eType == 'worktop' && this.objUserInfo.type == 2) {
                eLink = "/pages/dealerCenter/home"
            }
            // 供应商中心
            if (eType == 'worktop' && this.objUserInfo.type == 3) {
                eLink = "/pages/supplierCenter/home"
            }
            
            // 服务商中心 (无需登录)
            if (eLink == '/pages/service/center/index' || eLink == '/pages/mine/businessDistrict/merchantWorkbench') {
                 uni.navigateTo({ url: eLink })
                 return
            }

            if (!this.isLogin) {
                // 跳转登录
                uni.reLaunch({
                    url: '/pages/login/login'
                })
                return
            }
            //分平台服务商认证
            if (eLink == '/pages/apply/dealer/checkIdentity') {
                if (this.objUserInfo.distributorId) {
                    eLink = "/pages/apply/dealer/archives?source=already"
                }
            }
            if (eLink == '/pages/apply/supplier/archives') {
                if (this.objUserInfo.storeId) {
                    eLink = "/pages/apply/supplier/archives?source=already"
                }
            }

            uni.navigateTo({ url: eLink })
        },

        // 加载用户信息
        loadUserInfo: function () {
            let that = this;
            if (this.isLogin) {
                apiMember.getUserInfo().then((user) => {
                    if (user.data.success) {
                        let userResult = user.data.result
                        let userInfo = storage.getUserInfo();
                        if (userInfo.distributorState != userResult.distributorState && userResult.distributorState == 4) {
                            uni.showModal({
                                content: "用户身份变化，请重新登录",
                                confirmText: "确认",
                                success: (res) => {
                                    //   logout();
                                    storage.setAccessToken('');
                                    storage.setRefreshToken('');
                                    storage.setUserInfo({});
                                    navigateToLogin("redirectTo");
                                },
                            });

                        }
                        /**
                         * 个人信息存储到缓存userInfo中
                         */
                        storage.setUserInfo(user.data.result)
                        storage.setHasLogin(true)
                        storage.setAutoCp(0)
                        this.objUserInfo = user.data.result
                        // this.gradeDispose()
                        if (userInfo != '' && userInfo != null && userInfo.mobile == null) {
                            uni.redirectTo({
                                url: "/pages/login/bind",
                            })
                            return
                        }
                    } else {
                        // 跳转登录
                        uni.redirectTo({
                            url: '/pages/login/login'
                        })
                    }
                })
                // this.objUserInfo = this.$options.filters.isLogin();
            } else {
                // 跳转登录
                uni.redirectTo({
                    url: '/pages/login/login'
                })
            }
        },
        loadCartList: function () {
            API_Trade.getCarts().then(res => {
                const token = storage.getAccessToken();
                if (token) {
                    if (res.data.success) {
                        let cartDetail = res.data.result;
                        if (cartDetail.cartList.length > 0) {
                            let arrNums = cartDetail.cartList.map(item => {
                                return item.checkedSkuList.length
                            })
                            let shopNums = 0;
                            for (let i = 0; i < arrNums.length; i++) {
                                shopNums += arrNums[i]
                            }
                            if (shopNums) {
                                // 更新store中的购物车数量
                                this.$store.commit('updateCartCount', shopNums);
                                uni.setTabBarBadge({
                                    index: 2,
                                    text: shopNums.toString()
                                })
                            } else {
                                // 更新store中的购物车数量为0
                                this.$store.commit('updateCartCount', 0);
                                uni.removeTabBarBadge({
                                    index: 2
                                })
                            }
                        }
                    }
                }

            })
        },
        handlerPay: function () {
            uni.navigateTo({
                url: '/pages/apply/supplier/bond'
            })
        },
        handlerSecurity: function () {
            uni.navigateTo({
                url: '/pages/apply/supplier/security'
            })
        },
        //跳转公告列表
        handleNoticeList: function () {
            uni.navigateTo({
                url: '/pages/profile/consultNotice'
            })
        },
        //跳转公告详情
        handleNoticeDetail: function (id) {
            uni.navigateTo({
                url: '/pages/profile/noticeDetail?id=' + id
            })
        },

        // 获取公告列表
        loadNoticeData: function () {
            getNoticeList().then(res => {
                this.noticeList = res.data.result.records.map(o => {
                    return {
                        name: o.informationTitle,
                        code: o.id,
                        date: func.tampToDate(func.dateToUnix(o.createTime), 'Y-M-D')
                    }
                })
            })
        },
        // 是否展示合同续签按钮
        isShowRenewBoxEve() {
            // 时间判断 是否展示合同续签
            let crtDaysTimestamp = new Date().getTime(); // 当前时间戳
            let signEndDateTimestamp = new Date(this.objUserInfo.signEndDate).getTime(); // 获取合同终止日期时间戳
            let thirtyDaysAgoTimestamp = new Date(signEndDateTimestamp - (30 * 24 * 60 * 60 * 1000)).getTime(); // 获取合同终止日期30天前的时间戳

            if (this.objUserInfo.signEndDate && crtDaysTimestamp > thirtyDaysAgoTimestamp) {
                this.isShowRenewBox = true
                this.renewStatus = this.objUserInfo.renewStatus
            }
        },
        // 跳转im页面
        goIm() {
            createChatPool().then(res => {
                if (res.data.code == 200) {
                    uni.navigateTo({
                        url: `/pages/customerService/servicecenter`
                    });
                }
            })
        },
        // tabbar切换处理
        onTabbarChange(index) {
        }
    },
    onLoad: function () {
        //公告列表
        this.loadNoticeData()

        // 订单链接
        this.arrOrderLink.push({ text: '待付款', icon: `${this.iconCommon}/static/profile/icon-order_1.png`, link: '/pages/profile/order/home?state=1' })
        this.arrOrderLink.push({ text: '待发货', icon: `${this.iconCommon}/static/profile/icon-order_2.png`, link: '/pages/profile/order/home?state=2' })
        this.arrOrderLink.push({ text: '待收货', icon: `${this.iconCommon}/static/profile/icon-order_3.png`, link: '/pages/profile/order/home?state=3' })
        this.arrOrderLink.push({ text: '待评价', icon: `${this.iconCommon}/static/profile/icon-order_4.png`, link: '/pages/profile/order/home?state=5' })
        this.arrOrderLink.push({ text: '我的订单', icon: `${this.iconCommon}/static/profile/icon-order_5.png`, link: '/pages/profile/order/home?state=0' })
        // 用户菜单
        this.arrOtherMenu.push({ text: '我的足迹', icon: `${this.iconCommon}/static/v1/profile/icon-menu_01.png`, link: '/pages/profile/track' })
        this.arrOtherMenu.push({ text: '我的收藏', icon: `${this.iconCommon}/static/v1/profile/icon-menu_02.png`, link: '/pages/profile/collect' })
        this.arrOtherMenu.push({ text: '我的定制', icon: `${this.iconCommon}/static/v1/profile/icon-menu_03.png`, link: '/pages/profile/order/home?customFlag=true' })
        this.arrOtherMenu.push({ text: '我的钱包', icon: `${this.iconCommon}/static/v1/profile/icon-menu_04.png`, link: '/pages/profile/wallet/home' })
        this.arrOtherMenu.push({ text: '售后/退款', icon: `${this.iconCommon}/static/v1/profile/icon-menu_05.png`, link: '/pages/profile/afterSales/home' })
        this.arrOtherMenu.push({ text: '交易纠纷', icon: `${this.iconCommon}/static/v1/profile/icon-menu_06.png`, link: '/pages/profile/complaint/home' })
        this.arrOtherMenu.push({ text: '我的评价', icon: `${this.iconCommon}/static/v1/profile/icon-menu_07.png`, link: '/pages/profile/comment/home' })
        this.arrOtherMenu.push({ text: '我的发票', icon: `${this.iconCommon}/static/v1/profile/icon-menu_08.png`, link: '/pages/profile/invoice/home' })
        this.arrOtherMenu.push({ text: '收件地址', icon: `${this.iconCommon}/static/v1/profile/icon-menu_09.png`, link: '/pages/config/address/home' })
        this.arrOtherMenu.push({ text: '关于中品', icon: `${this.iconCommon}/static/v1/profile/icon-menu_10.png`, link: '/pages/profile/about' })
        this.arrOtherMenu.push({ text: '商家工作台', icon: `${this.iconCommon}/static/v1/profile/icon-dealer.png`, link: '/pages/mine/businessDistrict/merchantWorkbench' })
        this.arrOtherMenu.push({ text: '服务商中心', icon: `${this.iconCommon}/static/v1/profile/icon-dealer.png`, link: '/pages/service/center/index' })
    },
    onShow: function () {
        this.getUpgradeStatus()
        // 是否登录赋值
        this.objUserInfo = storage.getUserInfo() || {}
        this.isLogin = this.$options.filters.isLogin('auth')
        const token = storage.getAccessToken();
        const Refreshtoken = storage.getRefreshToken();


        if (token) {
            // 加载用户信息
            this.loadUserInfo();

            this.loadCartList();
        } else {
            this.objUserInfo = {}
            this.isLogin = false

            uni.removeTabBarBadge({
                index: 2,
            })
        }
        // 是否展示合同续签按钮
        this.isShowRenewBoxEve()

    }
}
</script>

<style lang="scss" scoped>

.container {
    background: var(--gradient-bg-url) no-repeat center top;
    height: 100%;
    box-sizing: border-box;
    padding: 0 0 20rpx;
    position: relative;
    .wrapper {
        position: relative;
        padding: 0 20rpx;
        z-index: 1;

        .wrap-user {
            padding: calc(var(--status-bar-height) + 88rpx) 0 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .link {
                display: flex;
                justify-content: flex-end;
                align-items: center;

                .lnk-item {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 64rpx;
                    height: 64rpx;

                    &:last-of-type {
                        margin: 0 0 0 8rpx;
                    }

                    .icon {
                        width: 44rpx;
                        height: 44rpx;
                    }
                }
            }
        }

        .wrap-balance {
            min-height: 300rpx;
            background-size: 100% 290rpx !important;
            background-repeat: no-repeat !important;
            .user-info{
                display: flex;
                align-items: center;
                margin-top: 40rpx;
                margin-left: 60rpx;
                .ico {
                    width: 162rpx;
                    height: 162rpx;
                    border-radius: 162rpx;
                    margin-top: -60rpx;
                    flex-shrink: 0;
                }

                .log {
                    padding: 0 0 0 20rpx;
                    color: #3D3D3D;
                    font-size: 36rpx;
                    font-weight: 700;
                    line-height: 72rpx;
                }

                .inf {
                    padding: 30rpx 40rpx 0rpx 40rpx;

                    .name {
                        line-height: 36rpx;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #3D3D3D;
                        font-size: 36rpx;
                        font-weight: 700;
                        max-width: 400rpx;
                    }

                    .grade {
                        background: rgba(255, 255, 255, 0.5);
                        border-radius: 50rpx 8rpx 100rpx 50rpx;
                        padding: 0 20rpx 0 16rpx;
                        background: linear-gradient( 270deg, #FCEBB6 0%, #EBB248 96%);
                        display: inline-block;
                        min-width: fit-content;
                        margin-top: 20rpx;
                        border: 4rpx solid #FFFFFF;
                        .text {
                            color: #815303;
                            font-size: 20rpx;
                        }
                    }
                }
            }
            .bind {
                padding: 0 16rpx;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                background: #FFEAD5;
                border-radius: 10rpx;
                margin: 0 18rpx 18rpx;
                .icon {
                    width: 32rpx;
                    height: 32rpx;
                }

                .text {
                    padding: 10rpx 0 10rpx 12rpx;
                    color: #a7713b;
                    font-size: 20rpx;
                    // line-height: 60rpx;
                }
            }

            .list {
                padding: 40rpx 0 20rpx;
                display: flex;
                flex-wrap: wrap;

                .item {
                    flex: 1;
                    -ms-flex: 0 0 50%;
                    flex: 0 0 50%;
                    max-width: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;

                    &:first-of-type {
                        position: relative;

                        &::after {
                            position: absolute;
                            content: '';
                            background: #666666;
                            right: 0;
                            top: 50%;
                            bottom: 0;
                            width: 3rpx;
                            height: 34rpx;
                            transform: translateY(-50%);
                        }
                    }

                    .num {
                        color: #3D3D3D;
                        font-size: 44rpx;
                        font-weight: bold;
                        line-height: 48rpx;
                        .unit{
                            font-size: 24rpx;
                        }
                    }

                    .lab {
                        color: #666666;
                        font-size: 28rpx;
                        line-height: 48rpx;
                        margin-right: 14rpx;
                    }
                }
            }
        }

        .wrap-news {
            background: #fff;
            border-radius: 12rpx;
            box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.06);
            padding: 0rpx 20rpx;
            margin: 24rpx 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .icon {
                width: 78rpx;
                height: 32rpx;
            }

            .info {
                width: calc(100vw - 40rpx - 40rpx - 64rpx);
                height: 66rpx;
                box-sizing: border-box;
                padding: 0 0 0 20rpx;

                // .swiper {
                //     height: 70rpx;
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                //     padding: 0rpx 20rpx;
                //     padding-top: 15rpx;
                //     box-sizing: border-box;
                // }
                .swiper {
                    height: 66rpx;

                    .notice-item {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: #666666;
                        font-size: 24rpx;
                        line-height: 66rpx;
                        height: 66rpx;

                    }
                }

                // margin-left: 10rpx;
                // padding-top: 6rpx;
                // box-sizing: border-box;

            }

            .more {}
        }

        .wrap-menu {
            background: #fff;
            border-radius: 12rpx;
            box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.06);
            padding: 20rpx 0;
            margin: 24rpx 0 0;

            .list {
                display: flex;
                flex-wrap: wrap;

                .item {
                    flex: 1;
                    -ms-flex: 0 0 20%;
                    flex: 0 0 20%;
                    max-width: 20%;
                    height: 120rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    .icon {
                        width: 64rpx;
                        height: 64rpx;
                    }

                    .text {
                        line-height: 48rpx;
                        color: #333;
                        font-size: 24rpx;
                    }
                }
            }
        }

        .wrap-sign {
            margin: 24rpx 0 0;

            .list {
                display: flex;
                margin: 0 -10rpx;

                .item {
                    flex: 1;
                    -ms-flex: 0 0 50%;
                    flex: 0 0 50%;
                    max-width: 50%;
                    box-sizing: border-box;
                    padding: 0 10rpx;

                    .lnk {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #fff;
                        border-radius: 12rpx;
                        padding: 16rpx 0;

                        .text {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;
                            color: #e22221;
                            font-size: 26rpx;
                            line-height: 36rpx;
                        }

                        .icon {
                            margin: 0 0 0 16rpx;
                            width: 120rpx;
                            height: 120rpx;
                        }
                    }
                }
            }
        }

        .link-profile {
            margin: 24rpx 0 0;

            .lnk-style {
                height: 88rpx;
                line-height: 88rpx;
                text-align: center;
                font-size: 28rpx;
                border-radius: 12rpx;
            }

            .lnk-login {
                background: #e22221;
                border: 3rpx solid #e22221;
                color: #fff;
            }

            .renew-box {
                margin-top: 10rpx;
            }

            .lnk-apply {
                background: #fff;
                border: 3rpx solid #dcdee0;
                color: #323232;
                box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.06);
            }
        }
    }
}

.icon,
.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}

// tabbar占位区域
.tabbar-placeholder {
    height: 98rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
</style>
