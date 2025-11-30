<template>
    <view class="nodeList">
        <!-- 暂时空白内容 -->
        <image class="list-cen-img" :src="icon"></image>
        <view class="list-cen-text">{{ text }}</view>
    </view>
</template>
<script>
export default{
    props:{
        icon:{
            type:String,
            default:"/static/cbd/icon_management.png"
        },
        text:{
            type:String,
            default:"暂无数据"
        }
    },
    data(){
        return{
        }
    }
}

</script>

<style lang="scss" scoped>
.nodeList {
    width: 370rpx;
    //height: 100%;
    height: 404rpx;
    position: relative;
    left:calc(50% - (370rpx / 2) ) ;
    top:calc(50% - 202rpx );
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .list-cen-img {
        width: 370rpx;
        height: 320rpx;
        //margin-top: -360rpx;
    }

    .list-cen-text {
        width: 100%;
        height: 34rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #666666;
        text-align: center;
    }
}
</style>
