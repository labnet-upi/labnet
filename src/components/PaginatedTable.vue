<template>
  <div class="space-y-4">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
    <!-- Kiri: Tombol + Input -->
    <div class="flex gap-2 w-full sm:max-w-md">
      <!-- Tombol Filter -->
      <el-button
        type="info"
        icon="Filter"
        @click="onFilterClick"
        class="whitespace-nowrap"
        v-if="props.showFilter"
      >
      </el-button>

      <!-- Input pencarian -->
      <el-input
        v-model="search"
        prefix-icon="Search"
        placeholder="Cari..."
        clearable
        class="flex-1"
        v-if="props.showSearch"
      />
    </div>

    <!-- Kanan: Dropdown page size -->
    <div class="flex items-center gap-2 text-sm text-gray-600">
      <span>Tampilkan:</span>
      <el-select
        v-model="pageSize"
        placeholder="Jumlah"
        @change="handleSizeChange"
        class="!w-16"
      >
        <el-option v-for="size in pageSizeOption" :key="size" :label="size" :value="size" />
      </el-select>
      <span>entri</span>
    </div>
  </div>

    <!-- Tabel -->
    <el-table
      ref="table"
      :data="paginatedData"
      stripe
      class="w-full"
      :default-expand-all="props.defaultExpandAll"
      :row-key="props.rowKey"
      @selection-change="(newSelection: any) => (emit('selection-change', newSelection))"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="props.showIndex"
        label="#"
        width="50"
        align="center"
        :index="getIndex"
        type="index"
        />

      <slot />
    </el-table>

    <slot name="before-footer"></slot>

    <!-- Wrapper Flex -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <!-- Info jumlah -->
        <div class="text-sm text-gray-500">
            Menampilkan <strong>{{ paginatedData.length }}</strong> dari
            <strong>{{ filteredSortedData.length }}</strong> data
        </div>

        <!-- Pagination -->
        <div>
            <el-pagination
            layout="prev, pager, next"
            :total="filteredSortedData.length"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
            background
            />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  data: { type: Array as PropType<any[]>, default: () => [] },
  searchFields: { type: Array as PropType<string[]>, default: () => [] },
  showIndex: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: false },
  showFilter: { type: Boolean, default: false },
  defaultExpandAll: { type: Boolean, default: false },
  rowKey: {
    type: [String, Function], // bisa string atau function
    default: 'id'
  },
})

const search = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const pageSizeOption = [5, 10, 20, 50, 100]
const sort = ref<any>({ prop: '', order: '' })

const emit = defineEmits(['filter-click', 'selection-change'])
const onFilterClick = () => emit('filter-click')

const filteredData = computed(() => {
  if (!props.searchFields.length || !search.value) return props.data
  return props.data.filter(row =>
    props.searchFields.some(field =>
      String(row[field] ?? '').toLowerCase().includes(search.value.toLowerCase())
    )
  )
})

const filteredSortedData = computed(() => {
  if (!sort.value.prop || !sort.value.order) return filteredData.value
  return [...filteredData.value].sort((a, b) => {
    const prop = sort.value.prop
    const direction = sort.value.order === 'ascending' ? 1 : -1
    return (a[prop] > b[prop] ? 1 : -1) * direction
  })
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredSortedData.value.slice(start, start + pageSize.value)
})

const handlePageChange = (page: number) => currentPage.value = page
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}
const handleSortChange = ({ prop, order } : { prop: any, order: any}) => sort.value = { prop, order }
const getIndex = (index: number) => ((currentPage.value - 1) * pageSize.value + index + 1)

watch(search, () => currentPage.value = 1)

provide('elTable', ref(null))
</script>
