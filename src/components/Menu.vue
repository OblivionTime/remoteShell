<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-25 18:43:28
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 14:14:00
-->
<template>
  <div class="menu">
    <div
      v-for="item in featureList"
      :key="item.key"
      :class="outputFileType == item.key ? 'menu-item active' : 'menu-item'"
      @click="ChangeMethod(item.key)"
    >
      <img
        :src="item.icon"
        alt=""
        srcset=""
        style="width: 2em; object-fit: contain"
      />
      {{ item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      outputFileType: "shell",
      featureList: [
        {
          name: "命令行",
          icon: require("@/assets/SHELL.png"),
          key: "shell",
        },
        {
          name: "实时监控",
          icon: require("@/assets/screen.png"),
          key: "screen",
        },
        {
          name: "文件管理",
          icon: require("@/assets/fileManage.png"),
          key: "file",
        },
        {
          name: "浏览器",
          icon: require("@/assets/browser.png"),
          key: "browser",
        },
      ],
    };
  },
  created() {
    if (this.$route.query.outputFileType) {
      this.outputFileType = this.$route.query.outputFileType;
    }
  },
  methods: {
    ChangeMethod(outputFileType) {
      if (outputFileType == this.outputFileType) {
        return;
      }
      this.outputFileType = outputFileType;
      this.$router.push({
        path: "/",
        query: { path: outputFileType },
      });
    },
  },
};
</script>

<style>
.menu {
  flex-basis: 280px;
  display: flex;
  flex-direction: column;
}
.menu .menu-item {
  padding: 20px;
  font-size: 16px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}
.active {
  background: #eee;
}
</style>