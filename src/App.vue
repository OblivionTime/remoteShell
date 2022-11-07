<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-11-01 10:02:32
 * @LastEditors: solid
 * @LastEditTime: 2022-11-04 18:52:02
-->
<template>
  <div id="app">
    <div>
      <div style="width: 100%; margin-top: 20px">
        <div
          style="
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          "
        >
          <div>
            <div style="display: flex; align-items: center">
              <div style="width: 16rem">当前服务器地址:</div>
              <el-input
                v-model="ipaddr"
                placeholder="请输入服务器地址"
              ></el-input>
              <div style="margin-left: 10px">
                <el-button type="primary" @click="updateServerIp"
                  >修改服务器地址</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-card class="box-card" style="width: 100%; margin-top: 20px">
        <div style="display: flex; width: 100%; min-height: 80vh">
          <Menu @ChangeMethod="ChangeMethod"></Menu>
          <div class="main" ref="main">
            <router-view :key="$route.fullPath" />
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import Menu from "@/components/Menu";
export default {
  components: {
    Menu,
  },
  created() {
    this.ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
  },
  data() {
    return {
      ipaddr: "",
    };
  },
  methods: {
    ChangeMethod(outputFileType) {
      // this.$nextTick(() => {
      //   if (t == "PDFOther") {
      //     this.$refs.PDFOther.ChangeMethod(outputFileType);
      //   }
      // });
    },
    updateServerIp() {
      if (!this.ipaddr) {
        this.$message.warning("服务器地址不能为空");
        return;
      }
      localStorage.setItem("ipaddr", this.ipaddr);
      this.$message.success("修改成功,即将刷新页面");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
  },
};
</script>
<style scoped>
.main {
  flex: auto;
}
</style>