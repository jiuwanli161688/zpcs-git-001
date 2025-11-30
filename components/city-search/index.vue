<template>
	<view class="city-select-container" :style="{ paddingTop: statusBarHeight + 'px' }">
		<!-- Header: Search Bar with Suggestions -->
		<city-search
			:isFocus="isReach" 
			:filteredCities="filteredCities" 
			@focus="isReach = true" 
			@search="searchHandle"
			@select="selectCity"
			@reset="resetSearch"
		></city-search>

		<!-- 添加加载状态 -->
		<city-loading 
			:loading="isLoading" 
			text="正在加载城市数据..."
		></city-loading>

		<!-- 添加错误状态 -->
		<city-error 
			:show="hasError && !isLoading"
			:message="errorMessage"
			@retry="loadCityData"
		></city-error>

		<!-- Main Content -->
		<scroll-view 
			v-if="!isLoading && !hasError"
			class="scroll-container" 
			scroll-y 
			:scroll-into-view="scrollIntoId" 
			:scroll-with-animation="true"
		>
			<!-- Normal View (No Search) -->
			<view v-if="!isSearching">
				
				<!-- Hot Cities -->
				<city-section 
					sectionId="section-hot"
					title="热门城市"
					:list="hotCities"
					:currentCity="currentCity"
					@select="selectCity"
				></city-section>

				<!-- Recent Use -->
				<city-section 
					v-if="recentCities.length > 0"
					sectionId="section-recent"
					title="最近使用"
					:list="recentCities"
					:currentCity="currentCity"
					:showTrash="true"
					@clear="clearRecent"
					@select="selectCity"
				></city-section>

				<!-- Alphabet Index Grid -->
				<city-alphabet 
					:alphabet="alphabet"
					@change="scrollToLetter"
				></city-alphabet>

				<!-- City List by Letter -->
				<city-list 
					:data="cityData"
					@select="selectCity"
				></city-list>
				
				<!-- Bottom padding -->
				<view style="height: 80rpx;"></view>
			</view>
		</scroll-view>

		<!-- Right Side Index Bar -->
		<city-index 
			v-if="!isSearching && !isLoading && !hasError"
			:alphabet="alphabet"
			@change="scrollToLetter"
		></city-index>

	</view>
</template>

<script>
	import { hotCities as defaultHotCities, cityData as defaultCityData } from './city-data.js';
	import cityAlphabet from './components/city-alphabet.vue'
	import cityError from './components/city-error.vue'
	import cityIndex from './components/city-index.vue'
	import cityList from './components/city-list.vue'
	import cityLoading from './components/city-loading.vue'
	import citySearch from './components/city-search.vue'
	import citySection from './components/city-section.vue'
	import { searchCities, getHotCities } from '@/api/shop/home/location'

	export default {
		components: {
			cityAlphabet,
			cityError,
			cityIndex,
			cityList,
			cityLoading,
			citySearch,
			citySection,
		},
			data() {
			return {
				isReach: false,
				searchFocus: false,
				statusBarHeight: 20,
				searchText: '',
				currentCity: '',
				currentCityInfo: null, // 当前城市完整信息
				scrollIntoId: '',
				hotCities: [],
				cityData: [],
				recentCities: [],
				alphabet: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
				isLoading: true,
				hasError: false,
				errorMessage: '数据加载失败',
				searchCache: {},
				showSuggestions: false,
				searchTimer: null // 搜索防抖定时器
			};
		},
		computed: {
			isSearching() {
				return this.searchText && this.searchText.trim().length > 0;
			},
			filteredCities() {
				if (!this.searchText) return [];
				const text = this.searchText.trim();
				
				// 优先使用缓存
				if (this.searchCache[text]) {
					return this.searchCache[text];
				}
				
				// 如果没有缓存，先触发搜索（异步）
				if (text) {
					this.$nextTick(() => {
						this.performSearch(text);
					});
				}
				
				// 临时使用本地数据搜索作为兜底
				return this.searchLocalCities(text);
			},
			suggestions() {
				if (!this.searchText || this.searchText.length < 1) return [];
				return this.filteredCities.slice(0, 5);
			}
		},
		watch: {
			searchText(val) {
				if (val && val.trim()) {
					this.showSuggestions = val.length > 0 && val.length < 3;
					// 实时搜索（防抖处理）
					clearTimeout(this.searchTimer);
					this.searchTimer = setTimeout(() => {
						this.performSearch(val.trim());
					}, 300);
				} else {
					this.showSuggestions = false;
				}
			},
			isReach(val) {
				this.searchFocus = val;
			}
		},
		onLoad() {
			const info = uni.getSystemInfoSync();
			this.statusBarHeight = info.statusBarHeight || 20;
		},
		mounted() {
			this.loadCurrentCity();
			this.loadCityData();
		},
		beforeDestroy() {
			// 清理定时器
			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
			}
		},
		methods: {
			resetSearch(){
				
			},
			searchHandle(val) {
				console.log('点搜索', val)
				if (val && val.trim()) {
					this.searchText = val.trim();
					this.performSearch(this.searchText);
				} else {
					// 清除搜索
					this.searchText = '';
					// 清除搜索时，清空相关状态
					this.showSuggestions = false;
				}
			},
			
			/**
			 * 执行搜索
			 */
			async performSearch(keyword) {
				if (!keyword || !keyword.trim()) {
					return;
				}
				
				const key = keyword.trim();
				
				// 检查缓存（最多缓存20个搜索结果）
				if (this.searchCache[key]) {
					return;
				}
				
				// 限制缓存数量，避免内存溢出
				const cacheKeys = Object.keys(this.searchCache);
				if (cacheKeys.length >= 20) {
					// 删除最旧的缓存（简单策略：删除第一个）
					delete this.searchCache[cacheKeys[0]];
				}
				
				try {
					// 调用搜索接口
					const res = await searchCities(key);
					console.log("搜索结果", res)
					if (res && res.data.success && res.data.result && Array.isArray(res.data.result)) {
						// 转换数据格式
						const cities = res.data.result.map(item => ({
							name: item.name,
							id: item.cityCode || item.id || '',
							pinyin: this.getPinyin(item.name),
							cityCode: item.cityCode || '',
							adCode: item.adCode || '',
							level: item.level || ''
						}));
						
						// 缓存搜索结果
						this.$set(this.searchCache, key, cities);
					} else {
						// 接口返回空结果
						this.$set(this.searchCache, key, []);
					}
				} catch (error) {
					console.error('搜索城市失败:', error);
					// 搜索失败时，使用本地数据搜索作为兜底
					const localResult = this.searchLocalCities(key);
					this.$set(this.searchCache, key, localResult);
					
					// 如果是网络错误，可以提示用户
					if (error.message && error.message.includes('network')) {
						uni.showToast({
							title: '网络异常，已使用本地数据',
							icon: 'none',
							duration: 2000
						});
					}
				}
			},
			
			/**
			 * 本地数据搜索（备用方案）
			 */
			searchLocalCities(keyword) {
				const text = keyword.toLowerCase().trim();
				let result = [];
				this.cityData.forEach(group => {
					group.list.forEach(city => {
						if (city.name.includes(keyword) || 
							(city.pinyin && city.pinyin.toLowerCase().includes(text))) {
							result.push(city);
						}
					});
				});
				return result;
			},
			
			/**
			 * 获取城市拼音（简单实现，实际可以使用拼音库）
			 */
			getPinyin(cityName) {
				// 如果本地数据中有，直接使用
				for (let group of this.cityData) {
					for (let city of group.list) {
						if (city.name === cityName) {
							return city.pinyin || '';
						}
					}
				}
				// 否则返回空字符串
				return '';
			},
			
			/**
			 * 加载城市数据
			 */
			async loadCityData() {
				this.isLoading = true;
				this.hasError = false;
				
				try {
					// 1. 优先从本地缓存加载
					const cachedCities = uni.getStorageSync('city_data_cache');
					const cachedHotCities = uni.getStorageSync('hot_cities_cache');
					
					if (cachedCities && cachedHotCities) {
						this.cityData = JSON.parse(cachedCities);
						this.hotCities = JSON.parse(cachedHotCities);
						this.isLoading = false;
					} else {
						// 使用默认数据
						this.cityData = defaultCityData;
						this.hotCities = defaultHotCities;
						this.isLoading = false;
					}
					
					// 2. 异步请求最新数据（如有网络）
					this.loadHotCitiesFromApi();
					
					this.loadRecentCities();
				} catch (e) {
					console.error('加载城市数据失败:', e);
					this.cityData = defaultCityData;
					this.hotCities = defaultHotCities;
					this.isLoading = false;
					this.hasError = true;
					this.errorMessage = '数据加载失败，请检查网络后重试';
				}
			},
			
			/**
			 * 从接口加载热门城市
			 */
			async loadHotCitiesFromApi() {
				try {
					// 获取当前城市代码
					let cityCode = '';
					try {
						const currentCityInfo = uni.getStorageSync('current_city_info');
						if (currentCityInfo) {
							const info = typeof currentCityInfo === 'string' ? JSON.parse(currentCityInfo) : currentCityInfo;
							cityCode = info.cityCode || '';
						}
					} catch (e) {
						console.warn('获取当前城市代码失败:', e);
					}
					
					const res = await getHotCities({
						pageNumber: 1,
						pageSize: 8,
						cityCode: cityCode
					});

					if (res && res.data.success && res.data.result && res.data.result.records) {
						// 转换数据格式
						const hotCities = res.data.result.records.map(item => ({
							name: item.name,
							id: item.cityCode || '',
							pinyin: this.getPinyin(item.name),
							cityCode: item.cityCode || '',
							sort: item.sort || 0
						}));
						
						// 更新热门城市
						if (hotCities.length > 0) {
							this.hotCities = hotCities;
							// 更新缓存
							try {
								uni.setStorageSync('hot_cities_cache', JSON.stringify(hotCities));
							} catch (e) {
								console.warn('缓存热门城市失败:', e);
							}
						}
					}
				} catch (error) {
					console.error('加载热门城市失败:', error);
					// 接口失败不影响主流程，使用缓存数据或默认数据
					if (this.hotCities.length === 0) {
						this.hotCities = defaultHotCities;
					}
				}
			},
			
			loadCurrentCity() {
				try {
					// 加载当前城市信息
					const cityInfo = uni.getStorageSync('current_city_info');
					if (cityInfo) {
						const info = typeof cityInfo === 'string' ? JSON.parse(cityInfo) : cityInfo;
						this.currentCity = info.name || info.city || '北京';
						this.currentCityInfo = info;
					} else {
						// 兼容旧版本存储
						const city = uni.getStorageSync('current_city');
						if (city) {
							this.currentCity = city;
							this.currentCityInfo = { name: city, city: city };
						} else {
							this.currentCity = '北京';
							this.currentCityInfo = { name: '北京', city: '北京' };
						}
					}
				} catch (e) {
					console.error('加载当前城市失败:', e);
					this.currentCity = '北京';
					this.currentCityInfo = { name: '北京', city: '北京' };
				}
			},
			
			handleSearch() {
				this.showSuggestions = false;
				if (this.isSearching && this.filteredCities.length === 0) {
					// eslint-disable-next-line
					uni.showToast({
						title: '未找到城市',
						icon: 'none'
					});
				}
			},
			letterTransform(letter) {
				let str = "";
				if (letter == "area") {
					str = "区县";
				} else if (letter == "hot") {
					str = "热门";
				} else {
					str = letter;
				}

				return str;
			},
			scrollToLetter(letter) {
				const id = letter === 'hot' ? 'section-hot' : 'section-' + letter;
				this.scrollIntoId = id;

				uni.vibrateShort();
				let curentLetter = this.letterTransform(letter);
				uni.showToast({
					title: curentLetter,
					icon: "none",
					duration: 1000
				});
			},
			
			selectCity(city) {
				const previousCity = this.currentCity;
				const previousCityInfo = this.currentCityInfo;
				
				try {
					// 更新当前城市
					this.currentCity = city.name;
					this.currentCityInfo = {
						name: city.name,
						city: city.name,
						cityCode: city.cityCode || city.id || '',
						id: city.id || city.cityCode || '',
						pinyin: city.pinyin || '',
						adCode: city.adCode || '',
						level: city.level || ''
					};
					
					// 添加到最近使用
					this.addToRecent(city);
					
					// 保存到本地存储
					uni.setStorageSync('current_city', city.name);
					uni.setStorageSync('current_city_info', JSON.stringify(this.currentCityInfo));
					
					// 发送城市切换事件
					uni.$emit('cityChanged', {
						city: this.currentCityInfo,
						previousCity: previousCity,
						previousCityInfo: previousCityInfo
					});
					
					// 显示成功提示
					uni.showToast({
						title: `已切换到: ${city.name}`,
						icon: 'success',
						duration: 1500
					});
					
					// 延迟返回，让用户看到提示
					setTimeout(() => {
						uni.redirectTo({ url: '/pages/tabbar/home/index' });
					}, 1500);
					
				} catch (e) {
					console.error('城市切换失败:', e);
					// 恢复原城市
					this.currentCity = previousCity;
					this.currentCityInfo = previousCityInfo;
					
					// 显示错误提示
					uni.showToast({
						title: '切换失败，请重试',
						icon: 'none',
						duration: 2000
					});
				}
			},
			
			loadRecentCities() {
				try {
					const value = uni.getStorageSync('recent_cities');
					if (value) {
						const cities = typeof value === 'string' ? JSON.parse(value) : value;
						if (Array.isArray(cities)) {
							this.recentCities = cities;
						} else {
							this.recentCities = [];
						}
					} else {
						// 如果没有历史记录，使用默认数据
						this.recentCities = [];
					}
				} catch (e) {
					console.error('加载最近使用城市失败:', e);
					this.recentCities = [];
				}
			},
			
			addToRecent(city) {
				try {
					let recent = [...this.recentCities];
					// 移除同名城市
					recent = recent.filter(c => c.name !== city.name);
					// 添加到最前面
					recent.unshift(city);
					// 最多保留8个
					if (recent.length > 8) {
						recent = recent.slice(0, 8);
					}
					
					this.recentCities = recent;
					// 保存到本地存储
					uni.setStorageSync('recent_cities', JSON.stringify(recent));
				} catch (e) {
					console.error('保存最近使用城市失败:', e);
				}
			},
			
			clearRecent() {
				// eslint-disable-next-line
				uni.showModal({
					title: '提示',
					content: '确定清空最近使用的城市吗？',
					success: (res) => {
						if (res.confirm) {
							this.recentCities = [];
							// eslint-disable-next-line
							uni.removeStorageSync('recent_cities');
							// eslint-disable-next-line
							uni.showToast({
								title: '已清空',
								icon: 'success'
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.city-select-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		position: relative;
	}

	.scroll-container {
		flex: 1;
		background-color: #f7f7f7;
		overflow: hidden; 
	}

	.search-results {
		// background-color: #fff;
		background-color: red;
		height: calc(100vh - 170rpx);
		padding: 0 32rpx;
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow-y: auto;
	}

	.city-search-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 0;
		border-bottom: 2rpx solid #eee;
	}
	
	.city-name {
		font-size: 30rpx;
		color: #333;
	}
	
	.city-pinyin {
		font-size: 24rpx;
		color: #999;
	}
	
	.empty-state {
		padding-top: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.empty-icon {
		margin-bottom: 32rpx;
	}
	
	.icon-search-large {
		font-size: 96rpx;
		color: #ccc;
	}
	
	.empty-text {
		font-size: 32rpx;
		color: #666;
		margin-bottom: 16rpx;
	}
	
	.empty-tip {
		font-size: 26rpx;
		color: #999;
	}

	.h-full {
		height: 100vh;
	}
</style>
