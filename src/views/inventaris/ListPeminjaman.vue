<template>
    <div>
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Data Peminjaman</h2>

      <div class="flex gap-2">
        <el-button type="info" @click="showFilter = !showFilter">
          <el-icon><Filter /></el-icon>
        </el-button>
        <el-button type="primary" :to="{ path: '/dashboard/inventaris/pinjam' }" tag="router-link">Tambah Batch</el-button>
      </div>
    </div>

    <transition name="slide-fade">
      <div class="mb-4 space-y-4" v-show="showFilter">
        <!-- Baris 1: Input Nama -->
        <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div class="flex flex-col">
            <label class="text-sm mb-1">Nama Peminjam:</label>
            <input
              type="text"
              v-model="filterNama"
              placeholder="Masukkan nama"
              class="border border-gray-300 rounded px-2 py-1 text-sm w-58"
            />
          </div>
        </div>

        <!-- Baris 2: Filter Tanggal -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Tanggal Pinjam -->
          <div class="flex flex-col">
            <label class="text-sm mb-1">Tanggal Pinjam:</label>
            <el-date-picker
              v-model="filterTanggalPinjam"
              type="daterange"
              start-placeholder="Mulai"
              end-placeholder="Selesai"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="small"
              class="w-full"
            />
          </div>

          <!-- Tanggal Kembali -->
          <div class="flex flex-col">
            <label class="text-sm mb-1">Tanggal Kembali:</label>
            <el-date-picker
              v-model="filterTanggalKembali"
              type="daterange"
              start-placeholder="Mulai"
              end-placeholder="Selesai"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="small"
              class="w-full"
            />
          </div>
        </div>
      </div>

    </transition>
  </div>

  <div class="overflow-x-auto">
    <el-table
      :data="filteredDataPeminjaman"
      border
      size="small"
      class="hover:table-row cursor-pointer"
      @row-click="handleRowClick"
    >
      <el-table-column prop="no" label="No" width="50" />
      <el-table-column prop="nama" label="Nama Peminjam" width="160" />
      <el-table-column prop="telepon" label="No. Telepon" width="140" />

      <el-table-column
        label="Barang"
        :filters="barangFilters"
        :filter-method="filterBarang"
        filter-placement="bottom-end"
        width="200"
      >
        <template #default="{ row }">
          <div>
            <div class="font-semibold mb-1">{{ row.barang.nama }}</div>
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="(nomor, idx) in row.barang.nomorInventaris"
                :key="idx"
                type="primary"
                size="small"
              >
                {{ nomor }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="tanggalPinjam" label="Tanggal Pinjam" width="100" />
      <el-table-column prop="tanggalKembali" label="Tanggal Kembali" width="100" />
      
      <el-table-column
        label="Status"
        :filters="statusFilters"
        :filter-method="filterStatus"
        filter-placement="bottom-end"
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="asisten" label="Asisten PJ" width="160" />
      <el-table-column prop="catatan" label="Catatan" width="250" />
    </el-table>
  </div>
  
  <el-dialog
    v-model="dialogVisible"
    title="Edit Peminjaman"
    width="600px"
  >
    <div v-if="selectedRow">
      <el-form label-position="top" class="grid grid-cols-2 gap-1">
        <el-form-item label="Nama Peminjam">
          <el-input v-model="selectedRow.nama" />
        </el-form-item>

        <el-form-item label="No. Telepon">
          <el-input v-model="selectedRow.telepon" />
        </el-form-item>

        <el-form-item label="Nama Barang" class="col-span-2">
          <el-input v-model="selectedRow.barang.nama" disabled/>
        </el-form-item>

        <el-form-item label="Nomor Inventaris" class="col-span-2" type="info">
          <el-checkbox-group v-model="selectedInventaris" >
            <el-checkbox-button
              v-for="(inv, idx) in selectedRow.barang.nomorInventaris"
              :key="idx"
              :label="inv"
              class="custom-default-btn"
            >
              {{ inv }}
            </el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Tanggal Pinjam">
          <el-date-picker
            v-model="selectedRow.tanggalPinjam"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Tanggal Kembali">
          <el-date-picker
            v-model="selectedRow.tanggalKembali"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="Status">
          <el-radio-group v-model="selectedRow.status">
            <el-radio-button label="Dipinjam">Dipinjam</el-radio-button>
            <el-radio-button label="Dikembalikan">Dikembalikan</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Asisten PJ">
          <el-input v-model="selectedRow.asisten" />
        </el-form-item>

        <el-form-item label="Catatan" class="col-span-2">
          <el-input type="textarea" v-model="selectedRow.catatan" rows="3" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button type="danger" @click="hapus"><el-icon><Delete /></el-icon> Hapus</el-button>
      <el-button type="primary" @click="simpanPerubahan"><el-icon><Check /></el-icon> Simpan</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const showFilter = ref(true)

const dataPeminjaman = ref([
  {
    no: 1,
    nama: 'Ahmad Yusuf',
    telepon: '081234567890',
    barang: {
      nama: 'Laptop Lenovo',
      nomorInventaris: ['INV-001', 'INV-002']
    },
    tanggalPinjam: '2025-06-15',
    tanggalKembali: '2025-06-20',
    status: 'Dipinjam',
    asisten: 'Riko Prasetya',
    catatan: 'Digunakan untuk pelatihan tim IT',
  },
  {
    no: 2,
    nama: 'Rina Marlina',
    telepon: '082198765432',
    barang: {
      nama: 'Proyektor Epson',
      nomorInventaris: ['INV-010']
    },
    tanggalPinjam: '2025-06-10',
    tanggalKembali: '2025-06-12',
    status: 'Dikembalikan',
    asisten: 'Siti Rahma',
    catatan: 'Digunakan di aula kantor',
  }
])

function getStatusType(status) {
  switch (status.toLowerCase()) {
    case 'dipinjam':
      return 'danger'
    case 'dikembalikan':
      return 'success'
    default:
      return 'info'
  }
}

const barangFilters = computed(() => {
  const namaBarangSet = new Set(dataPeminjaman.value.map(row => row.barang.nama))
  return Array.from(namaBarangSet).map(nama => ({
    text: nama,
    value: nama
  }))
})

function filterBarang(value, row) {
  return row.barang.nama === value
}

const statusFilters = [
  { text: 'Dipinjam', value: 'Dipinjam' },
  { text: 'Dikembalikan', value: 'Dikembalikan' },
]

function filterStatus(value, row) {
  return row.status === value
}

const filterTanggalPinjam = ref([])
const filterTanggalKembali = ref([])

const filteredDataPeminjaman = computed(() => {
  return dataPeminjaman.value.filter(row => {
    const pinjamValid = !filterTanggalPinjam.value.length || (
      row.tanggalPinjam >= filterTanggalPinjam.value[0] &&
      row.tanggalPinjam <= filterTanggalPinjam.value[1]
    )

    const kembaliValid = !filterTanggalKembali.value.length || (
      row.tanggalKembali >= filterTanggalKembali.value[0] &&
      row.tanggalKembali <= filterTanggalKembali.value[1]
    )

    return pinjamValid && kembaliValid
  })
})

const dialogVisible = ref(false)
const selectedRow = ref(null)
const selectedInventaris = ref('')

function handleRowClick(row) {
  selectedRow.value = JSON.parse(JSON.stringify(row))
  selectedInventaris.value = [...row.barang.nomorInventaris]
  dialogVisible.value = true
}

function addInventaris() {
  if (newInventaris.value.trim()) {
    selectedRow.value.barang.nomorInventaris.push(newInventaris.value.trim())
    newInventaris.value = ''
  }
}

function simpanPerubahan() {
  const index = dataPeminjaman.value.findIndex(d => d.no === selectedRow.value.no)
  if (index !== -1) {
    dataPeminjaman.value[index] = JSON.parse(JSON.stringify(selectedRow.value))
  }
  dialogVisible.value = false
}
</script>

<style scoped>
::v-deep(.custom-default-btn .el-checkbox-button__inner) {
  background-color: white !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
  box-shadow: none !important;
}

::v-deep(.custom-default-btn.is-checked .el-checkbox-button__inner) {
  background-color: #555 !important;
  border-color: #c0c4cc !important;
  color: #c0c4cc !important;
}
</style>
