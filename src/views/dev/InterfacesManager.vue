<template>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-dialog
          title="添加请求"
          :visible.sync="addWindow" width="50%" >
          <el-tabs v-model="activeName" >
            <el-tab-pane label="添加/编辑请求" name="addRequest">
              <el-form ref="form" :model="proxy"  inline label-width="120px" size="small" label-position="left">
              <el-form-item label="请求标识符" prop="uuid" style="width:390px">
                  <el-input v-model="proxy.uuid" disabled></el-input>
              </el-form-item>
              <el-form-item label="请求名称" prop="name" style="width:390px">
                  <el-input v-model="proxy.name"></el-input>
              </el-form-item>
              <el-form-item label="请求功能分类" prop="fun" style="width:390px">
                  <el-select v-model="proxy.fun" placeholder="">
                      <el-option label="报表查询" value="report"></el-option>
                      <el-option label="下拉选项" value="combo"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="请求类型" prop="type" style="width:390px">
                  <el-select v-model="proxy.type" placeholder="">
                      <el-option label="sql" value="sql"></el-option>
                      <el-option label="class" value="class"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="是否有效" prop="enabled" style="width:390px">
                  <el-select v-model="proxy.enabled" placeholder="">
                  <el-option label="有效" value="Y"></el-option>
                  <el-option label="无效" value="N"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="创建时间" prop="createtime" style="width:390px">
                  <el-input v-model="proxy.createtime" disabled></el-input>
              </el-form-item>
              <el-form-item label="创建人" prop="createuserid" style="width:390px">
                  <el-input v-model="proxy.createuserid" disabled></el-input>
              </el-form-item>
              <el-form-item label="更新时间" prop="updatetime" style="width:390px">
                  <el-input v-model="proxy.updatetime" disabled></el-input>
              </el-form-item>
              <el-form-item label="更新人" prop="updateuserid" style="width:390px">
                  <el-input v-model="proxy.updateuserid" disabled></el-input>
              </el-form-item>
              <el-form-item label="请求内容" prop="content">
                  <el-input type="textarea" style="width:600px;" :autosize="{ minRows: 5, maxRows: 10}" v-model="proxy.content"></el-input>
              </el-form-item>
              <el-form-item style="width:390px">
                  <common-button type="primary" @click="add()">保存</common-button>
                  <common-button @click="addWindow = false">取消</common-button>
              </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane v-if="proxy.uuid" label="请求测试" name="testRequest">
              <el-form ref="testForm" :model="testRequest" label-width="120px" size="small" label-position="left">
                <el-form-item label="请求url">
                  <el-tag v-if="this.proxy.uuid!=''">{{requestUrl}}</el-tag>
                  <common-button type="primary" @click="addParams()" >添加请求参数</common-button>
                </el-form-item>
                <el-form-item
                  v-for="(param, index) in testRequest.params"

                  :label="'请求参数' + index"
                  :key="param.key"
                >
                  <el-col :span="5">
                    <el-form-item  >
                      <el-input v-model="param.reqKey" style="width: 70%;" :placeholder="'请输入参数'+index+'的请求Key'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item   >
                      <el-input v-model="param.reqValue" style="width: 90%;" :placeholder="'请输入参数'+index+'的请求Value'"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <common-button type="danger" @click="removeParam(index)">删除</common-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="分页信息">
                    <el-select v-model="pageInfo.isPage" placeholder="是否分页">
                      <el-option key=0  label="是" value="Y"> </el-option>
                      <el-option key=1  label="否" value="N"> </el-option>
                    </el-select>
                </el-form-item>
                <div v-if="pageInfo.isPage === 'Y'">
                    <el-form-item label="第几页">
                      <el-input-number v-model="pageInfo.currentPage"  />
                    </el-form-item>
                    <el-form-item label="每页几条">
                      <el-input-number v-model="pageInfo.pageSize"   />
                    </el-form-item>
                </div>
                <el-form-item label="排序">
                    <el-input v-model="pageInfo.orderBy" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="返回结果" v-if="JSON.stringify(testRequest.response) !== '{}'">
                  <!-- <code style="font-size:10px;overflow-y: auto;height:400px;">{{testRequest.response}}</code> -->
                  <div class="editor-container">
                  <json-editor style="font-size:10px;overflow-y: auto;height:400px;" ref="jsonEditor" v-model="testRequest.response"></json-editor>
                  </div>
                </el-form-item>
                <el-form-item>
                  <common-button type="primary" @click="sendRequest('N')">测试请求</common-button>
                  <common-button type="primary" @click="exportTest()">导出测试</common-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          </el-dialog>

          <el-dialog
            title="下载文件"
            :visible.sync="downloadWindow"
            width="20%"
          >
            <el-tag>
              <a :href="downloadUrl" style="">点击此处下载导出文件 </a>
            </el-tag>
            <span slot="footer" class="dialog-footer">
              <common-button @click="downloadWindow = false">关闭</common-button>
            </span>
          </el-dialog>

          <common-table ref="table" height="58vh" :fit="fit" :url="url" :columns="columns" autoLoad :formOptions="formOptions" >
            <template slot-scope="scope" slot="topbutton">
              <common-button type="primary"  @click.stop @click="addProxy()">添加</common-button>
            </template>


            <template slot-scope="scope" slot="edit">
                <common-button
                  @click="handleEdit(scope.$index, scope.row)">编辑</common-button>
                <common-button

                  type="danger"
                  @click="hanleDel(scope.row)">删除</common-button>
            </template>
          </common-table>
          <!-- <common-button @click="exportData()">导出数据</common-button> -->
        </el-col>
      </el-row>
    </el-card>
  </template>

<script>
 import { proxy } from '@/api/sys/interface'
 import request from '@/utils/request'
 import { Message } from 'element-ui'
 import JsonEditor from '@/components/JsonEditor'
 export default {
   components: { JsonEditor },
   data() {
     return {
       activeName: 'addRequest',
       addWindow: false,
       proxy: {
         name: '',
         uuid: '',
         type: '',
         fun: '',
         content: '',
         createtime: '',
         createuserid: '',
         updatetime: '',
         updateuserid: '',
         enabled: ''
       },
       url: '/system/getSysSqlConfigByPager',
       fit: true,
       formOptions: {
         inline: true,
         showResetBtn: true,
         showSearchBtn: true,
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
       columns: [
         { prop: 'uuid', label: '请求标识符', width: 266 },
         { prop: 'name', label: '请求名称', width: 150 },
         { prop: 'type', label: '请求类型', width: 70 },
         { prop: 'fun', label: '请求功能类型', width: 120 },
         { prop: 'content', label: '请求正文', width: 400, showOverflowTooltip: true },
         { prop: 'createtime', label: '创建时间', width: 140 },
         { prop: 'createuserid', label: '创建人', width: 70 },
         { prop: 'updatetime', label: '更新时间', width: 140 },
         { prop: 'updateuserid', label: '更新人', width: 70 },
         { prop: 'enabled', label: '是否可用', width: 70 },
         { prop: 'edit', label: '编辑', slotName: 'edit', width: 220 }],
       testRequest: {
         params: [],
         response: {}
       },
       pageInfo: {
         isPage: 'N',
         currentPage: 1,
         pageSize: 10,
         orderBy: '',
         export: 'N'
       },
       downloadWindow: false,
       downloadUrl: '',
       exportLoading: true
     }
   },
   computed: {
     requestUrl() {
       if (this.proxy.uuid !== '') {
         return this.baseUrl + '/system/proxyExcute?uuid=' + this.proxy.uuid
       }
     }
   },
   methods: {
     handleClose: function() {
       console.log()
     },
     addProxy() {
       if (typeof (this.$refs['form']) !== 'undefined') {
         this.proxy = {}
         this.testRequest = {
           params: [],
           response: {}
         }
       }
       this.addWindow = true
     },
     add: function() {
       this.$refs['form'].validate((valid) => {
         const data = this.proxy
         if (valid) {
           request({
             url: '/system/addSysSqlConfig',
             method: 'post',
             data
           }).then(response => {
             if (response.success) {
               Message({
                 message: '保存成功: uuid为' + response.data,
                 type: 'info',
                 duration: 5 * 1000
               })
             } else {
               Message({
                 message: '保存失败:' + response.msg,
                 type: 'error',
                 duration: 5 * 1000
               })
             }
             this.proxy.uuid = response.data
             this.$refs.table.fetchHandler()
           })
         } else {
           return false
         }
       })
     },
     handleEdit(index, row) {
       this.pageInfo = {
         isPage: 'N',
         currentPage: 1,
         pageSize: 10,
         orderBy: '',
         export: 'N'
       }
       this.testRequest = {
         params: [],
         response: {}
       }
       if (typeof (this.$refs['form']) !== 'undefined') {
         this.$refs.form.resetFields()
         this.testRequest = {
           params: [],
           response: {}
         }
       }
       // 给一个空对象 深拷贝 避免浅拷贝传地址
       this.proxy = Object.assign({}, row)
       this.addWindow = true
       //  this.$refs.table.fetchHandler()
     },
     hanleDel(row) {
       request({
         url: '/system/delSysSqlConfig',
         method: 'get',
         params: {
           id: row.id
         }
       }).then(response => {
         Message({
           message: '删除成功',
           type: 'info',
           duration: 5 * 1000
         })
         this.$refs.table.fetchHandler()
       })
     },
     addParams() {
       this.testRequest.params.push({
         reqKey: '',
         reqValue: '',
         key: Date.now()
       })
     },
     removeParam(index) {
       this.testRequest.params.splice(index, 1)
     },
     sendRequest(type) {
       const _this = this

       this.$refs.testForm.validate(valid => {
         if (valid) {
           const params = this.pageInfo
           const parmArray = this.testRequest.params
           for (const index in parmArray) {
             if (parmArray[index].reqKey !== '') {
               params[parmArray[index].reqKey] = parmArray[index].reqValue
               console.log(params, '参数---')
             }
           }
           console.log(params, 'sss')
           params.uuid = this.proxy.uuid
           let reqParams = ''
           for (const key in params) {
             reqParams += key + '=' + params[key] + '&'
           }
           if (type === 'Y') {
             this.pageInfo.export = 'Y'
             window.open(this.baseUrl + '/system/proxyExcute?' + reqParams)
           } else if (this.pageInfo.isPage === 'Y') {
             this.pageInfo.export = 'N'
             proxy(params).then(response => {
               _this.testRequest.response = response
             }).catch(function(error) {
               _this.testRequest.response = error
             })
           } else {
             this.pageInfo.export = 'N'
             proxy(params).then(response => {
               _this.testRequest.response = response
             }).catch(function(error) {
               _this.testRequest.response = error
             })
           }
         }
       })
     }
   }
 }
  </script>
  <style>
  .editor-container{
    position: relative;
    height: 100%;
  }
  </style>
