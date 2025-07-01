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
        v-model="searchRaw"
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
      ref="tableRef"
      :data="paginatedData"
      stripe
      class="w-full"
      :default-expand-all="props.defaultExpandAll"
      :row-key="props.rowKey"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
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
import { ref, computed, watch, provide, nextTick } from 'vue'
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
  customMatcher: Function as PropType<(row: any, keyword: string) => boolean>,
})

const tableRef = ref()
const selectedRowsFull = ref<any[]>([])
const selectedKeys = ref<Set<any>>(new Set())
const searchRaw = ref('')
const search = ref('')
let debounceTimeout: ReturnType<typeof setTimeout>

watch(searchRaw, (val) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    search.value = val
    currentPage.value = 1
  }, 500)
})

const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const pageSizeOption = [5, 10, 20, 50, 100]
const sort = ref<any>({ prop: '', order: '' })

const emit = defineEmits(['filter-click', 'selection-change', 'select', 'select-all'])

const getKey = (item: any) => (
    typeof props.rowKey === 'function'
      ? props.rowKey(item)
      : item[props.rowKey]
)

let counter = 1
const handleSelectionChange = (selection: any[]) => {
  console.log("perubahan", counter++)
  emit('selection-change', selectedRowsFull.value, selectedKeys.value)
}

function getAllKeys(rows: any[]): any[] {
  return rows.flatMap(row => [
    getKey(row),
    ...(row.children ? getAllKeys(row.children) : [])
  ])
}

const handleSelect = (selection: any[], row: any) => {
  emit('select', row)
  const key = getKey(row)

  if (selectedKeys.value.has(key)) {
    // Hanya hapus row ini
    selectedKeys.value.delete(key)
  } else {
    // Tambahkan row ini
    selectedKeys.value.add(key)
  }

  updateSelectedRows()
}

const handleSelectAll = (selection: any[]) => {
  const keys = getAllKeys(paginatedData.value)

  if (selection.length) {
    keys.forEach(k => selectedKeys.value.add(k))
  } else {
    keys.forEach(k => selectedKeys.value.delete(k))
  }

  updateSelectedRows()
  emit('select-all')
}

function updateSelectedRows() {
  // Ambil semua baris dari data asli (termasuk nested) berdasarkan key yang terpilih
  const flatData = flattenTree(props.data)
  selectedRowsFull.value = flatData.filter(item =>
    selectedKeys.value.has(getKey(item))
  )
  emit('selection-change', selectedRowsFull.value, selectedKeys.value)
}

function flattenTree(data: any[]): any[] {
  const result: any[] = []

  const traverse = (items: any[]) => {
    for (const item of items) {
      result.push(item)
      if (item.children && item.children.length) {
        traverse(item.children)
      }
    }
  }

  traverse(data)
  return result
}

const onFilterClick = () => emit('filter-click')

// Filter rekursif dengan struktur tetap
// default matcher (jika customMatcher tidak disediakan)
function defaultMatcher(row: any, keyword: string) {
  const lowerCaseKeyword = keyword.toLowerCase()
  return props.searchFields.some(field =>
    String(row[field] ?? '').toLowerCase().includes(lowerCaseKeyword)
  );
}

// ambil matcher dari props satu kali
const matcher =
  typeof props.customMatcher === 'function'
    ? props.customMatcher
    : defaultMatcher;

function filterRecursive(data: any[], keyword: string): any[] {
  return data
    .map(row => {
      const children = Array.isArray(row.children)
        ? filterRecursive(row.children, keyword)
        : [];

      const matches = matcher(row, keyword);

      if (matches || children.length) {
        return { ...row, children };
      }

      return null;
    })
    .filter((item): item is any => Boolean(item));
}

const filteredData = computed(() => {
  const keyword = search.value?.trim() ?? '';
  const hasKeyword = keyword.length > 0;
  const hasCustomMatcher = typeof props.customMatcher === 'function';
  const hasSearchFields = Array.isArray(props.searchFields) && props.searchFields.length > 0;
  const canSearchExecute = hasCustomMatcher || hasSearchFields
  if (!hasKeyword || !canSearchExecute) {
    return props.data;
  }
  // Jalankan pencarian
  return filterRecursive(props.data, keyword);
});


// Sort rekursif
function sortRecursive(data: any[], prop: string, order: 'ascending' | 'descending'): any[] {
  const direction = order === 'ascending' ? 1 : -1
  return [...data]
    .sort((a, b) => (a[prop] > b[prop] ? 1 : -1) * direction)
    .map(row => ({
      ...row,
      children: Array.isArray(row.children)
        ? sortRecursive(row.children, prop, order)
        : []
    }))
}

const filteredSortedData = computed(() => {
  if (!sort.value.prop || !sort.value.order) return filteredData.value
  return sortRecursive(filteredData.value, sort.value.prop, sort.value.order)
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

provide('elTable', ref(null))

</script>
