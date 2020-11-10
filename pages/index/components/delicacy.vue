<template>
	<view>
		<view class="prefer-posi">
			<!-- 筛选区 -->
			<view class="delica-view">
				<view class="delica-list delica-grow" @click="multiple">
					<text>{{synthesize}}</text>
					<image src="../../../static/coen/paixu.png" mode="widthFix"></image>
				</view>
				<view class="delica-grow" @click="saLes">销量高</view>
				<view class="delica-grow" @click="saLes">速度快</view>
				<view class="delica-grow" @click="saLes">津贴联盟</view>
				<view class="delica-list delica-right" @click="screen">
					<text>筛选</text>
					<image src="../../../static/coen/shaixuan.png" mode="widthFix"></image>
				</view>
			</view>

			<!-- 综合排序筛选 -->
			<view class="sortlist sortliteltle" v-if="drop">
				<block v-for="(item,index) in sortlist" :key="index">
					<text @click="sortClick(index,item.name,item.screen,item.nums)" :class="{active:index==num}">{{item.name}}</text>
				</block>
			</view>

			<!-- 多个筛选区 -->
			<view class="sortlist sortlist-view" v-if="sortmen">
				<!-- 多选 -->
				<block v-for="(item,index) in screendata" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{scractive:itemdata.id === 2 }" @click="screenchoIce(indexs,itemdata.sign)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 单选 -->
				<block v-for="(item,index) in person" :key="index">
					<view>
						<view class="sortlist-title">{{item.title}}</view>
						<view class="sortlist-flex">
							<block v-for="(itemdata,indexs) in item.datas" :key="indexs">
								<text class="Choice" :class="{scractive:scrnum===indexs}" @click="presonchoIce(indexs,itemdata.per)">{{itemdata.name}}</text>
							</block>
						</view>
					</view>
				</block>
				<!-- 置顶 -->
				<view class="sortlist-bottom">
					<text @click="emPty()">清空</text>
					<text @click="complete()">完成</text>
				</view>
			</view>
		</view>
		<!-- 背景透明 -->
		<view class="transparent" v-if="background" @click="hideBgTransparent()"></view>

		<!-- 反馈组件 -->
		<tips ref="tips"></tips>
	</view>
</template>

<script>
	import {
		publicing
	} from '../../../api/api.js'
	import {
		sorturl,
		multipleurl
	} from '../../../api/request.js'
	import tips from '../../../common/tips.vue'
	import bus from '../../../js/eventBus.js'
	export default {
		components: {
			tips
		},
		data() {
			return {
				num: 0,
				scrnum: -1,
				multobj: {},
				synthesize: "综合排序",
				// flag: false,
				// 排序
				drop: false,
				// 筛选
				sortmen: false,
				// 背景透明
				background: false,
				//是否展示内容区
				shopcont: true,
				sortlist: [{
						"name": "综合排序",
						"screen": "_id",
						"nums": 1
					},
					{
						"name": "起送价最低",
						"screen": "delivering",
						"nums": 1
					},
					{
						"name": "配送费最低",
						"screen": "physical",
						"nums": 1
					},
					{
						"name": "人均高到低",
						"screen": "capita",
						"nums": -1
					},
					{
						"name": "人均低到高",
						"screen": "capita",
						"nums": 1
					}
				],
				// 多选
				screendata: [{
					"title": "商家特色(可多选)",
					"datas": [{
							"id": 1,
							"sign": 'duration',
							"name": "配送最快"
						},
						{
							"id": 1,
							"sign": 'deliver',
							"name": "0元起送"
						},
						{
							"id": 1,
							"sign": 'physi',
							"name": "免配送费"
						}
					]
				}],
				//单选
				"person": [{
					"title": "人均价",
					"datas": [{
							"name": "20元以下",
							"per": {
								"$lt": 20
							}
						},
						{
							"name": "20-40元",
							"per": {
								"$lte": 40,
								"$gte": 20
							}
						},
						{
							"name": "40元以上",
							"per": {
								"$gt": 40
							}
						}
					]
				}]
			}
		},
		methods: {
			//综合排序
			multiple() {
				this.drop = true
				this.bgTransparent()
				this.sortmen = false
			},
			//综合排序替换
			sortClick(index, name, screen, nums) {
				this.synthesize = name
				this.num = index
				this.hideBgTransparent()
				this.sortTing(screen, nums)
			},

			//综合排序请求
			sortTing(screen, nums) {
				let data = {
					screen,
					nums
				}
				publicing(sorturl, data).then((res) => {
					// 存储到vuex数据仓库
					this.$store.commit('screenmuta', res.data)
				}).catch((err) => {
					console.info(err)
				})
			},

			//销量高、速度快、津贴联盟
			saLes() {
				this.hideBgTransparent()
			},

			//筛选
			screen() {
				this.sortmen = true
				this.bgTransparent()
				this.drop = false
			},
			//背景透明
			bgTransparent() {
				this.background = true
			},
			//隐藏背景透明
			hideBgTransparent() {
				this.background = false
				this.drop = false
				this.sortmen = false
			},

			//商家特色(多选)
			screenchoIce(indexs, sign) {
				if (this.screendata[0].datas[indexs].id == 1) {
					//选中
					this.screendata[0].datas[indexs].id = 2
					this.$set(this.multobj, sign, sign)
				} else {
					//未选中
					this.screendata[0].datas[indexs].id = 1
					this.$delete(this.multobj, sign)
				}
			},
			//人均价(单选)
			presonchoIce(indexs, name) {
				if (this.scrnum == indexs) {
					//未选中
					this.scrnum = -1
					this.$delete(this.multobj, 'capita')
				} else {
					//选中
					this.scrnum = indexs
					this.$set(this.multobj, 'capita', name)
				}
			},
			//清空
			emPty() {
				//商家特色(多选)
				this.screendata.forEach((item) => {
					let arr = item.datas.map((items) => {
						items.id = 1
					})
				})
				this.multobj = {}
				//人均价(单选)
				this.scrnum = -1
				this.hideBgTransparent()
			},
			//完成
			complete() {
				publicing(multipleurl, this.multobj).then((res) => {
					if (res.data == "没有商品数据") {
						let bull = true
						let tips = '没有你要找的数据'
						this.tising(bull, tips)
						this.shopcont = false
					} else {
						let bull = false
						let tips = ''
						this.tising(bull, tips)
						// 存储到vuex数据仓库
						this.$store.commit('screenmuta', res.data)
						this.shopcont = true
					}
					bus.$emit('sendBus', this.shopcont)
				}).catch((err) => {
					console.info(err)
				})
				this.hideBgTransparent()
			},

			//反馈提示
			tising(bull, tips) {
				this.$nextTick(() => {
					this.$refs.tips.init(bull, tips)
				})
			}
		},

		//如果用户没有点击任何筛选条件，禁用完成按钮
		/* computed: {
			emptyIng() {
				let obj = JSON.stringify(this.multobj) == '{}'
				if (obj == true) {
					this.flag = false
				} else {
					this.flag = true
				}
			}
		} */
	}
</script>

<style scoped>
	/* 筛选区 */
	.delica-view image {
		width: 30upx;
		height: 30upx;
		display: block;
	}

	.delica-view {
		font-size: 30upx;
		display: flex;
		align-items: center;
		color: #666666;
		height: 70upx;
		padding: 0 15upx;
		background: #FFFFFF;
	}

	.delica-list {
		display: flex;
		align-items: center;
	}

	.delica-right {
		justify-content: flex-end;
		flex-grow: 5;
	}

	.delica-grow {
		flex-grow: 1;
	}

	.prefer-posi {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 99;
	}

	/* 排序 */
	.sortlist {
		background: #ffffff;
	}

	.sortliteltle text {
		padding: 0 15upx;
		display: block;
		font-size: 30upx;
		height: 70upx;
		line-height: 70upx;
		border-top: 1rpx solid #ededed;
	}

	.active {
		color: #f89903 !important;
	}

	/* 筛选 */
	/* 相对定位 */
	.sortlist-view {
		height: 700upx;
		overflow: hidden;
		overflow-y: scroll;
		position: relative;
	}

	.sortlist-title {
		padding: 0 15upx;
		font-size: 30upx;
		height: 60upx;
		line-height: 60upx;
	}

	.Choice {
		font-size: 28upx;
		background: #f8f8f8;
		height: 55upx;
		line-height: 55upx;
		color: #666666;
		width: calc((100% / 3) - 15px) !important;
		margin: 7.5px;
		text-align: center;
		display: block;
		border-radius: 5upx;
	}

	.sortlist-flex {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 30upx;
	}

	.sortlist-bottom {
		background: #ffffff;
		height: 80upx;
		border-top: 1upx solid #e4e4e4;
		display: flex;
		justify-content: space-around;
		align-items: center;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.sortlist-bottom text {
		flex-grow: 1;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
	}

	.sortlist-bottom text:nth-child(1) {
		border: 1upx solid #e4e4e4;
	}

	.sortlist-bottom text:nth-child(2) {
		background: #ffd348;
	}

	/* 背景透明 */
	.transparent {
		background: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.scractive {
		background: #fef6df !important;
		color: #f29909 !important;
	}
</style>
