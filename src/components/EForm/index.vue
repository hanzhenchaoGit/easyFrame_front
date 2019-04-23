<template>
  <div>
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item v-for="item of items" :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :rules="item.rules"
      >
        <el-input v-model="form[item.model]"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {}
      }
    }
  }
</script>

<style scoped>

</style>
