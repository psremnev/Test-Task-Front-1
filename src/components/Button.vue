<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    icon?: string
    textColor?: string
    readonly?: boolean
    hasBorder?: boolean
  }>(),
  {
    title: '',
    icon: '',
    textColor: '',
    readonly: false,
    hasBorder: true,
  },
)
</script>

<template>
  <button :style="{ border: hasBorder ? '2px solid' : 'none' }" class="btn" :disabled="readonly">
    <div :class="icon">{{ title }}</div>
  </button>
</template>

<style scoped>
.btn {
  cursor: pointer;
  background: #fff;
}
</style>
