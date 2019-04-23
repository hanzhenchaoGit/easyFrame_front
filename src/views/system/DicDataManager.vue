<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card>
          <common-table
          ref="dicTypeTable"
          rowKey="id"
          :url="dicType.table.url"
          method="post"
          :columns="dicType.table.columnDefs"
          :selected="dicType.table.selected"
          :formOptions="dicType.table.formOptions"
          @select="onDicTypeSelect" >
            <template slot="topbutton">
              <el-button @click="onAddDicType">添加</el-button>
              <el-button v-bind:disabled="dicTypeDetailAddFlag" @click="onEditDicType">修改</el-button>
              <el-button type="danger" @click="handleGetRows">删除</el-button>
            </template>
          </common-table>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card>
          <common-table ref="dicTypeDetailTable"
          :url="dicTypeDetail.table.url"
          method="post"
          :columns="dicTypeDetail.table.columnDefs"
          :selected="dicTypeDetail.table.selected"
          @select="onDicTypeDetailSelect"
          :formOptions="dicTypeDetail.table.formOptions">
            <template slot="topbutton">
              <el-button v-bind:disabled="dicTypeDetailAddFlag" @click="onAddDicTypeDetail">添加</el-button>
              <el-button v-bind:disabled="dicTypeDetailEditFlag" @click="onEditDicTypeDetail">修改</el-button>
              <el-button type="danger" @click="handleGetRows">删除</el-button>
            </template>
          </common-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dicType.visible.dicTypeAdd"  close-on-click-modal close-on-press-escape	right width="30%">
      <el-form  ref="dicTypeForm" :model="dicType.entity" :rules="dicType.rules" label-width="90px"  label-position="right">
        <el-form-item prop="typeCode" label="字典编码" >
          <el-input v-model="dicType.entity.typeCode" style="width:100%"> </el-input>
        </el-form-item>
        <el-form-item prop="typeName" label="字典名称" >
          <el-input v-model="dicType.entity.typeName" style="width:100%"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <common-button type="primary" :loading="dicType.loading.addSubmitLoading" @click="onSubmitDicType">保存</common-button>
        <common-button type="primary" @click="dicType.visible.dicTypeAdd = false">取消</common-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dicTypeDetail.visible.dicTypeDetailAdd"  close-on-click-modal close-on-press-escape	right width="30%">
      <el-form  ref="dicTypeDetailForm" :model="dicTypeDetail.entity" :rules="dicTypeDetail.rules" label-width="120px"  label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="itemCode" label="字典编码" >
              <el-input v-model="dicTypeDetail.entity.itemCode" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="itemName" label="字典名称" >
              <el-input v-model="dicTypeDetail.entity.itemName" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr1" label="属性1" >
              <el-input v-model="dicTypeDetail.entity.attr1" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr2" label="属性2" >
              <el-input v-model="dicTypeDetail.entity.attr2" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr3" label="属性3" >
              <el-input v-model="dicTypeDetail.entity.attr3" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr4" label="属性4" >
              <el-input v-model="dicTypeDetail.entity.attr4" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr5" label="属性5" >
              <el-input v-model="dicTypeDetail.entity.attr5" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="attr6" label="属性6" >
              <el-input v-model="dicTypeDetail.entity.attr6" style="width:100%"> </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <common-button type="primary" @click="onSubmitDicTypeDetail">保存</common-button>
        <common-button type="primary" @click="dicTypeDetail.visible.dicTypeDetailAdd = false">取消</common-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dicType: {
          loading: {
            addSubmitLoading: false
          },
          search: {
            dicName: ''
          },
          entity: {
            id: '', typeCode: '', typeName: ''
          },
          rules: {
            typeCode: [
              { required: true, message: '请输入字典编码', trigger: 'change' }
            ],
            typeName: [
              { required: true, message: '请输入字典名称', trigger: 'change' }
            ]
          },
          visible: {
            dicTypeAdd: false
          },
          table: {
            selected: [],
            url: '/system/sysInfobaseType/getList',
            columnDefs: [
              { type: 'selection' },
              { label: '字典名称', prop: 'typeName', filters: [{ text: '家', value: '家' }, { text: '公司', value: '公司' }] },
              { label: '字典编码', prop: 'typeCode' }
            ],
            formOptions: {
              inline: true,
              showSearchBtn: true,
              showResetBtn: true,
              submitBtnText: '查询',
              resetBtnText: '重置',
              forms: [
                { prop: 'typeName', label: '父字典' },
                { prop: 'typeName', label: '父字典1' }
              ]
            }
          }
        },
        dicTypeDetail: {
          entity: {
            id: '', typeId: '', itemCode: '', itemName: '', attr1: '', attr2: '', attr3: '', attr4: '', attr5: '', attr6: ''
          },
          rules: {
            itemCode: [
              { required: true, message: '请输入字典编码', trigger: 'change' }
            ],
            itemName: [
              { required: true, message: '请输入字典名称', trigger: 'change' }
            ]
          },
          visible: {
            dicTypeDetailAdd: false
          },
          table: {
            url: '/system/sysnIfobaseDetail/getList',
            selected: [],
            columnDefs: [
              { type: 'selection' },
              { label: '字典名称', prop: 'itemName' },
              { label: '字典编码', prop: 'itemCode' },
              { label: '属性1', prop: 'attr1' },
              { label: '属性2', prop: 'attr2' },
              { label: '属性3', prop: 'attr3' },
              { label: '属性4', prop: 'attr4' },
              { label: '属性5', prop: 'attr5' },
              { label: '属性6', prop: 'attr6' }
            ],
            formOptions: {
              inline: true,
              showSearchBtn: true,
              showResetBtn: true,
              submitBtnText: '查询',
              resetBtnText: '重置'
            }
          }
        }
      }
    },
    computed: {
      dicTypeDetailAddFlag() {
        if (this.dicType.table.selected.length === 1) {
          return false
        } else {
          return true
        }
      },
      dicTypeDetailEditFlag() {
        if (this.dicTypeDetail.table.selected.length === 1) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      onAddDicType() {
        this.dicType.visible.dicTypeAdd = true
        this.$nextTick(() => {
          this.$refs.dicTypeForm.resetFields()
        })
      },
      onEditDicType() {
        const { id, typeCode, typeName } = this.dicType.table.selected[0]
        console.log('11', this.dicType.table.selected)
        this.dicType.entity = { id, typeCode, typeName }
        this.dicType.visible.dicTypeAdd = true
      },
      onSubmitDicType() {
        this.$refs.dicTypeForm.validate(valid => {
          if (!valid) return
          this.dicType.loading.addSubmitLoading = true
          const { id, typeCode, typeName } = this.dicType.entity
          this.$request({
            url: '/system/sysInfobaseType/add',
            method: 'post',
            data: { id, typeCode, typeName }
          }).then(res => {
            this.dicType.loading.addSubmitLoading = false
            this.dicType.visible.dicTypeAdd = false
            this.$refs.dicTypeTable.fetchHandler()
          }).catch(() => {
            this.dicType.loading.addSubmitLoading = false
          })
        })
      },
      onDicTypeSelect(event, selected, row) {
        this.dicType.table.selected = selected
        if (selected) {
          const { id } = selected
          this.dicTypeDetail.entity.typeId = id
          this.$refs.dicTypeDetailTable.fetchHandler({ typeId: id })
        } else {
          this.$refs.dicTypeDetailTable.fetchHandler()
        }
      },
      onAddDicTypeDetail() {
        this.dicTypeDetail.visible.dicTypeDetailAdd = true
        this.$nextTick(() => {
          this.$refs.dicTypeDetailForm.resetFields()
        })
      },
      onEditDicTypeDetail() {
        this.dicTypeDetail.visible.dicTypeDetailAdd = true
        this.$nextTick(() => {
          this.$refs.dicTypeDetailForm.resetFields()
          const { id, typeId, itemCode, itemName, attr1, attr2, attr3, attr4, attr5, attr6 } = this.dicTypeDetail.table.selected[0]
          this.dicTypeDetail.entity = { id, typeId, itemCode, itemName, attr1, attr2, attr3, attr4, attr5, attr6 }
        })
      },
      onDicTypeDetailSelect(event, selected, row) {
        this.dicTypeDetail.table.selected = selected
      },
      onSubmitDicTypeDetail() {
        this.$refs.dicTypeDetailForm.validate(valid => {
          if (!valid) return
          const data = this.dicTypeDetail.entity
          this.$request({
            url: '/system/sysnIfobaseDetail/add',
            method: 'post',
            data
          }).then(res => {
            this.dicTypeDetail.visible.dicTypeDetailAdd = false
            this.$refs.dicTypeDetailTable.fetchHandler({ typeId: this.dicTypeDetail.entity.typeId })
          })
        })
      },
      handleGetRows() {
        this.$refs.dicTypeTable.fetchHandler({ typeName: this.dicType.search.typeName })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
