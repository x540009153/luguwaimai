<template>
	<view class="content">
		<Search></Search>
		<Preference :preferdata="preferdata"></Preference>
		<Title></Title>
		<view @click="poll" :catchtouchmove="true">
			<Delicacy id="boxFixed" :class="{is_fixed:isfixed}"></Delicacy>
		</view>
		<view style="height: 50upx;"></view>
		<Takeout :takeshop="takeshop"></Takeout>
		<!-- loading -->
		<loading v-if="efinition"></loading>
	</view>
</template>

<script>
	// 引入子组件
	import Search from './components/search.vue'
	import Preference from './components/preference.vue'
	import Title from './components/title.vue'
	import Delicacy from './components/delicacy.vue'
	import Takeout from './components/takeout.vue'
	import {
		mapState
	} from 'vuex'

	//引入接口
	import {
		listing
	} from '../../api/api.js'
	//引入请求地址
	import {
		getpreferurl,
		wxshopurl
	} from '../../api/request.js'


	export default {
		components: {
			Search,
			Preference,
			Title,
			Delicacy,
			Takeout
		},
		data() {
			return {
				//为你优选
				preferdata: [],
				//附近商家
				takeshop: [],
				menutop: '',
				rect: '',
				isfixed: false,
				efinition: true
			}
		},
		methods: {
			//为你优选
			preference() {
				Promise.all([listing(getpreferurl), listing(wxshopurl)]).then((res) => {
					this.efinition = false
					this.preferdata = res[0].data
					this.takeshop = res[1].data
				}).catch((err) => {
					console.info(err)
				})
			},

			//回到顶部
			poll() {
				wx.pageScrollTo({
					scrollTop: this.menutop + 5,
					duration: 300
				})
			}
		},
		onLoad() {
			//监听筛选组件距离顶部的距离
			const query = wx.createSelectorQuery()
			query.select('#boxFixed').boundingClientRect()
			query.exec((res) => {
				this.menutop = res[0].top
			})
		},
		// 监听页面滚动距离
		onPageScroll(e) {
			this.rect = e.scrollTop
		},
		mounted() {
			this.preference()
		},

		//计算属性
		computed: {
			...mapState(['screendata']),
			//监听筛选组件置顶和不置顶
			namepage() {
				//如果页面滚动的高度大于筛选组件距离顶部的距离则置顶，反之不置顶
				if (this.rect > this.menutop) {
					this.isfixed = true
				} else {
					this.isfixed = false
				}
			},
			count() {
				this.takeshop = this.screendata.screenarr
			}
		}
	}
</script>

<style scoped>
	.content {
		margin: 0 15upx;
	}

	.is_fixed {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
	}
</style>
