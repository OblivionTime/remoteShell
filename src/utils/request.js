/*
 * @Description:
 * @Version: 2.0
 * @Autor: solid
 * @Date: 2021-12-23 22:30:23 +0800
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 10:24:19
 */
import axios from 'axios'
import {ipaddr} from './remoteWebsocketConfig';
var baseURL = `http://${ipaddr}`
const service = axios.create({
	baseURL: baseURL,
	timeout: 50000
})
service.interceptors.request.use(
	(config) => {

		// config.url
		return config
	},
	(error) => {
		// do something with request error
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	/**
	 * If you want to get http information such as headers or status
	 * Please return  response => response
	 */

	/**
	 * Determine the request status by custom code
	 * Here is just an example
	 * You can also judge the status by HTTP Status Code
	 */
	response => {
		return response.data
	},
	error => {
		console.log(error);
	}
)

export default service
