import storage from '@/utils/storage.js';
import Vue from "vue";
const ws = {
    wsTask: null, //
    wsTick: null, // 心跳
    wsIsConnected: false, //
    wsMyConnected: false, // 主动关闭
    wsCallback: null, // 消息回调
    // 重连相关
    reconnectCount: 0, // 重连次数
    reconnectTimer: null, // 重连定时器
    reconnectInterval: 5000, // 重连间隔 5秒
    maxReconnectCount: 20, // 最大重连次数，20次
    isReconnecting: false, // 是否正在重连
    reconnectCallback: null, // 重连状态回调
    maxReconnectReached: false, // 是否已达到最大重连次数

    // 获取地址
    wsHref: function (flag) {
        // return flag ? 'wss://im.zpwdsc.com/im-api/connect' : 'wss://im.zpwdsc.com/im-api/connect'
        // 临时测试：使用错误的地址来模拟连接失败
        // return flag ? 'wss://invalid-server.com/connect' : 'wss://invalid-server.com/connect'
        return flag ? 'ws://192.168.0.129:9999/connect' : 'ws://192.168.0.129:9999/connect'
    },

    // 设置重连回调
    setReconnectCallback: function(callback) {
        this.reconnectCallback = callback;
    },

    // 开始重连
    startReconnect: function(token) {
        if (this.isReconnecting) {
            console.log('已经在重连中，跳过');
            return;
        }

        // 检查是否已达到最大重连次数
        if (this.reconnectCount >= this.maxReconnectCount) {
            console.log('已达到最大重连次数，停止重连');
            this.maxReconnectReached = true;
            this.isReconnecting = false;

            // 通知UI显示最大重连次数提示
            if (this.reconnectCallback) {
                this.reconnectCallback({
                    type: 'max_reconnect_reached',
                    count: this.reconnectCount,
                    isReconnecting: false
                });
            }
            return;
        }

        this.isReconnecting = true;
        this.reconnectCount++;

        console.log(`开始第${this.reconnectCount}次重连`);

        // 通知UI更新重连状态
        if (this.reconnectCallback) {
            this.reconnectCallback({
                type: 'reconnecting',
                count: this.reconnectCount,
                isReconnecting: true
            });
        }

        // 清除之前的重连定时器
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        // 设置重连定时器
        this.reconnectTimer = setTimeout(() => {
            console.log(`执行第${this.reconnectCount}次重连`);
            this.wsConnect(token);
        }, this.reconnectInterval);
    },

        // 手动重连（用户点击手动重连按钮）
    manualReconnect: function(token) {
        console.log('用户手动重连');
        this.maxReconnectReached = false;
        this.reconnectCount = 0;
        this.isReconnecting = false;

        // 清除之前的重连定时器
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // 立即通知UI状态重置
        if (this.reconnectCallback) {
            this.reconnectCallback({
                type: 'manual_reconnect_started',
                count: 0,
                isReconnecting: true
            });
        }

        // 开始重连
        this.startReconnect(token);
    },

    // 停止重连
    stopReconnect: function() {
        this.isReconnecting = false;
        this.reconnectCount = 0;
        this.maxReconnectReached = false;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // 通知UI更新重连状态
        if (this.reconnectCallback) {
            this.reconnectCallback({
                type: 'reconnect_stopped',
                count: this.reconnectCount,
                isReconnecting: false
            });
        }
    },

    // 连接成功回调
    onConnectSuccess: function() {
        console.log('WebSocket连接成功，重置重连状态');
        this.isReconnecting = false;
        this.maxReconnectReached = false;

        // 保存当前重连次数用于UI显示
        const lastReconnectCount = this.reconnectCount;

        // 连接成功后重置重连次数，为下次断开做准备
        this.reconnectCount = 0;

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        // 通知UI连接成功 - 只有在重连过程中才显示连接恢复
        if (this.reconnectCallback && lastReconnectCount > 0) {
            console.log('reconnectCount', lastReconnectCount);
            this.reconnectCallback({
                type: 'connected',
                count: lastReconnectCount,
                isReconnecting: false
            });
        }
    },

        // 打开链接
    wsConnect: function (token) {
        let href = this.wsHref()
        let _this = this
        if (token) {
            _this.wsTask = uni.connectSocket({
                url: `${href}?himToken=${token}`,
                success: (r) => {

                    // socket 连接成功
                    uni.onSocketOpen((res) => {
                        console.log('链接成功', r)
                        _this.wsIsConnected = true
                        _this.wsMyConnected = false
                        // 只有在真正连接成功时才调用onConnectSuccess
                        _this.onConnectSuccess();
                    })

                    // 监测断开
                    uni.onSocketClose((res) => {
                        let newToken = uni.getStorageSync('him-token')
                        if (!_this.wsMyConnected && newToken) {
                            //主动断开不处理
                            if(res && res.code == 1000){
                                return;
                            }
                            console.log(res, '发生断开')
                            _this.wsIsConnected = false
                            clearInterval(_this.wsTick)

                            // 开始重连
                            _this.startReconnect(newToken);
                        }
                    })

                    // 监听连接错误
                    uni.onSocketError((res) => {
                        console.log('WebSocket连接错误', res);
                        _this.wsIsConnected = false;
                        // socket 连接错误 重置重连状态
                        _this.isReconnecting = false;
                        clearInterval(_this.wsTick);

                        // 连接错误时也进行重连
                        let newToken = uni.getStorageSync('him-token')
                        if (newToken) {
                            _this.startReconnect(newToken);
                        }
                    });

                    console.log("onSocketMessage")
                    uni.onSocketMessage((res) => {
                        let objMessage = JSON.parse(res.data)
                        console.log("收到消息")
                        // Vue.prototype.$popup.show('收到一条消息，点击查看', 3000);
                        if (_this.wsCallback) {
                            _this.wsCallback(objMessage)
                        } else {
                            console.log('全局收到', objMessage)
                        }
                    })
                    _this.wsTick = setInterval(function () {
                        let tempUserCode = storage.getUserInfo()
                        console.log(tempUserCode, 'tempUserCode');
                        _this.wsTickBeginning(tempUserCode.id)
                    }, 20 * 1000)


                },
                fail: (e) => {
                    console.log('链接失败', e)
                    _this.wsIsConnected = false;

                    // 连接失败时进行重连
                    setTimeout(() => {
                        _this.startReconnect(token);
                    }, 1000);
                }
            })
        }
    },
    // 关闭链接
    wsDisConnect: function (flag = false) {
        var _this = this;

        // 如果是主动关闭，停止重连
        if (flag) {
            this.stopReconnect();
        }

        this.wsTask.close({
            success: (res) => {
                console.log('手动断开', res)
                this.wsIsConnected = false
                this.wsMyConnected = flag
                if(_this.wsTick){
                    clearInterval(_this.wsTick)
                }
            }
        })
    },
    // 执行命令
    /**
     * cmd 	JSON命令
     * name 命令描述
     * type WS
     */
    wsSetMessage: function (name, cmd) {
        console.log(`${name}`, cmd)
        if (this.wsIsConnected) {
            this.wsTask.send({
                data: JSON.stringify(cmd),
                success: (r) => {
                    console.log('执行结果', r)
                }
            })
        }
    },
    // 收到消息
    // wsGetMessage: function(callback){
    // 	this.wsTask.onMessage(res => {
    // 		// console.log('WS收到', res)
    // 		callback && callback(JSON.parse(res.data))
    // 	})
    // },

    // 心跳命令
    wsTickBeginning: function (from) {
        let objCmd = {
            msgType: 0, //
            businessType: 0,
            contentType: 0,
            content: null,
            from: null,
            to: null,
            sendType: 1,
            timestamp: Number(new Date()),
            extra: null,
            read: false,
            friendId: null
        }
        this.wsSetMessage('发送心跳', objCmd)
    },
    // 新的心跳命令，用来监测客服评价
    appraise: function (groupId) {
        let objCmd = {
            msgType: 2, //
            businessType: 0,
            contentType: 0,
            content: null,
            from: null,
            to: groupId,
            sendType: 1,
            timestamp: Number(new Date()),
            extra: null,
            read: false,
            friendId: null
        }
        // this.wsSetMessage('发送评价心跳', objCmd)
    },

    // 创建聊天
    wsCreateChat: function (from, to) {
        let objCmd = {
            type: 'client_start',
            body: {},
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date())
        }
        this.wsSetMessage('创建聊天', objCmd)
    },

    // 停止排队
    wsLeaveMyChat: function (from, to) {
        let objCmd = {
            type: 'client_leave',
            body: {},
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date())
        }
        this.wsSetMessage('离开排队', objCmd)
    },

    // 通知阅读
    /**
     * cmd 	消息ID
     * from 消息发送者
     * to 	消息接收者
     */
    wsReadMessage: function (code, from, to) {
        let objCmd = {
            type: 'client_read',
            body: { data: { last_chat_id: code } },
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date())
        }
        this.wsSetMessage('通知阅读', objCmd)
    },

    // 发送文本
    wsSendTxt: function (params) {
        let objCmd = {
            msgType: 1, //
            businessType: 0,
            contentType: 0,
            content: null,
            from: null,
            to: null,
            sendType: 1,
            timestamp: Number(new Date()),
            extra: null,
            read: false,
            friendId: null,
        }
        this.wsSetMessage('发送文本', { ...objCmd, ...params })
    },

    // 发送图片
    wsSendPic: function (path, from, to) {
        let objCmd = {
            type: 'client_chat',
            body: {
                data: { type: 'image', content: { path: path } }
            },
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date()),
        }
        this.wsSetMessage('发送图片', objCmd)
    },

    // 发送视频
    wsSendMp4: function (video, image, from, to) {
        let objCmd = {
            type: 'client_chat',
            body: {
                data: { type: 'video', content: { path: video, duration: 10, with: 100, height: 100, thumb: image } }
            },
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date()),
        }
        this.wsSetMessage('发送视频', objCmd)
    },

    // 发送商品
    wsSendGoods: function (goodsCode, from, to) {
        let objCmd = {
            type: 'client_chat',
            body: {
                data: { type: 'goods', content: { text: goodsCode } }
            },
            to: { id: to },
            from: { id: from },
            timestamp: Number(new Date()),
        }
        this.wsSetMessage('发送商品', objCmd)
    },

}

export default ws
