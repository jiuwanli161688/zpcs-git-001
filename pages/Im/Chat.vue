<template>
    <view class="content">
        <!-- 聊天内容 -->
        <scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop"
            @scrolltoupper="loadMoreMessage" :scroll-into-view="scrollToView">
            <view class="chat-main" :style="{ paddingBottom: inputh + 38 + 'px' }">
                <view class="chat-ls" v-for="(item, index) in unshiftmsg" :key="index" :id="'msg' + index">
                    <!-- && item.msgType = 5 代表的是有人加入群聊的系统消息，不在消息中展示 -->
                    <!-- item.propType 代表的是否是自己push进去的提示信息 -->
                    <!-- item.businessType!=3 代表的是订单时间到了，订单结束了，结束会话（结束会话不使用历史消息的内容，使用自己push的） -->
                    <!-- item.msgType == 1代表是用户消息，只有用户消息需要显示时间，显示在左右两边呈对话形式 -->
                    <!-- item.msgType == 2代表是系统消息，系统消息不需要对话形式显示，只展示在中间特殊样式 -->
                    <!-- item.msgType == 7代表是供应商给用户发送的下单信息 -->
                    <view class="chat-time" v-if="item.timestamp != '' && item.msgType == 1">{{
                        changeTime(item.timestamp) }}</view>

                    <!-- 撤回消息处理 -->
                    <view class="msg-m msg-revoked" v-if="item.isRevoked === '1'">
                        <view class="revoked-text">
                            {{ (item.from == myId ? '你' : item.name ? `"${item.name}"` : '对方') + '撤回了一条消息' }}
                        </view>
                    </view>

                    <view class="msg-m msg-left" v-else-if="item.msgType == 7">
                        <!-- <image class="user-img" v-if="item.from == '-1'" :src="systemAvatar"> </image>
                        <image class="user-img" v-if="item.from != '-1'"
                            :src="userInfoObj[item.from].avatar ? userInfoObj[item.from].avatar : defaultAvatar">
                        </image> -->
                        <!-- 商品卡片消息 -->
                        <view style="text-align: left;">
                            <!-- <view class="nickName" v-if="item.from != '-1'">{{ userInfoObj[item.from].nickName }}</view> -->
                            <view class="msg-text msg-text-right" style="border-radius: 35rpx">
                                <view class="goods-card u-flex u-row-between u-p-b-0" style="width: 100%; margin: 0 0">
                                    <view style="display: flex;flex-direction: column;">
                                        <view class="goods-card u-flex u-row-between u-p-b-0">
                                            <view class="image-box">
                                                <image class="image" :src="item.content.orderItems[0].image"
                                                    mode="widthFix">
                                                </image>
                                            </view>
                                            <view class="goods-desc">
                                                <view class="goods-desc-name">
                                                    <text class="goods-card-goods-name">{{
                                                        item.content.orderItems[0].goodsName
                                                    }}</text>
                                                </view>
                                                <view class="goods-desc-rice">￥{{ item.content.orderItems[0].price |
                                                    unitPrice }}
                                                </view>
                                            </view>
                                        </view>
                                        <view style="font-size:24rpx;padding:4rpx;margin-left:8rpx">
                                            <view style="text-align: center;font-size:28rpx;font-weight: bold;">请确认收货地址
                                            </view>
                                            <view>收件人：{{ item.content.consigneeName }}</view>
                                            <view>手机号码：{{ item.content.consigneeMobile }}</view>
                                            <view>详细地址：{{ item.content.fullAddress }}</view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="msg-m msg-left" v-else-if="item.from != myId && !item.propType && item.msgType == 1">
                        <image class="user-img" v-if="item.from == '-1'" :src="systemAvatar"> </image>
                        <!-- <image class="user-img" v-if="item.from != '-1'"
                            :src="userInfoObj[item.from].avatar ? userInfoObj[item.from].avatar : defaultAvatar">
                        </image> -->
                        <!-- <view class="system-msg-prop" v-if="item.from == '-1'">系统</view> -->
                        <view style="text-align: left;">
                            <!-- <view class="nickName">{{ userInfoObj[item.from].nickName }}</view> -->
                            <view class="message" v-if="item.contentType == 0">
                                <!-- 商品卡片消息 -->
                                <view v-if="item.businessType == 1" class="msg-text msg-text-right"
                                    style="border-radius: 35rpx" @tap="jumpGoodDesc(item.content)">
                                    <!-- <view class="goods-card u-flex u-row-between u-p-b-0" style="width: 100%; margin: 0 0">
                                        <view class="image-box" @tap="jumpGoodDesc(item.content)">
                                            <image class="image" :src="item.content['thumbnail']" mode="widthFix">
                                            </image>
                                        </view>
                                        <view class="goods-desc" @tap="jumpGoodDesc(item.content)">
                                            <view class="goods-desc-name">
                                                <text class="goods-card-goods-name">{{ item.content['goodsName']
                                                }}</text>
                                            </view>
                                            <view class="goods-desc-rice">￥{{ item.content['price'] | unitPrice }}
                                            </view>
                                        </view>
                                    </view> -->
                                    <goods-item-msg :info="item.content"></goods-item-msg>
                                </view>

                                <!-- 订单卡片消息 -->
                                <view v-else-if="item.businessType == 4" class="msg-text msg-text-right"
                                    @tap="linkTosOrders(item.content)">
                                    <!-- <view class="order-sn">
                                        <div class="wes">订单号：{{ item.content['sn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['thumbnail']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['orderStatusValue'] }}</div>
                                            </view>
                                        </div> -->
                                    <!-- <view class="order-list">
                                        <view class="order-time">
                                            <text>{{ JSON.parse(item.content)['paymentTime'] }}</text>
                                        </view>
                                    </view> -->
                                    <!-- </view> -->
                                    <goods-item-msg :info="item.content"></goods-item-msg>
                                </view>
                                <!-- 售后卡片消息 -->
                                <view v-else-if="item.businessType == 2" class="msg-text msg-text-right"
                                    @tap="linkTosSale(item.content)">
                                    <!-- <view class="order-sn">
                                        <div class="wes">售后号：{{ item.content['sn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['goodsImage']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['serviceStatusText'] }}[{{
        item.content['serviceType'] == 'RETURN_GOODS' ? '退货' : '换货' }}] </div>
                                            </view>
                                        </div>
                                    </view> -->
                                    <product-item-msg :info="item.content"></product-item-msg>
                                </view>
                                <!-- 投诉卡片 -->
                                <view v-else-if="item.businessType == 3" class="msg-text-card msg-text-right"
                                    @tap="linkTosComplaint(item.content)">
                                    <!-- <view class="order-sn">
                                        <div class="wes">投诉号：{{ item.content['complaintSn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['goodsImage']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['complainStatusText'] }}</div>
                                            </view>
                                        </div>
                                    </view> -->
                                    <product-item-msg :info="item.content"></product-item-msg>
                                </view>

                                <!-- 智能场景 -->
                                <view class="knowledge-box msg-text-left"
                                    v-else-if="item.businessType == 6 && item.content && item.content.step">
                                    <view v-if="item.content.step == 1">
                                        <view v-if="item.content.knowledgeData.length != 0">
                                            <view style="margin-bottom: 5px">
                                                <image style="width:68px;height: 16px"
                                                    :src="guess" />
                                            </view>
                                            <view v-for="data in item.content.knowledgeData" :key="data.id"
                                                @click="clickKnowledge(data, item.content)" class="knowledge">
                                                <div class="one-row">
                                                    {{ data.title }}
                                                    <i style="float: right;margin-top: 2px" class="el-icon-arrow-right" />
                                                </div>
                                            </view>
                                        </view>
                                        <view v-else>
                                            请问有什么业务问题可以帮助您吗？
                                        </view>
                                    </view>
                                    <view v-if="[2, 3].indexOf(item.content.step) != -1 && item.content.event">
                                        <view v-if="item.content.event.eventType == 'PUBLISHMESSAGE'"
                                            v-html="JSON.parse(item.content.event.eventContent).content">
                                        </view>
                                        <view v-if="item.content.event.eventType == 'QUERYLOGISTICS'">

                                            {{ JSON.parse(item.content.event.eventContent).content ?
                                                JSON.parse(item.content.event.eventContent).content : '查询物流异常' }}
                                        </view>
                                        <view v-if="item.content.event.eventType == 'SELECTORDER'">

                                        </view>
                                        <view v-if="item.content.event.eventType == 'TEXTJUMP'">
                                            <button type="primary" size="mini"
                                                @click="JumpForAI(JSON.parse(item.content.event.eventContent).jumpStatus, item.content)">{{
                                                    jumpStatusName[JSON.parse(item.content.event.eventContent).jumpStatus]
                                                }}</button>
                                        </view>
                                    </view>
                                </view>
                                <!-- 普通文字信息 -->

                                <view class="msg-text msg-text-left" style="display: inline-block;" v-else>{{ item.content
                                }}</view>
                                <!-- 文字 -->
                                <!-- <text style="word-break: break-all" class="msg-text msg-text-left" v-if="!emojistwo.includes(item.content)">{{ item.content }}</text> -->
                                <!-- 文字-表情 -->
                                <!-- <view class="msg-text msg-text-left" v-if="emojistwo.includes(item.content)" v-html="textReplaceEmoji(item.content)"></view> -->
                            </view>
                            <!-- 文件消息 -->
                            <view class="message picture-right" v-if="item.contentType == 4"
                                @tap="previewFile(item.content)">
                                <view class="msg-text msg-text-left goods-card u-flex u-row-between u-p-b-0"
                                    style="width: 100%; margin: 0 0; height: 100%">
                                    <view class="file-box">
                                        <view class="file-name">{{ JSON.parse(item.content)['name'] }}</view>
                                        <view class="file-size">{{ formatSize(JSON.parse(item.content)['fileSize']) }}
                                        </view>
                                    </view>
                                    <image :src="fileIcon" class="file-img"></image>
                                </view>
                            </view>
                            <!-- 图像 -->
                            <view class="message picture-left" v-if="item.contentType == 1" @tap="previewImg(item.content)">
                                <image :src="item.content" class="msg-img" mode="widthFix"></image>
                            </view>
                            <!-- 音频 -->
                            <view class="message" style="display: inline-block;" v-if="item.contentType == 2"
                                @tap="playVoice(item.content.voice)">
                                <view class="msg-text voice" :style="{ paddingRight: item.content.time * 4 + 'rpx' }">
                                    <image :src="iconVoiceLeft" class="voice-img playing"></image>
                                    {{ item.content.time }}″
                                </view>
                            </view>
                            <!-- 视频 -->
                            <view class="message picture-right mp4" v-if="item.contentType == 3" :data-file="item.content"
                                @tap="handlerPlayVideo">
                                <image class="icon" :src="item.content + '?x-oss-process=video/snapshot,t_0,f_jpg'"
                                    mode="aspectFill"></image>
                                <view class="link"><u-icon name="play-right-fill" color="#ffffff" size="40"></u-icon></view>
                                <!-- <video ref="video" class="video-size" object-fit="cover" :src="item.content" :poster="item.content+'?x-oss-process=video/snapshot,t_0,f_jpg'"
                                    @fullscreenchange="fullscreenchange" :vslide-gesture="false" :page-gesture="false"
                                    :vslide-gesture-in-fullscreen="false" :controls="true" ></video> -->
                            </view>
                            <!-- <view class="message picture-right" v-if="item.contentType == 3">
                                <video ref="video" class="video-size" object-fit="cover" :src="item.content" :poster="item.content+'?x-oss-process=video/snapshot,t_0,f_jpg'"
                                    @fullscreenchange="fullscreenchange" :vslide-gesture="false" :page-gesture="false"
                                    :vslide-gesture-in-fullscreen="false" :controls="true"></video>
                            </view> -->
                        </view>

                        <!-- 位置 -->
                        <!-- <view class="message" v-if="item.contentType == 3" @tap="openLocation(item.content)">
							<view class="msg-map">
								<view class="map-name">{{item.content.name}}</view>
								<view class="map-address">{{item.content.address}}</view>
								<map class="map" :longitude="item.content.longitude" :latitude="item.content.latitude"
									:markers="covers(item.content)"></map>
							</view>
						</view> -->
                    </view>
                    <view class="msg-m msg-right" v-else-if="item.from == myId && !item.propType && item.msgType == 1"
                        @touchstart="handleTouchStart(item, $event)"
                        @touchend="handleTouchEnd()"
                        @touchcancel="handleTouchEnd()"
                        @longpress="showRecallMenuForMessage(item, $event)"
                    >
                        <!-- <image class="user-img" :src="userInfoObj[myId].avatar ? userInfoObj[myId].avatar : defaultAvatar">
                        </image> -->
                        <view style="text-align: right;">
                            <!-- <view class="nikeName">{{ userInfoObj[myId].nickName }}</view> -->
                            <view class="message" v-if="item.contentType == 0">
                                <!-- 商品卡片消息 -->
                                <view v-if="item.businessType == 1" class="msg-text-card msg-text-right"
                                    style="border-radius: 35rpx" @tap="jumpGoodDesc(item.content)">
                                    <!-- <view class="goods-card u-flex u-row-between u-p-b-0" style="width: 100%; margin: 0 0">
                                        <view class="image-box" @tap="jumpGoodDesc(item.content)">
                                            <image class="image" :src="item.content['thumbnail']" mode="widthFix">
                                            </image>
                                        </view>
                                        <view class="goods-desc" @tap="jumpGoodDesc(item.content)">
                                            <view class="goods-desc-name">
                                                <text class="goods-card-goods-name">{{ item.content['goodsName']
                                                }}</text>
                                            </view>
                                            <view class="goods-desc-rice">￥{{ item.content['price'] | unitPrice }}
                                            </view>
                                        </view>
                                    </view> -->
                                    <goods-item-msg :info="item.content"></goods-item-msg>
                                </view>
                                <!-- 订单卡片消息 -->
                                <view v-else-if="item.businessType == 4" class="msg-text-card msg-text-right"
                                    @tap="linkTosOrders(item.content)">
                                    <!-- <view class="order-sn">
                                        <div class="wes">订单号：{{ item.content['sn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['thumbnail']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['orderStatusValue'] }}</div>
                                            </view>
                                        </div> -->
                                    <!-- <view class="order-list">
                                        <view class="order-time">
                                            <text>{{ JSON.parse(item.content)['paymentTime'] }}</text>
                                        </view>
                                    </view> -->
                                    <!-- </view> -->
                                    <goods-item-msg :info="item.content"></goods-item-msg>
                                </view>
                                <!-- 售后卡片消息 -->
                                <view v-else-if="item.businessType == 2" @tap="linkTosSale(item.content)"
                                    class="msg-text-card msg-text-right">
                                    <!-- <view class="order-sn">
                                        <div class="wes">售后号：{{ item.content['sn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['goodsImage']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['serviceStatusText'] }}[{{
        item.content['serviceType'] == 'RETURN_GOODS' ? '退货' : '换货' }}] </div>
                                            </view>
                                        </div>
                                    </view> -->
                                    <product-item-msg :info="item.content"></product-item-msg>
                                </view>
                                <!-- 投诉卡片 -->
                                <view v-else-if="item.businessType == 3" class="msg-text-card msg-text-right"
                                    @tap="linkTosComplaint(item.content)">
                                    <!-- <view class="order-sn">
                                        <div class="wes">投诉号：{{ item.content['complaintSn'] }}</div>
                                        <div class="order-item flex">
                                            <u-image mode="widthFix" width="120rpx" height="120rpx"
                                                :src="item.content['goodsImage']" />
                                            <view class="name-or-time">
                                                <div class="wes-2">{{ item.content['goodsName'] }}</div>
                                                <div class="main-color goods-desc-rice">{{
                                                    item.content['complainStatusText'] }}</div>
                                            </view>
                                        </div>
                                    </view> -->
                                    <product-item-msg :info="item.content"></product-item-msg>
                                </view>
                                <!-- 普通文字信息 -->
                                <view class="msg-text msg-text-right" style="display: inline-block;" v-else>{{ item.content
                                }}</view>
                            </view>

                            <!-- 图片消息 -->
                            <view class="message picture-right" v-if="item.contentType == 1"
                                @tap="previewImg(item.content)">
                                <image :src="item.content" class="msg-img" mode="widthFix"></image>
                            </view>
                            <!-- 音频 -->
                            <view class="message" style="display: inline-block;" v-if="item.contentType == 2"
                                @tap="playVoice(item.content.voice)">
                                <view class="msg-text voice" :style="{ paddingRight: item.content.time * 4 + 'rpx' }">
                                    {{ item.content.time }}″
                                    <image :src="iconVoice" class="voice-img"></image>
                                </view>
                            </view>
                            <!-- 视频 -->
                            <view class="message picture-right mp4" v-if="item.contentType == 3" :data-file="item.content"
                                @tap="handlerPlayVideo">
                                <image class="icon" :src="item.content + '?x-oss-process=video/snapshot,t_0,f_jpg'"
                                    mode="aspectFill"></image>
                                <view class="link"> <u-icon name="play-right-fill" color="#ffffff" size="40"></u-icon>
                                </view>
                                <!-- <video ref="video" class="video-size" object-fit="cover" :src="item.content" :poster="item.content+'?x-oss-process=video/snapshot,t_0,f_jpg'"
                                    @fullscreenchange="fullscreenchange" :vslide-gesture="false" :page-gesture="false"
                                    :vslide-gesture-in-fullscreen="false" :controls="true" ></video> -->
                            </view>
                        </view>
                        <!-- 位置 -->
                        <!-- <view class="message" v-if="item.contentType == 3" @tap="openLocation(item.content)">
							<view class="msg-map">
								<view class="map-name">{{item.content.name}}</view>
								<view class="map-address">{{item.content.address}}</view>
								<map class="map" :longitude="item.content.longitude" :latitude="item.content.latitude"
									:markers="covers(item.content)"></map>
							</view>
						</view> -->
                    </view>
                    <view class="complaint" v-if="item.msgType == 2">
                        <!-- <view class="complaint-box">
                            <view class="complaint-item" v-for="(complaint, complaintIndex) in dealerComplaintList"
                                :key="complaintIndex" @tap="clickComplaint('DISTRIBUTOR', complaintIndex)">
                                <image class="complaint-img" :src="complaint.icon"></image>
                                <view class="complaint-name">{{ complaint.name }}</view>
                            </view>
                        </view> -->
                        <sy-evaluate-card :bqObj="item.extra" :bqShow="false"
                            v-if="item.extra.satisfaction"></sy-evaluate-card>
                        <view class="end-content" v-if="!item.extra.satisfaction">{{ item.content }}</view>
                        <sy-evaluate-card :groupId="groupId" :createTime="item.createTime" :messageId="item.id"
                            :explainShow="true" v-if="!item.extra.satisfaction">{{
                                item.content
                            }}</sy-evaluate-card>
                    </view>
                    <!-- 排队消息 -->
                    <view class="complaint" v-if="item.msgType == 11">
                        <view class="end-content">{{ item.content }}</view>
                    </view>
                    <view class="" v-if="item.propType">
                        <view class="end-content" :class="{ groupProp: item.propType == 3 }">{{ item.content }}</view>
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- 底部商品卡片 -->
        <view
            :style="{ position: 'fixed', bottom: (type == 'business' || type == 'platform') ? (queueState ? inputh + 10 + 'px' : inputh + 'px') : inputh - 24 + 'px', width: '100%' }">

            <!-- 这里不知道localImGoodsId有没有用，h5不显示商品卡片先注释了 -->
            <!-- <view v-if="goodsShowHide && !localImGoodsId && showHideModel"> -->

            <view v-if="goodsShowHide && showHideModel">
                <!-- <view class="goods-card u-flex u-row-between u-p-b-0">
                    <view class="image-box" @tap="jumpGoodDesc(item.content)">
                        <image class="image" :src="goodListData.thumbnail" mode="widthFix"></image>
                    </view>
                    <view class="goods-desc" @tap="jumpGoodDesc(item.content)">
                        <view class="goods-desc-name">
                            <text class="goods-card-goods-name">{{ goodListData.goodsName }}</text>
                        </view>
                        <view class="goods-desc-rice"> ￥{{ goodListData.price | unitPrice }} </view>
                    </view>
                    <view class="cancel" @tap="cancelModel">X</view>
                    <view class="send-goods" @tap="sendGoodsMessage">
                        <view>发送商品</view>
                    </view>
                </view> -->
                <sy-float-order :name="goodListData.goodsName" :img="goodListData.thumbnail" :price="goodListData.price"
                    @emitSend="sendGoodsMessage"></sy-float-order>
            </view>
        </view>
        <!-- 底部订单卡片 -->
        <view
            :style="{ position: 'fixed', bottom: (type == 'business' || type == 'platform') ? (queueState ? inputh + 10 + 'px' : inputh + 'px') : inputh - 24 + 'px', width: '100%' }">
            <view v-if="orderShowHide">
                <!-- <view class="goods-card u-flex u-row-between u-p-b-0">
                    <view class="image-box" @tap="linkTosOrders(item.orderShowHidecontent)">
                        <image class="image" :src="orderData.thumbnail" mode="widthFix"></image>
                    </view>
                    <view class="goods-desc order-desc" @tap="linkTosOrders(item.content)">
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name">{{ orderData.sn }}</text>
                        </view>
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name order-card-goods-name">{{ orderData.goodsName }}</text>
                        </view>
                        <view class="goods-desc-rice"> {{ orderData.orderStatusValue }} </view>
                    </view>
                    <view class="cancel" @tap="orderCancelModel">X</view>
                    <view class="send-goods" @tap="sendOrderMessage">
                        <view>发送订单</view>
                    </view>
                </view> -->
                <sy-float-order :name="orderData.goodsName" :img="orderData.thumbnail" :price="orderData.price"
                    @emitSend="sendOrderMessage"></sy-float-order>
            </view>
        </view>
        <!-- 底部售后卡片 -->
        <view
            :style="{ position: 'fixed', bottom: (type == 'business' || type == 'platform') ? (queueState ? inputh + 10 + 'px' : inputh + 'px') : inputh - 24 + 'px', width: '100%' }">
            <view v-if="saleShowHide">
                <!-- <view class="cart-message" v-if="saleShowHide"> -->
                <!-- <view class="goods-card u-flex u-row-between u-p-b-0">
                    <view class="image-box" @tap="linkTosSale(item.content)">
                        <image class="image" :src="saleData.goodsImage" mode="widthFix"></image>
                    </view>
                    <view class="goods-desc order-desc" @tap="linkTosSale(item.content)">
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name">{{ saleData.sn }}</text>
                        </view>
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name order-card-goods-name">{{ saleData.goodsName }}</text>
                        </view>
                        <view class="goods-desc-rice"> {{ saleData.serviceStatusText }}[{{
                            saleData.serviceType == 'RETURN_GOODS' ? '退货' : '换货' }}] </view>
                    </view>
                    <view class="cancel" @tap="saleCancelModel">X</view>
                    <view class="send-goods" @tap="sendSaleMessage">
                        <view>发送售后</view>
                    </view>
                </view> -->
                <sy-float-order :name="saleData.goodsName" :img="saleData.goodsImage" :price="saleData.goodsPrice"
                    @emitSend="sendSaleMessage"></sy-float-order>
            </view>
        </view>
        <!-- 底部投诉卡片 -->
        <view
            :style="{ position: 'fixed', bottom: (type == 'business' || type == 'platform') ? (queueState ? (queueState ? inputh + 10 + 'px' : inputh + 'px') : inputh + 'px') : inputh - 24 + 'px', width: '100%' }">
            <view v-if="complaintShowHide">
                <!-- <view class="goods-card u-flex u-row-between u-p-b-0">
                    <view class="image-box" @tap="linkTosComplaint(item.content)">
                        <image class="image" :src="complaintData.goodsImage" mode="widthFix"></image>
                    </view>
                    <view class="goods-desc order-desc" @tap="linkTosComplaint(item.content)">
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name">{{ complaintData.complaintSn }}</text>
                        </view>
                        <view class="goods-desc-name order-desc-name">
                            <text class="goods-card-goods-name order-card-goods-name">{{ complaintData.goodsName
                            }}</text>
                        </view>
                        <view class="goods-desc-rice"> {{ complaintData.complainStatusText }}</view>
                    </view>
                    <view class="cancel" @tap="complaintCancelModel">X</view>
                    <view class="send-goods" @tap="sendComplaintMessage">
                        <view>发送投诉</view>
                    </view>
                </view> -->
                <sy-float-order :name="complaintData.goodsName" :img="complaintData.goodsImage"
                    :price="complaintData.goodsPrice" @emitSend="sendComplaintMessage"></sy-float-order>
            </view>
        </view>
        <view class="tips-btn" :style="{ width: '100%', bottom: inputh - 58 + 'px' }">
            <view class="tips-btn-left" v-if="queueState">排队等待中...总排队人数：{{ totalInQueue }}，当前位置：{{ myPosition }}</view>
            <view class="tips-btn-background">
                <scroll-view scroll-x="true" class="tips-scroll">
                    <u-tag class="item" color="#333333" bg-color="#FFFFFF" border-color="#FFAEAE" shape="circle" text="服务评价"
                        @tap="open_evaluate_view" />
                    <u-tag v-for="(item, index) in tips_btn" :key="index" class="item" color="#333333" bg-color="#FFFFFF"
                        border-color="#FFAEAE" shape="circle" :text="item.name" @tap="handleTipsBtnClick(item.url)" />
                </scroll-view>
            </view>
        </view>
        <submit ref="submit" v-if="submitShow" @inputs="inputs" @heights="heights" @collect="collect" :userType="userType"
            :type="type" :roleArr="roleArr"> </submit>
        <u-popup v-model="isShowVideo" close-icon-pos="top-left" border-radius="14" :closeable='true' height="100%"
            mode="bottom" @close="handlerHideVideo">
            <view class="video-box">

                <video id="player" style="object-fit: cover;" class="video-size"
                    src="https://zpwdsc.oss-cn-beijing.aliyuncs.com/MEMBER/1773551403415425024//9b536c2b435945a1b30676948ecb43d5.mp4"
                    :vslide-gesture-in-fullscreen="false" :controls="true"></video>
                <!-- <video id="player" class="video-size" :src="srcVideoMp4" :vslide-gesture-in-fullscreen="false" :controls="true"></video> -->
            </view>
        </u-popup>
        <!-- 主动评价-弹出层 -->
        <view class="evaluate-view">
            <u-popup v-model="evaluate_view" mode="bottom" border-radius="40">
                <view class="top">
                    <view></view>
                    <view class="title">请对本次客服的服务进行评价</view>
                    <view class="close">
                        <u-icon class="close-btn" @tap="close_evaluate_view" name="close" size="28"></u-icon>
                    </view>
                </view>
                <sy-evaluate-card :explainShow="true" :groupId="groupId"
                    @close_evaluate_view="close_evaluate_view"></sy-evaluate-card>
            </u-popup>
        </view>

        <!-- WebSocket重连提示 -->
        <view class="reconnect-overlay" v-if="reconnectState.isReconnecting">
            <view class="reconnect-container">
                <view class="reconnect-content">
                    <view class="reconnect-icon">
                        <u-icon name="wifi-off" size="60" color="#FF6B6B"></u-icon>
                    </view>
                    <view class="reconnect-title">网络连接异常</view>
                    <view class="reconnect-desc">正在尝试重新连接...</view>
                    <view class="reconnect-count">第 {{ reconnectState.count }} 次重连</view>
                    <view class="reconnect-loading">
                        <view class="loading-spinner"></view>
                    </view>
                    <view class="reconnect-actions">
                        <u-button type="error" size="mini" @click="stopReconnectFromReconnecting">退出聊天</u-button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 最大重连次数提示 -->
        <view class="reconnect-overlay" v-if="reconnectState.maxReconnectReached">
            <view class="reconnect-container">
                <view class="reconnect-content">
                    <view class="reconnect-icon">
                        <u-icon name="wifi-off" size="60" color="#FF6B6B"></u-icon>
                    </view>
                    <view class="reconnect-title">连接失败</view>
                    <view class="reconnect-desc">已达到最大重连次数</view>
                    <view class="reconnect-desc">请检查网络连接后重试</view>
                    <view class="reconnect-actions">
                        <u-button type="primary" size="mini" @click="manualReconnect" style="margin-right: 20rpx;">手动重连</u-button>
                        <u-button type="error" size="mini" @click="stopReconnectFromFailed">退出聊天</u-button>
                    </view>
                </view>
            </view>
        </view>

        <!-- 撤回菜单 -->
        <view class="recall-menu"
              v-if="showRecallMenu"
              :style="{ left: recallMenuPosition.x + 'px', top: recallMenuPosition.y + 'px' }"
              @tap.stop>
            <view class="recall-menu-item" @tap="handleRecallMessage" :disabled="!canRecallMessage(selectedMessage)">
                {{ canRecallMessage(selectedMessage) ? '撤回' : '超过2分钟，无法撤回' }}
            </view>
            <view class="recall-menu-item" @tap="hideRecallMenu">取消</view>
        </view>
        <!-- 选择商品-弹出层 -->
        <view class="consult-view">
            <u-popup v-model="consult_view" mode="bottom" border-radius="40">
                <view class="top">
                    <view class="title">请选择您要咨询的问题</view>
                    <u-icon class="close-btn" @tap="close_consult_view" name="close" size="28"></u-icon>
                </view>
                <view class="center">
                    <u-tabs-swiper ref="uTabs" :list="list" :current="consult_current" @change="tabsChange"
                        :show-bar="false" font-size="28rpx" active-color="#C83F24" inactive-color="#333333"
                        :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
                </view>
                <view class="bottom">
                    <swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
                        style="height: 100%;">
                        <!-- 我的订单 -->
                        <swiper-item class="swiper-item">
                            <view class="search">
                                <u-search placeholder="请输入商品名称" v-model="keyword" bg-color="#FFFFFF" :show-action="false"
                                    shape="square" @change="searchList"></u-search>
                            </view>
                            <scroll-view v-if="order_list.length" scroll-y @scrolltolower="onreachBottom"
                                style="height: 90%;">

                                <sy-order-num v-for="(item, index) in order_list" :key="index" :type="item.type"
                                    :orderNum="item.orderNum" :img="item.img" :name="item.name" :time="item.time"
                                    :orderStatus="item.orderStatus" :state2="item.state2" :num="item.num"
                                    :price="item.price" @emitSend="sendOrderMessage"></sy-order-num>
                            </scroll-view>
                            <view v-else class="empty">
                                <u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx" :src="`${iconCommon}/im/wudingdan.png`"></u-empty>
                            </view>
                        </swiper-item>
                        <!-- 我的售后 -->
                        <swiper-item class="swiper-item">
                            <view class="search">
                                <u-search placeholder="请输入商品名称" v-model="keyword2" bg-color="#FFFFFF" :show-action="false"
                                    shape="square" @change="searchList"></u-search>
                            </view>
                            <scroll-view v-if="sale_list.length" scroll-y @scrolltolower="onreachBottom"
                                style="height: 90%;">
                                <sy-order-num v-for="(item, index) in sale_list" :key="index" :type="item.type"
                                    :orderNum="item.orderNum" :img="item.img" :time="item.time" :name="item.name"
                                    :state1="item.state1" :state2="item.state2" :num="item.num" :price="item.price"
                                    :serviceType="item.serviceType" :serviceStatus="item.serviceStatus"
                                    @emitSend="sendSaleMessage"></sy-order-num>
                            </scroll-view>
                            <view v-else class="empty">
                                <u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
                                :src="`${iconCommon}/im/wudingdan.png`"></u-empty>
                            </view>
                        </swiper-item>
                        <!-- 我的浏览 -->
                        <swiper-item class="swiper-item">
                            <view class="search">
                                <u-search placeholder="请输入商品名称" v-model="keyword3" bg-color="#FFFFFF" :show-action="false"
                                    shape="square" @change="searchList"></u-search>
                            </view>
                            <scroll-view v-if="browse_list.length" scroll-y @scrolltolower="onreachBottom"
                                style="height: 90%;">
                                <sy-browse-card v-for="(item, index) in browse_list" :key="index" :img="item.img"
                                    :name="item.name" :tags="item.tags" :price="item.price" :skuId="item.skuId"
                                    :goodsId="item.goodsId" @emitSend="sendGoodsMessage"></sy-browse-card>
                            </scroll-view>
                            <view v-else class="empty">
                                <u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
                                :src="`${iconCommon}/im/wudingdan.png`"></u-empty>
                            </view>
                        </swiper-item>
                        <!-- 我的收藏 -->
                        <swiper-item class="swiper-item">
                            <view class="search">
                                <u-search placeholder="请输入商品名称" v-model="keyword4" bg-color="#FFFFFF" :show-action="false"
                                    shape="square" @change="searchList"></u-search>
                            </view>
                            <scroll-view v-if="swiper_list.length" scroll-y @scrolltolower="onreachBottom"
                                style="height: 90%;">
                                <sy-browse-card v-for="(item, index) in swiper_list" :key="index" :img="item.img"
                                    :name="item.name" :tags="item.tags" :price="item.price" :skuId="item.skuId"
                                    :goodsId="item.goodsId" @emitSend="sendGoodsMessage"></sy-browse-card>
                            </scroll-view>
                            <view v-else class="empty">
                                <u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx" :src="`${iconCommon}/im/wudingdan.png`"
                                   ></u-empty>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
            </u-popup>
        </view>
    </view>
</template>

<script>
import dateTime from '@/lib/dateTime.js'
import submit from '@/components/Hina/submit.vue'
import { createUser, getMessagePage, createFriend, getGroupInfoByGroupId, getUserInfo, getDistributorId, jumpObtain, getUserListByGroupId, refreshNowConsult, revokeMessage, getBroadcastId } from '@/api/im.js'
import storage from '@/utils/storage.js'
import { textReplaceEmoji, emojistwo } from '@/utils/emojis.js'
import { formatSize } from '@/utils/tools.js'
import { getOrderDetail } from '@/api/order.js'
import { getDealerOrderDetail } from "@/api/dealerCenter";
import {
    getServiceDetail,
} from "@/api/after-sale.js";
import { getComplainDetail } from "@/api/after-sale";
import {
    getImStoreOrder,
    getImStoreAfterOrder,
    getImStoreFoorpoint,
    getImStoreCollect,
    getImOrder,
    getImAfterOrder,
    getImFoorpoint,
    getImCollect
} from "@/api/address";

//音频播放
const innerAudioContext = uni.createInnerAudioContext()

export default {
    components: {
        submit
    },
    data() {
        return {
            // 长按检测相关变量
            longPressTimer: null,
            guess: `${this.iconCommon}/static/cainixiangwen.png`,
            // 确保所有需要的状态变量已定义
            showRecallMenu: false,
            recallMenuPosition: { x: 0, y: 0 },
            selectedMessage: null,
            showCount: 0,
            textReplaceEmoji,
            emojistwo,
            formatSize,
            jumpStatusName: {
                AFTER_SALE_APPLY: "跳转售后申请",
                MODIFY_ORDER: "跳转修改订单",
                ORDER_DETAIL: "跳转订单详情",
                SAFE_CENTER: "跳转安全中心",
                CREATE_DISPUTE: "跳转到交易纠纷创建界面",
                CONTACT_CUSTOMER_SERVICE: "联系人工客服",
                SHIPPING_REMINDER: "发货催单",
                LOGISTICS_REMINDER: "物流催单",
            },
            showOldOrder: true,
            myId: '',
            myName: storage.getUserInfo().nickName,
            otherId: '0',
            epH: "", // 自动获取可视区域的高度
            epW: "", // 自动获取可视区域的宽度(输入栏上方选择栏宽度)
            // 反转数据接收
            msg: [],
            unshiftmsg: [],
            imgMsg: [],
            oldTime: new Date(),
            inputh: 110,
            friendId: '', // 用户id
            groupId: '', // 群聊id
            defaultAvatar: `${this.iconCommon}/profile/men.png`, // 默认头像
            systemAvatar: `${this.iconCommon}/im/kefu.png`, // 系统头像
            iconVoice: `${this.iconCommon}//im/icon_voice.png`, // 语音图标右
            iconVoiceLeft: `${this.iconCommon}/im/icon_voice_left.png`, // 语音图标左
            userInfoObj: {}, // 用户信息对象
            scrollTop: null,
            scrollToView: '',
            submitShow: false, // 是否显示聊天输入框
            orderId: '', // 订单id
            storeId: '', // 店铺id
            distributorId: '', // 分平台服务商id
            type: '', // 是平台还是商家
            resolve: {}, // 传过来的商品信息
            goodListData: {}, // 商品数据
            goodsShowHide: true,
            showHideModel: undefined, // 商品弹框
            localImGoodsId: '',
            orderShowHide: undefined, // 订单弹框
            fileIcon: `${this.iconCommon}/static/v1/order/icon-otf.png`,
            orderData: {}, // 订单信息
            saleShowHide: undefined,// 售后弹框
            saleData: {}, // 售后信息
            complaintShowHide: undefined,// 投诉弹框
            complaintData: {}, // 投诉信息
            userType: '',// 当前人的角色
            roleArr: [],
            // 分平台服务商评价列表
            dealerComplaintList: [{
                icon: `${this.iconCommon}/im/complaint-good.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-good.png`,
                name: `满意`,
            }, {
                icon: `${this.iconCommon}/im/complaint-middle.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-middle.png`,
                name: `基本满意`,
            }, {
                icon: `${this.iconCommon}/im/complaint-difference.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-difference.png`,
                name: `不满意`,
            }],
            // 供应商评价列表
            supplierComplaintList: [{
                icon: `${this.iconCommon}/im/complaint-good.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-good.png`,
                name: `满意`,
            }, {
                icon: `${this.iconCommon}/im/complaint-middle.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-middle.png`,
                name: `基本满意`,
            }, {
                icon: `${this.iconCommon}/im/complaint-difference.png`,
                iconSel: `${this.iconCommon}/im/sel-complaint-difference.png`,
                name: `不满意`,
            }],
            appraiseInterval: null, // 评价定时器
            dealerHasRated: false,// 是否已经评价过分平台服务商
            supplierHasRated: false,// 是否已经评价过供应商
            memberId: '',// 用户订单下单人的id
            currentPage: 1, // 当前页
            total: 0, // 总页数
            isShowVideo: false,
            srcVideoMp4: '',
            consult_view: false, //咨询弹窗
            evaluate_view: false, //评价弹窗
            aiContent: {},
            tips_btn: [
                {
                    name: '退换/售后',
                    url: '/pages/profile/afterSales/home'
                },
                {
                    name: '我要催单',
                    url: '/pages/profile/order/home'
                },
                {
                    name: '发票服务',
                    url: '/pages/profile/invoice/home'
                },
                {
                    name: '账户与安全',
                    url: '/pages/config/security/home'
                },
                {
                    name: '修改订单',
                    url: '/pages/profile/order/home?state=2&source=updateOrder'
                },
                /*                {
                                    name: '电话客服',
                                    url: '/pages/customerService/service?title=电话客服'
                                },
                                {
                                    name: '专属客服',
                                    url: '/pages/Im/Chat?type=platform'
                                },
                                {
                                    name: '服务进度',
                                    url: '/pages/profile/afterSales/home'
                                },*/
            ],
            list: [{
                name: '我的订单'
            }, {
                name: '我的售后'
            }, {
                name: '我的浏览'
            }, {
                name: '我的收藏'
            }],
            order_list: [],
            sale_list: [],
            browse_list: [],
            swiper_list: [],
            consult_current: 0, // 控制swiper-item活动项
            swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
            keyword: '',
            keyword2: '',
            keyword3: '',
            keyword4: '',
            listParams: {
                pageSize: 10,
                pageNumber: 1,
            },
            knowledgeData: [
                {
                    id: '1',
                    title: '发布消息',
                    status: 'PUBLISHMESSAGE'
                },
                {
                    id: '2',
                    title: '选择订单',
                    status: 'SELECTORDER'
                },
                {
                    id: '3',
                    title: '查询物流',
                    status: 'QUERYLOGISTICS'
                },
                {
                    id: '4',
                    title: '文字跳转',
                    status: 'TEXTJUMP'
                },
            ],
            //用于判断是否还有更多数据
            notMore: false,
            queueState: false,
            isInQueue: 0,
            myPosition: 0,
            totalInQueue: 0,
            queueInterval: null,
            // WebSocket重连状态
            reconnectState: {
                isReconnecting: false,
                count: 0,
                maxReconnectReached: false
            },
            // 撤回功能相关状态
            showRecallMenu: false,
            recallMenuPosition: {
                x: 0,
                y: 0
            },
            selectedMessage: null,
            canRecallTime: 120000 // 2分钟（毫秒）
        }
    },
    //离开界面销毁socket
    beforeDestroy() {
        this.ws.wsDisConnect();
        clearInterval(this.queueInterval);
    },
    onShow() {
        var that = this;
        //从后台切换进来直接刷新界面
        if (this.showCount != 0) {
            // uni.reLaunch({
            //   url: `/pages/Im/Chat?type=platform`
            // })
            //清空消息列表
            this.unshiftmsg = [];
            this.currentPage = 0;
            this.getMessage();
            //从后台回来，主动重连socket，重新加载列表
            this.ws.wsDisConnect(true); // 主动断开，停止重连
            //延迟半秒在连接，防止连接完有又回调了断开
            setTimeout(function () {
                that.ws.wsConnect(uni.getStorageSync('him-token'))
            }, 500)

        }
        //第一次加载
        else {
            this.showCount++;
        }

    },
    onLoad(options) {
        this.ws.wsCallback = this.imListener
        // 设置重连状态回调
        this.ws.setReconnectCallback(this.handleReconnectState)
        // 启动链接
        this.epH = uni.getWindowInfo().windowHeight + "px"
        this.epW = uni.getWindowInfo().windowWidth - 24 + "px"
        // if (!this.ws.wsIsConnected) {
        //     this.ws.wsConnect(uni.getStorageSync('him-token'))
        // }
        this.storeId = options.storeId
        this.type = options.type
        // 没有goodsid则不显示 发送商品弹窗
        this.showHideModel = options.goodsid
        // 发送后刷新页面不显示 发送商品弹窗 local里面imGoodId不为空显示
        // #ifdef H5
        this.localImGoodsId = uni.getStorageSync('imGoodId')
        // #endif
        // 没有orderSn则不显示 发送订单弹窗
        this.orderShowHide = options.orderSn
        // 没有afterSaleSn则不显示 发送售后弹窗
        this.saleShowHide = options.afterSaleSn
        // 没有complaintId 发送售后弹窗
        this.complaintShowHide = options.complaintId
        this.resolve = options
        // 用户订单下单人的id
        if (this.resolve.memberId) {
            this.memberId = this.resolve.memberId
        }
        // 请求商品信息
        if (this.resolve.goodsid) {
            this.commodityDetails()
        }
        // 请求订单信息
        if (this.resolve.orderSn) {
            this.loadOrderDetails()
        }
        // 请求售后信息
        if (this.resolve.afterSaleSn) {
            this.loadSaleDetails()
        }
        // 请求投诉信息
        if (this.resolve.complaintId) {
            this.loadComplaintIdDetails()
        }
        if (this.type == 'business') {
            this.loadDistributorId()
        } else {
            this.getImToken()
        }
        // 分平台服务商id或者供应商id
        if (this.resolve.myId) {
            this.myId = this.resolve.myId
        } else {
            // myId没有值说明不是从分平台服务商或者供应商跳转过来的，身份就是用户，拿用户id
            this.myId = storage.getUserInfo().id
        }
        // 有storeFlag代表是从供应商跳转过来的，是供应商身份
        if (this.resolve.storeFlag) {
            JSON.parse(this.resolve.storeFlag)
        }
        // 有distributorFlag代表是从分平台服务商跳转过来的，是分平台服务商身份
        if (this.resolve.distributorFlag) {
            JSON.parse(this.resolve.distributorFlag)
        }
        //如果有商家id证明是商家客服，没有则是平台客服
        if (this.storeId) {
            this.storeGoods(0)
        } else {
            this.loadGoods(0)
        }


        // 启动监听
        uni.setNavigationBarTitle({
            title: '在线沟通'
        })
        wx.s = this
        this.submitShow = true

    },
    watch: {
        aiContent(content) {
            //让用户选择订单
            if (content.step == 2 && content.event.eventType == 'SELECTORDER') {
                this.consult_view = true
                this.storeGoods(0)
            }
        }
    },

    methods: {

        // 处理触摸开始，用于长按检测
        handleTouchStart(item, event) {
            // 清除可能存在的定时器
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
            }

            // 300ms后触发长按事件
            this.longPressTimer = setTimeout(() => {
                this.showRecallMenuForMessage(item, event);
            }, 300);
        },

        // 处理触摸结束，取消长按检测
        handleTouchEnd() {
            if (this.longPressTimer) {
                clearTimeout(this.longPressTimer);
                this.longPressTimer = null;
            }
        },

        // 显示撤回菜单
        showRecallMenuForMessage(item, event) {
            // 隐藏之前可能显示的菜单
            this.hideRecallMenu();

            // 设置选中的消息
            this.selectedMessage = item;

            // 获取触摸位置并设置菜单位置
            let clientX = 0, clientY = 0;

            // 处理H5端和移动端的事件对象差异
            if (event.touches && event.touches[0]) {
                // 移动端触摸事件
                clientX = event.touches[0].clientX || event.touches[0].pageX;
                clientY = event.touches[0].clientY || event.touches[0].pageY;
            } else if (event.changedTouches && event.changedTouches[0]) {
                // 移动端触摸结束事件
                clientX = event.changedTouches[0].clientX || event.changedTouches[0].pageX;
                clientY = event.changedTouches[0].clientY || event.changedTouches[0].pageY;
            } else if (event.clientX !== undefined) {
                // H5端鼠标事件或右键菜单事件
                clientX = event.clientX;
                clientY = event.clientY;
            } else if (event.pageX !== undefined) {
                // 备用方案：使用pageX/pageY
                clientX = event.pageX;
                clientY = event.pageY;
            }

            // 获取系统信息
            const systemInfo = uni.getSystemInfoSync();
            const screenWidth = systemInfo.windowWidth;
            const screenHeight = systemInfo.windowHeight;

            // 计算菜单位置，确保在屏幕内
            // 直接使用px单位，因为模板中样式绑定使用的是px
            const menuWidth = 200; // 菜单宽度（px）
            const menuHeight = 100; // 菜单高度（px）

            // 计算x坐标：保持居中显示，避免超出屏幕
            const x = Math.max(0, Math.min(clientX - menuWidth / 2, screenWidth - menuWidth));

            // 计算y坐标：显示在触摸位置上方，避免超出屏幕顶部
            // 调整为显示在长按位置上方，确保可见
            const y = Math.max(0, clientY - menuHeight - 20);

            this.recallMenuPosition = {
                x: x,
                y: y
            };

            // 显示菜单
            this.showRecallMenu = true;

            // 添加点击外部关闭菜单的事件监听
            this.addClickOutsideListener();
        },

        // 添加点击外部关闭菜单的事件监听（兼容多端）
        addClickOutsideListener() {
            // #ifdef H5
            // H5平台使用document事件，添加安全检查
            setTimeout(() => {
                if (typeof document !== 'undefined') {
                    document.addEventListener('click', this.handleClickOutside);
                }
            }, 0);
            // #endif

            // 移动端使用uni的全局触摸事件，添加安全检查
            // #ifndef H5
            setTimeout(() => {
                if (typeof document !== 'undefined') {
                    // 使用捕获模式监听触摸事件
                    document.addEventListener('touchstart', this.handleTouchOutside, true);
                }
            }, 0);
            // #endif
        },

        // 判断消息是否可以撤回（2分钟内）
        canRecallMessage(message) {
            if (!message) return false;

            const now = new Date().getTime();
            let messageTime;

            // 处理timestamp为空字符串的情况
            if (message.timestamp === '') {
                // 当timestamp为空字符串时，优先使用createTime字段
                if (message.createTime && typeof message.createTime === 'string') {
                    console.log('时间戳为空字符串，使用createTime');
                    // 处理iOS平台的日期字符串格式问题（yyyy-MM-dd hh:mm:ss格式）
                    const createTimeStr = uni.getSystemInfoSync().platform === 'ios' ?
                        message.createTime.replace(/-/g, '/') : message.createTime;
                    messageTime = new Date(createTimeStr).getTime();
                } else {
                    // 如果没有createTime，使用默认值
                    console.log('时间戳为空字符串且无createTime，使用默认值');
                    messageTime = now - 30000;
                }
            }
            // 处理不同类型的timestamp，增加平台兼容性
            else if (typeof message.timestamp === 'string') {
                // 处理iOS平台的日期字符串格式问题
                const timestampStr = uni.getSystemInfoSync().platform === 'ios' ?
                    message.timestamp.replace(/-/g, '/') : message.timestamp;
                messageTime = new Date(timestampStr).getTime();
            } else if (message.timestamp instanceof Date) {
                // 直接从Date对象获取时间戳
                messageTime = message.timestamp.getTime();
            } else if (typeof message.timestamp === 'number') {
                // 已经是时间戳格式
                messageTime = message.timestamp;
            } else {
                // 无法识别的时间格式，检查是否有createTime
                if (message.createTime && typeof message.createTime === 'string') {
                    console.log('无法识别的时间格式，使用createTime');
                    const createTimeStr = uni.getSystemInfoSync().platform === 'ios' ?
                        message.createTime.replace(/-/g, '/') : message.createTime;
                    messageTime = new Date(createTimeStr).getTime();
                } else {
                    // 如果也没有createTime，使用默认值
                    console.log('无法识别的时间格式且无createTime，使用默认值');
                    messageTime = now - 30000;
                }
            }

            // 检查是否为有效时间戳
            if (isNaN(messageTime)) {
                console.error('无效的时间戳:', message.timestamp || message.createTime);
                messageTime = now - 30000; // 如果时间戳无效，使用默认值
            }

            console.log('当前时间:', now, '消息时间:', messageTime, '时间差:', now - messageTime);
            return now - messageTime <= this.canRecallTime;
        },

        // 处理消息撤回
        handleRecallMessage() {
            if (!this.selectedMessage || !this.canRecallMessage(this.selectedMessage)) {
                return;
            }
            revokeMessage({
                recordId: this.selectedMessage.broadcastId,
                toId: this.selectedMessage.to,
                createTime: this.selectedMessage.timestamp || this.selectedMessage.createTime
            }).then(() => {
                // 在本地标记消息为已撤回
                const index = this.unshiftmsg.findIndex(item => item.broadcastId === this.selectedMessage.broadcastId);
                if (index !== -1) {
                    this.$set(this.unshiftmsg[index], 'isRevoked', '1');
                }
                // 提示撤回成功
                uni.showToast({
                    title: '消息已撤回',
                    icon: 'success'
                });
            }).catch(error => {
                uni.showToast({
                    title: '消息撤回失败',
                    icon: 'error'
                });
            }).finally(() => {
              this.hideRecallMenu();
            })

        },

        // 隐藏撤回菜单
        hideRecallMenu() {
            this.showRecallMenu = false;
            this.selectedMessage = null;

            // 清除所有事件监听器，添加安全检查以避免document不存在的情况
            // #ifdef H5
            if (typeof document !== 'undefined') {
                document.removeEventListener('click', this.handleClickOutside);
            }
            // #endif

            // #ifndef H5
            if (typeof document !== 'undefined') {
                document.removeEventListener('touchstart', this.handleTouchOutside, true);
            }
            // #endif
        },

        // 点击外部区域隐藏菜单（H5）
        handleClickOutside(event) {
            if (typeof document !== 'undefined') {
                const recallMenu = document.querySelector('.recall-menu');
                if (recallMenu && !recallMenu.contains(event.target)) {
                    this.hideRecallMenu();
                }
            }
        },

        // 触摸外部区域隐藏菜单（移动端）
        handleTouchOutside(event) {
            if (typeof document !== 'undefined') {
                const recallMenu = document.querySelector('.recall-menu');
                if (recallMenu && !recallMenu.contains(event.target)) {
                    this.hideRecallMenu();
                }
            }
        },

        // 全屏触发
        fullscreenchange(e) {

        },
        // 处理售后状态
        handlerServiceStatus(serviceStatus) {

            const statusText = {
                'APPLY': '申请中',
                'PASS': '已通过',
                'REFUSE': '已拒绝',
                'WAIT_RED_CONFIRM_RETURN': '等待用户确认红字确认单后回寄',
                'WAIT_RED_CONFIRM_REFUND': '等待用户确认红字确认单后退款',
                'WAIT_RED_CONFIRM_REISSUE': '等待用户确认红字确认单后补发',
                'BUYER_RETURN': '待卖家收货',
                'SELLER_CONFIRM': '卖家确认收货',
                'SELLER_TERMINATION': '卖家终止售后',
                'BUYER_CANCEL': '买家取消售后',
                'WAIT_REFUND': '等待平台退款',
                'COMPLETE': '完成售后服务',
                'WAITING_RETURN': '等待商品回寄',
                'WAITING_REISSUE': '等待商品补发',
            };
            return statusText[serviceStatus] || '';
        },
        // 处理投诉状态
        handlerComplaintStatus(complaintStatus) {
            const complaintStatusText = {
                'NEW': '等待商家举证',
                'WAIT_ARBITRATION': '等待平台仲裁',
                'COMPLETE': '平台完成仲裁',
                'CANCEL': '客户取消投诉',
            };
            return complaintStatusText[complaintStatus] || '';
        },
        // 处理分平台服务商订单状态
        handleDealerOrderStatus(orderStatus) {
            const orderStatusText = {
                'UNPAID': '未付款',
                'PAID': '已付款',
                'UNDELIVERED': '待发货',
                'DELIVERED': '已发货',
                'COMPLETED': '已完成',
                'FINISH': '已结束',
                'AFTERSALES': '正在售后',
                'STAY_PICKED_UP': '待自提',
                'TAKE': '待核验',
                'CANCEL': '已取消',
                'CANCELLED': '已关闭',
            };
            return orderStatusText[orderStatus] || '';
        },
        // 获取分平台服务商id
        loadDistributorId() {
            getDistributorId(this.memberId).then((res) => {
                if (res.data.code == 200) {
                    this.distributorId = res.data.result

                    this.getImToken()
                }
            })
        },

        // 跳转商品详情页
        jumpGoodDesc(goods) {
            uni.navigateTo({
                url: `/pages/product/goods?id=${goods.id}&goodsId=${goods.goodsId}`
            })
        },
        //订单详情
        linkTosOrders(order) {
            // storeFlag代表供应商身份，跳转供应商详情
            if (this.resolve.storeFlag) {
                uni.navigateTo({
                    url: '/pages/supplierCenter/orderDetail?sn=' + order.sn
                })
            }
            // distributorFlag代表分平台服务商身份，跳转分平台服务商详情
            else if (this.resolve.distributorFlag) {
                uni.navigateTo({
                    url: '/pages/dealerCenter/orderDetail?orderSn=' + order.sn
                })
            } else {
                uni.navigateTo({
                    url: '/pages/profile/order/detail?orderSn=' + order.sn
                })
            }
        },
        // 点击评价
        clickComplaint(userType, index) {
            if (this.userType == 'MEMBER') {
                if (userType === 'DISTRIBUTOR' && !this.dealerHasRated) {
                    this.dealerComplaintList[index].icon = this.dealerComplaintList[index].iconSel;
                    this.dealerHasRated = true; // 标记为已评价
                } else if (userType === 'DISTRIBUTOR' && this.dealerHasRated) {
                    this.$u.toast('您已经评价过了！');
                }

                if (userType === 'STORE' && !this.supplierHasRated) {
                    this.supplierComplaintList[index].icon = this.supplierComplaintList[index].iconSel;
                    this.supplierHasRated = true; // 标记为已评价
                } else if (userType === 'STORE' && this.supplierHasRated) {
                    this.$u.toast('您已经评价过了！');
                }
            }
        },


        // 跳转售后详情
        linkTosSale(sale) {
            if (this.resolve.storeFlag) {
                uni.navigateTo({
                    url: '/pages/supplierCenter/salesDetail?sn=' + sale.sn
                })
            } else if (this.resolve.distributorFlag) {
                uni.navigateTo({
                    url: '/pages/dealerCenter/salesDetail?afterSaleSn=' + sale.sn
                })
            } else {
                uni.navigateTo({
                    url: '/pages/profile/afterSales/detail?afterSaleSn=' + sale.sn
                })
            }
        },
        // 跳转投诉详情
        linkTosComplaint(complaint) {
            if (this.resolve.storeFlag) {
                uni.navigateTo({
                    url: '/pages/supplierCenter/complaintDetail?id=' + complaint.id
                })
            } else {
                uni.navigateTo({
                    url: '/pages/profile/complaint/detail?id=' + complaint.id
                })
            }
        },
        // 跳转安全中心
        linkToSecure() {
            uni.navigateTo({
                url: '/pages/config/security/home'
            })
        },
        // 跳转交易纠纷
        linkToTrade(content) {
            uni.navigateTo({
                url: '/pages/profile/complaint/home?sn=' + content.sn
            })
        },
        // 跳转发货催单和物理催单
        linkToSend(content) {
            uni.navigateTo({
                url: '/pages/profile/order/detail?orderSn=' + content.sn
            })
        },
        //商品取消发送
        cancelModel() {
            this.goodsShowHide = false
        },
        //订单取消发送
        orderCancelModel() {
            this.orderShowHide = false
        },
        // 售后取消发送
        saleCancelModel() {
            this.saleShowHide = false
        },
        // 投诉取消发送
        complaintCancelModel() {
            this.complaintShowHide = false
        },

        // 请求商品详情
        commodityDetails() {
            jumpObtain(this.resolve.skuid, this.resolve.goodsid).then((res) => {
                this.goodListData = res.data.result.data
            })
        },
        // 发送商品
        async sendGoodsMessage(params, type) {
            let msg = {}
            if (type) {
                msg = {
                    thumbnail: params.thumbnail,
                    goodsName: params.goodsName,
                    price: params.price,
                    id: params.id,
                    goodsId: params.goodsId,
                }
            } else {
                msg = {
                    thumbnail: this.goodListData.thumbnail,
                    goodsName: this.goodListData.goodsName,
                    price: this.goodListData.price,
                    id: this.goodListData.id,
                    goodsId: this.goodListData.goodsId,
                }
            }
            let message = JSON.stringify(msg)

            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            // 构建消息对象，同时用于本地显示和发送给服务器
            let data = {
                broadcastId, // 添加临时ID
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 1, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读
                businessType: 1, // 1商品 2售后 3投诉
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId, // 会话id
                fromName: this.myName
            }
            this.unshiftmsg.push(data);

            if (type) {
                this.consult_view = false
            }

            // 发送给服务器消息
            this.ws.wsSendTxt({
              content: message,
              to: this.groupId,
              realFromId: this.myId,
              contentType: 0,
              friendId: this.friendId,
              businessType: 1,
              broadcastId
            });

            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            this.goodsShowHide = false
            // #ifdef H5
            uni.setStorageSync('imGoodId', 1111111)
            // #endif
        },
        // 请求订单详情
        loadOrderDetails() {
            // 如果distributorFlag==true，是分平台服务商，请求分平台服务商订单详情
            if (this.resolve.distributorFlag) {
                getDealerOrderDetail({ orderSn: this.resolve.orderSn }).then((res) => {
                    this.orderData = {
                        goodsName: res.data.result.orderItemList[0].goodsName,
                        orderStatusValue: this.handleDealerOrderStatus(res.data.result.orderStatus),
                        sn: res.data.result.sn,
                        thumbnail: res.data.result.orderItemList[0].image,
                        price: res.data.result.orderItemList[0].goodsPrice
                    }
                })
            } else {
                getOrderDetail(this.resolve.orderSn).then((res) => {
                    this.orderData = {
                        goodsName: res.data.result.orderItems[0].goodsName,
                        orderStatus: res.data.result.order.orderStatus,
                        orderStatusValue: res.data.result.orderStatusValue,
                        sn: res.data.result.order.sn,
                        thumbnail: res.data.result.orderItems[0].image,
                        price: res.data.result.orderItems[0].goodsPrice
                    }
                })
            }
        },
        // 发送订单
        async sendOrderMessage(params, type) {
            let msg = {}
            if (!type) {
                msg = {
                    thumbnail: this.orderData.thumbnail,
                    goodsName: this.orderData.goodsName,
                    orderStatus: this.orderData.orderStatus,
                    orderStatusValue: this.orderData.orderStatusValue,
                    price: this.orderData.price,
                    sn: this.orderData.sn,
                }
            } else {
                msg = {
                    thumbnail: params.thumbnail,
                    goodsName: params.goodsName,
                    orderStatus: params.orderStatus,
                    orderStatusValue: params.orderStatusValue,
                    price: params.price,
                    sn: params.sn,
                }
            }

            if (this.aiContent.step && this.aiContent.event && this.aiContent.event.eventType == 'SELECTORDER') {
                Object.assign(msg, this.aiContent);
                msg.step = 3;
                //清空ai让选择订单，防止下次选择订单也走ai逻辑
                this.aiContent = {};
            }
            let message = JSON.stringify(msg)
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            let data = {
                broadcastId, // 添加临时ID
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 1, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读
                businessType: 4, // 1商品 2售后 3投诉 4订单详情
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId, // 会话id
                fromName: this.myName
            }
            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                friendId: this.friendId,
                businessType: 4,
                broadcastId, // 添加临时ID
                fromName: this.myName
            })
            this.unshiftmsg.push(data)
            if (type) {
                this.consult_view = false
            }
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            this.orderShowHide = false
        },
        // 请求售后详情
        loadSaleDetails() {
            getServiceDetail(this.resolve.afterSaleSn).then((res) => {
                this.saleData = {
                    goodsName: res.data.result.goodsName,
                    sn: res.data.result.sn,
                    serviceType: res.data.result.serviceType,
                    goodsImage: res.data.result.goodsImage,
                    serviceStatus: res.data.result.serviceStatus,
                    goodsPrice: res.data.result.goodsPrice,
                    serviceStatusText: this.handlerServiceStatus(res.data.result.serviceStatus)
                }
            })
        },
        // 刷新聊天客服的正在咨询
        postRefreshNowConsult(unitId, groupId, data) {
            refreshNowConsult(unitId, groupId, data).then((res) => {

            })
        },
        // 发送售后
        async sendSaleMessage(params, type) {
            let msg = {}
            if (type) {
                msg = {
                    goodsName: params.goodsName,
                    serviceType: params.serviceType,
                    goodsImage: params.goodsImage,
                    serviceStatus: params.serviceStatus,
                    sn: params.sn,
                    price: params.price,
                    serviceStatusText: params.serviceStatusText
                }
            } else {
                msg = {
                    goodsName: this.saleData.goodsName,
                    serviceType: this.saleData.serviceType,
                    goodsImage: this.saleData.goodsImage,
                    serviceStatus: this.saleData.serviceStatus,
                    sn: this.saleData.sn,
                    price: this.saleData.goodsPrice,
                    serviceStatusText: this.handlerServiceStatus(this.saleData.serviceStatus)
                }
            }
            let message = JSON.stringify(msg)
            // 生成临时ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            let data = {
                broadcastId, // 添加临时ID
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 1, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读
                businessType: 2, // 1商品 2售后 3投诉 4订单详情
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId // 会话id
            }
            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                friendId: this.friendId,
                businessType: 2,
                broadcastId, // 添加临时ID
              fromName: this.myName
            })
            this.unshiftmsg.push(data)
            if (type) {
                this.consult_view = false
            }
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            this.saleShowHide = false
        },
        // 请求投诉详情
        loadComplaintIdDetails() {
            getComplainDetail(this.resolve.complaintId).then((res) => {
                this.complaintData = {
                    goodsName: res.data.result.goodsName,
                    complainStatus: res.data.result.complainStatus,
                    complaintSn: res.data.result.complaintSn,
                    goodsImage: res.data.result.goodsImage,
                    goodsPrice: res.data.result.goodsPrice,
                    id: res.data.result.id,
                    complainStatusText: this.handlerComplaintStatus(res.data.result.complainStatus)
                }
            })
        },
        // 发送投诉
        async sendComplaintMessage() {
            let msg = {
                goodsName: this.complaintData.goodsName,
                goodsImage: this.complaintData.goodsImage,
                complainStatus: this.complaintData.complainStatus,
                complaintSn: this.complaintData.complaintSn,
                price: this.complaintData.goodsPrice,
                id: this.complaintData.id,
                complainStatusText: this.handlerComplaintStatus(this.complaintData.complainStatus)
            }
            let message = JSON.stringify(msg)
            // 生成临时ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            let data = {
                broadcastId, // 添加临时ID
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 1, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读
                businessType: 3, // 1商品 2售后 3投诉 4订单详情
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId // 会话id
            }
            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                friendId: this.friendId,
                businessType: 3,
                broadcastId, // 添加临时ID
                fromName: this.myName
            })
            this.unshiftmsg.push(data)
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            this.complaintShowHide = false
        },

        changeTime(date) {
            return dateTime.dateTime1(date)
        },
        // 预览文件
        previewFile() {
            this.$u.toast('移动端无法浏览当前格式文件!')
        },
        // 进行图片的预览
        previewImg(e) {
            let index = 0
            for (let i = 0; i < this.imgMsg.length; i++) {
                if (this.imgMsg[i] == e) {
                    index = i
                }
            }

            // 预览图片
            uni.previewImage({
                current: index,
                urls: this.imgMsg,
                longPressActions: {
                    itemList: ['发送给朋友', '保存图片', '收藏'],
                    success: function (data) {
                        console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
                    },
                    fail: function (err) {
                        console.log(err.errMsg)
                    }
                }
            })
        },
        //音频播放
        playVoice(e) {
            // if (innerAudioContext) {
            // 	try {
            // 		innerAudioContext.pause();
            // 		innerAudioContext.destroy()
            // 		innerAudioContext = null
            // 	} catch (e) {
            // 		//TODO handle the exception
            // 	}
            // }
            // innerAudioContext.src = e
            innerAudioContext.onError((err) => {
                console.error('音频播放错误:', err);
            });
            innerAudioContext.onCanplay(() => {
                console.log('音频可以播放');
            });
            innerAudioContext.onPlay(() => {
                console.log('开始播放')
            })
            innerAudioContext.onEnded(() => {
                console.log('音频播放结束');
            });
            // innerAudioContext.play()
            try {
                // 设置音频资源
                innerAudioContext.src = e;

                // 确保资源加载完成后再播放
                innerAudioContext.onCanplay(() => {
                    innerAudioContext.play();
                });

                // 开始播放音频
                innerAudioContext.play();
            } catch (err) {
                console.error('播放音频时发生错误:', err);
            }
        },
        // 关闭视频
        handlerHideVideo: function () {
            let objVideo = uni.createVideoContext('player')
            objVideo.pause()
            this.isShowVideo = false
        },

        // 打开视频
        handlerPlayVideo: function (e) {

            this.srcVideoMp4 = e.currentTarget.dataset.file

            let objVideo = uni.createVideoContext('player')
            setTimeout(() => {

                objVideo.play()
            }, 500);
            this.isShowVideo = true
        },
        //地图定位
        covers(e) {
            let map = [
                {
                    latitude: e.latitude,
                    longitude: e.longitude
                }
            ]
            return map
        },
        //跳转地图信息
        openLocation(e) {
            uni.openLocation({
                latitude: e.latitude,
                longitude: e.longitude,
                name: e.name,
                address: e.address,
                success: function () {
                    console.log('success')
                }
            })
        },

        //输入框高度
        heights(e, type) {
            // this.inputh = e
            // #ifdef H5
            // if (type) {
            //     this.inputh = this.inputh - 20
            // }
            // #endif
            this.goBottom()
        },
        // 滚动到底部
        goBottom() {
            this.scrollToView = ''
            this.$nextTick(() => {
                this.scrollToView = 'msg' + (this.unshiftmsg.length - 1)

            })

            // this.$nextTick(() => {
            //     const query = uni.createSelectorQuery().in(this)
            //     query
            //         .select('.chat-main')
            //         .boundingClientRect((data) => {
            //             console.log(data.height, 'data.height')
            //             this.scrollTop = data.height
            //         })
            //         .exec()
            // })
        },
        // 获取token
        getImToken() {
            uni.showLoading({
                title: '加载中'
            })
            createUser({ distributorFlag: this.resolve.distributorFlag ? this.resolve.distributorFlag : undefined, storeFlag: this.resolve.storeFlag ? this.resolve.storeFlag : undefined }).then((res) => {
                if (res.data.code == 200) {
                    uni.setStorageSync('him-token', res.data.data)
                    //获取token后加载socket
                    // 防止重复连接
                    if (!this.ws.wsIsConnected) {
                        this.ws.wsConnect(uni.getStorageSync('him-token'))
                    }
                    this.getCreateFriend()
                }
                uni.hideLoading()
            })
        },
        // 获取friendId和groupId
        getCreateFriend() {
            let params = {
                type: this.type == 'business' ? 2 : 1, // 1 客服群聊，2 商家群聊
                storeId: this.type == 'business' ? this.storeId : "0",
                distributorId: this.type == 'business' ? this.distributorId : undefined,
                userId: this.memberId,
            }
            createFriend(this.myId, params).then((res) => {
                if (res.data.code == 200) {
                    this.friendId = res.data.data.friendId
                    this.groupId = res.data.data.groupId
                    getGroupInfoByGroupId(this.groupId).then(res => {
                        if (res.data.code == 200) {
                            // 开始发送评价心跳
                            // this.ws.appraise(this.groupId)
                            // clearInterval(this.appraiseInterval) // 清除计时器
                            // this.appraiseInterval = setInterval(() => {
                            //     this.ws.appraise(this.groupId)
                            // }, 60 * 1000)
                            // 加载双方信息
                            this.loadUserInfo()
                            // 获取历史消息
                            this.getMessage()
                            // 平台聊天没有群组@功能
                            if (this.type == 'business') {
                                // 获取聊天群组成员的信息
                                this.loadGroupInfo()
                            }
                            //刷新正在咨询
                            // 请求订单信息
                            var consultInfo = {};
                            if (this.resolve.orderSn) {
                                consultInfo = {
                                    preType: 2,
                                    orderSn: this.resolve.orderSn
                                }
                            }
                            // 请求售后信息
                            else if (this.resolve.afterSaleSn) {
                                consultInfo = {
                                    preType: 3,
                                    afterSaleId: this.resolve.afterSaleSn
                                }
                            }
                            // 商品信息
                            else if (this.resolve.goodsid) {
                                consultInfo = {
                                    preType: 1,
                                    goodsId: this.resolve.goodsid,
                                    skuId: this.resolve.skuid
                                }
                            }
                            //目前就自动刷空正在咨询了，结束评价的时候自动刷新吧

                            if (consultInfo.preType != null) {
                                if (this.resolve.questionName) {
                                    consultInfo.questionName = this.resolve.questionName;
                                }
                                this.postRefreshNowConsult(this.storeId ? this.storeId : 0, this.groupId, consultInfo);
                            }
                            this.sendQueue()
                        } else {
                            this.$u.toast(res.data.msg)
                            setTimeout(() => {
                                uni.reLaunch({
                                    url: "/pages/tabbar/home/index",
                                });
                            }, 1000)
                        }
                    })

                } else {
                    if (res.data.msg && res.data.code == 500) {
                        this.$u.toast(res.data.msg)
                        setTimeout(() => {
                            uni.reLaunch({
                                url: "/pages/tabbar/home/index",
                            });
                        }, 1000)
                    }
                }
            })
        },
        // 获取历史消息
        getMessage() {
            let params = {
                friendId: this.friendId,
                current: this.currentPage,
                size: 20
            }
            //由于做了分表操作，需要除第一次查询外传入查询到的最后一条数据的 YYYYMM 信息
            if (this.unshiftmsg.length > 0) {
                var createTime = this.unshiftmsg[0].createTime;
                console.log(this.unshiftmsg[0])
                params.yearMonth = createTime.substring(0, 7).replace("-", "");
            }
            getMessagePage(params).then((res) => {
                if (res && res.data && res.data.data && res.data.data.current) {
                    this.currentPage = res.data.data.current;
                    this.total = res.data.data.pages
                }
                let arr = res.data.data.records
                if (arr.length == 0) {
                    this.notMore = true;
                }
                arr.forEach((item) => {
                    // item.timestamp = dateTime.formatTimestamp(Number(item.timestamp))
                    if (item.msgType == 5) {
                        item.content = JSON.parse(item.content)
                        this.userInfoObj[item.content.userId] = {
                            userId: item.content.userId,
                            nickName: item.content.nickName,
                            avatar: item.content.avatar
                        }
                    }
                    if (item.msgType == 7) {
                        item.content = JSON.parse(item.content)
                    }
                    //智能客服
                    if (item.businessType == 6) {
                        item.content = JSON.parse(item.content)
                    }
                    item.createTime = item.timestamp + "";

                })

                // 处理后端传过来的数据
                for (var i = 0; i < arr.length; i++) {
                    //时间间隔处理
                    if (i < arr.length - 1) {
                        //这里表示头部时间还是显示一下
                        let t = dateTime.spaceTime(this.oldTime, arr[i].timestamp)
                        if (t) {
                            this.oldTime = t
                        }
                        arr[i].timestamp = t
                    }
                    // 处理订单，商品，售后，投诉内容
                    if (
                        typeof arr[i].content === 'string' &&
                        arr[i].businessType &&
                        (arr[i].businessType == 1 || arr[i].businessType == 2 || arr[i].businessType == 3 || arr[i].businessType == 4)
                    ) {
                        arr[i].content = JSON.parse(arr[i].content)
                    }
                    // 处理售后状态
                    if (arr[i].businessType == 2) {
                        arr[i].content.serviceStatusText = this.handlerServiceStatus(arr[i].content.serviceStatus)
                    }
                    // 获取图片，为下面的预览做准备
                    if (arr[i].contentType == 1) {
                        this.imgMsg.push(arr[i].content)
                    }
                    // 语音消息content取值
                    if (arr[i].contentType == 2 && typeof arr[i].content === 'string') {

                        arr[i].content = JSON.parse(arr[i].content)
                    }
                }

                // businessType == 5的是评价消息，聊天记录中不进行push
                if (params.current == 1) {
                    // this.unshiftmsg = arr.filter((x) => x.businessType != 5)
                    this.unshiftmsg = arr
                } else {
                    // let newData = arr.filter((x) => x.businessType != 5)
                    // 不是第一页 往数组开始进行 添加数据
                    // this.unshiftmsg.unshift(...newData)
                    this.unshiftmsg.unshift(...arr)
                }
                // 跳转到最后一条数据 与前面的:id进行对照
                setTimeout(() => {
                    if (params.current == 1) {
                        this.goBottom()
                    }
                }, 200)
            })
        },
        // 触顶加载更多
        loadMoreMessage: function () {

            //防止friendid未加载触发加载更多
            if (!this.friendId) {
                return;
            }
            if (!this.notMore) {
                this.currentPage++;

                this.getMessage();
            } else {
                this.$u.toast('没有更多消息了~')
            }
        },
        //接受输入内容
        async inputs(e) {
            // 生成临时消息ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            //时间间隔处理
            let data = {
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 1, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读
                businessType: 0, // 业务类型  0非业务消息
                content: e.message, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: e.type, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId, // 会话id
                broadcastId, // 一条消息全局广播的唯一ID
                fromName: this.myName
            }
            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: e.message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: e.type,
                friendId: this.friendId,
                broadcastId,
                fromName: this.myName
            })
            this.unshiftmsg.push(data)
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            if (e.type == 1) {
                this.imgMsg.push(e.message)
            }
        },
        // 启动监听
        imListener(msg) {
            console.log("接收消息", msg)
            console.log("unshiftmsg", this.unshiftmsg)
            // 查找接收的消息ID，在消息列表中是否存在，存在则替换数据
            const index = this.unshiftmsg.findIndex(item => item.broadcastId === msg.broadcastId && (msg.isRevoked === '1'));
            if (index >= 0) {
              this.$set(this.unshiftmsg[index], "isRevoked", msg.isRevoked)
              return;
            }


            dateTime.spaceTime(this.oldTime, msg.timestamp)
            msg.createTime = dateTime.formatTimestamp(Number(msg.timestamp));
            msg.timestamp = dateTime.formatTimestamp(Number(msg.timestamp))
            //由于评价用了createTime，这里给createTime赋值下
            if (msg.friendId == this.friendId) {
                //开启队列显示
                if ((msg.msgType == 11 || msg.msgType == 14) && msg.extra) {
                    if (msg.extra.type == "padding") {
                        console.log("开启队列显示", msg);
                        this.queueState = true;
                        this.isInQueue = msg.extra.isInQueue;
                        this.myPosition = msg.extra.myPosition;
                        this.totalInQueue = msg.extra.totalInQueue;
                        this.queueInterval = setInterval(() => {
                            this.sendQueue()
                        }, 10000)
                    } else if (msg.extra.type == "success") {
                        this.queueState = false;
                        clearInterval(this.queueInterval);
                    }
                }
                switch (msg.msgType) {
                    case 0:

                        break
                    // 用户消息
                    case 1:
                        // 消息类型-文本
                        if (msg.contentType == 0) {
                            switch (msg.businessType) {
                                case 0:
                                    this.unshiftmsg.push(msg)
                                    break
                                case 1:
                                    msg.content = JSON.parse(msg.content)
                                    this.unshiftmsg.push(msg)
                                    break
                                case 2:
                                    msg.content = JSON.parse(msg.content)
                                    this.unshiftmsg.push(msg)
                                    break
                                case 3:
                                    msg.content = JSON.parse(msg.content)
                                    this.unshiftmsg.push(msg)
                                    // const componentRef = this.$refs.submit; // 通过ref属性获取组件引用
                                    // if (componentRef) {
                                    //     // 重新加载组件
                                    //     componentRef.$forceUpdate();
                                    // }
                                    break
                                case 4:
                                    msg.content = JSON.parse(msg.content)
                                    this.unshiftmsg.push(msg)
                                    break
                                case 6:
                                    let content = JSON.parse(msg.content);

                                    msg.content = content
                                    this.aiContent = content;
                                    if (content.event && content.event.eventType == 'SELECTORDER') {
                                        return;
                                    }
                                    this.unshiftmsg.push(msg)
                                    break
                                default:
                                    break
                            }
                        }
                        // 消息类型-图片
                        if (msg.contentType == 1) {
                            this.unshiftmsg.push(msg)
                            this.imgMsg.unshift(msg.content)
                        }
                        // 语音消息
                        if (msg.contentType == 2) {

                            msg.content = JSON.parse(msg.content)
                            this.unshiftmsg.push(msg)
                        }
                        // 视频消息
                        if (msg.contentType == 3) {
                            this.unshiftmsg.push(msg)
                        }
                        break
                    // 系统消息通知
                    case 2:

                        // businessType==5评价消息通知
                        if (msg.businessType == 5) {
                            //等于1新增，2时替换
                            if (msg.extra.loadType == 1) {
                                this.unshiftmsg.push(msg)
                            }
                            if (msg.extra.loadType == 2) {
                                let currentIndex = this.unshiftmsg.findIndex(
                                    (item) => item.id == msg.id
                                )
                                if (currentIndex >= 0) {
                                    this.unshiftmsg[currentIndex] = msg
                                }
                            }
                        }
                        break
                    // 群组新用户加入通知
                    case 5:
                        msg.content = JSON.parse(msg.content)
                        this.userInfoObj[msg.content.userId] = {
                            userId: msg.content.userId,
                            nickName: msg.content.nickName,
                            avatar: msg.content.avatar
                        }
                        msg.content = this.userInfoObj[msg.content.userId].nickName + '加入了群聊'
                        msg.propType = 3 // 提示消息：3群组新用户加入通知
                        this.unshiftmsg.push(msg)
                        // 加入群组了意味着有人接单了，无人接单的提示需要删掉
                        this.isReceivingOrders = true
                        let currentIndex1 = this.unshiftmsg.findIndex(
                            (item) => item.content == '您好，正在为您联系健康顾问中，请您耐心等待。如果您有疾病相关的检查资料，可以点击"+"后补充提交，以便帮您找到更合适的医生'
                        )
                        if (currentIndex1 >= 0) {
                            this.unshiftmsg.splice(currentIndex1, 1)
                        }
                        break
                    // 排队消息
                    case 11:
                        if (msg.businessType == 0) {
                            this.unshiftmsg.push(msg)
                        }
                        break
                    default:
                    // do nothing

                }
                this.$nextTick(() => {
                    this.goBottom()
                })
            }
        },
        // 获取用户信息
        loadUserInfo() {
            getUserInfo(this.friendId).then((res) => {
                if (res.data.code == 200) {
                    this.userInfoObj = {}
                    let title = ''
                    res.data.data.forEach((item) => {
                        if (!this.userInfoObj[item.userId]) {
                            this.userInfoObj[item.userId] = {
                                userId: item.userId,
                                nickName: item.nickName,
                                avatar: item.avatar
                            }
                        }
                        // title = item.nickName.join('、')
                    })
                }
            })
        },
        // 获取群组成员信息
        loadGroupInfo() {
            getUserListByGroupId(this.groupId).then((res) => {
                if (res.data.code == 200) {
                    // 与我自己id对比，得到当前角色
                    this.userType = res.data.data.find(item => item.userId == this.myId)?.userType;
                    this.roleArr = res.data.data.map(item => {
                        let name;
                        switch (item.userType) {
                            case 'MEMBER':
                                name = '客户';
                                break;
                            case 'STORE':
                                name = '供应商';
                                // this.userInfoObj[item.userId] = {
                                //     userId: item.userId,
                                //     nickName: item.nickName,
                                //     avatar: item.avatar
                                // }
                                break;
                            case 'DISTRIBUTOR':
                                name = '分平台服务商';
                                break;
                            default:
                                name = '';
                        }
                        return { ...item, name };
                    });
                }

            })

        },
        close_evaluate_view() {
            this.evaluate_view = false
        },
        open_evaluate_view() {
            this.evaluate_view = true
        },
        open_consult_view() {
            this.consult_view = true
        },
        close_consult_view() {
            this.consult_view = false
        },
        handleTipsBtnClick(url) {
            uni.navigateTo({
                url: url
            })
        },
        tabsChange(index) {
            this.swiperCurrent = index;
            this.listParams = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.order_list = []
            this.sale_list = []
            this.browse_list = []
            this.swiper_list = []
            this.keyword = ''
            this.keyword2 = ''
            this.keyword3 = ''
            this.keyword4 = ''
            if (this.storeId) {
                this.storeGoods(index)
            } else {
                this.loadGoods(index)
            }
        },
        transition(e) {
            let dx = e.detail.dx;
            this.$refs.uTabs.setDx(dx);
        },
        animationfinish(e) {
            let current = e.detail.current;
            this.$refs.uTabs.setFinishCurrent(current);
            this.swiperCurrent = current;
            this.consult_current = current;
        },
        onreachBottom() {
            this.listParams.pageNumber++
            if (this.storeId) {
                this.storeGoods(this.swiperCurrent)
            } else {
                this.loadGoods(this.swiperCurrent)
            }
        },
        searchList() {
            this.order_list = []
            this.sale_list = []
            this.browse_list = []
            this.swiper_list = []
            this.listParams.pageNumber = 1
            if (this.storeId) {
                this.storeGoods(this.swiperCurrent)
            } else {
                this.loadGoods(this.swiperCurrent)
            }
        },
        collect(value) {
            this.consult_view = true
            this.swiperCurrent = value;
            this.consult_current = value;
            this.storeGoods(value)
        },
        storeGoods(type) {
            let params = {
                userId: this.storeId,
                goodsName: this.keyword ? this.keyword : this.keyword2 ? this.keyword2 : this.keyword3 ? this.keyword3 : this.keyword4 ? this.keyword4 : '',
                pageSize: this.listParams.pageSize,
                pageNumber: this.listParams.pageNumber,
            }
            if (type == 0) {
                getImStoreOrder(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                type: "订单号",
                                orderNum: item.subOrderSn,
                                time: item.createTime,
                                img: item.goodsSkuList[0].thumbnail,
                                name: item.goodsSkuList[0].goodsName,
                                orderStatus: item.orderStatus,
                                state2: this.handleDealerOrderStatus(item.orderStatus),
                                price: item.goodsSkuList[0].price,
                                num: item.goodsNum
                            }
                        })
                        if (data.length > 0) {
                            this.order_list = [...this.order_list, ...data]
                        }
                    }
                })
            }
            if (type == 1) {
                getImStoreAfterOrder(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                type: "售后号",
                                orderNum: item.afterSaleSn,
                                time: item.createTime,
                                img: item.thumbnail,
                                name: item.goodsName,
                                serviceType: item.serviceType,
                                serviceStatus: item.serviceStatus,
                                state1: item.serviceType == 'RETURN_GOODS' ? '退货' : '换货',
                                state2: this.handlerServiceStatus(item.serviceStatus),
                                price: item.price,
                                num: item.afterSaleNum
                            }
                        })
                        if (data.length > 0) {
                            this.sale_list = [...this.sale_list, ...data]
                        }
                    }
                })
            }
            if (type == 2) {
                getImStoreFoorpoint(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                img: item.thumbnail,
                                name: item.goodsName,
                                tags: ["7天无理由退款"],
                                price: item.price,
                                skuId: item.skuId,
                                goodsId: item.goodsId,
                            }
                        })
                        if (data.length > 0) {
                            this.browse_list = [...this.browse_list, ...data]
                        }
                    }
                })
            }
            if (type == 3) {
                getImStoreCollect(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                img: item.thumbnail,
                                name: item.goodsName,
                                tags: ["7天无理由退款"],
                                price: item.price,
                                skuId: item.skuId,
                                goodsId: item.goodsId,
                            }
                        })
                        if (data.length > 0) {
                            this.swiper_list = [...this.swiper_list, ...data]
                        }
                    }
                })
            }
        },
        loadGoods(type) {
            let params = {
                goodsName: this.keyword ? this.keyword : this.keyword2 ? this.keyword2 : this.keyword3 ? this.keyword3 : this.keyword4 ? this.keyword4 : '',
                pageSize: this.listParams.pageSize,
                pageNumber: this.listParams.pageNumber,
            }
            if (type == 0) {
                getImOrder(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                type: "订单号",
                                orderNum: item.subOrderSn,
                                time: item.createTime,
                                img: item.goodsSkuList[0].thumbnail,
                                name: item.goodsSkuList[0].goodsName,

                                orderStatus: item.orderStatus,
                                state2: this.handleDealerOrderStatus(item.orderStatus),
                                price: item.goodsSkuList[0].price,
                                num: item.goodsNum
                            }
                        })
                        if (data.length > 0) {
                            this.order_list = [...this.order_list, ...data]
                        }
                    }
                })
            }
            if (type == 1) {
                getImAfterOrder(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                type: "售后号",
                                orderNum: item.afterSaleSn,
                                time: item.createTime,
                                img: item.thumbnail,
                                name: item.goodsName,
                                state1: item.serviceType == 'RETURN_GOODS' ? '退货' : '换货',
                                state2: this.handlerServiceStatus(item.serviceStatus),
                                price: item.price,
                                num: item.afterSaleNum
                            }
                        })
                        if (data.length > 0) {
                            this.sale_list = [...this.sale_list, ...data]
                        }
                    }
                })
            }
            if (type == 2) {
                getImFoorpoint(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                img: item.thumbnail,
                                name: item.goodsName,
                                tags: ["7天无理由退款"],
                                price: item.price,
                                skuId: item.skuId,
                                goodsId: item.goodsId,
                            }
                        })
                        if (data.length > 0) {
                            this.browse_list = [...this.browse_list, ...data]
                        }
                    }
                })
            }
            if (type == 3) {
                getImCollect(params).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.result.records.map(item => {
                            return {
                                img: item.thumbnail,
                                name: item.goodsName,
                                tags: ["7天无理由退款"],
                                price: item.price,
                                skuId: item.skuId,
                                goodsId: item.goodsId,
                            }
                        })
                        if (data.length > 0) {
                            this.swiper_list = [...this.swiper_list, ...data]
                        }
                    }
                })
            }
        },
        async toHandleService() {
            let msg = {
                step: 3,
                handleService: true
            }
            let message = JSON.stringify(msg)
            // 一条消息广播的唯一ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            let data = {
                broadcastId, // 添加临时ID
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 13, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读 13 ai业务
                businessType: 6, // 1商品 2售后 3投诉 6 ai
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId // 会话id
            }
            this.unshiftmsg.push(data)

            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                msgType: 13, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读 13 ai业务
                friendId: this.friendId,
                businessType: 6,
                broadcastId, // 添加临时ID
                fromName: this.myName
            })
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
        },
        JumpForAI(state, content) {
            //跳转订单详情，订单详情里有售后申请
            if (state == 'AFTER_SALE_APPLY') {
                // this.linkTosSale(content)
                this.linkTosOrders(content)
            }
            //跳转修改订单
            if (state == 'MODIFY_ORDER') {
                this.linkTosOrders(content)
            }
            //跳转订单详情
            if (state == 'ORDER_DETAIL') {
                this.linkTosOrders(content)
            }
            //跳转安全中心
            if (state == 'SAFE_CENTER') {
                this.linkToSecure()
            }
            //跳转到交易纠纷创建界面
            if (state == 'CREATE_DISPUTE') {
                this.linkToTrade(content)
            }
            //联系人工客服
            if (state == 'CONTACT_CUSTOMER_SERVICE') {
                this.toHandleService();
            }
            //发货催单
            if (state == 'SHIPPING_REMINDER') {
                this.linkToSend(content)
            }
            //物流催单
            if (state == 'LOGISTICS_REMINDER') {
                this.linkToSend(content)
            }
        },
        async clickKnowledge(knowledge, content) {
            let msg = {
                step: 2,
                knowledgeDocId: knowledge.id,
                hasAutomatedEvent: knowledge.hasAutomatedEvent
            }
            if (content.sn) {
                msg.sn = content.sn;
            }
            if (!knowledge.hasAutomatedEvent) {
                msg.pcContent = knowledge.pcContent;
                msg.h5Content = knowledge.h5Content;
            }
            let message = JSON.stringify(msg)
            // 消息广播的唯一ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            let data = {
                to: this.groupId, // 群聊id
                from: this.myId, // 我的id
                realFromId: this.myId,
                msgType: 13, // 消息类型：0心跳 1用户 2系统 3服务器变化 4消息已读 13 ai业务
                businessType: 6, // 1商品 2售后 3投诉 6 ai
                content: msg, // 消息内容
                timestamp: dateTime.spaceTime(this.oldTime, new Date()), // 消息时间
                createTime: dateTime.formatTimestamp(Date.now()), // 创建时间，用于撤回判断
                contentType: 0, // 消息内容类型 0文字 1图片  2语音 3视频
                sendType: 1, // 0是点对点，1 是群发，可以根据用户数组长度来判断是点对点还是群发
                extra: '', // 其他消息参数
                read: false, // 是否已读
                friendId: this.friendId, // 会话id
                broadcastId // 消息广播的唯一ID
            }
            this.unshiftmsg.push(data)

            // 发送给服务器消息
            this.ws.wsSendTxt({
                content: message,
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                friendId: this.friendId,
                businessType: 6,
                broadcastId,
                fromName: this.myName
            })
            // 跳转到最后一条数据
            this.$nextTick(() => {
                this.goBottom()
            })
            // if (data.status == "PUBLISHMESSAGE" || data.status == 'QUERYLOGISTICS') {
            //     this.$refs.submit.emojiSend(data.title)
            // }
            // if (data.status == 'SELECTORDER') {
            //     this.consult_view = true
            //     this.storeGoods(0)
            // }
            // if (data.status == 'TEXTJUMP') {
            //     //跳转售后详情
            //     if (data.state == 'AFTER_SALE_APPLY') {
            //         this.linkTosSale()
            //     }
            //     //跳转修改订单
            //     if (data.state == 'MODIFY_ORDER') {
            //         this.linkTosOrders()
            //     }
            //     //跳转订单详情
            //     if (data.state == 'ORDER_DETAIL') {
            //         this.linkTosOrders()
            //     }
            //     //跳转安全中心
            //     if (data.state == 'SAFE_CENTER') {
            //         this.linkToSecure()
            //     }
            //     //跳转到交易纠纷创建界面
            //     if (data.state == 'CREATE_DISPUTE') {
            //         this.linkToTrade()
            //     }
            //     //联系人工客服
            //     if (data.state == 'CONTACT_CUSTOMER_SERVICE') {
            //
            //     }
            //     //发货催单
            //     if (data.state == 'SHIPPING_REMINDER') {
            //         this.linkToSend()
            //     }
            //     //物流催单
            //     if (data.state == 'LOGISTICS_REMINDER') {
            //         this.linkToSend()
            //     }
            // }
        },
        //发送排队消息
        async sendQueue() {
            // 消息广播的唯一ID
            const broadcastIdResp = await getBroadcastId();
            const broadcastId = broadcastIdResp.data.data

            // 构建消息对象
            let data = {
                content: '1',
                link: '',
                to: this.groupId,
                from: this.myId,
                realFromId: this.myId,
                contentType: 0,
                msgType: 14,
                friendId: this.friendId,
                businessType: 0,
                broadcastId, // 临时ID
                timestamp: Number(new Date()),
                fromName: this.myName
            }

            // 发送给服务器消息
            this.ws.wsSendTxt(data)
        },
                // 处理WebSocket重连状态变化
        handleReconnectState(state) {
            console.log('重连状态变化:', state);
            this.reconnectState.isReconnecting = state.isReconnecting;
            this.reconnectState.count = state.count;

            if (state.type === 'connected') {
                console.log('WebSocket连接成功');
                this.reconnectState.maxReconnectReached = false;
                // this.$u.toast('连接已恢复');
                //清空消息列表
                this.unshiftmsg = [];
                this.currentPage = 1;
                this.getMessage();
            } else if (state.type === 'reconnecting') {
                console.log(`正在第${state.count}次重连`);
            } else if (state.type === 'reconnect_stopped') {
                console.log('重连已停止');
                this.reconnectState.maxReconnectReached = false;
            } else if (state.type === 'max_reconnect_reached') {
                console.log('已达到最大重连次数');
                this.reconnectState.maxReconnectReached = true;
            } else if (state.type === 'manual_reconnect_started') {
                console.log('开始手动重连');
                this.reconnectState.maxReconnectReached = false;
            }
        },
        // 手动重连
        manualReconnect() {
            console.log('用户点击手动重连');
            // 立即重置UI状态
            this.reconnectState.maxReconnectReached = false;
            this.reconnectState.isReconnecting = true;
            this.reconnectState.count = 0;

            const token = uni.getStorageSync('him-token');
            if (token) {
                this.ws.manualReconnect(token);
            } else {
                this.$u.toast('获取用户token失败');
                // 如果获取token失败，恢复状态
                this.reconnectState.maxReconnectReached = true;
                this.reconnectState.isReconnecting = false;
            }
        },

        // 从重连中退出聊天
        stopReconnectFromReconnecting() {
            // 保存当前重连状态，不重置计数
            const currentCount = this.reconnectState.count;
            const isReconnecting = this.reconnectState.isReconnecting;

            // 暂时隐藏重连弹框，让确认框显示在最上层
            this.reconnectState.isReconnecting = false;

            uni.showModal({
                title: '提示',
                content: '确定要退出聊天吗？',
                success: (res) => {
                    if (res.confirm) {
                        // 确认退出，停止重连并断开连接
                        this.ws.stopReconnect();
                        this.ws.wsDisConnect(true);
                        uni.navigateBack();
                    } else {
                        // 如果用户点击取消，恢复重连状态
                        this.reconnectState.isReconnecting = isReconnecting;
                        this.reconnectState.count = currentCount;
                        this.reconnectState.maxReconnectReached = false;
                    }
                }
            });
        },

        // 从连接失败弹框退出聊天
        stopReconnectFromFailed() {
            // 暂时隐藏连接失败弹框，让确认框显示在最上层
            this.reconnectState.maxReconnectReached = false;

            uni.showModal({
                title: '提示',
                content: '确定要退出聊天吗？',
                success: (res) => {
                    if (res.confirm) {
                        // 确认退出，停止重连并断开连接
                        this.ws.stopReconnect();
                        this.ws.wsDisConnect(true);
                        uni.navigateBack();
                    } else {
                        // 如果用户点击取消，重新显示连接失败提示框
                        this.reconnectState.maxReconnectReached = true;
                        this.reconnectState.isReconnecting = false;
                    }
                }
            });
        },

        // 停止重连并关闭程序（保留原方法以兼容）
        stopReconnect() {
            this.stopReconnectFromFailed();
        }
    }
}
</script>

<style lang="scss">
page {
    height: 100%;
}

.bottom-flex {
    position: fixed;
    padding-bottom: constant(safe-area-inset-bottom) !important;
    padding-bottom: env(safe-area-inset-bottom) !important;
    background: #ffffff;
    width: 100%;
    bottom: 30rpx;
    align-items: center;
    text-align: center;
    background: linear-gradient(to bottom, #dff2f3, #fcfdfd);
    border-radius: 24rpx;
}

.report-box {
    // background: linear-gradient(to bottom, #dff2f3, #fcfdfd);
    border-radius: 40rpx;
    margin-top: 24rpx;

    .report-btn {
        border-radius: 80rpx;
        padding: 0rpx 120rpx;
        line-height: 90rpx;
        background-color: #55bac1;
        color: #ffffff;
    }
}

.scroll-to-message {
    text-align: left;
    padding: 24rpx 24rpx 8rpx;

    .scroll-to-btn {
        padding: 0rpx 24rpx;
        line-height: 60rpx;
        background-color: transparent;
        color: #494848;
        margin: 0 10rpx;

        &::after {
            border-radius: 48rpx;
        }
    }
}

.phone-card-box {
    background: linear-gradient(to bottom, #dff2f3, #fcfdfd);
    padding: 30rpx;
    border-radius: 40rpx;

    .phone-card-title {
        line-height: 1.8;

        .title {
            font-size: 30rpx;
            font-weight: bold;
        }

        .dec {
            color: #808080;
            font-size: 24rpx;
        }
    }

    .phone-card-message {
        overflow-x: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 40rpx;

        .phone-card-img {
            width: 60rpx;
            height: 60rpx;
        }

        .phone-card-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-left: 20rpx;

            .phone-card-name {
                font-size: 32rpx;
                font-weight: bold;
                max-width: 260rpx;
            }

            .phone-card-price {
                color: red;
                margin: 0 20rpx;
            }
        }

        .phone-card-btn {
            border-radius: 80rpx;
            padding: 0rpx 24rpx;
            width: 130rpx;
            line-height: 60rpx;
            background-color: #55bac1;
        }
    }
}

.old-order {
    position: fixed;
    width: 100%;
}

.content {
    height: 100%;
    background-color: #f9f9f9;
}

.end-content-box {
    position: absolute;
    bottom: 200rpx;
    left: 50%;
    transform: translateX(-50%);
}

.complaint {
    // margin-top: 30rpx;
    padding: 30rpx 40rpx;
    box-sizing: border-box;
}

.end-content {
    background-color: #867e7e;
    text-align: center;
    padding: 10rpx;
    width: 500rpx;
    border-radius: 16rpx;
    font-size: 24rpx;
    color: #fff;
    margin: 0 auto 20rpx auto;
}

.complaint-box {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;

    .complaint-item {
        width: 160rpx;

        .complaint-img {
            width: 60rpx;
            height: 60rpx;
        }

        .complaint-name {
            margin-top: 10rpx;
        }
    }
}

// .prop {
//     width: 500rpx;
//     padding: 10rpx;
// }

.groupProp {
    width: 200rpx;
    padding: 10rpx;
}

.suggest-chat {
    height: 87%;
}

.chat {
    height: 100%;
}

.chat-main {
    // padding-left: 32rpx;
    // padding-right: 32rpx;
    padding-top: 20rpx;
    // padding-bottom: 120rpx;  //获取动态高度
    display: flex;
    flex-direction: column;
}

.chat-ls {
    .chat-time {
        font-size: 24rpx;
        color: rgba(39, 40, 50, 0.3);
        line-height: 34rpx;
        padding: 10rpx 0rpx;
        text-align: center;
    }

    .msg-m {
        display: flex;
        padding: 20rpx 0;

        /* 撤回消息样式 */
        &.msg-revoked {
            justify-content: center;
            padding: 10rpx 0;

            .revoked-text {
                font-size: 20rpx;
                color: #999999;
                background: transparent;
                text-align: center;
            }
        }

        .user-img {
            flex: none;
            width: 80rpx;
            height: 80rpx;
            border-radius: 20rpx;
        }

        .system-msg-prop {
            font-weight: bold;
            font-size: 28rpx;
        }

        .message {
            flex: none;
            max-width: 520rpx;
        }

        .picture-right {
            margin-right: 20rpx;
        }

        .mp4 {
            width: 480rpx;
            height: 480rpx;
            position: relative;

            .icon {
                width: 480rpx;
                height: 480rpx;
            }

            .link {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background: rgba(49, 48, 48, 0.4);
                display: flex;
                justify-content: center;
                align-items: center;

                .play {
                    width: 48rpx;
                    height: 48rpx;
                }
            }
        }

        // .video-size {
        //     width: 400rpx;
        // }

        .picture-left {
            margin-left: 20rpx;
        }

        .msg-text-left {
            color: rgba(39, 40, 50, 1);
        }

        .msg-title {
            font-size: 28rpx;
            margin-bottom: 20rpx;
            width: 500rpx;
        }

        .card-btn {
            background: linear-gradient(90deg, #0073bf 0%, #0052b0 100%);
        }

        .card-box {
            background-color: #fff;
            border-radius: 16rpx;

            .card-tips {
                padding: 16rpx;
                font-size: 26rpx;
                color: #818182;
            }

            .card-item:not(:last-child) {
                border-bottom: 1rpx solid #ebe9e9;
            }

            .text-flag {
                height: 60rpx;
                position: relative;
            }

            .text-flag::after {
                transition: all 0.5s ease;
                position: absolute;
                content: '';
                width: 16rpx;
                height: 16rpx;
                border: 4rpx solid rgba(166, 166, 166, 0.8);
                border-left: none;
                border-bottom: none;
                left: 50%;
                top: 50%;
                transform: rotate(135deg) translate(-50%, -50%);
            }

            .text-flag_hov::after {
                transform: rotate(315deg) translate(-50%, -50%);
            }
        }

        .msg-text-right {
            color: #ffffff;


        }

        .msg-text {
            font-size: 32rpx;
            line-height: 44rpx;
            padding: 18rpx 28rpx;
            // max-width: 420rpx;
            overflow-x: auto;
            word-break: break-all;
            text-align: left;
        }

        .msg-img {
            max-width: 400rpx;
            border-radius: 20rpx;
        }

        .msg-map {
            background: #fff;
            width: 464rpx;
            height: 284rpx;
            overflow: hidden;

            .map-name {
                font-size: 32rpx;
                color: rgba(39, 40, 50, 1);
                line-height: 44rpx;
                padding: 18rpx 24rpx 0 24rpx;
                //下面四行是单行文字的样式
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }

            .map-address {
                font-size: 24rpx;
                color: rgba(39, 40, 50, 0.4);
                padding: 0 24rpx;
                //下面四行是单行文字的样式
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }

            .map {
                padding-top: 8rpx;
                width: 464rpx;
                height: 190rpx;
            }
        }

        .voice {
            // width: 200rpx;
            min-width: 130rpx;
            max-width: 400rpx;
        }

        .voice-img {
            width: 28rpx;
            height: 36rpx;
        }
    }

    .msg-left {
        flex-direction: row;

        .nickName {
            text-align: left;
            margin: 0 0 10rpx 10rpx;
        }

        .system-msg {
            padding: 30rpx;
            background-color: #4865ff;
            border-radius: 16rpx;
        }

        .msg-text {
            margin-left: 10rpx;
            // background-color: #f3f5f7;
            border-radius: 0rpx 40rpx 40rpx 40rpx;
        }

        .msg-text-card {
            background: linear-gradient(to bottom, #dff2f3, #fcfdfd);
        }

        .ms-img {
            margin-left: 16rpx;
        }

        .msh-map {
            margin-left: 16rpx;
            border-radius: 0rpx 20rpx 20rpx 20rpx;
        }

        .voice {
            text-align: right;
        }

        .voice-img {
            float: left;
            width: 28rpx;
            height: 36rpx;
            padding-bottom: 4rpx;
        }
    }

    .msg-right {
        flex-direction: row-reverse;

        .nikeName {
            text-align: right;
            margin: 0 10rpx 10rpx 0;
            // display: inline-block;
        }

        .msg-text {
            margin-right: 16rpx;
            background-color: #4865ff;
            border-radius: 40rpx 0rpx 40rpx 40rpx;
        }

        .msg-text-card {
            margin-right: 16rpx;
            border-radius: 40rpx 0rpx 40rpx 40rpx;
            // background: linear-gradient(to bottom, #dff2f3, #fcfdfd);
        }

        .ms-img {
            margin-right: 16rpx;
        }

        .msh-map {
            margin-left: 16rpx;
            border-radius: 20rpx 0rpx 20rpx 20rpx;
        }

        .voice {
            text-align: left;
            color: #ffffff;
        }

        .voice-img {
            float: right;
            padding: 4rpx;
            width: 28rpx;
            height: 36rpx;
            transform: rotate(180deg);
        }
    }
}

.cart-message {
    display: flex;
    justify-content: center;
    align-items: center;
}

.goods-card {
    border-radius: 20rpx;
    margin-top: 15rpx;
    background-color: #ffffff;
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    color: #302c2b;
    position: relative;

    .file-box {
        display: inline-block;
        line-height: 40rpx;
        max-width: 350rpx;
        height: 100%;

        .file-name {
            font-size: 30rpx;
            color: black;
        }

        .file-size {
            color: #9e9b96;
            font-size: 24rpx;
        }
    }

    .file-img {
        margin-left: 20rpx;
        height: 60rpx;
        width: 60rpx;
    }

    .image-box {
        width: 122rpx;
        overflow: hidden;

        .image {
            width: 122rpx;
            border-radius: 10rpx;
            padding: 12rpx;
            height: 122rpx;
        }
    }

    .goods-desc {
        flex: 1;
        overflow: hidden;
        margin-left: 12rpx;
        width: 400rpx;
        text-align: left;

        .goods-desc-name {
            font-size: 30rpx;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-bottom: 20rpx;

            .goods-card-goods-name {
                color: black;
                text-overflow: ellipsis;
                font-size: 26rpx;
                font-weight: bold;
            }
        }

        .price {
            margin-top: 50rpx;
            line-height: 2;
            margin-left: 5px;
            font-size: 26rpx;
            font-weight: 700;
        }
    }

    .order-desc {
        padding: 10rpx 0;

        .order-desc-name {
            margin-bottom: 0rpx;
        }

        .order-card-goods-name {
            color: #959696 !important;
        }
    }

    .send-goods {
        color: #ffffff;
        height: 50rpx;
        width: 130rpx;
        background-color: #f21c0c;
        font-size: 24rpx;
        border-radius: 17rpx;
        text-align: center;
        line-height: 50rpx;
        padding: 0 10rpx;
        position: relative;
        top: 20rpx;
        right: 20rpx;
    }
}

.cancel {
    color: #737373;
    position: absolute;
    top: 10rpx;
    right: 0rpx;
    width: 50rpx;
}

.goods-desc-rice {
    font-size: 24rpx;
    color: $main-color;
    font-weight: bold;
    margin-top: 10rpx;
}

.order-sn {
    background: #fff;
    color: black;
    border-radius: 16rpx;
    padding: 20rpx;

    .wes {
        font-size: 28rpx;
    }
}

.order-item {
    margin: 10rpx 0;
}

.name-or-time {
    margin: 15rpx 15rpx;
    text-align: left;

    .wes-2 {
        color: #82807e;
        font-size: 28rpx;
    }
}

.video-box {
    position: relative;
    height: 100vh;
    background: #FFF;
    text-align: center;

    .video-size {
        width: 100vw;
        height: 100vh;
    }
}

.tips-btn {
    position: fixed;

    .tips-btn-left {
        padding-left: 24rpx;
    }

    .tips-btn-background {
        background-color: #F3F3F3;
        padding: 16rpx 24rpx 24rpx 24rpx;
        animation: slideUp 0.2s ease-out;

    }

    .tips-scroll {
        gap: 20rpx;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;


        ::-webkit-scrollbar {
            display: none;
        }

        .item {
            display: inline-block;
            margin-right: 16rpx;
        }
    }
}

.evaluate-view {
    .top {
        padding: 26rpx 32rpx 0 26rpx;
        display: grid;
        grid-template-columns: 1fr 6fr 1fr;

        .close {
            display: flex;
            flex-direction: row-reverse;
        }

        .title {
            text-align: center;
            font-size: 32rpx;
        }
    }
}

.consult-view {
    .top {
        font-size: 32rpx;
        display: flex;
        justify-content: space-between;
        padding: 26rpx 32rpx;
        color: #323233;
    }

    .center {}

    .bottom {
        background-color: #F3F3F3;
        height: 1200rpx;
        padding-bottom: 30rpx;



        .swiper-item {
            width: 100%;

            ::-webkit-scrollbar {
                display: none;
            }

            .empty {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .search {
                padding: 20rpx 24rpx;
            }
        }
    }
}

.consult-view {
    .top {
        font-size: 32rpx;
        display: flex;
        justify-content: space-between;
        padding: 26rpx 32rpx;
        color: #323233;
    }

    .center {}

    .bottom {
        background-color: #F3F3F3;
        height: 1200rpx;
        padding-bottom: 30rpx;



        .swiper-item {
            width: 100%;

            ::-webkit-scrollbar {
                display: none;
            }

            .empty {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .search {
                padding: 20rpx 24rpx;
            }
        }
    }
}

.knowledge-box {
    background: white;
    border-radius: 0.2em;
    border: 1px solid #e6e6e6;
    padding: 20rpx;
    margin: 0 10rpx;
    border-radius: 10rpx;
}

.knowledge {

    //color: #409eff;
    padding-top: 5px;
    padding-bottom: 5px;
    border-top: 1px solid #EEE;
    width: 254px;
    overflow: hidden; // 表示当内容溢出元素框时内容会被修剪，并且其余内容是不可见的。
    text-overflow: ellipsis; // 表示当文本溢出包含元素时发生的事情显示省略符号来代表被修剪的文本。
    white-space: nowrap; // 表示文本不进行换行：
}

.knowledge:hover {
    cursor: pointer;
}

/* WebSocket重连样式 */
.reconnect-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.reconnect-container {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 60rpx 40rpx;
    margin: 0 40rpx;
    width: 460rpx;
    text-align: center;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.reconnect-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reconnect-icon {
    margin-bottom: 30rpx;
}

.reconnect-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
}

.reconnect-desc {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 30rpx;
}

.reconnect-count {
    font-size: 24rpx;
    color: #999999;
    margin-bottom: 40rpx;
}

.reconnect-loading {
    margin-bottom: 40rpx;
}

.loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #f3f3f3;
    border-top: 4rpx solid #55BAC1;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.reconnect-actions {
    display: flex;
    justify-content: center;
}
/* 撤回菜单样式 */
.recall-menu {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8rpx;
    padding: 8rpx 0;
    z-index: 9999;
    min-width: 200rpx;
}

.recall-menu-item {
    padding: 16rpx 32rpx;
    color: #ffffff;
    text-align: center;
    font-size: 28rpx;
}

.recall-menu-item:first-child {
    border-bottom: 1rpx solid rgba(255, 255, 255, 0.3);
}

.recall-menu-item:active {
    background: rgba(255, 255, 255, 0.2);
}

.recall-menu-item:disabled {
    color: #999999;
}
</style>
