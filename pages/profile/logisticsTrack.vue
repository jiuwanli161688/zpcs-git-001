<template>
    <view class="container">
        <!-- 正在配送 -->
        <view class="wrap-receive">
            <view class="express">
                <view class="list">
                    <view class="item" v-for="(item, index) in arrData" :key="index">
                        <view class="hd">{{ item.AcceptTime }}</view>
                        <view class="bd">{{item.AcceptStation}}</view>
                    </view>
		            <empty-box v-if="!arrData||arrData.length == 0" text="暂无物流信息" />
                </view>
            </view>
        </view>
        <view class="wrap-control">
            <view class="lnk-common lnk-primary" @tap="handlerReturn">返回</view>
        </view>
    </view>
</template>
<script>
import { getTraces } from '@/api/logistics.js'
import EmptyBox from '@/components/Hina/EmptyBox'

export default {
    name: '',
    components: {
        EmptyBox
    },
    data() {
        return {
            logisticsCode: '', // 订单编号
            arrData: [],
            options:{
                logisticsCode: '',
                logisticsNo: '',
                phone: ''
            },// 接收参数
        }
    },
    onLoad(options) {
        this.options = options
        this.loadTraces()
    },
    onShow(){

    },
    methods: {
        handlerReturn() {
            uni.navigateBack({
                delta: 1
            })
        },
        // 加载物流信息
        loadTraces() {
            uni.showLoading({
                title: '加载中'
            })
            getTraces(this.options).then((res) => {
                if (res.data.success) {
                    if (this.$store.state.isShowToast) {
                        uni.hideLoading()
                    }
                    this.arrData = res.data.result.traces
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: 100vh;
    box-sizing: border-box;
    position: relative;
    padding: 0 0 20rpx;
}
</style>
