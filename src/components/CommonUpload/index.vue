<template>
  <div>
    <el-upload
      ref="upload"
      :class="uploadType==='avatar'?'avatar-uploader' : ''"
      :action="uploadUrl"
      v-bind:show-file-list="false"
      with-credentials
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :accept="accept"
      :disabled="disabled"
      >
      <div v-if="!disabled">
        <common-button v-if="uploadType==='list' || uploadType==='imgWall'"><svg-icon icon-class="upload"></svg-icon>选择文件</common-button>
        <i v-show="uploadType==='avatar' && list.length === 0" class="el-icon-plus avatar-uploader-icon"></i>
        <img v-if="list.length>0 && uploadType==='avatar'" :src="list[0].url" class="avatar"/>
      </div>
    </el-upload>
    <el-dialog :title="查看图片"
      :visible.sync="priviewVible" width="70%"
      style="height:600px">
      <el-carousel ref="carousel" :interval="-1" :initial-index="current" type="card">
        <el-carousel-item v-for="(item, index) in list" :key="index">
          <img :src="item.url" class="carousel_img"/>
          <div class="title">{{ item.filename }}</div>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
    <div class="article" v-if="list.length > 0 && uploadType==='imgWall'">
      <div class="item" @mouseenter="enter(index)" @mouseleave="leave(index)" v-for="(f, index) in list" :key="f.id">
        <div class="preBlock">
          <img class="preview" :src="f.url" id="preview" alt="" :name="f.name" width="190" height="190">
        </div>
        <div class="preBlock modal" v-show="!disabled&&seen&&current===index" >
          <div class="modal-box">
            <div>
              <a :href="f.url" :download="f.filename"><i class="el-icon-download operate"></i></a>
            </div>
            <div>
              <a href="#" @click="remove(index)"><i class="el-icon-circle-close operate"></i></a>
            </div>
            <div>
              <a href="#" @click="priview(index)"><i class="el-icon-view operate"></i></a>
            </div>
          </div>
        </div>
      </div>
    <div style="clear: left;"></div>
    </div>
    <ul class="el-upload-list el-upload-list--text" v-show="uploadType==='list'" v-for="(f, index) in list" :key="f.id">
      <li tabindex="0" class="el-upload-list__item is-success">
        <a class="el-upload-list__item-name" :href="f.url" :download="f.filename">
          <i class="el-icon-document"></i>{{f.filename}}</a>
          <label class="el-upload-list__item-status-label">
            <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
          <i class="el-icon-close" @click="remove(index)"></i>
        </li>
    </ul>
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
        list: [],
        current: 0,
        seen: false,
        priviewVible: false
      }
    },
    methods: {
      priview(index) {
        this.priviewVible = true
        this.$nextTick(() => {
          this.$refs.carousel.setActiveItem(index)
        })
      },
      remove(index) {
        this.list.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.seen = false
      },
      enter(index) {
        this.current = index
        this.seen = true
      },
      leave(index) {
        this.seen = false
      },
      beforeUpload(file) {
        let isvalid = false
        const isLtM = file.size / 1024 / 1024 < this.limitFileSize * 10

        if (!isLtM) {
          this.$message({
            message: '上传文件大小不能超过 ' + this.limitFileSize + 'MB!',
            type: 'warning'
          })
          isvalid = false
        } else {
          isvalid = true
        }
        return isvalid
      },
      onSuccess(response, file, fileList) {
        if (this.uploadType === 'avatar') {
          this.list = [{
            id: response.data.id,
            filename: response.data.filename,
            url: `http://localhost:9999/file/getFileById?id=${response.data.id}`
          }]
        } else {
          this.list.push({
            id: response.data.id,
            filename: response.data.filename,
            url: `http://localhost:9999/file/getFileById?id=${response.data.id}`
          })
        }
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
        console.log(this.list)
      },
      getFileList() {
        return this.list
      },
      setFileList(fList) {
        this.list = fList
      }
    }
  }
</script>

<style scoped lang="scss">
  .article {
    border: 1px solid #ccc;
    padding: 3px;
    min-height: 180px;
    .item {
        width: 150px;
        height: 150px;
        float: left;
        position: relative;
        margin: 10px;
    }
  }
  .preview, .preBlock {
      position: absolute;
      display: block;
      width: 150px;
      height: 150px;
      left: 0;
      top: 0;
  }
  .preBlock img {
    display: block;
    width: 150px;
    height: 150px;
  }
  .preview, .preBlock {
    position: absolute;
    display: block;
    width: 150px;
    height: 150px;
    left: 0;
    top: 0;
  }
  .modal {
    background: #292424;
    opacity: 0.7;
  }
  .modal-box {
    display: inline-flex;
    height:22px;
    margin-top: 60px;
    div {
      width: 50px;
      text-align: center;
      font-size: 20px;
      line-height: 22px;
    }
  }
  .operate {
    color: white;
  }
  .operate:hover {
    color: #847c7c;
    cursor: pointer;
  }
  .el-carousel__container {
    height: 600px;
  }
  .carousel_img {
    height: 100%;
  }
  .el-carousel__item {
    text-align: center;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }
  .title {
    position: relative;
    margin-bottom: 10px;
  }


  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 178px;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .nav-zi {
    border: 1px solid #EDEDED;
    padding-left: 40px;
    margin-left: 10px;
    padding-right: 20px;
    margin-right: 10px;
    display: block;
    line-height: 40px;
    -webkit-transition: all 0.6s ease-in;
    -moz-transition: all 0.6s ease-in;
    -ms-transition: all 0.6s ease-in;
    -o-transition: all 0.6s ease-in;
    transition: all 0.6s ease-in;
}
</style>
