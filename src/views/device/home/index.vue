<style scoped>
.box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.bm-view {
  width: 100%;
  height: 200px;
}
.editor-container{
  position: relative;
  height: 100%;
}
</style>
<template>
  <div class="app-container">
    <div class="box">
      <el-input
        style="width: 300px; margin-right: 10px;"
        v-model="queryParam.search"
        placeholder="请输入用户名执行搜索"
      ></el-input>
      <el-button type="primary" @click="getDevices">搜索一下</el-button>
      <el-button type="success" @click="handleAddDevice">添加设备</el-button>
    </div>
    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="total"
      :page-size="queryParam.pageSize"
      @current-change="getDevices"
      :current-page.sync="queryParam.pageNum"
      style="margin-top:30px;"
    ></el-pagination>
    <el-table
      :data="tableData"
      height="620"
      border
      v-loading="loading"
      style="width: 100%;margin-top:30px;"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="id" label="索引"></el-table-column>
      <el-table-column prop="name" label="设备名"></el-table-column>
      <el-table-column prop="describe" label="设备描述"></el-table-column>
      <el-table-column prop="status" label="设备状态">
        <template slot-scope="scope">
          <template v-if="scope.row.status">在线</template>
          <template v-else>离线</template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'Edit Device':'New Device'"
    >
      <el-form ref="ruleForm" :model="device" label-width="60px" label-position="left">
        <el-row :gutter="32">
          <el-col :span="24">
            <el-form-item label="设备名" prop="name">
              <el-input v-model="device.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描　述" prop="describe">
              <el-input v-model="device.describe"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="dialogType==='edit'">
            <el-form-item label="经　度" prop="positionX">
              <el-input v-model="device.positionX" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="dialogType==='edit'">
            <el-form-item label="纬　度" prop="positionY">
              <el-input v-model="device.positionY" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div
          style="font-weight: 700;
            text-align: left;
            font-size: 14px;
            color: #606266;
            line-height: 40px;
            padding: 0 12px 0 0;"
         v-show="dialogType==='edit'"
        >手动校正设备定位（定位优先以设备自动检测为准，请谨慎修改!）</div>
        <baidu-map class="bm-view"  v-show="dialogType==='edit'" :center="center" :zoom="zoom" @ready="BaiduMapReadyHandler" @click="BaiduMapClickHandler">
          <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
          <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
          <bm-geolocation
            anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
            :showAddressBar="true"
            :autoLocation="true"
          ></bm-geolocation>
          <bm-marker
            :position="center"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
          >
          </bm-marker>
        </baidu-map>
      </el-form>
      <div style="text-align:right;margin-top: 20px;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

     <el-dialog
      :visible.sync="showConfigJson"
    >
    <div class="editor-container">
      <json-editor v-model="configValue" />
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import store from '../../../store'
import {
  getDeviceByPage,
  addDevice,
  updateDevice,
  deleteDevice
} from "@/api/device";

const defaultDevice = {
  id: "",
  name: "",
  describe: "",
  status: "",
  positionX: "",
  positionY: "",
  connTime: "",
  userId: ""
};

export default {
  data() {
    return {
      mapIcon: require("@/icons/monitor.png"),
      devicePositionShow: false,
      center: { lng: 0, lat: 0 },
      zoom: 3,
      device: Object.assign({}, defaultDevice),
      tableData: [],
      loading: true,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        search: ""
      },
      total: 0,
      devices: [],
      dialogVisible: false,
      dialogType: "new",
      showConfigJson: false,
      configValue:'',
    };
  },
  created() {
    this.getDevices();
  },
  methods: {
    BaiduMapClickHandler({type, target, point, pixel, overlay}){
        console.log("鼠标单击地图")
        console.log(type, target, point, pixel, overlay)
        console.log("当前定位: x=" + point.lng + " y=" + point.lat)
        this.center = point
        this.device.positionX = point.lng
        this.device.positionY = point.lat
    },
    BaiduMapReadyHandler({ BMap, map }) {
        map.enableScrollWheelZoom()
      console.log(BMap, map);
      this.center.lng = this.device.positionX;
      this.center.lat = this.device.positionY;
      this.zoom = 15;
    },
    getDevices() {
      this.loading = true;
      console.log(this.queryParam);
      getDeviceByPage(this.queryParam)
        .then(response => {
          this.tableData = response.data.data.rows;
          this.total = response.data.data.total;
          console.log("total=" + this.total);
          this.loading = false;
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
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.device = deepClone(scope.row);
      this.center.lng = this.device.positionX;
      this.center.lat = this.device.positionY;
    },
    handleDelete(scope) {
      this.$confirm(
        "注意：删除此设备的同时会清空其采集到的的信息，确定删除此设备？",
        "Warning",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          await deleteDevice(scope.row.id)
            .then(response => {
              this.getDevices();
              this.$message({
                type: "success",
                message: "Delete succed!"
              });
            })
            .catch(e => {
              Message({
                message: e.message,
                type: "error",
                duration: 5 * 1000
              });
            });
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleAddDevice() {
      this.device = Object.assign({}, defaultDevice)
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    async confirmUser() {
      const isEdit = this.dialogType === "edit";
      console.log("-------------device------------")
      console.log(this.device);
      if (isEdit) {
        await updateDevice(this.device);
        this.getDevices();
        this.dialogVisible = false
      } else {
        console.log("submit!");
        console.log(this.device);
        this.device.status = false
        this.device.userId = store.getters.name
        addDevice(this.device)
          .then(response => {
            this.getDevices();
            this.showConfigJson = true
            this.configValue = response
          })
          .catch(e => {
            Message({
              message: e.message,
              type: "error",
              duration: 5 * 1000
            });
          });
        this.dialogVisible = false;
        const { id, name, describe } = this.device;
        this.$notify({
          title: "Success",
          dangerouslyUseHTMLString: true,
          message: `
                    <div>设备号: ${id}</div>
                    <div>设备名: ${name}</div>
                    <div>描　述: ${describe}</div>
                `,
          type: "success"
        });
      }
    }
  }
};
</script>
