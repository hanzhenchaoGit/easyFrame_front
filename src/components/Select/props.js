const props = {
  size: String,
  value: null,
  url: String,
  fields: {
    type: Array,
    default() {
      return ['name']
    }
  },
  cascadingValue: {
    type: String,
    default: ''
  },
  cascadingKey: {
    type: String,
    default: ''
  },
  // 默认初始化加载下拉数据
  initLoad: {
    type: Boolean,
    default: true
  },
  data: {
    type: Array,
    default() {
      return []
    }
  },
  multiple: Boolean,
  disabled: Boolean,
  keyKey: String,
  valueKey: {
    type: String,
    default: 'value'
  },
  nameKey: {
    type: String,
    default: 'name'
  },

  clearable: Boolean,
  collapseTags: Boolean,
  multipleLimit: Number,
  name: String,
  autoComplete: String,
  placeholder: String,
  filterable: Boolean,
  allowCreate: Boolean,
  filterMethod: Function,
  remote: Boolean,
  // remoteMethod: Function,
  loading: Boolean,
  loadingText: String,
  noMatchText: String,
  noDataText: String,
  popperClass: String,
  reserveKeyword: Boolean,
  defaultFirstOption: Boolean,
  popperAppendToBody: Boolean,
  automaticDropdown: Boolean
}
export default props
