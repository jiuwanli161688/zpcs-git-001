<template>
    <view class="container" v-if="isComplete">
        <view>
            <view class="frm-comm">
                <view class="rs rs-line">
                    <view class="lab">上门时间</view>
                    <view class="txt flex">
                        <picker mode="selector" @change="bindPickerTime" :value="curTime" :range="arrTimeRange"
                            range-key="time">
                            <view class="in-picker picker-color" :class="{ 'in-picker_place': curTime.length < 0 }">{{
                                curTime.length == 0 ? '请选择上门取件时间' : arrTimeRange[curTime].time }}
                            </view>
                        </picker>
                    </view>
                </view>
            </view>
        </view>
        <view class="lnk-common lnk-primary" @tap="handleUpdateDoorTime">提交
        </view>
    </view>
</template>

<script>
import { getServiceDetail, checkDoorServiceOpen, updateDoorTime } from "@/api/after-sale.js";
export default {
    data() {
        return {
            isComplete: false,
            isReason: false,
            objDoorPickup: {},
            sn: "",
            arrTimeRange: [],						//上门时间
            curTime: ''
        }
    },
    methods: {
        // 加载售后信息
        loadBaseData: async function () {
            await getServiceDetail(this.sn).then((res) => {
                if (res.data.success) {
                    if (this.$store.state.isShowToast) { uni.hideLoading() };
                    this.isComplete = true
                    this.objSales = res.data.result;
                    this.receiverAddress = this.objSales.salesConsigneeAddressPath.split(",");
                    this.senderAddress = this.objSales.salesSendingAddressPath.split(",");
                    this.params = {
                        shipperType: 3,

                        receiver: {
                            provinceName: this.receiverAddress[0],
                            cityName: this.receiverAddress[1],
                            expAreaName: this.receiverAddress[2],
                            address: this.receiverAddress[3],
                        },
                        sender: {
                            provinceName: this.senderAddress[0],
                            cityName: this.senderAddress[1],
                            expAreaName: this.senderAddress[2],
                            address: this.senderAddress[3],
                        },
                        weight: 1
                    }
                }
            });
            //加载时间信息
            await checkDoorServiceOpen(this.params).then(res => {
                if (res.data.success) {
                    //返回总时间数组
                    let doorTime = res.data.result.times;
                    //获得想要显示的时间数据
                    let doorTimeArr = doorTime.map((item) => {
                        let startTimeArr = item.startTime.split(" ")
                        let startStr = startTimeArr[1].split(":").slice(0, 2).join(":")
                        let endStr = item.endTime.split(" ")[1].split(":").slice(0, 2).join(":")
                        startTimeArr.push(item.endTime.split(" ")[1])
                        let startAndEnd = startStr + " - " + endStr
                        startTimeArr.pop();
                        startTimeArr.pop();
                        startTimeArr.push(startAndEnd);
                        return startTimeArr
                    })

                    for (let i = 0; i < doorTimeArr.length; i++) {
                        let objDoorTime = {
                            time: doorTimeArr[i].join(" "),
                            value: i
                        }
                        this.arrTimeRange.push(objDoorTime)
                    }
                }
            })
        },

        // 选择取件时间
        bindPickerTime: function (e) {
            this.curTime = Number(e.detail.value)
        },
        //修改预约时间
        handleUpdateDoorTime: function () {
            if (!this.curTime && this.curTime !== 0) {
                this.$u.toast('请选择预约时间')
                return
            }
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
            let startEndDate = this.arrTimeRange[this.curTime].time.split(" ")[0];
            let userStartTime = this.arrTimeRange[this.curTime].time.split(" ")[1] + ":00";
            let userEndTime = this.arrTimeRange[this.curTime].time.split(" ")[3] + ":00";
            let params = {
                shipperType: '3',
                startDate: startEndDate + " " + userStartTime,
                endDate: startEndDate + " " + userEndTime,
            }
            updateDoorTime(this.sn, params).then(res => {
                if (res.data.success) {
                    uni.hideLoading();
                    uni.showToast({
                        title: "修改预约时间成功",
                        icon: "none",
                        duration: 2000,
                    });
                    setTimeout(() => {
                        uni.navigateBack({
                            delta: 1,
                        });
                    }, 1000);
                }
            }).catch(() => {
                uni.hideLoading();
            })
        }
    },
    onLoad: function (options) {
        this.sn = options.sn;
        // 加载上门取件订单详情信息
        this.loadBaseData()
    },
}
</script>

<style lang="scss" scoped>
.container {
    background: #F1F1F1;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 0 0 20rpx;

    .frm-comm {
        margin: 0;

        .txt::after {
            top: 47%;
        }
    }

    .other-reason {
        background: #fff;
        padding: 20rpx;
        margin-top: 10rpx;
    }

}
</style>
