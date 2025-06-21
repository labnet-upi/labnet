<template>
  <div class="overflow-x-auto">
    <el-table :data="formList" border size="small">
      <el-table-column label="No" width="50">
        <template #default="{ $index }">{{ $index + 1 }}</template>
      </el-table-column>

      <el-table-column label="Nama Peminjam" width="160">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.nama"
            placeholder="Nama"
            size="small"
            @input="handleInput($index)"
          />
        </template>
      </el-table-column>

      <el-table-column label="No. Telepon" width="140">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.telepon"
            placeholder="Telepon"
            size="small"
            @input="handleInput($index)"
          />
        </template>
      </el-table-column>

      <el-table-column label="No. Inventaris" width="300">
        <template #default="{ row, $index }">
          <el-select
            v-model="row.nomorInventaris"
            placeholder="Pilih Inventaris"
            filterable
            clearable
            multiple
            size="small"
            style="width: 100%"
            @change="handleInput($index)"
          >
            <el-option
              v-for="item in inventarisOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Tanggal Pinjam" width="140">
        <template #default="{ row, $index }">
          <el-date-picker
            v-model="row.tanggalPinjam"
            type="date"
            placeholder="Tanggal Pinjam"
            size="small"
            style="width: 100%"
            @change="handleInput($index)"
          />
        </template>
      </el-table-column>

      <el-table-column label="Catatan">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.catatan"
            placeholder="Catatan"
            size="small"
            type="textarea"
            :rows="2"
            @input="handleInput($index)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4">
      <el-button type="primary" @click="submitForm">Simpan Semua</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inventarisOptions = [
  'INV-001',
  'INV-002',
  'INV-003',
  'INV-004',
  'INV-005',
]

const formList = ref([
  {
    nama: '',
    telepon: '',
    nomorInventaris: '',
    tanggalPinjam: new Date(),
    status: '',
    catatan: '',
  },
])

// Tambahkan baris baru jika baris terakhir sudah diisi sebagian
const handleInput = (index: number) => {
  const isLastRow = index === formList.value.length - 1
  const row = formList.value[index]

  const hasSomeValue = Object.values(row).some((val) => val !== '' && val !== null)

  if (isLastRow && hasSomeValue) {
    formList.value.push({
      nama: '',
      telepon: '',
      nomorInventaris: [],
      tanggalPinjam: new Date(),
      status: '',
      catatan: '',
    })
  }
}

const submitForm = () => {
  // Filter data yang benar-benar terisi
  const filledRows = formList.value.filter((row) =>
    Object.values(row).some((val) => val !== '' && val !== null)
  )
  console.log('Data yang akan dikirim:', filledRows)
}
</script>
