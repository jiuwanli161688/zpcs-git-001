<template>
    <view class="wrap" :style="{ height: epH }">
		<!-- 申请预约回电 -->
        <view class="appoint" v-if="appoint">
            <view class="nav-item">
				<image :src="`${iconCommon}/customer/SketchPngecc.png`"></image>
                <text>{{consultationStateObj[scheduledCallBackDetailData.status]}}</text>
            </view>
            <text class="nav-text">预计{{scheduledCallBackDetailData.scheduledTime}}回电</text>
        </view>
        <view class="content-box">
            <view class="text1">预约回电</view>
            <view class="item">
                <text>回电号码</text>
				<text>
					<input
					  v-model="scheduledCallBackDetailData.phoneNumber"
					  placeholder="请输入回电号码"
					  :disabled="appoint"
					  @blur="inputScheduledCallBackPhoneEve"
					  style="text-align: right;"/>
				</text>
                <!-- <text>{{scheduledCallBackDetailData.phoneNumber}}</text> -->
            </view>
            <view class="item" v-if="!appoint">
                <text>回电时间</text>
                <view class="right">
                    <view class="top">
                        <view class="time">{{scheduledCallBackDetailData.scheduledTime?
											scheduledCallBackDetailData.scheduledTime:'请选择回电时间'}}</view>
						<image :src="`${iconCommon}/customer/arrow.png`" mode="widthFix"></image>
                    </view>
                    <view @tap="choiceScheduledTimeEve" class="other">预约其他时间</view>
                </view>
            </view>
            <view class="item" v-else>
                <text>回电时间</text>
                <text>{{scheduledCallBackDetailData.scheduledTime}}</text>
            </view>
        </view>
        <view class="QT" @tap="choicescheduledCallBackType">
            <text>预约回电</text>
            <text>{{scheduledCallBackDetailData.consultationType?
			consultationTypeObj[scheduledCallBackDetailData.consultationType]
			:'请选择预约类型'}}</text>
        </view>
        <view class="QTC">
            <text>预约内容</text>
            <view class="QTC-cont">
				<textarea
				  v-model="scheduledCallBackDetailData.consultationContent"
				  @blur="inputConsultationContentEve"
				  :disabled="appoint"
				  placeholder="请输入预约内容"
				  auto-height />
			</view>
        </view>
		
		<!-- 客服电话信息 -->
        <view class="controll">
            <text class="btn-text">感谢您使用中品预约回电服务，请保持手机畅通接听<br />电话为400-123-4567的来电</text>
            <view class="btn-item">
                <text @tap="back">返回咨询</text>
                <text v-if="!appoint" @tap="To_appoint">确定预约</text>
                <text v-if="appoint && cetScheduledCallBackId" @tap="To_cancel">取消预约</text>
            </view>
        </view>

		<!-- 取消原因抽屉 -->
        <u-popup v-model="show" mode="bottom" border-radius="40" class="footer">
            <view class="footer-title">
                <text></text>
                <text>选择取消原因</text>
				<image :src="`${iconCommon}/customer/cross.png`" @tap="close_popup"></image>
            </view>
            <view class="footer-content">
                <view class="footer-content-item" v-for="(reason, index) in checkboxGroupList" :key="index"
                    @tap="selectReason(reason.dictLabel)">
                    <text>{{ reason.dictLabel }}</text>
					<image
						:src="selectedReason === reason.dictLabel ? `${iconCommon}/customer/success.png`:`${iconCommon}/customer/circle.png`">
					</image>
                </view>
                <view class="confirm">
                    <view class="btn" @tap="To_confirm" v-if="selectedReason">确定</view>
                    <view class="unbtn" v-else>确定</view>
                </view>
            </view>
        </u-popup>

		<!-- 预约类型抽屉 -->
        <u-popup v-model="showConsultationType" mode="bottom" border-radius="40" class="footer">
            <view class="footer-title">
                <text></text>
                <text>选择预约类型</text>
				<image :src="`${iconCommon}/customer/cross.png`" @tap="close_ConsultationType"></image>
            </view>
            <view class="footer-content">
                <view class="footer-content-item" v-for="(reason, index) in consultationTypeList" :key="index"
                    @tap="selectConsultationTypeEve(reason.value)">
                    <text>{{ reason.label }}</text>
					<image
						:src="selectedConsultationType === reason.value ? `${iconCommon}/customer/success.png`:`${iconCommon}/customer/circle.png`">
					</image>
                </view>
                <view class="confirm">
                    <view class="btn" @tap="To_consultationTypeEve" v-if="selectedConsultationType">确定</view>
                    <view class="unbtn" v-else>确定</view>
                </view>
            </view>
        </u-popup>
    
		<!-- 预约时间选择抽屉 -->
		<u-picker v-model="showTimeState" mode="time" :params="{
			year: true,
			month: true,
			day: true,
			hour: true,
			minute: true,
			second: true,
		}" @confirm="handleTransferDate"
		@cancel="cancelTransferDate"></u-picker>
	</view>
</template>
  
<script>
import {
	getScheduledCallBackDetail,
	cancelScheduledDict,
	addScheduledCallBack,
	cancelScheduledCallBack,
} from '@/api/customer.js'
import storage from '@/utils/storage.js' //缓存
export default {
    data() {
        return {
			userInfoObj: storage.getUserInfo(), // 用户信息
            epH: '',
            show: false, // 取消原因抽屉状态
			checkboxGroupList: [], // 取消原因数据
            appoint: false, // 展示详情/预约成功
            selectedReason: null, // 选择取消原因
			selectedConsultationType: null, //选中预约类型
			consultationTypeList: [
				{
				  label: '订单类型',
				  value: 'ORDER'
				},
				/* {
				  label: '售后类型',
				  value: 'CALLBACK'
				}, */
				{
				  label: '售后类型',
				  value: 'AFTER_SALE'
				},
				{
				  label: '账户类型',
				  value: 'ACCOUNT'
				},
				{
				  label: '其他类型',
				  value: 'OTHER'
				},
			], // 咨询类型列表
			cetScheduledCallBackId: '', // 选中 预约回电ID
			consultationTypeObj:{
				ORDER: '订单类型' ,
				// CALLBACK: '售后类型' ,
				AFTER_SALE: '售后类型' ,
				ACCOUNT: '账户类型' ,
				OTHER: '其他类型' ,
			}, // 咨询类型
			consultationStateObj:{
				CANCEL: '已取消',
				CALLED_BACK: '已回电',
				WAIT_CALL_BACK: '待回电',
			}, // 咨询状态
			phonePattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/, // 回电号码 正则校验
			scheduledCallBackDetailData: {
				consultationContent: '',
				consultationType: '',
				phoneNumber: '',
				scheduledTime: '',
				status: '',
			}, // 预约回电详情数据
			addScheduledParams:{
				associationId: null, // 关联id：订单id、售后单id、其他id
				scheduledTime: '', // 预约时间
				phoneNumber: '', // 回电号码
				consultationType: '', // 咨询类型
				goodsIds:[], // 
				consultationContent: '', // 咨询内容
				memberId: '', // 用户id
				orderSn:'', //订单号
				subOrderSn:'', //子订单号
			}, // 新增预约回电 params
			showTimeState: false, // 选择时间组件状态
			showConsultationType: false, // 选择预约类型弹窗
			cancelScheduledParams: {
				id: '', //选中预约信息 ID
				cancelReason: '', // 取消原因
			}, // 取消预约事件 params
		  
        }
    },
	onLoad(e) {
		if(e.scheduledCallBackId) { // 选中 预约回电 ID
			this.appoint = true // 显示预约回电详情
			this.cetScheduledCallBackId = e.scheduledCallBackId
			this.cancelScheduledParams.id = e.scheduledCallBackId
			this.getScheduledCallBackDetailEve()
		}
		if(e.associationId){
			this.addScheduledParams.associationId = e.associationId
		}
		if(e.consultationType) { // 选定 预约回电类型
			this.addScheduledParams.consultationType = e.consultationType
			this.scheduledCallBackDetailData.consultationType = e.consultationType
		}
	},
	onShow() {
		this.init()
	},
    mounted() {
        this.epH = uni.getWindowInfo().windowHeight + "px"
    },
    methods: {
		// 初始化
		init() {
			this.cancelScheduledDictEve()
		},
		// 返回咨询按钮
        back() {
            uni.navigateTo({
                url: '/pages/customerService/service?title=电话客服'
            })
        },
		// 确认预约 - 信息填写 - 新增预约回电事件
        To_appoint() {
			if(!this.addScheduledParams.phoneNumber) {
				this.showInfoModelEve('请输入回电号码！')
				return
			}
			if(!this.addScheduledParams.scheduledTime) {
				this.showInfoModelEve('请选择回电时间！')
				return
			}
			if(!this.addScheduledParams.consultationType) {
				this.showInfoModelEve('请选择预约回电类型！')
				return
			}
			if(!this.addScheduledParams.consultationContent) {
				this.showInfoModelEve('请输入预约内容！')
				return
			}
			this.addScheduledParams.memberId = this.userInfoObj.id
			this.showLoadingEve()
			let clientType = 'UNKNOWN'
			// #ifdef H5
			  clientType = 'H5'
			// #endif
			//#ifdef APP-PLUS
			  clientType = 'APP'
			// #endif
			//#ifdef MP-WEIXIN
			  clientType = 'WECHAT_MP'
			// #endif
			addScheduledCallBack(this.addScheduledParams,clientType).then(res => {
				if(res.data.code == 200) {
					this.appoint = true
					uni.hideLoading()
				}
			}).catch(err => {
				this.showInfoModelEve('预约提交失败！')
				uni.hideLoading()
			})
        },
		// 取消预约 - 信息详情
        To_cancel() {
            this.show = true
        },
		// 处理选中的取消原因 - 确认取消
        To_confirm() {
            this.show = false
            // 可以在这里处理选中的原因
            // this.appoint = false
			const _this = this
			uni.showModal({
				title: '提示',
				content: '请问是否取消当前回电预约？',
				success: function (res) {
					if (res.confirm) {
						_this.showLoadingEve()
						// 取消预约回电
						_this.cancelScheduledCallBackEve()
					} else if (res.cancel) {
					}
				}
			})
			return
        },
		// 取消预约回电事件
		cancelScheduledCallBackEve() {
			cancelScheduledCallBack(this.cancelScheduledParams).then(res => {
				if(res.data.code == 200) {
					uni.hideLoading()
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false,
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/customerService/service?title=电话客服'
								})
							}
						}
					})
				}
			})
		},
		// 选择取消原因
        selectReason(reason) {
            this.selectedReason = reason
			this.cancelScheduledParams.cancelReason = reason
        },
		// 关闭取消原因抽屉
        close_popup() {
            this.show = false
        },
		// 预约内容输入变更
		inputConsultationContentEve(e) {
			this.addScheduledParams.consultationContent = e.detail.value
		},
		// 处理选中预约类型
		To_consultationTypeEve() {
			this.showConsultationType = false
			this.addScheduledParams.consultationType = this.selectedConsultationType
			this.scheduledCallBackDetailData.consultationType = this.selectedConsultationType
		},
		
		// 选择原因类型
		selectConsultationTypeEve(reason) {
			this.selectedConsultationType = reason
		},
		// 关闭预约类型抽屉
		close_ConsultationType() {
			this.showConsultationType = false
		},
		// 选择预约类型
		choicescheduledCallBackType() {
			if(this.appoint) return
			this.showConsultationType = true
		},
		// 预约回电取消原因
		cancelScheduledDictEve() {
		  cancelScheduledDict({type: 'call_back_reason'}).then(res => {
			if (res.data.code == 200) {
			  this.checkboxGroupList = res.data.data
			}
		  })
		},
		
		// 预约其他时间 点击事件
		choiceScheduledTimeEve() {
			this.showTimeState = true
		},
		// 预约回电时间 确认按钮事件
		handleTransferDate(e) {
			let choiceTime = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
			let nowDateTime = new Date().getTime()
			let choiceDateTime = new Date(choiceTime).getTime()
			
			if(choiceDateTime < nowDateTime) {
				this.showInfoModelEve('回电时间不得早于当前时间！')
				return
			}
			this.scheduledCallBackDetailData.scheduledTime = choiceTime
			this.addScheduledParams.scheduledTime = choiceTime
		},
		// 预约回电时间 取消按钮事件
		cancelTransferDate(e) {
			this.scheduledCallBackDetailData.scheduledTime = ''
			this.addScheduledParams.scheduledTime = ''
		},
		
		// 输入回电号码事件
		inputScheduledCallBackPhoneEve(e) {
			if(e.detail.value && !this.phonePattern.test(e.detail.value)) {
				this.scheduledCallBackDetailData.phoneNumber = ""
				this.addScheduledParams.phoneNumber = ""
				this.showInfoModelEve('当前输入手机号格式错误，请重新输入！')
				return
			}
			this.scheduledCallBackDetailData.phoneNumber = e.detail.value
			this.addScheduledParams.phoneNumber = e.detail.value
		},
		
		
		// 获取指定ID预约回电详情
		getScheduledCallBackDetailEve() {
			getScheduledCallBackDetail(this.cetScheduledCallBackId).then(res => {
				if(res.data.code == 200) {
					this.scheduledCallBackDetailData = res.data.data
				}
			})
		},
		// 加载遮罩
		showLoadingEve() {
			uni.showLoading({
				title: '加载中...',
				mask: true,
			});
		},
		// 提示信息
		showInfoModelEve(e) {
			uni.showModal({
				title: '提示',
				content: e,
				showCancel: false,
			})
		},
    }
}
</script>
  
<style lang="scss" scoped>
.wrap {
    margin: 0;
    padding: 0;
    background-color: #f3f3f3;
}

.title {
    font-size: 34rpx;
    color: #FFFFFF;
    display: block;
    text-align: center;
    background-color: #C83F24;
}

.appoint {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 108rpx;
    background-color: #C83F24;

    .nav-item {
        display: flex;
        align-items: center;

        image {
            width: 44rpx;
            height: 44rpx;
            margin-right: 16rpx;
        }

        text {
            font-weight: 500;
            font-size: 40rpx;
            color: #FFFFFF;
        }
    }

    .nav-text {
        font-size: 26rpx;
        color: #FFFFFF;
        margin: 40rpx 0 80rpx 0;
    }
}

.content-box {
    background-color: #ffffff;
    padding: 0 36rpx;

    .text1 {
        font-size: 28rpx;
        font-weight: 600;
        color: #333333;
        padding: 36rpx 0;
    }

    .item {
        display: flex;
        justify-content: space-between;
        padding: 24rpx 0;
        border-top: 1rpx solid #F2F2F2;

        .right {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            .top {
                display: flex;
                flex-direction: row;
                align-items: center;

                .time {
                    font-size: 26rpx;
                    color: #333333;
                }

                image {
                    width: 32rpx;
                    height: 32rpx;
                    margin-left: 16rpx;
                }
            }

            .other {
                margin-top: 8rpx;
                margin-right: 40rpx;
                font-size: 26rpx;
                color: #2880FF;
            }
        }
    }

}

.QT {
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    margin-top: 16rpx;
    padding: 36rpx;

    text {
        font-weight: 500;
        font-size: 28rpx;
        color: #333333;
    }

    text:nth-child(2) {
        font-size: 26rpx;
        font-weight: 400;
    }
}
.QTC {
    background-color: #FFFFFF;
    // display: flex;
    // justify-content: space-between;
    margin-top: 16rpx;
    padding: 36rpx;
    text {
        font-weight: 500;
        font-size: 28rpx;
        color: #333333;
    }
	.QTC-cont {
		margin-top: 10rpx;
        color: #7e7e7e;
	}
	
}

.controll {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 80rpx 140rpx 0rpx 96rpx;

    .btn-text {
        font-weight: 500;
        font-size: 22rpx;
        color: #666666;
        text-align: center;
        margin-bottom: 80rpx;
    }

    .btn-item {
        display: flex;
        justify-content: center;

        text {
            border-radius: 30rpx;
            font-weight: 500;
            font-size: 24rpx;
            border: 2rpx solid #CACACA;
            color: #333333;
            background: #FFFFFF;
            padding: 12rpx 64rpx 14rpx 64rpx;
        }

        text:nth-child(2) {
            margin-left: 28rpx;
            color: #ffffff;
            background: #C83F24;
            border: none;
        }
    }
}

.footer {
    display: flex;
    flex-direction: column;

    .footer-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 26rpx 0;
        border-radius: 40rpx 40rpx 0rpx 0rpx;

        text {
            font-weight: 500;
            font-size: 32rpx;
            color: #323233;
        }

        image {
            width: 44rpx;
            height: 44rpx;
            margin-right: 24rpx;
        }
    }

    .footer-content {
        flex-direction: column;
        display: flex;
        justify-content: center;
        padding: 0rpx 32rpx;
        margin-bottom: 38rpx;

        .footer-content-item {
            display: flex;
            justify-content: space-between;
            padding: 24rpx 0rpx;
            border-bottom: 1rpx solid #EBEDF0;

            image {
                width: 32rpx;
                height: 32rpx;
            }
        }


        .confirm {
            margin-top: 24rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .btn {
                width: 70%;
                height: 58rpx;
                border-radius: 20rpx;
                color: #ffffff;
                background: #C83F24;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .unbtn {
                width: 70%;
                height: 58rpx;
                border-radius: 20rpx;
                color: #ffffff;
                background: #ff9883;
                border: none;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }

}
</style>