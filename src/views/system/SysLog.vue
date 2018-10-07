<template>
    <div>
        <el-select v-model="value"  placeholder="请选择日志文件" @change="getFile">
            <el-option
            v-for="item in logs"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
        </el-select>
        <common-button type="primary" @click="downloadLog()">下载日志</common-button>
        <el-card class="box-card" v-loading="logging" element-loading-text="正在拼命获取日志" style="min-height:500px">
            <div v-if="currentLog" v-html="currentLog" style="height:750px;overflow:auto;color:white;font-size:10px;font-family:微软雅黑;background:black"></div>
        </el-card>
    </div>
</template>

<script>
import request from '@/utils/request'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      logs: [],
      logging: false,
      value: '',
      currentLog: ''
    }
  },
  mounted() {
    request({
      url: '/system/loglists',
      method: 'get'
    }).then(res => {
      this.logs = res.data
    })
  },
  methods: {
    getFile(v) {
      if (v.indexOf('.gz') === -1) {
        this.logging = true
        request({
          url: '/system/getFile',
          method: 'get',
          params: {
            name: v
          }
        })
          .then(res => {
            this.currentLog = res.data
            this.logging = false
          })
          .catch(() => {})
      } else {
        Message({
          message: '当前日志已归档压缩，请下载后查看',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    downloadLog() {
      window.open(
        this.baseUrl + '/system/downloadLog?filename=' + this.value
      )
    }
  }
}
</script>

<style scoped>
</style>
