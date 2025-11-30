<template>
    <view class="container">
        <view class="frm-comm">
            <view class="rs rs-line">
                <view class="lab">收件人</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.name" placeholder="请输入收件人姓名" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">手机号</view>
                <view class="txt flex">
                    <input class="s-text" inputmode="tel" v-model="form.mobile" placeholder="请输入收件人电话" />
                </view>
            </view>
            <view class="rs rs-line rs-auto">
                <view class="lab lab-require">所在区域</view>
                <view class="txt flex">
                    <view class="s-text region-input" @tap="showPicker" :class="{ 'placeholder': !form.___path }">
                        {{ form.___path || '请选择所在地区' }}
                    </view>
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab lab-require">地址别名</view>
                <view class="txt flex">
                    <input class="s-text" inputmode="tel" v-model="form.alias" placeholder="请输入地址别名" />
                </view>
            </view>
            <view class="rs rs-line">
                <view class="lab">详细地址</view>
                <view class="txt flex">
                    <input class="s-text" v-model="form.address" placeholder="请输入详细地址" />
                </view>
            </view>
        </view>

        <view class="fixed-link">
            <view class="btn" @tap="handlerSave">保存</view>
        </view>
        <m-city :provinceData="list" headTitle="区域选择" ref="cityPicker" @funcValue="getpickerParentValue" pickerSize="4">
        </m-city>

    </view>
</template>

<script>
import { editAddress, getAddressDetail } from '@/api/address.js'
import city from '@/components/m-city/m-city.vue'
import { editStoreAddress, getStoreAddressDetail } from "../../../api/store";
export default {
    name: '',
    components: {
        'm-city': city
    },
    data() {
        return {
            isComplete: false,
            curCode: '', // 当前地址ID
            form: {
                address: '', //地址详情
                name: '', //收货人姓名
                mobile: '', //手机号码
            },
            isCanSubmit: true,//默认可点击
            list: [
                {
                    id: '',
                    localName: '请选择',
                    children: []
                }
            ],
        }
    },
    methods: {
        loadAddressDetail(id) {
            uni.showLoading({
                title: '加载中'
            })
            // 如果当前是编辑地址,则需要查询出地址详情信息
            if (id) {
                getStoreAddressDetail(id).then((res) => {
                    const params = res.data.result
                    params.___path = params.consigneeAddressPath
                    this.$set(this, 'form', params)
                    this.form.id = id
                    if (this.$store.state.isShowToast) {
                        uni.hideLoading()
                    }
                })
            }
            uni.hideLoading()
        },

        // 执行数据保存
        handlerSave: function () {
            let form = this.form
            if (!form.name) {
                this.$u.toast('请输入收件人')
                return
            }
            if (!form.mobile) {
                this.$u.toast('请输入手机号')
                return
            }
            if (!this.$u.test.mobile(form.mobile)) {
                this.$u.toast('请正确输入手机号')
                return
            }
            if (!form.___path) {
                this.$u.toast('请选择所在地区')
                return
            }
            if (!form.address) {
                this.$u.toast('请输入详细地址')
                return
            }
            if (!form.alias) {
                delete form.alias
            }
            if (!this.isCanSubmit) return
            this.isCanSubmit = false
            // 修改地址
            delete this.form.updateBy
            delete this.form.updateTime

            editStoreAddress(this.form).then((res) => {
                if (res.data.success) {
                    this.$u.toast('修改成功')
                    uni.navigateBack()
                }
                this.isCanSubmit = true
            })
        },
        // 三级地址联动回调
        getpickerParentValue(e) {

            // 将需要绑定的地址设置为空，并赋值
            this.form.consigneeAddressIdPath = []
            this.form.consigneeAddressPath = []
            let name = ''

            e.forEach((item, index) => {
                if (item.id) {
                    // 遍历数据
                    this.form.consigneeAddressIdPath.push(item.id)
                    this.form.consigneeAddressPath.push(item.localName)
                    name += item.localName
                    this.form.___path = name
                }
                if (index == e.length - 1) {
                    //如果是最后一个
                    let _town = item.children.filter((_child) => {
                        return _child.id == item.id
                    })

                    this.form.lat = _town[0].center.split(',')[1]
                    this.form.lon = _town[0].center.split(',')[0]
                }
            })
        },
        // 显示三级地址联动
        showPicker() {
            this.$refs.cityPicker.show()
        }
    },
    onLoad: function (option) {
        let data = option.data ? option.data : ''
        if (data.length == 0) {
            uni.navigateTo({
                url: '/pages/address/Address'
            })
        }
        // 加载地址信息
        this.form = JSON.parse(data)
        this.loadAddressDetail(this.form.id)
    },
    onShow: function () { }
}
</script>

<style lang="scss" scoped>
.container {
    background: #f1f1f1;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20rpx;
}
.region-input {
    min-height: 80rpx;
    line-height: 80rpx;
    padding: 0 20rpx;
    background-color: #fff;
    border-radius: 8rpx;
    box-sizing: border-box;

    &.placeholder {
        color: grey
    }
}
</style>
