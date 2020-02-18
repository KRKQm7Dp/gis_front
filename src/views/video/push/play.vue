<template>
<el-row>
    <el-col :span="24" style="text-align: center; line-height: 80px;">
         <el-tag class="title-tag">正在播放 {{ this.name }} 处监控视频</el-tag>
    </el-col>
    <el-col :span="16" :offset="4">
      <div class="grid-content bg-purple-dark"></div>
      <video id='my-player' class="video-js vjs-big-play-centered vjs-default-skin"></video>
    </el-col>
</el-row>
</template>
<script>
export default {
    data() {
        return {
            name: '',
            src: '',
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
                techOrder: ['flash'], // 兼容顺序
                notSupportedMessage: '此视频暂无法播放，请稍后再试'
            }
        }
    },
    mounted: function(){
        this.initVideo()
    },
    created: function() {
        var params = this.$route.params
        this.src = params.src + '/' + params.name
        this.name = params.name
    },
    destroyed: function() {
      this.$video('my-player').dispose()
    },
    methods: {
        initVideo() {
            console.log('初始化 video')
            let myPlayer = this.$video('my-player', this.playerOptionsFlag)
            var src = this.src
            myPlayer.src([{
                type: 'rtmp/mp4',
                src: src
            },
            {
                withCredentials: false,
                type: 'application/x-mpegURL',
                src: ''
                }
            ])
            myPlayer.load(src)
            myPlayer.play()
        }
    }
}
</script>
<style scoped>
.title-tag {
    font-size: 16px;
    background-color: #ecf5ff;
  }
</style>