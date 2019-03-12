<template>
  <div>
    <ag-grid-vue
    class="ag-theme-fresh"
    ref="grid"
    :columnDefs="columnDefs"
    :rowData="data"
    style="height:70vh"
    :rowSelection="rowSelection"
    rowMultiSelectWithClick="true"
    :enableSorting="enableSorting"
    :enableColResize="true"
    :loading="loading"
    :suppressRowTransform="true"
    :gridOptions="gridOptions"
    @cellClicked="cellClicked"
    @selectionChanged="onSelectionChanged"
    @gridReady="onGridReady"
    >
  </ag-grid-vue>
  <div class="block">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNumber"
      :page-sizes="pageSizes"
      :page-size="defaultPageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  </div>
</template>
// 对外暴露方法 onSelect 选中行时触发
<script>
  import { AgGridVue } from 'ag-grid-vue'
  import props from './props'
  export default {
    name: 'AgTable',
    props,
    components: { AgGridVue },
    data() {
      const pageSize = this.pageSizes[0]
      return {
        pageNumber: 1,
        pageSize,
        total: 0,
        loading: false,
        data: this.rowData,
        selectedRows: [],
        gridApi: null,
        columnApi: null
      }
    },
    mounted() {
      if (this.initLoad) {
        this.fetchHandler()
      }
    },
    methods: {
      // 表格创建完成后执行
      onGridReady(params) {
        // 获取gridApi
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // 调整表格列宽大小自适应
        this.gridApi.sizeColumnsToFit()
        this.$emit('onGridReady', params)
      },
      // 获取ag-grid对象
      getGrid() {
        return this.$refs.grid
      },
      getSelected() {
        console.log('11', this.$refs.grid)
        return this.selectedRows
      },
      onSelectionChanged(grid) {
        const selectedRows = grid.api.getSelectedRows()
        this.selectedRows = selectedRows
        this.$emit('onSelect', selectedRows, grid)
      },
      cellClicked(a) {
        console.log(a)
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.fetchHandler()
      },
      handleCurrentChange(page) {
        this.pageNumber = page
        this.fetchHandler()
      },
      fetchHandler(param = {}) {
        this.loading = true
        const data = Object.assign({}, param, {
          pageNumber: this.pageNumber, pageSize: this.pageSize
        })
        this.$request({ url: this.url, method: 'post', data })
          .then(response => {
            const result = response.data
            if (this.showPagination) {
              this.data = result.items
            } else {
              this.data = result
            }
            this.total = result.total || result.length
            this.loading = false
            this.$emit('loadDone', response)
          }).catch(() => {
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
