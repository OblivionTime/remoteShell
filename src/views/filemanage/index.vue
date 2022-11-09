<template>
  <div v-loading.fullscreen.lock="fileContentLoading || fileDownloadLoading">
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
            <span>文件管理</span>
            <div style="margin-top: 10px">
              <el-input
                v-model="currentPath"
                auto-complete="off"
                style="width: 400px"
                :placeholder="currentPath"
                @click.stop.native=""
              >
                <el-button
                  slot="append"
                  icon="el-icon-position"
                  @click="ChangePath"
                ></el-button>
              </el-input>
            </div>
          </div>
          <div>
            <el-button
              style="padding: 3px 0"
              type="text"
              @click="(showUpdateFormVisible = true), (file = '')"
              >上传</el-button
            >
            <el-button
              style="padding: 3px 0; margin-right: 20px"
              type="text"
              @click="loadData, $message.success('刷新成功')"
              >刷新数据
            </el-button>
          </div>
        </div>
      </div>
      <div>
        <el-button
          style="padding: 3px 0"
          type="text"
          :disabled="backwardPath.isEmpty()"
          @click="backwardMenu"
        >
          <img
            :src="leftIcon"
            alt=""
            srcset=""
            style="width: 2em; object-fit: contain; margin-right: 10px"
        /></el-button>
        <el-button
          style="padding: 3px 0"
          type="text"
          :disabled="forwardPath.isEmpty()"
          @click="forwardPathMenu"
        >
          <img
            :src="rightIcon"
            alt=""
            srcset=""
            style="width: 2em; object-fit: contain; margin-right: 10px"
        /></el-button>
      </div>
      <div ref="fileManage" style="height: 55vh; overflow: auto">
        <el-table
          :data="tableData"
          height="55vh"
          @row-click="fileOperations"
          @header-click="sortData"
        >
          <el-table-column label="名称" prop="fileName">
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <img
                  :src="scope.row.IsDir ? folderIcon : fileIcon"
                  alt=""
                  srcset=""
                  style="width: 2.5em; object-fit: contain; margin-right: 10px"
                />
                <div>
                  {{ scope.row.fileName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="最近使用时间"
            width="180"
            align="center"
            prop="accessTime"
          >
            <template slot-scope="scope">
              {{ scope.row.accessTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="180"
            align="center"
            prop="createTime"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="修改时间"
            width="180"
            align="center"
            prop="updateTime"
          >
            <template slot-scope="scope">
              {{ scope.row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column
            label="文件大小"
            width="180"
            align="center"
            prop="size"
          >
            <template slot-scope="scope">
              {{ !scope.row.IsDir ? scope.row.size : "" }}
            </template>
          </el-table-column>
          <el-table-column label="" width="100px">
            <template slot-scope="scope">
              <div v-if="!scope.row.IsDir">
                <el-button
                  style="padding: 3px 0"
                  type="text"
                  :disabled="scope.row.isUs"
                  @click.stop.native="downloadFile(scope.row)"
                  >下载</el-button
                >
                <el-button
                  style="padding: 3px 0; color: red; margin-left: 20px"
                  type="text"
                  :disabled="scope.row.isUs"
                  @click.stop.native="deleteFile(scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
      :title="fileName"
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
    >
      <div
        v-if="dialogVisible"
        style="
          white-space: pre-wrap;
          height: 60vh;
          overflow: auto;
          background: #f5f5f5;
          border: 1px solid #eee;
          padding: 20px;
          border-radius: 10px;
        "
      >
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="fileContent"
        >
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadFileContent"
          >修改文件</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="文件上传"
      :visible.sync="showUpdateFormVisible"
      width="400px"
      :modal-append-to-body="false"
      center
    >
      <el-upload
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        :on-remove="removeFile"
        v-if="showUpdateFormVisible"
        drag
        :limit="1"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click.native="showUpdateFormVisible = false"
          style="width: 140px"
          >取消</el-button
        >
        <el-button type="primary" style="width: 140px" @click="uploadFile"
          >上传文件</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Stack } from "@/utils/statck.js";
export default {
  name: "Index",
  data() {
    return {
      socketURI: "",
      fileIcon: require("@/assets/file.png"),
      folderIcon: require("@/assets/floderblue.png"),
      leftIcon: require("@/assets/arrow-left.png"),
      rightIcon: require("@/assets/arrow-right.png"),
      tableData: [],
      fileList: [],
      folderList: [],
      SendData: {
        root: "/",
        operation: "ls",
        data: "",
      },
      fileContent: "",
      fileName: "",
      dialogVisible: false,
      showUpdateFormVisible: false,
      //路径相关
      currentPath: "/",
      oldPath: "/",
      backwardPath: "",
      forwardPath: "",
      fileManage: "",
      fileContentLoading: false,
      fileDownloadLoading: false,
      file: "",
      showUploadList: true,
      currentItem: "",
      sortingWay: "fileName",
      sortingWay2: "folder",
    };
  },
  created() {
    var room = this.$route.query.roomID;
    var ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
    this.socketURI = `ws://${ipaddr}/file?room=${room}`;
    this.initSocket();
    // 初始化前进,返回栈
    this.forwardPath = new Stack();
    this.backwardPath = new Stack();
  },

  methods: {
    // 更换路径
    ChangePath() {
      if (this.oldPath == this.currentPath) {
        return;
      }
      this.backwardPath.push(this.oldPath);
      this.oldPath = this.currentPath;
      this.SendData = {
        root: this.currentPath,
        operation: "ls",
        data: "",
      };
      this.socket.send(JSON.stringify(this.SendData));
    },
    // 后退
    backwardMenu() {
      var path = this.backwardPath.pop();
      this.forwardPath.push(this.currentPath);
      this.currentPath = path;
      this.oldPath = path;

      this.SendData = {
        root: this.currentPath,
        operation: "ls",
        data: "",
      };
      this.socket.send(JSON.stringify(this.SendData));

      this.$refs.fileManage.scrollTop = 0;
    },
    // 前进
    forwardPathMenu() {
      var path = this.forwardPath.pop();
      this.backwardPath.push(this.currentPath);
      this.currentPath = path;
      this.oldPath = path;
      this.SendData = {
        root: this.currentPath,
        operation: "ls",
        data: "",
      };
      this.socket.send(JSON.stringify(this.SendData));
      this.$refs.fileManage.scrollTop = 0;
    },
    //单位换算
    unitConversion(val) {
      if (val === 0) return "0 B";
      var k = 1024;
      var sizes = ["B", "KB", "MB", "GB", "PB", "TB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(val) / Math.log(k));
      return (val / Math.pow(k, i)).toPrecision(3) + "" + sizes[i];
    },
    //文件操作
    fileOperations(item) {
      if (item.IsDir) {
        this.SendData = {
          root: item.root + item.fileName + "/",
          operation: "ls",
          data: "",
        };
        this.backwardPath.push(this.currentPath);
        this.currentPath = item.root + item.fileName + "/";
        this.socket.send(JSON.stringify(this.SendData));
        this.$refs.fileManage.scrollTop = 0;
      } else {
        this.fileName = item.fileName;
        this.SendData = {
          root: item.root + item.fileName,
          operation: "readFile",
          data: "",
        };
        if (!item.readEnable) {
          return this.$message.warning("文件太大无法读取!!!");
        }
        this.currentItem = item;
        this.fileContentLoading = true;
        this.socket.send(JSON.stringify(this.SendData));
      }
    },
    //删除文件
    deleteFile(item) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.SendData = {
          root: item.root + item.fileName,
          operation: "delete",
          data: "",
        };
        this.socket.send(JSON.stringify(this.SendData));
      });
    },
    //下载文件
    downloadFile(item) {
      this.fileName = item.fileName;
      this.SendData = {
        root: item.root + item.fileName,
        operation: "download",
        data: "",
      };
      this.fileDownloadLoading = true;
      this.socket.send(JSON.stringify(this.SendData));
    },
    //修改文件内容
    uploadFileContent() {
      this.SendData = {
        root: this.currentItem.root + this.currentItem.fileName,
        operation: "updataFile",
        data: this.fileContent,
      };
      this.socket.send(JSON.stringify(this.SendData));
      this.dialogVisible = false;
    },
    //排序
    sortData(col) {
      if (col.property == this.sortingWay) {
        this.sortingWay2 = this.sortingWay2 == "folder" ? "file" : "folder";
      } else {
        this.sortingWay = col.property;
      }
      this.loadData();
    },
    initSocket() {
      this.socket = new WebSocket(this.socketURI);
      this.socketOnOpen();
      this.socketOnMessage();
      this.socketOnError();
      this.socketOnClose();
    },

    /**
     * 文件上传
     */
    //上传前判断
    removeFile() {
      this.file = "";
      this.showUploadList = true;
    },
    handleChange(file) {
      this.file = file.raw;
      if (file.raw) {
        this.showUploadList = false;
      }
    },
    uploadFile() {
      if (!this.file) {
        return this.$message.warning("必须要上传文件");
      }
      var reader = new FileReader();
      var rawData = new ArrayBuffer();
      reader.onload = (e) => {
        const loading = this.$loading({
          lock: true,
          text: "文件上传中........",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        const chunkSize = 20 * 1024 * 1024;
        rawData = e.target.result;
        var byteArray = new Uint8Array(rawData);
        var total = byteArray.length;
        //分块
        var si = Math.ceil(total / chunkSize);
        //文件区域
        var fileArea = [];
        for (let index = 0; index < si; index++) {
          if (index == si - 1) {
            fileArea.push({ start: index * chunkSize, end: total });
          } else {
            fileArea.push({
              start: index * chunkSize,
              end: chunkSize * (index + 1),
            });
          }
        }

        for (let index = 0; index < fileArea.length; index++) {
          const item = fileArea[index];
          this.socket.send(byteArray.slice(item.start, item.end));
        }

        this.socket.send(
          JSON.stringify({
            root: this.currentPath,
            operation: "file_upload_end",
            data: "",
          })
        );
        this.SendData = {
          root: this.currentPath,
          operation: "ls",
          data: "",
        };
        this.socket.send(JSON.stringify(this.SendData));
        this.showUpdateFormVisible = false;
        this.$message.success("上传成功");
        loading.close();
      };
      this.socket.send(
        JSON.stringify({
          root: this.currentPath + this.file.name,
          operation: "file_upload_start",
          data: "",
        })
      );
      setTimeout(() => {
        reader.readAsArrayBuffer(this.file);
      }, 500);
    },
    /**
     * socket相关操作
     */
    loadData() {
      this.SendData = {
        root: this.currentPath,
        operation: "ls",
        data: "",
      };
      this.socket.send(JSON.stringify(this.SendData));
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
          if (this.SendData.operation == "readFile") {
            reader.readAsText(msg.data, "UTF-8");
            reader.onload = (e) => {
              this.fileContent = reader.result;
              this.dialogVisible = true;
              this.fileContentLoading = false;
            };
          } else if (this.SendData.operation == "download") {
            var aTag = document.createElement("a");
            aTag.download = this.fileName;
            aTag.href = URL.createObjectURL(msg.data);
            aTag.click();
            this.fileDownloadLoading = false;
          } else {
            reader.readAsText(msg.data, "UTF-8");
            reader.onload = (e) => {
              let result = reader.result;
              try {
                let res = JSON.parse(result);
                var fileList = [],
                  folderList = [];
                for (const f of res) {
                  if (f.IsDir) {
                    folderList.push(f);
                  } else {
                    f.size = this.unitConversion(f.size);
                    fileList.push(f);
                  }
                }
                switch (this.sortingWay) {
                  case "fileName":
                    folderList.sort(function (p1, p2) {
                      return p1.fileName.localeCompare(p2.fileName, "zh-CN"); //正序
                    });
                    fileList.sort(function (p1, p2) {
                      return p1.fileName.localeCompare(p2.fileName, "zh-CN"); //正序
                    });
                    break;
                  case "accessTime":
                    folderList.sort(function (p1, p2) {
                      return p2.accessTime.localeCompare(p1.accessTime, "zh-CN"); //正序
                    });
                    fileList.sort(function (p1, p2) {
                      return p2.accessTime.localeCompare(p1.accessTime, "zh-CN"); //正序
                    });
                    break;
                  case "createTime":
                    folderList.sort(function (p1, p2) {
                      return p2.createTime.localeCompare(p1.createTime, "zh-CN"); //正序
                    });
                    fileList.sort(function (p1, p2) {
                      return p2.createTime.localeCompare(p1.createTime, "zh-CN"); //正序
                    });
                    break;
                  case "updateTime":
                    folderList.sort(function (p1, p2) {
                      return p2.updateTime.localeCompare(p1.updateTime, "zh-CN"); //正序
                    });
                    fileList.sort(function (p1, p2) {
                      return p2.updateTime.localeCompare(p1.updateTime, "zh-CN"); //正序
                    });
                    break;
                  case "size":
                    folderList.sort(function (a, b) {
                      return a.size - b.size; //正序
                    });
                    fileList.sort(function (a, b) {
                      return a.size - b.size; //正序
                    });
                    break;
                  default:
                    break;
                }
                var tableData;
                if (this.sortingWay2 == "folder") {
                  tableData = folderList.concat(...fileList);
                } else {
                  tableData = fileList.concat(...folderList);
                }
                this.tableData = tableData;
              } catch (err) {
                this.loadData();
                this.$message.info(result);
              }
            };
          }
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
::v-deep .el-table th>.cell {
   cursor: pointer;
}
::v-deep  .el-table tr{
   cursor: pointer;
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
