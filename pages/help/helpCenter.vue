<template>
	<view class="container">
		<view class="help">
			<view class="item" v-for="(item, index) in arrData" :key="index" v-if="item.type.length > 0">
				<view class="title">
					<image class="ico" :src="item.icon" mode="aspectFit"></image>
					<view class="txt">{{ item.name }}</view>
				</view>
				<view class="types">
					<view class="name" v-for="(o, i) in item.type" :key="i" :data-code="o.code" @tap="handlerClick">
						{{ o.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>


import { getArticleCategoryTree } from "../../api/article";

export default {
	name: '',
	components: {

	},
	data() {
		return {
			isComplete: false,
			arrData: []
		}
	},
	methods: {
		// 加载初始数据
		loadBaseData: function () {
			getArticleCategoryTree().then(res => {
				if (res.data.code == 200) {
					let result = res.data.result;
					result.forEach(item => {
						let children = [];
						item.children.forEach(citem => {
							children.push({ name: citem.articleCategoryName, code: citem.id })
						})
						this.arrData.push({
							code: item.id,
							icon: item.icon,
							name: item.articleCategoryName,
							type: children
						})
					})
				} else {
					uni.showToast({ title: '帮助中心内容加载失败', icon: 'none' })
				}
			})


			/*				this.arrData.push({
								icon: `${this.iconCommon}/static/v1/help/icon-ems.png`,
								name: '配送方式',
								type: [
									{ code: 1, name: '配送服务查询'},
									{ code: 1, name: '配送费收取标准'},
								]
							})
							this.arrData.push({
								icon: `${this.iconCommon}/static/v1/help/icon-buy.png`,
								name: '支付方式',
								type: [
									{ code: 1, name: '在线支付'},
								]
							})
							this.arrData.push({
								icon: `${this.iconCommon}/static/v1/help/icon-ems.png`,
								name: '售后服务',
								type: [
									{ code: 1, name: '售后政策'},
									{ code: 1, name: '价格保护'},
									{ code: 1, name: '退款说明'},
									{ code: 1, name: '返修/退换货'},
								]
							})*/
		},

		handlerClick: function (e) {
			let eCode = e.currentTarget.dataset.code
			uni.navigateTo({
				url: `/pages/help/list?category=${eCode}`
			})
		},
	},


	onLoad: function () {
		// 加载初始数据
		this.loadBaseData()
	},
	onShow: function () {

	}
}
</script>

<style lang="scss" scoped>
.container {
	background: #F1F1F1;
	box-sizing: border-box;
	padding: 24rpx;
	min-height: 100vh;

	.help {
		.item {
			background: #FFF;
			border-radius: 8rpx;
			margin: 0 0 24rpx;
			padding: 24rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;

			&:last-of-type {
				margin: 0;
			}

			.title {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 160rpx;
				height: 240rpx;
				position: relative;

				&::after {
					position: absolute;
					content: '';
					background: #F1F1F1;
					width: 3rpx;
					right: 0;
					top: 0;
					bottom: 0;
				}

				.ico {
					width: 60rpx;
					height: 60rpx;
				}

				.txt {
					font-size: 28rpx;
					font-weight: 600;
					line-height: 60rpx;
					color: #333;
				}
			}

			.types {
				flex: 1;
				padding: 0 20rpx;

				.name {
					font-size: 28rpx;
					color: #666;
					line-height: 48rpx;
				}
			}
		}
	}
}
</style>
