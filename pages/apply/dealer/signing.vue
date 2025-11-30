<template>
    <view class="container">
        <view class="wrap-box">
            <view class="signature-box">
                <button size="mini" class="signature" @tap="signature('clear')">清 空</button>
                <button size="mini" class="signature" @tap="signature('undo')">撤 销</button>
                <button size="mini" class="signature" @tap="signature('save')">保 存</button>
            </view>
            <view class="signature-wrap" style="width: calc(100% - 80rpx)">
                <l-signature disableScroll backgroundColor="#ddd" ref="signatureRef" :penColor="penColor" :landscape="true"
                    :penSize="penSize"></l-signature>
            </view>
        </view>
    </view>
</template>

<script>

import storage from '@/utils/storage.js';
import { uploadPrivateFile } from "../../../api/common";

export default {
    name: '',
    components: {

    },
    data() {
        return {
            signImage: '', // 签名
            penColor: 'black', // 签名颜色
            penSize: 5 // 签名字体大小
        }
    },
    methods: {
        signature(type) {
            if (type == 'save') {
                this.$refs.signatureRef.canvasToTempFilePath({
                    success: (res) => {
                        // 是否为空画板 无签名

                        if (res.isEmpty) {
                            this.$u.toast("请手写签名")
                            return
                        }
                        // res.tempFilePath生成图片的临时路径
                        // H5 生成的是base64
                        uni.showLoading({})
                        uni.uploadFile({
                            url: uploadPrivateFile,
                            filePath: res.tempFilePath,
                            name: "file",
                            header: {
                                accessToken: storage.getAccessToken(),
                            },
                            success: (res) => {
                                let data = JSON.parse(res.data);
                                uni.hideLoading()
                                this.signImage = data.result
                                // 触发上一页的picker
                                uni.$emit('picker', this.signImage)
                                uni.navigateBack({})
                            },
                        });
                    }
                })
                return
            }
            if (this.$refs.signatureRef) this.$refs.signatureRef[type]()
        }
    },
    onLoad: function (options) { },
    onShow: function () { }
}
</script>

<style>
page {
    height: 100%;
}

.container {
    height: 100%;
}

.wrap-box {
    padding: 24rpx;
    display: flex;
    height: 100%;
    box-sizing: border-box;
}

.signature-box {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 20rpx;
    flex-direction: column;
    width: 80rpx;
}

.signature-box>button {
    width: 160rpx;
    margin: 0;
    margin-bottom: 180rpx;
    transform: rotate(90deg);
    border-radius: 60rpx;
    text-align: center;
    color: #FFF;
    font-size: 30rpx;
    background: linear-gradient(270deg, #42B97D 0%, #02D87F 100%);
}
</style>
