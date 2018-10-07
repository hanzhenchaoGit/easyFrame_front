<template>
  <div>
    <el-card >
      <common-table ref="table" height="66vh" show-overflow-tooltip :url="url" :columns="columns" fit autoLoad :formOptions="formOptions"  >
      </common-table>
      </el-card>
    </div>
  </template>

<script>
 export default {
   data() {
     return {
       url: '/user/getSysUserFrontlogByPager',
       formOptions: {
         inline: true,
         showSearchBtn: true,
         submitBtnText: '查询',
         resetBtnText: '重置',
         forms: [
           { prop: 'username', label: '用户姓名' }
         ]
       },
       columns: [
         { prop: 'id', label: 'id', width: 50 },
         { prop: 'userid', label: '用户名', width: 100, showOverflowTooltip: true },
         { prop: 'username', label: '用户姓名', width: 100, showOverflowTooltip: true },
         { prop: 'type', label: '分类', width: 80 },
         { prop: 'operateName', label: '操作名称', width: 200, showOverflowTooltip: true },
         { prop: 'routerName', label: '页面名称', width: 120, showOverflowTooltip: true },
         { prop: 'routerPath', label: '路由路径', width: 160, showOverflowTooltip: true },
         { prop: 'ipaddress', label: 'IP地址', width: 90, showOverflowTooltip: true },
         { prop: 'operateTime', label: '操作时间', width: 170 }
       ]
     }
   },
   mounted() {
   },
   methods: {
   }
 }
  </script>
