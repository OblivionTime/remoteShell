<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-09 15:37:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 16:20:27
-->
<template>
  <div>
    <div v-for="(item, index) in passwordData" :key="index">
      <el-card  style="cursor: pointer; margin: 5px 0" v-if="item.username">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
          @click="openDefaultBrowser(item.url)"
        >
          <div style="display: flex; align-items: center">
            <img
              :src="item.ico?item.ico:chrome"
              alt=""
              srcset=""
              style="width: 2em; object-fit: contain; margin-right: 10px"
              :onerror="chrome"
            />
            <div>
              <div>用户名: {{ item.username }}</div>
              <div>密码:{{ item.password }}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;">
            <div style="margin-right:20px">
                 {{ item.url }}
            </div>
            <img
              :src="chrome"
              alt=""
              srcset=""
              style="width: 2em; object-fit: contain; margin-right: 10px"
              :onerror="chrome"
            />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "PASSWORD",
  props: {
    passwordData: {
      default: [],
    },
  },
  created() {
    console.log(this.passwordData)
  },
  data() {
    return {
      chrome: 'this.src="' + require("@/assets/chrome.png") + '"',
    };
  },
  methods: {
    openDefaultBrowser(url) {
      var exec = window.require("child_process").exec;
      exec("start " + url);
    },
    //设置默认图片
    setDefaultImage(e) {
      e.target.currentSrc = this.chrome;
    },
  },
};
</script>

<style>
</style>