<template>
	<view class="container">
		<view class="search-bar">
			<view class="custom-search">
				<view class="search-input-container">
					<view class="search-icon">
						<u-icon name="search" size="32" color="#999"></u-icon>
					</view>
					<input
						class="search-input"
						:placeholder="defaultKeyword"
						v-model="strKeyword"
						:focus="autoFocus"
						@confirm="handlerSearch(strKeyword)"
						confirm-type="search"
					/>
					<view class="search-btn" @tap="handlerSearch(strKeyword)">
						<text class="btn-text">搜索</text>
					</view>
				</view>
			</view>
		</view>
		<view class="wrapper" v-if="arrHistory.length > 0">
			<view class="name">
				<view class="text">历史搜索</view>
				<image class="icon" :src="iconClear" @tap="oldDelete" mode="aspectFit"></image>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in arrHistory" :key="index">
					<view class="text" @tap="handlerSearch(item)">{{item}}</view>
					<image class="icon" :src="iconDelete" @tap="oldDeleteOne(index)" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="name">
				<view class="text">热门搜索</view>
			</view>
			<view class="sort">
				<view class="item" v-for="(item, index) in arrHotKey" @tap="handlerSearch(item)" :key="index">
					<view class="num">{{index + 1}}</view>
					<view class="tit">{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import storage from '@/utils/storage';
import {getHotKeywords} from "../../api/home";

	export default{
		name: '',
		components: {

		},
		data(){
			return {
				isComplete: false,
				iconClear: `${this.iconCommon}/static/v1/search/icon-clear.png`,
				iconDelete: `${this.iconCommon}/static/v1/search/icon-delete.png`,
				strKeyword: '',
				arrHistory: [],
        oldKeywordIndex: [],
				arrHotKey: [],
        defaultKeyword:'',
        keyword:'',
        regionFlag: false,
        autoFocus: true, // 控制搜索框自动聚焦
			}
		},
		methods: {
			// 处理搜索
			handlerSearch: function(keyword){
        this.strKeyword=keyword;
        //  用户自行搜索/热门搜索/搜索历史
        keyword = keyword === false ? this.keyword : keyword;

        if (!keyword) {
          /**
           * 进行空搜索
           * 第一次搜索如果没有关键词会将热门搜索中第一个热词进行判定
           * 如果没有热词则会展示一个空词搜索
           */
          keyword = (this.arrHotKey.length && this.arrHotKey[0]) || '';
        }
        this.defaultKeyword == '请输入搜索内容' ? (keyword = '') : '';


        keyword ? (this.keyword = keyword) : '';
        this.saveKeyword(keyword); //保存为历史
        uni.navigateTo({
          url:'/pages/navigation/search/searchPage?keyword='+ this.strKeyword + '&regionFlag=' + this.regionFlag
        });
			},
      //保存关键字到历史记录
      saveKeyword(keyword) {
        if (!keyword) return false;
        uni.getStorage({
          key: 'OldKeys',
          success: res => {
            var OldKeys = JSON.parse(res.data);
            var findIndex = OldKeys.indexOf(keyword);
            if (findIndex == -1) {
              OldKeys.unshift(keyword);
            } else {
              OldKeys.splice(findIndex, 1);
              OldKeys.unshift(keyword);
            }
            //最多10个纪录
            OldKeys.length > 10 && OldKeys.pop();

            uni.setStorage({
              key: 'OldKeys',
              data: JSON.stringify(OldKeys)
            });
            this.arrHistory = OldKeys; //更新历史搜索
          },
          fail: e => {
            var OldKeys = [keyword];
            uni.setStorage({
              key: 'OldKeys',
              data: JSON.stringify(OldKeys)
            });
            this.arrHistory = OldKeys; //更新历史搜索
          }
        });
      },
      //顶置关键字
      setKeyword(index) {
        this.keyword = this.keywordList[index].keyword;
      },
      //清除历史搜索
      oldDelete() {
        uni.showModal({
          content: '确定清除历史搜索记录？',
          success: res => {
            if (res.confirm) {
              this.arrHistory = [];
              uni.removeStorage({
                key: 'OldKeys'
              });
            }
          }
        });
      },
      oldDeleteOne(index) {
        this.arrHistory.splice(index,1)
        uni.setStorage({
          key: 'OldKeys',
          data: JSON.stringify(this.arrHistory)
        });
      },
      //高亮关键字
      drawCorrelativeKeyword(keywords, keyword) {
        var len = keywords.length,
            keywordArr = [];
        for (var i = 0; i < len; i++) {
          var row = keywords[i];
          //定义高亮#9f9f9f
          var html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + '</span>');
          html = '<div>' + html + '</div>';
          var tmpObj = {
            keyword: row[0],
            htmlStr: html
          };
          keywordArr.push(tmpObj);
        }
        return keywordArr;
      },
      /**
       * 加载热门搜索
       * 1.5分钟之后更新缓存
       * 2.如果有缓存热门关键字则去请求缓存
       */
      async loadHotKeyword() {
        this.arrHotKey = [];
        if (!storage.getHotWords().time || storage.getHotWords().time <= new Date().getTime() / 1000) {
          // 没有缓存或者第一次进入请求接口保存缓存
          let res = await getHotKeywords(10);
          let keywords = res.data.result;

          keywords.forEach(item => {
            this.arrHotKey.push(item);
          });

          let hotData = {
            time: new Date().getTime() / 1000 + 30 * 5,
            keywords: keywords
          };
          storage.setHotWords(hotData);
        } else {
          let keywords = storage.getHotWords().keywords;

          keywords.forEach(item => {
            this.arrHotKey.push(item);
          });
        }
        this.loadDefaultKeyword();
      },
      //加载历史搜索,自动读取本地Storage
      loadOldKeyword(index) {
        this.arrHistory = [];
        uni.getStorage({
          key: 'OldKeys',
          success: res => {
            var OldKeys = JSON.parse(res.data);
            this.oldKeywordIndex = OldKeys.length;
            for (let i = 0; i < index; i++) {
              if (OldKeys[i]){
                this.arrHistory.push(OldKeys[i]);
              }
            }
          }
        });
      },
      //加载默认搜索关键字
      loadDefaultKeyword() {
        /**
         * 定义默认搜索关键字会根据当前热门搜索来进行显示
         * 如果当前热门搜索没有的话，则会显示默认关键字
         */
        if (this.arrHotKey.length != 0) {
          //
          this.defaultKeyword = this.arrHotKey[0];
        } else {
          this.defaultKeyword = '请输入搜索商品';
        }
      },
      init() {
        // 加载搜索记录
        this.loadOldKeyword(10);
        // 加载热词
        this.loadHotKeyword();
      },
		},
		onLoad: function(options){
      if(options.regionFlag){
        this.regionFlag = JSON.parse(options.regionFlag)
      }
		},
		onShow: function(){
      this.init();
      // 页面显示时自动聚焦搜索框
      this.$nextTick(() => {
        this.autoFocus = true;
      });
		}
	}
</script>

<style lang="scss" scoped>
.container{
	background: #F1F1F1;
	min-height: 100vh;

	.search-bar{
		background: #FFF;
		padding: 20rpx;

		.custom-search{
			.search-input-container{
				display: flex;
				align-items: center;
				background: #F5F5F5;
				border-radius: 12rpx;
				height: 64rpx; /* 35px */
				padding: 0 8rpx 0 12rpx;
				position: relative;

				.search-icon{
					display: flex;
					align-items: center;
					justify-content: center;
					width: 40rpx;
					height: 40rpx;
					margin-right: 12rpx;
				}

				.search-input{
					flex: 1;
					height: 100%;
					line-height: 64rpx;
					font-size: 28rpx;
					background: transparent;
					border: none;
					outline: none;
					padding: 0;
				}

				.search-btn{
					background: #e22221;
					border-radius: 10rpx;
					padding: 8rpx 20rpx;
					margin-left: 12rpx;
					min-width: 80rpx;
					text-align: center;
					height: 50rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.btn-text{
						color: #FFF;
						font-size: 24rpx;
						font-weight: 500;
					}
				}
			}
		}
	}

	.wrapper{
		background: #FFF;
		margin: 20rpx 20rpx 0;
		padding: 0 20rpx 20rpx;
		border-radius: 12rpx;
		.name{
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.text{
				color: #333;
				font-size: 28rpx;
				font-weight: 600;
			}
			.icon{
				width: 32rpx;
				height: 32rpx;
			}
		}
		.list{
			display: flex;
			flex-wrap: wrap;
			.item{
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(0, 0, 0, 0.06);
				height: 48rpx;
				line-height: 48rpx;
				margin: 16rpx 16rpx 0 0;
				padding: 0 16rpx;
				border-radius: 48rpx;
				.icon{
					width: 16rpx;
					height: 16rpx;
					margin: 0 0 0 12rpx;
				}
				.text{
					font-size: 24rpx;
				}
			}
		}
		.sort{
			.item{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				padding: 8rpx 0;
				.num{
					width: 36rpx;
					height: 36rpx;
					line-height: 36rpx;
					font-size: 24rpx;
					text-align: center;
					background: rgba(0, 0, 0, 0.06);

				}
				.tit{
					width: calc(100vw - 40rpx - 40rpx - 48rpx);
					height: 48rpx;
					box-sizing: border-box;
					padding: 0 0 0 16rpx;
					line-height: 48rpx;
					font-size: 26rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
}
</style>
