<template>
  <div class="col px-2">
    <div class="container px-0">
      <div class="row gx-0">
        <small>六角學院 - TodoList API</small>
        <div class="input-group mt-1 mb-3 shadow border border-white bg-white" style="border: 5px solid white !important; border-radius: .5rem !important">
          <input v-model.trim="inputText" @keyup.enter="todosStore.createTodo(inputText)" type="text" class="form-control border-0" placeholder="新增代辦事項" aria-label="addTodo" aria-describedby="addTodo">
          <button @click="todosStore.createTodo(inputText)" class="btn btn-dark btn-addTodo" type="button">
            <i class="fa-solid fa-plus fs-3"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="container px-0 shadow border-0 bg-white" style="border-radius: .5rem !important">
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
          <p v-if="todos.length === 0" class="text-center fs-3 fw-bold mt-3">請先登入</p>
          <ul class="list-unstyled">
            <li v-for="todo in filterTodos" :key="todo.id" class="d-flex justify-content-between align-items-center todo-bl py-2">
              <div v-if="editTodoId === todo.id">
                <input @keyup.enter="todosStore.updateTodo(editTodoId, editTodoText)" v-model="editTodoText" type="text">
              </div>
              <div v-else class="d-flex gap-4 align-items-center">
                <input @click="todosStore.toggleTodo(todo.id)" v-model="todo.status" type="checkbox" class="checkbox-done">
                <span @dblclick="copyTodo(todo)" :class="{ 'isDone': todo.status }" >{{ todo.content }}</span>
              </div>
              <button @click="todosStore.deleteTodo(todo.id)" type="button" class="btn">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </li>
          </ul>
          <div class="d-flex justify-content-between align-items-center pb-2">
            <small>{{ numOfActive }} 個待完成項目</small>
            <button @click="todosStore.deleteCompletedTodos" type="button" class="btn">
              <small class="text-secondary">清除已完成項目</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import useTodosStore from '@/stores/TodosStore'
import type { Todo } from '../interfaces/Todo';

const todosStore = useTodosStore();
// storeToRefs 從 store 中提取響應式屬性
const { todos, inputText, editTodoId, editTodoText } = storeToRefs(todosStore);

// ===== 編輯指定代辦事項 （複製、更新） =====
const copyTodo = (todo: Todo) => {
  editTodoId.value = todo.id;
  editTodoText.value = todo.content;
}
// ===== 重組資料 computed =====
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
      return todos.value.filter((item) => !item.status)
    case TodoStatus.done:
      return todos.value.filter((item) => item.status)
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
    numOfActive.value = todos.value.filter((item) => !item.status).length;
  }
})
</script>

<style>
.isDone {
  text-decoration: line-through;
}
</style>