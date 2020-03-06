<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
        >
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bm-marker :position="center" :dragging="true" @click="infoWindowOpen" animation="BMAP_ANIMATION_BOUNCE">
            <bm-info-window :show="infoWindow.show" title="设备信息" @close="infoWindowClose" @open="infoWindowOpen">
              <p v-text="infoWindow.contents"></p>
            </bm-info-window>
          </bm-marker>
        </baidu-map>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dataTool } from 'echarts/lib/echarts'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return{
      center: { lng: 126.627938, lat: 45.715051 },
      zoom: 15,
      infoWindow: {
        show: false,
        contents: '暂无设备信息'
      }
    }
  },
  methods: {
    infoWindowClose () {
      this.infoWindow.show = false
    },
    infoWindowOpen () {
      console.log("打开infowindow")
      this.infoWindow.show = true
    }
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
