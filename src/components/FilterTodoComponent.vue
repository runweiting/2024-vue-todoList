<template>
  <div class="d-flex">
    <button
    @click="setStatus(Status.all)"
    :disabled="localTodoStatus === Status.all"
    type="button" class="btn btn-white hvr-bl">全部</button>
    <button
    @click="setStatus(Status.active)"
    :disabled="localTodoStatus === Status.active"
    type="button" class="btn btn-white hvr-bl">待完成</button>
    <button
    @click="setStatus(Status.done)"
    :disabled="localTodoStatus === Status.done"
    type="button" class="btn btn-white hvr-bl">已完成</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watchEffect } from 'vue'
import type { Todo } from '../interfaces/Todo';
import { Status } from '../interfaces/Todo';

const props = defineProps<{
  todos: Todo[]
  todoStatus: Status
}>()
const emit = defineEmits<{
  (e: 'filter-todo', value: Todo[]): void
}>()
const localTodoStatus = ref(props.todoStatus)
// ===== 重組資料 computed =====
const setStatus = (status: Status) => {
  localTodoStatus.value = status;
}
const filterTodos = computed<Todo[]>(() => {
  switch (localTodoStatus.value) {
    case Status.active:
      return props.todos.filter((item) => !item.status)
    case Status.done:
      return props.todos.filter((item) => item.status)
    default:
      return props.todos
  }
})
const handleFilterTodos = () => {
  emit('filter-todo', filterTodos.value)
}
watchEffect(() => {
  handleFilterTodos();
})

</script>