<template>
  <div class='app-container'>
      <el-table
        :data="tableData"
        height="250"
        border
        style="width: 100%">
        <el-table-column
        prop="name"
        label="直播流">
        </el-table-column>
        <el-table-column
        prop="resolution"
        label="分辨率">
        </el-table-column>
        <el-table-column
        prop="bw_in"
        label="传入带宽">
        </el-table-column>
        <el-table-column
        prop="bw_out"
        label="传出带宽">
        </el-table-column>
        <el-table-column
        prop="bytes_in"
        label="传入数据">
        </el-table-column>
        <el-table-column
        prop="bytes_out"
        label="传出数据">
        </el-table-column>
        <el-table-column
        prop="viewers"
        label="观看人数">
        </el-table-column>
        <el-table-column
        prop="time"
        label="持续时间">
        </el-table-column>
        <el-table-column
        prop=""
        label="播放">
        </el-table-column>
        <el-table-column
        prop=""
        label="丢失">
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import { secondsToHuman, byteToHuman } from '@/utils/helper'

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://192.168.234.130:9991')
  }))

export default {
    data() {
      return {
        tableData: []
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
        statistics: function (data) {
          this.tableData = []
            console.log(data.server[0].application[0])
            var apps = data.server[0].application[0].live[0].stream
            console.log('------')
            console.log(apps.name)
            for(let i in apps){
              var row = {}
            row.name = apps[i].name
            row.bw_in = byteToHuman(apps[i].bw_in[0])
            row.bw_out = byteToHuman(apps[i].bw_out[0])
            row.bytes_in = byteToHuman(apps[i].bytes_in[0])
            row.bytes_out = byteToHuman(apps[i].bytes_out[0])
            row.time = secondsToHuman(apps[i].time[0] / 1000)
            row.viewers = parseInt(apps[i].nclients[0]) - 1
            row.resolution = apps[i].meta[0].video[0].width[0] + 'X' + apps[i].meta[0].video[0].height[0];
            this.tableData.push(row)
            }
            console.log(this.tableData)
        },
        
    },
    methods:{

    }

  }
</script>
