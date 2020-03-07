<style scoped>

.viewer{
  margin: 0;
  background: #FFFFFF;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 232px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.rigth-second{
  background: #FFFFFF;
  margin-top: 0;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.small-in{
  background: #FFFFFF;
  margin-top: 32px;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 100px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.row-three{
  margin-top: 32px;
  background: #FFFFFF; 
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  height: 120px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
.content-up{
  margin: 0; 
  padding: 10px 0 10px 0; 
  font-size: 20px; 
  text-align: center;
}
.content-down{
  margin: 0; 
  padding: 10px 0 10px 0; 
  font-size: 15px;
  text-align: center; 
}
.chart-wrapper {
  background: #FFFFFF;
  padding: 16px 16px 0;
  margin: 32px 0 32px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<template>
  <div class='app-container' style="width: 100%; height: 900px; background: #EEF0F3; padding: 32px">

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="15">
        <div class="viewer">
          <h1 class="content-up" style="font-size:105px">{{ total_viewers }}</h1>
          <p class="content-down" style="font-size:21px; padding: 20px">总客户端数 <svg-icon icon-class="viewers" /></p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="24">
            <div class="rigth-second">
            <h1 class="content-up" >{{ total_request }}</h1>
            <p class="content-down">总请求数 <svg-icon icon-class="data" /></p>
          </div>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="small-in">
              <h1 class="content-up">{{ used_cpu }} %</h1>
              <p class="content-down">CPU使用率 <svg-icon :icon-class="used_cpu_icon" /></p>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12">
            <div class="small-in">
              <h1 class="content-up">{{ used_memory }}</h1>
              <p class="content-down">内存占用率 <svg-icon :icon-class="used_memory_icon" /></p>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="row-three">
          <h1 class="content-up">{{ bandwidth_in_per_sec }} /s</h1>
          <p class="content-down">总传入带宽 <svg-icon :icon-class="bandwidth_in_per_sec_icon" /></p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="row-three">
          <h1 class="content-up">{{ bandwidth_out_per_sec }} /s</h1>
          <p class="content-down">总传出带宽 <svg-icon :icon-class="bandwidth_out_per_sec_icon" /></p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="row-three">
          <h1 class="content-up">{{ total_bandwidth_in }}</h1>
          <p class="content-down">总传入数据 <svg-icon icon-class="data" /></p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="row-three">
          <h1 class="content-up">{{ total_bandwidth_out }}</h1>
          <p class="content-down">总传出数据 <svg-icon icon-class="data" /></p>
        </div>
      </el-col>
    </el-row>

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
</template>

<script>
import { secondsToHuman, byteToHuman } from '@/utils/helper'

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
  destroyed: function() {
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
        var bandwidth_in_per_sec_temp = byteToHuman(data.bw_in)
        var bandwidth_out_per_sec_temp = byteToHuman(data.bw_out)
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
        this.total_bandwidth_in = byteToHuman(data.bytes_in)
        this.total_bandwidth_out = byteToHuman(data.bytes_out)
        this.up_time = secondsToHuman(data.uptime)
        this.total_viewers = data.server.application.live.nclients
        this.total_request = data.naccepted
      },
      
  },
  mounted() {
    
  },
  methods:{

  }

}
</script>
