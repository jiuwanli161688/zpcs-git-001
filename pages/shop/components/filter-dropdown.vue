<template>
	<view class="dropdown-wrapper" v-if="visible">
		<!-- 双列布局 (分类/附近) -->
		<view class="dropdown-content double-col" v-if="type === 'category' || type === 'nearby'">
			<scroll-view scroll-y class="left-col">
				<view 
					class="menu-item" 
					v-for="(item, index) in leftList" 
					:key="index"
					:class="{ active: leftIndex === index }"
					@click="handleLeftClick(index)"
				>
					{{ item.name }}
				</view>
			</scroll-view>
			<scroll-view scroll-y class="right-col">
				<view 
					class="sub-menu-item" 
					v-for="(sub, sIndex) in rightList" 
					:key="sIndex"
					:class="{ active: isSelected(sub) }"
					@click="handleRightClick(sub)"
				>
					<text>{{ sub.name }}</text>
					<uni-icons v-if="isSelected(sub)" type="checkbox-filled" size="20" color="#FFC300"></uni-icons>
				</view>
			</scroll-view>
		</view>
		
		<!-- 单列布局 (排序) -->
		<view class="dropdown-content single-col" v-if="type === 'sort'">
			<scroll-view scroll-y class="single-list">
				<view 
					class="sub-menu-item" 
					v-for="(item, index) in options" 
					:key="index"
					:class="{ active: selectedValue === item.value }"
					@click="handleSortClick(item)"
				>
					<text>{{ item.name }}</text>
					<uni-icons v-if="selectedValue === item.value" type="checkbox-filled" size="20" color="#FFC300"></uni-icons>
				</view>
			</scroll-view>
		</view>
		
		<!-- 遮罩层 -->
		<view class="mask" @click="handleClose" @touchmove.stop.prevent></view>
	</view>
</template>

<script>
export default {
	name: 'FilterDropdown',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: '' // 'category', 'nearby', 'sort'
		},
		data: {
			type: Array,
			default: () => []
		},
		leftIndex: {
			type: Number,
			default: 0
		},
		selectedValue: {
			type: [String, Number, Object],
			default: null
		}
	},
	computed: {
		leftList() {
			return this.data;
		},
		rightList() {
			if (this.data.length > 0 && this.data[this.leftIndex]) {
				return this.data[this.leftIndex].children || [];
			}
			return [];
		},
		options() {
			return this.data;
		}
	},
	methods: {
		handleLeftClick(index) {
			this.$emit('left-click', index);
		},
		handleRightClick(item) {
			this.$emit('select', item);
		},
		handleSortClick(item) {
			this.$emit('select', item);
		},
		isSelected(item) {
			if (this.type === 'category') {
				return this.selectedValue && this.selectedValue.id === item.id;
			} else if (this.type === 'nearby') {
				return this.selectedValue && this.selectedValue.value === item.value;
			}
			return false;
		},
		handleClose() {
			this.$emit('close');
		}
	}
}
</script>

<style lang="scss" scoped>
.dropdown-wrapper {
	position: relative;
	z-index: 11;
}

.dropdown-content {
	position: relative;
	z-index: 1001;
	background: #fff;
	border-bottom-right-radius: 40rpx;
	border-bottom-left-radius: 40rpx;
	overflow: hidden;
	
	&.double-col {
		display: flex;
		max-height: 600rpx;
		
		.left-col {
			width: 220rpx;
			background: #F5F5F5;
			
			.menu-item {
				padding: 30rpx 20rpx;
				font-size: 28rpx;
				color: #666;
				text-align: center;
				
				&.active {
					background: #fff;
					color: #333;
					font-weight: bold;
					position: relative;
					
					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						width: 6rpx;
						height: 40rpx;
						background: #FFC300;
						border-radius: 0 3rpx 3rpx 0;
					}
				}
			}
		}
		
		.right-col {
			flex: 1;
			background: #fff;
			
			.sub-menu-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				font-size: 28rpx;
				color: #666;
				border-bottom: 1rpx solid #f0f0f0;
				
				&.active {
					color: #FFC300;
					font-weight: bold;
				}
			}
		}
	}
	
	&.single-col {
		.single-list {
			max-height: 500rpx;
			background: #fff;
			
			.sub-menu-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30rpx 40rpx;
				font-size: 28rpx;
				color: #666;
				
				&.active {
					color: #FFC300;
					font-weight: bold;
				}
			}
		}
	}
}

.mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 10;
}
</style>
