<template>
  <view class="container">
    <view class="exchange-z bor-r">
      <view class="num">{{ totalAmount }}</view>
      <view class="tit">水机兑换卷</view>
    </view>

    <view class="exchange-list">
      <block v-for="item in list">
        <exchange-item :list="item" />
      </block>

      <no-data v-if="list.length === 0" />
    </view>
  </view>
</template>
<script>
import ExchangeItem from "./components/exchange-item.vue"
import NoData from '@/components/no-data.vue';
import {getCbdWatermcCouponFlowList, getCbdWatermcCouponFlowTotal} from "../../../api/cbd/voucher";
export default {
  components: {
    ExchangeItem,
    NoData,
  },
  data() {
    return {
      iconRed: '/static/cbd/couponRed.png',
      iconCoupon: '/static/cbd/headCoupon.png',
      list:[],
      intResTotal: 0, // 总条数
      // 查询参数
      params: {
        pageNumber: 1,
        pageSize: 15,
        orderStatus: ''
      },
      totalAmount: 0,
    }
  },
  methods: {
    initTotalAmount() {
      getCbdWatermcCouponFlowTotal().then(res => {
        this.totalAmount = res.data.result
      })
    },
    resetQuery () {
      this.params.pageNumber = 1
      this.list = []
      this.getList()
    },
    getList() {
      uni.showLoading({
        title: "加载中",
      });
      getCbdWatermcCouponFlowList(this.params).then((res) => {
        uni.stopPullDownRefresh();
        if (this.$store.state.isShowToast){ uni.hideLoading() };
        if (res.statusCode == 200) {
          this.isComplete = true
          let data = res.data.result.records;
          this.intResTotal=res.data.result.total
          this.list.push(...data);
        }
      });
    },
  },
  onLoad: function(){
    // 加载兑换券数组
    this.resetQuery()
    this.initTotalAmount()
  },
  onReachBottom: function(){
    if(this.intResTotal > this.list.length){
      this.params.pageNumber++
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.bor-r {
  border-radius: 20rpx;
}
.bor-min {
  border-radius: 10rpx;
}

.container {
  width: 100%;
  height: auto;
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
}

.exchange-z {
  width: 100%;
  height: 204rpx;
  background: #ffffff;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .num {
    font-size: 60rpx;
    font-weight: 700;
  }
  .tit {
    font-size: 24rpx;
    font-weight: 400;
    color: #666666;
    margin-top: 8rpx;
  }
}
.exchange-list {
  width: 100%;
  height: auto;
}
.minText {
  font-size: 20rpx;
}
.grayText {
  color: #999999 !important;
}
</style>
