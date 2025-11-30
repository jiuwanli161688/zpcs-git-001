<template>
    <view>
        <view class="submit">
            <!-- <view class="top-box" v-if="type == 'business'">
                <view class="name" v-if="userType != 'DISTRIBUTOR'" @tap="clickEt('@分平台服务商')">@分平台服务商</view>
                <view class="name" v-if="userType != 'STORE'" @tap="clickEt('@供应商')">@供应商</view>
                <view class="name" v-if="userType != 'MEMBER'" @tap="clickEt('@客户')">@客户</view>
            </view> -->
            <view class="submit-chat">
                <!-- <view class="bt-img" @tap="records">
                    <image :src="toc"></image>
                </view> -->
                <!-- 文本框 -->
                <textarea ref="input-content" auto-height="false" :show-confirm-bar="false" :adjust-position="true"
                    :hold-keyboard="holdKeyboard" :focus="focusState" :disable-default-padding="true" class="chat-send btn"
                    :class="{ displaynone: isrecord }" @input="inputs" @focus="focus" v-model="msg" :cursor-spacing="80"
                    @blur="inputBindBlur" placeholder="请输入" maxlength="1000" cursor-spacing="15"></textarea>
                <!-- <view class="record btn" :class="{ displaynone: !isrecord }" @touchstart="touchstart" @touchend="touchend"
                    @touchmove="touchmove"> 按住说话 </view> -->
                <view class="bt-img bq" @tap="emoji">
                    <image :src="frame"></image>
                </view>
                <view class="bt-img" style="padding-bottom: 2px;" @tap="collect(0)"><u-icon name="bag" size="67"></u-icon>
                </view>
                <view class="bt-img" v-if="!msg" @tap="more">
                    <image :src="mores"></image>
                </view>
                <view class="bt-img" @tap="emojiSend(null)">
                    <button class="btn">发送</button>
                </view>
            </view>
            <!-- 表情 -->
            <view class="emoji" :class="{ displaynone: !isemoji }">
                <!-- <view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiBack">
						<image src="../../static/icon/leftbrackets.png"></image>
					</view>
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view> -->
                <emoji @emotion="emotion" :height="260"></emoji>
            </view>
            <!-- 更多 -->
            <view class="more" :class="{ displaynone: !ismore }">
                <view class="more-list" @tap="sendImg('album')">
                    <image :src="picture"></image>
                    <view class="more-list-title">图片</view>
                </view>
                <view class="more-list" @tap="sendImg('camera')">
                    <image :src="takePicture"></image>
                    <view class="more-list-title">拍照</view>
                </view>
                <view class="more-list" @tap="collect(0)">
                    <image src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/dingdan.png"></image>
                    <view class="more-list-title">订单</view>
                </view>
                <view class="more-list" @tap="collect(1)">
                    <image src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/dingdan.png"></image>
                    <view class="more-list-title">售后</view>
                </view>
                <view class="more-list" @tap="collect(2)">
                    <image src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/dingdan.png"></image>
                    <view class="more-list-title">浏览</view>
                </view>
                <view class="more-list" @tap="collect(3)">
                    <image src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/im/icon/dingdan.png"></image>
                    <view class="more-list-title">收藏</view>
                </view>
                <!-- <view class="more-list" @tap="choseLocation">
					<image src="../../static/icon/noreceive.png"></image>
					<view class="more-list-title">定位</view>
				</view>
				<view class="more-list">
					<image src="../../static/icon/noreceive.png"></image>
					<view class="more-list-title">文件</view>
				</view> -->
            </view>
        </view>
        <view class="voice-bg" :class="{ displaynone: !voicebg }">
            <view class="voice-bg-len">
                <view class="voice-bg-time" :style="{ width: vlength / 0.6 + '%' }"> {{ vlength }}″ </view>
                <view class="voice-del">上滑取消录音</view>
            </view>
        </view>
        <choose-person :userType="userType" :roleArr="roleArr" ref="choose" class="choose-box" v-if="choosePersonVisible"
            :visible.sync="choosePersonVisible" @check-person="checkPerson"></choose-person>

        <!-- #ifdef APP-PLUS -->
        <yk-authpup ref="authpupCamera" type="top" @changeAuth="changeAuthCamera" permissionID="CAMERA"></yk-authpup>
        <yk-authpup ref="authpup" type="top" @changeAuth="changeAuth" permissionID="WRITE_EXTERNAL_STORAGE"></yk-authpup>
        <!-- #endif -->
    </view>
</template>

<script>
// 引入组件
import emoji from './emoji.vue'
import { upload } from '@/api/common'
import storage from '@/utils/storage.js'
import choosePerson from './choose-person.vue'
import ykAuthpup from "@/components/yk-authpup/yk-authpup";
import permision from "@/js_sdk/wa-permission/permission.js";
// 录音
const recorderManager = uni.getRecorderManager()
export default {
    components: {
        choosePerson,
        emoji,
        ykAuthpup
    },
    props: {
        userType: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'platform'
        },
        roleArr: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            isrecord: false,
            isemoji: false,
            ismore: false,
            voicebg: false,
            pageY: 0,
            msg: '',
            toc: `${this.iconCommon}/chat/allorder.png`,
            timer: '', //计时器
            vlength: 0,
            frame: `${this.iconCommon}/chat/frame.png`,
            mores: `${this.iconCommon}/chat/more.png`,
            picture: `${this.iconCommon}/chat/picture.png`,
            // video: `@/static/icon/dingdan.png`,
            takePicture: `${this.iconCommon}/chat/takePicture.png`,
            KeyboardHeight: 0, // 键盘高度
            holdKeyboard: true,
            focusState: false,

            // 内容
            oldContent: '',
            cursorIndex: 0, //光标的位置
            // 选择@人
            choosePersonVisible: false
        }
    },
    mounted() {
        this.getElementHeight(1)
    },
    methods: {
        // 选择@的人
        checkPerson(data) {

            this.msg = this.msg + data.name
            this.choosePersonVisible = false
            this.focusState = true
        },
        //获取高度方法
        getElementHeight(type) {
            const query = uni.createSelectorQuery().in(this)
            query
                .select('.submit')
                .boundingClientRect((data) => {
                    this.$emit('heights', data.height, type)
                })
                .exec()
        },
        //切换音频
        records() {
            let _this = this
            // #ifdef MP-WEIXIN
            uni.getSetting({
                success(res) {
                    if (!res.authSetting['scope.record']) {
                        // 用户尚未授权或已拒绝
                        uni.authorize({
                            scope: 'scope.record',
                            success() {

                                _this.changeRecords()
                            },
                            fail() {
                                // 用户拒绝授权
                                uni.showModal({
                                    title: '提示',
                                    content: '此功能需要录音权限，请设置打开权限',
                                    success: function (modalRes) {
                                        if (modalRes.confirm) {
                                            uni.openSetting({
                                                success: function (settingRes) {
                                                    if (settingRes.authSetting['scope.record']) {

                                                    }
                                                }
                                            })
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        // 用户已授权录音权限

                        _this.changeRecords()
                    }
                }
            })
            // #endif
            // #ifdef APP-PLUS
            _this.requestAndroidPermission("android.permission.RECORD_AUDIO")
            // #endif
        },
        async requestAndroidPermission(permisionID) {
            var result = await permision.requestAndroidPermission(permisionID)
            if (result == 1) {
                this.changeRecords()
            } else if (result == 0) {

                uni.showModal({
                    title: '权限提示',
                    content: '此功能需要录音权限，请前往设置页面开启权限。',
                    confirmText: '去设置',
                    cancelText: '取消',
                    success: (res) => {
                        if (res.confirm) {
                            // 用户点击“去设置”，跳转到应用设置页面
                            permision.gotoAppPermissionSetting()
                        } else {

                        }
                    },
                });
            } else {

                uni.showModal({
                    title: '权限被拒绝',
                    content: '您已永久拒绝录音权限，请前往设置页面开启权限。',
                    confirmText: '去设置',
                    cancelText: '取消',
                    success: (res) => {
                        if (res.confirm) {
                            // 用户点击“去设置”，跳转到应用设置页面
                            permision.gotoAppPermissionSetting()
                        } else {

                        }
                    },
                });
            }
        },
        // 切换录音事件
        changeRecords() {
            //切换的时候关闭其他界面
            this.ismore = false
            this.isemoji = false
            this.frame = `${this.iconCommon}/chat/frame.png`

            //切换高度
            setTimeout(() => {
                this.getElementHeight()
            }, 20)

            if (this.isrecord) {
                this.isrecord = false
                this.toc = `${this.iconCommon}/chat/allorder.png`
            } else {
                this.isrecord = true
                this.toc = `${this.iconCommon}/chat/wechat.png`
            }
        },
        // 表情
        emoji() {
            // this.isemoji = !this.isemoji;
            //切换的时候关闭其功能

            this.focusState = false
            // 是否是更多
            this.ismore = false
            // 是否是录音
            this.isrecord = false
            this.toc = `${this.iconCommon}/chat/allorder.png`

            if (this.isemoji) {
                this.isemoji = false
                // 变成表情图片
                this.frame = `${this.iconCommon}/chat/frame.png`
            } else {
                this.isemoji = true
                // 变成键盘图片
                this.frame = `${this.iconCommon}/chat/wechat.png`
            }
            //切换高度
            // setTimeout(() => {
            //     this.getElementHeight()
            // }, 100)
        },
        //接收表情
        emotion(e) {
            this.msg = this.msg + e
        },
        // 接收艾特文案
        clickEt(e) {
            this.msg = this.msg + e
        },
        //文字发送
        inputs(e) {
            // 记录当前输入的内容
            if (this.type == 'business') {
                this.msg = e.detail.value
                const oldArr = this.oldContent.split('')
                const newArr = this.msg.split('')
                let contentStr = this.msg
                // 找出当前输入的内容
                oldArr.forEach((str) => {
                    contentStr = contentStr.replace(str, '')
                })

                // 输入是@时
                if (contentStr === '@') {
                    this.choosePersonVisible = true
                    this.focusState = false
                    // 比对算法,找出当前光标的位置,找到当前输入的位置
                    newArr.some((now, index) => {
                        if (this.msg.substring(0, index) !== this.oldContent.substring(0, index)) {
                            this.cursorIndex = index
                            return true
                        }
                        this.cursorIndex = 0
                    })
                } else {
                    this.choosePersonVisible = false
                }
                this.oldContent = this.msg
            }
            var chatm = e.detail.value
            var pos = chatm.indexOf('\n')
            // 检索字符串没有数据，返回-1
            // if (pos != -1 && chatm.length > 1) {
            // this.$emit('inputs', this.msg);
            // setTimeout(() => {
            // 	this.msg = '';
            // }, 0)
            // }

            if (pos != -1 && chatm.length > 1) {
                // 0为表情和文字
                this.send(this.msg, 0)
            }
        },
        // 输入框聚焦
        focus(e) {
            if (this.isemoji) {
                this.emoji()
                uni.hideKeyboard()
                return
            }
            //关闭其他项
            this.isemoji = false
            this.ismore = false
            this.focusState = true
            // if (uni.getSystemInfoSync().platform == 'ios') {
            //     document.getElementsByClassName("submit").scrollIntoView(true);
            // } else {
            //     // 键盘高度
            //     this.KeyboardHeight = e.detail.height

            //     //切换高度
            //     setTimeout(() => {
            //         this.getElementHeight()
            //     }, 100)
            // }
            this.frame = `${this.iconCommon}/chat/frame.png`

        },
        // 输入框失去焦点
        inputBindBlur() {
            // this.KeyboardHeight = 0
            this.focusState = false
            this.$emit('heights')
        },
        // 发送
        emojiSend(text) {
            // if (this.msg.length > 0) {
            // 	this.$emit('inputs', this.msg);
            // 	setTimeout(() => {
            // 		this.msg = '';
            // 	}, 0)
            // }
            if (text) {
                this.msg = text
            }
            if (this.msg.length > 0) {
                //0为表情和文字
                this.send(this.msg, 0)
            }
        },
        // 表格退格
        emojiBack() {
            if (this.msg.length > 0) {
                this.msg = this.msg.substring(0, this.msg.length - 1)
            }
        },
        //更多功能
        more() {
            this.focusState = false
            this.ismore = !this.ismore
            //切换的时候关闭其他界面
            this.isemoji = false
            this.isrecord = false
            this.frame = `${this.iconCommon}/chat/frame.png`
            this.toc = `${this.iconCommon}/chat/allorder.png`
            //切换高度
            //切换高度
            setTimeout(() => {
                this.getElementHeight()
            }, 100)
        },
        //图片和视频发送
        sendImg(e) {
            let count = 9
            if (e == 'album') {
                count = 9
            } else {
                count = 1
            }
            // #ifdef APP-PLUS
            if (e == 'camera') {
                if (plus.os.name == 'Android') {
                    this.$refs['authpupCamera'].open(); // 调起相机权限目的弹框
                }
            }else if (e == 'album') {
                if (plus.os.name == 'Android') {
                    this.$refs['authpup'].open(); // 调起相册权限目的弹框
                }
            }
            // #endif
            // uni.chooseMedia 是视频选择
            uni.chooseImage({
                count: count, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: [e], //从相册选择
                // mediaType: ['mix'], //文件类型 mix代表视频和图片都可选择
                success: (res) => {
                    // const filePaths = res.tempFiles
                    // for (let i = 0; i < filePaths.length; i++) {
                    //     if (filePaths[i].fileType == 'image') {
                    //         this.send(filePaths[i].tempFilePath, 1)
                    //     } else if (filePaths[i].fileType == 'video') {
                    //         this.send(filePaths[i].tempFilePath, 3)
                    //     }
                    // }
                    // this.send(filePaths[i], 1)
                    const filePaths = res.tempFilePaths
                    for (let i = 0; i < filePaths.length; i++) {
                        // 调用文件上传接口
                        uni.uploadFile({
                            url: upload,
                            filePath: filePaths[i],
                            name: 'file',
                            header: {
                                accessToken: storage.getAccessToken()
                            },
                            success: (uploadFileRes) => {
                                let data = JSON.parse(uploadFileRes.data)
                                if (data.code == 200) {
                                    uni.showLoading({ title: "正在发送，请勿关闭聊天窗口" })
                                    let that = this;
                                    setTimeout(() => {
                                        that.send(data.result, 1)
                                        uni.hideLoading();
                                    }, 1500)
                                } else {
                                    this.$u.toast('上传失败，请稍后重试')
                                }
                            }
                        })
                    }
                }
            })
        },
        // 用户相机授权权限后的回调
        changeAuthCamera() {
            this.$refs['authpup'].open(); // 调起相册权限目的弹框
        },

        // 用户相册授权权限后的回调
        changeAuth() {
            // 这里是权限通过后执行自己的代码逻辑
            console.log('权限已授权，可执行自己的代码逻辑了');
        },
        //音频处理
        //开始录音
        touchstart(e) {

            this.pageY = e.changedTouches[0].pageY
            this.voicebg = true
            let i = 1
            this.timer = setInterval(() => {
                this.vlength = i
                i++

                //结束计时
                if (i > 60) {
                    clearInterval(this.timer)
                    this.touchend()
                }
            }, 1000)
            recorderManager.start({ format: 'mp3' })


        },
        //删除录音
        touchmove(e) {

            if (this.pageY - e.changedTouches[0].pageY > 100) {
                // 关闭录音界面
                this.voicebg = false
            }
        },
        // 结束录音
        touchend() {

            clearInterval(this.timer)
            recorderManager.stop()
            // recorderManager.onStop(function(res) {
            recorderManager.onStop((res) => {

                uni.uploadFile({
                    url: upload,
                    filePath: res.tempFilePath,
                    name: 'file',
                    header: {
                        accessToken: storage.getAccessToken()
                    },
                    success: (uploadFileRes) => {
                        let fileData = JSON.parse(uploadFileRes.data)

                        if (fileData.code == 200) {
                            let data = {
                                voice: fileData.result,
                                time: this.vlength
                            }
                            if (this.voicebg) {
                                this.send(data, 2)
                            }
                            // //时长归位
                            this.vlength = 0
                            this.voicebg = false

                        } else {
                            this.$u.toast('上传失败，请稍后重试')
                        }
                    }
                })
                // self.voicePath = res.tempFilePath;
            })
        },
        // 视频发送
        sendVideo() {
            uni.chooseVideo({
                sourceType: ['album', 'camera'], //从相册选择
                compressed: true, // 是否压缩所选的视频源文件
                maxDuration: 60,// 拍摄视频最长拍摄时间，单位秒。最长支持 60 秒。
                success: (res) => {

                    const filePaths = res.tempFilePath
                    // for (let i = 0; i < filePaths.length; i++) {
                    // 调用文件上传接口
                    uni.uploadFile({
                        url: upload,
                        filePath: filePaths,
                        name: 'file',
                        header: {
                            accessToken: storage.getAccessToken()
                        },
                        success: (uploadFileRes) => {
                            let data = JSON.parse(uploadFileRes.data)

                            if (data.code == 200) {
                                this.send(data.result, 3)
                            } else {
                                this.$u.toast('上传失败，请稍后重试')
                            }
                        }
                    })
                    // }

                }
            })
        },
        //获取位置
        choseLocation() {
            uni.chooseLocation({
                // success: function(res) {
                success: (res) => {
                    let data = {
                        name: res.name,
                        address: res.address,
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                    this.send(data, 3)

                }
            })
        },
        //发送
        send(msg, type) {
            let date = {
                message: msg,
                type: type
            }
            this.$emit('inputs', date)
            setTimeout(() => {
                this.msg = ''
            }, 0)
        },
        collect(value) {
            this.$emit('collect', value)
        }
    }
}
</script>

<style lang="scss" scoped>
.submit {
    background: rgba(244, 244, 244, 0.96);
    border-top: 1px solid rgba(39, 40, 50, 0.1);
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 100;
    box-sizing: border-box;
}

.top-box {
    display: flex;
    align-items: center;
    padding: 0 20rpx;

    .name {
        padding: 14rpx;
        border: 1rpx solid #e6dddd;
        margin: 14rpx 10rpx 0rpx;
        border-radius: 88rpx;
        font-size: 22rpx;
    }
}

.submit-bottom {
    padding-bottom: env(safe-area-inset-bottom);
}

.displaynone {
    display: none;
}

.disableBtn {
    background-color: #d6d6d6 !important;
}

.submit-chat {
    width: 100%;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding: 14rpx 14rpx;

    .bt-img {
        .btn {
            font-size: 28rpx;
            white-space: nowrap;
            margin: 0 auto;
            padding: 0 20rpx;
            border-radius: 0rpx;
            color: #ffffff;
            background-color: #4865ff;
            border-radius: 10rpx;
        }
    }

    image {
        width: 56rpx;
        height: 56rpx;
        margin: 0 10rpx;
        flex: auto;
    }

    .btn {
        flex: auto;
        background-color: #fff;
        border-radius: 10rpx;
        padding: 20rpx;
        max-height: 160rpx;
        margin: 0 10rpx;
    }

    .chat-send {
        line-height: 44rpx;
        color: black !important;
        text-align: left !important;
        max-height: 160rpx;
        overflow-y: auto;
    }

    .record {
        line-height: 44rpx;
        text-align: center;
        font-size: 20rpx;
        color: rgba(39, 40, 50, 0.6);
    }
}

.emoji {
    width: 100%;
    height: 460rpx;
    background: rgba(236, 237, 238, 1);
    box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);

    .emoji-send {
        width: 280rpx;
        height: 104rpx;
        padding-top: 24rpx;
        background-color: rgba(236, 237, 238, 0.8);
        position: fixed;
        // bottom: 0;
        bottom: env(safe-area-inset-bottom);
        right: 0;
        display: flex;

        .emoji-send-bt {
            flex: 1;
            margin: 0 32rpx 0 20rpx;
            height: 80rpx;
            background: rgba(255, 228, 49, 1);
            font-size: 32rpx;
            text-align: center;
            line-height: 80rpx;
            border-radius: 12rpx;
        }

        .emoji-send-det {
            flex: 1;
            margin-left: 24rpx;
            height: 80rpx;
            background: #fff;
            font-size: 32rpx;
            text-align: center;
            line-height: 80rpx;
            border-radius: 12rpx;

            image {
                width: 42rpx;
                height: 32rpx;
            }
        }
    }
}

.more {
    width: 100%;
    height: 436rpx;
    background: rgba(236, 237, 238, 1);
    box-shadow: 0px 11rpx 0px 0px rgba(0, 0, 0, 0.1);
    bottom: env(safe-area-inset-bottom);
    padding: 8rpx 20rpx;
    box-sizing: border-box;

    .more-list {
        width: 25%;
        text-align: center;
        float: left;
        padding-top: 32rpx;

        image {
            width: 72rpx;
            height: 72rpx;
            padding: 24rpx;
            background: rgba(255, 255, 255, 1);
            border-radius: 24rpx;
        }

        .more-list-title {
            font-size: 24rpx;
            color: rgba(39, 40, 50, 0.5);
            line-height: 34rpx;
        }
    }
}

.voice-bg {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1001;

    .voice-bg-len {
        height: 84rpx;
        width: 600rpx;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 42rpx;
        text-align: center;
    }

    .voice-bg-time {
        display: inline-block;
        min-width: 120rpx;
        line-height: 84rpx;
        background-color: rgba(255, 228, 49, 1);
        border-radius: 42rpx;
    }

    .voice-del {
        position: absolute;
        bottom: -480rpx;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 28rpx;
    }
}
</style>
