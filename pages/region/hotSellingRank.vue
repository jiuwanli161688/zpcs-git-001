<template>
	<view class="hot-selling-rank">
		<!-- 加载中状态 -->
		<view v-if="loading && goodsList.length === 0" class="loading-wrapper">
			<uni-load-more status="loading" :show-icon="true" :show-text="true" />
		</view>

		<!-- 无数据状态 -->
		<view v-else-if="!loading && goodsList.length === 0" class="empty-wrapper">
			<EmptyBox text="暂无热销商品数据~" mode="common" />
		</view>

		<!-- 商品列表 -->
		<view v-else class="goods-container">
			<m-goods-list
				:res="goodsList"
				type="twoColumns"
				:storeName="false"
				:sourceState="false"
			/>

			<!-- 底部加载更多状态 -->
			<view class="load-more-wrapper">
				<uni-load-more
					:status="loadMoreStatus"
					:show-icon="true"
					:show-text="true"
					@click="loadMore"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import { getHotSalesRankList } from '@/api/region.js'
import EmptyBox from '@/components/Hina/EmptyBox.vue'
import mGoodsList from '@/components/m-goods-list/list.vue'
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

export default {
	name: 'HotSellingRank',
	components: {
		EmptyBox,
		mGoodsList,
		uniLoadMore
	},
	data() {
		return {
			goodsList: [], // 商品列表
			loading: false, // 初始加载状态
			loadMoreStatus: 'more', // 加载更多状态：more, loading, noMore
			pageParams: {
				pageNumber: 1, // 当前页码
				pageSize: 10 // 每页数量
			},
			hasMore: true // 是否还有更多数据
		}
	},
	onLoad() {
		this.initData()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		// 初始化数据
		initData() {
			this.loading = true
			this.pageParams.pageNumber = 1
			this.hasMore = true
			this.fetchGoodsList()
		},

		// 加载更多
		loadMore() {
			if (!this.hasMore || this.loadMoreStatus === 'loading') {
				return
			}

			this.loadMoreStatus = 'loading'
			this.pageParams.pageNumber += 1
			this.fetchGoodsList()
		},

		// 获取商品列表
		fetchGoodsList() {
			getHotSalesRankList(this.pageParams).then(response => {
				if (response.data && response.data.code == 200) {
					const result = response.data.result
					const records = result.records || []

					if (this.pageParams.pageNumber === 1) {
						// 第一页时替换数据
						this.goodsList = records
						this.loading = false
					} else {
						// 加载更多时追加数据
						this.goodsList = [...this.goodsList, ...records]
					}

					// 判断是否还有更多数据
					this.hasMore = records.length >= this.pageParams.pageSize &&
						this.pageParams.pageNumber < (result.pages || 1)

					// 更新加载更多状态
					if (!this.hasMore) {
						this.loadMoreStatus = 'noMore'
					} else {
						this.loadMoreStatus = 'more'
					}
				}else{
                    this.loading = false
                    this.loadMoreStatus = 'noMore'
                }
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.hot-selling-rank {
	background-color: #f5f5f5;
    min-height: calc(100vh - var(--window-top));
	.loading-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 400rpx;
	}

	.empty-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60vh;
	}

	.goods-container {

		.load-more-wrapper {
			padding: 20rpx 0;
			background-color: #f5f5f5;
		}
	}
}

/* 确保商品列表样式正确 */
/deep/ .goods-list {
	background-color: #f5f5f5;
    padding: 30rpx 20rpx 0rpx 20rpx;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

	.goods-item {
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
        width: calc(50% - 10rpx) !important;
        margin-right: 0 !important;

		&:hover {
			box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
		}
	}
}
</style>
