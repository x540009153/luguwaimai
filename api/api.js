//封装请求  get  post

import {
	errdata
} from 'api/err.js'

let listing = function(urling) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: urling,
			method: 'GET',
		}).then((res) => {
			resolve(res[1])
		}).catch((err) => {
			let errs = '服务器错误，请稍后重试'
			errdata.errlist(errs)
			reject(err)
		})
	})
}

let publicing = function(urling, shopdata) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: urling,
			method: 'POST',
			data: shopdata
		}).then((res) => {
			resolve(res[1])
		}).catch((err) => {
			let errs = '服务器错误，请稍后重试'
			errdata.errlist(errs)
			reject(err)
		})
	})
}

export {
	listing,
	publicing
}
