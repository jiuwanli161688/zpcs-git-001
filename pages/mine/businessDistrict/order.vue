<template>
    <view class="content">
        <!-- 预留自定义头部div -->
        <!-- <view class=""></view> -->
        <!-- 头部tabbat -->

        <view class="head-tabbats">
            <view class="head-tabbat">
                <view
                    class="head-tabbat-item"
                    v-for="(tab, idx) in tabs"
                    :key="tab.value"
                    :class="{ 'active': params.orderStatus === tab.value }"
                    @click="setTab(tab.value)">
                    {{ tab.lable }}
                </view>
            </view>
        </view>

        <view class="order-lists">
            <view class="order-list-item" v-for="(data, index) in list" :key="index">
                <view class="list-item-nav">
                    <!-- 日期 -->
                    <view class="" >{{ data.createTime }}</view>
                    <!-- 订单号 -->
                    <view class="" >{{ data.sn }}</view>
                </view>
                <view class="list-item-cen">
                    <image class="list-item-cen-img" :src="data.storeLogo" ></image>
                    <view class="list-item-cen-text">
                        <view class="title-status">
                            <view>{{ data.storeName }}</view>
                            <view class="status-red">{{ data.orderStatusValue }}</view>
                        </view>
                        <view class="title-text">{{ data.storeAddressPath }} {{ data.industryName }}</view>
                        <view class="title-price">
                            <text>
                                <text>￥</text>
                                <text class="title-price-text">{{ data.flowPrice }}</text>
                            </text>
                        </view>
                    </view>
                </view>
            </view>

            <no-data v-if="list.length === 0" />

        </view>

    </view>
</template>

<script >
import NoData from '@/components/no-data.vue';
import {getCbdOrderList} from "../../../api/cbd/cbdOrder";

export default {
    name: "order",
    components: { NoData },
    data() {
        return {
            // tabs 切换
            tabs: [
              {
                lable: '全部',
                value: '',
              },
              {
                lable: '未支付',
                value: 'UNPAID',
              },
              {
                lable: '已支付',
                value: 'PAID',
              },
              {
                lable: '已完成',
                value: 'COMPLETED',
              },
            ],
            activeTab: '',
            intResTotal: 0, // 总条数
            // 查询参数
            params: {
              pageNumber: 1,
              pageSize: 10,
              orderStatus: ''
            },
            list: [],
        };
    },
    methods: {
        setTab(value) {
            this.params.orderStatus = value;
            this.resetQuery()
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
          getCbdOrderList(this.params).then((res) => {
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
      // 加载商品数组
      this.resetQuery()
    },
    onReachBottom: function(){
      if(this.intResTotal > this.list.length){
        this.params.pageNumber++
        this.getList()
      }
    }
};
</script>

<style lang="scss" scoped>
$yi:100%;

ul li {
	list-style: none
}

.content {
    width: $yi;
    height: calc(100% - 88rpx);
}
.head-tabbats{
    width: $yi;
    height: 102rpx;
    position: fixed;
    top: 88rpx;
    left: 0;
    z-index: 10;
}
.head-tabbat{
    width: $yi;
    height: $yi;
    background: #fff;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}
.head-tabbat-item{
    width: 20%;
    height: 100%;
    line-height: 102rpx;
    font-size: 28rpx;
    font-weight: 700;
    text-align: center;
    position: relative;
    color: #999999;
    cursor: pointer;
}
.head-tabbat-item.active{
    color: black;
}
.head-tabbat-item.active::after{
    position: absolute;
    left: calc(50% - 40rpx);
    bottom: 6rpx;
    content: "";
    width: 80rpx;
    height: 6rpx;
    background-color: red;
    border-radius: 40rpx;
}
.order-lists{
    width: $yi;
    height: calc(100vh - 102rpx);
    padding-top: 102rpx;
}
.order-list{
    height: 100%;
    box-sizing: border-box;
    padding-left: 20rpx;
    padding-right: 20rpx;
}
.order-list-item{
    box-sizing: border-box;
    width: calc(100% - 20rpx);
    height: 258rpx;
    padding: 20rpx 28rpx 0;
    background-color: white;
    margin: 20rpx 10rpx 0 10rpx;
    border-radius: 20rpx;
}
.list-item-nav{
    width: $yi;
    height: 56rpx;
    font-size: 24rpx;
    font-weight: 400;
}
.list-item-nav>view{
    line-height: 30rpx;
}
.list-item-nav>view:nth-child(1){
    color: #999999;
    float: left;
}
.list-item-nav>view:nth-child(2){
    color: black;
    float: right;
    text-align: right;
}
.list-item-cen{
    width: $yi;
    height: calc(100% - 56rpx);
    border-top: 1px solid #EAEAEA;
    box-sizing: border-box;
    padding-bottom: 20rpx;
}
.list-item-cen-img{
    width: 144rpx;
    height: 144rpx;
    float: left;
    margin: 20rpx 20rpx 0 0;
}
.list-item-cen-text{
    width: calc(100% - 164rpx);
    height: 164rpx;
    float: left;
    padding-left: 20rpx;
    box-sizing: border-box;
}
.title-status{
    width: $yi;
    height: 40rpx;
    font-size: 28rpx;
    font-weight: 500;
    margin-top: 20rpx;
}
.title-status text{
    width: 50%;
    color: #333333;
}
.title-status>view:nth-child(1){
    float: left;
    font-weight: 500;
    font-size: 28rpx;
}
.title-status>view:nth-child(2){
    float: right;
    font-weight: 400;
    font-size: 24rpx;
}
//已完成状态红色
.status-red{
    color: #F10100 !important;
}
.title-text{
    width: $yi;
    height: 34rpx;
    font-size: 24rpx;
    margin-top:10rpx;
    color: #999999;
}
.title-price{
    width: $yi;
    height: 46rpx;
    color: black;
    font-size: 24rpx;
    font-weight: 500;
    margin-top:14rpx;
}
.title-price-text{
    font-size: 32rpx;
    font-weight: 700;
    margin-left: -4rpx;
}
</style>
