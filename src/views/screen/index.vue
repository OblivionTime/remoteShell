<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 10:01:01
 * @LastEditors: solid
 * @LastEditTime: 2022-11-11 17:09:50
-->
<template>
  <div>
    <el-card class="box-card" style="height: 80vh; overflow: auto">
      <div slot="header" class="clearfix">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>实时监控</span>

          <div style="display: flex; align-items: center">
            <div style="width: 400px">
              <el-progress
                :text-inside="true"
                :stroke-width="18"
                :percentage="percentage"
                status="success"
              ></el-progress>
            </div>
            <div style="margin: 0 20px">
              {{ current_time }}/{{ total_time }}
            </div>
            <div
              v-if="recordScreenFlag"
              style="display: flex; align-items: center"
            >
              <i
                :class="
                  recordScreenPause
                    ? 'el-icon-video-pause'
                    : 'el-icon-video-play'
                "
                style="color: blue; font-size: 20px; cursor: pointer"
                @click="ToggleStatus"
              ></i>
              <img
                :src="stopIcon"
                @click="stopRecordScreen"
                style="
                  width: 1.25rem;
                  object-fit: contain;
                  margin-left: 10px;
                  cursor: pointer;
                "
              />
            </div>
            <div v-else>
              <el-button type="text" @click="timeStart">开始录制</el-button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img :src="screen" alt="" style="width: 70%; object-fit: cover" />
      </div>
    </el-card>
  </div>
</template>
<script>
const fs = window.require("fs");
const util = window.require("util");
const exec = util.promisify(window.require("child_process").exec);
export default {
  name: "Screen",
  created() {
    var room = this.$route.query.roomID;
    var ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
    this.socketURI = `ws://${ipaddr}/screen?room=${room}`;
  },
  data() {
    return {
      socketURI: "",
      screen: "",
      current_time: "00:00",
      total_time: "10:00",
      recordScreenFlag: false,
      recordScreenPause: true,
      timer: "",
      minute: 0,
      ms: 0,
      second: 0, //秒
      percentage: 0,
      count: 0,
      stopIcon: require("@/assets/stop.png"),
      imgList: [],
    };
  },
  mounted() {
    this.initSocket();
  },

  destroyed() {
    this.socket.close();
    clearInterval(this.timer);
  },
  methods: {
    initSocket() {
      this.socket = new WebSocket(this.socketURI);
      this.socketOnOpen();
      this.socketOnMessage();
      this.socketOnError();
      this.socketOnClose();
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        this.socket.send("connect");
      };
    },
    socketOnMessage() {
      this.socket.onmessage = (res) => {
        if (this.recordScreenFlag && this.recordScreenPause) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(res.data);
          reader.onload = (e) => {
            this.imgList.push(reader.result);
          };
        }
        const url = window.URL.createObjectURL(res.data);
        this.screen = url;
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
    toBuffer(ab) {
      var buf = Buffer.alloc(ab.byteLength);
      var view = new Uint8Array(ab);
      for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
      }
      return buf;
    },
    async rmdir(dir) {
      await exec(`rd /s /q "${dir}"`);
    },
    /**录制 */
    async img_to_video() {
      if (fs.existsSync("./video")) {
        await this.rmdir("./video");
      }
      fs.mkdirSync("./video");
      this.imgList.forEach((value, index) => {
        var fileName = `./video/${index}.png`;
        fs.writeFileSync(fileName, this.toBuffer(value));
      });
      const time = this.imgList.length.toString();
      await exec(
        `ffmpeg.exe -r 1 -f image2 -i ./video/%d.png -t ${time} ./video/video.mp4`
      );
      var data = fs.readFileSync("./video/video.mp4");
      var aTag = document.createElement("a");
      aTag.download = `${new Date().getTime()}`;
      aTag.href = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );
      aTag.click();
      await this.rmdir("./video");
    },
    timeStart() {
      this.recordScreenFlag = true;
      this.timer = setInterval(this.recordScreen, 1000);
    },
    ToggleStatus() {
      if (this.recordScreenPause) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(this.recordScreen, 1000);
      }
      this.recordScreenPause = !this.recordScreenPause;
    },
    async stopRecordScreen() {
      clearInterval(this.timer);
      this.current_time = "00:00";
      this.recordScreenPause = true;
      this.recordScreenFlag = false;
      await this.img_to_video();
      this.imgList = [];
      this.percentage = 0;
    },
    recordScreen() {
      this.count += 1;
      this.percentage = Math.floor((this.count / 600) * 100);
      this.second = this.second + 1; //秒
      if (this.second >= 60) {
        this.second = 0;
        this.minute = this.minute + 1; //分钟
      }
      this.current_time =
        this.toDub(this.minute) + ":" + this.toDub(this.second);
    },
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
  },
};
</script>
<style lang="scss">
</style>
