<script setup lang="ts">
import type { ISource } from '@/types/ISource'
import type { IFilter } from '@/types/IFilter'
import { type INavigation } from '@/types/INavigation'
import type { IHeaderColumn } from '@/types/IHeaderColumn'
import type { IColumn } from '@/types/IColumn'
import Button from './Button.vue'
import { COLUMN_TYPE, SORT_TYPE } from '@/constants'
import Header from './Header.vue'
import { reactive, ref, watch, type Reactive } from 'vue'
import type { IOrganization } from '@/types/IOrganization'
import Navigation from './Navigation.vue'

const props = withDefaults(
  defineProps<{
    source: ISource
    nav: INavigation
    filter: IFilter
    headerColumns?: IHeaderColumn[]
    columns: IColumn[]
    onItemsReady: (items: Reactive<IOrganization[]>) => void
  }>(),
  {
    nav: () => ({
      pageSize: 2,
      page: 1,
    }),
    filter: () => ({ searchString: '' }),
  },
)

const emit = defineEmits()

// срез для отображения списка по страницам
const pages = ref({
  start: 0,
  end: 2,
})
const sortClass = ref('')
const data = props.source.method()
const collections = reactive(data ? [...data] : [])
props.onItemsReady(collections)

const getMaxPage = () => {
  return collections.length / props.nav.pageSize
}
const maxPage = ref(getMaxPage())
const currentPage = ref(1)
const sortType = ref(SORT_TYPE.ASC)
const onSortChange = (header: IHeaderColumn) => {
  if (header.hasSort) {
    sortType.value = sortType.value === SORT_TYPE.DESC ? SORT_TYPE.ASC : SORT_TYPE.DESC
    emit('sort', header, sortType.value)
    sortClass.value = sortType.value === SORT_TYPE.ASC ? 'fa fa-arrow-down' : 'fa fa-arrow-up'
  }
}

const onPageChange = (page: number) => {
  const newPageEnd = page * props.nav.pageSize
  const newPageStart = newPageEnd - props.nav.pageSize
  if (collections.slice(newPageStart, newPageEnd).length) {
    props.nav.page = page

    // Обновляем номер страницы в навигации
    currentPage.value = page

    pages.value.end = newPageEnd
    pages.value.start = newPageStart
  }
}

watch(
  collections,
  () => {
    maxPage.value = getMaxPage()
  },
  { deep: true },
)
</script>

<template>
  <table class="tableList">
    <tr v-if="headerColumns" class="tableList_header">
      <td v-for="header in headerColumns">
        <div :class="['tableList_header_td', header.hasSort ? 'tableList_header_tdsort' : '']">
          <Header @click="() => onSortChange(header)" :text="header.title" textColor="gray" />
          <div v-if="header.hasSort" :class="sortClass" :style="{ color: 'gray' }" />
        </div>
      </td>
    </tr>
    <tr v-if="collections.length" v-for="organization in collections.slice(pages.start, pages.end)">
      <td v-for="column in columns">
        <span v-if="column.type === COLUMN_TYPE.TEXT">{{
          organization[`${column.textModelField}`]
        }}</span>
        <Button
          v-if="column.type === COLUMN_TYPE.BUTTON"
          :icon="column.icon"
          :hasBorder="false"
          @click="$emit(`${column.btnEventName}`, organization)"
        />
      </td>
    </tr>
    <span v-if="collections.length === 0" class="tableList_empty">Ничего не найдено</span>
  </table>
  <div class="tableList_navigation">
    <Navigation @pageChange="onPageChange" :page="currentPage" :maxPage="maxPage"></Navigation>
  </div>
</template>

<style scoped>
.tableList > .tableList_header,
table,
td,
th {
  border-collapse: collapse;
  border: 2px solid rgb(184, 184, 184);
}

.tableList_header_td {
  display: flex;
  align-items: baseline;
}

.tableList_header_tdsort {
  cursor: pointer;
}

.tableList {
  width: 100%;
}

.tableList_header_td > span {
  margin-right: 10px;
}

.tableList_navigation {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
