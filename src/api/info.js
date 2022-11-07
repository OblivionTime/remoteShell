/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-10 11:06:59
 * @LastEditors: solid
 * @LastEditTime: 2022-11-01 15:42:25
 */
import request from '@/utils/request'
//获取房间号
export function RoomList(params) {
    return request({
        url: '/list',
        method: 'get',
        params,
    })
}
//修改备注
export function updateNote(data) {
    return request({
        url: '/updateNote',
        method: 'post',
        data,
    })
}