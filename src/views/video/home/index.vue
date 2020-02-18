<style scoped>
.head-father{
    width: 100%; 
    height: 200px; 
    float: none;
}
.viewer{
  margin: 10px 20px;
  width: 60%;
  height: 200px; 
  background: #FFFFFF;
  float: left;
  text-align: center;
  line-height: 180px;
  border-radius: 8px;
}
.viewer-right{ 
  width: 35%;
  height: 200px;
  position: relative;
  display: flex;
  flex-direction:column;
  justify-content:center;
}
.rigth-second{
  background: #FFFFFF;
  margin-top: 10px;
  position: relative;
  width: 100%;
  height: 95px;
  text-align: center;
  line-height: 80px;
  border-radius: 8px;
}
.rigth-second-down{
  position: relative;
  width: 100%;
  height: 95px;
  margin-top:8px;
  display: flex;
  flex-direction:row;
  justify-content:space-between;
}
.small-in{
  background: #FFFFFF;
  width: 48%;
  height: 80px;
  margin-top: 10px;
  text-align: center;
  line-height: 80px;
  border-radius: 8px;
}
.father-nav{
    width: 100%; 
    height: 100px;
    float: none;
    position: relative;
    display: flex;
    flex-direction:row;
    justify-content:space-between;
}
.nav{
  position: relative;
  margin: 10px 20px;
  /* padding: 0 60px; */
  width: 25%;
  height: 110px;
  background: #FFFFFF; 
  border-radius: 8px;
  text-align: center;
  line-height: 90px;
}
.content-up{
  width: 100%;
  height: 60%;
  margin: 0; 
  padding: 15px; 
  font-size: 20px; 
  text-align: center;
  line-height: 100%;
}
.content-down{
  width: 100%;
  height: 40%; 
  margin: 0px; 
  padding: 5px; 
  font-size: 15px;
  text-align: center; 
  line-height: 100%;
}
.chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<template>
  <div class='app-container' style="width: 100%; height: 900px; background: #EEF0F3">
    <div class="head-father">
      <div class="viewer">
        <h1 class="content-up" style="font-size:105px">{{ total_viewers }}</h1>
        <p class="content-down" style="font-size:21px; padding: 20px">总观看人数 <svg-icon icon-class="viewers" /></p>
      </div>
      <div class="viewer-right">
        <div class="rigth-second">
          <h1 class="content-up" >{{ total_request }}</h1>
          <p class="content-down">总请求数 <svg-icon icon-class="data" /></p>
        </div>
        <div class="rigth-second-down">
            <div class="small-in">
              <h1 class="content-up">{{ used_cpu }} %</h1>
              <p class="content-down">CPU使用率 <svg-icon :icon-class="used_cpu_icon" /></p>
            </div>
            <div class="small-in">
              <h1 class="content-up">{{ used_memory }}</h1>
              <p class="content-down">内存占用率 <svg-icon :icon-class="used_memory_icon" /></p>
            </div>
        </div>
      </div>
    </div>
    <div class="father-nav">
      <div class="nav">
          <h1 class="content-up">{{ bandwidth_in_per_sec }} /s</h1>
          <p class="content-down">总传入带宽 <svg-icon :icon-class="bandwidth_in_per_sec_icon" /></p>
      </div>
      <div class="nav">
        <h1 class="content-up">{{ bandwidth_out_per_sec }} /s</h1>
          <p class="content-down">总传出带宽 <svg-icon :icon-class="bandwidth_out_per_sec_icon" /></p>
      </div>
      <div class="nav">
        <h1 class="content-up">{{ total_bandwidth_in }}</h1>
        <p class="content-down">总传入数据 <svg-icon icon-class="data" /></p>
      </div>
      <div class="nav">
        <h1 class="content-up">{{ total_bandwidth_out }}</h1>
          <p class="content-down">总传出数据 <svg-icon icon-class="data" /></p>
      </div>
    </div>

    <div style="margin-top: 40px; padding: 20px">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <ve-line :data="chartDataCPU" :settings="chartSettingsCPU"></ve-line>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-wrapper">
            <ve-line :data="chartDataMEM" :settings="chartSettingsMEM"></ve-line>
          </div>
        </el-col>
      </el-row>
    </div>
    
  </div>
</template>

<script>
import Vue from 'vue'
import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import { secondsToHuman, byteToHuman } from '@/utils/helper'


Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO(process.env.VUE_APP_RTMP_MONITOR_URL) // 39.107.125.189
  }))

export default {
    data() {
      this.chartSettingsCPU = {
        yAxisType: ['percent'],
        area: true,
        itemStyle:{ //面积图颜色设置
          color:{
              type:'linear',
              x:0,
              y:0,
              x2:0,
              y2:1,
              colorStops:[
                  {
                      offset: 0,
                      color: 'rgba(254,106,172,0.6)',
                  }, 
                  {
                      offset: 1, 
                      color: 'rgba(255,139,119,0.1)'
                  },
              ],
              globalCoord: false // 缺省为 false
          }
        },
      }
      this.chartSettingsMEM = {
        yAxisType: [function(v){
          return v + 'MB'
        }],
        area: true,
        itemStyle:{ //面积图颜色设置
          color:{
              type:'linear',
              x:0,
              y:0,
              x2:0,
              y2:1,
              colorStops:[
                  {
                      offset: 0,
                      color: 'rgba(94,225,198)',
                  }, 
                  {
                      offset: 1, 
                      color: 'rgba(193,229,224)'
                  },
              ],
              globalCoord: false // 缺省为 false
          }
        },
      }
      return {
        chartDataCPU: {
          columns: ['date', 'cpu'],
          rows: []
        },
        chartDataMEM: {
          columns: ['date', 'mem'],
          rows: []
        },
        bandwidth_in_per_sec_icon: 'equal',
        bandwidth_out_per_sec_icon: 'equal',
        used_cpu_icon: 'equal',
        used_memory_icon: 'equal',
        used_cpu: 0,
        used_memory: 0,
        bandwidth_in_per_sec: 0,
        bandwidth_out_per_sec: 0,
        total_bandwidth_in: 0,
        total_bandwidth_out: 0,
        up_time: 0,
        total_viewers: 0,
        total_request: 0,
        stream: 0,
      }
    },
    created() {
    },
    sockets:{
        connect: function () {
            console.log('socket connected')
        },
        disconnect: function(){
          console.log('socket disconnected')
        },
        server: function(data){
          if(data.used_cpu > this.used_cpu){
            this.used_cpu_icon = 'up'
          }else if( data.used_cpu < this.used_cpu ){
            this.used_cpu_icon = 'down'
          }else{
            this.used_cpu_icon = 'equal'
          }
          if(data.used_memory > this.used_memory){
            this.used_memory_icon = 'up'
          }else if( data.used_memory < this.used_memory ){
            this.used_memory_icon = 'down'
          }else{
            this.used_memory_icon = 'equal'
          }
          
          this.used_cpu = data.used_cpu
          this.used_memory = byteToHuman(data.used_memory * 1024)
          this.chartDataCPU.rows.push({date: new Date().toLocaleString(), cpu: this.used_cpu / 100})
          this.chartDataMEM.rows.push({date: new Date().toLocaleString(), mem: (data.used_memory / 1024).toFixed(2)})
          console.log(this.chartDataCPU)
        },
        statistics: function (data) {
          var bandwidth_in_per_sec_temp = byteToHuman(data.bw_in[0])
          var bandwidth_out_per_sec_temp = byteToHuman(data.bw_out[0])
          if(bandwidth_in_per_sec_temp > this.bandwidth_in_per_sec){
            this.bandwidth_in_per_sec_icon = 'up'
          }else if(bandwidth_in_per_sec_temp < this.bandwidth_in_per_sec ){
            this.bandwidth_in_per_sec_icon = 'down'
          }else{
            this.bandwidth_in_per_sec_icon = 'equal'
          }
          if(bandwidth_out_per_sec_temp > this.bandwidth_out_per_sec){
            this.bandwidth_out_per_sec_icon = 'up'
          }else if(bandwidth_out_per_sec_temp < this.bandwidth_out_per_sec ){
            this.bandwidth_out_per_sec_icon = 'down'
          }else{
            this.bandwidth_out_per_sec_icon = 'equal'
          }
          this.bandwidth_in_per_sec = bandwidth_in_per_sec_temp
          this.bandwidth_out_per_sec  = bandwidth_out_per_sec_temp
          this.total_bandwidth_in = byteToHuman(data.bytes_in[0])
          this.total_bandwidth_out = byteToHuman(data.bytes_out[0])
          this.up_time = secondsToHuman(data.uptime[0])
          this.total_viewers = data.server[0].application[0].live[0].nclients[0]
          this.total_request = data.naccepted[0]
        },
        
    },
    mounted() {
      
    },
    methods:{

    }

  }
</script>
