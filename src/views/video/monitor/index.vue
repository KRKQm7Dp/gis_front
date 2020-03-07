<template>
  <div class='app-container'>

    <!-- <div v-for="i in videoNum" :key="i">
        <video-player  class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              :options="playerOptions[i]"></video-player>
    </div> -->
    <div style="width: 100%; text-align:center">
        
    </div>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8" >
        <el-button type="primary" @click="loadingFlag = true">刷新视频流</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" >
        <el-radio-group v-model="radio" @change="radioChange">
          <el-radio label="1" border >四宫格</el-radio>
          <el-radio label="2" border>九宫格</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>

    <el-row :gutter='32'>
    <div v-for="(item, i) in videoNum" :key="i">
      <el-col :xs="24" :sm="24" :lg="colSize" style="margin-top: 32px; ">
        <el-tag class="title-tag" size="small" :type="videoNames[i] === undefined ? 'danger' : ''">
          {{ videoNames[i] === undefined ? '暂无' : videoNames[i] }} 监控画面
        </el-tag>
        <video :id="'video_' + i" class="video-js vjs-big-play-centered vjs-default-skin" preload="auto">
        </video>
      </el-col>
    </div>
    </el-row>
    

  </div>
</template>

<script>
import { secondsToHuman, byteToHuman } from '@/utils/helper'

export default {
    data() {
      return {
        streamList: [],
        videoSrc: '',
        radio: '1',
        colSize: 12,
        videoNum: 4,
        videos: [],
        videoNames: [],
        loadingFlag: true,
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
    destroyed: function() {
      console.log('========执行 destoryed=========videoNum=' + this.videoNum)
      for (let i=0; i < this.videoNum; i++){
        this.videos[i].dispose()
      }
    },
    mounted: function(){
      this.initVideo()
    },
    activated: function() {
      
    },
    sockets:{
        connect: function () {
            console.log('socket connected')
        },
        disconnect: function(){
            console.log('socket disconnected')
        },
        statistics: function (data) {
            var stream = data.server.application.live.stream
            var appName = data.server.application.name
            this.playerOptions = []
            this.streamList = []
            this.videoNames = []
            if( stream !== null && stream !== undefined ){
              var apps = []
              if(stream instanceof Array){
                apps = stream
              }else{
                apps.push(stream)
              }
              for(let i = 0; i < apps.length; i++){
                let videoSrc = process.env.VUE_APP_RTMP_SERVER_URL + '/' + appName + '/' + apps[i].name
                this.streamList.push(videoSrc)
                this.videoNames.push(apps[i].name)
              }
              if (this.loadingFlag){
                console.log("刷新视频流")
                this.loadVideo()
                this.loadingFlag = false
              }
            }else{
              console.log('暂无视频流接入')
              // this.$message({
              //   message: '暂无视频流接入',
              //   type: 'warning',
              //   duration: 5 * 1000
              // })
            }
        },
    },
    methods:{
      loadVideo(){
        console.log('===========loadVideo============')
        console.log(this.loadingFlag)
        for (let i in this.streamList) {
          let stream_src = this.streamList[i]
          console.log(stream_src)
          console.log(this.videos[i])
          // this.videos[i].reset()
          this.videos[i].src([{
            type: 'rtmp/mp4',
            src: stream_src
          },
          {
            withCredentials: false,
            type: 'application/x-mpegURL',
            src: ''
            }
          ]);
          this.videos[i].load(stream_src)
          this.videos[i].play()
        }
      },
      initVideo(){
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
      },
    }

  }
</script>
