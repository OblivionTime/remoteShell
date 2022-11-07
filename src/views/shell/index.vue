<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 10:01:01
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 16:00:42
-->
<template>
  <div>
    <div id="xterm" class="xterm" />
  </div>
</template>
<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";

export default {
  name: "Xterm",
  created() {
    var room = this.$route.query.roomID;
    var ipaddr = localStorage.getItem("ipaddr")
      ? localStorage.getItem("ipaddr")
      : "101.34.204.112:7880";
    this.socketURI = `ws://${ipaddr}/ws?room=${room}`;
  },
  data() {
    return {
      socketURI: "",
      windowWidth: document.documentElement.clientWidth, //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight, //实时屏幕高度
    };
  },
  mounted() {
    this.initSocket();
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        window.fullWidth = document.documentElement.clientWidth;
        this.windowHeight = window.fullHeight; // 高
        this.windowWidth = window.fullWidth; // 宽
      })();
    };
  },
  destroyed() {
    this.socket.close();
    this.term.dispose();
  },
  watch: {
    windowHeight(val) {
      var rows = Math.floor(this.windowHeight / 23);
      var cols = Math.floor(this.windowWidth / 13);
      this.term.resize(cols, rows);
    },
    windowWidth(val) {
      var rows = Math.floor(this.windowHeight / 23);
      var cols = Math.floor(this.windowWidth / 13);
      this.term.resize(cols, rows);
    },
  },
  methods: {
    initTerm() {
      var rows = Math.floor(this.windowHeight / 23);
      var cols = Math.floor(this.windowWidth / 13);
      const term = new Terminal({
        rendererType: "canvas",
        rows: rows,
        cols: cols,
        fontSize: 16,
        cursor_style: "block",
        cursorBlink: true,
        theme: {
          foreground: "#ECECEC", //字体
          background: "#000000", //背景色
          cursor: "help", //设置光标
          lineHeight: 20,
        },
      });

      const attachAddon = new AttachAddon(this.socket);
      const fitAddon = new FitAddon();

      let connectTabElement = document.getElementById("xterm");
      term.open(connectTabElement);
      term.loadAddon(attachAddon);
      term.loadAddon(fitAddon);
      fitAddon.fit();
      term.focus();
      this.term = term;
    },
    initSocket() {
      this.socket = new WebSocket(this.socketURI);
      this.socketOnClose();
      this.socketOnOpen();
      this.socketOnError();
    },
    socketOnOpen() {
      this.socket.onopen = () => {
        this.socket.send("connect");
        // 链接成功后
        this.initTerm();
      };
    },
    socketOnClose() {
      this.socket.onclose = () => {
        // console.log('close socket')
      };
    },
    socketOnError() {
      this.socket.onerror = () => {
        // console.log('socket 链接失败')
      };
    },
  },
};
</script>
<style lang="scss">
</style>
