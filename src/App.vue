<template>
  <header>
    <div class="container py-4 px-8">
      <nav class="navbar">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="../public/logo.png" alt="logo" class="img-fluid">
          </a>
          <div class="d-flex gap-2 justify-content-end align-items-center">
            <h5 class="mb-0 fw-bold">runweiting 的代辦</h5>
            <span class="badge bg-light text-dark fs-6">{{ isLoggedIn ? "已登入" : "未登入" }}</span>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <section>
    <div class="container px-0" style="max-width: 1000px;">
      <div class="row gx-0">
        <div class="input-group my-2 shadow border border-white bg-white" style="border: 5px solid white !important; border-radius: .5rem !important">
          <!-- 註冊 -->
          <form @submit="handleSignup" class="d-flex justify-content-between gap-2 p-2 w-100">
            <div class="form-floating" style="width: 40%">
              <input v-model="signupEmail" v-bind="signupEmailAttrs" name="email" type="email" class="form-control border border-black border-2" aria-label="email" aria-describedby="email" autocomplete="off" />
              <label for="email" class="form-label">email</label>
              <small class="text-danger">{{ signupErrors.signupEmail }}</small>
            </div>
            <div class="form-floating" style="width: 40%">
              <input v-model="signupPassword" v-bind="signupPasswordAttrs" name="password" type="password" class="form-control border border-black border-2" aria-label="password" aria-describedby="password" autocomplete="new-password" />
              <label for="password" class="form-label">password</label>
              <small class="text-danger">{{ signupErrors.signupPassword }}</small>
            </div>
            <div class="form-floating" style="width: 40%">
              <input v-model="signupNickname" v-bind="signupNicknameAttrs" name="nickname" type="text" class="form-control border border-black border-2" aria-label="nickname" aria-describedby="nickname" autocomplete="off" />
              <label for="password" class="form-label">nickname</label>
              <small class="text-danger">{{ signupErrors.signupNickname }}</small>
            </div>
            <div class="d-flex gap-2" style="width: 20%">
              <button class="btn btn-dark w-100" type="submit">註冊</button>
            </div>
          </form>
        </div>
        <div class="input-group mt-2 mb-4 shadow border border-white bg-white" style="border: 5px solid white !important; border-radius: .5rem !important">
          <!-- 登入 -->
          <form @submit="handleSignin" class="d-flex justify-content-between gap-2 p-2 w-100">
            <div class="form-floating" style="width: 40%">
              <input v-model="signinEmail" v-bind="signinEmailAttrs" name="email" type="email" class="form-control border border-black border-2" aria-label="email" aria-describedby="email" autocomplete="off" />
              <label for="email" class="form-label">email</label>
              <small class="text-danger">{{ signinErrors.signinEmail }}</small>
            </div>
            <div class="form-floating" style="width: 40%">
              <input v-model="signinPassword" v-bind="signinPasswordAttrs" name="password" type="password" class="form-control border border-black border-2" aria-label="password" aria-describedby="password" autocomplete="new-password" />
              <label for="password" class="form-label">password</label>
              <small class="text-danger">{{ signinErrors.signinPassword }}</small>
            </div>
            <div class="d-flex gap-2" style="width: 20%">
              <button class="btn btn-dark w-100" type="submit">登入</button>
              <button @click="usersStore.signout" class="btn btn-secondary w-100" type="button">登出</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="container px-0" style="max-width: 1000px;">
      <div class="row">
        <LocalComponent />
        <HexAPIComponent />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import LocalComponent from './components/LocalComponent.vue';
import HexAPIComponent from './components/HexAPIComponent.vue';
import type { SigninForm, SignupForm } from './interfaces/User';
import useUsersStore from './stores/UsersStore';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { getTokenCookie } from '@/utils/tokenCookie'
import { errorToast, successToast } from '@/utils/swalToasts'

const usersStore = useUsersStore();
const { token } = storeToRefs(usersStore);
const isLoggedIn = ref(false)
onMounted( () => {
  token.value = getTokenCookie();
  if (!token.value) {
    errorToast("請先登入")
  } else {
    successToast("成功登入")
  }
})
usersStore.$subscribe((mutations, state) => {
  if (state.token) {
    isLoggedIn.value = true
  }
})
// ===== Composition API + VeeValidate + Zod =====
// 1. 定義 scheme：鏈式結構，每個方法會對前一個方法返回的值進行驗證
// 若先檢查是否為空，如果為空提示必填，就不會進行格式檢查
const signupSchema = z.object({
  signupEmail: z.string({ message: 'Email 為必填' }).email({ message: "無效的 Email 格式" }),
  signupPassword: z.string({ message: '密碼為必填' }).min(6, { message: '密碼不可小於 6 個字元' }),
  signupNickname: z.string({ message: '匿稱為必填' }).min(1, { message: '匿稱不可小於 1 個字元' })
})
const signinSchema = z.object({
  signinEmail: z.string({ message: 'Email 為必填' }).email({ message: "無效的 Email 格式" }),
  signinPassword: z.string({ message: '密碼為必填' }).min(6, { message: '密碼不可小於 6 個字元' })
})
// 2. 建立表單 useForm：validationSchema 使用 toTypedSchema 將 signupSchema 轉換為驗證架構
const { defineField: defineSignupField, errors: signupErrors, handleSubmit: handleSignupSubmit } = useForm({
  validationSchema: toTypedSchema(signupSchema),
});
const { defineField: defineSigninField, errors: signinErrors, handleSubmit: handleSigninSubmit } = useForm({
  validationSchema: toTypedSchema(signinSchema),
});
// 3. 定義表單欄位：取得該欄位 ref
// const [field, fieldAttrs] = definedField('欄位名稱')
// field 響應式的表單欄位物件，包含該欄位的值(Ref<string | undefined>)、錯誤訊息和驗證狀態
// fieldAttrs 物件，包含該欄位需綁定到表單元素的屬性，用來簡化欄位綁定過程
const [signupEmail, signupEmailAttrs] = defineSignupField('signupEmail');
const [signupPassword, signupPasswordAttrs] = defineSignupField('signupPassword');
const [signupNickname, signupNicknameAttrs] = defineSignupField('signupNickname');
const [signinEmail, signinEmailAttrs] = defineSigninField('signinEmail');
const [signinPassword, signinPasswordAttrs] = defineSigninField('signinPassword');
// 4. handleSubmit 進行表單驗證
const handleSignup = handleSignupSubmit(async (values, { resetForm: signupResetForm }): Promise<void> => {
  if (!signupEmail.value || !signupPassword.value || !signupNickname.value) {
    console.error('Email、密碼或匿稱不能為空');
    return;
  }
  const form: SignupForm = {
    email: signupEmail.value,
    password: signupPassword.value,
    nickname: signupNickname.value
  }
  await usersStore.signup(form);
  signupResetForm();
})
const handleSignin = handleSigninSubmit(async (values, { resetForm: signinResetForm }): Promise<void> => {
  if (!signinEmail.value || !signinPassword.value) {
    console.error('Email 或密碼不能為空');
    return;
  }
  const form: SigninForm = {
    email: signinEmail.value,
    password: signinPassword.value
  };
  await usersStore.signin(form)
  signinResetForm();
})
</script>
