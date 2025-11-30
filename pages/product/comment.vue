<template>
  <view class="comment">
    <view class="top-tab">
      <view class="tab-btn" :v-if="commentDetail">
        <view @tap="select(0)" :class="{ cur: selectIndex == 0 }">全部</view>
        <view @tap="select(1)" :class="{ cur: selectIndex == 1 }">好评{{ commentDetail.good }}</view>
        <view @tap="select(2)" :class="{ cur: selectIndex == 2 }">中评{{ commentDetail.moderate }}</view>
        <view @tap="select(3)" :class="{ cur: selectIndex == 3 }">差评{{ commentDetail.worse }}</view>
        <view @tap="select(4)" :class="{ cur: selectIndex == 4 }">有图{{ commentDetail.haveImage }}</view>
      </view>
    </view>
    <!-- 评价 -->
    <div class="goodsBoxOver">
      <div class="scoll-page">
        <view class="eva-section">
          <div class="empty" v-if="commDetail.length < 1">
            <view>
              <u-empty mode="message" text="暂无评价"></u-empty>
            </view>
          </div>
          <view class="eva-box" v-for="(item, index) in commDetail" :key="index">
            <view class="section-info">
              <u-avatar class="portrait" mode="circle" :src="item.memberProfile || userImage"></u-avatar>
              <view class="star-content">
                <text class="name">{{ item.memberName | noPassByName }}</text>
                <text class="time">{{ item.createTime }}</text>
              </view>
              <view class="stars-box">
                <view class="stars">
                  <view>物流评分：</view>
                  <text
                    :class="{ star: item.deliveryScore > 0.5, starhalf: item.deliveryScore >= 0.5, starnull: item.deliveryScore < 0.5 }"></text>
                  <text
                    :class="{ star: item.deliveryScore > 1.5, starhalf: item.deliveryScore >= 1.5, starnull: item.deliveryScore < 1.5 }"></text>
                  <text
                    :class="{ star: item.deliveryScore > 2.5, starhalf: item.deliveryScore >= 2.5, starnull: item.deliveryScore < 2.5 }"></text>
                  <text
                    :class="{ star: item.deliveryScore > 3.5, starhalf: item.deliveryScore >= 3.5, starnull: item.deliveryScore < 3.5 }"></text>
                  <text
                    :class="{ star: item.deliveryScore > 4.5, starhalf: item.deliveryScore >= 4.5, starnull: item.deliveryScore < 4.5 }"></text>
                </view>
                <view class="stars">
                  <view>描述评分：</view>
                  <text
                    :class="{ star: item.descriptionScore > 0.5, starhalf: item.descriptionScore >= 0.5, starnull: item.descriptionScore < 0.5 }"></text>
                  <text
                    :class="{ star: item.descriptionScore > 1.5, starhalf: item.descriptionScore >= 1.5, starnull: item.descriptionScore < 1.5 }"></text>
                  <text
                    :class="{ star: item.descriptionScore > 2.5, starhalf: item.descriptionScore >= 2.5, starnull: item.descriptionScore < 2.5 }"></text>
                  <text
                    :class="{ star: item.descriptionScore > 3.5, starhalf: item.descriptionScore >= 3.5, starnull: item.descriptionScore < 3.5 }"></text>
                  <text
                    :class="{ star: item.descriptionScore > 4.5, starhalf: item.descriptionScore >= 4.5, starnull: item.descriptionScore < 4.5 }"></text>
                </view>
                <view class="stars">
                  <view>服务评分：</view>
                  <text
                    :class="{ star: item.serviceScore > 0.5, starhalf: item.serviceScore >= 0.5, starnull: item.serviceScore < 0.5 }"></text>
                  <text
                    :class="{ star: item.serviceScore > 1.5, starhalf: item.serviceScore >= 1.5, starnull: item.serviceScore < 1.5 }"></text>
                  <text
                    :class="{ star: item.serviceScore > 2.5, starhalf: item.serviceScore >= 2.5, starnull: item.serviceScore < 2.5 }"></text>
                  <text
                    :class="{ star: item.serviceScore > 3.5, starhalf: item.serviceScore >= 3.5, starnull: item.serviceScore < 3.5 }"></text>
                  <text
                    :class="{ star: item.serviceScore > 4.5, starhalf: item.serviceScore >= 4.5, starnull: item.serviceScore < 4.5 }"></text>
                </view>
              </view>
            </view>
            <view class="section-contant">
              <view class="img">
                <!-- 循环出用户评价的图片 -->
                <view style="width: 100%;margin:26rpx 0">商品规格图片：</view>
                <u-image width="140rpx" height="140rpx" v-if="item.goodsImage"
                  v-for="(img, i) in splitImg(item.goodsImage)" :src="img" :key="i"
                  @tap="preview(splitImg(item.goodsImage), i)">
                </u-image>
              </view>
              <view style="width: 100%;margin:26rpx 0"></view>
              <view style="width: 100%;margin:10rpx 0">用户评价：</view>
              <div class="content">{{ item.content }}</div>
              <view class="img">
                <!-- 循环出用户评价的图片 -->
                <u-image width="140rpx" height="140rpx" v-if="item.images" v-for="(img, i) in splitImg(item.images)"
                  :src="img" :key="i" @tap="preview(splitImg(item.images), i)">
                </u-image>
              </view>
              <view class="bot">
                <text class="attr">{{ item.goodsName }} - {{ gradeList[item.grade] }}</text>
              </view>
            </view>
            <view class="commentStyle" v-if="item.reply">
              商家回复：
              <span class="addCommentSpan">{{ item.reply }}</span>
              <view class="img">
                <!-- 循环出商家回复评价的图片 -->
                <u-image width="140rpx" height="140rpx" v-if="item.replyImage"
                  v-for="(replyImg, replyIndex) in splitImg(item.replyImage)" :src="replyImg" :key="replyIndex"
                  @tap="preview(splitImg(item.replyImage), index)">
                </u-image>
              </view>
            </view>
          </view>
          <u-loadmore bg-color="transparent" style="margin:40rpx 0" :status="status" @loadmore="loadmore()"
            icon-type="iconType" />
        </view>
      </div>
    </div>
  </view>
</template>

<script>
// import { getGoodsDetail } from '@/api/goods.js';
import * as membersApi from "@/api/members.js";
import configs from '@/config/config'
export default {
  data() {
    return {
      configs,
      status: "loadmore", //底部刷新状态
      userImage: configs.defaultUserPhoto,
      commentDetail: "", //评价详情
      selectIndex: "0", //检索条件
      params: {  // 评价分页提交数据
        pageNumber: 1,
        pageSize: 10,
        grade: "",
      },
      gradeList: {
        GOOD: "好评",
        MODERATE: "中评",
        WORSE: "差评",
        HAVEIMAGE: "有图",
      },
      // 评价详情
      commDetail: [],
      dataTotal: 0, //评价的总total数量
      opid: "", //上级传参id
      score: 0,   //控制评价显示星数
    };
  },
  async onLoad(options) {
    this.getGoodsCommentsFun(options.id);
    this.getGoodsCommentsNum(options.id);
    this.opid = options.id;
  },

  /**
   * 触底加载
   */
  onReachBottom() {
    this.params.pageNumber++;
    this.getGoodsCommentsFun(this.opid);
  },

  methods: {
    /**
     * 切割图像
     */
    splitImg(val) {
      if (val && val.split(",")) {
        return val.split(",");
      } else if (val) {
        return val;
      } else {
        return false;
      }
    },

    /**
     * 获取商品评价
     */
    getGoodsCommentsFun(id) {
      this.status = "loading";
      // getGoodsComments
      membersApi.getGoodsComments(id, this.params).then((res) => {
        if (
          res.data.result.records == [] ||
          res.data.result.records == "" ||
          res.data.result.records == null
        ) {
          this.status = "noMore";
          return false;
        }
        this.commDetail = this.commDetail.concat(res.data.result.records);
        this.dataTotal = res.data.result.total;
        if (this.dataTotal == res.data.result.records.length) {
          this.status = "noMore";
        } else {
          this.status = "loadmore";
        }
        let arrStar = []
        this.commDetail.map(item => {
          if (!item.deliveryScore) {
            item.deliveryScore = 5
          }
          if (!item.serviceScore) {
            item.serviceScore = 5
          }
          if (!item.descriptionScore) {
            item.descriptionScore = 5
          }
          item.deliveryScore = parseInt(item.deliveryScore) < item.deliveryScore ? parseInt(item.deliveryScore) + 0.5 : parseInt(item.deliveryScore)
          item.serviceScore = parseInt(item.serviceScore) < item.serviceScore ? parseInt(item.serviceScore) + 0.5 : parseInt(item.serviceScore)
          item.descriptionScore = parseInt(item.descriptionScore) < item.descriptionScore ? parseInt(item.descriptionScore) + 0.5 : parseInt(item.descriptionScore)
          // let starAverage = (item.deliveryScore + item.serviceScore + item.descriptionScore) / 3
          // let intScore = parseInt(starAverage)
          // let flotScore = parseFloat(starAverage.toFixed(1))
          // let intTempScore = intScore == flotScore ? intScore : intScore + 0.5
          // item.score = intTempScore;
          arrStar.push(item)
        })
        this.commDetail = arrStar;
      });
    },

    /**
     * 获取商品评价数
     */
    getGoodsCommentsNum(id) {
      membersApi.getGoodsCommentsCount(id).then((res) => {
        if (res.statusCode === 200) {
          this.commentDetail = res.data.result;
        }
      });
    },

    /**
     * 顶部筛选条件
     */
    select(index) {
      this.selectIndex = index;
      this.params.grade = ["", "GOOD", "MODERATE", "WORSE", ""][
        this.selectIndex
      ];
      this.selectIndex == 4 ? (this.params.haveImage = 1) : true;
      if (this.selectIndex != 4) {
        delete this.params.haveImage
      }
      this.params.pageNumber = 1;
      this.params.pageSize = 10;
      this.commDetail = [];
      if (this.selectIndex == 0) {
        this.params = {
          pageNumber: 1,
          pageSize: 10,
          grade: "",
        };
      }
      // 重新加载评价
      this.getGoodsCommentsFun(this.opid);
    },

    /**
     * 点击图片放大或保存
     */
    preview(urls, index) {
      uni.previewImage({
        current: index,
        urls: urls,
        longPressActions: {
          itemList: ["保存图片"],
          success: function (data) {
            uni.showToast({
              title: "保存成功",
              duration: 2000,
              icon: "none",
            });
          },
          fail: function (err) {
            uni.showToast({
              title: "保存失败",
              duration: 2000,
              icon: "none",
            });
          },
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.commentStyle {
  margin-top: 16rpx;
  padding: 14rpx 26rpx;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 22rpx;
  font-weight: 700;
  text-align: left;
  line-height: 40rpx;
}

.addCommentSpan {
  color: $u-tips-color !important;
  padding-left: 20rpx;
}

.img {
  display: flex;
  flex-wrap: wrap;
  /* height: 140rpx; */
  overflow: hidden;

  image {
    width: 166rpx;
    height: 166rpx;
    margin: 0 15rpx 15rpx 0;

    &:nth-of-type(3n + 0) {
      margin: 0 0 15rpx 0;
    }
  }
}

.goodsBoxOver {
  overflow-y: scroll;
}

page {
  background: #f7f7f7;
}

.comment {
  color: #333;
  background: #f7f7f7;

  overflow: hidden;

  .top-tab {
    background: #fff;
    margin-bottom: 10rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    padding: 0 30rpx 0 30rpx;
    font-size: 24rpx;

    .tab-btn {
      margin-top: 20rpx;
      display: flex;
      flex-wrap: wrap;

      view {
        min-width: 118rpx;
        text-align: center;
        height: 50rpx;
        line-height: 50rpx;
        padding: 0 10rpx;
        background: #f8f8fe;
        border-radius: 25rpx;
        margin: 0 20rpx 30rpx 0;

        &.cur {
          background: $aider-light-color;
          color: #fff;
        }
      }
    }
  }

  .eva-section {
    padding: 20rpx 0;

    .eva-box {
      padding: 40rpx;
      margin-bottom: 10rpx;
      background: #fff;
      border-radius: 20rpx;

      /* star */
      .star-content {
        display: flex;
        flex-direction: column;

        view {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .section-info {
        display: flex;

        .stars-box {
          flex: 1;
          flex-direction: column;
          color: #ff0f0f;

          .stars {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .starhalf {
              width: 30rpx;
              height: 30rpx;
              background: url("/static/star-half.png");
              background-size: 100%;
            }

            .star {
              width: 30rpx;
              height: 30rpx;
              background: url("/static/star-x.png");
              background-size: 100%;
            }

            .starnull {
              width: 30rpx;
              height: 30rpx;
              background: url("/static/star-null.png");
              background-size: 100%;
            }
          }
        }


        .portrait {
          flex-shrink: 0;
          width: 80rpx;
          height: 80rpx;
          border-radius: 100px;
          margin-right: 20rpx;
        }
      }

      .section-contant {
        display: flex;
        flex-direction: column;

        .content {
          font-size: 24rpx;
          line-height: 46rpx;
          font-weight: 400;
          color: $font-color-dark;
          color: #333;
          padding: 26rpx 0;
          word-wrap: break-word;
        }

        .img {
          display: flex;
          flex-wrap: wrap;
          /* height: 140rpx; */
          overflow: hidden;

          >* {
            margin-right: 16rpx;
          }
        }

        .bot {
          display: flex;
          justify-content: space-between;
          font-size: $font-sm;
          color: $font-color-light;
          margin-top: 20rpx;


        }
      }
    }
  }
}

.empty {
  padding-top: 300rpx;
  color: #999999;
  text-align: center;
}
</style>
