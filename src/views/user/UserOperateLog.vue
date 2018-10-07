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
       url: '/user/getSysGlobalsqllogByPager',
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
         { prop: 'operate', label: '操作类型' },
         { prop: 'mapperid', label: 'mybatis-mapper', width: 260, showOverflowTooltip: true },
         { prop: 'sql', label: 'sql', width: 260, showOverflowTooltip: true },
         { prop: 'params', label: '参数', width: 80, showOverflowTooltip: true },
         { prop: 'operate', label: '操作' },
         { prop: 'excutetime', label: '执行时长' },
         { prop: 'resultcount', label: '操作记录数', width: 100 }
       ]
     }
   },
   mounted() {
   },
   methods: {
   }
 }
  </script>
