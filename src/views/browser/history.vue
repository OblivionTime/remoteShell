<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-09 15:37:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 15:40:02
-->
<template>
  <div>
    <div v-for="(item, index) in tableData" :key="index">
      <el-card v-if="item.title" style="cursor: pointer; margin: 5px 0">
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
              :src="item.ico"
              alt=""
              srcset=""
              style="width: 2em; object-fit: contain; margin-right: 10px"
              :onerror="chrome"
            />
            <div
              style="
                width: 60vw;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ item.title }}
            </div>
          </div>
          <div>
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
  name: "history",
  props: {
    tableData: {
      default: [],
    },
  },
  data() {
    return {
        chrome: 'this.src="' + require("@/assets/chrome.png") + '"',
    }
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