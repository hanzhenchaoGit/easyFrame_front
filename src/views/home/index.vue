<template>
  <div>
    <upload ref="upload" uploadUrl="http://localhost:9999/file/upload"></upload>
  </div>
</template>

<script>
import upload from '@/components/CommonUpload'
export default {
  components: { upload },
  data() {
    return {

    }
  },
  mounted() {
    this.$refs.upload.setFileList([
      {
        filename: 'cccccccc',
        url: 'http://localhost:9999/file/getFileById?id=168'
      }, {
        filename: 'cccccccc1',
        url: 'http://localhost:9999/file/getFileById?id=169'
      }
    ])
  }
}
</script>

<style lang="scss" scoped>

</style>
