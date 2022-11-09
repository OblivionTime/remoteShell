/*
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-01 10:02:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 14:11:28
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index/Index.vue'
import SHELL from '../views/shell/index.vue'
import Screen from '../views/screen/index.vue'
import FileManage from '../views/filemanage/index.vue'
import Browser from '../views/browser/index.vue' 

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/shell',
    name: 'SHELL',
    component: SHELL
  },
  {
    path: '/screen',
    name: 'screen',
    component: Screen
  },
  {
    path: '/file',
    name: 'file',
    component: FileManage
  },
  {
    path: '/browser',
    name: 'browser',
    component: Browser
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
export default router
