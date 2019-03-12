<template>
    <el-button
    v-waves
    :type="type"
    :size="size"
    :plain ="plain"
    :round ="round"
    :circle="circle"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :svgIcon="svgIcon"
    :autofocus="autofocus"
    :native-type="nativeType"
    @click="(ev)=>handlerClick(ev)"
    >
      <svg-icon v-if="svgIcon" :icon-class='svgIcon'></svg-icon><slot></slot>
    </el-button>
</template>

<script>
  export default {
    name: 'CommonButton',
    props: {
      type: String,
      size: String,
      plain: {
        type: Boolean,
        default: false
      },
      svgIcon: {
        type: String,
        default: ''
      },
      round: {
        type: Boolean,
        default: false
      },
      circle: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      icon: String,
      autofocus: {
        type: Boolean,
        default: false
      },
      nativeType: {
        type: String,
        default: 'button'
      }
    },
    methods: {
      handlerClick(ev) {
        if (this.$el.innerText !== '登录') {
          // this.$request({
          //   url: 'user/addSysUserFrontlog',
          //   method: 'post',
          //   data
          // }).then(response => {
          //   if (response.success) {
          //   // console.log('日志记录成功')
          //   }
          // })
        }

        this.$emit('click', ev)
      }
    }
  }
</script>

<style scoped>

</style>
