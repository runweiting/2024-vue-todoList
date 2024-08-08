<template>
  <div class="input-group mt-1 mb-3 shadow border border-white bg-white" style="border: 5px solid white !important; border-radius: .5rem !important">
    <input v-model.trim="localInputText" @keyup.enter="handleAddTodo" type="text" class="form-control border-0" placeholder="新增代辦事項" aria-label="addTodo" aria-describedby="addTodo">
    <button @click="handleAddTodo" class="btn btn-dark btn-addTodo" type="button">
      <i class="fa-solid fa-plus fs-3"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs, ref, watch } from 'vue'

/* 傳入子元件的 inputText 還是 ref 物件嗎？
1. inputText 在 todosStore 定義為 Ref<string>
2. 當 inputText 從外傳內時，Vue 自動對 ref 進行解包 unwrap，解包後的響應式值 props.inputText，是底層的值類型（如 string, number 等）
3. 在子組件中，props.inputText 是響應式的值，當 store 中的 inputText 更新時，子組件會相應更新，可直接使用 props.inputText，不需 .value
4. 但 inputText 不再是個 ref，解包後的響應式值：只能修改值，不能替換整個屬性，在子組件中是只讀的：不能直接修改 props，這是 Vue 的設計原則
5. 所以在子組件中，須 toRefs 才能在子組件中修改 inputText 的值
*/

const props = defineProps<{ inputText: string }>()
const emits = defineEmits<{
  (e: 'add-todo', value: string): void
}>()
const localInputText = ref(props.inputText)
watch(() => props.inputText, (newValue) => {
  localInputText.value = newValue
})
const handleAddTodo = () => {
  if (localInputText.value.trim()) {
    emits('add-todo', localInputText.value)
    localInputText.value = ''
  }
}


</script>