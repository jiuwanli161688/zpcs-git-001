<template>
  <view class="container">
    <!-- 等待 -->
    <view v-if="storeDisable == 'APPLYING' || storeDisable == 'WAIT_SETTING_DEPOSIT'">
      <view class="status">
        <image class="icon" :src="iconWaiting" mode="aspectFit"></image>
        <view class="text">申请资料已提交，平台将尽快处理您的申请，请您耐心等待。</view>
      </view>
      <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
    </view>
    <!-- 成功 -->
    <!-- 注：申请成功信息不在这里显示 -->
    <!--
    <view class="status">
      <image class="icon" :src="iconSuccess" mode="aspectFit"></image>
      <view class="text">您的资料已通过审核，点击下一步线上签约</view>
    </view>
    <view class="lnk-common lnk-primary" @tap="handlerSigning">下一步</view>
    -->
    <!-- 失败 -->
    <view v-if="storeDisable == 'REFUSED'">
      <view class="status">
        <image class="icon" :src="iconFailed" mode="aspectFit"></image>
        <view class="text">审核失败：{{ reviewReason }}</view>
      </view>
      <view class="lnk-common lnk-primary" @tap="handlerReback">重新填写</view>
    </view>

    <view v-if="storeDisable == 'WAIT_SIGN' || storeDisable == 'APPLY'">
      <view class="status">
        <view class="text">暂未提交完成，点击下方按钮继续填写</view>
      </view>
      <view class="lnk-common lnk-primary" @tap="handlerReback">继续填写</view>
    </view>
    <view v-if="storeDisable == 'OPEN'">
      <view class="status" v-if="!renewAuditStatus || renewAuditStatus == 'PASS'">
        <view class="text">申请资料已经审核通过，稍后“我的”中将同步更新</view>
        <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
      </view>
      <view class="status" v-if="renewAuditStatus == 'REFUSE'">
        <view class="text">续签申请已被驳回，请重新申请</view>
        <view class="text">驳回原因：<text>{{renewRejectReason}}</text></view>
        <view class="lnk-common lnk-primary" @tap="renewHandlerProfile">重新续签</view>
        <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
      </view>
      <view class="status" v-if="renewAuditStatus == 'TOBEAUDIT'">
        <view class="text">续签申请资料已提交，请等待审核结果</view>
        <view class="lnk-common lnk-primary" @tap="handlerProfile">返回用户中心</view>
      </view>
    </view>

  </view>
</template>

<script>
import storage from '@/utils/storage.js'
import { distributorReviewInfo } from "../../../api/distributor";
import { applySupplierReviewInfo } from "../../../api/store"; //缓存


export default {
  name: '',
  components: {

  },
  data() {
    return {
      isComplete: false,
      iconSuccess: `${this.iconCommon}/static/v1/common/icon-success.png`,
      iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
      iconWaiting: `${this.iconCommon}/static/v1/common/icon-waiting.png`,
      userInfo: storage.getUserInfo(),
      reviewReason: "",
      reviewTime: "",
      storeDisable: "",
      renewAuditStatus: '',
	  renewRejectReason: '',
    }
  },
  methods: {
	// 重新续签
	renewHandlerProfile: function() {
      uni.navigateTo({
        url: `/pages/apply/supplier/signature?access=${storage.getAccessToken()}&refresh=${storage.getRefreshToken()}&renewState=true`
      })
	},
    // 返回用户中心
    handlerProfile: function () {
      uni.reLaunch({
        url: '/pages/tabbar/user/profile'
      })
    },

    // 跳转资料填写
    handlerReback: function () {
      uni.navigateTo({
        url: '/pages/apply/supplier/archives?source=already'
      })
    },
  },
  onLoad: function () {

  },
  onShow: function () {
    uni.showLoading({ title: "加载中" })
    applySupplierReviewInfo().then(res => {
      uni.hideLoading();
      if (res.data.code == 200) {
        let result = res.data.result;
        if (result.storeDisable == 'REFUSED') {
          this.reviewReason = result.reviewReason;
        }
        if (result.renewAuditStatus == 'REFUSE') {
          this.renewRejectReason = result.renewRejectReason;
        }
        if (result.storeDisable == 'WAIT_DEPOSIT') {
          uni.navigateTo({ url: '/pages/apply/supplier/bond' })
        }
        this.storeDisable = result.storeDisable
        this.renewAuditStatus = result.renewAuditStatus
      } else {
        this.$u.toast(res.data.message);
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #FFF;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;

  .status {
    min-height: 320rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .icon {
      width: 140rpx;
      height: 140rpx;
    }

    .text {
      font-size: 26rpx;
      line-height: 72rpx;
    }
  }
}
</style>
