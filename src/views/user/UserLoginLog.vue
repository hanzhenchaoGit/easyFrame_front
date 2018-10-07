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
       url: '/user/getSysUserloginLogByPager',
       formOptions: {
         inline: true,
         showSearchBtn: true,
         showResetBtn: true,
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
         { prop: 'rolenames', label: '角色', width: 80, showOverflowTooltip: true },
         { prop: 'logindate', label: '登入时间', width: 170, showOverflowTooltip: true },
         { prop: 'logoutdate', label: '登出时间', width: 170, showOverflowTooltip: true },
         { prop: 'loginip', label: 'IP地址', width: 90, showOverflowTooltip: true }
       ]
     }
   },
   mounted() {
   },
   methods: {
   }
 }
  </script>
