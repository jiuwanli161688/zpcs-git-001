<template>
    <!-- 步骤一 添加商家 -->
    <view class="container">
        <view class="data-information">
            <view class="frm-sign">
                <!-- 门店图片 -->
                <view class="frm-sign-box" style="padding:20rpx 20rpx 20rpx;">
                    <view class="min-photo">
                        <view class="col-12">
                            <view class="rs-file" data-type="company" @tap="handlerUpfile">
                                <image class="icon-company" :src="iconMerchant" mode="aspectFit"
                                    v-if="!fileCompany"> </image>
                                <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany">
                                </image>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 灰色文字 -->
                <view class="frm-sign-box img13" style="background: transparent;margin-top: 16rpx;">
                    <view class="frm-touse" style="padding: 0;">
                        <image :src="iconTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击上传企业营业执照，图片限定2000KB</view>
                    </view>
                </view>
                <!-- 基本信息 -->
                <view class="data-manBody">
                    <view class="frm-comm">
                        <view class="frm-touse" style="padding-bottom: 0;">
                            <view class="frm-touse-text">基本信息</view>
                        </view>
                        <view class="rs rs-line pd-r0">
                            <view class="lab">商家名称</view>
                            <view class="flex text pd-r10">
                                <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                            </view>
                        </view>

                        <view class="rs rs-line">
                            <view class="lab">商号名称</view>
                            <view class="flex">
                                <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                            </view>
                        </view>
                        <view class="rs rs-line ">
                            <view class="lab">统一社会信用代码</view>
                            <view class="txt flex ">
                                <input class="s-text s-texts"
                                 type="text" placeholder="自动识别" disabled />
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">主体类型</view>
                            <view class="flex">
                                <picker mode="selector">
                                    <view class="in-picker "><text class="text-xz">请选择</text></view>
                                </picker>
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">入驻类目</view>
                            <view class="flex">
                                <picker mode="selector">
                                    <view class="in-picker "><text class="text-xz">请选择</text></view>
                                </picker>
                            </view>
                        </view>
                        <view class="rs rs-lines">
                            <view class="lab">营业时间</view>
                            <view class="txt flex">
                                <view class="s-text s-texts" @tap="showPicker"><text class="text-xz">请选择</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                
                <!-- 负责人信息 -->
                <view class="data-responsibleFor">
                    <view class="frm-sign">
                        <view class="frm-touse">
                            <view class="frm-touse-text">负责人信息</view>
                            <image :src="iconRedTips" mode="aspectFit" class="icon"></image>
                            <view class="text">图片限定500KB</view>
                        </view>
                        <view class="min-photo">
                            <view class="col-06">
                                <view class="rs-file" data-type="person-ps" @tap="handlerUpfile">
                                    <view class="re-files">
                                        <view>+</view>
                                        <view>上传人像面</view>
                                    </view>
                                </view>
                            </view>
                            <view class="col-06">
                                <view class="rs-file" data-type="person-dt" @tap="handlerUpfile">
                                    <view class="re-files">
                                        <view>+</view>
                                        <view>上传国徽面</view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <view class="frm-comm">
                            <view class="rs rs-line">
                                <view class="lab">负责人姓名</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-line">
                                <view class="lab">身份证号</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-line">
                                <view class="lab">证件有效期</view>
                                <view class="txts flex">
                                    <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                                </view>
                            </view>
                            <view class="rs rs-lines">
                                <view class="lab">负责人电话</view>
                                <view class="txt flex">
                                    <input class="s-text s-texts" type="text" placeholder="请输入" />
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 地区位置 -->
                <view class="data-region">
                        <view class="frm-touse" style="padding-bottom: 0;">
                            <view class="frm-touse-text">位置信息</view>
                        </view>
                    <view class="frm-comm">
                        <view class="rs rs-line">
                            <view class="lab">隶属区域</view>
                            <view class="txt flex">
                                <view class="s-text s-texts" @tap="showPicker"><text class="text-xz">请选择</text>
                                </view>
                            </view>
                        </view>
                        <view class="rs rs-line">
                            <view class="lab">详细地址</view>
                            <view class="txt flex">
                                <view class="flex txt">
                                    <input class="s-text s-texts" type="text" placeholder="请选择" />
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="data-map">
                        <map :latitude="latitude" :longitude="longitude" :markers="markers" scale="12"
                            style="width: 100%; height: 100%;"></map>
                    </view>
                    <view class="frm-touse" style="padding-bottom:8rpx">
                        <image :src="iconTips" mode="aspectFit" class="icon"></image>
                        <view class="text">点击地图通过地图选点设置您的位置</view>
                    </view>
                </view>
                <!--  确认按钮 -->
                <view class="lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
            </view>
        </view>
        <!-- 城市三级联动模块 -->
        <m-city :provinceData="list" headTitle="区域选择" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="3">
        </m-city>
    </view>
</template>
<script>
export default {
    name: "",
    data() {
        return {
            iconRedTips: `/static/addMerchant.png`,
            iconTips: "/static/cbd/couponRules.png",
            iconLicenseCompany: `/static/cbd/service/icon-document.png`,
            iconMerchant: `/static/cbd/service/icon-merchant.png`,
            fileCompany: '', // 营业执照路径
            latitude: 39.909, // 地图中心纬度（示例：北京）
            longitude: 116.397, // 地图中心经度
            markers: [{ // 地图标记点
                id: 1,
                latitude: 39.909,
                longitude: 116.397,
                title: "天安门",
                iconPath: "/static/location.png" // 自定义标记图标
            }
            ],
            adCodeData: [],  //省市区信息
            list: [
                {
                    id: '',
                    localName: '请选择',
                    children: []
                }
            ],
            adCodeData: [],  //省市区信息
            headTitleName: '',//三级联动标题
        }
    },
    props: {
    },
    methods: {
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
            this.$refs.cityPicker.show();
        }
    }

}
</script>
<style lang="scss" scoped>
.container {
    background: #f8f8f8;
    height: calc(100vh - 88rpx);
    box-sizing: border-box;
    padding:0 20rpx 20rpx;
    position: relative;
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

.frm-touse-text~.icon~.text {
    font-size: 20rpx;
    font-weight: 400;
    color: #FF0101;
    line-height: 46rpx;
}

.rs-line {
    margin: 0;
    padding: 0;
}
.img13 .icon{
    width: 26rpx;
    height: 26rpx;
    margin: 6rpx 12rpx 0 0;
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
    height: 22rpx;
    margin: 12rpx 8rpx 0 16rpx;
}

.frm-touse-text~.icon~.text {
    font-size: 20rpx;
    font-weight: 400;
    color: #FF0101;
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
// 筛选框
.frm-comm .rs .txt .in-picker{
    padding-right: 24rpx;
}
//多选框里面的文本
.in-picker .text-xz{
    font-size: 24rpx;
    padding-right: 4rpx;
    color: #999999;
}


.frm-comm .rs .flex .s-text {
    font-size: 24rpx;
    font-weight: 400;
    color:#999999 ;
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
    margin-top: 20rpx;
    padding: 0rpx 20rpx 0;
    background-color: white;
    border-radius: 20rpx;
}

.data-manBody-box {
    width: 100%;
    height: 74rpx;
    background-color: white;
    position: relative;
    border-bottom: 1px solid #F3F3F3;
}

.rs-lines {
    padding: 0 0rpx;
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

// 负责人正反纯色背景图
.rs-file {
    border-radius: 20rpx;
}

.re-files {
    width: 100%;
    height: 100%;

    view {
        text-align: center;
        color: #666666;
    }

    view:nth-child(1) {
        width: 100%;
        height: auto;
        font-weight: 100;
        font-size: 80rpx;
    }

    view:nth-child(2) {
        font-size: 28rpx;
        font-weight: 500;
    }
}

.responsibleFor-inp {
    margin-top: 20rpx;
}

.data-responsibleFor .responsibleFor-inp {
    margin-top: 0;
}

.data-merchant {
    width: 100%;
    height: auto;
    background-color: white;
    border-radius: 16rpx;
    padding: 0 20rpx 20rpx;
}

.data-region {
    width: 100%;
    height: auto;
    border-radius: 16rpx;
    background-color: white;
    margin-top: 30rpx;
    padding: 0 20rpx;
}

.data-map {
    width: 100%;
    height: 292rpx;
    margin: 20rpx 0 0;
    border-radius: 20rpx;
}

.data-map~.frm-touse {
    padding: 10rpx 0 0rpx 0;

    .icon {
        width: 26rpx;
        height: 26rpx;
        margin: 8rpx 12rpx 0 0;
    }
}

.lnk-common {
    margin: 60rpx 0 0 0;
}


.dpF {
    display: flex;
    justify-content: right;
    align-items: center;
}

.text10 {
    color: #999999;
}

.prices {
    font-size: 24rpx;
    font-weight: 700;
    color: #FD0E00;
    padding-left: 6rpx;
}
.rs-line {
    margin: 0;
    padding: 0;
}
.s-texts{
    padding-right: 20rpx !important;
}
//没有右侧箭头的文字靠右样式
.s-textss {
    padding-right: 0rpx !important;
}
//有右侧箭头的靠右样式
// .s-text-pd{
//     padding-right: 20rpx !important;
// }

.container .txt::after {
    position: absolute;
    content: "";
    width: 12rpx;
    height: 12rpx;
    border: 4rpx solid #d6d6d6;
    border-left: none;
    border-bottom: none;
    right: 10rpx;
    top: 47%;
    -webkit-transform: rotate(45deg) translateY(-45%);
    transform: rotate(45deg) translateY(-45%);
}
</style>