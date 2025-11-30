<template>
  <div class="wrapper" v-if="isComplete">
    <!-- 选择地址 -->
    <div class="address-box address-box-unset-radius" @tap="clickToAddress()" :style="{ background: 'url(' + addressBg + ')' }"
      v-if="shippingText == 'LOGISTICS' && orderMessage.cartTypeEnum != 'VIRTUAL'">
      <div class="user-box flex">
        <div class="flex-8">
          <div v-if="!address.id">请选择地址</div>
          <div v-else>
            <div class="user-address">
              <!-- 省市区 -->
              <div class="flex flex-a-c">
                <span class="default" v-if="address.isDefault">默认</span>
                <div class="address-list" v-if="address.consigneeAddressPath.length != 0">
                  <span class="address-item" v-for="(item, index) in address.consigneeAddressPath" :key="'cons_' + index">
                    {{ item }}
                  </span>
                </div>
              </div>
              <!-- 详细地址 -->
              <div class="user-address-detail wes-2">
                {{ address.detail }}
              </div>
              <!-- 姓名 手机号 -->
              <div class="user-info">
                <span>{{ address.name }}</span>
                <span class="mobile">{{ address.mobile | secrecyMobile }}</span>
              </div>
            </div>
          </div>
        </div>
        <u-icon name="arrow-right" style="color: #bababa"></u-icon>
      </div>
      <!-- 背景 -->
      <!-- <div class="bar"></div> -->
    </div>
    <!-- 选择自提点 -->
    <div class="address-box" v-if="shippingText == 'SELF_PICK_UP'">
      <div @tap="clickToStoreAddress()">
        <div class="user-box flex">
          <div class="flex-8">
            <div v-if="storeAddress">
              <div class="user-address">
                <!-- 自提点地址 -->
                <div class="user-address-detail wes-2">
                  {{ storeAddress.address }}
                </div>
                <!-- 联系手机号 -->
                <div></div>
              </div>
            </div>
            <div v-else>请选择自提点</div>
          </div>
          <u-icon name="arrow-right" style="color: #bababa"></u-icon>
        </div>
        <!-- 背景 -->
        <div class="bar"></div>
      </div>
    </div>

    <!-- 开团信息 -->
    <view class="group-box" v-if="isAssemble">
      <view class="group-title">
        <span v-if="pintuanFlage">你正在开团购买</span>
        <span v-else>为你加入仅差<span>{{ routerVal.parentOrder.toBeGroupedNum }}</span>人的团购买</span>
      </view>
      <view class="group">
        <view>
          <u-image borderRadius="50%" shape="square" class="head-img" width="81rpx" height="81rpx"
            :src="masterWay.face || userImage"></u-image>
          <view class="btn-one">团长</view>
        </view>
        <view class="line"> </view>
        <view>
          <!-- 如果有最后一名，显示最后一名，没有最后一名，显示等待参团 -->
          <u-image class="head-img" v-if="endWay.face" :src="endWay.face" borderRadius="50%" shape="square" width="81rpx"
            height="81rpx">
            <view slot="loading"></view>
          </u-image>
          <u-image class="head-img" borderRadius="50%" shape="square" v-else width="81rpx" height="81rpx"
            :src="endWay.face || userImage"></u-image>

          <view class="wait">{{ endWay.nickname || "等待参团" }}</view>
        </view>
      </view>
    </view>

    <!-- 店铺商品信息 -->
    <div class="box box2" v-for="(item, index) in orderMessage.cartList" :key="'cart_' + index">
      <div v-if="item.checked">
        <div>
          <div class="store-name">
            <span>{{ item.storeName }}</span>
          </div>
        </div>
        <div class="promotionNotice">{{ item.promotionNotice || "" }}</div>
        <div class="flex goods-item" v-for="(val, i) in item.checkedSkuList" :key="'sku_' + i">
          <div class="goods-image" @tap="
            navigateTo(
              '/pages/product/goods?id=' +
              val.goodsSku.id +
              '&goodsId=' +
              val.goodsSku.goodsId
            )
            " :span="3">
            <u-image v-if="val.goodsSku.thumbnail" borderRadius="10rpx" width="200rpx" height="200rpx"
              :src="val.goodsSku.thumbnail" alt>
              <u-loading slot="loading"></u-loading>
            </u-image>
            <u-image v-else borderRadius="10rpx" width="200rpx" height="200rpx" alt>
              <u-loading slot="loading"></u-loading>
            </u-image>
          </div>
          <div @tap="
            navigateTo(
              '/pages/product/goods?id=' +
              val.goodsSku.id +
              '&goodsId=' +
              val.goodsSku.goodsId
            )
            " class="goods-detail">
            <div class="flex">
              <p class="goods-name">{{ val.goodsSku.goodsName }}</p>
              <span class="nums">x{{ val.num }}</span>
            </div>
            <p class="goods-prices">
              <span>￥</span>
              <span class="goods-price">{{
                $options.filters.goodsFormatPrice(val.purchasePrice)[0]
              }}</span>
              <span>.{{
                $options.filters.goodsFormatPrice(val.purchasePrice)[1]
              }}</span>
            </p>
          </div>
        </div>
        <u-row>
          <u-col :offset="0" :span="4">发票信息</u-col>
          <u-col :span="8" class="tipsColor" textAlign="right" @tap.native="invoice()">
            <span v-if="receiptList">{{
              receiptList.receiptTitleType == 'PERSONAL' ? receiptList.receiptTitle : receiptList.unitName }}
              {{ receiptList.receiptContent }}</span>
            <span v-else>不开发票</span>
          </u-col>
        </u-row>
        <u-row>
          <u-col v-if="orderMessage.cartTypeEnum != 'VIRTUAL'" :offset="0" :span="9" @tap="shippingFlag = false">配送
          </u-col>
          <u-col v-if="orderMessage.cartTypeEnum != 'VIRTUAL' && shippingMethod.length > 0" :span="3" textAlign="right"
            @tap="shippingFlag = false">
            {{
              shippingMethod.find((e) => {
                return e.value == shippingText;
              }).label
            }}
          </u-col>
        </u-row>
        <u-row>
          <u-col :offset="0" :span="4" class="tl" style="text-align: left">备注信息</u-col>
          <u-col :span="8" textAlign="right">
            <u-input style="text-align: right" class="uinput" v-model="remarkVal[index].remark" />
          </u-col>
        </u-row>
        <u-row v-if="customized">
          <u-col :offset="0" :span="4" class="tl" style="text-align: left">定制要求</u-col>
          <u-col :span="8" textAlign="right">
            <u-input style="text-align: right" class="uinput" v-model="customRequirements" />
          </u-col>
        </u-row>
        <!-- <u-row v-if="orderMessage.customized">
          <u-col :offset="0" :span="4" class="tl" style="text-align: left"
            >附件</u-col
          >
          <u-col :span="8" textAlign="right"> -->
        <view class="rs-tips" v-if="customized">
          <image :src="iconTips" mode="aspectFit" class="icon"></image>
          <view class="text">附件</view>
        </view>
        <view class="rs-file" v-if="customized">
          <view class="item" v-for="(item, index) in arrThumb" :key="'thu_' + index" :data-index="index"
            @tap="handlerUpfile">
            <view class="thumb">
              <image class="ico" mode="aspectFit" :src="iconCamera" v-if="item.length == 0"></image>
              <image class="pic" mode="aspectFill" :src="item" @tap.stop v-if="item.length > 0"></image>
              <image class="del-image" @tap="deleteImage(index)" @tap.stop v-if="item.length > 0" :src="iconFailed">
              </image>
            </view>
          </view>
        </view>
        <!-- </u-col>
        </u-row> -->
      </div>
    </div>

    <!-- 发票信息 -->
    <invoices :res="receiptList" @callbackInvoice="callbackInvoice" @closeInvoice="closeInvoice" v-if="invoiceFlag"
      ref="setInvoice" />
    <u-select @confirm="confirmDistribution" v-model="shippingFlag" v-if="shippingMethod.length != 0"
      :list="shippingMethod"></u-select>

    <div class="box box5" v-if="orderMessage.priceDetailDTO">
      <div>
        <u-row>
          <u-col :span="9">商品合计</u-col>
          <u-col :span="3" textAlign="right">
            <span>￥{{ orderMessage.priceDetailDTO.goodsPrice | unitPrice }}</span>
          </u-col>
        </u-row>
        <u-row v-if="payPoint > 0 && !usePointFlag">
          <u-col :span="3">积分抵扣</u-col>
          <u-col style="color: orange" :span="9" textAlign="right">
            <u-number-box v-model="usePoint" :min="1" :max="payPoint" @change="getOrderList"></u-number-box>
            <!-- <input type="number" v-model="usePoint" @input="getOrderList" placeholder="请输入积分数量" /> -->
            <!-- <picker mode="selector" :range="pointList" :value="pointIndex" @change="pointChange"
              range-key="label">
              <view class="s-text">{{ pointLabel }}<span v-if="pointIndex==1">￥{{ orderMessage.priceDetailDTO.payPoint | unitPrice }}</span></view>
            </picker> -->
          </u-col>
        </u-row>
        <u-row v-if="payPoint > 0">
          <u-col :span="12">
            <u-icon name="info-circle" color="#e22221" size="32"></u-icon>
            <span class="tips-text">当前订单最多可使用{{ payPoint }}积分</span>
            <span v-if="!usePointFlag" class="tips-text">，已抵扣￥{{ usePoint | unitPrice }}元</span>
          </u-col>
        </u-row>
        <u-row v-if="payPoint > 0">
          <u-col :span="12">
            <view style="margin-top: 10rpx;">
              <u-checkbox-group @change="getOrderList">
                <u-checkbox v-model="usePointFlag">不使用积分</u-checkbox>
              </u-checkbox-group>
            </view>
          </u-col>
        </u-row>
      </div>
      <div>
        <u-row v-if="shippingText == 'LOGISTICS'">
          <u-col v-if="orderMessage.cartTypeEnum != 'VIRTUAL'" :span="7">运费</u-col>
          <u-col v-if="orderMessage.cartTypeEnum != 'VIRTUAL'" :span="5" class="tr tipsColor" textAlign="right">
            <span v-if="orderMessage.priceDetailDTO.freightPrice == 0">包邮</span>
            <span v-else>￥{{
              orderMessage.priceDetailDTO.freightPrice | unitPrice
            }}</span>
          </u-col>
        </u-row>
      </div>
      <!-- <u-row
        v-if="
          orderMessage.priceDetailDTO.goodsPrice != 0 &&
          orderMessage.priceDetailDTO.goodsPrice != null
        "
      >
        <u-col :offset="0" :span="9" @tap="GET_Discount()">优惠券</u-col>
        <u-col
          :span="3"
          v-if="
            orderMessage.priceDetailDTO &&
            orderMessage.priceDetailDTO.couponPrice
          "
          textAlign="right"
          @tap="GET_Discount()"
        >
          <span class="main-color"
            >-￥{{ orderMessage.priceDetailDTO.couponPrice | unitPrice }}</span
          >
        </u-col>
        <u-col :span="3" v-else textAlign="right" @tap="GET_Discount()">
          {{ orderMessage.canUseCoupons.length || "0" }} 张可用
          <u-icon name="arrow-right"></u-icon>
        </u-col>
      </u-row>
      <div>
        <u-row>
          <u-col :span="9">优惠金额</u-col>
          <u-col
            :span="3"
            textAlign="right"
            v-if="orderMessage.priceDetailDTO.couponPrice"
          >
            <span class="main-color">
              -￥{{ orderMessage.priceDetailDTO.couponPrice | unitPrice }}</span
            >
          </u-col>
          <u-col :span="3" textAlign="right" v-else>0.00</u-col>
        </u-row>
      </div>
      <div>
        <u-row>
          <u-col :span="6">活动优惠</u-col>
          <u-col :span="6" class="tr tipsColor" textAlign="right">
            <span v-if="orderMessage.priceDetailDTO.discountPrice"
              >-￥{{
                orderMessage.priceDetailDTO.discountPrice | unitPrice
              }}</span
            >
            <span v-else>0.00</span>
          </u-col>
        </u-row>
      </div> -->
    </div>

    <!-- 配送地区没有提示 -->
    <div class="notSupportFreight" v-if="notSupportFreight.length != 0">
      <u-notice-bar style="width: 100%" :volume-icon="false" mode="horizontal" :list="notSupportFreightGoodsList">
      </u-notice-bar>
    </div>

    <!-- 结账 -->

    <div class="box6 mp-iphonex-bottom" v-if="orderMessage.priceDetailDTO">
      <div class="tabbar-left">
        <div class="number">
          <span>¥</span>
          <span class="price">{{
            $options.filters.goodsFormatPrice(
              orderMessage.priceDetailDTO.flowPrice
            )[0]
          }}</span>
          <span>.{{
            $options.filters.goodsFormatPrice(
              orderMessage.priceDetailDTO.flowPrice
            )[1]
          }}
          </span>
        </div>

      </div>

      <div class="navRiv" @tap="createTradeFun()">
        <div class="tabbar-right">提交订单</div>
      </div>
      <!-- #ifdef APP-PLUS -->
      <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
      <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
      <!-- #endif -->
    </div>
  </div>
</template>
<script>
import * as API_Trade from "@/api/trade";
import * as API_Address from "@/api/address";
import * as API_Order from "@/api/order";
import invoices from "@/pages/order/invoice/setInvoice";
import { mapState } from "vuex";
import LiLiWXPay from "@/js_sdk/lili-pay/wx-pay.js";
import configs from "@/config/config";
import { getAddressDetail } from "@/api/address.js";
import storage from "@/utils/storage.js";
import { upload } from "@/api/common.js";
import { setAddressId } from "../../api/trade";
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
export default {
  onLoad: async function (val) {
    this.routerVal = val;
    if (val.customized) {
      this.customized = JSON.parse(val.customized);
    }
    uni.showLoading({
      mask: true,
    });
    if (val.addr) {
      this.loadAddressDetailFun(val.addr)
    }
    await this.getOrderList();
    await this.getDistribution();
    if (this.$store.state.isShowToast) {
      uni.hideLoading();
    }
  },
  components: {
    invoices,
    ykAuthpup
  },

  data() {
    return {
      configs,
      userImage: configs.defaultUserPhoto,
      invoiceFlag: false, //开票开关
      shippingText: "LOGISTICS",
      shippingFlag: false,
      shippingMethod: [],
      shippingWay: [
        {
          value: "LOGISTICS",
          label: "物流",
        },
        {
          value: "SELF_PICK_UP",
          label: "自提",
        },
      ],
      isAssemble: false, //是否拼团
      // 判断是否填写过备注
      remarkFlag: false,
      selectAddressId: "",
      routerVal: "",
      params: {},
      // 优惠劵
      couponList: "",
      // 已选地址
      address: {},
      shopAddress: "",
      // 发票信息
      receiptList: "",
      // 店铺信息
      orderMessage: "",
      data: "",
      // 存储备注
      remarkVal: [],
      remarkVal1: "",
      detail: "", //返回的所有数据
      endWay: "", //最后一个参团人
      masterWay: "", //团长信息
      pintuanFlage: true, //是开团还是拼团
      notSupportFreight: [], //不支持运费
      notSupportFreightGoodsList: ["以下商品超出配送范围："],
      storeAddress: "",
      isSel: false,// 是否是选择的地址
      customRequirements: '', // 定制要求
      iconTips: `${this.iconCommon}/static/v1/common/icon-tips.png`,
      iconCamera: `${this.iconCommon}/static/v1/common/icon-camera.png`,
      iconFailed: `${this.iconCommon}/static/v1/common/icon-fail.png`,
      arrThumb: [''],
      customized: false, // 是否定制
      pointList: [{
        value: 0,
        label: '不使用积分'
      }, {
        value: 1,
        label: '积分抵扣'
      }],
      pointIndex: 1,
      pointLabel: "积分抵扣",
      payPoint: null,
      usePoint: null,// 自定义积分
      usePointFlag: false,// 是否使用积分
      isComplete: false,
      addressBg: `${this.iconCommon}/static/order/address-bg.png`,
    };
  },
  watch: {
    // 监听备注 并在 vuex 中存储
    remarkVal: {
      handler(val) {
        this.$store.commit("setRemark", val);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState(["remark"]),
  },
  filters: {
    /**
     * 发票收据类型
     */
    receiptType(type) {
      switch (type) {
        case "VATORDINARY":
          return "增值税普通发票";
        case "ELECTRO":
          return "电子普通发票";
        case "VATOSPECIAL":
          return "增值税专用发票";
        default:
          return "不开发票";
      }
    },
  },

  /**
   * 监听返回
   */
  onBackPress(e) {
    if (e.from == "backbutton") {
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].options;
      routes.forEach((item) => {
        if (
          item.route == "pages/tabbar/cart/cartList" ||
          item.route.indexOf("pages/product/goods") != -1
        ) {
          uni.navigateTo({
            url: item.route,
          });
        }
      });

      if (curRoute.addId) {
        uni.reLaunch({
          url: "/pages/tabbar/cart/cartList",
        });
      } else {
        uni.navigateBack();
      }
      return true; //阻止默认返回行为
    }
  },

  async onShow() {
    // 判断是否存在写过备注信息的商品
    if (this.remark && this.remark.length > 0) {
      this.remarkFlag = true;
    }

    if (this.routerVal.way == "PINTUAN") {
      this.isAssemble = true;
      this.routerVal.parentOrder = JSON.parse(
        decodeURIComponent(this.routerVal.parentOrder)
      );
      this.pintuanWay();
    }
  },
  mounted() { },

  methods: {
    // 选择积分
    pointChange(e) {
      this.pointIndex = e.detail.value;
      this.pointLabel = this.pointList[e.detail.value].label
      this.getOrderList();
    },
    //发票回调 选择发票之后刷新购物车
    async callbackInvoice(val) {
      this.invoiceFlag = false;
      this.receiptList = val;
      if (val) {
        let submit = {
          way: this.routerVal.way,
          ...this.receiptList,
        };
        let receipt = await API_Order.getReceipt(submit);
        if (receipt.data.success) {
          this.shippingFlag = false;
          this.getOrderList();
        }
      }
    },
    // 上传附件
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
          let tempFilePaths = res.tempFilePaths;
          uni.uploadFile({
            url: upload,
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              accessToken: storage.getAccessToken(),
            },
            success: (uploadFileRes) => {
              let data = JSON.parse(uploadFileRes.data);
              // 注意：上传文件接口执行成功后渲染数组
              _this.arrThumb.splice(eIndex, 1, data.result)

              // 最多上传1张图片
              if (_this.arrThumb[_this.arrThumb.length - 1].length > 0 && _this.arrThumb.length < 1) {
                _this.arrThumb.push('')

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
    // 跳转到店铺
    navigateToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },
    // 点击跳转地址
    clickToAddress() {
      uni.navigateTo({
        url: '/pages/config/address/home?isSel=true'
      })
      // this.navigateTo(
      //   `/pages/mine/address/address?from=cart&way=${
      //     this.routerVal.way
      //   }&parentOrder=${encodeURIComponent(
      //     JSON.stringify(this.routerVal.parentOrder)
      //   )}`
      // );
    },
    pickInvoiceTemplate(e) {
      this.$refs.setInvoice.pickInvoiceTemplate(e);
    },
    // 根据地址id加载地址详情
    loadAddressDetailFun(id) {
      let way = this.routerVal.way;
      this.isSel = true
      this.address.id = id

      getAddressDetail(id).then((res) => {
        res.data.result.consigneeAddressPath =
          res.data.result.consigneeAddressPath.split(",");
        this.address = res.data.result;
        API_Trade.setAddressId(id, way).then(res => {
          this.getOrderList();
        });
      })
    },
    clickToStoreAddress() {
      this.navigateTo(
        `/pages/mine/address/storeAddress?from=cart&way=${this.routerVal.way}&storeId=${this.remarkVal[0].storeId}`
      );
    },

    // 判断团长以及团员信息
    pintuanWay() {
      const { memberId } = this.routerVal.parentOrder;

      const userInfo = this.$options.filters.isLogin();
      if (memberId) {
        this.endWay = userInfo;
        this.masterWay = this.routerVal.parentOrder;
        this.pintuanFlage = false;
      } else {
        this.pintuanFlage = true;
        this.masterWay = userInfo;
      }
    },
    // 判断发票
    invoice() {
      this.invoiceFlag = true;
    },

    // 领取优惠券
    GET_Discount() {
      // 循环店铺id,商品id获取优惠券
      let store = [];
      let skus = [];
      let selectedCoupon = [];
      if (this.orderMessage.platformCoupon)
        selectedCoupon.push(this.orderMessage.platformCoupon.memberCoupon.id);
      if (
        this.orderMessage.storeCoupons &&
        Object.keys(this.orderMessage.storeCoupons)[0]
      ) {
        let storeMemberCouponsId = Object.keys(
          this.orderMessage.storeCoupons
        )[0];
        let storeCouponId =
          this.orderMessage.storeCoupons[storeMemberCouponsId].memberCoupon.id;
        selectedCoupon.push(storeCouponId);
      }
      this.orderMessage.cartList.forEach((item) => {
        item.skuList.forEach((sku) => {
          store.push(sku.storeId);
          skus.push(sku.goodsSku.id);
        });
      });
      store = Array.from(new Set(store));
      skus = Array.from(new Set(skus));
      uni.setStorage({
        key: "totalPrice",
        data: this.orderMessage.priceDetailDTO.goodsPrice,
      });
      this.navigateTo(
        `/pages/cart/coupon/index?way=${this.routerVal.way}&storeId=${store}&skuId=${skus}&selectedCoupon=${selectedCoupon}`
      );
    },

    /**
     * 跳转
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    /**
     * 提交订单准备支付
     */

    // 创建订单
    createTradeFun() {
      // 防抖
      this.$u.throttle(() => {
        if (this.shippingText === "SELF_PICK_UP") {
          if (!this.storeAddress.id) {
            uni.showToast({
              title: "请选择提货点",
              duration: 2000,
              icon: "none",
            });
            return false;
          }
        } else if (this.shippingText === "LOGISTICS" && this.orderMessage.cartTypeEnum != 'VIRTUAL') {
          if (!this.address.id) {
            uni.showToast({
              title: "请选择地址",
              duration: 2000,
              icon: "none",
            });
            return false;
          }
        }
        // 如果是定制
        if (this.customized && !this.customRequirements) {
          uni.showToast({
            title: "请填写定制要求",
            duration: 2000,
            icon: "none",
          });
          return false;
        }

        // if (this.customized && this.arrThumb[this.arrThumb.length - 1].length == 0) {
        //   uni.showToast({
        //     title: "请上传附件",
        //     duration: 2000,
        //     icon: "none",
        //   });
        //   return false;
        // }

        //  创建订单
        let client;
        // #ifdef H5
        client = "H5";
        // #endif
        // #ifdef MP-WEIXIN
        client = "WECHAT_MP";
        // #endif
        // #ifdef APP-PLUS
        client = "APP";
        // #endif

        let submit = {
          client,
          way: this.routerVal.way,
          remark: this.remarkVal,
          parentOrderSn: "",
          // 如果是定制才传这俩参数
          customFlag: this.customized ? this.customized : false,
          customRequirements: this.customized ? this.customRequirements : '',
          attachment: this.customized ? this.arrThumb[0] : '',
          shippingAddressId: this.address.id,
          usePointFlag: !this.usePointFlag,
          usePoint: this.usePoint,
        };
        // 如果是拼团并且当前用户不是团长
        this.routerVal.parentOrder && this.routerVal.parentOrder.orderSn
          ? (submit.parentOrderSn = this.routerVal.parentOrder.orderSn)
          : delete submit.parentOrderSn;

        /**
         * 创建订单
         */
        uni.showLoading({
          title: "正在创建订单",
          mask: true,
        });
        API_Trade.createTrade(submit).then((res) => {
          uni.hideLoading();
          if (res.data.code == 110034) {
            uni.navigateTo({
              url: '/pages/login/shop'
            })
            return
          }
          if (res.data.success) {
            uni.showToast({
              title: "创建订单成功!",
              duration: 2000,
              icon: "none",
            });
            let objUserInof = storage.getUserInfo()
            let params = {
              orderSn: res.data.result.orderSn.split(",")[0],
              orderStoreId: res.data.result.storeId,
              memberId: objUserInof.id
            }
            storage.setOrderInfo(params)
            // 如果当前价格为0跳转到订单列表
            if (this.orderMessage.priceDetailDTO.billPrice == 0) {
              uni.redirectTo({
                url: "/pages/profile/order/home?state=1",
              });
            } else {
              // #ifdef MP-WEIXIN
              // 微信小程序中点击创建订单直接开始支付
              // this.pay(res.data.result.sn);
              // #endif
              uni.redirectTo({
                url: `/pages/cart/payment/payOrder?trade_sn=${res.data.result.sn}`,
              });
            }
          } else {
            uni.hideLoading();
            uni.showToast({
              title: res.data.message,
              duration: 2000,
              icon: "none",
            });
          }
        });
      }, 3000);
    },

    /**
     * 微信小程序中直接支付
     */
    async pay(sn) {
      new LiLiWXPay({
        sn: sn,
        price: this.orderMessage.priceDetailDTO.billPrice,
      }).pay();
    },

    /**
     * 获取用户地址
     */
    getUserAddress() {
      // 如果没有商品选择地址的话 则选择 默认地址
      API_Address.getAddressDefault().then((res) => {
        if (res.data.result) {
          res.data.result.consigneeAddressPath =
            res.data.result.consigneeAddressPath.split(",");
          this.address = res.data.result;
        }
      });
    },
    // 获取配送列表
    async getDistribution() {
      let shopRes = await API_Trade.shippingMethodList({
        way: this.routerVal.way,
      });
      let shopList;
      if (shopRes.data.success) {
        shopList = shopRes.data.result;
        let way = [];

        this.shippingWay.forEach((item) => {
          shopList.forEach((child) => {
            if (item.value == child) {
              way.push(item);
            }
          });
        });
        this.shippingMethod = way;
      }
    },

    // 选择配送
    async confirmDistribution(val) {
      let res = await API_Trade.setShipMethod({
        shippingMethod: val[0].value,
        way: this.routerVal.way,
      });

      this.shippingText = val[0].value;
      if (res.data.success) {
        this.getOrderList();
      }
    },

    // 获取结算参数
    async getOrderList() {
      this.notSupportFreight = [];
      // 重置不支持运费的商品列表，避免重复显示
      this.notSupportFreightGoodsList = ["以下商品超出配送范围："];
      // 获取结算参数
      let params = {
        way: this.routerVal.way,
        usePointFlag: !this.usePointFlag,
        usePoint: this.usePoint,
      }

      API_Trade.getCheckoutParams(params).then((res) => {
        if (
          !res.data.result.checkedSkuList ||
          res.data.result.checkedSkuList.length === 0
        ) {
          uni.reLaunch({
            url: "/pages/tabbar/cart/cartList",
          });
        }
        if (res.data.result.skuList.length <= 0) {
          uni.navigateTo({
            url: "/pages/profile/order/home?state=1",
          });
        }

        let repeatData;
        res.data.result.cartList.forEach((item, index) => {
          // 如果已经写过备注信息的话赋值
          repeatData = {
            remark: this.remarkFlag
              ? this.remark[index].storeId == item.storeId
                ? this.remark[index].remark
                : item.remark
              : item.remark,
            storeId: item.storeId,
          };

          this.$set(this.remarkVal, index, repeatData);
        });

        this.orderMessage = res.data.result;
        if (this.payPoint == null) {
          this.payPoint = res.data.result.priceDetailDTO.payPoint
          this.usePoint = res.data.result.priceDetailDTO.payPoint;
        }
        /**
         * 为了避免路径传值在h5中超出限制问题
         * 这块将可用的优惠券以及不可用的优惠券放入到vuex里面进行存储
         */
        this.$store.state.canUseCoupons = res.data.result.canUseCoupons;
        this.$store.state.cantUseCoupons = res.data.result.cantUseCoupons;

        if (!res.data.result.memberAddress && !this.isSel) {
          // 获取用户默认地址
          this.getUserAddress();
        }
        else {
          if (!this.isSel) {
            this.address = res.data.result.memberAddress;
            res.data.result.memberAddress.consigneeAddressPath =
              res.data.result.memberAddress.consigneeAddressPath.split(",");
          }
        }
        if (res.data.result.storeAddress) {
          this.storeAddress = res.data.result.storeAddress;

        }
        if (
          res.data.result.notSupportFreight &&
          res.data.result.notSupportFreight.length != 0
        ) {
          this.notSupportFreight = res.data.result.notSupportFreight;

          res.data.result.notSupportFreight.forEach((item) => {
            this.notSupportFreightGoodsList[0] += item.goodsSku.goodsName;
          });
        }
        this.isComplete = true;
      });
    },
    deleteImage(index) {
      this.arrThumb.splice(index, 1)
      this.arrThumb.push("")
    },
    //关闭发票
    closeInvoice() {
      this.invoiceFlag = false;
    }
  },
};
</script>
<style scoped>
page {
  background: #f8f8f8;
}
</style>
<style scoped lang="scss">
.rs-tips {
  height: 72rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .icon {
    width: 32rpx;
    height: 32rpx;
  }

  .text {
    padding: 0 0 0 12rpx;
    font-size: 24rpx;
    color: #888;
    line-height: 40rpx;
  }
}

.rs-file {
  display: flex;
  flex-wrap: wrap;
  margin: -20rpx -10rpx 0;
  padding: 0 0 8rpx;

  .item {
    flex: 1;
    -ms-flex: 0 0 33.33%;
    flex: 0 0 33.33%;
    max-width: 33.33%;
    box-sizing: border-box;
    padding: 0 10rpx;
    margin: 20rpx 0 0;

    .thumb {
      width: calc((100vw - 40rpx) * 0.3333 - 20rpx);
      height: calc((100vw - 40rpx) * 0.3333 - 20rpx);
      background: #F7F8FA;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .ico {
        width: 48rpx;
        height: 48rpx;
      }

      .pic {
        width: calc((100vw - 40rpx) * 0.3333 - 20rpx);
        height: calc((100vw - 40rpx) * 0.3333 - 20rpx);
      }

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
}

.tips-text {
  margin-left: 10rpx;
}

.flex-8 {
  flex: 8;
}

.main-color {
  color: $main-color;
  font-weight: bold;
}

.uinput {
  /deep/ input {
    text-align: right;
  }
}

.promotionNotice {
  font-size: 24rpx;
  margin: 20rpx 0;
  color: $aider-light-color;
}

.nums {
  flex: 2;
  color: $light-color;

  text-align: center;
}

.wait {
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #cccccc;
  text-align: center;
}

.line {
  margin-left: 14rpx;
  margin-right: 14rpx;
  margin-bottom: 50rpx;
  width: 143rpx;
  border-bottom: 2px dotted #999;
}

.tabbar-left {
  margin-left: 32rpx;
}

.btn-one,
.wait {
  margin-top: 14rpx;
}

.btn-one {
  width: 100rpx;
  height: 40rpx;
  background: $light-color;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  text-align: center;
  line-height: 40rpx;
}

.head-img {
  width: 81rpx;
  height: 81rpx;
  margin: 0 auto;
}

.group-title {
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: $light-color;
}

.group-box {
  height: 242rpx;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tr {
  text-align: right;
}

.tl {
  text-align: left;
}

/deep/ .u-col-3 {
  text-align: right;
}

.bar {
  height: 4rpx;
  overflow: hidden;
  width: 100%;
  background: url("@/pages/order/imgs/line.png") no-repeat;
}

.box2 {
  margin-top: 20rpx;
}

.notSupportFreight {
  position: fixed;

  bottom: calc(100rpx + env(safe-area-inset-bottom));
  // #ifdef H5
  bottom: 100rpx;
  // #endif
  display: flex;
  align-items: center;
  left: 0;
  background: #fdf6ec;
  height: 100rpx;
  width: 100%;
  transition: 0.35s;

  >.tips {
    margin: 0 32rpx;
  }
}

/deep/ .u-notice-bar-wrap {
  width: 100% !important;
}

.box6 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  line-height: 100rpx;
  margin-bottom: 0px !important;
  background: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.tabbar-right {
  margin-top: 10rpx;
  height: 80rpx;
  color: #fff;
  line-height: 80rpx;
  background: linear-gradient( 270deg, #E22221 2%, #F09234 100%);
  padding: 0 44rpx;
  text-align: center;
  border-radius: 400px;
  margin-right: 32rpx;
}

.sp_tag {
  display: inline;
  background: #f2f2f2;
  padding: 0 20rpx 0 10rpx;
  height: 20rpx;
  line-height: 20rpx;
  font-size: 24rpx;
  color: #262626;
  border-radius: 0.4em;
}

.goods-promotion {
  float: left;
  width: 75%;
  margin: 4rpx 0;
}

.sp_tag_plain {
  margin-left: 8rpx;
  padding: 0 6rpx 0 6rpx;
  background: #fff;
  border: 1px solid $main-color;
  font-size: 24rpx;
  color: $main-color;
  border-radius: 50px;
}

.sp_tag_plain:nth-of-type(1) {
  margin-left: 0;
}

.goods-name {
  flex: 8;
  font-size: 28rpx;
}

.sp_type {
  color: $u-tips-color;
  padding: 8rpx 0;
  font-size: 24rpx;
}

.number {
  color: $main-color;
  font-size: 26rpx;
  font-weight: bold;

  >span {
    font-size: 36rpx;
  }
}

.goods-prices {
  margin: 10rpx 0;
  color: $main-color;
  font-size: 28rpx;
  font-weight: bold;

  >.goods-price {
    font-size: 38rpx;
    padding: 0 2rpx;
  }
}

.box {
  border-radius: 40rpx;
  overflow: hidden;
  background: #fff;
  margin-bottom: 20rpx;
  color: #666;
  padding: 0 32rpx;
  margin: 20rpx;
}

.wrapper {
  height: auto;
  background: #F8F8F8;
  padding-bottom: 200rpx;
  overflow: auto !important;
}

.store-name {
  margin-top: 32rpx;
  font-weight: 400;
  color: #333333;
}

/deep/ .u-col {
  padding: 36rpx 0 !important;
}

/deep/ .u-col-3,
.tipsColor {
  color: #333;
}

.goods-image {
  text-align: left;
  overflow: hidden;
}

.default {
  background: linear-gradient( 264deg, #FF2A1A 0%, #FFC96A 100%);
  font-size: 24rpx;
  border-radius: 8rpx;
  padding: 0rpx 12rpx;
  color: #fff;
  margin-right: 20rpx;
  min-width: 50rpx;
}
.address-list{
  color: #666666;
  font-size: 24rpx;
}
.address-box-unset-radius{
  border-radius: 0rpx !important;
}
.address-box {
  border-radius: 40rpx;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  overflow: hidden;
  margin-bottom: 20rpx;
  color: #666;
  margin: 20rpx;
  background-size: 100% 100% !important;
  background-repeat: no-repeat !important;
}

.address-item {
  font-weight: normal;
  letter-spacing: 1rpx;
}

.user-box {
  padding: 32rpx;
}

.user-address-detail {
  color: #333;
  font-size: 32rpx;
  font-weight: bold;
  margin: 16rpx 0;
  letter-spacing: 1rpx;
}
.user-info{
  font-size: 24rpx;
}

.mobile {
  margin-left: 20rpx;
}

.price {
  font-size: 50rpx !important;
  margin: 0 2rpx;
}

.goods-detail {
  display: flex;
  flex-direction: column;

  justify-content: center;
  flex: 8;
  margin-left: 20rpx !important;

  >p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.goods-item {
  margin: 20rpx 0;
}
</style>
