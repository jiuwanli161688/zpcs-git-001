<template>
    <view class="container">
        <view class="tab">
            <view
                v-for="(tab, idx) in tabs"
                :key="tab.value"
                :class="{ 'active': params.auditStatus === tab.value }"
                @click="setTab(tab.value)">
              {{ tab.lable }}</view>
        </view>
        <view class="list">
            <view class="item" v-for="item in list">
                <view class="item-tit">
                    <view class="tit-time">{{ item.createTime }}</view>
                    <view v-if="item.auditStatus == 'PENDING'" class="tit-orange">
                        待审核
                    </view>
                    <view v-else-if="item.auditStatus == 'APPROVED'" class="tit-gr">
                        已发布
                    </view>
                    <view v-else class="tit-red">
                        未通过审核
                    </view>
                </view>
                <view class="item-reviewItem">
                    <review-item :key="item.id" :review="item" />
                </view>
                <view class="item-edit" v-if="item.auditStatus == 'REJECTED'">
                    {{ item.rejectionReason }}
                    <view class="icon-edit">
                        <image :src="evaluateEdit" />
                        <view>修改评价</view>
                    </view>
                </view>
            </view>

            <no-data v-if="list.length === 0" />
        </view>
    </view>
</template>
<script>
import NoData from '@/components/no-data.vue';
import ReviewItem from './components/review-item.vue';
import {getCbdEvaluationMemberList} from "../../../api/cbd/evaluate";
export default {
    components: {
        ReviewItem,
        NoData
    },
    data() {
        return {
            evaluateEdit: `/static/cbd/service/evaluate-edit.png`,
            list: [],
            // tabs 切换
            tabs: [
                {
                  lable: '全部',
                  value: '',
                },
                {
                  lable: '待审核',
                  value: 'PENDING',
                },
                {
                  lable: '已发布',
                  value: 'APPROVED',
                },
            ],
            intResTotal: 0,
            // 查询参数
            params: {
              pageNumber: 1,
              pageSize: 10,
              auditStatus: ''
            },
        }
    },
    onLoad() {
      // 加载评价数组
      this.resetQuery()
    },
    methods: {
      setTab(value) {
        this.params.auditStatus = value;
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
        getCbdEvaluationMemberList(this.params).then((res) => {
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
    onReachBottom: function(){
      if(this.intResTotal > this.list.length){
        this.params.pageNumber++
        this.getList()
      }
    }
}

</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: auto;

}

.tab {
    width: 100%;
    height: 88rpx;
    display: flex;
    padding: 0 40rpx;
    justify-content: space-around;
    align-items: center;

    view {
        height: 88rpx;
        line-height: 88rpx;
        flex: 1;
        background-color: transparent;
        text-align: center;
        color: #999999;
        font-weight: 400;
        font-size: 28rpx;
        position: relative;
    }

}

.active {
    font-weight: 700 !important;
    color: #000 !important;
}

.active::after {
    content: "";
    width: 80rpx;
    height: 6rpx;
    background: #FF0101;
    border-radius: 30rpx;
    position: absolute;
    left: calc(50% - 44rpx);
    bottom: 0;
}

.list {
    width: 100%;
    height: auto;
    padding: 10rpx 22rpx 0;
    flex-direction: column;
    flex-wrap: wrap
}

.item {
    width: 100%;
    height: auto;
    background-color: white;
    border-radius: 20rpx;
    padding: 20rpx;
    margin-top: 20rpx;
}

.item-tit {
    font-weight: 400;
    font-size: 24rpx;
    display: flex;
    justify-content: space-between;
    border-bottom: 2rpx solid #EAEAEA;
    padding-bottom: 20rpx;
}

//评论右上角状态处理
.tit-time {
    color: #999999;
}

.tit-orange {
    color: #FE5C3C;
}

.tit-red {
    color: #FF0101;
}

.tit-gr {
    color: #00B01D;
}

.item-reviewItem {
    padding-top: 20rpx;
}

// .item-top {
//     width: 100%;
//     height: 116rpx;
//     padding-top: 20rpx;
//     image {
//         width: 96rpx;
//         height: 96rpx;
//         border-radius: 50%;
//         background-color: red;
//         float: left;
//     }
// }
// .item-top-cen{
//     width:300rpx;
//     height:96rpx;
//     float: left;
//     padding-top: 6rpx;
//     margin-left: 16rpx;
// }
// .item-name{
//     font-weight: 500;
//     font-size: 28rpx;
//     color:#333333;
// }
// .item-address{
//     font-weight: 400;
//     font-size: 24rpx;
//     color: #999999;
// }
// 单独预留img组件区域
.item-top-evaluate {}

.item-span {
    width: 100%;
    background-color: white;
}

.item-edit {
    width: 100%;
    height: 68rpx;
    border-top: 2rpx solid #EAEAEA;
    margin-top: 20rpx;
    line-height: 68rpx;
    color: #FF0101;
    font-weight: 400;
    font-size: 24rpx;
}

.icon-edit {
    float: right;
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999999;

    image {
        width: 26rpx;
        height: 26rpx;
        margin-right: 6rpx;
        border-radius: 10rpx;
    }
}
</style>
