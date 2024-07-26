<template>
  <header>
    <div class="container py-4 px-8">
      <nav class="navbar">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src="../public/logo.png" alt="logo" class="img-fluid">
          </a>
          <h5 class="mb-0 fw-bold">runweiting 的代辦</h5>
        </div>
      </nav>
      <div class="container px-0" style="max-width: 500px;">
        <div class="row gx-0">
          <div class="input-group my-3 shadow border border-white bg-white" style="border: 5px solid white !important; border-radius: .5rem !important">
            <input v-model="inputText" @keyup.enter="addTodo" type="text" class="form-control border-0" placeholder="新增代辦事項" aria-label="addTodo" aria-describedby="addTodo">
            <button @click="addTodo" class="btn btn-dark btn-addTodo" type="button">
              <i class="fa-solid fa-plus fs-3"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="container px-0 shadow border-0 bg-white" style="max-width: 500px; border-radius: .5rem !important">
        <div class="row gx-0">
          <div class="col px-0">
            <div class="d-flex">
              <button
              @click="setTodoStatus(TodoStatus.all)"
              :disabled="todoStatus === TodoStatus.all"
              type="button" class="btn btn-white hvr-bl">全部</button>
              <button
              @click="setTodoStatus(TodoStatus.active)"
              :disabled="todoStatus === TodoStatus.active"
              type="button" class="btn btn-white hvr-bl">待完成</button>
              <button
              @click="setTodoStatus(TodoStatus.done)"
              :disabled="todoStatus === TodoStatus.done"
              type="button" class="btn btn-white hvr-bl">已完成</button>
            </div>
          </div>
        </div>
        <div class="row gx-0">
          <div class="col" style="padding-inline: 30px; padding-block: 8px;">
            <ul class="list-unstyled">
              <li v-for="todo in filterTodos" :key="todo.id" class="d-flex justify-content-between align-items-center todo-bl py-2">
                <div v-if="editTodoId === todo.id">
                  <input @keyup.enter="updateTodo(todo)" v-model="editTodoText" type="text">
                </div>
                <div v-else class="d-flex gap-4 align-items-center">
                  <input v-model="todo.isDone" type="checkbox" class="checkbox-done">
                  <span @dblclick="copyTodo(todo)" :class="{ 'isDone': todo.isDone }" >{{ todo.content }}</span>
                </div>
                <button @click="deleteTodo(todo.id)" type="button" class="btn">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </li>
            </ul>
            <div class="d-flex justify-content-between align-items-center pb-2">
              <small>{{ numOfActive }} 個待完成項目</small>
              <button @click="deleteCompletedTodos" type="button" class="btn">
                <small class="text-secondary">清除已完成項目</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
declare var Swal: any;

// ===== 定義型別 =====
interface SweetAlertResult {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
}
type Todo = {
  id: number,
  content: string,
  isDone: boolean
}
// ===== 從 localStorage 獲取現有代辦事項 =====
const localData = localStorage.getItem('todoList');
const parseData: Todo[] = localData ? JSON.parse(localData) : [];
// ===== 定義響應式變數 =====
const inputText = ref<string>('');
const todos = ref<Todo[]>(parseData);
// ===== 新增代辦事項 =====
const addTodo = () => {
  if (!inputText.value) {
    Swal.fire({
      title: "代辦事項為必填",
      icon: "warning"
    });
    return
  }
  todos.value.push({
    id: Date.now(),
    content: inputText.value,
    isDone: false
  });
  inputText.value = '';
}
// ===== 刪除指定代辦事項 =====
const deleteTodo = (todoId: number) => {
  todos.value = todos.value.filter((item) => item.id !== todoId)
}
// ===== 清除已完成的代辦事項 =====
const deleteCompletedTodos = () => {
  // 這是已完成的代辦
  const completedTodos: Todo[] = todos.value.filter((item) => item.isDone);
  if (completedTodos.length === 0) {
    Swal.fire({
      title: "尚無已完成的代辦事項！",
      icon: "warning"
    })
  } else {
    Swal.fire({
      title: "確定刪除所有已完成的代辦事項嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消"
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        todos.value = todos.value.filter(todo => !todo.isDone);
        Swal.fire({
          title: "刪除成功！",
          icon: "warning"
        })
      }
    })
  }
}
// ===== check 顯示刪除線（done） =====
// ===== 編輯指定代辦事項 （複製、更新） =====
// 渲染input、帶入複製內容
const editTodoId = ref<number | null>(null);
const editTodoText = ref<string>('');
const copyTodo = (todo: Todo) => {
  editTodoId.value = todo.id;
  editTodoText.value = todo.content;
}
const updateTodo = (todo: Todo) => {
  const index: number = todos.value.findIndex((item) => item.id === todo.id);
  if (index === -1) {
    Swal.fire({
      title: "此代辦事項不存在",
      icon: "error"
    })
  }
  todos.value[index].content = editTodoText.value;
  editTodoId.value = null;
  editTodoText.value = '';
}
// ===== 重組資料 computed =====
// 定義 enum 型別：全部、未完成、已完成
enum TodoStatus {
  all,
  active,
  done
};
const todoStatus = ref<TodoStatus>(TodoStatus.all);
const setTodoStatus = (status: TodoStatus) => {
  todoStatus.value = status;
}
// 根據 todoStatus 篩選待辦事項
const filterTodos = computed<Todo[]>(() => {
  switch (todoStatus.value) {
    case TodoStatus.active:
      return todos.value.filter((item) => !item.isDone)
    case TodoStatus.done:
      return todos.value.filter((item) => item.isDone)
    default:
      return todos.value
  }
})
// ===== watchEffect =====
// 監聽 filterTodos 並更新 NumOfActive
const numOfActive = ref<number>(0);
watchEffect(() => {
  if (todoStatus.value === TodoStatus.active) {
    numOfActive.value = filterTodos.value.length
  } else {
    numOfActive.value = todos.value.filter((item) => !item.isDone).length;
  }
})
// 自動儲存
watchEffect(() => {
  localStorage.setItem('todoList', JSON.stringify(todos.value))
})
</script>

<style>
/* {
  outline: 1px solid yellowgreen;
}*/
.isDone {
  text-decoration: line-through;
}
</style>
