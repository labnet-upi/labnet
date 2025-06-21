<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Tambah Inventaris</h2>

    <el-table :data="formData" border style="width: 100%">
      <el-table-column type="index" label="No" width="50" />

      <!-- Nama Barang -->
      <el-table-column label="Nama Barang" width="200">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.barang"
            placeholder="Nama barang"
            size="small"
            @input="handleBarangInput($index)"
          />
        </template>
      </el-table-column>

      <!-- Nomor Inventaris -->
      <el-table-column label="Nomor Inventaris">
        <el-table-column label="Formatted">
          <template #default="{ row }">
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 items-center">
              <div>Prefix</div>
              <el-input size="small" v-model="row.formatted.prefix" class="w-full" />
  
              <div>Angka Awal</div>
              <el-input size="small" v-model="row.formatted.angkaAwal" class="w-full" />
  
              <div>Jumlah</div>
              <el-input size="small" v-model="row.formatted.jumlah" class="w-full" />
            </div>
            <div>
              <el-button
                type="info"
                size="small"
                @click="tambahListNomorInventaris(row)"
                class="w-[100%] mt-2">
                Generate
              </el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="List">
          <template #default="{ row, $index }">
            <el-button
              type="warning"
              size="small"
              @click="clearListNomorInventaris(row)"
              v-show="row.nomorInventaris.length > 1"
              class="w-[100%] mb-3"
            ><el-icon><RefreshRight /></el-icon> Clear</el-button>
            <div class="flex flex-col gap-1">
              <div
                v-for="(nomor, idx) in row.nomorInventaris"
                :key="idx"
                class="flex gap-2 items-center"
              >
                <el-input
                  v-model="row.nomorInventaris[idx]"
                  size="small"
                  placeholder="Nomor inventaris"
                  @input="handleNomorInput($index, idx)"
                />
                <el-button
                  size="small"
                  type="danger"
                  @click="removeNomorInventaris($index, idx)"
                  v-if="row.nomorInventaris.length > 1"
                  :disabled="row.nomorInventaris.length - 1 === idx"
                ><el-icon><Delete /></el-icon></el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <!-- Aksi -->
      <el-table-column label="Aksi" width="100">
        <template #default="{ $index }">
          <el-button
            type="danger"
            size="small"
            @click="removeBarang($index)"
            v-if="formData.length > 1 && formData.length - 1 != $index"
          ><el-icon><Delete /></el-icon></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-between items-center mt-6">
      <!-- Tombol Reset (kiri) -->
      <el-button type="warning" @click="resetForm">
        <el-icon class="mr-1"><RefreshRight /></el-icon>
        Reset Form
      </el-button>

      <!-- Tombol Save (kanan) -->
      <el-button type="primary" @click="saveForm">
        <el-icon class="mr-1"><DocumentChecked /></el-icon>
        Simpan
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import debounce from 'lodash.debounce'

const STORAGE_KEY = 'inventaris-form-data'

// Step 1: Load from localStorage (jika ada)
const formData = ref([])

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  formData.value = saved ? JSON.parse(saved) : [{ barang: '', nomorInventaris: [''], formatted: {} }]
})

// Step 2: Save ke localStorage, tapi debounce agar tidak terlalu sering
const saveToStorage = debounce(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData.value))
}, 500) // delay 500ms sejak perubahan terakhir

// Step 3: Watch perubahan formData
watch(formData, saveToStorage, { deep: true })

function handleBarangInput(index) {
  const current = formData.value[index]
  const isLast = index === formData.value.length - 1
  const filled = current.barang.trim() !== '' || current.nomorInventaris.some(n => n.trim() !== '')

  if (isLast && filled) {
    formData.value.push({ barang: '', nomorInventaris: [''], formatted: {} })
  }
}

function handleNomorInput(barangIndex, nomorIndex) {
  const list = formData.value[barangIndex].nomorInventaris
  const isLast = nomorIndex === list.length - 1
  const filled = list[nomorIndex].trim() !== ''

  if (isLast && filled) {
    list.push('')
  }
}

function tambahListNomorInventaris(row) {
  if(row.formatted == {}) return;
  
  const insertIndex = Math.max(row.nomorInventaris.length - 1, 0)

  const newItems = Array.from({ length: row.formatted.jumlah }, (_, i) => row.formatted.prefix + (row.formatted.angkaAwal + i))

  row.nomorInventaris.splice(insertIndex, 0, ...newItems)

  row.formatted = {}
}

function removeBarang(index) {
  formData.value.splice(index, 1)
}

function removeNomorInventaris(barangIndex, nomorIndex) {
  const list = formData.value[barangIndex].nomorInventaris
  if (list.length > 1) {
    list.splice(nomorIndex, 1)
  }
}

function resetForm() {
  formData.value.splice(0, formData.value.length)
  formData.value.push({ barang: '', nomorInventaris: [''], formatted: {} })
  localStorage.removeItem(STORAGE_KEY)
}

function clearListNomorInventaris(row) {
  row.nomorInventaris.splice(0, row.nomorInventaris.length)
  row.nomorInventaris.push('')
}
</script>
