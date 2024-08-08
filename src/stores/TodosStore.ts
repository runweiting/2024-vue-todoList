import axios from 'axios'
import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import type { Todo, GetTodosResponse, TodoResponse } from '@/interfaces/Todo'
import type { ApiResponse, ErrorResponse } from '@/interfaces/Response'
import { config } from '../config/env'
import { successToast, warningToast, errorToast } from '@/utils/swalToasts'
declare const Swal: any

const useTodosStore = defineStore('useTodosStore', () => {
  // ===== 定義響應式變數 =====
  interface SweetAlertResult {
    isConfirmed: boolean
    isDenied: boolean
    isDismissed: boolean
  }
  // ref 函數，用於創建響應式引用
  // Ref 類型，用於聲明響應式引用的類型
  const todos: Ref<Todo[]> = ref([])
  const inputText: Ref<string> = ref('')
  const completedTodos: Ref<Todo[]> = ref([])
  const editTodoId: Ref<string | null> = ref(null)
  const editTodoText: Ref<string> = ref('')
  // ===== 設置 LocalStorage =====
  const initializeTodos = (): void => {
    const storedTodos = localStorage.getItem(config.localStorageKeyData)
    if (storedTodos) {
      todos.value = JSON.parse(storedTodos)
    }
  }
  const saveTodosToLocalStorage = (): void => {
    localStorage.setItem(config.localStorageKeyData, JSON.stringify(todos.value))
  }
  const deleteTodosFromLocalStorage = (): void => {
    localStorage.removeItem(config.localStorageKeyData)
  }
  watch(todos, saveTodosToLocalStorage, { deep: true })
  initializeTodos()
  // ===== 取得代辦事項 =====
  const getTodos = async (): Promise<void> => {
    const url = `${config.apiUrl}/todos/`
    try {
      const res: ApiResponse<GetTodosResponse> = await axios.get(url)
      todos.value = res.data.data
    } catch (err: any) {
      const errorResponse: ErrorResponse['message'] = err.response.data.message
      errorToast(errorResponse)
    }
  }
  // ===== 新增代辦事項 =====
  const createTodo = async (content: Todo['content']): Promise<void> => {
    if (!content.trim()) return
    const url = `${config.apiUrl}/todos/`
    try {
      await axios.post(url, { content })
      await getTodos()
    } catch (err: any) {
      const errorResponse: ErrorResponse['message'] = err.response.data
      errorToast(errorResponse)
    }
  }
  // ===== 刪除指定代辦事項 =====
  const deleteTodo = async (todoId: Todo['id']): Promise<void> => {
    const url = `${config.apiUrl}/todos/${todoId}`
    try {
      const res: ApiResponse<TodoResponse> = await axios.delete(url)
      await getTodos()
      successToast(res.data.message)
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  // ===== 清除已完成的代辦事項 (filter 出來的結果，沒有開 delete all API) =====
  const deleteCompletedTodos = () => {
    completedTodos.value = todos.value.filter((todo) => todo.status)
    if (completedTodos.value.length === 0) {
      warningToast('尚無已完成的代辦事項！')
    } else {
      Swal.fire({
        title: '確定刪除所有已完成的代辦事項嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      }).then(async (result: SweetAlertResult) => {
        if (result.isConfirmed) {
          todos.value = todos.value.filter((todo) => todo.status === false)
          deleteCompletedTodos()
          successToast('刪除成功')
        }
      })
    }
  }
  // ===== 編輯指定代辦事項 （複製、更新） =====
  const updateTodo = async (todoId: Todo['id'], content: Todo['content']): Promise<void> => {
    const url = `${config.apiUrl}/todos/${todoId}`
    try {
      const res: ApiResponse<TodoResponse> = await axios.put(url, { content })
      editTodoId.value = null
      editTodoText.value = ''
      await getTodos()
      successToast(res.data.message)
    } catch (err: any) {
      const errorResponse: ErrorResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  // ===== 切換代辦事項狀態 =====
  const toggleTodo = async (todoId: Todo['id']): Promise<void> => {
    const url = `${config.apiUrl}/todos/${todoId}/toggle`
    try {
      const res: ApiResponse<TodoResponse> = await axios.patch(url)
      await getTodos()
      successToast(res.data.message)
    } catch (err: any) {
      const errorResponse: TodoResponse = err.response.data
      errorToast(errorResponse.message)
    }
  }
  // ===== 篩選 activeTodos 並取得 numOfActive =====
  const activeTodos = computed(() => todos.value.filter((todo) => !todo.status))
  const numOfActive = computed(() => activeTodos.value.length)

  return {
    todos,
    getTodos,
    inputText,
    createTodo,
    deleteTodo,
    deleteCompletedTodos,
    editTodoId,
    editTodoText,
    updateTodo,
    toggleTodo,
    deleteTodosFromLocalStorage,
    numOfActive
  }
})
export default useTodosStore
