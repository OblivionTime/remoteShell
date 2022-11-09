<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-09 15:37:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 17:35:31
-->
<template>
  <div>
    <el-tree
      :data="bookmarksData"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick"
    >
      <el-card
        slot-scope="{ node, data }"
        style="cursor: pointer; margin: 10px 0; width: 100%"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="display: flex; align-items: center">
            <img
              :src="data.type == 'folder' ? folderIcon : data.ico"
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
              {{ node.label }}
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
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "bookmarks",
  props: {
    bookmarksData: {
      default: [],
    },
  },
  created() {
    console.log(this.bookmarksData)
  },
  data() {
    return {
      chrome: 'this.src="' + require("@/assets/chrome.png") + '"',
      folderIcon: require("@/assets/floderblue.png"),
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    handleNodeClick(node) {
      if (node.type == "folder") {
        return;
      }
      this.openDefaultBrowser(node.url);
    },
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