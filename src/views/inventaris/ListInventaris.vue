<template>
  <div class="flex items-center justify-between pe-4 py-2">
    <h2 class="text-xl font-semibold">Daftar Inventaris</h2>

    <div class="flex gap-2">
      <el-button type="primary" :to="{ path: '/dashboard/inventaris/tambah' }" tag="router-link">Tambah Batch</el-button>
    </div>
  </div>
  
  <transition name="slide-fade">
    <div
      v-if="selectedRows.length"
      class="mb-4 p-4 bg-red-50 border border-red-300 rounded flex justify-between items-center"
    >
      <span>{{ selectedRows.length }} item terpilih</span>
      <el-button type="danger" size="small" @click="handleDelete">Hapus</el-button>
    </div>
  </transition>

  <el-table
    :data="tableData"
    style="width: 100%"
    border
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="index"
      label="No"
      width="60"
    />
    <el-table-column
      type="selection"
      width="50"
    />
    <el-table-column
        prop="barang"
        label="Barang"
        min-width="150"
        :filters="barangFilters"
        :filter-method="filterBarang"
        filter-placement="bottom-end"
    />
    <el-table-column label="Nomor Inventaris" min-width="150">
        <template #default="scope">
            <el-tag
            v-for="(nomor, idx) in scope.row.nomorInventaris"
            :key="idx"
            size="small"
            class="mr-1"
            >
            {{ nomor }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column
      prop="createdAt"
      label="Created At"
      min-width="180"
    />
    <el-table-column
      prop="updatedAt"
      label="Update At"
      min-width="180"
    />
    <el-table-column
      label="Action"
      width="150"
      align="center"
    >
      <template #default="scope">
        <el-button type="primary" size="small" @click="editItem(scope.row)"><el-icon><Edit /></el-icon></el-button>
        <el-button type="danger" size="small" @click="deleteItem(scope.row)"><el-icon><Delete /></el-icon></el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="dialogVisible"
    title="Edit Data Inventaris"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-form :model="formData" label-width="120px">
      <el-form-item label="Barang">
        <el-input v-model="formData.barang" />
      </el-form-item>

      <el-form-item label="Nomor Inventaris">
        <div class="flex flex-col gap-2 w-full">
          <div
            class="flex items-center gap-2"
            v-for="(item, index) in formData.nomorInventaris"
            :key="index"
          >
            <el-input v-model="formData.nomorInventaris[index]" class="flex-1" @input="handleInputChange(index)"/>
            <el-button type="danger" @click="removeNomorInventaris(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">Batal</el-button>
      <el-button type="primary" @click="submitEdit">Simpan</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const dialogVisible = ref(false)
const editingRow = ref(null)

const formData = ref({
  barang: '',
  nomorInventaris: []
})

const tableData = ref([
  {
    barang: 'Laptop',
    nomorInventaris: ['INV-001', 'INV-002'],
    createdAt: '2023-01-01 10:00',
    updatedAt: '2023-01-05 15:30'
  },
  {
    barang: 'Proyektor',
    nomorInventaris: ['INV-003'],
    createdAt: '2023-02-10 09:20',
    updatedAt: '2023-02-12 12:45'
  }
])

const selectedRows = ref([])

function handleSelectionChange(val) {
  selectedRows.value = val
}

function handleDelete() {
  tableData.value = tableData.value.filter(row => !selectedRows.value.includes(row))
  selectedRows.value = []
}

function handleInputChange(index) {
  const list = formData.value.nomorInventaris
  const isLast = index === list.length - 1
  const isNotEmpty = list[index].trim() !== ''

  // Jika sedang mengedit field terakhir dan terisi, tambahkan field baru
  if (isLast && isNotEmpty) {
    list.push('')
  }
}

function editItem(row) {
  editingRow.value = row
  formData.value.barang = row.barang
  formData.value.nomorInventaris = [...row.nomorInventaris, '']
  dialogVisible.value = true
}

function addNomorInventaris() {
  formData.value.nomorInventaris.push('')
}

function removeNomorInventaris(index) {
  formData.value.nomorInventaris.splice(index, 1)
}

function deleteItem(row) {
  console.log('Delete', row)
}

const barangFilters = computed(() => {
  const unique = Array.from(new Set(tableData.value.map(item => item.barang)))
  return unique.map(barang => ({ text: barang, value: barang }))
})

function filterBarang(value, row) {
  return row.barang === value
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
