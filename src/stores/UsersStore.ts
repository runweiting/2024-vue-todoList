import axios from 'axios'
import { defineStore } from 'pinia'
import type { ApiResponse, ErrorResponse } from '@/interfaces/Response'
import type {
  SigninForm,
  SignupForm,
  SuccessSigninResponse,
  SuccessSignoutResponse,
  UserResponse
} from '@/interfaces/User'
import { config } from '../config/env'
import { successToast, errorToast } from '@/utils/swalToasts'
import useTodosStore from './TodosStore'
import { setTokenCookie, deleteTokenCookie } from '@/utils/tokenCookie'
import { ref } from 'vue'
import type { Ref } from 'vue'

const useUsersStore = defineStore('useUsersStore', () => {
  const isLoggedIn: Ref<boolean> = ref(false)
  const todosStore = useTodosStore()
  const signup = async (form: SignupForm): Promise<void> => {
    const url = `${config.apiUrl}/users/sign_up`
    try {
      await axios.post(url, form)
      successToast('註冊成功')
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  const signin = async (form: SigninForm): Promise<void> => {
    const url = `${config.apiUrl}/users/sign_in`
    try {
      const res: ApiResponse<SuccessSigninResponse> = await axios.post(url, form)
      const token: string = res.data.token
      setTokenCookie(token, 7)
      axios.defaults.headers.common['Authorization'] = token
      await todosStore.getTodos()
      isLoggedIn.value = !isLoggedIn.value
      successToast('登入成功')
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  const checkToken = async (): Promise<void> => {
    const url = `${config.apiUrl}/users/checkout`
    try {
      await axios.get(url)
      successToast('已登入')
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  const signout = async (): Promise<void> => {
    const url = `${config.apiUrl}/users/sign_out`
    try {
      const res: ApiResponse<UserResponse> = await axios.post(url)
      deleteTokenCookie()
      todosStore.deleteTodosFromLocalStorage()
      todosStore.todos = []
      isLoggedIn.value = !isLoggedIn.value
      successToast(res.data.message)
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response
      errorToast(errorResponse.message)
    }
  }

  return {
    isLoggedIn,
    signin,
    signup,
    checkToken,
    signout
  }
})

export default useUsersStore
