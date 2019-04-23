<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">EasyFrame</h3>
      </div>
      <el-form-item prop="username" >
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="password" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <common-button type="primary" class="login-button" :loading="loading" @click="handleLogin">登录</common-button>
    </el-form>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  mounted() {
    this.$set(this.loginForm, 'username', localStorage.getItem('username'))
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    postLogin(params) {
      this.$store.dispatch('LoginByUsername', params).then(() => {
        this.loading = false
        this.$router.push({ path: '/' })
      }).catch(() => {
        this.loading = false
      })
    },
    handleLogin() {
      // console.log('1111', '')
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postLogin(this.loginForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>
<style>

</style>

<style rel="stylesheet/scss" lang="scss">
$bg:#222928;;
$light_gray:#eee;

.login-button{
  width:100%;
  margin-bottom: 30px;
  height: 42px;
  background:$bg;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: white;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: rgb(56, 49, 49);
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset !important;
        -webkit-text-fill-color: rgb(0, 0, 0) !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(225, 225, 225, 1);
    background: rgba(255, 255, 255, -6.9);;
    border-radius: 5px;
    color: black;
    margin-top:19px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#32373a;
$dark_gray:#32373a;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 320px;
    background: white;
    border: 1px solid white;
    border-radius: 10px;
    padding: 35px 18px 15px 18px;
    margin: 220px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
        font-size: 22px;
    padding: 1px 5px 5px 10px;
    color: #9fa5a9;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      border-width: 0px;
      text-align: center;
      height: 42px;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 36px;
      color: #1ABC9C;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
