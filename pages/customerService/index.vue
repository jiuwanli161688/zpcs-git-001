<template>
	<view class="main" :style="{ position: 'relative', height: epH, bottom: inputBottom }">
		<view class="chat" @tap="handleMaskClick" @touchstart="handleMaskClick" :style="{ height: boxheight.chat }">
			<scroll-view class="message-list" scroll-y :scroll-into-view="scrollIntoViewId" @scrolltoupper="handleRefresh"
				:refresher-enabled="true" :refresher-triggered="isRefreshing" @refresherrefresh="onPullDownRefresh">
				<!-- 下拉刷新提示 -->
				<view v-if="isRefreshing" class="refresh-tip">正在刷新...</view>

				<!-- 用户进入页面触发欢迎语 -->
				<view class="message-item">
					<view class="frist-message">
						<u-avatar class="avatar" src="/static/1.jpg" size="108"></u-avatar>
						<view class="text">您好，智能客服助手为您服务</view>
					</view>
					<view class="tips-message">
						<view>正在转接中，人工客服马上为您服务</view>
						<view>您可以先描述问题哦~</view>
					</view>
				</view>

				<!-- 消息列表 -->


				<view v-for="(item, index) in messageList" :key="index" :id='item.id'>
					<view v-if="item.type == 'frist_message'">
						<view class="message-item">
							<view class="frist-message">
								<u-avatar class="avatar" src="/static/1.jpg" size="108"></u-avatar>
								<view class="text">您好，智能客服助手为您服务</view>
							</view>
							<view class="tips-message">
								<view>正在转接中，人工客服马上为您服务</view>
								<view>您可以先描述问题哦~</view>
							</view>
						</view>
					</view>
					<view v-if="item.type == 'user'">
						<sy-user-msg>{{ item.content }}</sy-user-msg>
					</view>
					<view v-if="item.type == 'service'">
						<sy-service-msg :message="item.content"></sy-service-msg>
					</view>
					<view v-if="item.type == 'tips'">
						<sy-tips-msg>{{ item.content }}</sy-tips-msg>
					</view>
					<view v-if="item.type == 'userimage'">
						<sy-userimg-msg :img="item.content">
							<image mode="widthFix" style="width: 100%;vertical-align: bottom;" :src="item.content"></image>
						</sy-userimg-msg>
					</view>

					<view v-if="item.type == 'time'" class="message-item">
						<sy-tips-time>{{ item.time }}</sy-tips-time>
					</view>
					<view v-if="item.type == 'product_item'">
						<product-item-msg :info="item.info"></product-item-msg>
					</view>
					<view v-if="item.type == 'evaluate'">
						<sy-evaluate-card>{{ item.content }}</sy-evaluate-card>
					</view>
					<view v-if="item.type == 'system_tips'">
						<sy-tips-msg>很久没有收到您的回复，如已解决问题，请为我评价</sy-tips-msg>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 撑起输入框 -->
		<view class="empty-box" :style="{ height: boxheight.input }"></view>
		<!-- 咨询商品-悬浮窗模块 -->
		<view class="old-order" v-if="showOldOrder" :style="{ bottom: boxheight.input }">
			<sy-float-order :name="float_order.name" :img="float_order.img" :price="float_order.price"
				:tags="float_order.tags" @emitSend="handSendproduct"></sy-float-order>
		</view>
		<!-- 用户输入框 -->
		<view class="input" :style="{ bottom: inputBottom }">
			<view class="comment-box">
				<!-- 消息输入区域 -->
				<view class="tips-btn" :style="{ width: epW }">
					<scroll-view scroll-x="true" class="tips-scroll">
						<u-tag class="item" color="#333333" bg-color="#FFFFFF" border-color="#FFAEAE" shape="circle"
							text="服务评价" @tap="open_evaluate_view" />
						<u-tag class="item" color="#333333" bg-color="#FFFFFF" border-color="#FFAEAE" shape="circle"
							text="咨询订单" @tap="open_consult_view" />
						<u-tag v-for="(item, index) in tips_btn" :key="index" class="item" color="#333333"
							bg-color="#FFFFFF" border-color="#FFAEAE" shape="circle" :text="item.name"
							@tap="handleTipsBtnClick(item.url)" />
					</scroll-view>
				</view>
				<view class="comment-input-area">
					<view class="comment-input-box">
						<!-- <textarea cursor-spacing="20" class="comment-input" v-model="commentText" auto-height="true"
										height="28rpx" confirm-type="send" :confirm-hold="true" placeholder="请输入"
										@focus="close_MorePanel" @confirm="handleSubmit" :show-confirm-bar="false"
										placeholder-style="color: #CACACA;font-size:28rpx;" maxlength="200"></textarea> -->
						<textarea :adjust-position="adjustPosition" cursor-spacing="20" class="comment-input" @blur="onBlur"
							v-model="commentText" auto-height="true" height="28rpx" confirm-type="send" :confirm-hold="true"
							placeholder="请输入" @focus="input_foucs" @confirm="handleSubmit" :show-confirm-bar="false"
							placeholder-style="color: #CACACA;font-size:28rpx;" maxlength="200"></textarea>
						<text class="emoji-btn">😊</text>
					</view>
					<view class="toolbar">
						<view class="item"><u-icon name="bag" size="36"></u-icon></view>
						<view class="item" @tap="toggleMorePanel"><u-icon name="plus" size="36"></u-icon></view>
					</view>
				</view>


				<!-- 展开更多面板 -->
				<view class="more-panel" v-if="showMorePanel">
					<u-grid col="4" :border="false" class="box">
						<u-grid-item @tap="open_album" class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">相册</view>
						</u-grid-item>
						<u-grid-item @tap="open_camera" class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">拍照</view>
						</u-grid-item>
						<u-grid-item class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">订单</view>
						</u-grid-item>
						<u-grid-item class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">售后</view>
						</u-grid-item>
						<u-grid-item class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">浏览</view>
						</u-grid-item>
						<u-grid-item class="item" bg-color="#F3F3F3">
							<view class="icon">
								<image :src="`${iconCommon}/customer/dingdan.png`"  mode="widthFix"></image>
							</view>
							<view class="text">评价</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
		</view>
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
				<sy-evaluate-card :explainShow="true"></sy-evaluate-card>
			</u-popup>
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
									shape="square"></u-search>
							</view>
							<scroll-view v-if="order_list.length" scroll-y @scrolltolower="onreachBottom"
								style="height: 100%;">
								<sy-order-num v-for="(item, index) in order_list" :key="index" :type="item.type"
									:orderNum="item.orderNum" :img="item.img" :name="item.name" :state2="item.state2"
									:num="item.num" @emitSend="handSendproduct"></sy-order-num>
							</scroll-view>
							<view v-else class="empty">
								<u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
									:src="`${iconCommon}/customer/wudingdan.png`"></u-empty>
							</view>
						</swiper-item>
						<!-- 我的售后 -->
						<swiper-item class="swiper-item">
							<view class="search">
								<u-search placeholder="请输入商品名称" v-model="keyword" bg-color="#FFFFFF" :show-action="false"
									shape="square"></u-search>
							</view>
							<scroll-view v-if="sale_list.length" scroll-y @scrolltolower="onreachBottom">
								<sy-order-num v-for="(item, index) in sale_list" :key="index" :type="item.type"
									:orderNum="item.orderNum" :img="item.img" :name="item.name" :state1="item.state1"
									:state2="item.state2" :num="item.num" @emitSend="handSendproduct"></sy-order-num>
							</scroll-view>
							<view v-else class="empty">
								<u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
									:src="`${iconCommon}/customer/wudingdan.png`"></u-empty>
							</view>
						</swiper-item>
						<!-- 我的浏览 -->
						<swiper-item class="swiper-item">
							<view class="search">
								<u-search placeholder="请输入商品名称" v-model="keyword" bg-color="#FFFFFF" :show-action="false"
									shape="square"></u-search>
							</view>
							<scroll-view v-if="browse_list.length" scroll-y @scrolltolower="onreachBottom">
								<sy-browse-card v-for="(item, index) in browse_list" :key="index" :img="item.img"
									:name="item.name" :tags="item.tags" :price="item.price"
									@emitSend="handSendproduct"></sy-browse-card>
							</scroll-view>
							<view v-else class="empty">
								<u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
									:src="`${iconCommon}/customer/wudingdan.png`"></u-empty>
							</view>
						</swiper-item>
						<!-- 我的关注 -->
						<swiper-item class="swiper-item">
							<view class="search">
								<u-search placeholder="请输入商品名称" v-model="keyword" bg-color="#FFFFFF" :show-action="false"
									shape="square"></u-search>
							</view>
							<scroll-view v-if="swiper_list.length" scroll-y @scrolltolower="onreachBottom">
							</scroll-view>
							<view v-else class="empty">
								<u-empty text="暂无订单信息" font-size="24rpx" icon-size="400rpx"
									:src="`${iconCommon}/customer/wudingdan.png`"></u-empty>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			boxheight: {
				chat: "86%",
				input: "13%"
			},
			epH: "", // 自动获取可视区域的高度
			epW: "", // 自动获取可视区域的宽度(输入栏上方选择栏宽度)
			messageList: [], // 消息列表
			backendMessages: [
				{ type: "frist_message" },
				{ content: "你好！", type: "user", time: 1744158537839 },
				{ content: "有什么可以帮你的吗？", type: "service", time: 1744158638839 },
				{
					type: "product_item", info: {
						name: "十月稻田 黄金玉米段 1.6斤（8段）黄糯aaaa1111232132131232131211aa",
						price: "100.00",
						tags: ["7天无理由退款"],
						url: "/static/1.jpg"
					}, time: 1744158637939
				},
				{ type: "user", content: "您好，这东东质保期有多久呢？", time: 1744158634939 },
				{ type: "evaluate", time: 1744158634939 },
				{
					type: "service", content: "亲亲，您<br>的眼光真的是太棒了【飞利浦电视 焕新购】32时6590 下单到手不高于558元 【补】领取国补下单再打8.5折，到手474.3元【赠】晒单赠20元京东E卡(2图 + 20文字) 【送】只换不修服务", time: 1744158647839
				},
			],//模拟后端请求数据

			product_item: {
				name: "十月稻田 黄金玉米段 1.6斤（8段）黄糯aaaa1111232132131232131211aa",
				price: "100.00",
				text: "7天无理由退款",
				url: "/static/1.jpg"
			},
			float_order: {
				img: '/static/1.jpg',
				name: "十月稻田 黄金玉米段 1.6斤（8段）黄糯aaaa1111232132131232131211aa",
				price: 100,
				tags: ["7天无理由退款"]
			},
			scrollIntoViewId: "", // 滚动到最新消息的 ID
			isRefreshing: false, // 是否正在刷新
			showOldOrder: true, // 是否显示历史订单
			commentText: '', // 用户输入框的文本
			showMorePanel: false, // 输入框展开区域控制
			tips_btn: [
				{
					name: '服务评价',
					url: ''
				}, {
					name: '我要催单',
					url: ''
				}, {
					name: '物流查询',
					url: ''
				}, {
					name: '退换货',
					url: ''
				}, {
					name: '积分兑换',
					url: ''
				}
			],
			evaluate_view: false, // 评价弹出层
			keyword: '',
			consult_view: false, // 咨询弹出层
			list: [{
				name: '我的订单'
			}, {
				name: '我的售后'
			}, {
				name: '我的浏览'
			}, {
				name: '我的关注'
			}],
			order_list: [
				{
					type: "订单号",
					orderNum: "00000000",
					time: "2022.01.01 00:00:00",
					img: "/static/1.jpg",
					name: "name",
					state2: "已完成",
					price: 0,
					num: 1
				}
			],
			sale_list: [
				{
					type: "售后号",
					orderNum: "00000000",
					time: "2022.01.01 00:00:00",
					img: "/static/1.jpg",
					name: "name",
					state1: "退货",
					state2: "已完成",
					price: 0,
					num: 1
				}
			],
			browse_list: [
				{
					img: "/static/1.jpg",
					name: "十月稻田 黄金玉米段 1.6斤（8段）黄糯aaaa1111232132131232131211aa",
					tags: ["7天无理由退款", "30天只换不修"],
					price: 200
				}
			],
			swiper_list: [],
			consult_current: 0, // 控制swiper-item活动项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的

			keyboardHeight: 0, // 键盘高度
			inputBottom: '0', // 输入框的 bottom 值
			adjustPosition: true, // 键盘弹出时，是否自动调整抬升页面
		}
	},
	//   onLoad() {
	//   uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
	// },
	// onUnload() {
	//   uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
	// },


	mounted() {
		this.epH = uni.getWindowInfo().windowHeight + "px"
		this.epW = uni.getWindowInfo().windowWidth - 24 + "px"
		this.addBackendMessages(this.backendMessages)
		// 监听键盘高度变化
		uni.onKeyboardHeightChange(res => {
			this.keyboardHeight = res.height; // 获取键盘高度
			if (this.keyboardHeight === 0) { // 键盘收起
				this.inputBottom = '0'; // 输入框的 bottom 值
			}
		});
	},
	methods: {
		// 	onKeyboardHeightChange(res) {
		//   const { height, duration } = res;
		//   // 键盘弹起
		//   if (height > 0) {
		//     console.log('键盘弹起');
		//   }
		//   // 键盘收回
		//   else {
		//     console.log('键盘收回');
		//   }
		// },
		handleRefresh() {
			console.log('刷新')
		},

		onPullDownRefresh() {
			console.log('下拉刷新')
		},
		addImgMessage(imagePath) {
			const newMessageId = 'sp' + Date.now().toString();
			const currentTime = new Date().toLocaleString();
			this.messageList.push({
				id: newMessageId,
				type: "userimage",
				content: imagePath,
				time: currentTime
			});

			this.insertTimeWithCheck(currentTime)
			this.$nextTick(() => {
				this.scrollIntoViewId = newMessageId; // 滚动到最新消息的 ID
			})
		},
		uploadFile() {
			// 上传图片到后端接口
			uni.uploadFile({
				url: 'http://your-server-url/upload', // 替换为你的服务器上传接口地址
				filePath: tempFilePaths[0],
				name: 'file',
				success: (res) => {
					// 处理上传成功后的逻辑
					// 通过 res.data 获取上传成功的图片路径
					const imagePath = res.data;
					// 将消息发送发送给后端
					const newMessageId = 'sp' + Date.now().toString();
					const currentTime = new Date().toLocaleString();
					const message = {
						id: newMessageId,
						type: "userimage",
						content: imagePath,
						time: currentTime
					};
					uni.request({
						url: 'http://your-server-url/sendMessage', // 替换为你的服务器保存接口地址
						method: 'POST',
						data: {
							message
						},
						success: (res) => {
							console.log('消息发送成功', res);
						},
						fail: (err) => {
							console.error('消息发送失败', err);
						}
					})
				},
				fail: (err) => {
					console.error('图片上传失败', err);
				}
			})
		},
		file2Base64(filePath) { //filePath为图片路径
			return new Promise((resolve, reject) => {
				uni.getFileSystemManager().readFile({
					filePath: filePath, //选择图片返回的相对路径
					encoding: 'base64', //编码格式
					success: res => { //成功的回调
						resolve('data:image/png;base64,' + res.data)
					},
				})
			})
		},
		sendImg(filePath) {
			this.file2Base64(filePath).then(res => {
				this.addImgMessage(res)
			})
		},
		open_album() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album'],
				success: (res) => {
					const tempFilePaths = res.tempFilePaths;
					// 将图片路径传递给后端接口进行处理
					this.sendImg(tempFilePaths[0]);
				},
				fail: (err) => {
					console.error(err);
				}
			});
		},
		open_camera() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['camera'],
				success: (res) => {
					const tempFilePaths = res.tempFilePaths;
					this.sendImg(tempFilePaths[0]);
				},
				fail: (err) => {
					console.error(err);
				}
			})
		},
		// 模拟请求
		addBackendMessages(messages) {
			messages.forEach((message, index) => {
				message.time = Date.now(); // 动态生成当前时间戳
				message.id = `sp${message.time}`; // 为每条消息生成唯一 ID
				this.insertMessageWithTimeCheck(message);
			});
			// 滚动到最后一条消息
			this.scrollIntoViewId = this.messageList[this.messageList.length - 1].id;
		},
		insertMessageWithTimeCheck(message) {
			const formattedTime = this.formatTime(message.time);
			if (formattedTime) {
				const lastIndex = this.messageList.length - 1;
				if (lastIndex >= 0) {
					const lastMessageTime = new Date(this.messageList[lastIndex].time).getTime();
					const currentTimeStamp = new Date(message.time).getTime();
					const timeDiff = (currentTimeStamp - lastMessageTime) / (1000 * 60); // 时间差（分钟）

					if (timeDiff > 1) {
						this.messageList.push({
							type: "time",
							time: formattedTime
						});
					}
				} else {
					this.messageList.push({
						type: "time",
						time: formattedTime
					});
				}
			}
			this.messageList.push(message);
		},
		toggleMorePanel() {
			this.showMorePanel = !this.showMorePanel
			if (this.showMorePanel) {
				this.adjustPosition = false
				this.boxheight.input = "35%"
				this.boxheight.chat = "65%"
			} else {
				this.adjustPosition = true
				this.boxheight.input = "13%"
				this.boxheight.chat = "86%"
			}
		},
		input_foucs() {
			if (this.showMorePanel) {
				this.toggleMorePanel()
				this.inputBottom = this.keyboardHeight + 'px';
			}

			this.showMorePanel = false
		},
		close_MorePanel() {
			this.showMorePanel = false
			this.boxheight.input = "13%"
			this.boxheight.chat = "86%"
			this.inputBottom = this.keyboardHeight + 'rpx'; // 将输入框移动到键盘上方
		},
		onBlur() {
			this.inputBottom = '0'; // 恢复输入框到底部
		},
		formatTime(timestamp) {
			const now = new Date();
			const messageTime = new Date(timestamp);

			const year = messageTime.getFullYear();
			const month = messageTime.getMonth() + 1;
			const day = messageTime.getDate();
			const hours = messageTime.getHours();
			const minutes = messageTime.getMinutes().toString().padStart(2, '0');

			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const messageDate = new Date(year, month - 1, day);

			if (messageDate.toDateString() === today.toDateString()) {
				// 今天
				if (hours >= 0 && hours < 5) return `凌晨 ${hours}:${minutes}`;
				if (hours >= 5 && hours < 9) return `早上 ${hours}:${minutes}`;
				if (hours >= 9 && hours < 12) return `上午 ${hours}:${minutes}`;
				if (hours >= 12 && hours <= 13) return `中午 ${hours}:${minutes}`;
				if (hours > 13 && hours < 19) return `下午 ${hours}:${minutes}`;
				if (hours >= 19 && hours < 24) return `晚上 ${hours}:${minutes}`;
			} else if (messageTime.getFullYear() === now.getFullYear()) {
				// 本年
				const weekDay = messageTime.getDay();
				if (weekDay === now.getDay() && messageTime.getMonth() === now.getMonth()) {
					// 本周
					return `${['周一', '周二', '周三', '周四', '周五', '周六', '周日'][weekDay]} ${hours}:${minutes}`;
				} else {
					// 本年非本周
					return `${month}月${day}日 ${hours}:${minutes}`;
				}
			} else {
				// 非本年
				return `${year}年${month}月${day}日 ${hours}:${minutes}`;
			}
		},
		insertTimeWithCheck(currentTime) {
			// 检查并插入时间戳
			const lastIndex = this.messageList.length - 2;
			if (lastIndex >= 0) {
				const lastMessageTime = new Date(this.messageList[lastIndex].time).getTime();
				const currentTimeStamp = new Date(currentTime).getTime();
				const timeDiff = (currentTimeStamp - lastMessageTime) / (1000 * 60); // 时间差（分钟）

				if (timeDiff > 1) {
					const formattedTime = this.formatTime(currentTimeStamp);
					if (formattedTime) {
						this.messageList.splice(lastIndex + 1, 0, {
							type: "time",
							time: formattedTime
						});
					}
				}
			}
		},
		handleSubmit() {
			if (!this.commentText.trim()) {
				return;
			}
			const newMessageId = 'sp' + Date.now().toString();
			const currentTime = new Date().toLocaleString();
			this.messageList.push({
				id: newMessageId,
				type: "user",
				content: this.commentText,
				time: currentTime
			});
			this.commentText = '';

			this.insertTimeWithCheck(currentTime);

			this.$nextTick(() => {
				this.scrollIntoViewId = newMessageId;
				// this.scrollIntoViewId = ""
			});
		},
		handSendproduct(data) {
			if (!data) {
				return;
			}
			const newMessageId = 'sp' + Date.now().toString();
			const currentTime = new Date().toLocaleString();
			this.messageList.push({
				id: newMessageId,
				type: "product_item", // 假设 data 包含产品信息
				info: data, // 假设 data 是产品信息对象
				time: currentTime
			});

			// 检查并插入时间戳
			this.insertTimeWithCheck(currentTime);

			this.$nextTick(() => {
				this.scrollIntoViewId = newMessageId;
			});
		},
		getCPMsg() {

		},
		handleMaskClick() {
			if (this.showMorePanel) {
				this.showMorePanel = false
				this.adjustPosition = true
				this.boxheight.input = "13%"
				this.boxheight.chat = "86%"
			}
		},
		handleTipsBtnClick(url) {
			uni.navigateTo({
				url: url
			})
		},
		close_oldOrder() {
			this.showOldOrder = false
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
		tabsChange(index) {
			this.swiperCurrent = index;
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
			console.log('到底了')
		}
	},
}
</script>

<style lang="scss" scoped>
.chat {
	.message-list {
		flex: 1;
		overflow-y: auto;
		padding: 0 21.03rpx;
		background-color: #f5f5f5;
		height: 100%;
		width: calc(100% - 42.06rpx);

		::-webkit-scrollbar {
			display: none;
		}

		.message-item {
			margin: 20rpx 0;

			.message-bubble {
				max-width: 80%;
				padding: 20rpx;
				border-radius: 10.51rpx;
				font-size: 31.54rpx;
				line-height: 1.5;
			}

			.other-message {
				align-self: flex-start;
				background-color: #fff;
				color: #333;
				box-shadow: 0 3.50rpx 8.76rpx rgba(0, 0, 0, 0.1);
			}

			.frist-message {
				height: 108rpx;
				position: relative;
				display: flex;
				flex-direction: column-reverse;

				.avatar {
					width: 108rpx;
					height: 108rpx;
					position: absolute;
					top: 0;
					left: 0;
					border-radius: 50%;
					background-color: #fff;
					box-shadow: 0 3.50rpx 8.76rpx rgba(0, 0, 0, 0.1);
				}

				.text {
					margin-left: 35.05rpx;
					padding: 18rpx 18rpx 18rpx 90rpx;
					border-radius: 10.51rpx;
					font-size: 21.03rpx;
					line-height: 1.5;
					align-self: flex-start;
					background-color: #fff;
					color: #333333;
					box-shadow: 0 3.50rpx 8.76rpx rgba(0, 0, 0, 0.1);
				}
			}

			.tips-message {
				margin: 16rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 32rpx;
				font-size: 22rpx;
				color: #666666;
			}

		}

		.user-area {
			display: flex;
			flex-direction: row-reverse;
		}
	}
}

.empty-box {
	background-color: #F3F3F3;
}

.old-order {
	position: fixed;
	width: 100%;
}

.input {
	background-color: #F3F3F3;
	position: fixed;
	// bottom: 0;
	width: 100%;
	z-index: 999;
	min-height: 13%;

	.comment-box {
		background-color: #F3F3F3;
		animation: slideUp 0.2s ease-out;
		padding: 16rpx 24rpx 24rpx 24rpx;

		.tips-btn {
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

		.comment-input-area {
			margin-top: 24rpx;
			width: calc(100% - 26rpx);
			min-height: 68rpx;
			display: flex;
			align-items: flex-start;
			gap: 20rpx;

			.comment-input-box {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				background-color: #FFFFFF;
				border-radius: 16rpx;
				padding: 0 24rpx;
				width: 77%;

				.comment-input {
					flex: 1;
					background: #fff;
					font-size: 24rpx;
					border: none;
					padding: 17rpx 0;
					overflow-y: auto;
				}

				.emoji-btn {
					font-size: 34rpx;
					line-height: 1;
					color: #666;
					margin-top: 16rpx;
				}

				.emoji-btn:active {
					opacity: 0.7;
				}

				textarea {
					::-webkit-scrollbar {
						display: none;
					}
				}
			}

			.toolbar {
				width: 23%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-evenly;
				gap: 20rpx;

				.item {
					height: 68rpx;
					width: 68rpx;
					background-color: #FFFFFF;
					border-radius: 16rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}

		.more-panel {
			margin: 35.05rpx 0 24rpx 0;
			height: 100%;
			background: #F3F3F3;
			animation: slideUp 0.2s ease-out;

			.box {
				.item {
					font-size: 24rpx;
					color: #999999;

					.icon {
						padding: 32rpx;
						background-color: #FFFFFF;
						border-radius: 16rpx;

						image {
							width: 52rpx;
							height: 52rpx;
						}
					}

					.text {
						margin-top: 16rpx;
						color: #666666;
					}

					// 向下选一个子元素view
					&>div {
						background-color: #F3F3F3;
					}

				}
			}


		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
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
</style>