<style>
.el-input-group__prepend {
  text-align: right;
  width: 138.4px;
}
</style>
<style scoped>
.title-tag {
  font-size: 16px;
  background-color: #ecf5ff;
}
.right-row {
  margin-top: 20px;
}
.ctrl-btn {
  width: 50px;
  height: 50px;
}
.controller {
  position: relative;
  border: 1px solid grey;
}
</style>
<template>
  <div class="app-container">
    <el-row :gutter="32">
      <el-col :span="16">
        <el-col :span="24" style="text-align: left;">
          <el-tag class="title-tag">正在播放 {{ this.data.name }} 处监控视频</el-tag>
        </el-col>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark"></div>
          <video id="my-player" class="video-js vjs-big-play-centered vjs-default-skin right-row"></video>
        </el-col>
      </el-col>
      <el-col :span="8">
        <el-col :span="24" style="text-align: left;">
          <el-tag class="title-tag">监控控制台</el-tag>
        </el-col>
        <el-col :span="24" class="right-row" style="border: 1px solid black">
          <div class="controller">
            <tr>
              <td>1111</td>
              <td>
                <el-button class="ctrl-btn" type="primary">↑</el-button>
              </td>
              <td>1111</td>
            </tr>
            <tr>
              <td>
                <el-button class="ctrl-btn" type="primary">←</el-button>
              </td>
              <td>1111</td>
              <td>
                <el-button class="ctrl-btn" type="primary">→</el-button>
              </td>
            </tr>
            <tr>
              <td>1111</td>
              <td>
                <el-button class="ctrl-btn" type="primary">↓</el-button>
              </td>
              <td>1111</td>
            </tr>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="12">
          <el-row class="right-row">
            <el-tag class="title-tag">实时数据</el-tag>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.name">
              <template slot="prepend">name：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.resolution">
              <template slot="prepend">resolution：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.viewers">
              <template slot="prepend">viewers：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.time">
              <template slot="prepend">time：</template>
            </el-input>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="right-row">
            <el-tag class="title-tag">监控信息</el-tag>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.client.id">
              <template slot="prepend">ID：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.client.flashver">
              <template slot="prepend">Flash version：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.client.swfurl">
              <template slot="prepend">SWF URL：</template>
            </el-input>
          </el-row>
          <el-row class="right-row">
            <el-input v-model="data.client.timestamp">
              <template slot="prepend">Timestamp：</template>
            </el-input>
          </el-row>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { secondsToHuman, byteToHuman } from "@/utils/helper";

export default {
  data() {
    return {
      name: "",
      src: "",
      data: "",
      client: "",
      playerOptionsFlag: {
        height: 300,
        loop: false,
        controls: true,
        autoplay: true, // 如果true，浏览器准备好时开始播放
        muted: true, // 默认情况下将会消除任何音频
        poster: "", //没有播放时图片
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器
        html5: { hls: { withCredentials: false } },
        techOrder: ["flash"], // 兼容顺序
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      }
    };
  },
  mounted: function() {
    this.initVideo();
  },
  created: function() {
    this.data = this.$route.params.data;
    console.log(this.data);
    if (this.data === null || this.data === undefined || this.data === "") {
      this.$router.push("/404");
    }
  },
  destroyed: function() {
    this.$video("my-player").dispose();
  },
  methods: {
    initVideo() {
      console.log("初始化 video");
      let myPlayer = this.$video("my-player", this.playerOptionsFlag);
      var src = this.data.src;
      myPlayer.src([
        {
          type: "rtmp/mp4",
          src: src
        },
        {
          withCredentials: false,
          type: "application/x-mpegURL",
          src: ""
        }
      ]);
      myPlayer.load(src);
      myPlayer.play();
    }
  },
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    disconnect: function() {
      console.log("socket disconnected");
    },
    statistics: function(data) {
      this.tableData = [];
      console.log(data.server.application);
      var stream = data.server.application.live.stream;
      var appName = data.server.application.name;
      console.log("------");
      if (stream !== null && stream !== undefined) {
        var apps = [];
        if (stream instanceof Array) {
          apps = stream;
        } else {
          apps.push(stream);
        }
        for (let i in apps) {
          if (apps[i].name === this.data.name) {
            this.data.name = apps[i].name;
            this.data.bw_in = byteToHuman(apps[i].bw_in);
            this.data.bw_out = byteToHuman(apps[i].bw_out);
            this.data.bytes_in = byteToHuman(apps[i].bytes_in);
            this.data.bytes_out = byteToHuman(apps[i].bytes_out);
            this.data.time = secondsToHuman(apps[i].time / 1000);
            this.data.viewers = parseInt(apps[i].nclients) - 1;
            if (
              apps[i].meta != "" &&
              apps[i].meta != null &&
              apps[i].meta != undefined
            ) {
              this.data.resolution =
                apps[i].meta.video.width + "X" + apps[i].meta.video.height;
            }

            var clients = [];
            if (apps[i].client instanceof Array) {
              clients = apps[i].client;
            } else {
              clients.push(apps[i].client);
            }
            clients.forEach(c => {
              if (c.pageurl === window.location.href) {
                this.data.client = c;
              }
            });
            console.log("=================");
            console.log(this.data);
          }
        }
      } else {
        console.log("暂无流媒体设备接入");
      }
    }
  }
};
</script>