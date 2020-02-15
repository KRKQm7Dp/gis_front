<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border v-loading="loading">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column label="角色 ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="描　述">
        <template slot-scope="scope">
          {{ scope.row.roleDesc }}
        </template>
      </el-table-column>
      <el-table-column label="操　作" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名">
          <el-input v-model="role.roleName" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="描　述">
          <el-input
            v-model="role.roleDesc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="路　由">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  id: '',
  roleName: '',
  roleDesc: '',
  routes: [],
  permissionIds: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      loading: true,
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      params: {
        pageNum: 1,
        pageSize: 10,
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      getRoutes().then(response => {
        this.serviceRoutes = response.data.data
        this.routes = this.generateRoutes(response.data.data)
        console.log('============routes=================')
        console.log(this.routes)
      }).catch(e => {
        this.$message({
          message: '获取路由出错: ' + e.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },
    async getRoles() {
      getRoles(this.params).then(response => {
        this.rolesList = response.data.data.rows
        this.loading = false
      }).catch(e => {
        this.$message({
          message: '查询角色失败: ' + e.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
    },

    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        if(route.children === null){
          delete route.children
        }
        if (route.hidden) { continue }
        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          id: route.id,
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title
        }

        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      console.log('=================handleAddRole==================')
      console.log(this.role)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      console.log('------------handleEdit------------')
      console.log(scope.row)
      this.role = deepClone(scope.row)
      console.log(this.role.permissionIds)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.role.permissionIds)
        this.checkStrictly = false
      })
    },
    handleDelete(scope) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
      .then(async() => {
          console.log('----------------row-------------------')
          console.log(scope.row)
          await deleteRole(scope.row.id).then(response => {
            this.getRoles()
            this.$message({
              type: 'success',
              message: response.data.data
            })
          }).catch(e => {
            this.$message({
              message: e.message,
              type: 'error',
              duration: 5 * 1000
            })
          })
        })
        .catch(err => {
          console.error(err) 
          this.$message({
            type: 'error',
            message: 'Delete failed!'
          })
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        this.role.permissionIds = this.$refs.tree.getCheckedKeys()
        await updateRole(this.role.id, this.role)
      } else {
        console.log('============addRole===============')
        console.log(this.role)
        this.role.permissionIds = this.$refs.tree.getCheckedKeys()
        const { data } = await addRole(this.role)
        console.log(data)
        this.role.id = data.data.id
        this.rolesList.push(data.data)
      }
      this.getRoles()
      const { id, roleName, roleDesc } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>角色 ID: ${id}</div>
            <div>角色名: ${roleName}</div>
            <div>描　述: ${roleDesc}</div>
          `,
        type: 'success'
      })
    },
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, noShowingChildren: true } //, path: ''
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
