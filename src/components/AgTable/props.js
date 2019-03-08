const props = {
  url: {
    type: String
  },
  initLoad: {
    type: Boolean,
    default: true
  },
  rowData: {
    type: Array
  },
  columnDefs: {
    type: Array
  },
  rowSelection: {
    type: String
  },
  rowHeight: {
    type: Number
  },
  enableSorting: {
    type: Boolean,
    default: false
  },
  gridOptions: {
    type: Object
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  pageSizes: {
    type: Array,
    default: () => {
      return [20, 30, 50, 100]
    }
  },
  defaultPageSize: {
    type: Number,
    default: 20
  }
}

export default props
