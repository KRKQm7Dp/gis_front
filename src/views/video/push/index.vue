<template>
  <div class='app-container'>
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        height="600"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.client[0].id[0] }}</span>
              </el-form-item>
              <el-form-item label="Address">
                <span>{{ props.row.client[0].address[0] }}</span>
              </el-form-item>
              <el-form-item label="Flash version">
                <span>{{ props.row.client[0].flashver[0] }}</span>
              </el-form-item>
              <el-form-item label="SWF URL">
                <span>{{ props.row.client[0].swfurl[0] }}</span>
              </el-form-item>
              <el-form-item label="Dropped">
                <span>{{ props.row.client[0].dropped[0] }}</span>
              </el-form-item>
              <el-form-item label="Timestamp">
                <span>{{ props.row.client[0].timestamp[0] }}</span>
              </el-form-item>
              <el-form-item label="A-V">
                <span>{{ props.row.client[0].avsync[0] }}</span>
              </el-form-item>
              <el-form-item label="Time">
                <span>{{ props.row.client[0].time[0] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handlePlay(scope)">播放</el-button>
          </template>
        </el-table-column>
        <el-table-column
        prop=""
        label="丢失">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="handleRecord(scope)">录制</el-button> -->
            <el-button type="danger" size="small" @click="handleDrop(scope)">断开</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import { secondsToHuman, byteToHuman } from '@/utils/helper'
import { drop } from '@/api/stream'

Vue.use(new VueSocketIO({
    debug: false,
    connection: SocketIO(process.env.VUE_APP_RTMP_MONITOR_URL)
  }))

export default {
    data() {
      return {
        tableData: [],
        emptyText: ''
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
          if (apps !== null && apps !== undefined){
            for (let i in apps) {
              var row = {}
              row.name = apps[i].name
              row.bw_in = byteToHuman(apps[i].bw_in[0])
              row.bw_out = byteToHuman(apps[i].bw_out[0])
              row.bytes_in = byteToHuman(apps[i].bytes_in[0])
              row.bytes_out = byteToHuman(apps[i].bytes_out[0])
              row.time = secondsToHuman(apps[i].time[0] / 1000)
              row.viewers = parseInt(apps[i].nclients[0]) - 1
              row.resolution = apps[i].meta[0].video[0].width[0] + 'X' + apps[i].meta[0].video[0].height[0];
              row.client = apps[i].client
              this.tableData.push(row)
            }
          }else{
            console.log('暂无流媒体设备接入')
            this.emptyText = '暂无流媒体设备接入'
          }
          console.log(this.tableData)
        },
    },
    methods:{
      handlePlay(scope) {
        console.log('==========================')
        console.log(scope.row.client[0].swfurl[0])
        this.$router.push({
          path: '/video/play',
          name: 'Play',
          params: {
            src: scope.row.client[0].swfurl[0],
            name: scope.row.name[0]
          }
        })  // query: {src: scope.row.client[0].swfurl[0],name: scope.row.name} 也可使用 params 传递参数， 使用 query 传递参数在地址栏可见
      },
      // handleRecord(scope) {
      //   var name = scope.row.name
      //   window.location.href = process.env.VUE_APP_RTMP_URL + '/control/record/start?app=myapp&name='+ name +'&rec=rec1'
      // }
      handleDrop(scope) {
        var params = {
          name: '',
          clientid: ''
        }
        params.name = scope.row.name
        params.clientid = scope.row.client[0].id[0]
        drop(params).then(response => {
          if (response.data === 1) {
            this.$message({
                message: '断开视频流成功，等待重连......',
                type: 'success',
                duration: 5 * 1000
              })
          }
        })
      }
    }

  }
</script>
<style lang="scss" scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>