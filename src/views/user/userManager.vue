<template>
  <div>
    <el-dialog :visible.sync="window" width="36%"  close-on-click-modal close-on-press-escape	>
      <el-form inline  ref="organization" :model="organization" label-width="120px"  label-position="left">
          <el-form-item prop="id" label="id">
              <el-input v-model="organization.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="pid" label="上级部门" required>
              <el-input v-model="organization.pid" disabled></el-input>
          </el-form-item>
          <el-form-item prop="label" label="部门名称" required>
              <el-input v-model="organization.label"></el-input>
          </el-form-item>
          <el-form-item prop="note" label="部门说明" required>
              <el-input v-model="organization.note"></el-input>
          </el-form-item>
          <el-form-item prop="order" label="顺序">
              <el-input v-model="organization.order"></el-input>
          </el-form-item>
          <el-form-item>
              <common-button type="primary" @click="saveOrg()">保存</common-button>
              <common-button @click="window=false">取消</common-button>
          </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="addWindow" width="45%"  close-on-click-modal close-on-press-escape	>
      <el-form inline  ref="form" :model="userForm" label-width="90px"  label-position="right" v-loading="loading.userFormLoading">
        <el-form-item prop="id" label="id">
          <el-input v-model="userForm.id" disabled :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户名" required>
          <el-input v-model="userForm.userName" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名" required>
          <el-input v-model="userForm.name" :style="{width:inputwidth}" ></el-input>
        </el-form-item>
        <el-form-item prop="organizationNames" label="部门" required>
          <el-tooltip class="item" effect="dark" :content="userForm.organizationNames" placement="top-start">
            <el-input v-model="userForm.organizationNames" :style="{width:inputwidth}" ></el-input>
          </el-tooltip>
          <common-button type="primary" @click="addDepart()">选择部门</common-button>
        </el-form-item>
        <el-form-item prop="duty" label="职务" required>
          <commonSelect :style="{width:inputwidth}"
            v-model="userForm.duty"
            :data="dutys">
          </commonSelect>
        </el-form-item>
        <el-form-item prop="group" label="业务组">
          <commonSelect
            v-model="userForm.group" :style="{width:inputwidth}"
            :data="groups">
          </commonSelect>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="userForm.mobile" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="座机">
          <el-input v-model="userForm.phone" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="fax" label="传真">
          <el-input v-model="userForm.fax" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="qq" label="qq">
          <el-input v-model="userForm.qq" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="msn" label="msn">
          <el-input v-model="userForm.msn" :style="{width:inputwidth}"></el-input>
        </el-form-item>
        <el-form-item prop="birthdate" label="生日" >
          <el-date-picker
            v-model="userForm.birthdate" :style="{width:inputwidth}"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="userEnable" label="是否可用" required>
          <el-select v-model="userForm.userEnable" :style="{width:inputwidth}">
            <el-option key="Y" label="是" value=1> </el-option>
            <el-option key="N" label="否" value=2> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <common-button type="primary" @click="saveuser()">保存</common-button>
          <common-button type="primary" @click="addWindow = false">取消</common-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="departWindow"  width="45%"  close-on-click-modal close-on-press-escape	>
      <el-card shadow="always" class="cardcontainer" style="height:45vh">
          <el-tree style="font-size:14px;"
            :data="data"
            ref="departTree"
            show-checkbox
            node-key="id"
            highlight-current
            :expand-on-click-node="false">
          </el-tree>
        </el-card>
        <div slot='footer'>
          <common-button type="primary" @click="saveUserDepart">保存</common-button>
          <common-button @click="departWindow=false">取消</common-button>
        </div>
    </el-dialog>
    <el-dialog title="用户角色" :visible.sync="rolesWindow" width="66%"  close-on-click-modal close-on-press-escape>
      <el-checkbox-group
        v-model="userRoles" >
        <el-checkbox v-for="role in roles" :label="role.id" :key="role.id">{{role.roleName}}</el-checkbox>
      </el-checkbox-group>
      <div slot='footer'>
        <common-button type="primary" @click="saveUserRoles">保存</common-button>
        <common-button @click="rolesWindow=false">取消</common-button>
      </div>
    </el-dialog>
    <el-row :gutter="8">
      <el-col :span="8">
        <el-card shadow="always" class="cardcontainer" v-loading="loading.orgLoading">
          <el-tree style="font-size:14px;"
            :data="data"
            ref="tree"
            node-key="id"
            @node-click="treeNodeClick"
            highlight-currentight-current
            :expand-on-click-node="false"
            check-strictly
            :render-content="renderContent">
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <common-table ref="table" height="72vh" :url="url" :columns="columns" @select-all="handlerCheck" @select="handlerCheck" fit>
          <template slot-scope="scope" slot="topbutton">
            <common-button  type="primary" @click="handleAdd('form','addWindow')" v-has permission="add">添加用户</common-button>
            <common-button  type="primary" @click="disableUsers" v-has permission="disableuser">禁用用户</common-button>
            <common-button  type="primary" @click="resetPassword" v-has permission="resetpwd">重置密码</common-button>
          </template>
          <template slot-scope="scope" slot="edit">
              <common-button
                 v-has permission="edit"
                @click="handleEdit(scope.$index, scope.row)">修改</common-button>
              <common-button  type="danger" slot="reference" @click="handleEditUserRole(scope.row)" v-has permission="editrole">角色分配</common-button>
          </template>
          <template slot-scope="scope" slot="roleName">
              <el-tag :key="role.id" v-for="role in scope.row.roles">{{role.roleName}}</el-tag>
          </template>
        </common-table>
      </el-col>
    </el-row>
    </div>
  </template>
<script>
import request from '@/utils/request'
import Sticky from '@/components/Sticky'
import Select from '@/components/Select'
export default {
  components: { Sticky, commonSelect: Select },
  data() {
    return {
      loading: {
        userFormLoading: false,
        orgLoading: false
      },
      window: false,
      organization: {},
      addWindow: false,
      departWindow: false,
      isAdd: true,
      inputwidth: '150px',
      rolesWindow: false,
      // 当前修改角色的用户id
      editUserId: '',
      // 当前选中的部门id
      currentOrg: '',
      userRoles: [],
      operusers: [],
      userForm: {},
      dutys: [
        {
          name: '员工',
          value: '1'
        },
        {
          name: '部门管理',
          value: '2'
        },
        {
          name: '公司管理',
          value: '3'
        }
      ],
      groups: [
        {
          name: 'A组',
          value: 'A'
        },
        {
          name: 'B组',
          value: 'B'
        },
        {
          name: 'C组',
          value: 'C'
        }
      ],
      simpleFields: ['name'],
      roles: [],
      url: '/user/getSysUserByOrgPager',
      columns: [
        { colType: 'selection' },
        { prop: 'userName', label: '用户名', width: 130 },
        { prop: 'name', label: '姓名', width: 100 },
        { prop: 'dutyName', label: '职务', width: 120 },
        { prop: 'group', label: '业务组', width: 100 },
        { prop: 'mobile', label: '手机', width: 140 },
        { prop: 'userEnable', label: '是否可用' },
        { label: '操作', slotName: 'edit', width: 200 }
      ],
      checkNodes: [],
      data: [
        {
          // id: 0,
          // label: '联盟创新检测服务平台',
          // name: 'root',
          // children: []
        }
      ]
    }
  },
  mounted() {
    this.getRoles()
    this.getData()
  },
  methods: {
    getData() {
      this.loading.orgLoading = true
      request({
        url: '/system/getAllOrgs'
      }).then(response => {
        // this.data[0].children = response.data
        this.data = response.data
        this.loading.orgLoading = false
      })
    },
    getRoles() {
      request({
        url: '/user/getSysRoleList',
        method: 'get'
      }).then(response => {
        this.roles = response.data
      })
    },

    handleAdd(form, formShowKey) {
      this.isAdd = true
      this.resetFormAndShow(this, form, formShowKey, 'userForm')
    },
    handleDel(r) {
      request({
        url: '/user/delSysUser',
        method: 'get',
        params: {
          id: r.id
        }
      }).then(response => {
        this.roles = response.data
      })
    },
    saveOrg() {
      this.$refs['organization'].validate(valid => {
        const data = this.organization
        if (valid) {
          request({
            url: '/system/addSysOrganizational',
            method: 'post',
            data
          }).then(response => {
            this.returnMsg(this, response)
            this.getData()
          })
        } else {
          return false
        }
      })
    },
    saveuser() {
      this.$refs['form'].validate(valid => {
        const data = Object.assign({}, this.userForm)
        if (valid) {
          this.loading.userFormLoading = true
          request({
            url: '/user/addSysUser',
            method: 'post',
            data
          }).then(response => {
            this.loading.userFormLoading = false
            this.returnMsg(this, response)
            this.$refs.table.fetchHandler()
          })
        } else {
          return false
        }
      })
    },
    handleEdit(index, row) {
      this['addWindow'] = true
      setTimeout(() => {
        this.$refs['form'].resetFields()
        this['userForm'] = {}
        this['userForm'] = Object.assign({}, row)
        this.userForm.roleIds = this.userForm.roles.map(role => {
          return role.id
        })
      }, 1)
    },
    handleEditUserRole(row) {
      this.rolesWindow = true
      this.editUserId = row.id
      console.log(this.editUserId, 'userid')
      this.userRoles = row.roles.map(r => {
        return r.id
      })
    },
    saveUserRoles(row) {
      if (this.userRoles.length !== 0) {
        const data = []
        this.userRoles.forEach(roleId =>
          data.push({
            userId: this.editUserId,
            roleId: roleId
          })
        )
        request({
          url: '/user/addSysUserRoles',
          method: 'post',
          data
        }).then(response => {
          this.returnMsg(this, response)
          this.$refs.table.fetchHandler()
        })
      }
    },
    treeNodeClick(data, node, el) {
      // if (node.isLeaf) {
      this.currentOrg = node.data.id
      this.$refs.table.fetchHandler({ organization: node.data.id })
      // }
    },
    // 删除组织
    del(data) {
      request({
        url: '/system/delSysOrganizational',
        params: {
          id: data.id
        }
      }).then(response => {
        this.getData()
      })
    },
    handlerCheck(select, row) {
      this.operusers = Object.assign([], select)
    },
    disableUsers() {
      if (this.operusers.length === 0) {
        this.$Message({
          message: '请先勾选要禁用的用户',
          type: 'warning'
        })
      } else {
        request({
          url: '/user/operate/disable',
          params: {
            userids: this.operusers
              .map(u => {
                return u.id
              })
              .toString()
          }
        }).then(response => {
          this.returnMsg(this, response)
        })
      }
    },
    resetPassword() {
      if (this.operusers.length === 0) {
        this.$Message({
          message: '请先勾选要重置的用户',
          type: 'warning'
        })
      } else {
        request({
          url: '/user/operate/resetpwd',
          params: {
            userids: this.operusers
              .map(u => {
                return u.id
              })
              .toString()
          }
        }).then(response => {
          this.returnMsg(this, response)
        })
      }
    },
    edit(node, data) {
      this.organization = Object.assign({}, data)
      this.setPid('edit', node, data)
      this.window = true
    },
    setPid(type, node, data) {
      if (data.id !== 0 && type === 'add') {
        this.organization['pid'] = data.id
      } else if (data.id !== 0 && type === 'edit') {
        this.organization['pid'] = node.parent.data.id
      } else if (data.id === 0 && type === 'add') {
        this.organization['pid'] = 0
      }
    },
    add(node, data) {
      this.window = true
      setTimeout(() => {
        this.$refs.organization.resetFields()
        this.organization = {}
        this.setPid('add', node, data)
      }, 1)
    },
    // 选择用户对应部门
    addDepart() {
      this.departWindow = true
      setTimeout(() => {
        this.$refs.departTree.setCheckedKeys(
          this.userForm.organization !== ''
            ? this.userForm.organization.split(',').map(Number)
            : []
        )
      }, 1)
    },
    // 保存用户部门
    saveUserDepart() {
      const checkDeparts = this.$refs.departTree.getCheckedNodes()
      let hasLeaf = false
      // 选中节点中可提交的叶子节点
      const commitDepartsIds = []
      const commitDepartsNames = []
      if (checkDeparts.length > 0) {
        checkDeparts.forEach(depart => {
          if (depart.children.length === 0) {
            hasLeaf = true
            console.log(depart, 'depart')
            commitDepartsIds.push(depart.id)
            commitDepartsNames.push(depart.label)
          }
        })
        this.userForm.organization = commitDepartsIds.toString()
        this.userForm.organizationNames = commitDepartsNames.toString()
        this.departWindow = false
      }
      if (checkDeparts.length === 0 || !hasLeaf) {
        this.$Message({
          message: '请选择部门,并且请选择最后一级',
          type: 'warning'
        })
      }
    },
    renderContent(h, { node, data, store }) {
      if (data.id === 0) {
        return (
          <span class='custom-tree-node'>
            <span>
              <svg-icon icon-class='folder' />
              <span>{node.label}</span>
            </span>
          </span>
        )
      } else {
        return (
          <span class='custom-tree-node'>
            <span>
              {data.children && data.children.length > 0 ? (
                <svg-icon icon-class='folder' />
              ) : (
                <svg-icon icon-class='file' />
              )}
              <span>{node.label}</span>
              {this.$store.getters.roles
                .map(role => role.roleKey)
                .indexOf('admin') > -1 ? (
                  <span>
                    <el-button
                      size='mini'
                      type='text'
                      on-click={() => this.add(node, data)}
                    >
                    添加
                    </el-button>
                    <el-button
                      size='mini'
                      type='text'
                      on-click={() => this.del(data)}
                    >
                    删除
                    </el-button>
                  </span>
                ) : (
                  ''
                )}
            </span>
          </span>
        )
      }
    }
  }
}
</script>
