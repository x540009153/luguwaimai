<template>
	<view>
		<!-- 商家介绍 -->
		<Business :busidata="busidata"></Business>
		<!-- tab切换 -->
		<Tabs></Tabs>
		<view class="ordering-sceate">
			<!-- 商品下单 -->
			<Ordering :orderingdata="orderingdata" :busidata="busidata" :class="[hiding === 0 ? 'activeclass' : 'errorclass']"></Ordering>
			<!-- 评价 -->
			<Message :messagedata="messagedata" :tabmessage="tabmessage" :empty="empty" :class="[hiding === 1 ? 'activeclass' : 'errorclass']"></Message>
			<!-- 商家详情 -->
			<Introduce :busidata="busidata" :class="[hiding === 2 ? 'activeclass' : 'errorclass']"></Introduce>
		</view>
		<!-- loading -->
		<loading v-if="efinition"></loading>
	</view>
</template>

<script>
	import Business from './compoents/business.vue'
	import Introduce from './compoents/introduce.vue'
	import Message from './compoents/message.vue'
	import Ordering from './compoents/ordering.vue'
	import Tabs from './compoents/tabs.vue'
	import {
		publicing
	} from '../../api/api.js'
	import {
		shopurl,
		getdishesurl,
		discussurl
	} from '../../api/request.js'

	export default {
		components: {
			Business,
			Introduce,
			Message,
			Ordering,
			Tabs
		},
		data() {
			return {
				hiding: 0,
				//商家介绍
				busidata: {},
				//菜品商品
				orderingdata: [],
				//评论
				messagedata: [],
				//评论分类的标签
				tabmessage: [],
				//空评论
				empty: '',
				//商家标识
				id: '',
				efinition: true
			}
		},
		methods: {
			fatherMethod(index) {
				this.hiding = index
			},
			//请求接口
			takeFun(id) {
				let data = {
					openid: id
				}
				let disdata = {
					merchantid: id
				}
				Promise.all([publicing(shopurl, data), publicing(getdishesurl, data), publicing(discussurl, disdata)])
					.then((res) => {
						this.efinition = false
						//商家介绍
						this.busidata = res[0].data[0]
						//菜品商品
						this.orderingdata = res[1].data
						//评论
						this.messagedata = res[2].data
						if (res[2].data.length === 0) {
							this.empty = 'EMPTY'
						} else {
							//评论分类标签去重和去空标签
							//取出评论分类标签放进一个数组里
							let messageword = res[2].data.map((item) => {
								return item.classmessage
							})
							//标签去重
							let newarr = Array.from(new Set(messageword))
							//标签去空
							let newArr = newarr.filter(item => item)
							this.tabmessage = ["全部", ...newArr]
						}
					}).catch((err) => {
						console.info(err)
					})
			},

			//被评论子组件调用的函数
			messageMethod(item) {
				if (item == '全部') {
					let data = {
						merchantid: this.id
					}
					this.classifMess(data)
				} else {
					let data = {
						merchantid: this.id,
						classmessage: item
					}
					this.classifMess(data)
				}
			},

			//请求评论接口
			classifMess(data) {
				publicing(discussurl, data).then((res) => {
					this.messagedata = res.data
				}).catch((err) => {
					console.info(err)
				})
			}
		},
		onLoad(e) {
			this.takeFun(e.id)
			this.id = e.id
		}
	}
</script>

<style scoped>
	.activeclass {
		display: block;
		overflow-y: auto;
		height: 100%;
	}

	.errorclass {
		display: none;
	}

	.ordering-sceate {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 230upx;
	}
</style>
