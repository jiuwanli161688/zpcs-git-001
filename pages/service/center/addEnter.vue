<template>
  <view class="container">
    <!-- 头部 -->
    <view class="head-top">
      <view class="head-top-y">
        <view class="head-top-num" :class="{ 'head-top-numr': progress1 }">1</view>
        <view>录入商家资料</view>
        <view class="head-top-h" :class="{ 'head-top-hr': progress1 }"></view>
      </view>
      <view class="head-top-y">
        <view class="head-top-num" :class="{ 'head-top-numr': progress2 }">2</view>
        <view>录入结算信息</view>
        <view class="head-top-h" :class="{ 'head-top-hr': progress2 }"></view>
      </view>
      <view class="head-top-y">
        <view class="head-top-num" :class="{ 'head-top-numr': progress3 }">3</view>
        <view>平台审核资质</view>
        <view class="head-top-h" :class="{ 'head-top-hr': progress3 }"></view>
      </view>
      <view class="head-top-y">
        <view class="head-top-num" :class="{ 'head-top-numr': progress4 }">4</view>
        <view>商家线上签约</view>
      </view>
    </view>
    <view class="cen-tab">
      <!-- 进度一 -->
      <view class="cen-data" v-if="progressStatus === 1">
        <add-data :objData="objData" @objdataUpdate="objdataUpdate" ></add-data>
      </view>
      <!-- 进度二 -->
      <view class="cen-enter" v-else-if="progressStatus === 2">
        <!-- 结算账户类型 -->
        <AddSettlement />
      </view>
      <!-- 进度三 -->
      <view class="cen-platform" v-else-if="progressStatus === 3">
        <add-review />
      </view>
      <!-- 进度四 -->
      <view class="cen-sign" v-else-if="progressStatus === 4">
        <review-status />
      </view>
    </view>
  </view>
</template>

<script>
import AddData from './components/add-data.vue'
import AddSettlement from './components/add-settlement.vue'
import AddReview from './components/add-review.vue'
import ReviewStatus from './components/review-status.vue'
import ykAuthpup from '@/components/yk-authpup/yk-authpup'
import UCheckbox from '../../../uview-ui/components/u-checkbox/u-checkbox.vue'
export default {
  name: '',
  components: {
    UCheckbox,
    ykAuthpup,
    AddData,
    AddSettlement,
    AddReview,
    ReviewStatus,
  },
  computed: {
  },
  data() {
    return {
      songType: '',//判断基础信息是个人还是公司在选择银行卡界面公司只能是公司，个人可以二选一
      source: 'new',
      isComplete: false,
      submitting: false,
      arrTheme: ['主体类型a', '主体类型b', '主体类型c'], //模块1，主体类型s
      electedIndex: -1, // 选中的索引（-1 表示未选择）
      selectedValue: '', // 选中的值
      name: '',

      objData: {
        licencePhoto: '',//营业执照路径
        storeName: '',//主体名称
        subjectType: '',//主体类型
        merchantName: '',//商号名称
        licenseNum: '',//统一社会信用代码 √
        industryId: '',//入驻类目
        businessTime: '',//营业开始时间
        businessEndTime: '',//营业结束时间
        legalName: '',//法人姓名
        legalPhoto: '',//身份证正面
        legalPhotoBack: '',//身份证反面
        legalId: '',//身份证号
        legalPhone: '',//手机号
        legaData: '',//身份证有效期
        cbdStorePhoto: '',//门店照片
        workAddressPath: '',//办公地址省市区
        workAddressDetail: '',//办公地址详情
      },
      ManStatus: 0,//判断用户是个人还是公司
      curSelTaxQualiIndex: 0,
      curSelTaxQualiLabel: '',
      objZP: {}, //用户信息
      progress1: true, //管理进度球
      progress2: false,
      progress3: false,
      progress4: false,
      progressStatus: 1, //1第一步,2第二步,3第三步,4第四步 商家注册页面状态
    }
  },
  methods: {
    // 更新第一步的数据
    objdataUpdate(e){

    },
    accountChange(e) {
      this.accountStatus = e.detail.value
    },
    //选择信息事件
    selectEdit(e) { },

    // 提交资料
    handlerSubmit: function () { },

    // 用户相册授权权限后的回调
    changeAuth() {
      // 这里是权限通过后执行自己的代码逻辑
      console.log('权限已授权，可执行自己的代码逻辑了')
    },
    // 三级地址联动回调
    getpickerParentValue(e) {
      // 将需要绑定的地址设置为空，并赋值
      let name = ''
      this.adCodeData = []
      let regionId = []
      e.forEach((item, index) => {
        if (item.id) {
          name += item.localName + '/'
          this.adCodeData.push(item.adCode)
          regionId.push(item.id)
        }
        if (index == e.length - 1) {
          name = name.substring(0, name.length - 1)
          this.form.regionId = regionId.join(',')
          this.$set(this.form, 'regionPath', name)
          this.form.provinceCode = this.adCodeData[0]
          this.form.cityCode = this.adCodeData[1]
          this.form.districtCode = this.adCodeData[2]
        }
      })
    },
    // 显示三级地址联动
    showPicker() {
      console.log(this.$refs)
      this.$refs.cityPicker.show()
    },
    //上传文件事件
    handlerUpfile() { },
  },
  onLoad: function (options) { },
  onShow: function () { },
  onLaunch() {
    getCurrentLocation()
  },
}
</script>

<style lang="scss" scoped>
//取消边框
.bor-none {
  border: none !important;
}

.bg-white {
  background-color: white;
}

.pading-tow {
  padding: 0 20rpx;
}

//取消下边距
.mbot-none {
  margin-bottom: 0;
}

//取消上边距
.mtop-none {
  margin-top: 0;
}

.f-d {
  flex-direction: column;
}

.container {
  background: #f8f8f8;
  height: calc(100vh - 88rpx);
  box-sizing: border-box;
  padding: 20rpx;
  position: relative;
}

.head-top {
  width: 100%;
  height: 84rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cen-tab {
  width: 100%;
  height: auto;
}

.head-top-y {
  width: 124rpx;
  height: 84rpx;
  position: relative;
}

.head-top-h {
  position: absolute;
  top: 24rpx;
  right: -80rpx;
  width: 86rpx;
  height: 2rpx;
  background: #ffcbcb;
  border-radius: 20rpx;
}

.head-top-num {
  width: 49rpx;
  height: 49rpx;
  background-color: #ffcbcb;
  text-align: center;
  line-height: 49rpx;
  color: white;
  margin: 0 auto;
  border-radius: 50%;
}

.head-top-y>view:nth-child(2) {
  width: 100%;
  height: 28rpx;
  font-weight: 400;
  font-size: 20rpx;
  color: #333333;
}

.head-top-numr {
  background-color: red !important;
}

.head-top-hr {
  background: linear-gradient(269deg, #ffffff 0%, #ff0101 99%) !important;
}

// 添加textarea样式，支持自动换行
.s-textarea {
  min-height: 88rpx !important;
  height: auto !important;
  line-height: 1.5 !important;
  padding: 20rpx 0 !important;
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: pre-wrap !important;
  resize: none !important;
}

.rs-line {
  .s-textarea {
    border: none !important;
    outline: none !important;
    background: transparent !important;
  }

  // 当包含textarea时，调整容器样式
  &:has(.s-textarea) {
    min-height: 88rpx !important;
    height: auto !important;
    align-items: flex-start !important;
    padding-bottom: 20rpx !important;
  }
}

// 为包含textarea的rs-line添加特殊样式
.rs-line.has-textarea {
  min-height: 88rpx !important;
  height: auto !important;
  align-items: flex-start !important;
  // padding-bottom: 30rpx !important;
  // margin-bottom: 20rpx !important;

  // 调整分割线位置，确保在内容下方
  &::after {
    bottom: 0 !important;
    top: auto !important;
  }

  // 调整textarea的底部间距
  .s-textarea {
    padding-bottom: 10rpx !important;
  }
}

.rs-line {
  margin: 0;
  padding: 0;
}

.frm-sign-box {
  width: 100%;
  height: auto;
  background-color: white;
  border-radius: 16rpx;
  margin-top: 40rpx;
}

.frm-touse-text {
  font-size: 28rpx;
  font-weight: 700;
  color: #333333;
}

.frm-touse-text~.icon {
  width: 20rpx;
  height: 20rpx;
  margin: 14rpx 8rpx 0 16rpx;
}

.frm-touse-text~.icon~.text {
  font-size: 20rpx;
  font-weight: 400;
  color: #ff0101;
  line-height: 46rpx;
}

.rs-file {
  background: #f3f5f9;
}

.min-photo .icon-company {
  width: 294rpx;
  height: 184rpx;
}

.container .lab {
  font-size: 24rpx;
  font-weight: 400;
  color: #333333;
}

.frm-comm .rs .flex .s-text {
  font-size: 24rpx;
  font-weight: 400;
}

.frm-comm .rs .lab {
  width: 200rpx;
}

.frm-comm .rs .txt {
  width: calc(100vw - 200rpx - 40rpx - 40rpx);
}

.frm-comm .rs .labs {
  width: 200rpx;
}

.frm-comm .rs .txts {
  width: calc(100vw - 200rpx - 40rpx - 40rpx);
}

.data-manBody {
  width: 100%;
  height: auto;
  margin-top: 30rpx;
  padding: 0rpx 20rpx 0;
  background-color: white;
  border-radius: 20rpx;
}

.data-manBody-box {
  width: 100%;
  height: 74rpx;
  background-color: white;
  position: relative;
  border-bottom: 1px solid #f3f3f3;
}

.rs-lines {
  padding: 0 0rpx;
}

.fs-12 {
  font-weight: 24rpx;
  font-weight: 400;
}

.txt::after {
  position: absolute;
  content: '';
  width: 12rpx;
  height: 12rpx;
  border: 4rpx solid #d6d6d6;
  border-left: none;
  border-bottom: none;
  right: -20rpx;
  top: 48%;
  -webkit-transform: rotate(45deg) translateY(-45%);
  transform: rotate(45deg) translateY(-45%);
}

.data-manBody-box>view {
  line-height: 74rpx;
  font-weight: 400;
  font-size: 24rpx;
  color: #333333;

  // 统一高度
  .text,
  .view {
    display: block;
    width: 64%;
    background-color: white;
    float: right;
    margin-right: 22rpx;
    text-align: right;
    font-weight: 400;
    font-size: 24rpx;
    color: #999999;
    position: relative;
  }

  .text {
    height: 100%;
    border: none;
    margin-top: 16rpx;
  }

  .view {
    height: 72rpx;
  }

  .views {
    color: #333333;
  }
}

.data-responsibleFor {
  width: 100%;
  height: auto;
  padding: 0 20rpx 0;
  background-color: white;
  border-radius: 16rpx;
  margin-top: 30rpx;
}

.data-responsibleFor .responsibleFor-inp {
  margin-top: 0;
}

.responsibleFor-inp {
  margin-top: 20rpx;
}


//进度二
.cen-enter {
  width: 100%;
  height: auto;
}

.cen-enter .frm-touse {
  margin-top: 30rpx;
}

//进度三
.cen-platform {
  width: 100%;
  height: 362rpx;
  margin-top: 40rpx;
  background-color: white;
  border-radius: 20rpx;
  padding-top: 60rpx;

  .cen-platform-img {
    width: 100%;
    height: 112rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 112rpx;
      height: 112rpx;
    }
  }
}

//进度四
.cen-sign {
  width: 100%;
  height: auto;
  margin-top: 40rpx;
  background-color: white;
  border-radius: 20rpx;
  padding-top: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
