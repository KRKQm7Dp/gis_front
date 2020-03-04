<template>
  <div class="chart-container">
    <div style="background: #394056;padding: 20px 20px 0 20px;display:flex;align-items:center;">
      <span style="color: white;margin-right: 20px;">选择显示数据</span>
      <el-radio-group v-model="chartType">
        <el-radio label="temp">温度曲线</el-radio>
        <el-radio label="humidity">湿度曲线</el-radio>
      </el-radio-group>
    </div>
    <chart :type="chartType" :deviceId="deviceId" height="100%" width="100%" />
  </div>
</template>

<script>
import Chart from './Charts/LineMarker'

export default {
  name: 'LineChart',
  components: { Chart },
  data() {
    return {
      chartType: 'temp',
      deviceId: ''
    }
  },
  created: function() {
    this.deviceId = this.$route.params.deviceId;
    if (this.deviceId === null || this.deviceId === undefined || this.deviceId === "") {
      this.$router.push("/404");
    }
  },
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
.el-select {
  background: #394056;
}
</style>