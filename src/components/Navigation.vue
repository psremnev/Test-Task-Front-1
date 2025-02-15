<script setup lang="ts">
import { DIRECTIONS } from '@/constants'
import Button from './Button.vue'
import Header from './Header.vue'

const props = withDefaults(
  defineProps<{
    maxPage?: number
    page?: number
  }>(),
  {
    maxPage: 1,
    page: 1,
  },
)
const emit = defineEmits()
let currentPage = 1
const setPage = (direction: string) => {
  if (direction == DIRECTIONS.BACKWARD && currentPage !== 1) {
    currentPage--
  } else if (direction == DIRECTIONS.FORWARD && currentPage !== props.maxPage) {
    currentPage++
  }
  emit('pageChange', currentPage)
}
</script>

<template>
  <div class="navigation">
    <Button
      icon="fa fa-arrow-left"
      :hasBorder="false"
      @click="() => setPage(DIRECTIONS.BACKWARD)"
    />
    <Header class="navigation_header" :text="`Страница ${page}`" textColor="gray" />
    <Button
      icon="fa fa-arrow-right"
      :hasBorder="false"
      @click="() => setPage(DIRECTIONS.FORWARD)"
    />
  </div>
</template>

<style scoped>
.navigation_header {
  padding: 6px;
}
</style>
