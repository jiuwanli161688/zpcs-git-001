<template>
        <view class="goods bor-r">
      <view class="title">兑换商品</view>
      <view class="goods-con">
        <image src="/static/1.jpg" class="goods-img bor-min "></image>
        <view class="goods-info">
          <view class="goods-title">即热式饮水机家用智能饮水机中品2代深圳版</view>
          <view class="goods-exchange">
            <view class="price">
              <text class="price-text">5000</text>
              <text class="price-num">兑换券</text>
            </view>
            <view class="num">x 1</view>
          </view>
        </view>
      </view>
    </view>
</template>
<script>
export default {
    props:{
        product:{
            type:Object,
            default:()=>{}
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
.goods {
  width: 100%;
  height: 276rpx;
  background: white;
  margin-top: 20rpx;
  padding: 20rpx 0 0 20rpx;
  .title {
    font-weight: 500;
    font-size: 28rpx;
    color: #333333;
  }
  .goods-con {
    width: 100%;
    height: calc(100% - 58rpx);
    margin-top: 20rpx;
    .goods-img {
      width: 176rpx;
      height: 176rpx;
      vertical-align: top;
    }
    .goods-info {
      display: inline-block;
      margin-left: 20rpx;
      width: 478rpx;
      height: 180rpx;
      .goods-title {
        height:76rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    .goods-exchange{
      height:40rpx;
      margin-top: 48rpx;
      .price{
        width:200rpx;
        height:46rpx;
        color:#FF0101;
        float:left;
        text{
          display:inline-block;
        }
        text:nth-child(1){
          font-size:32rpx;
          font-weight:700;
        }
        text:nth-child(2){
          margin-left:8rpx;
          font-size:24rpx;
          font-weight:400;
        }
        
      }
      .num{
        width:200rpx;
        height:46rpx;
        float:right;
        text-align:right;
        padding-right:10rpx;
        color:#666666;
        font-size:28rpx;
        font-weight:400;
      }
    }
    }
  }
}
//标记>
.txt::after {
  position: absolute;
  content: '';
  width: 12rpx;
  height: 12rpx;
  border: 4rpx solid #333333;
  border-left: none;
  border-bottom: none;
  right: 10rpx;
  top: 47%;
  -webkit-transform: rotate(45deg) translateY(-45%);
  transform: rotate(45deg) translateY(-45%);
}
</style>