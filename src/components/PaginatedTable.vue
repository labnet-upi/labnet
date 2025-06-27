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
        <el-option v-for="size in [5, 10, 20, 50, 100]" :key="size" :label="size" :value="size" />
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

<script setup>
import { ref, computed, watch, provide } from 'vue'

const rows = ref([])
const search = ref('')
const currentPage = ref(1)
const searchFields = ref([])
const pageSize = ref(10)
const sort = ref({ prop: '', order: '' })

const props = defineProps({
  showIndex: { type: Boolean, default: true },
  showFilter: { type: Boolean, default: false },
})

const emit = defineEmits(['filter-click'])
function onFilterClick() {
  emit('filter-click')
}

const filteredData = computed(() => {
  if (!searchFields.value.length || !search.value) return rows.value
  return rows.value.filter(row =>
    searchFields.value.some(field =>
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

function handlePageChange(page) {
  currentPage.value = page
}

function handleSizeChange(size) {
  pageSize.value = size
  currentPage.value = 1
}

function handleSortChange({ prop, order }) {
  sort.value = { prop, order }
}

const getIndex = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1
}

watch(search, () => {
  currentPage.value = 1
})

provide('elTable', ref(null))

defineExpose({
  setData: (data) => (rows.value = data),
  setSearchFields: (fields) => (searchFields.value = fields),
})
</script>
