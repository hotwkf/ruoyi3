<script setup lang="ts">
import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { Lock, User } from "@element-plus/icons-vue";
import { decrypt, encrypt } from "@/utils/jsencrypt";
import useUserStore from "@/store/modules/user";
import type { FormInstance } from "element-plus";

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
  uuid: string;
  code: string;
}

const userStore = useUserStore();
const router = useRouter();

const loginForm = ref<LoginForm>({
  username: "",
  password: "",
  rememberMe: false,
  uuid: "",
  code: "",
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
};

const loading = ref(false);

const redirect = ref(undefined);
const loginReference = ref<FormInstance>();

function handleLogin() {
  loginReference.value?.validate((valid) => {
    if (valid) {
      loading.value = true;
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set("username", loginForm.value.username, { expires: 30 });
        const enPwd = encrypt(loginForm.value.password);
        if (enPwd) {
          Cookies.set("password", enPwd, { expires: 30 });
        }
        if (loginForm.value.rememberMe) {
          Cookies.set("rememberMe", String(loginForm.value.rememberMe), {
            expires: 30,
          });
        }
      } else {
        // 否则移除
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value)
        .then(() => {
          router.push({ path: redirect.value || "/" });
        })
        .catch(() => {
          loading.value = false;
        });
    }
  });
}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password:
      password === undefined
        ? loginForm.value.password
        : decrypt(password) || "",
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
    uuid: "",
    code: "",
  };
}

getCookie();
</script>

<template>
  <div class="login">
    <div class="login-in">
      <div class="login__form">
        <h3 class="login__title">欢迎登录</h3>
        <el-form
          ref="loginReference"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              autocomplete="off"
              placeholder="请输入用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="new-password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px"
            >记住密码</el-checkbox
          >
          <el-form-item style="width: 100%">
            <el-button
              class="login-form__submit"
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  background: url("../assets/images/login/loginBg.png") no-repeat;
  background-size: 100% 100%;
  min-height: 600px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  &-in {
    min-width: 1400px;
    width: 80vw;
    min-height: 600px;
    height: 75vh;
    border-radius: 10px;
    background: url("../assets/images/login/loginIn.png") left top no-repeat
      #fff;
    background-size: contain;
    padding-left: 50%;
    box-sizing: border-box;
  }
  &__title {
    font-size: 48px;
    font-weight: bold;
    color: #3485ff;
    height: 84px;
    border-bottom: 6px solid #3485ff;
    display: inline-block;
    margin-top: 100px;
    margin-bottom: 70px;
  }
  &__form {
    margin: 0 90px;
  }
}
.login-form {
  &__submit {
    font-size: 20px;
    height: 54px;
  }
}
:deep(.el-input__inner) {
  height: 58px;
  line-height: 58px;
  font-size: 20px;
}
:deep(.el-input__prefix) {
  font-size: 24px;
  line-height: 58px;
  width: 56px;
  padding-left: 10px;
}
:deep(.el-form-item__error) {
  font-size: 16px;
}
:deep(.el-form-item) {
  margin-bottom: 30px;
}
:deep(.el-input__suffix-inner > :first-child) {
  font-size: 20px;
}
:deep(.el-button span) {
    font-size: 18px;
}
</style>
