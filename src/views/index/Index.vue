<template>
  <div>
    <div style="padding: 20px 40px">
      <div style="width: 100%; margin-top: 25px">
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
          <div></div>
          <div
            style="display: flex; width: 15%; justify-content: space-between"
          >
            <el-button @click="loadData">刷新页面</el-button>
          </div>
        </div>
      </div>
      <div style="margin-top: 3%; width: 100%">
        <el-table
          :data="tableData"
          :default-sort="{ prop: 'id', order: 'descending' }"
          style="width: 100%"
          v-loading="isLoading"
          border
          height="710px"
        >
          <el-table-column property="room" label="房间号" align="center" />
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-model="scope.row.note"
                  auto-complete="off"
                  style="width: 400px"
                  :placeholder="scope.row.note"
                >
                  <el-button
                    slot="append"
                    icon="el-icon-edit"
                    @click="submitForm(scope.row)"
                  ></el-button>
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="100px">
            <template slot-scope="scope">
              <div
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <span
                  v-if="scope.row.state"
                  style="
                    width: 10px;
                    height: 10px;
                    background: #82c91e;
                    border-radius: 50%;
                  "
                ></span>
                <span
                  v-else
                  style="
                    width: 10px;
                    height: 10px;
                    background: #c92a2a;
                    border-radius: 50%;
                  "
                ></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button
                :disabled="!scope.row.state"
                type="primary"
                @click="rowClick(scope.row)"
                icon="el-icon-edit"
                >远程控制</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { RoomList, updateNote } from "@/api/info";
export default {
  name: "Index",
  data() {
    return {
      showUpdateFormVisible: false,
      isLoading: false,
      title: "",
      note: "",
      //列表数据
      tableData: [],
      ipaddr: "",
    };
  },
  created() {
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
      this.isLoading = true;

      RoomList({
        page: this.page,
        limit: 10,
      })
        .then((res) => {
          var tableData = [];
          tableData = res.data;
          this.tableData = tableData;
          this.isLoading = false;
        })
        .catch((error) => {
          this.tableData = [];
          this.$message.error(error);
          this.isLoading = false;
        });
    },
    submitForm(row) {
      if (row.note == "") {
        return this.$message.warning("备注不能为空!!!");
      }
      console.log(row);
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
      // let { href } = this.$router.resolve({
      //   path: "/remote",
      //   query: { roomID: row.room, username: "admin" },
      // });
      this.$router.push({
        path: "/remote",
        query: { roomID: row.room, username: row.room },
      });
      // window.open(href, "_blank");
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
