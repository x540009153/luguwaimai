<template>
	<view v-if="shopcont">
		<block v-for="(item,index) in takeshop" :key="index">
			<view class="content-view" @click="takEout(item.openid)">
				<view class="content-img">
					<image :src="item.logo" mode="aspectFill"></image>
				</view>
				<view class="content-title">
					<text class="content-take">{{item.shop}}</text>
					<view class="content-monthly">
						<text>月售200</text>
						<text>约{{item.duration}}分钟</text>
					</view>
					<view class="content-start">
						<text>起送￥{{item.delivering}}</text>
						<text>配送￥{{item.physical}}</text>
						<text>人均￥{{item.capita}}</text>
					</view>
					<view class="content-start">
						<image src="../../../static/coen/liwu.svg" mode="widthFix"></image>
						<text>{{item.types}}</text>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import bus from '../../../js/eventBus.js'
	export default {
		props: {
			takeshop: Array
		},
		data() {
			return {
				shopcont: true
			}
		},
		methods: {
			takEout(id) {
				wx.navigateTo({
					url: '../takeout/index?id=' + id
				})
			}
		},
		mounted() {
			bus.$on('sendBus', data => {
				this.shopcont = data
			})
		}
	}
</script>

<style scoped>
	@import '../../../common/merchant.css'
</style>
