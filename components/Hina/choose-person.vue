<template>
    <view class="cu-modal bottom-modal" :class="visible ? 'show' : ''">
        <view class="cu-dialog">
            <view class="cu-bar">
                <view class="action" @tap="hideModal">取消</view>
            </view>
            <view class="cu-list menu-avatar">
                <view class="cu-item" v-for="(item, index) in roleArr" :key="index" @tap="checkPerson(item)" v-if="userType != item.userType">
                    <image class="cu-avatar" :src="item.avatar ? item.avatar : defaultAvatar"></image>
                    <view class="name">
                        <view class="text-grey">{{ item.name }}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        visible:{
            type: Boolean,
			default: false
        },
        userType:{
            type: String,
			default: ''
        },
        roleArr:{
            type: Array,
			default: () => []
        }
    },
    data() {
        return {
            arrPersonData: [],
            defaultAvatar: `${this.iconCommon}/profile/men.png`, // 默认头像
        }
    },

    methods: {

        hideModal() {
            this.$emit('update:visible', false)
        },
        checkPerson(item) {
            this.$emit('check-person', {name:item.name,personId:item.userId})
        }
    }
}
</script>

<style lang="scss">
.cu-modal {
    position: absolute;
    bottom: 300rpx;
    background: #fff;
    border-radius: 50rpx;
    width: 100%;
}

.cu-bar {
    text-align: right;
    padding: 20rpx;
}
.cu-list {
    padding: 0 20rpx 20rpx;
    .cu-item {
        display: flex;
        align-items: center;
        margin: 20rpx;
        .cu-avatar {
            height: 100rpx;
            width: 100rpx;
            border-radius: 50%;
        }
        .name {
            margin-left: 20rpx;
        }
    }
}
</style>
