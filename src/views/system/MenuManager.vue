<template>
    <div>
    <el-dialog :visible.sync="window" width="56%"  close-on-click-modal close-on-press-escape	>
      <el-form ref="menu" :model="menu" label-width="120px"  label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="mtype" label="功能类型">
              <common-select disabled :data="mtypeOption" v-model="menu.mtype"></common-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="label" label="功能名称">
              <el-input v-model="menu.label" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="pidName" label="上级">
              <el-input v-model="menu.pidName" style="width: 100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="path" label="url">
              <el-input v-model="menu.path" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="menu.mtype!=='button'">
            <el-form-item prop="name" label="路由名称">
              <el-input v-model="menu.name" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="menu.mtype!=='button'">
            <el-form-item prop="icon" label="图标">
              <el-input v-model="menu.icon" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="menu.mtype!=='button'">
            <el-form-item prop="component" label="组件路径">
              <el-input v-model="menu.component" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="isshow" label="是否显示">
              <common-select v-model="menu.isshow"  style="width: 100%" placeholder="是否显示">
                <el-option key="Y" label="是" value="Y"> </el-option>
                <el-option key="N" label="否" value="N"> </el-option>
              </common-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <common-button type="primary" @click="save()">保存</common-button>
        <common-button @click="window=false">取消</common-button>
      </span>
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
    <el-row>
      <el-col :span="8">
        <el-card class="cardcontainer">
          <common-button type="primary" v-waves v-has permission="add" @click="showAddPermission('permission','permissionWindow','permission')" >添加按钮权限字典</common-button>
          <el-tree
              :data="data" style="font-size:13px"
              ref="tree"
              highlight-current
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              check-strictly
              @node-click="onNodeClick"
              >
            </el-tree>
          </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="cardcontainer">
          <el-row>
            <el-col :span="24">
              <common-button v-bind:disabled="selectedData.mtype === 'button'" @click="onAddMenu">新增</common-button>
              <common-button v-bind:disabled="!selectedData.id" @click="onEditMenu">修改</common-button>
              <common-button v-bind:disabled="!selectedData.id" @click="onDel">删除</common-button>
            </el-col>
          </el-row>
          <el-row style="padding-top: 20px">
            <el-col :span="24">
              <el-form ref="currentMenu" :model="selectedData" label-width="8 0px"  label-position="right">
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="mtype" label="功能类型">
                      <el-select v-model="selectedData.mtype"  style="width: 100%" disabled placeholder="请选择功能类型">
                        <el-option key="1" label="功能模块" value="module"> </el-option>
                        <el-option key="2" label="功能页面" value="page"> </el-option>
                        <el-option key="3" label="功能按钮" value="button"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="label" label="功能名称">
                      <el-input v-model="selectedData.label" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="pidName" label="上级">
                      <el-input v-model="selectedData.pidName" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="path" label="url">
                      <el-input v-model="selectedData.path" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="name" label="路由名称">
                      <el-input v-model="selectedData.name" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="icon" label="图标">
                      <el-input v-model="selectedData.icon" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="component" label="组件路径">
                      <el-input v-model="selectedData.component" style="width: 100%" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="isshow" label="是否显示">
                      <common-select v-model="selectedData.isshow"  style="width: 100%" disabled placeholder="是否显示">
                        <el-option key="Y" label="是" value="Y"> </el-option>
                        <el-option key="N" label="否" value="N"> </el-option>
                      </common-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      mtypeOption: [
        { name: '功能模块', value: 'module' },
        { name: '功能页面', value: 'page' },
        { name: '功能按钮', value: 'button' }
      ],
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
      menu: {},
      roles: [],
      role: '',
      // 更新roleMenu的主键id
      roleMenuId: null,
      checkNodes: [],
      data: [{
        id: 0,
        label: '根路由',
        name: 'root',
        mtype: 'root',
        children: []
      }],
      selectedData: {}
    }
  },
  mounted() {
    this.getData()
    this.getRoles()
    this.getPermissions()
  },
  computed: {

  },
  methods: {
    getPermissions() {
      request({
        url: '/user/getSysPermissionList',
        method: 'post'
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
      this.$refs['menu'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.menu)
          this.$request({
            url: '/system/addSysMenus',
            method: 'post',
            data
          }).then(response => {
            this.window = false
            this.returnMsg(this, response)
            this.getData()
          })
        } else {
          console.log('error submit!!')
        }
      })
    },
    onDel() {
      this.$confirm('真的要删除这个菜单吗, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$request({
          url: '/system/delSysMenus',
          params: {
            id: this.selectedData.id
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
    },
    onNodeClick(data, node, cnode) {
      this.selectedData = Object.assign({}, data)
      this.menu = Object.assign({}, data)
      const tree = this.$refs.tree
      const parent = tree.getNode(tree.getCurrentNode().id).parent
      this.selectedData.pid = tree.getCurrentNode().id
      this.selectedData.pidName = parent.label
    },
    onAddMenu() {
      this.window = true
      this.$nextTick(() => {
        this.menu = {}
        this.$refs.menu.resetFields()
        const tree = this.$refs.tree
        const parent = tree.getNode(tree.getCurrentNode().id).parent
        this.menu.pidName = parent.label
        this.menu.pid = tree.getCurrentNode().id
        const node = tree.getNode(tree.getCurrentNode().id)
        if (node.data.mtype === 'root') {
          this.menu.mtype = 'module'
        } else if (node.data.mtype === 'module') {
          this.menu.mtype = 'page'
        } else {
          this.menu.mtype = 'button'
        }
      })
    },
    onEditMenu() {
      this.menu = Object.assign({}, this.$refs.tree.getCurrentNode())
      this.window = true
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
