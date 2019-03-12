<template>
  <div>
    <el-dialog :visible.sync="role.visible.addVisible"  close-on-click-modal close-on-press-escape	right width="30%">
      <el-form  ref="roleForm" :model="role.entity" :rules="role.rules" label-width="90px"  label-position="right">
        <el-form-item prop="roleName" label="角色名称" >
          <el-input v-model="role.entity.roleName" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item prop="roleNote" label="备注" >
          <el-input v-model="role.entity.roleNote" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <common-button type="primary" :loading="role.loading.addLoading" @click="onSubmitRole">保存</common-button>
        <common-button type="primary" @click="role.visible.addVisible = false">取消</common-button>
      </span>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div slot="header" class="clearfix">
            <span>角色列表</span>
          </div>
          <common-button @click="onAddRole">添加</common-button>
          <common-button v-bind:disabled="role.table.selected===0" @click="onEditRole">修改</common-button>
          <common-button v-bind:disabled="role.table.selected===0" type="danger" @click="onDelRole" >删除</common-button>
          <ag-table
            ref="roleTable"
            :url="role.table.url"
            :columnDefs="role.table.columnDefs"
            rowSelection="single"
            @onSelect="onSelectRole" @loadDone="onLoadDone" ></ag-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <span>角色权限</span>
          </div>
          <el-tree
            :data="tree.data"
            style="font-size:13px"
            ref="tree"
            node-key="id"
            v-bind:show-checkbox="role.table.selected.length === 1"
            default-expand-all
            :expand-on-click-node="false"
            >
          </el-tree>
          <el-row>
            <el-col :span="24">
              <common-button type="primary" v-bind:disabled="role.table.selected.length === 0" @click="onSubmitRoleMenus">保存角色权限</common-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        role: {
          visible: {
            addVisible: false
          },
          loading: {
            addLoading: false
          },
          entity: {
            roleName: '',
            roleNote: ''
          },
          rules: {
            roleName: { required: true, message: '请输入角色名称' }
          },
          table: {
            url: '/user/getRoleList',
            columnDefs: [
              { headerName: '序号', pinned: 'left',
                cellRenderer: (params) => Number(params.node.id) + 1,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true },
              { headerName: '角色名称', field: 'roleName' }
            ],
            selected: []
          }
        },
        tree: {
          data: []
        }
      }
    },
    mounted() {
      this.getTreeData()
    },
    methods: {
      getTreeData() {
        this.$request({
          url: '/system/getSysMenusList'
        }).then(response => {
          this.tree.data = response.data
        })
      },
      onSelectRole(selected, api) {
        console.log('tag', selected)
        if (selected.length > 0) {
          this.role.table.selected = selected
          if (selected[0].menuids) {
            this.$refs.tree.setCheckedKeys(selected[0].menuids.split(','))
          }
        } else {
          this.role.table.selected = []
          this.$refs.tree.setCheckedKeys([])
        }
      },
      onSubmitRoleMenus() {
        const checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
        if (checkedNodes.length === 0) {
          this.$message({
            type: 'error',
            message: '您未勾选任何菜单权限'
          })
          return
        }
        const menuids = checkedNodes.map(node => {
          return node.id
        }).toString()
        const permissions = checkedNodes.filter(node => node.mtype === 'button').map(node => { return node.path }).toString()
        const data = {
          id: this.role.table.selected[0].id,
          menuids,
          permissions
        }
        this.$request({
          url: '/user/addSysRole',
          method: 'post',
          data
        }).then(response => {
          this.$refs.roleTable.fetchHandler()
          this.returnMsg(this, response)
        })
      },
      onLoadDone(response) {
        if (this.role.table.selected.length === 1) {
          this.$nextTick(() => {
            this.$refs.roleTable.gridApi.getRowNode(this.role.table.selected[0].id).setSelected(true)
          })
        }
      },
      onAddRole() {
        this.role.visible.addVisible = true
        this.$nextTick(() => {
          this.$refs.roleForm.resetFields()
        })
      },
      onEditRole() {
        this.role.visible.addVisible = true
        this.$nextTick(() => {
          this.$refs.roleForm.resetFields()
          this.role.entity = Object.assign({}, this.role.table.selected[0])
        })
      },
      onSubmitRole() {
        const data = Object.assign({}, this.role.entity)
        this.$refs.roleForm.validate(valid => {
          if (!valid) { return }
          this.role.loading.addLoading = true
          this.$request({
            url: '/user/addSysRole',
            method: 'post',
            data
          }).then(res => {
            this.role.loading.addLoading = false
            this.role.visible.addVisible = false
            this.returnMsg(this, res)
            this.$refs.roleTable.fetchHandler()
          })
        })
      },
      onDelRole() {
        this.$confirm('此操作将删除此角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const data = Object.assign({}, this.role.table.selected[0])
          this.$request({
            url: '/user/delSysRole',
            method: 'post',
            data
          }).then(res => {
            this.$refs.roleTable.fetchHandler()
            this.$message({
              type: 'success',
              message: res.msg
            })
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

<style scoped>

</style>
