<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-09 15:37:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-09 16:56:08
-->
<template>
  <div>
    <el-table :data="cookieData" height="55vh">
      <el-table-column prop="domain" label="domain" align="center" />
      <el-table-column prop="name" label="名称" align="center" />
      <el-table-column label="value" align="center" width="220px">
        <template slot-scope="scope">
          <div
            style="
              width: 200px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ scope.row.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" align="center" />
      <el-table-column label="httpOnly" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.httpOnly" style="cursor: pointer">✔️</span>
          <span v-else>❌</span>
        </template>
      </el-table-column>
      <el-table-column label="persistent" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.persistent" style="cursor: pointer">✔️</span>
          <span v-else>❌</span>
        </template>
      </el-table-column>
      <el-table-column label="secure" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.secure" style="cursor: pointer">✔️</span>
          <span v-else>❌</span>
        </template>
      </el-table-column>
      <el-table-column label="HasExpire" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.HasExpire" style="cursor: pointer">✔️</span>
          <span v-else>❌</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "PASSWORD",
  props: {
    cookieData: {
      default: [],
    },
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