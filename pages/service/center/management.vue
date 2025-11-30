<template>
    <view class="content">
        <!-- head自定义导航 -->
        <view class="top">
            <view class="top-history" @clic="historys">
                <image class="top-history-img" src="../../../static/cbd/headGo.png" />
            </view>
            <view class="top-title">商家管理</view>
            <view class="top-add" @click="addMerchant">
                <image class="top-add-img" src="../../../static/cbd/add.png"></image>
                <text class="top-add-text">新增商家</text>
            </view>
        </view>
        <!-- tabbat切换列表 -->
        <view class="tabbat">
            <view class="filter-row">
                <view class="filter-row">
                    <view class="filter-btn" :class="{ active: showCertification }" @click.stop="toggleTime">
                        <text class="filter-text">{{ selectedCertification }}</text>
                        <text class="filter-arrow" v-if="showCertification" style="color: white;">▾</text>
                        <text class="filter-arrow" v-else>▴</text>
                    </view>
                    <view class="filter-btn right" :class="{ active: showCityContract }" @click.stop="toggleCity">
                        <text class="filter-text">{{ selectedContract }}</text>
                        <text class="filter-arrow" v-if="showCityContract" style="color: white;">▾</text>
                        <text class="filter-arrow" v-else>▴</text>
                    </view>
                    <view class="filter-btn right" :class="{ active: showLaunch }" @click.stop="toggleCity1">
                        <text class="filter-text">{{ selectedLaunch }}</text>
                        <text class="filter-arrow" style="color: white;" v-if="showLaunch">▾</text>
                        <text class="filter-arrow" v-else>▴</text>
                    </view>
                </view>
            </view>
        </view>
        <!-- list内容 -->
        <view class="list">
            <view class="list-cen">
                <!-- 遮罩层：点击遮罩关闭所有下拉，下拉内点击阻止冒泡 -->
                <view class="mask" v-show="opacitys" @click="closeAll">
                    <view class="dropdown" v-if="showCertification" @click.stop>
                        <view class="dropdown-item" v-for="(t, i) in
                            certificationOptions" :key="i" @click="selectTime(t, i)">
                            <text :class="certificationStatus == i ? 'dropdown-items' : ''">{{ t }} </text>
                            <view class="dropdown-radio" v-if="certificationStatus == i">✔</view>
                        </view>
                    </view>
                    <view class="dropdown" v-if="showCityContract" @click.stop>
                        <view class="dropdown-item" v-for="(c, i) in contractOptions" :key="i" @click="selectCity(c, i)">
                            <text :class="contractStatus == i ? 'dropdown-items' : ''">{{ c }} </text>
                            <view class="dropdown-radio" v-if="contractStatus == i">✔</view>
                        </view>
                    </view>
                    <view class="dropdown" v-if="showLaunch" @click.stop>
                        <view class="dropdown-item" v-for="(c, i) in launchOptions" :key="i" @click="selectCity1(c, i)">
                            <text :class="aunchStatus == i ? 'dropdown-items' : ''">{{ c }} </text>
                            <view class="dropdown-radio" v-if="aunchStatus == i">✔</view>
                        </view>
                    </view>
                </view>
                <no-data/>
            </view>
        </view>

    </view>
</template>

<script>
import NoData from '@/components/no-data.vue';
export default {
    name: "",
    components: { NoData },
    data() {
        return {
            // 下拉筛选数据
            certificationOptions: ['全部', '待提交', '待审核', '已审核'],
            contractOptions: ['全部', '待签约', '已签约', '已过期', '已解约'],
            launchOptions: ['全部', '上线', '下线'],
            certificationStatus: 0,//当前每列默认选中下标
            contractStatus: 0,
            aunchStatus: 0,
            selectedCertification: '认证状态',
            selectedContract: '合同状态',
            selectedLaunch: '上线状态',
            showCertification: false,
            showCityContract: false,
            showLaunch: false,
            opacitys: false,// 遮罩层透明度
        }
    },
    onLoad() {
    },
    methods: {
        historys() {
            console.log('返回上一级')
        },
        addMerchant() {
            uni.navigateTo({
                url: '/pages/service/center/addMerchant' // 拼接参数
            });
        },
        toggleTime() {
            this.showCertification = !this.showCertification;
            if (this.showCertification) {
                this.showCityContract = false;
                this.showLaunch = false;
            }
            this.opacitys = this.showCertification || this.showCityContract || this.showLaunch;
        },
        toggleCity() {
            this.showCityContract = !this.showCityContract;
            if (this.showCityContract) {
                this.showCertification = false;
                this.showLaunch = false;
            }
            this.opacitys = this.showCertification || this.showCityContract || this.showLaunch;
        },
        toggleCity1() {
            this.showLaunch = !this.showLaunch;
            if (this.showLaunch) {
                this.showCertification = false;
                this.showCityContract = false;
            }
            this.opacitys = this.showCertification || this.showCityContract || this.showLaunch;
        },
        selectTime(value, ind) {//传index或文字比较
            this.certificationStatus = ind;
            // this.selectedCertification = value;  // 设置选中的时间值
            this.showCertification = false;  // 隐藏时间下拉框
            this.opacitys = false;
        },
        selectCity(value, ind) {
            this.contractStatus = ind;
            // this.selectedContract = value;  // 设置选中的城市值
            this.showCityContract = false;  // 隐藏城市下拉框
            this.opacitys = false;
        },
        selectCity1(value, ind) {
            this.aunchStatus = ind;
            // this.selectedLaunch = value;  // 设置选中的城市值
            this.showLaunch = false;  // 隐藏城市下拉框
            this.opacitys = false;
        },

        closeAll() {
            this.showCertification = false;
            this.showCityContract = false;
            this.showLaunch = false;
            this.opacitys = false;
        },

    }
}
</script>

<style lang="scss" scoped>
$yi: 100%;

ul li {
    list-style: none
}

// 宽度百分百
.top,
.list,
.tabbat {
    width: $yi;
}

.content {
    width: $yi;
    height: auto;
    background: #FFF;
}

.top {
    height: 88rpx;
    display: flex;
    justify-content: space-between;
    // top: 0;
    // left: 0;
    // background-color: orange;
}

.top-history {
    width: 80rpx;
    height: 88rpx;
    line-height: 88rpx;
    margin-left: 40rpx;
}

.top-history-img {
    width: 17rpx;
    height: 32rpx;
}

.top-title {
    width: 200rpx;
    height: 88rpx;
    margin: 0 40rpx;
    line-height: 88rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
}

.top-add {
    width: 140rpx;
    height: 88rpx;
    margin-right: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.top-add-img {
    width: 35rpx;
    height: 35rpx;
}

.top-add-text {
    height: 100%;
    line-height: 88rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    text-indent: 10rpx;
}

.tabbat {
    height: 88rpx;
    background-color: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.list-select {
    width: $yi;
    height: 88rpx;
    position: relative;
    padding: 20rpx 20rpx 0 20rpx;
}

.filter-row {
    display: flex;
    gap: 16rpx;
}

.filter-btn {
    width: 224rpx;
    height: 62rpx;
    line-height: 62rpx;
    padding: 0 36rpx;
    border-radius: 36rpx;
    background: #F9F9F9;
    border: 2rpx solid #EFEFEF;
    display: flex;
    justify-content: center;
    align-items: center;
}

.filter-btn.active {
    border-color: #FF0101;
    background-color: #FF0101;
}

.filter-text {
    font-weight: 400;
    font-size: 28rpx;
    color: #666;
}

.filter-btn.active .filter-text {
    color: #FFF;
}

.filter-arrow {
    margin-left: 12rpx;
    color: #999;
    font-size: 26rpx;
}

.mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
}

.dropdown {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    width: 100%;
    background: #FFFFFF;
    border-radius: 0 0 8rpx 8rpx;
    z-index: 10;
}

.dropdown-item {
    height: 64rpx;
    line-height: 64rpx;
    padding: 0 18rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
    border-bottom: 1rpx solid #f2f2f2;
    position: relative;
}

.dropdown-items {
    color: black !important;
    font-weight: 500 !important;

}

.dropdown-radio {
    float: right;
    background-color: red;
    /* 你可以更改这个颜色为你想要的颜色 */
    border-radius: 50%;
    width: 30rpx;
    height: 30rpx;
    font-size: 22rpx;
    text-align: center;
    line-height: 30rpx;
    color: white;
    font-weight: 700;
    position: relative;
    margin-top: 10rpx;
}

.dropdown-item:last-child {
    border-bottom: 0;
}

.list-item {
    height: 194rpx;
    padding: 30rpx 0rpx 14rpx 20rpx;
    border-bottom: 1rpx solid #f2f2f2;
}

.thumb {
    width: 160rpx;
    height: 120rpx;
    float: right;
    border-radius: 10rpx;
    overflow: hidden;
    background: #f5f5f5;
}

.thumb-img {
    width: 100%;
    height: 100%;
    float: right;
}

.thumb-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 24rpx;
}

.info {
    width: calc(100% - 140rpx - 24rpx);
    height: auto;
    float: left;
}

.title {
    display: inline-block;
    width: auto;
    height: 62rpx;
    padding: 0rpx 20rpx;
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

.sub {
    width: $yi;
    margin-top: 16rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
    margin-bottom: 8rpx;
}

.time {
    font-weight: 400;
    font-size: 24rpx;
    display: block;
    font-size: 22rpx;
    color: #999;
}



.list {
    height: calc(100vh - (88rpx * 2));
    background-color: #fff;
    overflow-y: auto;
}

.list-cen {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    position: relative;
}

.mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

</style>