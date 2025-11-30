<template>
    <view class="container">
        <view class="wrap">
            <!-- 空数据 -->
            <view class="null" v-if="isComplete && arrData.length == 0"><empty-box text="您目前没有添加退件地址" /></view>
            <!-- 有数据 -->
            <view class="list" v-if="isComplete && arrData.length > 0">
                <view class="item" :class="{ item_hov: item.move }" v-for="(item, index) in arrData" :key="index"
                    :data-index="index" @touchstart="bindTouchStart" @touchmove="bindTouchMove">
                    <view class="bd">
                        <address-item :index="index" :address="item" @update="handlerUpdate" @del="handlerDelete"
                            @selAddress="handlerSelAddress" :isSel="isSel" />
                    </view>
                    <view class="ft">
                        <view @tap.stop="handlerDelete({ code: item.id, index: index })" :data-code="item.id"
                            :data-index="index" class="link">删除</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="fixed-link">
            <view class="btn" @tap="handlerInsert">添加退件地址</view>
        </view>
    </view>
</template>

<script>
import EmptyBox from '@/components/Hina/EmptyBox'
import AddressItem from 'components/Hina/AddressItem'
import * as API_Address from '@/api/address.js'
import { deleteStoreAddressDetail, getStoreAddressList } from "../../../api/store";
export default {
    name: '',
    components: {
        AddressItem,
        EmptyBox
    },
    data() {
        return {
            isComplete: false,
            arrData: [],
            startX: 0, //开始坐标
            startY: 0,
            params: {
                pageNumber: 1,
                pageSize: 10
            },
            intResTotal: 0,
            isSel: false, // 是否是跳转过来选择地址的。默认是false
            sn: '', // 订单sn
        }
    },
    methods: {
        // 删除常用地址
        handlerDelete: function (e) {
            uni.showModal({
                title: "谨慎操作",
                content: "您确定要删除当前收货地址吗？",
                confirmText: "确定",
                confirmColor: "#FF0000",
                cancelText: "取消",
                success: (res) => {
                    if (res.confirm) {
                        let eCode = e.code
                        let eIndex = e.index
                        deleteStoreAddressDetail(eCode).then((res) => {
                            if (res.statusCode == 200) {
                                this.arrData.splice(eIndex, 1)
                                uni.showToast({
                                    icon: 'none',
                                    title: '删除成功'
                                })
                                this.loadBaseData()
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


        // 修改常用地址
        handlerUpdate: function (e) {
            uni.navigateTo({
                url: `/pages/supplierCenter/address/update?data=` + JSON.stringify(this.arrData[e.index])
            })
        },
        // 选择地址
        handlerSelAddress(e) {
            let eCode = e.code
            let pages = getCurrentPages() // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
            let prevPage = pages[pages.length - 2] //上一页页面实例
            uni.navigateBack({
                delta: 1,
                success: () => {
                    prevPage.$vm.loadAddressDetailFun(eCode) // 给上一页绑定方法otherFun,传参地址id
                }
            })
        },

        // 添加常用地址
        handlerInsert: function () {
            uni.navigateTo({
                url: '/pages/supplierCenter/address/insert'
            })
        },

        bindTouchStart: function (e) {
            let _this = this
            let eIndex = e.currentTarget.dataset.index
            //开始触摸时 重置所有删除
            for (let i = 0; i < _this.arrData.length; i++) {
                if (eIndex != i && _this.arrData[i].move) {
                    _this.arrData[i].move = false
                }
            }
            _this.startX = e.changedTouches[0].clientX
            _this.startY = e.changedTouches[0].clientY
        },

        bindTouchMove: function (e) {
            let _this = this
            let index = e.currentTarget.dataset.index
            let touchMoveX = e.changedTouches[0].clientX //滑动变化坐标
            let touchMoveY = e.changedTouches[0].clientY //滑动变化坐标
            //获取滑动角度
            let angle = _this.angle({ X: _this.startX, Y: _this.startY }, { X: touchMoveX, Y: touchMoveY })
            let touchFlag = false

            for (let i = 0; i < _this.arrData.length; i++) {
                _this.arrData[i].move = touchFlag
                if (Math.abs(angle) > 30) return
                if (i == index) {
                    if (touchMoveX > _this.startX) {
                        _this.arrData[i].move = false
                    } else {
                        _this.arrData[i].move = true
                    }
                }
            }
        },

        angle: function (start, end) {
            let _X = end.X - start.X
            let _Y = end.Y - start.Y
            //返回角度 /Math.atan()返回数字的反正切值
            return (360 * Math.atan(_Y / _X)) / (2 * Math.PI)
        },

        // 加载初始数据
        loadBaseData: function () {
            uni.showLoading()
            this.arrData = []
            getStoreAddressList().then((res) => {
                if (this.$store.state.isShowToast) {
                    uni.hideLoading()
                }
                if (res.data.code == 200) {
                    this.isComplete = true
                    // res.data.result.forEach((item) => {
                    //     item.consigneeAddressPath = item.consigneeAddressPath.split(',')
                    // })
                    let data = res.data.result;
                    if (data.length > 0) {
                        this.arrData.push(...data);
                    }
                    this.intResTotal = res.data.result.total

                }
            })
        }
    },
    onLoad: function (options) {
        this.isSel = options.isSel
        if (options.sn) {
            this.sn = options.sn
        }
    },
    onShow: function () {
        this.arrData = []
        // 加载初始数据
        this.loadBaseData()
    },
    onReachBottom: function () {
        if (this.intResTotal > this.arrData.length) {
            this.params.pageNumber++
            this.loadBaseData()
        }
    }
}
</script>

<style scoped>
.container {
    background: #F1F1F1;
    min-height: 100vh;
    box-sizing: border-box;
}

.wrap {
    padding: 24rpx;
}

.null {
    background: #fff;
    border-radius: 16rpx;
    box-shadow: 0 0 16rpx rgba(0, 0, 0, 0.03);
}

.list {
    margin-bottom: 200rpx;
}

.list>.item {
    background: #fff;
    position: relative;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
}

.list>.item::after {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    bottom: 0;
    height: 3rpx;
    background: #e7e7e7;
}

.list>.item:first-of-type {
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
}

.list>.item:last-of-type {
    border-bottom-left-radius: 16rpx;
    border-bottom-right-radius: 16rpx;
}

.list>.item:last-of-type::after {
    display: none;
}

.list>.item>.bd {
    width: calc(100vw - 48rpx);
    box-sizing: border-box;
    margin-left: -140rpx;
    -webkit-transition: all 0.4s;
    transition: all 0.4s;
    -webkit-transform: translateX(140rpx);
    transform: translateX(140rpx);
}

.list>.item>.ft {
    width: 140rpx;
    background: #ff8432;
    font-size: 26rpx;
    display: flex;
    justify-content: center;
    -webkit-transform: translateX(140rpx);
    transform: translateX(140rpx);
    -webkit-transition: all 0.4s;
    transition: all 0.4s;
}

.list>.item>.ft>.link {
    background: #ff3232;
    color: #fff;
    flex: 1;
    text-align: center;
    line-height: 140rpx;
}

.list>.item_hov>.bd,
.list>.item_hov>.ft {
    -webkit-transform: translateX(0);
    transform: translateX(0);
}

.fixed-link {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding-top: 24rpx;
    padding-left: 24rpx;
    padding-right: 24rpx;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 24rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
}

.fixed-link::after {
    position: absolute;
    content: '';
    left: 0;
    right: 0;
    top: 0;
    height: 3rpx;
    background: rgba(231, 231, 231, 1);
}

.fixed-link>.btn {
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 88rpx;
    color: #fff;
    text-align: center;
    font-size: 28rpx;
    background: linear-gradient(270deg, #e22221 0%, #e22221 100%);
}
</style>
