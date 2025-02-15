<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    searchString?: string
    placeholder?: string
    onSearch?: (searchString: string) => void
  }>(),
  {
    searchString: '',
    placeholder: '',
  },
)

const emit = defineEmits()
const searchStringRef = ref(props.searchString)
watch(searchStringRef, (newSearchString) => {
  emit('search', newSearchString)
})
</script>

<template>
  <input class="search" v-model="searchStringRef" :placeholder="placeholder" />
</template>

<style scoped>
.search {
  outline: none;
  border: 2px solid gray;
  padding: 4px;
}
</style>
