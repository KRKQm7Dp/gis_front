<style scoped>
.box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
<template>
  <div class='app-container'>
    <div class="box">
      <el-input style="width: 300px; margin-right: 10px;" v-model="queryParam.search" placeholder="请输入用户名执行搜索" clearable></el-input>
      <el-button type="primary" @click="getUsers">搜索一下</el-button>
      <el-button type="success" @click="handleAddUser">新建用户</el-button>
    </div>
    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="total"
      :page-size="queryParam.pageSize"
      @current-change="getUsers"
      :current-page.sync="queryParam.pageNum"
      style="margin-top:30px;">
    </el-pagination>
      <el-table
        :data="tableData"
        height="620"
        border
        v-loading="loading"
        style="width: 100%;margin-top:30px;">
         <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
        prop="uId"
        label="索引">
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
            <template v-if="scope.row.enabled">
              正常
            </template>
            <template v-else>
              已禁用
            </template>
          </template>
        </el-table-column>
        <el-table-column
        label="操作"
        align="center"
        width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit User':'New User'">
      <el-form ref="ruleForm" :rules="rules" :model="user" label-width="90px" label-position="left">
            <el-row :gutter="32">
                <el-col :span="12">
                    <el-form-item label="用户 ID"  prop="uLoginid">
                        <el-input v-model="user.uLoginid"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="uNickname">
                        <el-input v-model="user.uNickname"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="dialogType != 'edit'">
                    <el-form-item label="密　　码"  prop="uPassword">
                        <el-input v-model="user.uPassword" show-password></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-show="dialogType != 'edit'">
                    <el-form-item label="确认密码" prop="checkPassword">
                        <el-input v-model="user.checkPassword" show-password></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性　　别">
                        <el-radio-group v-model="user.uSex">
                            <el-radio :label="true">男</el-radio>
                            <el-radio :label="false">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="账号状态">
                        <el-switch v-model="user.enabled"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生　　日">
                        <el-date-picker type="date" placeholder="选择日期" v-model="user.uBirthday" style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邮　　箱" prop="uEmail">
                        <el-input v-model="user.uEmail"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="角　　色">
                        <el-select
                            v-model="user.roles"
                            value-key="id" 
                            change="changeValue"
                            multiple
                            placeholder="请选择">
                            <el-option
                              v-for="item in roles"
                              :key="item.id"
                              :label="item.roleName"
                              :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>  
        </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { getUserByPage, addUser, updateUser, deleteUser } from '@/api/user';
import { getRoles } from '@/api/role'
import router from '../../../router';

const defaultUser = {
  uId: '',
  uLoginid: '',
  uNickname: '',
  uPassword: '',
  uSex: '',
  enabled: '',
  uBirthday: '',
  uEmail: '',
  roles: [],
  checkPassword: ''
}

export default {
  data() {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.checkPassword !== '') {
            this.$refs.ruleForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.uPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      user: Object.assign({}, defaultUser),
      tableData: [],
      loading: true,
      queryParam:{
          pageNum: 1,
          pageSize: 10,
          search: '' 
      },
      total: 0,
      roles: [],
      dialogVisible: false,
      dialogType: 'new',
      rules: {
        uLoginid: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        uNickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        uEmail: [{ type: 'email', message: '格式不正确', trigger: 'blur' }],
        uPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
        checkPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
      },
      redirect: '/user/editUser'
    }
  },
  created() {
      this.getUsers()
      this.queryRoles()
  },
  methods:{
    getUsers(){
      this.loading = true
        console.log(this.queryParam)
        getUserByPage(this.queryParam).then(response => {
            this.tableData = response.data.data.rows
            this.total = response.data.data.total
            console.log('total=' + this.total)
            this.loading = false
        }).catch((e) => {
          console.log(e)
          Message({
            message: e.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    queryRoles(){
      getRoles(this.queryParam).then(response => {
        console.log('----------roles----------')
        console.log(response.data.data.rows)
        this.roles = response.data.data.rows
        for ( let item in this.roles){
          console.log(item)
        }
      }).catch((e) => {
        console.log(e)
          Message({
            message: e.message,
            type: 'error',
            duration: 5 * 1000
          })
      })
    },
    handleEdit(scope) {
      // console.log('修改用户的 id=' + id)
      // this.redirect = '/user/editUser'
      // this.$router.push({ path: this.redirect || '/' })
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.user = deepClone(scope.row)
    },
    handleDelete(scope) {
      this.$confirm('确定删除用户?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await deleteUser(scope.row.uId).then(response => {
            this.getUsers()
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          }).catch(e => {
            Message({
              message: e.message,
              type: 'error',
              duration: 5 * 1000
            })
          })
          
        })
        .catch(err => { console.error(err) })
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'
      console.log('-------------user------------')
      console.log(this.user)
      this.user.roles = this.user.roles.filter(Boolean)  // 当用户没有角色时候，授予其角色，去除其中的 null 值
      if (isEdit) {
        await updateUser(this.user.uId, this.user)
        this.getUsers()
        this.dialogVisible = false
      } else {
        console.log(this.user.uPassword + "--" + this.checkPassword)
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            console.log('submit!');
            console.log(this.user)
            addUser(this.user).then(response => {
              this.getUsers()
            }).catch(e => {
              Message({
                message: e.message,
                type: 'error',
                duration: 5 * 1000
              })
            })
            this.dialogVisible = false
            const { uLoginid, uNickname, uEmail } = this.user
            this.$notify({
              title: 'Success',
              dangerouslyUseHTMLString: true,
              message: `
                  <div>用户名: ${uLoginid}</div>
                  <div>昵　称: ${uNickname}</div>
                  <div>邮　箱: ${uEmail}</div>
                `,
              type: 'success'
            })
          } else {
            console.log('error submit!!');
            this.$refs['ruleForm'].resetFields();
            return false;
          }
        });
      }
      this.checkPassword = ''
    },
  }

}
</script>
