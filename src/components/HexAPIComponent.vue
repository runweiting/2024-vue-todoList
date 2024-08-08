<template>
  <div class="col px-2">
    <div class="container px-0">
      <div class="row gx-0">
        <small>六角學院 - TodoList API</small>
        <AddTodoComponent :inputText="inputText" @add-todo="todosStore.createTodo" />
      </div>
    </div>
    <div class="container px-0 shadow border-0 bg-white" style="border-radius: .5rem !important">
      <div class="row gx-0">
        <div class="col px-0">
          <FilterTodoComponent :todos="todos" :todoStatus="todoStatus"
          @filter-todo="updateTodos"
          />
        </div>
      </div>
      <div class="row gx-0">
        <div class="col" style="padding-inline: 30px; padding-block: 8px;">
          <p v-if="todos.length === 0" class="text-center fs-3 fw-bold mt-3">請先登入</p>
          <TodoListComponent :filterTodos="filterTodos"
          :editTodoId="editTodoId"
          :editTodoText="editTodoText"
          />
          <ClearCompletedComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useTodosStore from '@/stores/TodosStore'
import type { Todo } from '../interfaces/Todo';
import { Status } from '../interfaces/Todo';
import AddTodoComponent from '@/components/AddTodoComponent.vue';
import FilterTodoComponent from './FilterTodoComponent.vue';
import TodoListComponent from './TodoListComponent.vue';
import ClearCompletedComponent from './ClearCompletedComponent.vue';

const todosStore = useTodosStore();
const { todos, inputText, editTodoId, editTodoText } = storeToRefs(todosStore);

const todoStatus = ref<Status>(Status.all);
const filterTodos = ref<Todo[]>([]);
// ===== 篩選 Todos =====
const updateTodos = (todos: Todo[]) => {
  filterTodos.value = todos
}

</script>

<style>
.isDone {
  text-decoration: line-through;
}
</style>