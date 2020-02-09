<template>
  <div class='app-container'>
      <el-table
        :data="tableData"
        height="250"
        border
        style="width: 100%">
        <el-table-column
        prop="uId"
        label="ID">
        </el-table-column>
        <el-table-column
        prop="uLoginid"
        label="用户名">
        </el-table-column>
        <el-table-column
        prop="uNickname"
        label="昵称">
        </el-table-column>
        <el-table-column
        prop="uNickname"
        label="角色">
        </el-table-column>
        <el-table-column
        prop="enabled"
        label="账号状态">
          <template slot-scope="scope">
            <template v-if="scope">
              正常
            </template>
            <template v-else>
              已禁用
            </template>
          </template>
        </el-table-column>
        <el-table-column
        prop="enabled"
        label="操作">
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserByPage } from '@/api/user';

export default {
    data() {
      return {
        tableData: [],
        queryParam:{
            pageNum: 1,
            pageSize: 10,
        }
      }
    },
    created() {
        console.log("----" + process.env.VUE_APP_BASE_API)
        this.getUsers()
    },
    methods:{
        getUsers(){
            getUserByPage(this.queryParam).then(response => {
                this.tableData = response.data.data.rows
            }).catch((e) => {
                console.log(e)
            })
        }
    }

  }
</script>
