<template>
    <el-select
    :value="value"
    style="width:100%"
    :multiple="multiple"
    :filterable="filterable"
    @input="change($event)"
    :disabled="disabled"
    @change="(value) => emitEventHandler('change', value)"
    @visible-change="(value) => getRemoteData('visible-change', value)"
    @remove-tag="(value) => emitEventHandler('remove-tag', value)"
    :loading="remoteLoading"
    :placeholder="placeholder"
    >
      <el-option v-if="url"
        v-for="item in remoteData"
        :key="item[keyKey]"
        :label="item[nameKey]"
        :value="item[valueKey]"
        >
        <span style="margin-right:3px" v-for="field in fields" :key="item[field]">{{item[field]}}</span>
      </el-option>
      <slot else>
      </slot>
    </el-select>
</template>

<script>
    import request from '@/utils/request'
    import props from './props'
    export default {
      props,
      data() {
        return {
          remoteData: [],
          remoteLoading: false,
          textName: '',
          selectData: ''
        }
      },
      mounted() {
        if (this.value) {
          this.setDataAndTextName(this.value)
        }
        this.$nextTick(() => {
          if (this.initLoad && this.url) {
            if (this.cascadingKey) {
              this.loadData(this.cascadingKey + '=' + this.cascadingValue)
            } else {
              this.loadData()
            }
          }
        })
      },
      watch: {
        value(n, o) {
          this.setDataAndTextName(n)
        },
        cascadingValue(n, o) {
          if (this.cascadingKey) {
            this.loadData(this.cascadingKey + '=' + this.cascadingValue)
          } else {
            this.loadData()
          }
        }
      },
      methods: {
        change(val) {
          this.$emit('input', val)
          this.setDataAndTextName(val)
        },
        loadData(param) {
          this.remoteLoading = true
          if (this.url) {
            const queryUrl = this.url
            let data = {}
            data = param || this.params
            request({
              url: queryUrl,
              method: 'post',
              data
            }).then(response => {
              this.$emit('load', response.data)
              this.remoteLoading = false
              if (response.data != null) {
                this.remoteData = response.data
              }
              // 为了防止下拉数据获取之前赋值selectData 在此处再Set一次
              this.setDataAndTextName(this.value)
            }).catch(error => {
              console.log(error)
              this.remoteLoading = false
            })
          }
        },
        getRemoteData(event, value) {
          if (value) {
            if (this.url && this.remoteData.length === 0) {
              this.loadData()
            }
          }
          this.emitEventHandler(event, ...Array.from(arguments).slice(1))
        },
        setDataAndTextName(value) {
          let obj = {}
          if (this.url) {
            obj = this.remoteData.find((item) => {
              return item[this.valueKey] === value
            })
          } else {
            obj = this.data.find((item) => {
              return item[this.valueKey] === value
            })
          }
          this.selectData = obj
        },
        emitEventHandler(event) {
          let args = []
          if (event === 'change') {
            args = Array.from(arguments)
            args.push(this.selectData)
          }
          this.$emit(event, ...args)
        },
        queryData(q) {
        },
        getSelectData() {
          return this.selectData
        }
      }
    }
</script>

<style scoped>

</style>
