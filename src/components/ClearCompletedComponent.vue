<template>
  <div class="d-flex justify-content-between align-items-center pb-2">
    <small>{{ todosStore.numOfActive }} 個待完成項目</small>
    <button @click="todosStore.deleteCompletedTodos" type="button" class="btn">
      <small class="text-secondary">清除已完成項目</small>
    </button>
  </div>
</template>

<script setup lang="ts">
import useTodosStore from '@/stores/TodosStore';

const todosStore = useTodosStore()

</script>