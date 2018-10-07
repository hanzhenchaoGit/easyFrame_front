<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span style="font-size:14px">您好![{{name}}]</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="showModifyPassWindow" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">系统登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="setWindow" width="40%">
      <div slot="title" >
          密码修改
      </div>
      <el-form ref="passform" inline status-icon :model="userForm" :rules="passrules">
        <el-form-item label="新密码" prop="password1" >
          <el-input type="password" v-model="userForm.password1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" >
          <el-input type="password" v-model="userForm.password2"></el-input>
        </el-form-item>
        <el-form-item>
          <common-button type="primary" @click="modifyPassword">修改密码</common-button>
          <common-button type="primary" @click="setWindow = false">取消</common-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-menu>

</template>

<script>

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ImageCropper from '@/components/ImageCropper'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.userForm.password2 !== '') {
          this.$refs.passform.validateField('password2')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.userForm.password1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      setWindow: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      uploadUrl: '/file/uploadAvatar',
      userForm: {
        password1: '',
        password2: ''
      },
      passrules: {
        password1: [
          { validator: validatePass, trigger: 'blur', required: true }
        ],
        password2: [
          { validator: validatePass2, trigger: 'blur', required: true }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    ImageCropper
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'user',
      'avatar'
    ])
  },
  methods: {
    modifyPassword() {
      this.$refs.passform.validate(valid => {
        if (valid) {
          const data = {
            username: this.user,
            password: this.userForm.password1
          }
          this.$request({
            url: '/user/modifyPassword',
            method: 'post',
            data
          }).then(response => {
            this.returnMsg(this, response)
          })
        }
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    cropSuccess(res) {
      this.$store.dispatch('SetAvatar', res)
    },
    close() {
      this.imagecropperShow = false
    },
    showModifyPassWindow() {
      this.setWindow = true
      this.$nextTick(() => {
        this.$refs.passform.resetFields()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.image {
  width: 100%;
  display: block;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
