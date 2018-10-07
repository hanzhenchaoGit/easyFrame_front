<template>
    <div>
        <el-dialog :visible.sync="window" width="56%"  close-on-click-modal close-on-press-escape	>
            <el-form inline  ref="menu" :model="menu" label-width="120px"  label-position="left">
                <el-form-item prop="id" label="id">
                    <el-input v-model="menu.id" disabled></el-input>
                </el-form-item>
                <el-form-item prop="pid" label="上级" required>
                    <el-input v-model="menu.pid" disabled></el-input>
                </el-form-item>
                <el-form-item prop="name" label="路由名称" required>
                    <el-input v-model="menu.name"></el-input>
                </el-form-item>
                <el-form-item prop="label" label="路由显示标题" required>
                    <el-input v-model="menu.label"></el-input>
                </el-form-item>
                <el-form-item prop="icon" label="图标">
                    <el-input v-model="menu.icon"></el-input>
                </el-form-item>
                <el-form-item prop="path" label="路由路径" required>
                    <el-input v-model="menu.path"></el-input>
                </el-form-item>
                <el-form-item prop="component" label="组件路径" required>
                    <el-input v-model="menu.component"></el-input>
                </el-form-item>
                <el-form-item v-if="showPermissions" prop="permissions" label="页面权限" >
                  <common-select v-model="menu.permissions"
                  :data="permissions" multiple
                  :keyKey="permissionsvaluekey"
                  :nameKey="permissionsnameKey"
                  :valueKey="permissionsvaluekey"
                  :fields="permissionsfield" ></common-select>
                </el-form-item>
                <el-form-item>
                    <common-button type="primary" v-waves @click="save()">保存</common-button>
                    <common-button v-waves @click="window=false">取消</common-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="permissionWindow" width="30%"  close-on-click-modal close-on-press-escape	>
            <el-form  ref="permission" :model="permission" label-width="120px"  label-position="right">
                <el-form-item label="当前按钮权限">
                  <el-tag
                    :key="tag.pkey"
                    v-for="tag in permissions"
                    :disable-transitions="false"
                    >
                    [{{tag.pkey}}]{{tag.pname}}
                  </el-tag>
                </el-form-item>
                <el-form-item prop="pkey" label="权限英文Key" required>
                    <el-input v-model="permission.pkey"></el-input>
                </el-form-item>
                <el-form-item prop="pname" label="权限名称" required>
                    <el-input v-model="permission.pname"></el-input>
                </el-form-item>
                <el-form-item>
                    <common-button type="primary" v-waves @click="savePermission()">保存</common-button>
                    <common-button @click="window=false" v-waves>取消</common-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-card class="cardcontainer">
            <el-select v-model="role"  @change="changeRole" placeholder="请选择系统角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
            <common-button type="primary" v-waves v-has permission="add" @click="showAddPermission('permission','permissionWindow','permission')" >添加按钮权限字典</common-button>
            <el-tree
                :data="data" style="font-size:13px"
                ref="tree"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                check-strictly
               >
              <span slot-scope="{ node, data }" style="width:100%;font-size:13px;line-height:24px">
                <el-row v-if="data.id===0">
                  <el-col :span="4">
                  <svg-icon icon-class='folder'></svg-icon>
                    <span >{{node.label}}</span>
                  </el-col>
                  <el-col :span="4">
                    <common-button size='mini' v-waves type='text' @click='() => add(node, data)' >新增</common-button>
                  </el-col>
                </el-row>
                <el-row v-else>
                  <el-col :span="4">
                    <svg-icon v-if= "data.children.length>0" icon-class='folder'></svg-icon>
                    <svg-icon v-else icon-class='file'></svg-icon>
                    <span >{{node.label}}</span>
                  </el-col>
                  <el-col :span="4">
                    <common-button size='mini' v-waves type='text' @click='() => add(node, data)' >新增</common-button>
                    <common-button size='mini' v-waves type='text' @click='() => edit(node, data)' >编辑</common-button>
                    <common-button size='mini' v-waves type='text' @click='() => del(data)' >删除</common-button>
                  </el-col>
                  <el-col :span="11">
                    <el-checkbox-group  v-model="rolepermissions[data.path]" >
                      <el-checkbox v-for="per in data.permissionsArray" :label="per.pkey" :key="per.pkey">{{per.pname}}</el-checkbox>
                    </el-checkbox-group>
                  </el-col>
              </el-row>
              </span>

            </el-tree>
            <common-button type="primary" v-waves @click="saveRoleMenu">保存权限路由</common-button>
        </el-card>
    </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      permissions: [],
      window: false,
      permissionWindow: false,

      permission: {
        id: null,
        pkey: '',
        pname: ''
      },
      rolepermissions: {
      },
      permissionsvaluekey: 'pkey',
      permissionsnameKey: 'pname',
      permissionsfield: ['pname'],
      // 是否显示权限按钮修改
      showPermissions: false,
      menu: {
        id: null,
        pid: '',
        name: '',
        label: '',
        icon: '',
        path: '',
        component: '',
        permissions: []
      },
      roles: [],
      role: '',
      // 更新roleMenu的主键id
      roleMenuId: null,
      checkNodes: [],
      data: [{
        id: 0,
        label: '根路由',
        name: 'root',
        children: []
      }]
    }
  },
  mounted() {
    this.getData()
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    test(a, b, c) {
      console.log(a, b, c, '----------')
    },
    getPermissions() {
      request({
        url: '/user/getSysPermissionList'
      }).then(res => {
        this.permissions = res.data
      })
    },
    getRoles() {
      request({
        url: '/user/getSysRoleList'
      }).then(response => {
        this.roles = response.data
      })
    },
    changeRole(roleId) {
      const role = this.getCurrentRole(roleId)
      this.$refs.tree.setCheckedKeys(this.getCurrentRole(roleId).menuids.split(','))
      const nodes = this.$refs.tree.getCheckedNodes()
      const rolePermissions = role.permissions
      // 每次选择角色后重置角色权限对象
      this.rolepermissions = {}
      nodes.forEach(node => {
        if (node.children.length === 0) {
          this.$set(this.rolepermissions, node.path, [])
          if (rolePermissions !== '') {
            rolePermissions.split('::').forEach(pers => {
              if (node.path === pers.split(':')[0]) {
                this.rolepermissions[node.path] = pers.split(':')[1].split(',')
              }
            })
          }
        }
      })
    },
    getData() {
      request({
        url: '/system/getSysMenusList'
      }).then(response => {
        this.data[0].children = response.data
      })
    },
    add(node, data) {
      if (this.$refs.menu) {
        this.$refs.menu.resetFields()
      }
      this.setPermissionShow(node)
      this.setPid('add', node, data)
      this.window = true
    },
    setPermissionShow(node) {
      if (node.isLeaf) {
        this.showPermissions = true
      } else {
        this.showPermissions = false
      }
    },
    showAddPermission(form, formShowKey, obj) {
      this.showWindow(this, form, formShowKey, obj)
    },
    savePermission() {
      this.$refs['permission'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.permission)
          request({
            url: '/user/addSysPermission',
            method: 'post',
            data
          }).then(res => {
            this.returnMsg(this, res)
            this.getPermissions()
          })
        }
      })
    },
    getCurrentRole(id) {
      const roleInfo = this.roles.find(role => {
        if (role.id === id) {
          return role
        }
      })
      return roleInfo
    },
    saveRoleMenu() {
      if (this.role === '') {
        this.$Message({
          message: '请先选择需要修改权限的角色',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        let permissionStr = ''
        for (const key in this.rolepermissions) {
          if (this.rolepermissions[key].length > 0) {
            permissionStr += key + ':' + this.rolepermissions[key].toString() + '::'
          }
        }

        const data = {
          id: this.role,
          menuids: this.$refs.tree.getCheckedKeys().toString(),
          permissions: permissionStr
        }
        request({
          url: '/user/addSysRole',
          method: 'post',
          data
        }).then(response => {
          this.returnMsg(this, response)
          this.getRoles()
        })
      }
    },
    resetForm(form) {
      if (this.$refs[form]) {
        this.$refs[form].resetFields()
      }
    },
    save() {
      console.log('save')
      this.$refs['menu'].validate((valid) => {
        console.log(valid, 'va')
        if (valid) {
          const data = Object.assign({}, this.menu)
          console.log(this.menu.permissions, this.menu, 'me')
          if (this.menu.permissions.length > 0) {
            data.permissions = data.permissions.toString()
          } else {
            data.permissions = ''
          }
          data.pid = data.pid.split('-')[0]
          console.log(data)
          request({
            url: '/system/addSysMenus',
            method: 'post',
            data
          }).then(response => {
            this.returnMsg(this, response)
            this.getData()
          })
        } else {
          console.log('error submit!!')
        }
      })
    },
    setPid(type, node, data) {
      if (data.id !== 0 && type === 'add') {
        this.menu.pid = data.id + '-' + data.label
      } else if (data.id !== 0 && type === 'edit') {
        this.menu.pid = node.parent.data.id + '-' + node.parent.data.label
      } else if (data.id === 0 && type === 'add') {
        this.menu.pid = 0
      }
    },
    edit(node, data) {
      this.setPermissionShow(node)

      this.window = true
      setTimeout(() => {
        this.$refs['menu'].resetFields()
        this.menu = Object.assign({}, data)
        console.log(this.menu)
        if (this.menu.permissions && this.menu.permissions.length !== 0) {
          const pers = this.menu.permissions.split(',')
          if (this.menu.permissions !== '') {
            this.menu.permissions = pers
          } else {
            this.menu.permissions = []
          }
        } else {
          this.menu.permissions = []
        }
        this.setPid('edit', node, data)
      }, 1)
    },
    del(data) {
      this.$confirm('真的要删除这个菜单吗, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        request({
          url: '/system/delSysMenus',
          params: {
            id: data.id
          }
        }).then(response => {
          this.getData()
          this.returnMsg(this, response)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
