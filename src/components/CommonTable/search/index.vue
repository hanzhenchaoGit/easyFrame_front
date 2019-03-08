<template>
  <el-form  :model="params" style ="margin-bottom: -13px;" :inline="inline" ref="form" @submit.native.prevent="searchHandler()"
    :label-width="labelWidth ? (labelWidth + 'px') : ''">
    <el-collapse v-model="activeName" style="text-align:left;border-bottom:0px solid white" v-if="forms&&formType==='collapse'">
      <el-collapse-item  name="1" style="border-bottom:0px solid white">
          <template slot="title">
            <el-form-item label="" style="text-align:left">
              <common-button svgIcon="more">设置查询条件</common-button>
              <common-button v-if="showSearchBtn" svgIcon="search"
                type="primary"
                :size="size"
                @click.stop
                @click.exact="searchHandler"
                :loading="submitLoading">
                {{ submitBtnText }}
              </common-button>
              <common-button type="primary" :plain="true"
                :size="size" v-if="showResetBtn"
                @click.exact="resetForm"
                @click.stop
                svgIcon = "reset"
                :loading="submitLoading">
                {{ resetBtnText }}
              </common-button>
              <slot name="formbutton"></slot>
            </el-form-item>
          </template>
          <el-form-item v-for="(form, index) in forms" :key="index"
            :prop="form.itemType != 'daterange' ? form.prop : (datePrefix + index)"
            :label="form.label" :rules="form.rules || []"
            :label-width="form.labelWidth ? (form.labelWidth + 'px') : ''" :required="form.required">
            <el-input v-if="form.itemType === 'input' || form.itemType === undefined"
              v-model="params[form.modelValue]"
              :size="form.size ? form.size : size"
              :readonly="form.readonly"
              :disabled="form.disabled"
              :placeholder="form.placeholder"
              :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')" />

            <common-select v-else-if="form.itemType === 'select'"
              v-model="params[form.modelValue]"
              :size="form.size ? form.size : size"
              :disabled="form.disabled"
              :url="form.url"
              :key="form.key"
              :nameKey="form.nameKey"
              :valueKey="form.valueKey"
              :multiple="form.multiple"
              :filterable="form.filterable"

              :placeholder="form.placeholder"
              :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')" >

            </common-select>
            <el-date-picker v-else-if="form.itemType === 'date'"
              v-model="params[form.modelValue]"
              :type="form.type||'date'" :placeholder="form.placeholder"
              :size="form.size ? form.size : size"
              :disabled="form.disabled"
              :readonly="form.readonly"
              value-format="yyyy-MM-dd"
              :editable="form.editable"
              :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
              :picker-options="form.pickerOptions || {}" />
            <el-date-picker v-else-if="form.itemType === 'daterange'"
              v-model="params[form.modelValue]"
              :size="form.size ? form.size : size"
              type="daterange" @change="date => changeDate(date, form.prop[0], form.prop[1])"
              :disabled="form.disabled"
              :readonly="form.readonly"
              :editable="form.editable"
              :placeholder="form.placeholder"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
              :picker-options="form.pickerOptions || {}" />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <template v-else>
         <el-form-item v-for="(form, index) in forms" :key="index" :required="form.required"
          :prop="form.itemType != 'daterange' ? form.prop : (datePrefix + index)"
          :label="form.label" :rules="form.rules || []"
          :label-width="form.labelWidth ? (form.labelWidth + 'px') : ''">
          <el-input v-if="form.itemType === 'input' || form.itemType === undefined"
            v-model="params[form.modelValue]"
            :size="form.size ? form.size : size"
            :readonly="form.readonly"
            :disabled="form.disabled"
            :placeholder="form.placeholder"
            :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')" />

           <common-select v-else-if="form.itemType === 'select'"
              v-model="params[form.modelValue]"
              :size="form.size ? form.size : size"
              :disabled="form.disabled"
              :url="form.url"
              :key="form.key"
              :nameKey="form.nameKey"
              :valueKey="form.valueKey"
              :multiple="form.multiple"
              :filterable="form.filterable"

              :placeholder="form.placeholder"
              :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')" >

            </common-select>
          <el-date-picker v-else-if="form.itemType === 'date'"
            v-model="params[form.modelValue]"
            :type="form.type||'date'" :placeholder="form.placeholder"
            :size="form.size ? form.size : size"
            :disabled="form.disabled"
            :readonly="form.readonly"
            value-format="yyyy-MM-dd"
            :editable="form.editable"
            :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
            :picker-options="form.pickerOptions || {}" />
          <el-date-picker v-else-if="form.itemType === 'daterange'"
            v-model="params[form.modelValue]"
            :size="form.size ? form.size : size"
            type="daterange" @change="date => changeDate(date, form.prop[0], form.prop[1])"
            :disabled="form.disabled"
            :readonly="form.readonly"
            :editable="form.editable"
            :placeholder="form.placeholder"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :style="itemStyle + (form.itemWidth ? `width: ${form.itemWidth}px;` : '')"
            :picker-options="form.pickerOptions || {}" />
        </el-form-item>
          <span class="form-buttons">
            <common-button v-if="showSearchBtn"
              type="primary"
              :size="size"
              @click.stop
              svgIcon="search"
              @click.exact="searchHandler"
              :loading="submitLoading">
              {{ submitBtnText }}
            </common-button>
            <common-button type="primary" :plain="true"
              :size="size" v-if="showResetBtn"
              @click.exact="resetForm"
              svgIcon = "reset"
              @click.stop
              :loading="submitLoading">
              {{ resetBtnText }}
            </common-button>
            <slot name="formbutton"></slot>
          </span>
      </template>
  </el-form>
</template>

<script>
  import { formProps } from './props'
  export default {
    name: 'ElSearchForm',
    props: formProps,
    data() {
      const { forms, fuzzy } = this.$props;
      const datePrefix = 'daterange-prefix';
      const selectOptionPrefix = 'select-option-prefix';
      const dataObj = {
        selectOptions: {}
      };
      const params = {};
      const format = {};
      const fuzzyOps = {};
      if (forms) {
        forms.forEach((v, i) => {
          const propType = typeof v.prop;
          if (propType === 'string') {
            v.modelValue = v.prop;
            params[v.prop] = '';
            fuzzyOps[v.prop] = v.fuzzy ? v.fuzzy : fuzzy;
            if (v.format) {
              format[v.prop] = v.format
            }
          } else if (propType === 'object' && Object.prototype.toString.call(v.prop) === '[object Array]') {
            v.prop.forEach(vv => {
              params[vv] = '';
              if (v.format) {
                format[vv] = v.format
              }
              fuzzyOps[vv] = v.fuzzy ? v.fuzzy : fuzzy
            })
          }
          if (v.itemType === 'date') {
            if (v.dateType === 'start' && v.hasDefault) {
              const date = new Date();
              date.setMonth(date.getMonth() - 1);
              params[v.modelValue] = date
            } else if (v.dateType === 'end' && v.hasDefault) {
              params[v.modelValue] = new Date()
            } else if (v.hasDefault) {
              params[v.modelValue] = new Date()
            }
          }
          // 如果有默认值 则默认为今天到上个月的今天
          if (v.itemType === 'daterange' && v.hasDefault) {
            v.modelValue = datePrefix + i;
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            params[v.modelValue] = date;
            params[v.prop[0]] = date;
            params[v.prop[1]] = new Date();
            params[datePrefix + i] = [date, new Date()]
          }
          if (v.itemType === 'select' && (v.selectFetch || v.selectUrl)) {
            const dataKey = selectOptionPrefix + i;
            dataObj.selectOptions[dataKey] = [];
            const { $axios } = this;
            if (!v.selectMethod) {
              v.selectMethod = 'get'
            }
            this.getRemoteData({
              fetch: v.selectFetch ? v.selectFetch : () => {
                return $axios[v.selectMethod](v.selectUrl, v.selectMethod.toLowerCase() === 'get'
                  ? { params: v.selectParams } : v.selectParams)
              },
              dataKey,
              resultField: v.selectResultField || 'result',
              resultHandler: v.selectResultHandler
            })
          }
        })
      }
      return {
        activeName: '',
        params,
        datePrefix,
        selectOptionPrefix,
        ...dataObj,
        format,
        fuzzyOps
      }
    },
    computed: {
      itemStyle() {
        const { itemWidth } = this;
        if (itemWidth) {
          return `width: ${itemWidth}px;`
        }
        return ''
      }
    },
    methods: {
      showAddWindow() {
        this.addBtnFun()
      },
      isArray(value) {
        return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
      },
      searchHandler() {
        this.activeName = '';
        this.getParams((error, params) => {
          if (!error) {
            const { submitHandler } = this;
            if (submitHandler) {
              submitHandler(params)
            } else {
              throw new Error('Need to set attribute: submitHandler !')
            }
          }
        })
      },
      getParamFuzzy() {
        return this.fuzzyOps
      },
      getParams(callback) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const { params, datePrefix, format } = this;
            const formattedForm = {};
            Object.keys(params).forEach(v => {
              if (v.indexOf(datePrefix) === -1 && v !== 'undefined') {
                formattedForm[v] = format[v] ? format[v](params[v], v) : params[v]
              }
            });
            if (callback) callback(null, formattedForm)
          } else {
            if (callback) callback(new Error())
          }
        })
      },
      resetForm() {
        this.$refs['form'].resetFields()
      },
      changeDate(date, startDate, endDate) {
        let dates;
        if (date === null) {
          this.params[startDate] = '';
          this.params[endDate] = '';
          return
        }
        if (typeof date === 'string') {
          dates = date.split(' - ')
        } else if (date && date.hasOwnProperty('length')) {
          const firstDate = date[0];
          const secondDate = date[1];
          dates = [
            `${firstDate.getFullYear()}-${('0' + (firstDate.getMonth() + 1)).substr(-2)}-${('0' + firstDate.getDate()).substr(-2)}`,
            `${secondDate.getFullYear()}-${('0' + (secondDate.getMonth() + 1)).substr(-2)}-${('0' + secondDate.getDate()).substr(-2)}`
          ]
        }
        this.params[startDate] = dates[0];
        this.params[endDate] = dates[1]
      },
      getRemoteData({ fetch, dataKey, resultField, resultHandler }) {
        fetch().then(response => {
          let result = response;
          if (typeof response === 'object' && !this.isArray(response)) {
            if (resultField.indexOf('.') !== -1) {
              resultField.split('.').forEach(vv => {
                result = result[vv]
              })
            } else {
              result = response[resultField]
            }
          }
          if (!result || !(result instanceof Array)) {
            console.warn(`The result of key:${resultField} is not Array. 接口返回的字段:${resultField} 不是一个数组`)
          }
          if (this.resultHandler) {
            this.selectOptions[dataKey] = result.map(this.resultHandler)
          } else {
            this.selectOptions[dataKey] = result
          }
        })
      }
    }
  }
</script>
<style>
.el-collapse{
    border-top: 0px solid #ebeef5;

}
.el-collapse-item__header {
    height: 48px;
    line-height: 48px;
    color: #303133;
    /* cursor: pointer; */
    border-bottom: 0px solid #ebeef5;
    font-size: 13px;
    font-weight: 500;
    /* -webkit-transition: border-bottom-color .3s; */
    transition: border-bottom-color .3s;
    transition-property: border-bottom-color;
    transition-duration: 0.3s;
    transition-timing-function: initial;
    transition-delay: initial;
    outline: 0;
}
.form-buttons {
  height: 46px;
  display: block;
}
.el-collapse-item__wrap {
  will-change: height;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-bottom: 0px solid #ebeef5;
}
</style>
