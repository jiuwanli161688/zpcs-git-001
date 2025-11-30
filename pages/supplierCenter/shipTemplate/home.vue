<template>
    <view class="container">
        <view class="wrap">
            <!-- 空数据 -->
            <view class="null" v-if="isComplete && arrData.length == 0"><empty-box text="您目前没有添加运费模板" /></view>
            <!-- 有数据 -->
            <view class="list" v-if="isComplete && arrData.length > 0">
                <view class="item" v-for="(item, index) in arrData" :key="index">
                  <text-link :text="item.name" :link="'/pages/supplierCenter/shipTemplate/detail?id='+item.id" />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import TextLink from "@/components/Hina/TextLink";
import EmptyBox from '@/components/Hina/EmptyBox'
import {getStoreFreightTemplates} from "../../../api/store";
export default {
    name: '',
    components: {
        EmptyBox,
      TextLink
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
          getStoreFreightTemplates().then((res) => {
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

<style lang="scss" scoped>
.container {
  background: #F1F1F1;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 20rpx;

  .logo {
    background: #FFF;
    border-radius: 8rpx;
    height: 500rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .icon {
      width: 280rpx;
      height: 280rpx;
    }

    .text {
      height: 60rpx;
      line-height: 60rpx;
      font-size: 30rpx;
      font-weight: 600;
    }
  }

  .list {
    margin: 20rpx 0 0;
    background: #FFF;
    border-radius: 8rpx;

    .item {
      position: relative;

      &::after {
        position: absolute;
        content: '';
        left: 24rpx;
        right: 24rpx;
        bottom: 0;
        background: #E7E7E7;
        height: 3rpx;
      }

      &:last-of-type {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
