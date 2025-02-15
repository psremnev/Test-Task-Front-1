<script setup lang="ts">
import { DIALOG_TYPE } from '@/constants'
import Button from './Button.vue'

withDefaults(
  defineProps<{
    type?: string
    title?: string
    footerBtnSet?: {
      positive: { title: string; readonly: boolean }
      negative: { title: string; readonly: boolean }
    }
    minWidth?: number
    minHeight?: number
  }>(),
  {
    type: DIALOG_TYPE.BASE,
    footerBtnSet: () => ({
      positive: { title: 'ОК', readonly: false },
      negative: { title: 'Отмена', readonly: false },
    }),
    minWidth: 400,
    minHeight: 300,
  },
)
</script>

<template>
  <div class="modalDialogBackground">
    <div class="modalDialog" :style="{ minWidth: `${minWidth}px`, minHeight: `${minHeight}px` }">
      <header class="modalDialog_header" v-if="title">
        <span>{{ title }}</span>
      </header>
      <main class="modalDialog_content">
        <slot>Пока тут пусто</slot>
      </main>
      <footer class="modalDialog_footer">
        <div v-if="type === DIALOG_TYPE.BASE" class="modalDialog_footer_base">
          <Button
            :title="footerBtnSet.negative.title"
            @click="$emit('release', false)"
            :readonly="footerBtnSet.negative.readonly"
          ></Button>
          <Button
            :title="footerBtnSet.positive.title"
            @click="$emit('release', true)"
            :readonly="footerBtnSet.positive.readonly"
          ></Button>
        </div>
        <slot v-if="type === DIALOG_TYPE.CUSTOM" name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modalDialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  display: flex;
  flex-direction: column;
}

.modalDialogBackground {
  background-color: #9696964f;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.modalDialog_header {
  text-align: center;
}

.modalDialog_footer_base {
  display: flex;
  justify-content: space-between;
}

.modalDialog_header,
.modalDialog_footer,
.modalDialog_content {
  padding: 6px;
}

.modalDialog_content {
  border: 2px solid;
  flex-grow: 1;
}

.modalDialog_header {
  border-top: 2px solid;
  border-left: 2px solid;
  border-right: 2px solid;
}

.modalDialog_footer {
  border-bottom: 2px solid;
  border-left: 2px solid;
  border-right: 2px solid;
}
</style>
