<template>
  <div class='app-container'>

    <!-- <div v-for="i in videoNum" :key="i">
        <video-player  class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions[i]"></video-player>
    </div> -->
    <div style="width: 100%; text-align:center">
      <el-radio-group v-model="radio" @change="radioChange">
        <el-radio label="1" border >四宫格</el-radio>
        <el-radio label="2" border>九宫格</el-radio>
      </el-radio-group>
    </div>

    <el-row :gutter='32'>
    <div v-for="(item, i) in videoNum" :key="i">
      <el-col :xs="24" :sm="24" :lg="colSize" style="margin-top: 32px; ">
        <!-- <video-player  id="video"
              class="video-player vjs-custom-skin" 
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions[i]"></video-player> -->
              {{i}}
        <video :id="'video_' + i" class="video-js vjs-big-play-centered vjs-default-skin">
        </video>
      </el-col>
    </div>
    </el-row>
    

  </div>
</template>

<script>
import Vue from 'vue'
import { secondsToHuman, byteToHuman } from '@/utils/helper'
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';


Vue.use(new VueSocketIO({
    debug: false,
    connection: SocketIO('http://192.168.234.130:9991')
  }))

export default {
    data() {
      return {
        streamList: [],
        videoSrc: 'rtmp://localhost:8090/myapp/test',
        radio: '1',
        colSize: 12,
        videoNum: 4,
        videos: [],
        playerOptions: [],
        playerOptionsFlag : {
          height: 300,
          loop: false,
          controls: true,
          autoplay: true, // 如果true，浏览器准备好时开始播放
          muted: true, // 默认情况下将会消除任何音频
          poster: '', //没有播放时图片
          aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器
          html5: { hls: { withCredentials: false } },
          // sources: [{ // 当前视频类型和url
          //   type: 'rtmp/mp4',
          //   src: '' //我转换的视频流Url rtmp://39.107.125.189:1935/myapp/test
          // },
          // {
          //   withCredentials: false,
          //   type: 'application/x-mpegURL',
          //   src: ''
          //   }
          // ],
          techOrder: ['flash'], // 兼容顺序
          notSupportedMessage: '此视频暂无法播放，请稍后再试'
        }
      }
    },
    created: function() {
      
    },
    mounted: function(){
      this.initVideo()
    },
    activated: function() {
      this.getCase()
    },
    sockets:{
        connect: function () {
            console.log('socket connected')
        },
        disconnect: function(){
            console.log('socket disconnected')
        },
        statistics: function (data) {
            var apps = data.server[0].application[0].live[0].stream
            this.playerOptions = []
            console.log(apps.length + "-----" + this.streamList.length)
            // var flag = true
            // if(apps.length === this.streamList.length){
            //   for(let i = 0; i < apps.length; i++){
            //     console.log(apps[0].client[0].swfurl[0] + '/' + apps[i].name +'========='+ this.streamList[i])
            //     if(apps[0].client[0].swfurl[0] + '/' + apps[i].name != this.streamList[i]){
            //       flag = false
            //       break;
            //     }
            //   }
            //   console.log(flag)
            //   if(flag)
            //     return  
            // }
            this.streamList = []
            for(let i = 0; i < apps.length; i++){
              // console.log(apps[0].client[0].swfurl[0] + '/' + apps[i].name)
              // this.playerOptionsFlag.sources[0].src = apps[i].client[0].swfurl[0] + '/' + apps[i].name
              // this.playerOptions.push(this.playerOptionsFlag)
              var videoSrc = apps[0].client[0].swfurl[0] + '/' + apps[i].name
              console.log('========================')
              console.log(videoSrc)
              this.streamList.push(videoSrc)
              // this.videos[i].reset()
              this.videos[i].src([{
                type: 'rtmp/mp4',
                src: videoSrc
              },
              {
                withCredentials: false,
                type: 'application/x-mpegURL',
                src: ''
                }
              ]);
              this.videos[i].load(videoSrc)
              this.videos[i].play()
            }
            console.log('---------------------')
            console.log(this.streamList)
        },
    },
    methods:{
      initVideo(){
        // for(let i = 0; i < this.videoNum; i ++){
        //   this.playerOptions.push({height: 300})
        // }
        //初始化视频方法
        console.log('initVideo')
        this.videos = []
        for(let i=0; i<this.videoNum; i++){
          console.log('i=' + i)
          let myPlayer = this.$video('video_' + i, this.playerOptionsFlag)
          this.videos.push(myPlayer)
        }
        console.log(this.videos)
      },
      radioChange(){
        console.log(this.radio)
        if(this.radio === '1'){
          this.colSize = 12
          this.videoNum = 4
          this.videos.forEach(element => {
            this.videos.pop().dispose()
          });
        }else{
          this.colSize = 8
          this.videoNum = 9
        }
        setTimeout(() => {
          this.initVideo()
        }, 1000)
      }
    }

  }
</script>
