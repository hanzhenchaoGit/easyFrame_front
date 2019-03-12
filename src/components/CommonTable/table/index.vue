<template>
  <div>
    <search-form
      ref="searchForm"
      :forms="formOptions.forms"
      :formType="formOptions.formType"
      :showIfCon = "formOptions.showIfCon"
      :size="formOptions.size"
      :fuzzy="formOptions.fuzzy"
      :inline="formOptions.inline"
      :label-width="formOptions.labelWidth"
      :item-width="formOptions.itemWidth"
      :submit-handler="searchHandler"
      :submit-loading="loading"
      :showResetBtn="formOptions.showResetBtn"
      :submitBtnText="formOptions.submitBtnText"
      :resetBtnText="formOptions.resetBtnText"
      :showSearchBtn="formOptions.showSearchBtn"
      :showAddBtn="formOptions.showAddBtn"
      :addBtnText="formOptions.addBtnText"
      :addBtnFun="formOptions.addBtnFun">
        <template slot="formbutton">
          <slot name="topbutton"/>
        </template>
      </search-form>
      <slot name="buttons" />
    <el-table v-loading.lock="loading"
      ref="table"
      element-loading-text="拼命加载中"
      :data="tableData"
      :size="size"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :fit="fit"
      :span-method="spanMethod"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :row-ket="rowKey"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      @select="(selection, row) => emitEventHandler('select', selection, row)"
      @select-all="selection => emitEventHandler('select-all', selection)"
      @selection-change="selection => emitEventHandler('selection-change', selection)"
      @cell-mouse-enter="(row, column, cell, event) => emitEventHandler('cell-mouse-enter', row, column, cell, event)"
      @cell-mouse-leave="(row, column, cell, event) => emitEventHandler('cell-mouse-leave', row, column, cell, event)"
      @cell-click="(row, column, cell, event) => emitEventHandler('cell-click', row, column, cell, event)"
      @cell-dblclick="(row, column, cell, event) => emitEventHandler('cell-dblclick', row, column, cell, event)"
      @row-click="(row, event, column) => emitEventHandler('row-click', row, event, column)"
      @row-dblclick="(row, event) => emitEventHandler('row-dblclick', row, event)"
      @row-contextmenu="(row, event) => emitEventHandler('row-contextmenu', row, event)"
      @header-click="(column, event) => emitEventHandler('header-click', column, event)"
      @sort-change="args => emitEventHandler('sort-change', args)"
      @filter-change="filters => emitEventHandler('filter-change', filters)"
      @current-change="(currentRow, oldCurrentRow) => emitEventHandler('current-change', currentRow, oldCurrentRow)"
      @header-dragend="(newWidth, oldWidth, column, event) => emitEventHandler('header-dragend', newWidth, oldWidth, column, event)"
      @expand-change="(row, expanded) => emitEventHandler('expand-change', row, expanded)"
      >

      <slot name="prepend" />
      <column v-for="(item,index) in columns" :key="index" :column="item">
        <template :slot="item.slotName" slot-scope="scope"  :scope="newSlotScope ? 'scope' : false ">
          <slot :name="item.slotName" v-bind:row="scope.row"/>
        </template>
      </column>
      <slot name="append" />

    </el-table>
    <span style="float:left;margin-top: 10px;">
      <el-select v-model="exportCurrent" v-has permission="export" placeholder="请选择导出数据范围">
        <el-option
          key="current"
          label="导出当前页"
          value="exportCurrent">
        </el-option>
        <el-option
          key="all"
          label="导出所有数据"
          value="exportAll">
        </el-option>
      </el-select>
      <common-button v-has permission="export" @click="doExport()"><svg-icon icon-class='export_btn'></svg-icon>导出</common-button>
    </span>
    <div v-if="showPagination" style="margin-top: 10px;">
      <el-pagination background style="float: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pageSizes"
        :page-size="pagination.pageSize"
        :layout="paginationLayout"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import props from './props'
  import request from '@/utils/request'
  import searchForm from '../search/index.vue'
  import column from '../column/index'
  export default {
    name: 'ElSearchTablePagination',
    components: {
      searchForm, column
    },
    props,
    data() {
      const _this = this
      return {
        Vue,
        pagination: {
          currentPage: 1,
          pageSize: (() => {
            const { pageSizes } = _this
            if (pageSizes.length > 0) {
              return pageSizes[0]
            }
            return 20
          })()
        },
        total: 0,
        loading: false,
        tableData: [],
        cacheLocalData: [],
        exportCurrent: 'exportCurrent',
        selectData: []
      }
    },
    computed: {
      newSlotScope() {
        return Number(Vue.version.replace(/\./g, '')) >= 250
      }
    },
    methods: {
      handleSizeChange(size) {
        this.pagination.pageSize = size
        this.dataChangeHandler()
      },
      handleCurrentChange(currentPage) {
        this.pagination.currentPage = currentPage
        this.dataChangeHandler()
      },
      // 添加是否导出
      searchHandler(resetcurrentPage = true, isExp) {
        if (resetcurrentPage) {
          this.pagination.currentPage = 1
        }
        if (isExp) {
          return this.getReqInfo(arguments[0])
        } else {
          this.dataChangeHandler(arguments[0])
        }
      },
      getSelected() {
        return this.selectData
      },
      dataChangeHandler() {
        const { type } = this
        if (type === 'local') {
          this.dataFilterHandler(arguments[0])
        } else if (type === 'remote') {
          this.fetchHandler(arguments[0])
        }
      },
      dataFilter(data) {
        const { currentPage, pageSize } = this.pagination
        return data.filter((v, i) => {
          return i >= (currentPage - 1) * pageSize && i < currentPage * pageSize
        })
      },
      dataFilterHandler(formParams) {
        const { cacheLocalData, params } = this
        const mergeParams = Object.assign(params, formParams)
        const validParamKeys = Object.keys(mergeParams).filter(v => {
          return mergeParams[v] !== undefined && mergeParams[v] !== ''
        })
        const searchForm = this.$refs['searchForm']
        let paramFuzzy
        if (searchForm) {
          paramFuzzy = searchForm.getParamFuzzy()
        }
        if (validParamKeys.length > 0) {
          const validData = cacheLocalData.filter(v => {
            const valids = []
            validParamKeys.forEach(vv => {
              if (typeof v[vv] === 'number') {
                valids.push(
                  paramFuzzy && paramFuzzy[vv] ? (String(v[vv]).indexOf(String(mergeParams[vv])) !== -1)
                    : (String(v[vv]) === String(mergeParams[vv]))
                )
              } else {
                valids.push(
                  paramFuzzy && paramFuzzy[vv] ? (v[vv].indexOf(mergeParams[vv]) !== -1) : (v[vv] === mergeParams[vv])
                )
              }
            })
            return valids.every(vvv => {
              return vvv
            })
          })
          this.tableData = this.dataFilter(validData)
          this.total = validData.length
        } else {
          this.total = cacheLocalData.length
          this.tableData = this.dataFilter(cacheLocalData)
        }
      },
      getReqInfo(formParams) {
        const { fetch, url,
          pageIndexKey, pageSizeKey,
          showPagination,
          pagination } = this
        let { params } = this
        const { method } = this
        params = JSON.parse(JSON.stringify(Object.assign(params, formParams)))
        if (showPagination) {
          params = Object.assign(params, {
            [pageIndexKey]: pagination.currentPage,
            [pageSizeKey]: pagination.pageSize
          })
        }
        return {
          url: url,
          method: method,
          fetch: fetch,
          params: params
        }
      },
      // 导出Excel
      doExport() {
        const reqInfo = this.$refs.searchForm.submitHandler(true, true)
        const { url, params } = reqInfo

        let paramsStr = '' // 99999999
        for (const key in params) {
          paramsStr += key + '=' + params[key] + '&'
        }
        paramsStr += 'exportType=' + this.exportCurrent
        if (url.indexOf('uuid=') > -1) {
          window.open(this.baseUrl + url + '&' + paramsStr)
        } else {
          window.open(this.baseUrl + url + '?' + paramsStr)
        }
      },
      fetchHandler(formParams = {}) {
        this.loading = true
        const reqInfo = this.getReqInfo(formParams)
        let requestObject = null
        if (reqInfo.fetch) {
          requestObject = fetch(reqInfo.params)
        } else {
          reqInfo.method = reqInfo.method.toLowerCase()
          if (reqInfo.method === 'get') {
            requestObject = request({ url: reqInfo.url, params: reqInfo.params })
          } else {
            const data = reqInfo.params
            requestObject = request({ url: reqInfo.url, method: this.method, data })
          }
        }
        requestObject.then(response => {
          const result = response.data
          // const _this = this
          // if (this.showPagination && result.items.length > 0) {
          //   result.items.map(res => {
          //     if (this.editProps.split(',')) {
          //       this.editProps.split(',').forEach(prop => {
          //         _this.$set(res, prop, false)
          //       })
          //     } else {
          //       this.$set(res, 'edit', false)
          //     }
          //   })
          // } else if (result.length > 0) {
          //   result.items.map(res => {
          //     if (this.editProps.split(',')) {
          //       this.editProps.split(',').forEach(prop => {
          //         _this.$set(res, prop, false)
          //       })
          //     } else {
          //       this.$set(res, 'edit', false)
          //     }
          //   })
          // }
          // if (response && !(response instanceof Array)) {
          //   if (listField && listField.indexOf('.') !== -1) {
          //     listField.split('.').forEach(vv => {
          //       result = result[vv]
          //     })
          //   } else {
          //     result = response[listField]
          //   }
          // }
          // if (!result || !(result instanceof Array)) {
          //   this.loading = false
          //   return false
          // }
          if (this.showPagination) {
            if (this.dataHandler) {
              this.tableData = result.map(this.dataHandler)
            } else {
              this.tableData = result.items
            }
          } else {
            this.tableData = result
          }

          // const totalValue = response
          // if (Object.prototype.toString.call(response) === '[object Array]') {
          //   totalValue = response.length
          // } else if (typeof response === 'object') {
          //   if (totalField && totalField.indexOf('.') !== -1) {
          //     totalField.split('.').forEach(vv => {
          //       totalValue = totalValue[vv]
          //     })
          //   } else {
          //     totalValue = response[totalField]
          //   }
          // } else {
          //   totalValue = 0
          // }

          // 查询结束后清空 table内的params避免 重置外置表单时 之前的查询参数依然存在
          // this.$set(this, 'params', {})
          this.total = result.total
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      emitEventHandler(event) {
        if (event === 'select' || event === 'select-all') {
          this.$set(this, 'selectData', ...Array.from(arguments).slice(1))
        }
        this.$emit(event, ...Array.from(arguments))
      },
      loadLocalData(data) {
        const { autoLoad } = this
        if (!data) {
          this.showPagination = false
          return false
        }
        const cacheData = JSON.parse(JSON.stringify(data))
        this.cacheLocalData = cacheData
        if (autoLoad) {
          this.tableData = this.dataFilter(cacheData)
          this.total = cacheData.length
        }
      },
      getClass(a, b, c) {
        return 'smallCell'
      }
    },
    mounted() {
      // event: expand changed to `expand-change` in Element v2.x
      this.$refs['table'].$on('expand', (row, expanded) => this.emitEventHandler('expand', row, expanded))
      const { type, autoLoad, data, formOptions, params } = this
      if (type === 'remote' && autoLoad) {
        if (formOptions) {
          this.$refs['searchForm'].getParams((error, formParams) => {
            if (!error) {
              this.fetchHandler(Object.assign(formParams, params))
            }
          })
        } else {
          this.fetchHandler(params)
        }
      } else if (type === 'local') {
        this.loadLocalData(data)
      }
    },
    watch: {
      data: function(value) {
        this.loadLocalData(value)
      }
    }
  }
</script>

<style>
body .el-table th.gutter{
    display: table-cell!important;
}
</style>
