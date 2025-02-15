<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string
    type?: string
    placeholder?: string
  }>(),
  {
    value: '',
    type: 'text',
    placeholder: '',
  },
)

const model = defineModel()
</script>

<template>
  <input class="custom-input" v-model="model" :type="type" :placeholder="placeholder" />
</template>

<style scoped></style>
