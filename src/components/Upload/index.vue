<template>
  <div>
    <el-dialog title="上传附件" v-bind:modal-append-to-body="false" :visible.sync="uploadWindow" width="40%"  close-on-click-modal close-on-press-escape>
      <el-form :model="file" ref="uploadForm">
        <el-form-item prop="fileremark" label="文件描述" required>
          <el-input v-model="file.fileremark" placeholder="请输入文件描述"></el-input>
        </el-form-item>
        <common-button @click="selectFile()"><svg-icon icon-class="upload"></svg-icon>选择附件</common-button>
        选择后自动上传
      </el-form>
    </el-dialog>
    <el-upload
      ref="upload"
      :action="uploadUrl"
      :data="file"
      :show-file-list="showFileList"
      :on-remove="deleteFile"
      with-credentials
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :file-list="list"
      :accept="accept"
      :disabled = "disabled"
      >
        <common-button ref="selectFile"  v-show="false"><svg-icon icon-class="upload"></svg-icon></common-button>
        <common-button @click.stop @click="openRemarkWindow"><svg-icon icon-class="upload"></svg-icon>上传附件</common-button>
      <div slot="tip" class="el-upload__tip" style="color:red">文件格式限制{{limitTypes}},文件大小不能超过{{limitFileSize}}M</div>
    </el-upload>
  </div>
</template>

<script>
  import props from './props'
  export default {
    name: 'Upload',
    props,
    data() {
      return {
        uploadWindow: false,
        file: {
          fileremark: '',
          groupid: ''
        },
        list: []
      }
    },
    // watch: {
    //   'file.groupid'(n, o) {
    //     this.getFileList()
    //   }
    // },
    methods: {
      getFileList() {
        console.log(1111111111)
        if (this.file.groupid) {
          this.$request({
            url: '/file/getFileList',
            params: {
              groupid: this.file.groupid
            }
          }).then(response => {
            const fileList = response.data.map(d => {
              return {
                name: '【' + d.fileremark + '】' + d.filename,
                url: d.fileurl,
                fileid: d.id
              }
            })
            this.$set(this, 'list', fileList)
            // dom挂载完毕执行渲染
            setTimeout(() => {
              const files = this.$refs.upload.$el.children[2].children
              for (let i = 0; i < files.length; i++) {
                files[i].innerHTML = files[i].innerHTML.replace('<a class="el-upload-list__item-name">',
                  `<a class="el-upload-list__item-name" href="${fileList[i].url}" download="${fileList[i].name}">`)
              }
            }, 3000)
          })
        }
      },
      deleteFile(file, fileList) {
        this.$request({
          url: '/file/deleteFileById',
          params: {
            id: file.fileid
          }
        }).then(response => {
          this.returnMsg(this, response)
          return true
        })
      },
      beforeUpload(file) {
        let isvalid = false
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        this.$refs.uploadForm.validate(valid => {
          if (!valid) return false
          isvalid = valid

          const isLtM = file.size / 1024 / 1024 < this.limitFileSize * 10
          if (this.limitTypes !== '') {
            const typeCheck = this.limitTypes.indexOf(fileType) > -1
            if (!typeCheck) {
              this.$message({
                message: '上传文件只能是 ' + this.limitTypes + '格式!',
                type: 'warning'
              })
            }
          }

          if (!isLtM) {
            this.$message({
              message: '上传文件大小不能超过 ' + this.limitFileSize + 'MB!',
              type: 'warning'
            })
          }
          if (this.limitTypes !== '') {
            const typeCheck = this.limitTypes.indexOf(fileType) > -1
            if (!typeCheck) {
              this.$message({
                message: '上传文件只能是 ' + this.limitTypes + '格式!',
                type: 'warning'
              })
            }
            isvalid = typeCheck && isLtM
          } else {
            isvalid = isLtM
          }
        })
        if (isvalid) {
          return true
        } else {
          return false
        }
      },
      selectFile() {
        this.$refs.uploadForm.validate(valid => {
          if (!valid) return
          this.$refs.selectFile.$el.click()
        })
      },
      openRemarkWindow() {
        this.uploadWindow = true
        this.$nextTick(() => {
          this.$refs.uploadForm.resetFields()
        })
      },
      onSuccess(response, file, fileList) {
        const groupid = response.data.groupid
        this.file.groupid = groupid
        this.getFileList()
        this.uploadWindow = false
      },
      getGroupId() {
        return this.file.groupid
      },
      setGroupId(groupid) {
        this.$set(this.file, 'groupid', groupid)
      }
    }
  }
</script>

<style scoped>

</style>
