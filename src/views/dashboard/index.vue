<template>
  <div class="dashboard-container">
    <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
          :scroll-wheel-zoom="true"
        >
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="(item, i) in devices" 
              :key="i"
              :position="{lng: item.positionX, lat: item.positionY}" 
              :dragging="false" 
              @click="infoWindowOpen(item, i)"
              :icon="{url: require('../../icons/monitor_2.png'), size: {width: 48, height: 48}}"
              >
              <bm-info-window 
                :show="item.show"
                :title="'【'+ item.name +'】 设备信息'" 
                :closeOnClick="false"
                @close="infoWindowClose(item, i)" >
                <p>温度：{{ tempAndHum === null ? "获取温度失败" : tempAndHum.temp + "℃"}}</p>
                <p>湿度：{{ tempAndHum === null ? "获取温度失败" : tempAndHum.humidity + "%"}}</p>
                <p>设备状态：{{ item.status ? "在线" : "离线" }}<svg-icon icon-class="light_4"  class-name='light-svg' style="margin-left:10px;width: 20px;height:20px;fill:#1afa29 !important;" /></p>
                <p>获取数据时间：<br>{{ tempAndHum === null ? "获取时间失败" : tempAndHum.time }}</p>
                <p>设备接入时间：<br>{{ item.connTime }}</p>
              </bm-info-window>
            </bm-marker>
          </bml-marker-clusterer>
        </baidu-map>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dataTool } from 'echarts/lib/echarts'
import { deepClone } from "@/utils";
import store from "../../store";
import { getAllDevices } from "@/api/device";
import { getLastTempHumList } from "@/api/sensor"
import { BmlMarkerClusterer } from 'vue-baidu-map'

export default {
  components: {
    BmlMarkerClusterer
  },
  data(){
    return{
      center: { lng: 126.627938, lat: 45.715051 },
      zoom: 15,
      infoWindow: {
        show: false,
        contents: '暂无设备信息'
      },
      devices: [],
      tempAndHum: {
        temp: '',
        humidity: '',
        time: ''
      },
    }
  },
  created() {
    this.getDevices()
  },
  methods: {
    infoWindowClose (item, i) {
      console.log(item)
      this.$set(item, 'show',  false)
      this.$forceUpdate()
    },
    infoWindowOpen (item, i) {
      console.log(item)
      getLastTempHumList({'deviceId': item.id}).then(res => {
        this.tempAndHum = res.data.data
        console.log(this.tempAndHum)
        this.$set(item, 'show',  true)
        this.$forceUpdate()
      }).catch(e => {
        console.log(e)
      })
    },
    getDevices() {
      getAllDevices()
        .then(response => {
          this.devices = response.data.data
          var x = 0;
          var y = 0;
          this.devices.forEach(device => {
            device.show = false
            x += device.positionX
            y += device.positionY
          })
          this.center.lng = x/this.devices.length
          this.center.lat = y/this.devices.length
          console.log('================')
          console.log(this.devices)
        })
        .catch(e => {
          console.log(e);
          Message({
            message: e.message,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.bm-view {
  width: 100%;
  height: 800px;
}
</style>
