<template>
  <div>
    <el-card>
      <el-dialog :visible.sync="addWindow" width="40%"  close-on-click-modal close-on-press-escape>
        <el-form inline  ref="form" :model="taskForm" label-width="120px"  label-position="left">
          <el-form-item prop="id" label="id">
            <el-input v-model="taskForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="taskName" label="作业名" required>
            <el-input v-model="taskForm.taskName"></el-input>
          </el-form-item>
          <el-form-item prop="taskGroup" label="作业组" required>
            <el-input v-model="taskForm.taskGroup"></el-input>
          </el-form-item>
          <el-form-item prop="description" label="作业描述" required>
            <el-input v-model="taskForm.description"></el-input>
          </el-form-item>
          <el-form-item prop="corn" label="corn表达式" required>
            <el-input v-model="taskForm.corn"></el-input>
          </el-form-item>
          <el-form-item prop="jobClass" label="作业类" required>
            <el-input v-model="taskForm.jobClass"></el-input>
          </el-form-item>
          <el-form-item prop="enabled" label="是否可用" required>
            <el-select v-model="taskForm.enabled">
              <el-option key="Y" label="可用" value="Y" ></el-option>
              <el-option key="N" label="不可用" value="N" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <common-button type="primary" @click="save()">保存</common-button>
            <common-button type="primary" >重置</common-button>
            <common-button type="primary" @click="addWindow = false">取消</common-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="作业日志" :visible.sync="window.logWindow" width="50%"  close-on-click-modal close-on-press-escape>
        <common-table ref="logTable" :url="table.log.url" method="post" :columns="table.log.columns"></common-table>
      </el-dialog>

      <common-table
        ref="table"
        :url="table.task.url"
        method="post"
        :columns="table.task.columns"
        fit
        autoLoad
        :formOptions="table.task.formOptions"
        @select="handleSelect" >
        <template slot-scope="scope" slot="edit">
          <common-button
            @click="handleEdit(scope.$index, scope.row)">编辑</common-button>
          <common-button
            type="danger"
            @click="hanleDel(scope.row)">删除</common-button>
          <common-button iconSvg="log" @click="showLogs(scope.row)"> 日志</common-button>
        </template>
        <template slot-scope="scope" slot="state">
          <el-tag type="success" v-if="scope.row.state==='NORMAL'">NORMAL</el-tag>
          <el-tag type="warning" v-if="scope.row.state==='PAUSED'">PAUSED</el-tag>
          <el-tag type="info"  v-if="scope.row.state==='NONE'">NONE</el-tag>
        </template>
        <template slot-scope="scope" slot="buttons">
          <common-button  type="primary" @click="handleAdd('form','addWindow')">新增</common-button>
          <common-button  type="primary" @click="excuteOperate('add')">加入任务池</common-button>
          <common-button  type="primary" @click="excuteOperate('remove')">从任务池中移除</common-button>
          <common-button  type="primary" @click="excuteOperate('pause')">暂停</common-button>
          <common-button  type="primary" @click="excuteOperate('resume')">恢复</common-button>
          <common-button  type="primary" @click="excuteOperate('pauseAll')">暂停所有</common-button>
          <common-button  type="primary" @click="excuteOperate('resumeAll')">恢复所有</common-button>
        </template>
      </common-table>
      </el-card>
    </div>
  </template>

<script>
 import request from '@/utils/request'
 export default {
   data() {
     return {
       window: {
         logWindow: false
       },
       addWindow: false,
       taskForm: {
         id: null,
         taskName: '',
         taskGroup: '',
         description: '',
         corn: '',
         jobClass: '',
         createtime: '',
         createuserid: '',
         updatetime: '',
         updateuserid: '',
         enabled: ''
       },
       taskList: [],
       table: {
         task: {
           url: '/system/getSysTaskByPager',
           formOptions: {
             inline: true,
             showResetBtn: true,
             showSearchBtn: true,
             submitBtnText: '查询',
             resetBtnText: '重置',
             forms: [
               { prop: 'name', label: '作业名称' }
             ]
           },
           columns: [{ colType: 'selection' },
             { prop: 'taskName', label: '作业名称' },
             { prop: 'taskGroup', label: '作业组', width: 120 },
             { prop: 'description', label: '描述', showOverflowTooltip: true },
             { prop: 'corn', label: 'corn表达式', width: 120 },
             { prop: 'jobClass', label: '作业类', showOverflowTooltip: true },
             { slotName: 'state', label: '作业状态', width: 100 },
             //  { prop: 'createuserid', label: '创建人' },
             //  { prop: 'updatetime', label: '更新时间' },
             //  { prop: 'updateuserid', label: '更新人' },
             { prop: 'enabled', label: '是否可用', width: 100 },
             { label: '操作', slotName: 'edit' }]
         },
         log: {
           url: '/system/getQuartzLogs',
           columns: [
             { prop: 'jstarttime', label: '开始时间' },
             { prop: 'jendtime', label: '结束时间' },
             { prop: 'issuccess', label: '是否成功' },
             { prop: 'jruntime', label: '执行时长' },
             { prop: 'msg', label: '执行信息' }
           ]
         }
       }
     }
   },
   mounted() {
   },
   methods: {
     handleAdd(form, formShowKey) {
       if (typeof (this.$refs[form]) !== 'undefined') {
         this.$refs[form].resetFields()
       }
       this[formShowKey] = true
     },
     handleSelect(select, row) {
       this.taskList = Object.assign([], select)
     },
     showLogs(row) {
       this.window.logWindow = true
       this.$nextTick(() => {
         this.$refs.logTable.fetchHandler({
           jobKey: row.name
         })
       })
     },
     excuteOperate(oType) {
       let data = []
       if (oType !== 'resumeAll' && oType !== 'pauseAll') {
         data = this.$refs.table.getSelected()
       }
       request({
         url: '/system/operateSysTask',
         method: 'post',
         params: {
           operate: oType
         },
         data
       }).then(response => {
         this.returnMsg(this, response)
         this.$refs.table.fetchHandler()
       })
     },
     save() {
       this.$refs['form'].validate((valid) => {
         const data = this.taskForm
         if (valid) {
           request({
             url: '/system/addSysTask',
             method: 'post',
             data
           }).then(response => {
             this.returnMsg(this, response)
             this.$refs.table.fetchHandler()
           })
         } else {
           return false
         }
       })
     },
     handleEdit(index, row) {
       this.addWindow = true
       setTimeout(() => {
         this.$refs['form'].resetFields()
         this.taskForm = Object.assign({}, row)
       }, 1)
     },
     hanleDel(row) {
       request({
         url: '/system/delSysTask',
         params: {
           id: row.id
         }
       }).then(response => {
         this.returnMsg(this, response)
         this.$refs.table.fetchHandler()
       })
     }
   }
 }
  </script>
