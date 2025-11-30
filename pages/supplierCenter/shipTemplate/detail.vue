<template>
  <view class="container">
    <!-- 模板名称展示 -->
    <view class="info-item">
      <label>模板名称:</label>
      <span>{{ templateName }}</span>
    </view>
    <!-- 计价方式展示 -->
    <view class="info-item">
      <label>计价方式:</label>
      <span>{{ getPricingMethodText() }}</span>
    </view>
    <!-- 详细设置标题 -->
    <view class="section-title">详细设置</view>
    <!-- 表格区域 -->
    <view class="table">
      <view class="table-header">
        <view class="th-area">运送到</view>
        <view class="th">首件</view>
        <view class="th">首费</view>
        <view class="th">续件</view>
        <view class="th">续费</view>
      </view>
      <view class="table-row" v-for="(row, index) in tableData" :key="index">
        <view class="td-area">{{ row.area }}</view>
        <view class="td">{{ row.firstCompany }} kg</view>
        <view class="td">￥{{ row.firstPrice }}</view>
        <view class="td">{{ row.continuedCompany }} kg</view>
        <view class="td">￥{{ row.continuedPrice }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import {getFreightTemplateDetail} from "../../../api/store";

export default {
    name: '',
    data() {
        return {
          id:'',
          templateName: '123',
          pricingMethod: 'weight',
          tableData: [
            {
              area: '河南省,广东省,内蒙古自治区,黑龙江省,新疆维吾尔自治区,湖北省,辽宁省,山东省,陕西省,上海市,贵州省,重庆市,安徽省,福建省,湖南省,海南省,江苏省,青海省,广西壮族自治区,宁夏回族自治区,浙江省,河北省,甘肃省,四川省,天津市,山西省,西藏自治区,吉林省,江西省,北京市,云南省',
              firstItem: 1,
              firstFee: 2,
              continueItem: 1,
              continueFee: 1
            },
            {
              area: '',
              firstItem: 0,
              firstFee: 0,
              continueItem: 0,
              continueFee: 0
            }
          ],
          isSpecifyCity: false
        }
    },
    methods: {
      getPricingMethodText() {
        if (this.pricingMethod === 'WEIGHT') {
          return '按重量';
        } else if (this.pricingMethod === 'NUM') {
          return '按件数';
        } else {
          return '包邮';
        }
      },
      loadData(){
        getFreightTemplateDetail({id:this.id}).then(res=>{
          if (res.data.code == 200){
            let result = res.data.result;
            this.templateName = result.name;
            this.pricingMethod = result.pricingMethod;
            this.tableData = result.freightTemplateChildList;
          }
        })
      }
    },
    onLoad(options){
        this.id = options.id
    },
    onShow(){
      console.log("shoiw")
      this.loadData();
    },

}
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.info-item {
  margin-bottom: 15rpx;
  display: flex;
  align-items: center;
}
.info-item label {
  width: 200rpx;
  font-weight: bold;
}
.section-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-top: 20rpx;
  margin-bottom: 10rpx;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table-header {
  display: flex;
  background-color: #F2F2F2;
}
.th,
.td {
  width: 100rpx;
  padding: 10rpx;
  text-align: center;
  border: 1rpx solid #ccc;
}
.th-area,
.td-area {
  width: 300rpx;
  padding: 10rpx;
  text-align: center;
  border: 1rpx solid #ccc;
}
.table-row {
  display: flex;
}
</style>
