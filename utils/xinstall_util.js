export const getSetIntervalXInstallInfo = (successCallback, errorCallback) => {
    return new Promise((resolve) => {
        const xInstall = uni.requireNativePlugin('xinstall-plugin')
        let count = 0
        let installParams = null
        let evokeParams = null
        // 唤起参数
        xInstall.addWakeUpDetailEventListener(function (result) {
            let wakeUpData = result.wakeUpData
            let error = result.error
            if (JSON.stringify(wakeUpData) == '{}') {
                evokeParams = error
                errorCallback && errorCallback(result)
            } else {
                evokeParams = wakeUpData
                if (wakeUpData.data.uo.distributorNumber) {
                    uni.setStorageSync('isEvoke', true)
                    uni.setStorageSync('distributorNumber', wakeUpData.data.uo.distributorNumber)
                }else if(wakeUpData.data.co.distributorNumber){
                    uni.setStorageSync('isEvoke', true)
                    uni.setStorageSync('distributorNumber', wakeUpData.data.co.distributorNumber)
                }
                if(wakeUpData.data.uo.goodsId){
                    uni.setStorageSync('xInstallGoodsObj', wakeUpData.data.uo)
                }else if(wakeUpData.data.co.goodsId){
                    uni.setStorageSync('xInstallGoodsObj', wakeUpData.data.co)
                }
                successCallback && successCallback(result)
            }
        })

        const timer = setInterval(() => {
            count++
            // 如果已经获取到唤起参数，则不获取安装参数 或者 已经获取到安装参数，则不获取唤起参数
            if (!uni.getStorageSync('isEvoke') && !uni.getStorageSync('isInstall')) {
                // 安装参数
                xInstall.addInstallEventListener(function (result) {
                    if (result && JSON.stringify(result) !== '{}') {
                        installParams = result
                        if (result.data.uo.distributorNumber) {
                            if (!uni.getStorageSync('isInstall') && !uni.getStorageSync('isEvoke')) {
                                uni.setStorageSync('isInstall', true)
                                uni.setStorageSync('distributorNumber', result.data.uo.distributorNumber)
                            }
                        }else if(result.data.co.distributorNumber){
                            if (!uni.getStorageSync('isInstall') && !uni.getStorageSync('isEvoke')) {
                                uni.setStorageSync('isInstall', true)
                                uni.setStorageSync('distributorNumber', result.data.co.distributorNumber)
                            }
                        }
                        if(result.data.uo.goodsId){
                            uni.setStorageSync('xInstallGoodsObj', result.data.uo)
                        }else if(result.data.co.goodsId){
                            uni.setStorageSync('xInstallGoodsObj', result.data.co)
                        }
                        successCallback && successCallback(result)
                    }
                })
            }

            if (evokeParams) {
                clearInterval(timer)
                return resolve({ title: '唤起', evokeParams })
            }

            if (installParams) {
                clearInterval(timer)
                return resolve({ title: '安装', installParams })
            }
            // 如果请求次数超过20次，也就是十秒，则返回空
            if (count > 20) {
                clearInterval(timer)
                errorCallback && errorCallback('请求超时')
                return
            }
            if (count % 3 === 0) {
                const xInstall = uni.requireNativePlugin('xinstall-plugin')
                xInstall.init(); // 每3次重新 init 插件
            }
        }, 500)
    })
}