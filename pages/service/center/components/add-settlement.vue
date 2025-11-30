<template>
    <view class="container">
        <!-- 步骤二 结算账户 -->
         <view v-show="accountStatus != 4" class="data-manBody-box bg-white pading-tow bor-none m-top15">
                    <view @tap="selectEdit" class="viser">
                        <label>结算账户类型</label>
                        <view class="view txt">
                            <picker mode="selector" :range="arrAccount" @change="accountChange">
                                <view><text class="text-xz" style="padding-right:10rpx;">请选择</text></view>
                            </picker>
                        </view>
                    </view>
                </view>
                <!-- 个人开户 -->
                <view class="" v-show="accountStatus == 1">
                    <view class="frm-sign  cen-enter-upload pading-tow bg-white m-top15">
                        <view class="frm-touse f-d">
                            <view class="frm-touse-text">
                                上传储蓄卡照片
                            </view>
                            <view class="text" style="font-size: 18rpx;font-weight: 400;">请上传本人银行卡作为结算银行卡，</view>
                        </view>

                        <view class="min-photo">
                            <view class="col-12">
                                <view class="rs-file" data-type="company" @tap="handlerUpfile">
                                    <image class="icon-company" :src="iconEnterprise" mode="aspectFit"
                                        v-if="!fileCompany">
                                    </image>
                                    <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany">
                                    </image>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 录入结算账户-->
                    <view class="addAccount">
                        <view class="frm-sign-box">
                            <view class="frm-touse" style="padding-left:20rpx;">
                                <view class="frm-touse-text">录入结算账户</view>
                            </view>
                            <view class="addAccount-cen">
                                <view class="frm-comm">
                                    <view class="rs rs-line">
                                        <view class="lab">开户银行</view>
                                        <view class="txts flex">
                                            <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">银行卡号</view>
                                        <view class="txts flex">
                                            <input class="s-text s-textss" type="text" placeholder="自动识别" disabled />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">户名</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="请输入" />
                                        </view>
                                    </view>
                                    <view class="rs rs-lines">
                                        <view class="lab">银行预留手机号</view>
                                        <view class="flex txts txt">
                                            <input class="s-text" type="text" placeholder="请输入" />
                                        </view>
                                    </view>
                                </view>
                            </view>

                        </view>
                    </view>

                    <!-- 确认按钮 -->
                    <view class="lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
                </view>
                <!-- 企业开户 -->
                <view class="" v-show="accountStatus == 2">
                    <view class="frm-sign  cen-enter-upload pading-tow bg-white m-top15">
                        <view class="frm-touse f-d">
                            <view class="frm-touse-text">
                                上传基本存款信息或开户许可证
                            </view>
                            <view class="text" style="font-size: 18rpx;font-weight: 400;">仅用于企业对公账户认证，要求图片内容完整，图片清晰
                            </view>
                        </view>

                        <view class="min-photo">
                            <view class="col-12">
                                <view class="rs-file" data-type="company" @tap="handlerUpfile">
                                    <image class="icon-company" :src="iconnIndividual" mode="aspectFit"
                                        v-if="!fileCompany">
                                    </image>
                                    <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany">
                                    </image>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 录入结算账户 -->
                    <view class="addAccount">
                        <view class="frm-sign-box">
                            <view class="frm-touse" style="padding-left:20rpx;">
                                <view class="frm-touse-text">录入结算账户</view>
                            </view>
                            <view class="addAccount-cen">
                                <view class="frm-comm">
                                    <view class="rs rs-line">
                                        <view class="lab">户名</view>
                                        <view class="txts flex">
                                            <input class="s-text s-textss" type="text" placeholder="回显上一步营业执照的名称"
                                                disabled />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">账号</view>
                                        <view class="txts flex">
                                            <input class="s-text s-textss" type="text" placeholder="自动识别可修改" />
                                        </view>
                                    </view>
                                    <view class="rs rs-lines">
                                        <view class="lab">开户行</view>
                                        <view class="txt flex">
                                            <picker mode="selector">
                                                <view class="in-picker "><text class="text-xz">请选择</text></view>
                                            </picker>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 确认按钮 -->
                    <view class="lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
                </view>
                <!-- 用户填写完成页面 -->
                <view class="cen-verification" v-show="accountStatus == 3">
                    <!-- 上传基本存款信息或开户许可证 -->
                    <view class="frm-sign  cen-enter-upload pading-tow bg-white m-top15">
                        <view class="frm-touse f-d">
                            <view class="frm-touse-text">
                                上传基本存款信息或开户许可证
                            </view>
                            <view class="text" style="font-size: 18rpx;font-weight: 400;">仅用于企业对公账户认证，要求图片内容完整，图片清晰
                            </view>
                        </view>

                        <view class="min-photo">
                            <view class="col-12">
                                <view class="rs-file" data-type="company" @tap="handlerUpfile">
                                    <image class="icon-company" :src="iconMerchant" mode="aspectFit"
                                        v-if="!fileCompany">
                                    </image>
                                    <image class="file-company" :src="fileCompany" mode="aspectFit" v-if="fileCompany">
                                    </image>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 录入结算账户 -->
                    <view class="addAccount">
                        <view class="frm-sign-box">
                            <view class="frm-touse" style="padding-left:20rpx;">
                                <view class="frm-touse-text">录入结算账户</view>
                            </view>

                            <view class="addAccount-cen">
                                <view class="frm-comm">
                                    <view class="rs rs-line">
                                        <view class="lab">户名</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="回显上一步营业执照的名称" disabled />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">账号</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="自动识别可修改" />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">联行号</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="自动识别可修改" />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">银行名称</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="自动识别可修改" />
                                        </view>
                                    </view>
                                    <view class="rs rs-lines">
                                        <view class="lab">开户行</view>
                                        <view class="txt flex">
                                            <picker mode="selector">
                                                <view class="in-picker "><text class="text-xz">请选择</text></view>
                                            </picker>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 确认按钮 -->
                    <view class="m-tops lnk-common lnk-primary" @tap="handlerSubmit">下一步</view>
                </view>
                <!-- 第四种 -->
                <view class="cen-verification" v-show="accountStatus == 4">
                    <view class="cen-title">
                        <view class="c">待对公账户验真</view>
                        <text>通过企业对公银行账户转账指定金额验证身份，请在2025年11月23日02:35:45前完成操作，否则会导致认证失败。</text>
                    </view>

                    <view class="addAccount">
                        <view class="frm-sign-box">

                            <view class="frm-touse" style="padding-left:20rpx;">
                                <view class="frm-touse-text">企业对公账户</view>
                            </view>
                        </view>
                        <view class="addAccount-cen">
                            <view class="frm-comm">
                                <view class="rs rs-line">
                                    <view class="lab">户名</view>
                                    <view class="txt flex">
                                        <input class="s-text" type="text" placeholder="北京维度商贸有限公司" disabled />
                                    </view>
                                </view>
                                <view class="rs rs-line">
                                    <view class="lab">账号</view>
                                    <view class="txt flex">
                                        <input class="s-text" type="text" placeholder="4737429789 9388 3799" />
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="addAccount">
                        <view class="frm-sign-box">
                            <view class="frm-touse" style="padding-left:20rpx;">
                                <view class="frm-touse-text">中品维度账户</view>
                            </view>


                            <view class="addAccount-cen">
                                <view class="frm-comm">
                                    <view class="rs rs-line">
                                        <view class="lab">户名</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="北京维度商贸有限公司" disabled />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">账号</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="4737429789 9388 3799" />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">联行号</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="8889283923" />
                                        </view>
                                    </view>
                                    <view class="rs rs-line">
                                        <view class="lab">开户行</view>
                                        <view class="txt flex">
                                            <input class="s-text" type="text" placeholder="南阳路支行" />
                                        </view>
                                    </view>
                                    <view class="rs rs-lines">
                                        <view class="lab">金额</view>
                                        <view class="flex">
                                            <!-- <input class="s-text s-text" type="text" placeholder="验真结東后全额返还" /> -->
                                            <view class="s-texts dpF">
                                                <text class="text10" style="font-style: 20rpx;">验真结東后全额返还</text>
                                                <text class="prices">￥0.38</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 确认按钮 -->
                    <view class="m-tops lnk-common lnk-primary" @tap="handlerSubmit">我以转账，尽快核验</view>

                </view>

    </view>
</template>
<script>
export default {
    data(){
        return{
            accountStatus: 0,//0未选择,1个体,2企业，3用户填写信息完毕之后的页面
            arrAccount: ['请选择', '个体', '企业'],//
            iconnIndividual: `/static/cbd/service/icon-individual.png`,
            iconEnterprise: `/static/cbd/service/icon-enterprise.png`,
            iconMerchant: `/static/cbd/service/icon-merchant.png`,
            fileCompany: '', // 营业执照路径
        }
    },
    methods: {
        
        accountChange(e) {
            this.accountStatus = e.detail.value;
        },
        //选择信息事件
        selectEdit(e) { },
    }

}
</script>
<style scoped lang="scss">

.container {
    background: #f8f8f8;
    height: calc(100vh - 88rpx);
    box-sizing: border-box;
    padding: 20rpx;
    position: relative;
}

.cen-enter {
    width: 100%;
    height: auto;
}

.cen-enter .frm-touse {
    margin-top: 30rpx;
}

.cen-enter-upload {
    padding-bottom: 20rpx;
    border-radius: 20rpx;
    background-color: white;
}


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
    background: #FFCBCB;
    border-radius: 20rpx;
}

.head-top-num {
    width: 49rpx;
    height: 49rpx;
    background-color: #FFCBCB;
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
    background: linear-gradient(269deg, #FFFFFF 0%, #FF0101 99%) !important;
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

.frm-comm .rs .flex .s-text {
    font-size: 24rpx;
    font-weight: 400;
    padding-right:24rpx;
}

.frm-comm .rs .lab {
    width: 200rpx;
}

.frm-comm .rs .txt {
    width: calc(100vw - 200rpx - 40rpx - 40rpx);
}

.frm-comm .rs .labs {
    width: 240rpx;
}

.frm-comm .rs .txts {
    width: calc(100vw - 200rpx - 40rpx - 40rpx - 40rpx);
}

.addAccount-cen .rs-line {
    padding: 0 20rpx;
}

.addAccount-cen .rs-lines {
    padding: 0 20rpx;
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
    border-radius: 20rpx;
    background-color: white;
    position: relative;
    border-bottom: 1px solid #F3F3F3;
}

.rs-lines {
    padding: 0 0rpx;
}

.fs-12 {
    font-weight: 24rpx;
    font-weight: 400;
}
.viser .txt::after{
    right: -10rpx !important;
}
.txt::after {
    position: absolute;
    content: "";
    width: 12rpx;
    height: 12rpx;
    border: 4rpx solid #d6d6d6;
    border-left: none;
    border-bottom: none;
    right: 10rpx !important;
    top: 48% !important;
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
    margin: 170rpx 0 0 0;
}

.m-top15 {
    margin-top: 30rpx;
}

.cen-enter {
    width: 100%;
    height: auto;
}

.cen-enter .frm-touse {
    margin-top: 30rpx;
}

.cen-enter-upload {
    padding-bottom: 20rpx;
    border-radius: 20rpx;
    background-color: white;
}

.addAccount {
    width: 100%;
    height: auto;
    background: white;
    border-radius: 20rpx;
}

.addAccount .frm-touse {
    display: flex;
    padding: 20rpx 0;
}

.addAccount .frm-sign-box {
    padding-bottom: 0rpx;
}

.cen-verification {
    width: 100%;
    height: auto;
    // padding: 0 20rpx;
    margin-top: 20rpx;
}

.m-tops {
    margin: 116rpx 0 0 0;
}

.cen-title {
    width: 100%;
    height: auto;
    margin-bottom: 40rpx;

    view {
        font-weight: 700;
        font-size: 32rpx;
        margin-bottom: 20rpx;
    }

    text {
        display: inline-block;
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
    }
}

.cen-platform {
    width: 100%;
    height: 362rpx;
    margin-top: 40rpx;
    background-color: white;
    border-radius: 20rpx;
    padding-top: 60rpx;
}

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

.bspan {
    width: 100%;
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
    text-align: center;
    margin-top: 20rpx;
}

.textspan {
    width: 100%;
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    text-align: center;
    margin-top: 24rpx;
}

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

.bsub {
    width: 286rpx;
    height: 62rpx;
    border-radius: 40rpx;
    background-color: #FF0101;
    text-align: center;
    line-height: 62rpx;
    margin: 54rpx auto 0;
    font-size: 28rpx;
    font-weight: 400;
    color: white;
}

.s-textss {
    padding-right: 0rpx !important;
}

.in-picker {
    font-size: 24rpx;
}

.frm-comm .rs .txt .in-picker {
    padding-right:30rpx;
    font-size: 24rpx;
}

//请选择文字灰色版
.text-xz {
    color: #999999;
}

//自定以针对验真的css
.s-texts {
    width: calc(100vw - 180rpx - 40rpx - 40rpx);
    height: 72rpx;
    line-height: 72rpx;
    font-size: 20rpx;
    box-sizing: border-box;
    padding: 0 16rpx 0 0;
    text-align: right;
    font-style: 20rpx;
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
</style>