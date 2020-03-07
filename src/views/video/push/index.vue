<template>
  <div class='app-container'>
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        height="600"
        border
        style="width: 100%">
        <!-- <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.client.id }}</span>
              </el-form-item>
              <el-form-item label="Address">
                <span>{{ props.row.client.address }}</span>
              </el-form-item>
              <el-form-item label="Flash version">
                <span>{{ props.row.client.flashver }}</span>
              </el-form-item>
              <el-form-item label="SWF URL">
                <span>{{ props.row.client.swfurl }}</span>
              </el-form-item>
              <el-form-item label="Dropped">
                <span>{{ props.row.client.dropped }}</span>
              </el-form-item>
              <el-form-item label="Timestamp">
                <span>{{ props.row.client.timestamp }}</span>
              </el-form-item>
              <el-form-item label="A-V">
                <span>{{ props.row.client.avsync }}</span>
              </el-form-item>
              <el-form-item label="Time">
                <span>{{ props.row.client.time }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column> -->
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
        label="客户端"
        width="200px">
        <template slot-scope="scope">
          <el-select v-model="clinetId" placeholder="请选择">
            <el-option
              v-for="item in scope.row.client"
              :key="item.id"
              :label="(item.hasOwnProperty('publishing') ? '推流客户端': '播放客户端') + '_' + item.id"
              :value="item.id">
            </el-option>
          </el-select>
          </template>
        </el-table-column>
        <el-table-column
        prop=""
        label="操作"
        width="200px">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="handleRecord(scope)">录制</el-button> -->
            <el-button type="primary" size="small" @click="handlePlay(scope)">播放</el-button>
            <el-button type="danger" size="small" @click="handleDrop(scope)">断开</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { secondsToHuman, byteToHuman } from '@/utils/helper'
import { drop } from '@/api/stream'

export default {
    data() {
      return {
        tableData: [],
        emptyText: '',
        clinetId: '',
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
          console.log(data.server.application)
          var stream = data.server.application.live.stream
          var appName = data.server.application.name
          console.log('------')
          if (stream !== null && stream !== undefined){
            var apps = []
            if(stream instanceof Array){
              apps = stream
            }else{
              apps.push(stream)
            }
            for (let i in apps) {
              var row = {}
              row.name = apps[i].name
              row.bw_in = byteToHuman(apps[i].bw_in)
              row.bw_out = byteToHuman(apps[i].bw_out)
              row.bytes_in = byteToHuman(apps[i].bytes_in)
              row.bytes_out = byteToHuman(apps[i].bytes_out)
              row.time = secondsToHuman(apps[i].time / 1000)
              row.viewers = parseInt(apps[i].nclients) - 1
              if(apps[i].meta != '' && apps[i].meta != null && apps[i].meta != undefined){
                row.resolution = apps[i].meta.video.width + 'X' + apps[i].meta.video.height;
              }
              var clients = apps[i].client
              row.client = []
              if(clients instanceof Array){
                row.client =  clients
              }else{
                row.client.push(clients)
              }
              row.src = process.env.VUE_APP_RTMP_SERVER_URL + '/' + appName + '/' + apps[i].name
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
        console.log(scope.row)
        this.$router.push({
          path: '/video/play',
          name: 'Play',
          params: {
            data: scope.row
          }
        })  // query: {src: scope.row.client.swfurl,name: scope.row.name} 也可使用 params 传递参数， 使用 query 传递参数在地址栏可见
      },
      handleDrop(scope) {
        console.log(scope.row)
        if(this.clinetId === '' || 
          this.clinetId === undefined || 
          this.clinetId === null){
            this.$alert('请选择要断开的客户端', '提示', {
              confirmButtonText: '确定',
            });
            return
        }
        var params = {
          name: '',
          clientid: ''
        }
        params.name = scope.row.name
        params.clientid = this.clinetId
        drop(params).then(response => {
          if (response.data === 1) {
            this.clinetId = null
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