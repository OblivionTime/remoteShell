<template>
  <div>
    <el-card class="box-card" style="height: 80vh;overflow:auto">
      <div slot="header" class="clearfix">
        <span>目标机器在线列表</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="loadData(), $message.success('刷新成功')"
          >刷新数据</el-button
        >
      </div>
      <div v-if="tableData.length == 0">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60vh;
            flex-direction: column;
          "
        >
          <img
            src="http://cdn.uviewui.com/uview/empty/data.png"
            style="width: 200px; object-fit: contain"
          />
          <div>暂无目标机器在线</div>
        </div>
      </div>
      <div v-for="item in tableData" :key="item.room" class="text item">
        <el-card shadow="hover" style="margin-top: 10px; cursor: pointer">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
            @click="rowClick(item)"
          >
            <div style="display: flex; align-items: center">
              <img
                :src="IconList[item.os]"
                alt=""
                srcset=""
                style="width: 2em; object-fit: contain; margin-right: 10px"
              />
              {{ item.room }}
            </div>
            <div>
              <el-input
                v-model="item.note"
                auto-complete="off"
                style="width: 400px"
                :placeholder="item.note"
                @click.stop.native=""
              >
                <el-button
                  slot="append"
                  icon="el-icon-edit"
                  @click="submitForm(item)"
                ></el-button>
              </el-input>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { RoomList, updateNote } from "@/api/info";
export default {
  name: "Index",
  data() {
    return {
      showUpdateFormVisible: false,
      title: "",
      note: "",
      //列表数据
      tableData: [],
      ipaddr: "",
      path: "",
      IconList: {
        win32: require("@/assets/windows.png"),
        darwin: require("@/assets/mac.png"),
        linux: require("@/assets/linux.png"),
      },
    };
  },
  created() {
    this.path = this.$route.query.path ? this.$route.query.path : "shell";
    this.ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
    this.loadData();
  },

  methods: {
    // 切换页
    handleCurrentChange(currentPage) {
      this.page = currentPage;
      this.loadData();
    },
    loadData() {
      RoomList({
        page: this.page,
        limit: 10,
      })
        .then((res) => {
          var tableData = [];
          tableData = res.data;
          this.tableData = tableData.filter((value) => {
            return value.state;
          });
        })
        .catch((error) => {
          this.tableData = [];
          this.$message.error(error);
        });
    },
    submitForm(row) {
      if (row.note == "") {
        return this.$message.warning("备注不能为空!!!");
      }
      //编辑
      updateNote({ room: row.room, note: row.note }).then((res) => {
        if (res.code == 0) {
          this.$message.success("修改成功!!!");
          this.loadData();
          this.showUpdateFormVisible = false;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    rowClick(row) {
      if (this.path == "screen" && row.os == "linux") {
        return this.$message.warning("目前不支持linux");
      }
      this.$router.push({
        path: this.path,
        query: { roomID: row.room, username: row.room },
      });
    },
    /**
     * 弹窗相关操作
     */
    resetPublisherForm() {
      this.fordata = {
        id: "",
        room: "",
        note: "",
      };
    },
    openUpdatePublisherDialog(row) {
      this.fordata = row;
      this.showUpdateFormVisible = true;
      this.title = "编辑房间";
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
::v-deep .el-range-separator {
  padding: 0px;
}
::v-deep .el-input__inner {
  border-radius: 0px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
::v-deep .el-form-item__label {
  font-size: 18px;
}
.dialog-footer {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
</style>
