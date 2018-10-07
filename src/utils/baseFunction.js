exports.install = function(Vue, options) {
  Vue.prototype.returnMsg = function(v, res) {
    const h = this.$createElement
    if (res.success) {
      v.$notify({
        title: '提示',
        position: 'top-left',
        type: 'success',
        message: h('i', {}, '操作成功！')
      })
    } else {
      v.$notify({
        title: '提示',
        position: 'top-left',
        type: 'error',
        message: h('i', {}, '操作失败！' + res.msg)
      })
    }
  }
  Vue.prototype.showWindow = function(ve, form, formShowKey, objKey) {
    // console.log(ve, form, formShowKey)
    ve[objKey] = {}
    ve[formShowKey] = true
  }
  Vue.prototype.resetFormAndShow = function(ve, form, formShowKey, objKey) {
    ve[objKey] = {}
    ve[formShowKey] = true
    setTimeout(() => {
      ve.$refs[form].resetFields()
      ve[objKey] = {}
    }, 1)
  }
  Vue.prototype.resetFormAndShowData = function(ve, form, formShowKey, objKey, data, o) {
    ve[formShowKey] = true
    setTimeout(() => {
      ve.$refs[form].resetFields()
      ve[objKey] = {}
      ve[objKey] = o.assign({}, data)
    }, 1)
  }
}
