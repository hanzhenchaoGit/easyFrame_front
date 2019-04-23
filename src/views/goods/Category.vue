<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.id" clearable class="filter-item" style="width: 200px;" placeholder="请输入类目ID"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入类目名称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div> -->

    <!-- 查询结果 -->
    <common-table
      ref="table"
      :url="table.url"
      method="post"
      row-key="id"
      border fit highlight-current-row
      :columns="table.columns"
      :formOptions="table.formOptions">
      <template slot="topbutton">
        <common-button class="filter-item" @click.stop @click.exact="handleCreate" icon="el-icon-edit" @click="handleCreate">添加</common-button>
      </template>
      <template slot-scope="scope" slot="iconUrl">
        <img v-if="scope.row.iconUrl" src="http://localhost:9999/file/getFileById?id=10 " width="40">
      </template>
      <template slot-scope="scope" slot="picUrl">
        <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80">
      </template>
      <template slot-scope="scope" slot="level">
        <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' ">{{ scope.row.level === 'L1' ? '一级类目' : '二级类目' }}</el-tag>
      </template>
      <template slot-scope="scope" slot="edit">
        <common-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</common-button>
        <common-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</common-button>
      </template>
    </common-table>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类目名称" prop="catName">
          <el-input v-model="dataForm.catName"/>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="dataForm.keywords"/>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="dataForm.level" @change="onLevelChange">
            <el-option label="一级类目" value="L1"/>
            <el-option label="二级类目" value="L2"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataForm.level === 'L2'" label="父类目" prop="pid">
          <common-select
            ref="cat"
            v-model="dataForm.pid"
            :params="{level: 'L1'}"
            :url="select.cat.url"
            :nameKey="select.cat.nameKey"
            :valueKey="select.cat.valueKey"
            :fields="[select.cat.nameKey]"></common-select>
        </el-form-item>
        <!-- <el-form-item label="类目图标" prop="iconUrl">
          <common-upload
            ref="icon"
            :uploadUrl="upload.url"
            accept=".jpg,.jpeg,.png,.gif"
            >
          </common-upload>
        </el-form-item>
        <el-form-item label="类目图片" prop="picUrl">
          <common-upload
            ref="pic"
            :uploadUrl="upload.url"
            accept=".jpg,.jpeg,.png,.gif"
            >
          </common-upload>
        </el-form-item> -->
        <el-form-item label="类目简介" prop="catDesc">
          <el-input v-model="dataForm.catDesc"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>

<script>
export default {
  name: 'Category',
  data() {
    return {
      upload: {
        url: 'http://localhost:9999/file/upload'
      },
      select: {
        cat: {
          url: '/goods/getGoodsCategoryList',
          nameKey: 'catName',
          valueKey: 'id'
        }
      },
      table: {
        url: '/goods/getGoodsCategoryByPager',
        formOptions: {
          inline: true,
          showSearchBtn: true,
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
        columns: [
          { prop: 'id', label: '类目ID', align: 'center', width: 120 },
          { prop: 'catName', label: '类目名', width: 100 },
          { prop: 'keywords', label: '关键字', width: 80 },
          { prop: 'catDesc', label: '简介', width: 80, showOverflowTooltip: true },
          { label: '级别', slotName: 'level', width: 260 },
          { prop: 'pid', label: '父类目ID', width: 260, showOverflowTooltip: true },
          { label: '操作', slotName: 'edit', width: 200 }]
      },
      catL1: {},
      dataForm: {
        id: undefined,
        catName: '',
        keywords: '',
        level: 'L2',
        pid: undefined,
        catDesc: '',
        iconUrl: undefined,
        picUrl: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '类目名不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
  },
  created() {
    this.getCatL1()
  },
  methods: {
    getCatL1() {
      // listCatL1().then(response => {
      //   this.catL1 = response.data.data
      // })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: '',
        keywords: '',
        level: 'L2',
        pid: undefined,
        desc: '',
        iconUrl: undefined,
        picUrl: undefined
      }
    },
    onLevelChange: function(value) {
      if (value === 'L1') {
        this.pid = undefined
      } else if (value === 'L2') {
        this.$refs.cat.loadData({ level: 'L1' })
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    uploadIconUrl: function(response) {
      this.dataForm.iconUrl = response.data.url
    },
    uploadPicUrl: function(response) {
      this.dataForm.picUrl = response.data.url
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const { id, catName, keywords, level, pid, catDesc } = this.dataForm
          // const iconUrl = this.$refs.icon.getGroupId()
          // const picUrl = this.$refs.pic.getGroupId()
          this.$request({ url: '/goods/addGoodsCategory', method: 'post', data: {
            id, catName, keywords, level, pid, catDesc
          }})
            .then(response => {
              this.$refs.table.fetchHandler()
              // 更新L1目录
              this.getCatL1()
              this.dialogFormVisible = false
              this.$notify.success({
                title: '成功',
                message: '创建成功'
              })
            })
            .catch(response => {
              this.$notify.error({
                title: '失败',
                message: response.data.errmsg
              })
            })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // updateCategory(this.dataForm)
          //   .then(() => {
          //     for (const v of this.list) {
          //       if (v.id === this.dataForm.id) {
          //         const index = this.list.indexOf(v)
          //         this.list.splice(index, 1, this.dataForm)
          //         break
          //       }
          //     }
          //     // 更新L1目录
          //     this.getCatL1()
          //     this.dialogFormVisible = false
          //     this.$notify.success({
          //       title: '成功',
          //       message: '更新成功'
          //     })
          //   })
          //   .catch(response => {
          //     this.$notify.error({
          //       title: '失败',
          //       message: response.data.errmsg
          //     })
          //   })
        }
      })
    },
    handleDelete(row) {
      // deleteCategory(row)
      //   .then(response => {
      //     // 更新L1目录
      //     this.getCatL1()
      //     this.$notify.success({
      //       title: '成功',
      //       message: '删除成功'
      //     })
      //     const index = this.list.indexOf(row)
      //     this.list.splice(index, 1)
      //   })
      //   .catch(response => {
      //     this.$notify.error({
      //       title: '失败',
      //       message: response.data.errmsg
      //     })
      //   })
    },
    handleDownload() {
    }
  }
}
</script>
