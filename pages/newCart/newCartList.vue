<template>
  <div class="wrapper">
    <view class="update-tips" v-if="!loading && (cartDetail.cartList != '' && cartDetail.cartList != []) > 0">
      <view class="text"></view>
      <view class="link">
        <view class="lnk-item" @tap="deleteOrder()">
          <div>清空</div>
        </view>
        <view class="lnk-item" @tap="handlerChangeMode">{{ isEditMode ? '完成' : '编辑' }}</view>
      </view>
    </view>
    <!-- 空白页-->
    <view v-if="!loading && (cartDetail.cartList == '' || cartDetail.cartList == [] || !cartDetail)" class="empty">
      <image :src="iconEmptyCart" mode="aspectFit"></image>
      <view class="empty-tips">
        空空如也
        <navigator class="navigator" url="/pages/tabbar/home/index" open-type="switchTab">随便逛逛></navigator>
      </view>
    </view>

    <!-- 店铺商品信息 -->
    <div class="content">
      <div class="box box2" :class="{ invalid: isInvalid(item) }" v-for="(item, index) in cartDetail.cartList"
        :key="index">
        <view class="tab">
          <view class="store-line">
            <u-checkbox-group class="store-line-check">
              <!-- #ifndef MP-WEIXIN -->
              <u-checkbox shape="circle" :active-color="lightColor" v-model="item.checked"
                @change="checkboxChangeDP(item)"></u-checkbox>
              <!-- #endif -->
              <!-- 微信小程序这里 v-model出现问题，改用:value -->
              <!-- #ifdef MP-WEIXIN -->
              <u-checkbox shape="circle" :active-color="lightColor" :value="item.checked"
                @change="checkboxChangeDP(item)"></u-checkbox>
              <!-- #endif -->
            </u-checkbox-group>
            <span class="store-name wes store-line-desc">由【{{
              item.storeName
            }}】供货</span>
            <!-- <u-icon @tap="navigateToStore(item)" size="24" style="margin-left:10rpx;" name="arrow-right"></u-icon> -->
          </view>
          <!--          <view class="right-col" v-if="item.canReceiveCoupon" @tap="navigateToCoupon(item)">
            <div class="right-line"></div>
            <span>领劵</span>
          </view>-->
        </view>
        <u-swipe-action :show="skuItem.selected" :disabled="true" @open="openAction(skuItem)" :options="options"
          bg-color="#fff" ref="swiperAction" class="cart-item" v-for="(skuItem, i) in item.skuList" :index="i"
          :key="skuItem.goodsSku.id" @click="changeActionTab(skuItem)" @longpress="changeActionTab(skuItem)">
          <!-- 满减活动 -->
          <div v-if="Object.keys(skuItem.promotionMap).length != 0">
            <div v-if="getPromotion(skuItem).includes('FULL_DISCOUNT')">
              <div class="promotion-notice" v-if="item.promotionNotice">
                <span class="tips">满减</span>
                <span style="flex:10;">{{ item.promotionNotice }}</span>
              </div>
            </div>
          </div>
          <view class="goods-row" :class="{ invalid: isInvalid(skuItem) }">
            <view class="goods-config">
              <view>
                <u-checkbox-group>
                  <!-- #ifndef MP-WEIXIN -->
                  <u-checkbox shape="circle" :active-color="lightColor" class="c-left" v-model="skuItem.checked"
                    @change="checkboxChange(skuItem)"
                    :disabled="(skuItem.invalid == 1 || skuItem.goodsSku.stock == 0) && !isEditMode"
                  ></u-checkbox>
                  <!-- #endif -->
                  <!-- 微信小程序这里 v-model出现问题，改用:value -->
                  <!-- #ifdef MP-WEIXIN -->
                  <u-checkbox shape="circle" :active-color="lightColor" class="c-left" :value="skuItem.checked"
                    @change="checkboxChange(skuItem)"
                    :disabled="(skuItem.invalid == 1 || skuItem.goodsSku.stock == 0) && !isEditMode"
                  ></u-checkbox>
                  <!-- #endif -->
                </u-checkbox-group>
                <!--                <span class="invalid" v-else style="font-size: 24rpx">失效</span>-->
              </view>
              <view class="cart-img-wrapper">
                <u-image
                  border-radius="10"
                  :fade="true"
                  @tap="navigateToGoods(skuItem)"
                  width="160rpx"
                  height="160rpx"
                  :src="skuItem.goodsSku.thumbnail"
                />
                <view v-if="skuItem.invalid == 1 || skuItem.goodsSku.stock == 0" class="cart-img-overlay"></view>
                <view v-if="skuItem.invalid == 1 || skuItem.goodsSku.stock == 0" class="cart-img-mask">
                  <span v-if="skuItem.invalid == 1">商品下架</span>
                  <span v-else-if="skuItem.goodsSku.stock == 0">商品无货</span>
                </view>
              </view>
            </view>
            <view class="goods-content">
              <!-- 商品名称 -->
              <p class="sp-name" @tap="navigateToGoods(skuItem)">
                {{ skuItem.goodsSku.goodsName }}
              </p>
              <!-- 规格 -->
              <p class="sp-type" @tap="shutMask(skuItem)">{{ skuItem.goodsSku.simpleSpecs }}<u-icon name="arrow-right"
                  color="#c0c4cc" size="20"></u-icon></p>
              <p class="sp-type" v-if="skuItem.goodsSku.salesModel == 'WHOLESALE'">批发商品</p>
              <p class="sp-number" v-if="!(skuItem.invalid == 1 || skuItem.goodsSku.stock == 0)">
                <view class="sp-price">
                  <div class="main-color">
                    ￥<span>{{ $options.filters.goodsFormatPrice(skuItem.goodsSku.price)[0] }}</span>
                    <span>.{{ $options.filters.goodsFormatPrice(skuItem.goodsSku.price)[1] }}</span>
                  </div>
                </view>
                <view>
                  <uni-number-box class="uNumber" :min="1" :max="999" @change="numChange(skuItem)"
                    v-model="skuItem.num"></uni-number-box>
                </view>
                <!-- promotions -->
                <div class="promotions-list" v-if="Object.keys(skuItem.promotionMap).length != 0">
                  <div class="promotions-item-seckill" v-if="getPromotion(skuItem).includes('SECKILL')">
                    距秒杀结束: <u-count-down show-border :hide-zero-day="true" :color="$mainColor" border-color="#ededed"
                      font-size="24" :timestamp="getCountDownTime(skuItem)">
                    </u-count-down>
                  </div>
                </div>
                <div class="error-message"  v-if="skuItem.errorMessage">
                  <span v-if="skuItem.invalid == 1">商品下架，无法购买~</span>
                  <span v-if="skuItem.goodsSku.stock == 0">商品无货，无法购买~</span>
                </div>
              </p>

            </view>
          </view>
        </u-swipe-action>
      </div>
    </div>
    <u-modal v-model="deleteShow" :confirm-style="{ 'color': lightColor }" @confirm="deleteConfirm" show-cancel-button
      :content="deleteContent" :async-close="true"></u-modal>
    <!-- 结账 -->
    <div class="box box6">
      <view class="navL">
        <u-checkbox shape="circle" :active-color="lightColor" v-model="checkout" @change="checkOut()" label-size="24">全选
        </u-checkbox>
        <span class="price" v-if="!isEditMode">
          <div class="prices">
            <div class="fullPrice">
              <span class="number" v-if="cartDetail && cartDetail.priceDetailDTO">
                总计:
                <span>¥{{ $options.filters.goodsFormatPrice(cartDetail.priceDetailDTO.flowPrice)[0] }}</span>.<span>{{
                  $options.filters.goodsFormatPrice(cartDetail.priceDetailDTO.flowPrice)[1] }}</span>
              </span>
              <span class="number" v-else>总计:0.00</span>
            </div>
            <div class="discountPrice">
              <span class="number" v-if="cartDetail && cartDetail.priceDetailDTO && cartDetail.priceDetailDTO.payPoint">
                积分抵扣:
                <span>¥{{ $options.filters.goodsFormatPrice(cartDetail.priceDetailDTO.payPoint)[0] }}</span>.<span>{{
                  $options.filters.goodsFormatPrice(cartDetail.priceDetailDTO.payPoint)[1] }}</span>
              </span>
            </div>
            <div
              v-if="cartDetail.cartList && cartDetail.cartList.length != 0 && cartDetail.priceDetailDTO && cartDetail.priceDetailDTO.discountPrice != 0"
              class="discountPrice">
              <span>优惠减:￥{{ (cartDetail.priceDetailDTO.goodsPrice - cartDetail.priceDetailDTO.flowPrice) | unitPrice }}
              </span>
              <span class="discount-details" @tap="discountDetails">优惠明细</span>
            </div>
          </div>
        </span>
      </view>
      <!-- 优惠详情 -->
      <u-popup z-index="3" close mode="bottom" height="50%" closeable v-model="discountDetailsFlag" border-radius="20">
        <div class="discount-list">
          <view class="discount-title">优惠明细</view>
          <div class="discount-way">
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>商品总额</span>
              <span>￥{{ cartDetail.priceDetailDTO.goodsPrice | unitPrice }}</span>

            </div>
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>优惠券</span>
              <span>-￥{{ cartDetail.priceDetailDTO.couponPrice | unitPrice }}</span>
            </div>
            <div class="discount-item" v-if="cartDetail.priceDetailDTO">
              <span>其他优惠</span>
              <span>-￥{{ cartDetail.priceDetailDTO.discountPrice | unitPrice }}</span>
            </div>
          </div>
        </div>
      </u-popup>

      <view v-if="isEditMode" @tap="deleteGoods()">
        <div class="settlement">删除</div>
      </view>
      <view v-else style="display: flex;align-items: center;justify-content: center;">
        <view @tap="submitOrder()">
          <div class="settlement">去结算</div>
        </view>
      </view>
    </div>
    <u-toast ref="uToast" />
    <!-- 商品规格 -->
    <popupGoods ref="popupGoods" @changed="changedGoods" @closeBuy="closePopupBuy" @queryCart="cartCount()"
      :goodsDetail="goodsDetail" :goodsSpec="goodsSpec" @getCardData="getCardData" :wholesaleList="wholesaleList"
      @handleClickSku="selectSku" :isCart="true" :oldGoodsSkuId="oldGoodsSkuId" v-if="buyMask" :buyMask="buyMask" />
  </div>
</template>
<script>
import * as API_Trade from "@/api/trade";
import { debounce } from "@/utils/tools.js";
import { getGoods } from "@/api/goods.js";
import uniNumberBox from '@/components/uni-number-box'
import storage from "@/utils/storage"
import popupGoods from "@/components/m-buy/goods"; //购物车商品的模块
export default {
  components: { uniNumberBox, popupGoods }, // 数量加减组件
  data() {
    return {
      loading: false,
      iconEmptyCart: `${this.iconCommon}/static/emptyCart.png`,
      lightColor: this.$lightColor,
      discountDetailsFlag: false, //优惠明细开关
      // 商品栏右侧滑动按钮
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: this.$lightColor, //高亮颜色
          },
        },
      ],
      isInvalid(val) {
        //是否无效商品/没库存商品
        if (val.invalid == 1 || (!val.checked && val.errorMessage)) {
          return true;
        } else {
          return false;
        }
      },
      deleteShow: false, //右滑删除
      deleteContent: "删除该商品？", //删除显示的信息
      cartDetail: "", //购物车详情
      goodsVal: "", //单个商品详情
      isEdit: false, // 是否是编辑
      checkout: false, //全选按钮
      WEIXIN_num: "", //购物车兼容微信步进器
      goodsDetail: {}, //商品数据
      goodsSpec: "", //规格数据
      buyMask: false, //添加购物车直接购买，查看已选 弹窗
      wholesaleList: [],
      selectedGoods: "", //选择的商品规格昵称
      oldGoodsSkuId: '',// 旧商品skuId
      cartList: [], //购物车列表
      isEditMode: false,				// 是否编辑模式，编辑模式禁止滑动
    };
  },

  mounted() {
    // #ifdef MP-WEIXIN
    // 小程序默认分享
    uni.showShareMenu({ withShareTicket: true });
    // #endif
  },
  onPullDownRefresh() {
    this.getCardData();
  },
  /**
   * 初始化信息
   */
  onShow() {
    this.isEditMode = false
    const token = storage.getAccessToken();
    if (token) {
      this.deleteShow ? (this.deleteShow = false) : true;
      if (this.$refs.swiperAction) {
        this.$refs.swiperAction.forEach((item, index) => {
          item.show = false;
        });

        this.getCardData();
      } else {
        this.getCardData();
      }
    } else {
      this.cartDetail = ""
      uni.removeTabBarBadge({
        index: 2,
      })
    }
  },
  methods: {
    selectSku(idObj) {
      this.getGoodsDetail(idObj.skuId, idObj.goodsId);
    },
    // 获取商品信息
    async getGoodsDetail(id, goodsId) {
      let response = await getGoods(id, goodsId);
      /**商品信息以及规格信息存储 */
      this.goodsDetail = response.data.result.data;
      this.goodsSpec = response.data.result.specs;
      this.wholesaleList = response.data.result.wholesaleList;
    },
    /**
    * 查询购物车总数量
    */
    cartCount() {
      if (storage.getHasLogin()) {
        API_trade.getCartNum().then((res) => {
          this.nums = res.data.result;
        });
      }
    },
    /**
    * 规格弹窗开关
    */
    async shutMask(skuItem) {
      uni.showLoading();
      this.oldGoodsSkuId = skuItem.goodsSku.id;
      await this.getGoodsDetail(skuItem.goodsSku.id, skuItem.goodsSku.goodsId);
      uni.hideLoading();
      this.buyMask = true;
    },
    /**
     * 商品规格子级关闭回调
     */
    closePopupBuy(val) {
      this.buyMask = val;
    },
    /**选择商品 */
    changedGoods(val) {
      this.selectedGoods = val;
    },
    /**
       * 倒数计时
       */
    getCountDownTime(val) {
      if (val.promotionMap) {
        let key = Object.keys(val.promotionMap).find((child, index) => {
          return child.split("-")[0] == 'SECKILL'
        });
        return val.promotionMap[key].endTime / 1000 - (new Date().getTime() / 1000)
      }
    },

    /**
     * 优惠明细开关
     */
    discountDetails() {
      this.discountDetailsFlag = true;
    },
    /**
     * 左滑打开删除
     */
    openAction(skuItem) {
      /**循环父级有多少个店铺 */
      this.cartDetail.cartList.forEach((cartItem) => {
        if (cartItem.skuList) {
          cartItem.skuList.forEach((sku) => {
            this.$set(sku, "selected", false);
          });
        }
      });
      this.$set(skuItem, "selected", true);
    },

    /**
     * 滑动删除
     */
    changeActionTab(val) {
      console.log(val)
      this.deleteShow = true;
      this.goodsVal = val;
    },

    /**
     * 点击删除
     */
    deleteConfirm() {
      API_Trade.deleteSkuItem(this.goodsVal.goodsSku.id).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            title: "此商品删除成功",
            duration: 2000,
          });
          this.deleteShow = false;
          this.getCardData();
        }
      });
    },

    /**
     * 删除商品
     */
    deleteGoods() {
      if (this.whetherChecked('delete')) {
        var delGoodsData = [];
        this.cartDetail.cartList.forEach((item) => {
          item.skuList.forEach((goodsItem) => {
            if (goodsItem.checked) {
              delGoodsData.push(goodsItem.goodsSku.id);
            }
          });
        });
        if (delGoodsData && delGoodsData.length > 0) {
          // 执行删除
          API_Trade.deleteSkuItem(delGoodsData).then((res) => {
            if (res.data.success) {
              uni.showToast({
                title: "删除成功!",
                icon: "none",
              });
              this.getCardData();
            }
          });
        } else {
          uni.showToast({
            title: "请选择删除商品",
            icon: "none",
          });
        }
      }
    },

    /**
     * 跳转到店铺
     */
    navigateToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },

    /**
     * 跳转到优惠券
     */
    navigateToCoupon(val) {

    },

    /**
     * 跳转到商品
     */
    navigateToGoods(val) {
      uni.navigateTo({
        url:
          "/pages/product/goods?id=" +
          val.goodsSku.id +
          "&goodsId=" +
          val.goodsSku.goodsId,
      });
    },

    /**
     * 点击步进器回调
     */
    numChange: debounce(function (val) {
      this.updateSkuNumFun(val.goodsSku.id, val.num);
    }, 1000),
    /**
     * 去结算
     */
    submitOrder() {
      const token = storage.getAccessToken();
      if (!token) {
        this.navigateTo("/pages/login/login");
        return
      }
      if (this.whetherChecked('submit')) {
        this.navigateTo("/pages/order/fillorder?way=CART&source=CARD_RECOMMEND");
      }
    },

    /**
     * 验证是否选中商品
     */
    whetherChecked(type) {
      this.$options.filters.forceLogin()

      let canBuy = false;
      this.cartDetail.cartList.forEach((item) => {
        if (item.checked && !item.invalid) {
          canBuy = true;
        } else {
          item.skuList.forEach((skuItem) => {
            if (type == 'delete') {
              if (skuItem.checked) {
                canBuy = true;
              }
            } else if (type == 'submit') {
              if (skuItem.checked && !skuItem.invalid) {
                canBuy = true;
              }
            }

          });
        }
      });
      if (!canBuy) {
        uni.showToast({
          title: "您还没有选择商品",
          duration: 2000,
          icon: "none",
        });
        return false;
      } else {
        return true;
      }
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
     * 全选
     */
    checkOut() {
      API_Trade.checkAll(this.checkout).then((result) => {
        if (this.cartDetail.cartList.length == 0 && this.checkout) {
          uni.showToast({
            title: "当前购物车为空",
            icon: "none"
          })
          this.checkout = false
          return
        }

        if (result.data.success) {
          this.getCardData();
          return true;
        }
        if (this.checkout) {
          this.checkout = false;
        }
      });
    },

    /**
     * 获取店铺选中信息
     */
    checkStoreFun(skuId, num) {
      API_Trade.checkStore(skuId, num).then((result) => {
        if (result.data.success) {
          this.getCardData();
        }
      });
    },

    /**
     * 店铺点击
     */
    checkboxChangeDP(e) {
      // #ifdef MP-WEIXIN
      e.checked = !e.checked;
      // #endif
      this.checkStoreFun(e.storeId, e.checked);
    },

    /**
     * 获取购物车选中信息
     */
    updateSkuCheckedFun(skuId, num) {
      API_Trade.updateSkuChecked(skuId, num).then((result) => {
        if (result.data.success) {
          this.getCardData();
        }
      });
    },

    /**
     * 更新商品购物车数量
     */
    updateSkuNumFun(skuId, num) {
      API_Trade.updateSkuNum(skuId, num).then((result) => {
        if (result.statusCode == 200) {
          this.getCardData();
        } else {
          let _this = this;
          setTimeout(() => {
            _this.getCardData();
          }, 1000);
        }
      });
    },

    // 数据去重一下
    getPromotion(item) {
      return Object.keys(item.promotionMap).map((child) => {
        return child.split("-")[0]
      });
    },

    /**
     * 获取购物车数据
     */
    getCardData() {
      if (this.$options.filters.isLogin("auth")) {
        uni.showLoading({
          title: "加载中",
        });
        API_Trade.getCarts()
          .then((result) => {
            this.loading = false;
            uni.stopPullDownRefresh();
            if (result.data.success) {
              this.cartDetail = result.data.result;
              this.cartList = result.data.result.cartList
              let checkOuted = true;
              for (let i = 0; i < this.cartDetail.cartList.length; i++) {
                let item = this.cartDetail.cartList[i];
                // 循环出当前商品是否全选
                if (item.checked == 0) {
                  checkOuted = false;
                }
                // 如果有拼团活动顺便删除
                item.skuList &&
                  item.skuList.forEach((sku) => {
                    if (sku.checked == 0) {
                      checkOuted = false;
                    }
                    if (Object.keys(sku.promotionMap).length != 0) {
                      Object.keys(sku.promotionMap).forEach((pro, proIndex) => {
                        pro = pro.split('-')[0]
                        if (pro == "PINTUAN") {
                          Object.keys(sku.promotionMap).splice(proIndex, 1);
                        }
                      });
                    }

                  });
              }
              this.checkout = checkOuted;
              //如果商品数量为0，不能勾选全选
              if (this.checkout && this.cartDetail.cartList.length == 0) {
                this.checkout = false;
              }
              //在taber显示购物车商品数量
              if (this.cartDetail.cartList.length > 0) {
                let arrNums = this.cartDetail.cartList.map(item => {
                  return item.checkedSkuList.length
                })
                let shopNums = 0;
                for (let i = 0; i < arrNums.length; i++) {
                  shopNums += arrNums[i]
                }
                if (shopNums) {
                  uni.setTabBarBadge({
                    index: 2,
                    text: shopNums.toString()
                  })
                } else {
                  uni.removeTabBarBadge({
                    index: 2
                  })
                }
              } else {
                uni.removeTabBarBadge({
                  index: 2
                })
              }
              uni.stopPullDownRefresh();
            }
            uni.hideLoading()
          })
          .catch((err) => { this.loading = false; });
        if (this.$store.state.isShowToast) { uni.hideLoading() };
      } else {
        if (this.$store.state.isShowToast) { uni.hideLoading() };
      }
    },

    /**
     *  选中某个复选框时，由checkbox时触发
     */
    checkboxChange(e) {
      // #ifdef MP-WEIXIN
      e.checked = !e.checked;
      // #endif
      if (!e.invalid) {
        this.updateSkuCheckedFun(e.goodsSku.id, e.checked);
      }
    },
    deleteOrder() {
      uni.showModal({
        title: "谨慎操作",
        content: "您确定要清空当前购物车吗？",
        confirmText: "确定",
        confirmColor: "#FF0000",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            API_Trade.deleteShops().then((res) => {
              if (res.data.code == 200) {
                uni.showToast({
                  icon: 'none',
                  title: '删除成功'
                })
                this.isEditMode = false
                this.getCardData();
              } else {
                uni.showToast({
                  icon: 'none',
                  title: res.data.message,
                  duration: 2000
                })
              }
            })
          }
        },
      });
    },
    // 变更渲染模式
    handlerChangeMode: function () {
      this.isEditMode = !this.isEditMode
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f2f2f2;
}
</style>
<style scoped lang="scss">
// #ifdef MP-WEIXIN
@import "./mp-carui.scss";

// #endif
.u-image {
  box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.05);
}

.promotion-notice {
  margin-top: 10px;
  margin-left: 68rpx;
  font-size: 24rpx;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;

  /deep/ .tips {
    margin: 0 8rpx 0 0;
    background: $main-color;
    border-radius: 100px;
    display: block;
    flex: 1;
    padding: 2rpx 12rpx;
    color: #fff;
  }
}

.default-color {
  color: #333;
}

.goods-row {
  padding: 30rpx 0;

  display: flex;
  align-items: center;
}

.store-name {
  font-weight: bold;
  font-size: 28rpx;
}

.invalid {
  // filter: grayscale(1);
}

.cart-item {
  border-radius: 0.4em;
  transition: 0.35s;
}

/* 空白页 */
/deep/ .u-number-input {
  background: #fff !important;
  border: 1px solid #ededed;
  margin: 0 !important;
}

/deep/ .u-icon-minus,
/deep/ .u-icon-plus {
  background: #ffffff !important;
  border: 1px solid #ededed;
  color: #333 !important;
  width: 40rpx;
}

.empty {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;
  padding-bottom: var(--window-bottom);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;

  image {
    width: 240rpx;
    height: 160rpx;
    margin-bottom: 30rpx;
  }

  .empty-tips {
    display: flex;
    font-size: $font-sm + 2rpx;
    color: $font-color-disabled;

    .navigator {
      color: $uni-color-primary;
      margin-left: 16rpx;
    }
  }
}

.settlement {
  width: 180rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
  border-radius: 900rpx;
  text-align: center;
  color: #fff;
  margin-right: 10rpx;
}

.price {
  display: flex;
  align-items: center;

  /deep/ .number {
    line-height: 1;
    font-size: 30rpx;

    >span {
      font-weight: bold;
    }
  }
}

.box2 {
  border-radius: 20rpx;
  padding: 0 16rpx 0;
  margin: 0 16rpx 20rpx;

  .u-checkbox {
    display: flex;
    align-items: center;
    text-align: center;
  }

  background: #fff;

}

.wrapper {
  height: 100%;
}

.back-btn {
  position: fixed;
  top: 20rpx;
  left: 0;
  color: #eeeeee;
  width: 100rpx;
  font-size: 60rpx;
  font-weight: 550;
  z-index: 1000;
}

/deep/ .u-col {
  padding: 24rpx 0 !important;
}

.goods-content {
  width: 100%;
  height: 100%;
  overflow: hidden;

  >p {
    padding-left: 20rpx;
  }
}

.content {
  padding: 0 0 20rpx 0;
  margin-bottom: 80rpx;
}

.line {
  float: left;
  width: 1px;
  height: 100%;
  border-right: 1px solid $light-color;
}

.store-line-check,
.store-line-img,
.store-line-desc {
  // #ifdef MP-WEIXIN
  float: left;
  // #endif
}

.store-line {
  // #ifndef MP-WEIXIN
  display: flex;
  // #endif
  overflow: hidden;
  flex: 10;
}

.goods-config {
  display: flex;
  align-items: center;

  /deep/ .invalid {
    display: block;
    width: 80rpx !important;
  }
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0 0 0;
}

.right-col {
  flex: 2;
  text-align: center;
  width: 100rpx;
  color: $light-color;
  font-size: 26rpx;

  >span {
    margin-left: 20rpx;
  }
}

.right-line {
  width: 3px;
  float: left;
  height: 40rpx;
  border-left: 1px solid #eeeeee;

  /deep/ span {
    margin-left: 20rpx;
  }
}

.box6 {
  justify-content: space-between;
  position: fixed;
  // #ifdef APP-PLUS || MP-WEIXIN
  bottom: 0;
  // #endif
  // #ifdef H5
  bottom: var(--window-bottom);
  // #endif
  left: 0;
  border-top: 1px solid #ededed;
  display: flex;
  height: 100rpx;
  overflow: hidden;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 1);
  color: #333;
  z-index: 99;

  >.navL {
    padding: 0 32rpx;
    display: flex;
    align-items: center;
  }
}

.sp-type {
  color: $u-light-color;
  padding: 10rpx 0;
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  // background-color: rgba(0, 0, 0, 0.6); /* 半透明黑色 */
  // border-radius: 8px; /* 圆角效果 */
  // color: white; /* 白色文字 */
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  // margin-left: 10rpx;
  // width: auto;
}


.sp-number {
  font-weight: bold;

  display: flex;
  justify-content: space-between;

  >.sp-price {
    /deep/ span:nth-of-type(1) {
      font-size: 38rpx;
    }

    /deep/ span:nth-of-type(2) {
      font-size: 24rpx;
    }
  }
}

.priceDetail-flowPrice {
  font-weight: bold;
  padding-left: 20rpx;

  >span:nth-of-type(1) {
    font-size: 38rpx;
  }
}

.prices {
  display: flex;
  flex-direction: column;

  >.discountPrice {
    align-items: center;
    display: flex;
    font-size: 24rpx;
    color: rgb(201, 199, 199);
  }
}

.discount-details {
  margin-left: 10px;
  color: #666;
  padding: 4rpx 10rpx;
  border-radius: 100px;
  background: rgba(201, 199, 199, 0.3);
}

.discount-item {
  display: flex;
  margin: 40rpx 0;
  justify-content: space-between;

  >span:nth-of-type(1) {
    color: #666;
  }

  >span:nth-of-type(2) {
    color: #333;
    font-weight: bold;
  }
}

.discount-title {
  font-size: 36rpx;
  margin-top: 20rpx;
  text-align: center;
}

.discount-way {
  width: 94%;
  margin: 0 3%;
}

.discount-list {
  width: 100%;
}

.promotions-list {
  margin-left: 20rpx;

  >.promotions-item-seckill {
    background: rgba($color: $main-color, $alpha: 0.1);
    font-size: 24rpx;
    color: $main-color;
    display: inline;
    padding: 0rpx 10rpx;
    border-radius: 100px;
  }
}

.update-tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  font-size: 26rpx;
  padding: 0 20rpx;

  .link {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .lnk-item {
      margin: 0 0 0 16rpx;
      color: #323232;

      &:last-of-type {
        color: #E22221;
      }
    }
  }
}

.cart-img-wrapper {
  position: relative;
  display: inline-block;
}
.cart-img-gray {
  // filter: grayscale(1);
}
.cart-img-mask {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 160rpx;
  height: 50rpx;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 10rpx 10rpx;
  color: #fff;
  font-size: 28rpx;
  z-index: 2;
}

.error-message {
  margin-left: 20rpx;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.cart-img-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 160rpx;
  height: 160rpx;
  background: rgba(0,0,0,0.22);
  border-radius: 10rpx;
  z-index: 1;
}
</style>
