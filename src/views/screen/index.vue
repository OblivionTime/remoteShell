<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-10-31 10:01:01
 * @LastEditors: solid
 * @LastEditTime: 2022-11-03 16:03:35
-->
<template>
  <div>
    <div>
      <img :src="screen" alt="" style="height: 80vh; object-fit: cover" />
    </div>
  </div>
</template>
<script>
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
    };
  },
  mounted() {
    this.initSocket();
  },
  destroyed() {
    this.socket.close();
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
  },
};
</script>
<style lang="scss">
</style>
