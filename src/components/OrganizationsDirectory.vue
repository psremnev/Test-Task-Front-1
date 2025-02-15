<script setup lang="ts">
import { reactive, ref, watch, type Reactive } from 'vue'
import Button from './Button.vue'
import Search from './Search.vue'
import organizations from '@/data/organizations'
import TableList from './TableList.vue'
import getOrganizations from '@/api/getOrganizations'
import { COLUMN_TYPE, SORT_TYPE } from '@/constants'
import ModalDialog from './ModalDialog.vue'
import Input from './Input.vue'
import type { IOrganization } from '@/types/IOrganization'
import type { IHeaderColumn } from '@/types/IHeaderColumn'

withDefaults(
  defineProps<{
    header?: string
  }>(),
  {
    header: '',
  },
)

const source = {
  method: getOrganizations,
}

let collections: Reactive<IOrganization[]> = reactive([])

const navigation = {
  pageSize: 2,
}

const filter = {
  searchString: '',
}

const okBtnReadOnly = ref(true)

const modalDialogVisible = ref(false)
const columns = [
  {
    type: COLUMN_TYPE.TEXT,
    textModelField: 'title',
  },
  {
    type: COLUMN_TYPE.TEXT,
    textModelField: 'director',
  },
  {
    type: COLUMN_TYPE.TEXT,
    textModelField: 'phone',
  },
  {
    type: COLUMN_TYPE.BUTTON,
    icon: 'fa fa-trash',
    btnEventName: 'delete',
  },
]

const headerColumns = [
  {
    id: 1,
    title: 'Название',
    hasSort: true,
  },
  {
    id: 2,
    title: 'ФИО директора',
    hasSort: true,
  },
  {
    title: 'Номер телефона',
  },
  {
    title: '',
  },
]

const onAddOrganization = (result: boolean) => {
  if (result) {
    collections.push({ ...newOrganization.value })
    // будто бы изменяем на бэке
    organizations.push({ ...newOrganization.value })
  }
  newOrganization.value.director = ''
  newOrganization.value.phone = ''
  newOrganization.value.title = ''
  modalDialogVisible.value = false
}

const onDeleteOrganization = (organization: IOrganization) => {
  const delIndex = organizations.findIndex((org) => org.title === organization.title)
  if (delIndex > -1) {
    collections.splice(delIndex, 1)
    // будто бы изменяем на бэке
    organizations.splice(delIndex, 1)
  }
}

const onSort = (header: IHeaderColumn, sortType: string) => {
  const sortfield = header.id == 1 ? 'title' : 'director'
  if (sortType === SORT_TYPE.ASC) {
    collections.sort((a, b) => a[`${sortfield}`].localeCompare(b[`${sortfield}`]))
  } else {
    collections.sort((a, b) => b[`${sortfield}`].localeCompare(a[`${sortfield}`]))
  }
}

const onItemsReady = (items: Reactive<IOrganization[]>) => {
  collections = items
}

// новые значения организациии
const newOrganization = ref({
  title: '',
  phone: '',
  director: '',
})

// наблюдатель за новыми полями в добавлении организации
// для проверки активности кнопки ОК
watch(
  newOrganization,
  (newOrg) => {
    if (newOrg.director && newOrg.phone && newOrg.title) {
      okBtnReadOnly.value = false
    } else if (okBtnReadOnly.value !== true) {
      okBtnReadOnly.value = true
    }
  },
  { deep: true },
)

const onSearch = (newSearchString: string) => {
  // якобы запрашиваем с бэка
  const data = source.method()
  const newCollections = data.filter((org) => {
    return org.director.toLowerCase().includes(newSearchString.toLowerCase())
  })
  collections.splice(0)
  collections.push(...newCollections)
}
</script>

<template>
  <div class="organizationsDirectory">
    <div class="organizationsDirectory_header">
      <Search @search="onSearch" placeholder="Найти по ФИО..."></Search>
      <Button
        title="Добавить"
        @click="
          () => {
            modalDialogVisible = true
          }
        "
      ></Button>
    </div>
    <TableList
      :source="source"
      :nav="navigation"
      :filter="filter"
      :headerColumns="headerColumns"
      :columns="columns"
      :onItemsReady="onItemsReady"
      @delete="onDeleteOrganization"
      @sort="onSort"
    ></TableList>
  </div>
  <ModalDialog
    v-if="modalDialogVisible"
    title="Добавить организацию"
    :footerBtnSet="{
      positive: { title: 'ОК', readonly: okBtnReadOnly },
      negative: { title: 'Отмена', readonly: false },
    }"
    @release="onAddOrganization"
  >
    <template class="organizationsDirectoryDialog_content">
      <Input
        class="organizationsDirectoryDialog_content_name"
        placeholder="Название"
        v-model="newOrganization.title"
      />
      <Input
        class="organizationsDirectoryDialog_content_phone"
        placeholder="Номер телефона"
        type="tel"
        v-model="newOrganization.phone"
      />
      <Input placeholder="ФИО директора" v-model="newOrganization.director" />
    </template>
  </ModalDialog>
</template>

<style scoped>
.organizationsDirectory_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.organizationsDirectoryDialog_content {
  display: flex;
  flex-direction: column;
}
.organizationsDirectoryDialog_content_name,
.organizationsDirectoryDialog_content_phone {
  margin-bottom: 6px;
}
</style>
