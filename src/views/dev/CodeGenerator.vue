<template>
  <div>
    <el-dialog :visible.sync="dataSourceWindow" width="36%"  close-on-click-modal close-on-press-escape	>
      <el-form inline  ref="dataSourceForm" :model="dataSourceForm" label-width="120px"  label-position="left">
        <el-form-item prop="id" label="id">
          <el-input v-model="dataSourceForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="数据源名称" required>
          <el-input v-model="dataSourceForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="数据源url" required>
          <el-input style="width:460px" v-model="dataSourceForm.url"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="用户名" required>
          <el-input v-model="dataSourceForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" required>
          <el-input v-model="dataSourceForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="driver" label="驱动" required>
          <el-input v-model="dataSourceForm.driver"></el-input>
        </el-form-item>
        <el-form-item>
          <el-tag
            v-for="dataSource in dataSources"
            :key="dataSource.id"
            closable @close="delDataSource(dataSource.id)"
            >
            {{dataSource.name}}：{{dataSource.url}}:{{dataSource.username}}:{{dataSource.password}}
          </el-tag>
        </el-form-item>
        <el-form-item>
          <common-button type="primary" @click="saveDataSource()">保存</common-button>
          <common-button @click="dataSourceWindow=false">取消</common-button>
        </el-form-item>
      </el-form>
      </el-dialog>
      <el-dialog :visible.sync="addWindow" width="60%"  close-on-click-modal close-on-press-escape	>
        <el-form inline  ref="form" :model="codeForm" label-width="120px"  label-position="left">
          <el-form-item prop="id" label="id">
            <el-input v-model="codeForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item prop="module" label="模块标识" required>
            <el-input v-model="codeForm.module"></el-input>
          </el-form-item>
          <el-form-item prop="tableName" label="表名" required>
            <common-select v-model="codeForm.tableName" :url="tableNameUrl" filterable
                placeholder="请选择表名">
              <el-option
                v-for="table in tables"
                :key="table.table_name"
                :label="table.table_name"
                :value="table.table_name">
              </el-option>
            </common-select>
          </el-form-item>
          <el-form-item prop="genType" label="代码类型" required>
            <el-tooltip placement="top">
              <div slot="content">
                增&改: controller中带有增加和更改记录的请求<br>
                删: controller中带有删除记录的请求<br>
                分页列表: controller中带有分页查询的请求<br>
                不分列表: controller中带有不分页查询列表的请求<br>
              </div>
              <el-select v-model="codeForm.genType" multiple placeholder="请选择代码类型">
                <el-option key="addAndUpdate" label="增&改" value="addAndUpdate"> </el-option>
                <el-option key="del" label="删" value="del"> </el-option>
                <el-option key="selectPager" label="分页列表" value="selectPager"> </el-option>
                <el-option key="selectList" label="不分列表" value="selectList"> </el-option>
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item prop="author" label="作者" required>
            <el-input v-model="codeForm.author"></el-input>
          </el-form-item>
          <el-form-item prop="outpath" label="代码输出路径" required>
            <el-input v-model="codeForm.outpath"></el-input>
          </el-form-item>
          <el-form-item prop="datasourceId" label="数据源Id" required>
            <el-select v-model="codeForm.datasourceId" placeholder="请选择">
              <el-option
                v-for="item in dataSources"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span >{{ item.name }}</span>
                <span >{{ item.url }}</span>
                <span >{{ item.username }}:{{ item.password }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <common-button type="primary" @click="handleAdd('dataSourceForm','dataSourceWindow')">添加/修改/删除数据源</common-button>
          </el-form-item>
          <el-form-item prop="queryParams"  label="查询参数">
            <el-tooltip placement="top">
              <div slot="content">
                参数示例说明:<br>
                主要对于查询列表的参数进行设置 分页列表(selectPager) 不分列表(selectList) <br>
                查询类型::查询字段@@模糊查询(like)还是等值判断(eq) 多个查询条件用 ',' 隔开 多种查询类型用'|||'隔开<br>
                selectPager::user_name@@like,user_enable@@eq <br>
              </div>
              <el-input type="textarea" :rows="3" style="width:500px" v-model="codeForm.queryParams" placeholder="selectPager::user_name@@like,user_enable@@eq"></el-input>
            </el-tooltip>
          </el-form-item>
          <el-form-item prop="createtime" label="创建时间">
            <el-input v-model="codeForm.createtime" disabled></el-input>
          </el-form-item>
          <el-form-item >
            <common-button type="primary" @click="save()">保存</common-button>
            <common-button type="primary">取消</common-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    <el-card >
      <common-table ref="table" height="58vh" :url="url" :columns="columns" fit autoLoad :formOptions="formOptions" @select-all="handleSelect" @select="handleSelect" >
        <template slot-scope="scope" slot="edit">
            <common-button @click="handleEdit(scope.$index, scope.row)">编辑</common-button>
            <common-button type="danger" @click="hanleDel(scope.row)">删除</common-button>
        </template>
        <template slot-scope="scope" slot="buttons">
          <div style="margin-top:1">
            <common-button  type="primary" @click="handleAdd('form','addWindow')">新增</common-button>
            <common-button  type="primary"  @click="generateCode()">生成代码</common-button>
          </div>
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
       addWindow: false,
       dataSourceWindow: false,
       dataSourceForm: {
         id: null,
         name: '',
         url: '',
         username: '',
         password: '',
         driver: ''
       },
       tableNameUrl: '/system/proxyExcute?uuid=8c010037-6df3-4d69-be32-e61f7a8dbcc1',
       codeForm: {
         createtime: null,
         datasourceId: 1,
         genType: '',
         id: null,
         author: '',
         module: '',
         queryParams: '',
         tableName: ''
       },
       url: '/system/getSysCodegenConfigByPager',
       formOptions: {
         inline: true,
         showResetBtn: true,
         submitBtnText: '查询',
         resetBtnText: '重置',
         forms: [
           { prop: 'name', label: 'Name' },
           { prop: 'type', label: '请求类型', itemType: 'select',
             options: [
               { value: '', label: 'All' },
               { value: 'sql', label: 'sql' },
               { value: 'class', label: 'class' }
             ]
           }
         ]
       },
       columns: [{
         colType: 'selection'
       }, {
         prop: 'id',
         label: 'id', width: 50
       },
       { prop: 'module',
         label: '模块标识', width: 100
       },
       { prop: 'tableName',
         label: '表名', width: 180
       },
       { prop: 'author',
         label: '作者', width: 80
       },
       { prop: 'outpath',
         label: '输出路径', width: 80
       },
       { prop: 'genType',
         label: '代码类型(增删改查选择)', width: 260
       },
       {
         prop: 'queryParams',
         label: '查询参数', width: 260, showOverflowTooltip: true
       },
       { prop: 'datasourceId',
         label: '数据源Id', width: 80 },
       { prop: 'createtime',
         label: '创建时间' },
       { prop: 'test',
         label: '操作', slotName: 'edit', width: 200 }],
       dataSources: [],
       generateCodeList: [],
       tables: []
     }
   },
   computed: {

   },
   mounted() {
     this.getDataSources()
     this.getTables()
   },
   methods: {
     saveDataSource() {
       const data = this.dataSourceForm
       request({
         url: '/system/addSysDatasource',
         method: 'post',
         data
       }).then(response => {
         this.returnMsg(this, response)
         this.getDataSources()
       })
     },
     delDataSource(v) {
       request({
         url: '/system/delSysDatasource',
         params: {
           id: v
         }
       }).then(response => {
         this.returnMsg(this, response)
         this.getDataSources()
       })
     },
     handleAdd(form, formShowKey) {
       if (typeof (this.$refs[form]) !== 'undefined') {
         this.$refs[form].resetFields()
         console.log('rest sss')
       }
       this[formShowKey] = true
     },
     getTables() {
       request({
         url: '/system/proxyExcute?uuid=8c010037-6df3-4d69-be32-e61f7a8dbcc1',
         method: 'get'
       }).then(response => {
         this.tables = response.data
       })
     },
     getDataSources() {
       request({
         url: '/system/getSysDatasourceList',
         method: 'get'
       }).then(response => {
         this.dataSources = response.data
       })
     },
     handleSelect(select, row) {
       console.log(select, row)
       this.generateCodeList = Object.assign([], select)
     },
     generateCode() {
       const data = this.generateCodeList
       request({
         url: '/system/generatorCode',
         method: 'post',
         data
       }).then(response => {
         console.log(response)
       })
     },
     save() {
       this.$refs['form'].validate((valid) => {
         if (this.codeForm.genType instanceof Array) {
           this.codeForm.genType = this.codeForm.genType.join(',')
         }
         const data = this.codeForm
         if (valid) {
           request({
             url: '/system/addSysCodegenConfig',
             method: 'post',
             data
           }).then(response => {
             this.returnMsg(this, response)
             if (!(this.codeForm.genType instanceof Array)) {
               this.codeForm.genType = this.codeForm.genType.split(',')
             }
             this.addWindow = false
             this.$refs.table.fetchHandler()
           })
         } else {
           return false
         }
       })
     },
     handleEdit(index, row) {
       this.codeForm = Object.assign({}, row)
       this.codeForm.genType = this.codeForm.genType.split(',')
       this.addWindow = true
     },
     hanleDel(row) {
       request({
         url: '/system/delSysCodegenConfig',
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
