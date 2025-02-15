<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
    textColor?: string
  }>(),
  {
    text: '',
    textColor: 'black',
  },
)
</script>

<template>
  <span :style="{ color: textColor }" class="header">{{ text }}</span>
</template>

<style scoped></style>
