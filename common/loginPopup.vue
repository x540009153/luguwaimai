<template>
	<view>
		<view class="warp" v-if="show">
			<view class="warp-view">
				<view class="warp-text">请登录后再操作</view>
				<view class="warp-flex">
					<button @click="messcancel()" plain="true">取消</button>
					<button plain="true" open-type="getUserInfo" @getuserinfo="getUserInfo">登录</button>
				</view>
			</view>
		</view>
		<!-- 提示 -->
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages" @clickMessage="clickMessage"></HMmessages>
	</view>
</template>

<script>
	import {
		publicing
	} from '../api/api.js'
	import {
		wxloginurl
	} from '../api/request.js'
	//引入顶部信息提示组件(插件)
	import HMmessages from "@/components/HM-messages/HM-messages.vue"
	export default{
		components: {HMmessages},
		data() {
			return {
				show: false
			}
		},
		methods:{
			//显示
			init(){
				this.show=true
			},
			//取消
			messcancel(){
				this.show=false
			},
			//获取头像昵称
			getUserInfo(e) {
				this.show=false
				if (e.detail.userInfo) {
					let wxing = e.detail.userInfo
					this.wxCode(wxing.nickName, wxing.avatarUrl)
				}
			},
			//获取code
			wxCode(nickName, avatarUrl) {
				wx.login({
					success: (res) => {
						console.info(res)
						let code = res.code
						this.wxLogin(nickName, avatarUrl, code)
					},
					fail: (err) => {
						console.info(err)
					}
				})
			},
			//请求登录接口
			wxLogin(nickName, avatarUrl, code) {
				let data = {
					appid: 'wx4ecdf773583f00c0',
					secret: '6ae5375d34e0265abbbede1598e5e29a',
					code,
					nickName,
					avatarUrl
				}
				publicing(wxloginurl, data).then((res) => {
					//存入本地
					if(res.data.msg == 'success'){
						uni.setStorageSync('user',res.data.datas)
						let text='登录成功'
						let ico = 'success'
						this.message(text,ico)
					}
				}).catch((err) => {
					let text='登录失败'
					let ico = 'error'
					this.message(text,ico)
					console.info(err)
				})
			},
			//提示
			message(text,ico){
				 this.HMmessages.show(text,{icon:ico,fontColor:"#ffffff",iconColor:"#ffffff",background:"rgba(202, 186, 5, 0.8)"});
			}
		}
	}
</script>

<style scoped>
	.warp {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9999;
	}

	.warp-view {
		width: 500upx;
		height: 200upx;
		background: #FFFFFF;
		margin: auto;
		position: absolute;
		-webkit-position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 8upx;
		overflow: hidden;
	}

	.warp-text {
		text-align: center;
		margin-top: 30upx;
		font-size: 34upx;
		color: #666666;
	}

	.warp-flex {
		display: flex;
		justify-content: space-around;
		border-top: 1upx solid #EEEEEE;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80upx;
		line-height: 80upx;
	}

	.warp-flex button {
		border: none;
		font-size: 30upx;
	}
</style>
