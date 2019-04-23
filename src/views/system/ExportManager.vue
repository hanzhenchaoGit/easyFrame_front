<template>
  <div>
    <el-card>
      <el-dialog :visible.sync="addWindow" width="56%"  close-on-click-modal close-on-press-escape	>
        <el-form  ref="form" :model="exoport" label-width="120px"  label-position="left">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="uuid" label="唯一标识" >
                <el-input v-model="exoport.uuid" disabled style="width:100%"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="urlPath" label="请求url" required>
                <el-input v-model="exoport.urlPath"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="requestType" label="请求类型" required>
                <el-tooltip placement="top">
                  <div slot="content">
                    代理请求:在[开发模块代理请求维护中添加的请求] 如:http://localhost:9999/system/proxyExcute?uuid=069a2a90-de27-40b9-9fed-17027eae7531 <br>
                    普通请求:正常代码开发模式controller-service-dao的形式 如:http://localhost:9999/system/getSysExportConfigByPager<br>
                  </div>
                  <el-select v-model="exoport.requestType" style="width:100%">
                    <el-option key="pt" label="普通请求" value="pt"></el-option>
                    <el-option key="pr" label="代理请求" value="pr"></el-option>
                  </el-select>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="istem" label="导出方式" required >
                <common-select :data="select.istemOptions" v-model="exoport.istem"></common-select>
              </el-form-item>
            </el-col>
          </el-row>



          <el-form-item prop="template" label="上传模板"  v-if="exoport.istem==='E'">
            <el-upload style="width:470px"
              class="upload-demo"
              :action="upload.url"
              :limit="1"
              with-credentials
              :file-list="upload.template">
              <common-button size="small" type="primary">选择模板上传</common-button>
              <div slot="tip" class="el-upload__tip">只能上传excel文件(.xlsx)，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item prop="template" label="模板文件"  v-if="exoport.istem==='E'" required>
            <common-select :url="select.templatesUrl" v-model="exoport.template"></common-select>
          </el-form-item>
          <el-form-item label="起始行" prop="startrow" v-if="exoport.istem==='E'" required >
            <el-input-number v-model="exoport.startrow"></el-input-number>
          </el-form-item>
          <el-form-item prop="sheetName" label="文件名" required>
            <el-input v-model="exoport.sheetName"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="sqlField" label="数据字段" v-if="exoport.istem==='N'" required>
                <el-select v-model="exoport.sqlField" multiple filterable allow-create default-first-option style="width:100%"> </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="colNames" label="导出表头" v-if="exoport.istem==='N'" required>
                <json-editor style="font-size:10px;line-height: 16px;overflow-y: auto;height:400px;" ref="jsonEditor" v-model="exoport.colNames"></json-editor>
                <!-- <el-select v-model="exoport.colNames" multiple filterable allow-create default-first-option style="width:100%"></el-select> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <span style="color:red">*</span>
            <span style="font-size:10px;color:black;font-weight:500">添加完成后 如果是普通请求 需要在请求的controller上添加@Export("069a2a90-de27-40b9-9fed-17027eae7531")导出配置才能生效;另外导出暂时只支持get请求</span>
          </el-form-item>
          <el-form-item>
            <common-button type="primary" @click="save()">保存</common-button>
            <common-button type="primary" @click="addWindow = false">取消</common-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <common-table ref="table" :url="url" height="58vh" method="post" :columns="columns" fit autoLoad :formOptions="formOptions" >
        <template slot-scope="scope" slot="edit">
            <common-button
              @click="handleEdit(scope.$index, scope.row)">编辑</common-button>
            <common-button
              type="danger"
              @click="hanleDel(scope.row)">删除</common-button>
        </template>
        <template slot="topbutton">
          <common-button  type="primary" @click="handleAdd('form','addWindow')" @click.stop>新增</common-button>
        </template>
      </common-table>
      </el-card>
    </div>
  </template>

<script>
import JsonEditor from '@/components/JsonEditor'

import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  computed: {
    sqlFieldCount: function() {
      if (this.exoport.sqlField instanceof Array) {
        return this.exoport.sqlField.length
      }
    }
  },
  components: { JsonEditor },
  data() {
    return {
      select: {
        istemOptions: [{
          value: 'Y',
          name: '无'
        },
        {
          value: 'N',
          name: '代码'
        }, {
          value: 'E',
          name: 'excel模板'
        }
        ],
        templatesUrl: 'file/templates'
      },
      upload: {
        url: this.baseUrl + '/file/upload',
        template: []
      },
      addWindow: false,
      isAdd: true,
      exoport: {

      },
      url: '/system/getSysExportConfigByPager',
      method: 'post',
      formOptions: {
        inline: true,
        showSearchBtn: true,
        showResetBtn: true,
        submitBtnText: '查询',
        resetBtnText: '重置',
        forms: [
          { prop: 'sheet_name', label: '导出名' }
        ]
      },
      columns: [
        { prop: 'id', label: 'id', width: 50 },
        { prop: 'uuid', label: '导出配置唯一标识', width: 270 },
        { prop: 'urlPath', label: '导出请求路径', width: 200, showOverflowTooltip: true },
        { prop: 'requestType', label: '请求类型' },
        { prop: 'sheetName', label: '导出文件名', width: 150, showOverflowTooltip: true },
        { prop: 'istem', label: '是否使用模板' },
        { prop: 'template', label: '模板名称', width: 150, showOverflowTooltip: true },
        { prop: 'sqlField', label: '数据字段名', showOverflowTooltip: true },
        { prop: 'colNames', label: 'excel表头', showOverflowTooltip: true },
        { label: '操作', slotName: 'edit', width: 180, fixed: 'right' }],
      rowCount: 0,
      colCount: 0,
      colId: 1,
      headerList: []
    }
  },
  methods: {
    handleAdd(form, formShowKey) {
      this.isAdd = true
      if (typeof (this.$refs[form]) !== 'undefined') {
        this.$refs[form].resetFields()
      }
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
      this[formShowKey] = true
    },
    save() {
      this.$refs['form'].validate((valid) => {
        const data = Object.assign({}, this.exoport)
        console.log(data)
        console.log(this.exoport.istem)
        if (this.exoport.istem === 'N') {
          data.sqlField = data.sqlField.toString()
          data.colNames = data.colNames.toString()
        } else {
          data.sqlField = ''
          data.colNames = ''
        }

        if (valid) {
          console.log(JSON.parse(data.colNames))
          // 计算单元格合并规则
          const headerJson = JSON.parse(data.colNames)
          this.readHeaderJson(headerJson, 0)
          data.colNames = JSON.stringify(this.headerList)

          console.log(this.rowCount, this.colCount, headerJson)
          request({
            url: '/system/addSysExportConfig',
            method: 'post',
            data
          }).then(response => {
            if (response.success) {
              Message({
                message: '保存成功',
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
            this.exoport.uuid = response.data
            this.$refs.table.fetchHandler()
          })
        } else {
          return false
        }
      })
    },
    readHeaderJson(json, pid) {
      if (json.length > 0) {
        json.forEach(j => {
          j.pid = pid
          j.id = this.colId++
          this.headerList.push(j)
          if (j.children && j.children.length > 0) {
            this.rowCount++
            this.readHeaderJson(j.children, j.id)
          } else {
            this.colCount++
          }
        })
      }
    },
    handleEdit(index, row) {
      this.exoport = Object.assign({}, row)
      this.exoport.sqlField = this.exoport.sqlField.split(',')
      this.addWindow = true
    },
    hanleDel(row) {
      request({
        url: '/system/delSysExportConfig',
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
    }
  }
}
  </script>
