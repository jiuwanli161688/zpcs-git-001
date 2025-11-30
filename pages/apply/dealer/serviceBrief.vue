<template>
    <view class="container" v-if="isComplete">
        <view class="title-name">{{ name }}分平台权益内容及简介</view>
        <view class="frm-sign">
            <view class="title">
                <view class="name">准入条件</view>
                <view class="text" v-if="AAService">{{ accessCondition }}</view>
                <view class="text" v-if="AService">{{ accessCondition }}</view>
                <view class="text" v-if="BService">{{ accessCondition }}</view>
                <view class="text" v-if="CService">{{ accessCondition }}</view>
            </view>
            <view class="title">
                <view class="name">服务内容</view>
                <view class="text" v-if="AAService">{{ serviceContent }}</view>
                <view class="text" v-if="AService">{{ serviceContent }}</view>
                <view class="text" v-if="BService">{{ serviceContent }}</view>
                <view class="text" v-if="CService">{{ serviceContent }}</view>
            </view>
            <view class="title">
                <view class="name">权益内容</view>
                <view class="text" v-if="AAService">
                    <text>{{ rightsContent }}</text>
                </view>
                <view class="text" v-if="AService">
                    <text>{{ rightsContent }}</text>
                </view>
                <view class="text" v-if="BService">
                    <text>{{ rightsContent }}</text>
                </view>
                <view class="text" v-if="CService">
                    <text>{{ rightsContent }}</text>
                </view>
            </view>
        </view>
        <view class="lnk-common lnk-primary" @tap="handleNext">确定</view>
    </view>
</template>
<script>
import storage from '@/utils/storage.js';
import { getBriefContent } from '@/api/common.js';
export default {
    data() {
        return {
            isComplete: false,
            AAService: false,    //A+服务商
            AService: false,     //A类服务商
            BService: false,     //B类服务商
            CService: false,     //C类服务商
            accessCondition: '',  //准入条件内容
            serviceContent: '',  //服务内容
            rightsContent: '',  //权益内容
            name: '', // 服务商名称
        };
    },
    methods: {
        handleNext() {
            uni.navigateTo({
                url: "/pages/apply/dealer/archives?source=new",
            });
        }
    },
    onLoad: function () {
        let objZP = storage.getZpMemberInfo()
        if (objZP.provinceAgentFlag == true && objZP.districtAgentFlag == true) {
            this.AAService = true
        } else {
            this.AAService = false
        }
        if (objZP.provinceAgentFlag == true && objZP.districtAgentFlag == false) {
            this.AService = true
        } else {
            this.AService = false
        }
        if (objZP.provinceAgentFlag == false && objZP.districtAgentFlag == true) {
            this.BService = true
        } else {
            this.BService = false
        }
        if (objZP.provinceAgentFlag == false && objZP.districtAgentFlag == false) {
            this.CService = true
        } else {
            this.CService = false
        }
        this.isComplete = false
        getBriefContent().then(res => {
            res.data.result.detailSettingList.map(item => {
                if (this.AAService) {
                    if (item.type == 4) {
                        this.accessCondition = item.accessCondition
                        this.serviceContent = item.serviceContent
                        this.rightsContent = item.rightsContent
                        this.name = item.name
                    }
                    this.isComplete = true
                }
                if (this.AService) {
                    if (item.type == 3) {
                        this.accessCondition = item.accessCondition
                        this.serviceContent = item.serviceContent
                        this.rightsContent = item.rightsContent
                        this.name = item.name
                    }
                    this.isComplete = true
                }
                if (this.BService) {
                    if (item.type == 2) {
                        this.accessCondition = item.accessCondition
                        this.serviceContent = item.serviceContent
                        this.rightsContent = item.rightsContent
                        this.name = item.name
                    }
                    this.isComplete = true
                }
                if (this.CService) {
                    if (item.type == 1) {
                        this.accessCondition = item.accessCondition
                        this.serviceContent = item.serviceContent
                        this.rightsContent = item.rightsContent
                        this.name = item.name
                    }
                    this.isComplete = true
                }
            })

        })
    },
};
</script>
<style lang="scss" scoped>
.container {
    background: #FFF;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
}

.frm-sign .title {
    display: block;
    line-height: 80rpx;
    padding: 0 0 0 20rpx;
    margin: 0 0 10rpx;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title-name {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
    text-align: center;
    margin: 20rpx;
}

.name {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
}

.name::before {
    position: absolute;
    content: '';
    left: 0;
    top: 43rpx;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    width: 6rpx;
    height: 40rpx;
    border-radius: 6rpx;
    background: #E22221;
    display: inline-block;
}

.text {
    line-height: 50rpx;
}
</style>