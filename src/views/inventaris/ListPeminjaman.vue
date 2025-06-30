<template>
  <el-card>
    <div>
      <div class="flex items-center justify-between py-2 mb-6">
        <h2 class="text-xl font-semibold">Data Peminjaman</h2>
  
        <div class="flex gap-2">
          <el-button type="primary" icon="Refresh" plain @click="loadInventori"></el-button>
          <el-button type="success" icon="Download" plain>Excel</el-button>
          <el-button type="primary" :to="{ path: '/dashboard/inventaris/pinjam' }" tag="router-link" icon="Plus">Batch</el-button>
        </div>
      </div>
    </div>
  
    <div class="overflow-x-auto">
      <paginated-table
        :data="dataPeminjaman"
        size="small"
        class="hover:table-row cursor-pointer"
        @row-click="handleRowClick"
      >
        <paginated-table-column prop="nama" label="Nama Peminjam" width="160" />
        <paginated-table-column prop="telepon" label="No. Telepon" width="140" />
  
        <paginated-table-column
          label="Barang"
          :filters="barangFilters"
          :filter-method="filterBarang"
          filter-placement="bottom-end"
          width="200"
        >
          <template #default="{ row }">
            <div>
              <div class="flex flex-wrap gap-1">
                <el-tag
                  v-for="(nomor, idx) in row.barang.nomorInventaris"
                  :key="idx"
                  type="info"
                  effect="light"
                  size="small"
                >
                  {{ nomor }}
                </el-tag>
              </div>
            </div>
          </template>
        </paginated-table-column>
  
        <paginated-table-column
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
        </paginated-table-column>
        <paginated-table-column prop="tanggal" label="Tanggal" width="100" />
  
        <paginated-table-column prop="asisten" label="Pencatat" width="160" />
        <paginated-table-column prop="keterangan" label="Keterangan"/>
      </paginated-table>
    </div>
  </el-card>
  
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

        <el-form-item label="Tanggal">
          <el-date-picker
            v-model="selectedRow.tanggal"
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

        <el-form-item label="Keterangan" class="col-span-2">
          <el-input type="textarea" v-model="selectedRow.keterangan" rows="3" />
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
import { ref } from 'vue'

const dataPeminjaman = ref([
  {
    no: 1,
    nama: 'Ahmad Yusuf',
    telepon: '081234567890',
    barang: {
      nama: 'Laptop Lenovo',
      nomorInventaris: ['INV-001', 'INV-002']
    },
    tanggal: '2025-06-15',
    status: 'Dipinjam',
    asisten: 'Riko Prasetya',
    keterangan: 'Digunakan untuk pelatihan tim IT',
  },
  {
    no: 2,
    nama: 'Rina Marlina',
    telepon: '082198765432',
    barang: {
      nama: 'Proyektor Epson',
      nomorInventaris: ['INV-010']
    },
    tanggal: '2025-06-10',
    status: 'Dikembalikan',
    asisten: 'Siti Rahma',
    keterangan: 'Digunakan di aula kantor',
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

const statusFilters = [
  { text: 'Dipinjam', value: 'Dipinjam' },
  { text: 'Dikembalikan', value: 'Dikembalikan' },
]

function filterStatus(value, row) {
  return row.status === value
}

const dialogVisible = ref(false)
const selectedRow = ref(null)
const selectedInventaris = ref('')

function simpanPerubahan() {
  const index = dataPeminjaman.value.findIndex(d => d.no === selectedRow.value.no)
  if (index !== -1) {
    dataPeminjaman.value[index] = JSON.parse(JSON.stringify(selectedRow.value))
  }
  dialogVisible.value = false
}
</script>