<template>
    <view class="message-card">
        <view class="evaluate-card" v-if="bqShow">
            <u-grid :col="5" :border="false" class="ratings">
                <u-grid-item class="item" v-for="(item, index) in ratings" :key="index" @tap="handleRatingClick(index)">
                    <u-avatar :src="selectedRating === index ? ratingImages[index] : item.src" size="68"></u-avatar>
                    <view class="text">{{ item.text }}</view>
                </u-grid-item>
            </u-grid>
            <view v-if="selectedRating != 3 && selectedRating != 4 && selectedRating != null">
                <view class="explain" v-if="explainShow">
                    <view class="item" v-for="(item, index) in explain" :key="index"
                        :class="{ active: activeExplain === index }" @tap="handleExplainClick(index)">
                        <view>{{ item.dictName }}</view>
                    </view>
                </view>
            </view>
            <view v-if="selectedRating != null">
                <u-divider textColor="#333333" lineColor="#E4E4E4">问题是否解决</u-divider>
                <view class="solve-btns">
                    <view class="btn" :class="{ active: activeButton === '1' }" @tap="handleButtonClick('1')">
                        已解决
                    </view>
                    <view class="btn" :class="{ active: activeButton === '0' }" @tap="handleButtonClick('0')">
                        未解决
                    </view>
                </view>
            </view>
            <view v-if="selectedRating != null">
                <view v-if="!submitEvaluation">
                    <view class="opinion" v-if="selectedRating != 3 && selectedRating != 4 && selectedRating != null">
                        <textarea v-model="value1" placeholder="您有任何想说的，都可以告诉我们" count maxlength="200"
                            placeholder-style="color: #CACACA;font-size:24rpx;"></textarea>
                    </view>
                    <view v-else style="height:60rpx"></view>
                    <view class="submit-btn" @tap="handleSubmitEvaluation">提交评价</view>
                </view>
                <view v-else>
                    <view class="submited-btn">已提交</view>
                </view>
            </view>
        </view>
        <view class="evaluate-card" v-else>
            <u-grid :col="5" :border="false" class="ratings">
                <u-grid-item class="item" v-for="(item, index) in ratings" :key="index">
                    <u-avatar :src="bqObj.satisfaction === index + 1 ? ratingImages[index] : item.src" size="68"></u-avatar>
                    <view class="text">{{ item.text }}</view>
                </u-grid-item>
            </u-grid>
            <view
                v-if="bqObj.notSatisfiedSel && Number(bqObj.satisfaction) - 1 != 3 && Number(bqObj.satisfaction) - 1 != 4">
                <view class="explain">
                    <view class="item" v-for="(item, index) in explain" :key="index"
                        :class="{ active: bqObj.notSatisfiedSel === item.id || bqObj.notSatisfiedSel - 1 == index }">
                        <view>{{ item.dictName }}</view>
                    </view>
                </view>
            </view>
            <view v-if="bqObj.solveFlag == 0 || bqObj.solveFlag == 1">
                <u-divider textColor="#333333" lineColor="#E4E4E4">问题是否解决</u-divider>
                <view class="solve-btns">
                    <view class="btn" :class="{ active: bqObj.solveFlag == 1 }">
                        已解决
                    </view>
                    <view class="btn" :class="{ active: bqObj.solveFlag == 0 }">
                        未解决
                    </view>
                </view>
            </view>
            <view>
                <view v-if="bqObj.notSatisfiedMes">
                    <view class="opinion">
                        <textarea v-model="bqObj.notSatisfiedMes" :disabled="true" placeholder="您有任何想说的，都可以告诉我们" count
                            maxlength="200" placeholder-style="color: #CACACA;font-size:24rpx;"></textarea>
                    </view>
                </view>
                <view>
                    <view class="submited-btn">已提交</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getDictData } from "@/api/common.js";
import { sendEvaluate } from '@/api/im.js'
export default {
    props: {
        explainShow: {
            type: Boolean,
            default: false
        },
        groupId: {
            type: String,
            default: ''
        },
        messageId: {
            type: String,
            default: ''
        },
        bqShow: {
            type: Boolean,
            default: true
        },
        bqObj: {
            type: Object,
            default: () => ({})
        },
        createTime: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedRating: null, // 当前选中的评分项索引
            ratings: [
                { src: "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/feichangbuman.png", text: "非常不满意" },
                { src: "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/buman.png", text: "不满意" },
                { src: "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/yiban.png", text: "一般" },
                { src: "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/manyi.png", text: "满意" },
                { src: "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/feichngmanyi.png", text: "非常满意" },
            ], ratingImages: [
                "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/feichangbumandianji.png",
                "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/bumandianji.png",
                "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/yibandianji.png",
                "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/manyidianji.png",
                "https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/feichngmanyidianji.png",
            ],
            explain: [
                "能够理解我的话",
                "按钮操作方便",
                "方案合理有效",
                "界面简介清晰"
            ],
            activeButton: "1", // 当前激活的按钮
            activeExplain: 0, // 当前激活的 Explain 项索引
            value1: '', // 输入框的值
            submitEvaluation: false // 是否提交过评价
        }
    },
    methods: {
        handleRatingClick(index) {
            this.selectedRating = index;
        },
        handleButtonClick(buttonText) {
            this.activeButton = buttonText;
        },
        handleExplainClick(index) {
            this.activeExplain = index;
        },
        handleSubmitEvaluation() {
            // 提交评价逻辑
            let params = {
                groupId: this.groupId,
                messageId: this.messageId,
                satisfaction: this.selectedRating + 1,
                solveFlag: this.activeButton,
                notSatisfiedSel: this.explain[this.activeExplain].id,
                notSatisfiedMes: this.value1,
                createTime: this.createTime
            }
            if (!this.messageId) {
                delete params.messageId
                delete params.createTime
            }
            uni.showLoading({
                title: '提交中...',
                mask: true
            })
            sendEvaluate(params).then(res => {
                uni.hideLoading()
                if (res.data.code == 200) {
                    this.$u.toast('提交成功')
                    this.submitEvaluation = true;
                    this.$emit('close_evaluate_view')
                } else {
                    this.$u.toast(res.data.msg)
                }
            }).catch(() => {
                uni.hideLoading()
            })
        },
    },
    mounted() {
        getDictData({ type: 'not_satisfied_opt' }).then(res => {
            if (res.data.code == 200) {
                this.explain = res.data.result.records
            }
        })
    }

}
</script>
<style lang="scss" scoped>
.message-card {
    padding: 24rpx 0;
    width: 100%;

    .evaluate-card {
        width: 100%;
        background-color: #FFFFFF;
        border-radius: 16rpx;
        padding: 0 22rpx 25rpx 22rpx;

        .ratings {
            .item {

                .text {
                    margin-top: 24rpx;
                    font-size: 24rpx;
                    color: #999999;
                }
            }
        }

        .explain {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20rpx;
            margin: 20rpx 0 20rpx 0;

            .item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding-bottom: 5rpx;
                font-size: 24rpx;
                color: #999999;
                border: 2rpx solid #E0E0E0;
                border-radius: 8rpx;
                padding: 12rpx 0;
            }

            .active {
                background-color: #C83F24;
                border: 2rpx solid #C83F24;
                color: #FFFFFF;
            }
        }



        .solve-btns {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 20rpx;
            gap: 40rpx;

            view {
                padding: 0 66rpx;
                border-radius: 16rpx;
                font-size: 22rpx;
                color: #FFFFFF;
                margin: 0;
                background-color: #F5F5F5;
                border: 2rpx solid #E0E0E0;
                color: #333333;
            }

            .btn {
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .active {
                background-color: #C83F24;
                border: 2rpx solid #C83F24;
                color: #FFFFFF;
            }
        }

        .opinion {
            margin-top: 32rpx;


            textarea {
                width: calc(100% - 47rpx);
                background-color: #F3F3F3;
                height: 152rpx;
                padding: 16rpx 24rpx;
                font-size: 24rpx;
            }
        }

        .submit-btn {
            margin: 20rpx 0 15rpx 0;
            padding: 14rpx 0;
            text-align: center;
            border-radius: 16rpx;
            font-size: 24rpx;
            color: #FFFFFF;
            background-color: #C83F24;
        }

        .submited-btn {
            margin: 40rpx 0 15rpx 0;
            padding: 14rpx 0;
            text-align: center;
            border-radius: 16rpx;
            font-size: 24rpx;
            color: #FFFFFF;
            background-color: #CACACA;
        }

        .submit-btn:active {
            background-color: #ad3017;
        }
    }
}
</style>