<template>
  <view class="container">
    <!-- 售后状态 -->
    <view class="wrap-state" v-if="isComplete">
      <image class="icon" :src="iconSalesStatus" mode="aspectFit"></image>
      <view class="text">{{ objSales.statusText }}</view>
    </view>
    <!-- 商品信息 -->
    <view class="wrap-alone" v-if="isComplete">
      <view class="bd">
        <view class="icon" :style="{ background: 'url(' + objSales.goodsImage + ')' }"></view>
        <view class="base">
          <view class="txt">{{ objSales.goodsName }}</view>
          <view class="sku">
            <text class="sku-item">{{ objSales.simpleSpecs }}</text>
          </view>
          <view class="inf">
            <view class="price">￥{{ objSales.goodsPrice | unitPrice }}</view>
            <view class="count">×{{ objSales.num }}</view>
          </view>
        </view>
      </view>
      <view class="ft">
        <view class="lab">订单总实付</view>
        <view class="txt">{{ objSales.flowPrice | unitPrice }}</view>
      </view>
    </view>


    <!-- 售后诉求 -->
    <view class="wrap-service">
      <view class="info">
        <view class="rs">
          <view class="lab">售后单号</view>
          <view class="inf">
            <view class="txt">{{ objSales.sn }}</view>
          </view>
        </view>
        <view class="rs">
          <view class="lab">售后类型</view>
          <view class="inf">
            <view class="txt">{{ objSales.serviceType == 'EXCHANGE_GOODS' ? '换货' : '退货' }}</view>
          </view>
        </view>
        <view class="rs">
          <view class="lab">申请原因</view>
          <view class="inf">
            <view class="txt">{{ objSales.reason }}</view>
          </view>
        </view>
        <view class="rs">
          <view class="lab">问题描述</view>
          <view class="inf">
            <view class="txt">{{ objSales.problemDesc }}</view>
          </view>
        </view>
        <view class="rs" v-if="objSales.serviceType != 'EXCHANGE_GOODS'">
          <view class="lab">退款方式</view>
          <view class="inf">
            <view class="txt">原路退回</view>
            <view class="num">预估退款金额￥{{ objSales.expectRefundPrice }}，积分{{ objSales.expectRefundPoints }}，以实际情况为准</view>
          </view>
        </view>
        <view class="rs" v-if="objSales.afterSaleImages">
          <view class="lab">相关截图</view>
        </view>
        <view class="ic">
          <view class="ic-item" v-for="item in objSales.afterSaleImages">
            <image class="ico" :src="item" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 处理表单，状态为【买家提交申请】时显示 -->
    <view class="wrap-handler"
      v-if="objSales.serviceStatus == 'APPLY' || objSales.serviceStatus == 'BUYER_RETURN' || objSales.serviceStatus == 'WAITING_REISSUE'">
      <view class="name">售后处理</view>
      <view v-if="objSales.serviceStatus == 'APPLY'">
        <view class="wrap">
          <view class="rs rs-flex">
            <view class="lab">同意退货</view>
            <view class="inf chk">
              <view class="chk-item" :class="{ 'chk-item_hov': index == curAccept }" v-for="(item, index) in arrAccept"
                :key="index" :data-index="index" @tap="handlerAcceptMode">
                <view class="text">{{ item }}</view>
                <image class="icon" :src="iconCheck" v-if="index == curAccept" mode="aspectFit"></image>
              </view>
            </view>
          </view>
          <view class="rs rs-flex" v-if="curAccept == 0">
            <view class="lab">商品去向</view>
            <view class="inf chk">
              <view class="chk-item" :class="{ 'chk-item_hov': index == curReturn }" v-for="(item, index) in arrReturn"
                :key="index" :data-index="index" @tap="handlerReturnMode">
                <view class="text">{{ item }}</view>
                <image class="icon" :src="iconCheck" v-if="index == curReturn" mode="aspectFit"></image>
              </view>
            </view>
          </view>
          <view class="rs-href" v-if="curAccept == 0 && curReturn == 1">
            <view class="info">
              <view class="hd">
                <view class="tit">{{ objSales.salesConsigneeName }}</view>
                <view class="tel">{{ objSales.salesConsigneeMobile }}</view>
              </view>
              <view class="bd">{{ salesConsigneeAddress(objSales) }}</view>
            </view>
          </view>
          <view class="rs-name" v-if="curAccept == 1">拒绝理由</view>
          <view class="rs-area" v-if="curAccept == 1">
            <textarea placeholder="请输入拒绝理由" v-model="refuseReason" class="i-area" />
          </view>
          <view class="rs-tips" v-if="curAccept == 1">
            <image :src="iconTips" mode="aspectFit" class="icon"></image>
            <view class="text">有图有真相，建议您上传相关证明图片</view>
          </view>
          <view class="rs-file" v-if="curAccept == 1">
            <view class="item" v-for="(item, index) in arrThumb" :key="index" :data-index="index" @tap="handlerUpfile">
              <view class="thumb">
                <image class="ico" mode="aspectFit" :src="iconCamera" v-if="item.length == 0"></image>
                <image class="pic" mode="aspectFill" :src="item" v-if="item.length > 0"></image>
                <image class="del-image" @tap="deleteImage(index)" @tap.stop v-if="item.length > 0" :src="iconFailed">
                </image>
              </view>
            </view>
          </view>
        </view>
        <view class="lnk-common lnk-primary" @tap="review">提交</view>
      </view>
    </view>


    <!-- 处理表单，状态为【等待厂家签收】时显示 -->
    <view class="wrap-control" v-if="objSales.serviceStatus == 'BUYER_RETURN'">
      <view class="lnk-common lnk-primary" @tap="handlerAgree">签收快递</view>
      <view class="lnk-common lnk-secondary" @tap="handlerRefuse('CONFIRM')">拒签快递，拒绝[退款/换货]</view>
    </view>

    <!-- 处理表单，状态为【卖家确认收货】时显示 -->
    <view class="wrap-control" v-if="objSales.serviceStatus == 'SELLER_CONFIRM'">
      <view class="lnk-common lnk-primary" @tap="handlerAgreeRefund">同意[退款/换货]</view>
      <view class="lnk-common lnk-secondary" @tap="handlerRefuse('REFUND')">拒绝[退款/换货]</view>
    </view>

    <!-- 处理表单，状态为【等待补发快递】时显示 -->
    <view class="wrap-control" v-if="objSales.serviceStatus == 'WAITING_REISSUE'">
      <view class="lnk-common lnk-primary" @tap="handlerSendExpress">录入换货快递</view>
    </view>
    <!-- 处理过程 -->
    <view class="wrap-process">
      <view class="list">
        <view class="item" v-for="(item, index) in objSales.afterSaleLogs" :key="index">
          <view class="hd">
            <image class="icon" :src="iconStep" mode="aspectFit"></image>
            <view class="text">{{ item.timeline }}</view>
          </view>
          <!-- 申请被拒绝原因 || 商家拒签原因 -->
          <view class="bd"
            v-if="item.serviceStatus == 'SELLER_REFUSE_HANDLE' || item.serviceStatus == 'REFUSE' || item.serviceStatus == 'SELLER_REFUSE'">
            <!-- 申请被拒绝原因 || 商家拒签原因 -->
            <view class="content">{{ item.remark }}</view>
            <!-- 申请被拒绝图片 || 商家拒签图片 -->
            <view class="thumb" v-if="item.relatedImages && item.relatedImages.length > 0">
              <view class="tu-item" v-for="(items, indexImages) in item.relatedImages" :key="indexImages">
                <image class="ico" :src="items" mode="aspectFill" @tap="preview(item.relatedImages, indexImages)">
                </image>
              </view>
            </view>
          </view>
          <!-- 商家同意申请，商品需要寄回 -->
          <view class="bd" v-if="item.serviceStatus == 'WAITING_RETURN' && item.goodsReturn">
            <view class="address">
              <view class="name">
                <view class="tit">{{ item.salesConsigneeName }}</view>
                <view class="tel">{{ item.salesConsigneeMobile }}</view>
              </view>
              <view class="text">{{ salesConsigneeAddress(item) }}</view>
            </view>
          </view>
          <!-- 用户寄出商品--物流信息 -->
          <view class="bd" v-if="item.serviceStatus == 'BUYER_RETURN'">
            <view class="express">
              <view class="name">{{ item.memberLogisticsName }}，快递单号：</view>
              <view class="code">{{ item.memberLogisticsNo }}</view>
              <view class="view" data-link="/pages/profile/logisticsTrack" :data-ConsigneeMobile="item.salesSendingMobile"
                :data-logisticsCode="item.memberLogisticsCode" :data-logisticsNo="item.memberLogisticsNo"
                @tap="handlerLink">跟踪</view>
            </view>
          </view>
          <!-- 商家补发快递 -->
          <view class="bd" v-if="item.serviceStatus == 'PRODUCT_REPLACEMENT' && item.agreeReissue">
            <view class="express">
              <view class="name">{{ item.reissueLogisticsName }}，快递单号：</view>
              <view class="code">{{ item.reissueLogisticsNo }}</view>
              <view class="view" data-link="/pages/profile/logisticsTrack"
                :data-ConsigneeMobile="item.salesConsigneeMobile" :data-logisticsCode="item.reissueLogisticsCode"
                :data-logisticsNo="item.reissueLogisticsNo" @tap="handlerLink">跟踪</view>
            </view>
          </view>
          <view class="ft">
            <view class="date">{{ item.createTime }}</view>
            <view class="name">{{ item.operatorName }}</view>
          </view>
        </view>
      </view>
    </view>


    <!-- 客户信息 -->
    <view class="wrap-content">
      <view class="name">
        <view class="tit">客户信息</view>
        <!-- <view class="lnk" @tap="goIm">
          <image class="icon" :src="iconChat" mode="aspectFit"></image>
          <view class="text">在线沟通</view>
        </view> -->
      </view>
      <view class="info">
        <view class="rs">
          <view class="lab">客户昵称</view>
          <view class="txt">
            <view class="inf">{{ objSales.nickName }}</view>
          </view>
        </view>
        <view class="rs">
          <view class="lab">注册日期</view>
          <view class="txt">
            <view class="inf">{{ objSales.memberRegisterTime }}</view>
          </view>
        </view>
        <view class="rs">
          <view class="lab">联系电话</view>
          <view class="txt">
            <view class="inf">{{ objSales.nickName }} / {{ objSales.memberMobile }}</view>
          </view>
        </view>
      </view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
    <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
    <!-- #endif -->




  </view>
</template>

<script>
import storage from '@/utils/storage.js';
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import {
  storeAfterSaleConfirm,
  storeAfterSaleDetail,
  storeAfterSaleHandlingGoods,
  storeAfterSaleReview
} from "../../api/store";
import { upload } from "../../api/common";

export default {
  name: '',
  components: {
    ykAuthpup
  },
  data() {
    return {
      isComplete: false,
      iconBasePath: `${this.iconCommon}/static/v1/sales`,
      iconStep: `${this.iconCommon}/static/v1/sales/icon-step.png`,
      iconChat: `${this.iconCommon}/static/v1/order/icon-chat.png`,
      iconCheck: `${this.iconCommon}/static/v1/common/icon-checked.png`,
      iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
      iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
      iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
      iconSalesStatus: '',		// 售后状态图标

      arrThumb: [''],					// 表单附件
      arrAccept: ['同意', '拒绝'],
      curAccept: 0,
      arrReturn: ['无需退回', '邮寄退回'],
      curReturn: 0,

      objSales: {
        code: '',							// 售后单号
        status: '',						// 售后状态
        statusText: '',				// 售后状态
        goods: {},						// 商品信息
      },

      sn: "",

      iconDemo: `${this.iconCommon}/static/v1/demo/r4.jpg`,
      //拒绝原因
      refuseReason: '',
      contactPhone:''
    }
  },
  computed: {
    // 收件地址
    salesConsigneeAddress() {
      return (item) => {
        return item && item.salesConsigneeAddressPath ? item.salesConsigneeAddressPath.replace(/,/g, '') + item.salesConsigneeDetail : '';
      };
    }
  },
  methods: {
    // 跳转im页面
    goIm() {
      uni.navigateTo({
        url: `/pages/Im/Chat?afterSaleSn=${this.objSales.sn}&storeId=${this.objSales.storeId}&type=business&myId=${this.objSales.storeId}&storeFlag=true&memberId=${this.objSales.memberId}`
      });
    },
    // 跳转链接
    handlerLink: function (e) {
      let eLink = e.currentTarget.dataset.link
      let eLogisticsCode = e.currentTarget.dataset.logisticscode
      let eLogisticsNo = e.currentTarget.dataset.logisticsno
      let eConsigneeMobile = e.currentTarget.dataset.consigneemobile
      uni.navigateTo({ url: `${eLink}?logisticsCode=${eLogisticsCode}&logisticsNo=${eLogisticsNo}&phone=${eConsigneeMobile}` })
    },
    // 加载售后信息
    loadBaseData: function () {
      this.isComplete = true
      uni.showLoading();
      storeAfterSaleDetail(this.sn).then(res => {
        uni.hideLoading();
        if (res.data.code == 200) {
          this.contactPhone = res.data.result.order.consigneeMobile.slice(-4)
          this.objSales = res.data.result;
          switch (this.objSales.serviceStatus) {
            case 'APPLY':
              this.objSales.statusText = '买家提交申请';
              this.iconSalesStatus = `${this.iconBasePath}/icon-process.png`
              break;
            case 'PASS':
              this.objSales.statusText = '卖家通过申请';
              this.iconSalesStatus = `${this.iconBasePath}/icon-complete.png`
              break;
            case 'REFUSE':
              this.objSales.statusText = '卖家拒绝申请';
              this.iconSalesStatus = `${this.iconBasePath}/icon-fail.png`
              break;
            case 'WAITING_RETURN':
              this.objSales.statusText = '等待商品回寄';
              this.iconSalesStatus = `${this.iconBasePath}/icon-process.png`
              break;
            case 'BUYER_RETURN':
              this.objSales.statusText = '等待卖家签收';
              this.iconSalesStatus = `${this.iconBasePath}/icon-process.png`
              break;
            case 'SELLER_CONFIRM':
              this.objSales.statusText = '卖家确认收货';
              this.iconSalesStatus = `${this.iconBasePath}/icon-complete.png`
              break;
            case 'SELLER_REFUSE':
              this.objSales.statusText = '卖家拒绝收货';
              this.iconSalesStatus = `${this.iconBasePath}/icon-fail.png`
              break;
            case 'WAITING_REISSUE':
              this.objSales.statusText = '等待商品补发';
              this.iconSalesStatus = `${this.iconBasePath}/icon-process.png`
              break;
            case 'PRODUCT_REPLACEMENT':
              this.objSales.statusText = '商品已补发';
              this.iconSalesStatus = `${this.iconBasePath}/icon-complete.png`
              break;
            case 'SELLER_REFUSE_HANDLE':
              this.objSales.statusText = '卖家拒绝处理退换货';
              this.iconSalesStatus = `${this.iconBasePath}/icon-fail.png`
              break;
            case 'SELLER_TERMINATION':
              this.objSales.statusText = '卖家终止售后';
              this.iconSalesStatus = `${this.iconBasePath}/icon-fail.png`
              break;
            case 'BUYER_CANCEL':
              this.objSales.statusText = '买家取消申请';
              this.iconSalesStatus = `${this.iconBasePath}/icon-fail.png`
              break;
            case 'WAIT_REFUND':
              this.objSales.statusText = '等待平台退款';
              this.iconSalesStatus = `${this.iconBasePath}/icon-process.png`
              break;
            case 'COMPLETE':
              this.objSales.statusText = '完成售后服务';
              this.iconSalesStatus = `${this.iconBasePath}/icon-complete.png`
              break;
          }
        } else {
          this.$u.toast(res.data.message);
        }
      })
    },
    review: function () {
      let that = this;
      uni.showLoading({ title: "提交中" })
      let params = {}
      if (this.curAccept == 0) {
        params.serviceStatus = 'PASS';
      } else {
        params.serviceStatus = 'REFUSE';
      }
      params.goodsReturn = this.curReturn == 1;
      params.remark = this.refuseReason;
      params.storeRejectImg = this.arrThumb.join(",");
      storeAfterSaleReview(this.sn, params).then(res => {
        uni.hideLoading();
        if (res.data.code == 200) {
          that.loadBaseData();
        } else {
          that.$u.toast(res.data.message);
        }
      })
    },
    // 表单附件处理
    handlerUpfile: function (e) {
      // #ifdef APP-PLUS
      if (plus.os.name == 'Android') {
        this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
      }
      // #endif
      let eIndex = parseInt(e.currentTarget.dataset.index)
      let _this = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'], 		// 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], 					// 从相册选择
        success: (res) => {
          uni.showLoading({ title: '正在上传' })
          uni.uploadFile({
            url: upload,
            filePath: res.tempFilePaths[0],
            name: "file",
            header: {
              accessToken: storage.getAccessToken(),
            },
            success: (uploadFileRes) => {
              uni.hideLoading();
              _this.$u.toast("上传成功")
              let data = JSON.parse(uploadFileRes.data);
              if (data.code == 200) {
                // 注意：上传文件接口执行成功后渲染数组
                _this.arrThumb.splice(eIndex, 1, data.result)
                // 最多上传九张图片
                if (_this.arrThumb[_this.arrThumb.length - 1].length > 0 && _this.arrThumb.length < 9) {
                  this.arrThumb.push('')
                }
              } else {
                _this.$u.toast("上传失败，请稍后重试")
              }
            },
          });
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
    // 变更是否同意
    handlerAcceptMode: function (e) {
      let eValue = parseInt(e.currentTarget.dataset.index)
      this.curAccept = eValue
    },
    // 变更商品去除
    handlerReturnMode: function (e) {
      let eValue = parseInt(e.currentTarget.dataset.index)
      this.curReturn = eValue
    },
    // 跳转录入换货快递
    handlerSendExpress: function () {
      uni.navigateTo({
        url: '/pages/supplierCenter/salesExpress?sn=' + this.sn+'&contactPhone='+this.contactPhone
      })
    },
    // 跳转签收/拒签，拒绝退款
    handlerRefuse: function (type) {
      uni.navigateTo({
        url: '/pages/supplierCenter/salesRefuse?sn=' + this.sn + "&type=" + type
      })
    },
    handlerAgree: function () {
      let that = this;
      uni.showLoading({ title: "处理中" })
      let params = { agree: true };
      storeAfterSaleConfirm(this.sn, params).then(res => {
        uni.hideLoading();
        if (res.data.code == 200) {
          that.$u.toast("已同意")
          that.loadBaseData();
        } else {
          that.$u.toast(res.data.message);
        }
      })
    },
    handlerAgreeRefund: function () {
      let that = this;
      uni.showLoading({ title: "处理中" })
      let params = { agree: true };
      storeAfterSaleHandlingGoods(this.sn, params).then(res => {
        uni.hideLoading();
        if (res.data.code == 200) {
          that.$u.toast("已同意")
          that.loadBaseData();
        } else {
          that.$u.toast(res.data.message);
        }
      })
    },
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["保存图片"],
          success: function (data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          },
          fail: function (err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    deleteImage(index) {
      this.arrThumb.splice(index, 1)
    }
  },
  onLoad: function (options) {
    this.sn = options.sn;

  },
  onShow: function () {
    // 加载售后信息
    this.loadBaseData()
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #F1F1F1;
  min-height: 100vh;
  box-sizing: border-box;

  .thumb {
    position: relative;

    .del-image {
      position: absolute;
      width: 50rpx;
      height: 50rpx;
      top: 0;
      right: 0;
      border-radius: 25rpx;
      background-position: center center;
      background-size: contain;
    }
  }
}
</style>
