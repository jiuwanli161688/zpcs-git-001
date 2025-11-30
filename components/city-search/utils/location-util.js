/**
 * 定位工具类
 * 处理定位相关的所有逻辑，包括权限请求、坐标获取、逆地理编码等
 */
import config from '@/config/config.js'

const LOCATION_TIMEOUT = 3000 // 定位超时时间 3秒
const CACHE_KEY = 'location_cache' // 定位缓存键
const LAST_LOCATION_TIME_KEY = 'last_location_time' // 上次定位时间键
const AUTO_REFRESH_INTERVAL = 30 * 60 * 1000 // 自动刷新间隔 30分钟

/**
 * 定位状态枚举
 */
export const LocationStatus = {
	IDLE: 'idle', // 空闲
	LOCATING: 'locating', // 定位中
	SUCCESS: 'success', // 定位成功
	FAILED: 'failed', // 定位失败
	PERMISSION_DENIED: 'permission_denied', // 权限被拒绝
	NETWORK_ERROR: 'network_error', // 网络错误
	TIMEOUT: 'timeout' // 超时
}

/**
 * 获取定位权限状态
 */
export function getLocationPermission() {
	return new Promise((resolve) => {
		// #ifdef APP-PLUS
		// APP端权限检查
		try {
			if (plus.os.name === 'Android') {
				// Android平台
				const main = plus.android.runtimeMainActivity()
				const pkName = main.getPackageName()
				const context = main.getApplicationContext()
				const pm = context.getPackageManager()
				
				const permission1 = 'android.permission.ACCESS_FINE_LOCATION'
				const permission2 = 'android.permission.ACCESS_COARSE_LOCATION'
				
				const check1 = pm.checkPermission(permission1, pkName) === 0
				const check2 = pm.checkPermission(permission2, pkName) === 0
				
				resolve(check1 || check2)
			} else if (plus.os.name === 'iOS') {
				// iOS平台使用系统权限检查
				const cllocationManger = plus.ios.import('CLLocationManager')
				const authStatus = cllocationManger.authorizationStatus()
				// 0: 未决定, 1: 受限, 2: 拒绝, 3: 允许
				resolve(authStatus === 3)
			} else {
				resolve(false)
			}
		} catch (e) {
			console.error('权限检查失败:', e)
			resolve(false)
		}
		// #endif
		
		// #ifdef MP-WEIXIN
		// 微信小程序权限检查
		uni.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation']) {
					resolve(true)
				} else {
					resolve(false)
				}
			},
			fail: () => {
				resolve(false)
			}
		})
		// #endif
		
		// #ifdef H5
		// H5端检查
		if (navigator.geolocation) {
			resolve(true)
		} else {
			resolve(false)
		}
		// #endif
	})
}

/**
 * 请求定位权限
 */
export function requestLocationPermission() {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		// APP端请求权限 - 使用uni.getLocation会触发系统权限弹窗
		getLocationPermission().then((hasPermission) => {
			if (hasPermission) {
				resolve(true)
				return
			}
			
			// 尝试获取一次定位，这会触发系统权限弹窗
			uni.getLocation({
				type: 'gcj02',
				success: () => {
					resolve(true)
				},
				fail: (err) => {
					if (err.errMsg && err.errMsg.includes('permission')) {
						reject({
							code: LocationStatus.PERMISSION_DENIED,
							message: '需要您授权位置权限才能获取附近商家信息'
						})
					} else {
						// 其他错误，可能已经授权，尝试解析
						resolve(false)
					}
				}
			})
		})
		// #endif
		
		// #ifdef MP-WEIXIN
		// 微信小程序请求权限
		uni.authorize({
			scope: 'scope.userLocation',
			success: () => {
				resolve(true)
			},
			fail: () => {
				reject({
					code: LocationStatus.PERMISSION_DENIED,
					message: '需要您授权位置权限才能获取附近商家信息'
				})
			}
		})
		// #endif
		
		// #ifdef H5
		// H5端请求权限
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				() => resolve(true),
				() => reject({
					code: LocationStatus.PERMISSION_DENIED,
					message: '需要您授权位置权限才能获取附近商家信息'
				})
			)
		} else {
			reject({
				code: LocationStatus.PERMISSION_DENIED,
				message: '您的浏览器不支持定位功能'
			})
		}
		// #endif
	})
}

/**
 * 获取当前位置坐标
 */
export function getCurrentLocation() {
	return new Promise((resolve, reject) => {
		let timeoutTimer = null
		
		// 设置超时
		timeoutTimer = setTimeout(() => {
			reject({
				code: LocationStatus.TIMEOUT,
				message: '定位超时，请检查网络或稍后重试'
			})
		}, LOCATION_TIMEOUT)
		
		// 获取定位
		uni.getLocation({
			type: 'gcj02', // 高德坐标系
			altitude: false,
			geocode: false,
			success: (res) => {
				clearTimeout(timeoutTimer)
				resolve({
					latitude: res.latitude,
					longitude: res.longitude,
					accuracy: res.accuracy || 0
				})
			},
			fail: (err) => {
				clearTimeout(timeoutTimer)
				let errorCode = LocationStatus.FAILED
				let errorMessage = '定位失败，请稍后重试'
				
				if (err.errMsg && err.errMsg.includes('permission')) {
					errorCode = LocationStatus.PERMISSION_DENIED
					errorMessage = '需要您授权位置权限才能获取附近商家信息'
				} else if (err.errMsg && err.errMsg.includes('timeout')) {
					errorCode = LocationStatus.TIMEOUT
					errorMessage = '定位超时，请检查网络或稍后重试'
				}
				
				reject({
					code: errorCode,
					message: errorMessage,
					originalError: err
				})
			}
		})
	})
}

/**
 * 坐标转标准格式
 */
export function normalizeCoordinate(latitude, longitude) {
	return {
		latitude: parseFloat(latitude.toFixed(6)),
		longitude: parseFloat(longitude.toFixed(6))
	}
}

/**
 * 逆地理编码：坐标转城市名称
 */
export function reverseGeocode(latitude, longitude) {
	return new Promise((resolve, reject) => {
		// 检查网络状态
		uni.getNetworkType({
			success: (networkRes) => {
				if (networkRes.networkType === 'none') {
					reject({
						code: LocationStatus.NETWORK_ERROR,
						message: '网络连接失败，请检查网络设置'
					})
					return
				}
				
				// 调用高德逆地理编码API
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo',
					method: 'GET',
					data: {
						key: config.aMapKey,
						location: `${longitude},${latitude}`,
						extensions: 'base'
					},
					success: (res) => {
						if (res.statusCode === 200 && res.data && res.data.status === '1') {
							const addressComponent = res.data.regeocode.addressComponent
							const city = addressComponent.city || addressComponent.province || '未知城市'
							const province = addressComponent.province || ''
							const district = addressComponent.district || ''
							
							// 处理直辖市和特殊城市名称
							let cityName = city
							if (city && city.endsWith('市')) {
								cityName = city.replace('市', '')
							}
							
							resolve({
								city: cityName,
								province: province,
								district: district,
								address: res.data.regeocode.formatted_address || '',
								fullCityName: city
							})
						} else {
							reject({
								code: LocationStatus.FAILED,
								message: res.data?.info || '获取城市信息失败'
							})
						}
					},
					fail: (err) => {
						reject({
							code: LocationStatus.NETWORK_ERROR,
							message: '网络请求失败，请检查网络连接',
							originalError: err
						})
					}
				})
			},
			fail: () => {
				reject({
					code: LocationStatus.NETWORK_ERROR,
					message: '无法获取网络状态'
				})
			}
		})
	})
}

/**
 * 完整定位流程：获取坐标 -> 逆地理编码 -> 返回城市信息
 */
export async function getLocationCity() {
	try {
		// 1. 检查并请求权限
		const hasPermission = await getLocationPermission()
		if (!hasPermission) {
			throw {
				code: LocationStatus.PERMISSION_DENIED,
				message: '需要您授权位置权限才能获取附近商家信息'
			}
		}
		
		// 2. 获取坐标
		const location = await getCurrentLocation()
		
		// 3. 坐标标准化
		const normalizedCoord = normalizeCoordinate(location.latitude, location.longitude)
		
		// 4. 逆地理编码
		const cityInfo = await reverseGeocode(normalizedCoord.latitude, normalizedCoord.longitude)
		
		// 5. 合并结果并缓存
		const result = {
			...cityInfo,
			latitude: normalizedCoord.latitude,
			longitude: normalizedCoord.longitude,
			accuracy: location.accuracy,
			timestamp: Date.now()
		}
		
		// 缓存定位结果
		cacheLocation(result)
		
		return result
	} catch (error) {
		// 定位失败时，尝试使用缓存数据
		const cachedLocation = getCachedLocation()
		if (cachedLocation) {
			return {
				...cachedLocation,
				fromCache: true
			}
		}
		throw error
	}
}

/**
 * 缓存定位结果
 */
export function cacheLocation(locationData) {
	try {
		const cacheData = {
			...locationData,
			cacheTime: Date.now()
		}
		uni.setStorageSync(CACHE_KEY, JSON.stringify(cacheData))
		uni.setStorageSync(LAST_LOCATION_TIME_KEY, Date.now())
	} catch (e) {
		console.error('缓存定位数据失败:', e)
	}
}

/**
 * 获取缓存的定位数据
 */
export function getCachedLocation() {
	try {
		const cacheStr = uni.getStorageSync(CACHE_KEY)
		if (cacheStr) {
			return JSON.parse(cacheStr)
		}
	} catch (e) {
		console.error('读取定位缓存失败:', e)
	}
	return null
}

/**
 * 获取默认城市
 */
export function getDefaultCity() {
	const cached = getCachedLocation()
	if (cached && cached.city) {
		return cached.city
	}
	return '北京' // 默认城市
}

/**
 * 检查是否需要自动刷新定位
 */
export function shouldAutoRefresh() {
	try {
		const lastTime = uni.getStorageSync(LAST_LOCATION_TIME_KEY)
		if (!lastTime) {
			return true // 从未定位过，需要定位
		}
		const now = Date.now()
		return (now - lastTime) > AUTO_REFRESH_INTERVAL
	} catch (e) {
		return true
	}
}

/**
 * 打开系统设置页面（用于引导用户开启权限）
 */
export function openSystemSettings() {
	// #ifdef APP-PLUS
	// APP端打开系统设置
	if (plus.os.name === 'Android') {
		const Intent = plus.android.importClass('android.content.Intent')
		const Settings = plus.android.importClass('android.provider.Settings')
		const main = plus.android.runtimeMainActivity()
		const intent = new Intent(Settings.ACTION_SETTINGS)
		main.startActivity(intent)
	} else if (plus.os.name === 'iOS') {
		plus.ios.import('UIApplication').sharedApplication().openURL(
			plus.ios.import('NSURL').URLWithString('app-settings:')
		)
	}
	// #endif
	
	// #ifdef MP-WEIXIN
	// 微信小程序打开设置
	uni.openSetting({
		success: (res) => {
			console.log('打开设置成功:', res)
		},
		fail: (err) => {
			console.error('打开设置失败:', err)
		}
	})
	// #endif
	
	// #ifdef H5
	// H5端提示
	uni.showModal({
		title: '提示',
		content: '请在浏览器设置中开启定位权限',
		showCancel: false
	})
	// #endif
}

/**
 * 检查网络状态
 */
export function checkNetworkStatus() {
	return new Promise((resolve) => {
		uni.getNetworkType({
			success: (res) => {
				resolve({
					connected: res.networkType !== 'none',
					networkType: res.networkType
				})
			},
			fail: () => {
				resolve({
					connected: false,
					networkType: 'unknown'
				})
			}
		})
	})
}

