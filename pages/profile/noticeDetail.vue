<template>
    <view class="container">
        <view class="article" v-if="isComplete">
            <view class="arc-name">{{ objData.title }}</view>
            <view class="arc-info">
                <view>发布日期：{{ objData.date }}</view>
								<view class="source">来源：{{objData.editor}}</view>
            </view>
            <view class="arc-wrap" v-html="objData.content"></view>
        </view>
    </view>
</template>

<script>
import { getNoticeDetail } from "../../api/home";
export default {
    name: '',
    data() {
        return {
					isComplete: false,
					objData: {
						title: '', date: '', editor: '', content: ''
					},
        }
    },
    methods: {

    },
    onLoad: function (options) {
        let params = {
            id: options.id
        }
					
        getNoticeDetail(params).then(res => {
					if(res.data.code == 200){
						this.isComplete = true
						
						let objRes = res.data.result
						this.objData.title = objRes.informationTitle
						this.objData.date = objRes.createTime
						this.objData.editor = '中品维度'
						this.objData.content = objRes.content.replace(/<img/g, "<img style='max-width:100%;height:auto;'");
						
					}
        })
    },
    onShow: function () {

    }
}
</script>

<style lang="scss" scoped>
.container {
    background: #FFF;
    min-height: 100vh;
    box-sizing: border-box;
		
		.article{ 
			background: #FFF; color: #333; padding: 20rpx;
			.arc-name{ font-size: 32rpx; min-height: 48rpx; line-height: 48rpx; color: #333; font-weight: 600; box-sizing: border-box;}
			.arc-info{ 
				height: 72rpx; line-height: 72rpx; font-size: 24rpx; display: flex; justify-content: flex-start; align-items: center; color: #999;
				.source{ margin: 0 20rpx 0 0;}
			}
			.arc-wrap{ font-size: 28rpx; line-height: 48rpx; font-weight: 500; color: #333;}
		}

    .wrapper {

        padding: 0 20rpx 20rpx;

        .time {
            display: flex;
            color: #8B8B8B;
            justify-content: center;
            font-size: 28rpx;
            margin-bottom: 30rpx;

            .txt {
                margin-right: 40rpx
            }
        }

        .name {
            font-size: 38rpx;
            font-weight: 600;
            line-height: 70rpx;
            text-align: center;
        }

        .text {
            line-height: 48rpx;
            font-size: 28rpx;
        }
    }
}
</style>