<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model="dicType.search.typeName" placeholder="父级字典"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click="handleGetRows">查询</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-button @click="onAddDicType">添加</el-button>
              <el-button v-bind:disabled="dicTypeDetailAddFlag" @click="onEditDicType">修改</el-button>
              <el-button type="danger" @click="handleGetRows">删除</el-button>
            </el-col>
          </el-row>
        </el-card>
        <ag-table  ref="dicTypeTable" :url="dicType.table.url" :columnDefs="dicType.table.columnDefs" rowSelection="single" :selected="dicType.table.selected" @onSelect="onDicTypeSelect" ></ag-table>
      </el-col>
      <el-col :span="16">
        <el-card>
          <el-button v-bind:disabled="dicTypeDetailAddFlag" @click="onAddDicTypeDetail">添加</el-button>
          <el-button v-bind:disabled="dicTypeDetailEditFlag" @click="onEditDicTypeDetail">修改</el-button>
          <el-button type="danger" @click="handleGetRows">删除</el-button>
        </el-card>
        <ag-table ref="dicTypeDetailTable" :url="dicTypeDetail.table.url" :columnDefs="dicTypeDetail.table.columnDefs" rowSelection="single" :selected="dicTypeDetail.table.selected" @onSelect="onDicTypeDetailSelect"></ag-table>
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
              { headerName: '序号', pinned: 'left',
                cellRenderer: (params) => Number(params.node.id) + 1,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true },
              { headerName: '字典名称', field: 'typeName' },
              { headerName: '字典编码', field: 'typeCode' }
            ]
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
              { headerName: '序号', pinned: 'left',
                cellRenderer: (params) => Number(params.node.id) + 1,
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true,
                checkboxSelection: true },
              { headerName: '字典名称', field: 'itemName' },
              { headerName: '字典编码', field: 'itemCode' },
              { headerName: '属性1', field: 'attr1' },
              { headerName: '属性2', field: 'attr2' },
              { headerName: '属性3', field: 'attr3' },
              { headerName: '属性4', field: 'attr4' },
              { headerName: '属性5', field: 'attr5' },
              { headerName: '属性6', field: 'attr6' }
            ]
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
      onDicTypeSelect(selected, grid) {
        this.dicType.table.selected = selected
        if (selected.length > 0) {
          const { id } = selected[0]
          this.dicTypeDetail.entity.typeId = id
          this.$refs.dicTypeDetailTable.fetchHandler({ typeId: id })
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
      onDicTypeDetailSelect(selected, grid) {
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
