<template>
  <ul class="list-unstyled">
    <li v-for="todo in props.filterTodos" :key="todo.id" class="d-flex justify-content-between align-items-center todo-bl py-2">
      <div v-if="props.editTodoId === todo.id">
        <input @keyup.enter="handleUpdateTodo" v-model="localEditTodoText" type="text">
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
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import useTodosStore from '@/stores/TodosStore';
import type { Todo } from '@/interfaces/Todo'

const props = defineProps<{
  'filterTodos': Todo[]
  'editTodoId': string | null
  'editTodoText': string
}>()
const todosStore = useTodosStore()
const localEditTodoId = ref(props.editTodoId)
const localEditTodoText = ref(props.editTodoText)
// ===== 編輯指定代辦事項 （複製、更新） =====
const copyTodo = (todo: Todo) => {
  localEditTodoId.value = todo.id;
  localEditTodoText.value = todo.content;
}
const handleUpdateTodo = () => {
  if (localEditTodoId.value) {
    todosStore.updateTodo(localEditTodoId.value,
      localEditTodoText.value
    )
  }
}
</script>