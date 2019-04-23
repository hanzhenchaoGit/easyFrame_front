<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.goodsSn" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div> -->

    <!-- 查询结果 -->
    <common-table
      :url="table.url"
      :columns="table.columns"
      method="post"
      :formOptions="table.formOptions">
      <template slot-scope="props" slot="expand">
        <el-form label-position="left" class="table-expand">
          <el-form-item label="宣传画廊">
            <img v-for="pic in props.row.gallery" :key="pic" :src="pic" class="gallery">
          </el-form-item>
          <el-form-item label="商品介绍">
            <span>{{ props.row.brief }}</span>
          </el-form-item>
          <el-form-item label="商品单位">
            <span>{{ props.row.unit }}</span>
          </el-form-item>
          <el-form-item label="关键字">
            <span>{{ props.row.keywords }}</span>
          </el-form-item>
          <el-form-item label="类目ID">
            <span>{{ props.row.categoryId }}</span>
          </el-form-item>
          <el-form-item label="品牌商ID">
            <span>{{ props.row.brandId }}</span>
          </el-form-item>
        </el-form>
      </template>
      <template slot="topbutton">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      </template>

      <template slot-scope="scope" slot="picUrl">
        <img :src="scope.row.picUrl" width="40">
      </template>

      <template slot-scope="scope" slot="shareUrl">
        <img :src="scope.row.shareUrl" width="40">
      </template>

      <template slot-scope="scope" slot="detail">
        <el-dialog :visible.sync="detailDialogVisible" title="商品详情">
          <div v-html="goodsDetail"/>
        </el-dialog>
        <el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>
      </template>

      <template slot-scope="scope" slot="isNew">
        <el-tag :type="scope.row.isNew ? 'success' : 'error' ">{{ scope.row.isNew ? '新品' : '非新品' }}</el-tag>
      </template>

      <template slot-scope="scope" slot="isHot">
        <el-tag :type="scope.row.isHot ? 'success' : 'error' ">{{ scope.row.isHot ? '热品' : '非热品' }}</el-tag>
      </template>

      <template slot-scope="scope" slot="isOnSale">
        <el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{ scope.row.isOnSale ? '在售' : '未售' }}</el-tag>
      </template>

      <template slot-scope="scope" slot="edit">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </common-table>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .gallery {
    width: 80px;
    margin-right: 10px;
  }
</style>

<script>
// import { listGoods, deleteGoods } from '@/api/goods'
import BackToTop from '@/components/BackToTop'

export default {
  name: 'GoodsList',
  components: { BackToTop },
  data() {
    return {
      table: {
        url: '/goods/getGoodsByPager',
        columns: [
          { type: 'expand', slotName: 'expand' },
          { label: '商品编号', prop: 'goodsSn' },
          { label: '名称', prop: 'name' },
          // { property="iconUrl" label:"图片">
          // { property="shareUrl" label:"分享图">
          { label: '详情', prop: 'detail' },
          { label: '专柜价格', prop: 'counterPrice' },
          { label: '当前价格', prop: 'retailPrice' },
          { label: '是否新品', slotName: 'isNew' },
          { label: '是否热品', slotName: 'isHot' },
          { label: '是否在售', slotName: 'isOnSale' },
          { label: '操作', slotName: 'edit' }
        ],
        formOptions: {
          showSearchBtn: true
        }
      },
      goodsDetail: '',
      detailDialogVisible: false,
      downloadLoading: false
    }
  },
  methods: {
    handleCreate() {
      this.$router.push({ path: '/goods/Create' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/goods/edit', query: { id: row.id }})
    },
    showDetail(detail) {
      this.goodsDetail = detail
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      // deleteGoods(row).then(response => {
      //   this.$notify.success({
      //     title: '成功',
      //     message: '删除成功'
      //   })
      //   const index = this.list.indexOf(row)
      //   this.list.splice(index, 1)
      // }).catch(response => {
      //   this.$notify.error({
      //     title: '失败',
      //     message: response.data.errmsg
      //   })
      // })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['商品ID', '商品编号', '名称', '专柜价格', '当前价格', '是否新品', '是否热品', '是否在售', '首页主图', '宣传图片列表', '商品介绍', '详细介绍', '商品图片', '商品单位', '关键字', '类目ID', '品牌商ID']
        const filterVal = ['id', 'goodsSn', 'name', 'counterPrice', 'retailPrice', 'isNew', 'isHot', 'isOnSale', 'listPicUrl', 'gallery', 'brief', 'detail', 'picUrl', 'goodsUnit', 'keywords', 'categoryId', 'brandId']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
