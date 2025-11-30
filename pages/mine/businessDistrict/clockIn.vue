<template>
    <view class="content">
        <view class="head">
            <!-- 返回 -->
            <view class="head-history">
                <image style="width: 15rpx;height: 32rpx;" src="../../../static/mine/businessDistrict/cloneIn.png"></image>
            </view>
            <!-- user列 -->
            <view class="head-user">
                <!-- 用户头像 -->
                <view class="head-user-img">
                    <image style="width: 100%;height: 100%;" :src="userInfo.face || userImage"></image>
                </view>
                <!-- 用户名字 -->
                <view class="head-user-name">{{userInfo.nickName}}</view>
                <!-- 用户头部信息 -->
                <view class="head-user-clockIn">
                    <image
                    style="width:29rpx;height: 36rpx;float: left;margin-left: 16rpx;margin-top:4rpx;"
                    src="../../../static/mine/businessDistrict/citys.png"></image>
                    <text class="head-user-text">累计打卡{{ user.totalClockInCount }}次</text>
                </view>
            </view>
            <!-- 地点 -->
             <view class="head-location">
                <view style="width:200rpx;height: 54rpx;">
                    <image
                    style="width:54rpx;height: 54rpx;float: left;margin-left: 16rpx;margin-top:4rpx;"
                    src="../../../static/mine/businessDistrict/city.png"></image>
                    <text class="head-location-text">{{ user.totalCityCount }}个城市</text>
                </view>
                <view
                style="width:4rpx;height: 32rpx;background: #FFF;margin:8rpx 88rpx 0;"></view>
                <view style="width:200rpx;height: 54rpx;">
                    <image
                    style="width:54rpx;height: 54rpx;float: left;margin-left: 16rpx;margin-top:4rpx;"
                    src="../../../static/mine/businessDistrict/location.png"></image>
                    <text class="head-location-text">{{ user.totalMerchantCount }}个地点</text>
                </view>
             </view>
            <!-- 白框 -->
            <view class="head-white"></view>
        </view>
        <view class="list">
            <view class="list-select">
                    <view class="filter-row">
                        <view class="filter-btn" :class="{active: showTimeDropdown}" @click.stop="toggleTime">
                            <text class="filter-text">{{ selectedTime }}</text>
                            <text class="filter-arrow">▾</text>
                        </view>
                        <view class="filter-btn right" :class="{active: showCityDropdown}" @click.stop="toggleCity">
                            <text class="filter-text">{{ selectedCity }}</text>
                            <text class="filter-arrow">▾</text>
                        </view>
                    </view>

                    <view class="dropdown" v-if="showTimeDropdown">
                        <view class="dropdown-item" v-for="(t, i) in timeOptions" :key="i" @click="selectTime(t)">{{ t }}</view>
                    </view>
                    <view class="dropdown" v-if="showCityDropdown" style="left: 220rpx;">
                        <view class="dropdown-item" v-for="(c, i) in cityOptions" :key="i" @click="selectCity(c)">{{ c }}</view>
                    </view>
                </view>
                <!--  <scroll-view class="order-list" scroll-y="true" show-scrollbar="true"></scroll>先用路由坑占位置 -->
            <view class="list-center">
                <view class="list-center-left">
                    <view v-for="(item, index) in list" :key="index">
                        <image class="list-center-img" src="../../../static/mine/businessDistrict/mark.png"></image>
                        <view v-if="index!=list.length-1" class="list-center-h"><view></view></view>
                    </view>

                </view>
                <view class="list-center-item">
                    <view class="list-item" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
                        <view class="info">
                            <view class="title">{{ item.storeName }}</view>
                            <view class="sub">{{ item.area }} AAA</view>
                            <text class="time">{{ item.createTime }}</text>
                        </view>
                        <view class="thumb">
                            <image v-if="item.photo" :src="item.photo" mode="aspectFill" class="thumb-img"></image>
                            <view v-else class="thumb-placeholder">暂无图片</view>
                        </view>
                  </view>
                </view>
            </view>

          <no-data v-if="list.length === 0" />
        </view>
    </view>
</template>

<script >
import {getCbdClockInList, getCbdClockInStatistics} from "@/api/cbd/clockIn";
import configs from '@/config/config'
import NoData from '@/components/no-data.vue';

export default {
    components: { NoData },
    data() {
        return {
            configs,
            userImage: configs.defaultUserPhoto,
            userInfo: {},
            user:{
                clockin:1,//打卡次数
                city:1,
                location:1,
            },
            list:[ // 打卡地点示例（演示 image 为空或有值的情况）
              { title: '汉斯小酒馆', city: '北京', category: '家常菜', time: '2025-08-14 15:27:25', image: '/static/cbd/sample1.jpg' },
              { title: '西北卡尔扎伊拉面店', city: '北京', category: '快餐', time: '2025-08-14 15:27:25', image: '' },
              { title: '西北卡尔扎伊拉面店', city: '北京', category: '烤鸭', time: '2025-08-14 15:27:25', image: '/static/cbd/sample2.jpg' },
              { title: '西北卡尔扎伊拉面店', city: '北京', category: '快餐', time: '2025-08-14 15:27:25', image: '' }
            ],//打卡地点
            // 下拉筛选数据
            timeOptions: ['全部时间','最近7天','最近30天','自定义'],
            cityOptions: ['全部城市','北京','上海','广州','深圳'],
            selectedTime: '全部时间',
            selectedCity: '全部城市',
            showTimeDropdown: false,
            showCityDropdown: false,
            intResTotal: 0, // 总条数
            // 查询参数
            params: {
              pageNumber: 1,
              pageSize: 10,
              order: "desc",
              sort: "updateTime",
            },
        };
    },
    methods: {
        toggleTime() {
            this.showTimeDropdown = !this.showTimeDropdown;
            if (this.showTimeDropdown) this.showCityDropdown = false;
        },
        toggleCity() {
            this.showCityDropdown = !this.showCityDropdown;
            if (this.showCityDropdown) this.showTimeDropdown = false;
        },
        selectTime(value) {
            this.selectedTime = value;
            this.showTimeDropdown = false;
        },
        selectCity(value) {
            this.selectedCity = value;
            this.showCityDropdown = false;
        },
        goDetail(item) {
            uni.navigateTo({
                url: `/pages/mine/businessDistrict/clockInDetail?id=${item.id}`
            });
        },
        getStatistics() {
          getCbdClockInStatistics().then(res => {
            console.log(res.data)
            this.user = res.data.result
          })
        },
        // 获取列表
        getList() {
          uni.showLoading({
            title: "加载中",
          });
          getCbdClockInList(this.params).then((res) => {
            uni.stopPullDownRefresh();
            if (this.$store.state.isShowToast){ uni.hideLoading() };
            if (res.statusCode == 200) {
              this.isComplete = true
              let data = res.data.result.records;
              this.intResTotal=res.data.result.total
              this.list.push(...data);
            }
          });
        }
    },
    onLoad: function(){
      this.userInfo = this.$options.filters.isLogin() || {};
      console.log(this.userImage)
      console.log(this.userInfo)
      console.log(this.userInfo.face || this.userImage)
      this.list=[]
      // 加载商品数组
      this.getList()
      this.getStatistics()
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
:deep(.uni-page-wrapper){
    background: #fff;
}
.content {
	width: $yi;
	height: auto;
    background: #FFF;

}
.head{
    width: $yi;
    height: 430rpx;
	background:linear-gradient(47deg, #ff3b30 30% ,#F7C54D 100%); /* 0% 到 50% 背景色渐变 */
}

.head-history{
    width: $yi;
    height:auto;
    box-sizing: border-box;
    padding-left: 20rpx;
    padding-top:calc( 60rpx);
}
.head-user{
    width: $yi;
    height: 138rpx;
    margin-top: 40rpx;
    box-sizing: border-box;
    padding-left: 20rpx;
}
.head-user-img{
    width: 138rpx;
    height: 138rpx;
    border-radius: 50%;
    background: red;
    overflow: hidden;
    float: left;
}
.head-user-name{
    width: calc(100% - 139rpx - 20rpx);
    height: 46rpx;
    float: left;
    margin-left:20rpx ;
    font-weight: 500;
    font-size: 32rpx;
    color: #FFF;
    margin-top: 20rpx;
}
.head-user-clockIn{
    width: 228rpx;
    background-color: #D32D00;
    border-radius: 30rpx;
    height: 46rpx;
    float: left;
    margin-left:20rpx ;
    margin-top: 14rpx;
}
.head-user-text{
    font-weight: 400;
    font-size: 24rpx;
    color: #FFFFFF;
    margin-left:12rpx ;
}
.head-location{
    width: $yi;
    height: auto;
    margin-top: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}
.head-location-text{
    margin-left: 16rpx;
    color: #FFFFFF;
    font-weight: 400;
    font-size: 28rpx;
    line-height: 66rpx;
}
.head-white{
    width: $yi;
    height: 46rpx;
    background: #FFF;
    margin-top: 34rpx;
    border-radius: 30rpx 30rpx 0 0;
}


.list{
    width: $yi;
    height: auto;
    background: #fff;
}
.list-select{
    width: $yi;
    height: 88rpx;
    position: relative;
    padding: 20rpx 20rpx 0 20rpx;
}
.filter-row{
    display: flex;
    gap: 16rpx;
}
.filter-btn{
    height: 62rpx;
    line-height: 62rpx;
    padding: 0 28rpx;
    border-radius: 36rpx;
    background: #F6F6F6;
    border: 2rpx solid #EFEFEF;
    display: flex;
    align-items: center;
}
.filter-btn.right{
    background: #FAFAFA;
}
.filter-btn.active{
    border-color: #2F8CFF;
}
.filter-text{
    font-weight: 400;
    font-size: 28rpx;
    color: #666;
}
.filter-btn.active .filter-text{
    color: #2F8CFF;
}
.filter-arrow{
    margin-left: 12rpx;
    color: #999;
    font-size: 22rpx;
}
.dropdown{
    position: absolute;
    top: 92rpx;
    left: 20rpx;
    width: 180rpx;
    background: #FFFFFF;
    box-shadow: 0 6rpx 18rpx rgba(0,0,0,0.06);
    border-radius: 8rpx;
    z-index: 10;
}
.dropdown-item{
    height: 64rpx;
    line-height: 64rpx;
    padding: 0 18rpx;
    font-size: 26rpx;
    color: #333;
    border-bottom: 1rpx solid #f2f2f2;
}
.dropdown-item:last-child{ border-bottom: 0; }
.list-item{
    height: 194rpx;
    padding: 30rpx 0rpx 14rpx 20rpx ;
    border-bottom: 1rpx solid #f2f2f2;
}
.thumb{
    width: 160rpx;
    height: 120rpx;
    float: right;
    border-radius: 10rpx;
    overflow: hidden;
    background: #f5f5f5;
}
.thumb-img{
    width: 100%;
    height: 100%;
    float: right;
}
.thumb-placeholder{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 24rpx;
}
.info{
    width: calc(100% - 140rpx - 24rpx);
    height: auto;
    float: left;
}
.title{
    display: inline-block;
    width: auto;
    height: 62rpx;
    padding:0rpx 20rpx;
    line-height: 62rpx;
    border-radius: 30rpx;
    font-size: 28rpx;
    font-weight: 500;
    background-color: #fff3ea;
    color: #FE5C3C;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
}
.sub{
    width: $yi;
    margin-top:16rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    margin-bottom: 8rpx;
}
.time{
    font-weight: 400;
    font-size: 24rpx;
    display: block;
    font-size: 22rpx;
    color: #999;
}

.list-center{
    width: $yi;
    height: auto;
    margin-top: 36rpx;
    display: flex;
}
.list-center-left{
    width: 108rpx;
    height:108rpx;
    margin-top: 24rpx;
    margin-left: 20rpx;
    .list-center-img{
        width:108rpx;
        height:108rpx;
    }
    .list-center-h{
        width:108rpx;
        height:64rpx;
        margin-top: 8rpx;
        margin-bottom: 8rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .list-center-h view{
        height: 100%;
        width: 0;
        border: 2rpx dashed #666666;
    }
}
.list-center-item{
    width: calc(100% - 20rpx - 112rpx - 40rpx - 20rpx );
    height: auto;
    margin-left: 20rpx;
}


</style>
