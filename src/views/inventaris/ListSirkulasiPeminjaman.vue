<template>
  <el-card>
    <div class="flex items-center justify-between py-2 mb-6">
      <h2 class="text-xl font-semibold">Data Peminjaman</h2>

      <div class="flex gap-2">
        <el-button type="primary" icon="Refresh" plain @click="loadDataFormSirkulasi"></el-button>
        <el-button type="success" icon="Download" plain>Excel</el-button>
        <el-button type="primary" :to="{ name: 'FormSirkulasiPeminjaman', params: { status_sirkulasi: 'peminjaman' } }" tag="router-link" icon="Top">Pinjam Barang</el-button>
      </div>
    </div>
  
    <paginated-table
      :data="dataFormSirkulasi"
      size="small"
      class="hover:table-row cursor-pointer"
    >
      <paginated-table-column prop="nama" label="Nama Peminjam"/>
      <paginated-table-column prop="notel" label="No. Telp."/>

      <paginated-table-column
        label="Barang"
        filter-placement="bottom-end"
      >
        <template #default="{ row }">
          <div>
            <div class="flex flex-wrap gap-1">
              <el-tag
                v-for="(barang_sirkulasi) in row.data_barang_sirkulasi"
                key="id"
                type="info"
                effect="light"
                size="small"
              >
                {{ barang_sirkulasi.barang.kode }}
              </el-tag>
            </div>
          </div>
        </template>
      </paginated-table-column>

      <paginated-table-column
        label="Status"
        :filters="statusFilters"
        filter-placement="bottom-end"
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status_sirkulasi)" size="small">
            {{ row.status_sirkulasi }}
          </el-tag>
        </template>
      </paginated-table-column>
      <paginated-table-column prop="tanggal_pencatatan" label="Tanggal"/>

      <paginated-table-column prop="pencatat" label="Pencatat">
        <template #default="{ row }">
          {{ row.pencatat.nama }}
        </template>
      </paginated-table-column>
      <paginated-table-column prop="pencatat" label="No. Telp.">
        <template #default="{ row }">
          {{ row.pencatat.notel }}
        </template>
      </paginated-table-column>
      <paginated-table-column prop="keterangan" label="Keterangan"/>
      
      <paginated-table-column label="">
        <template #default="scope">
          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button text icon="MoreFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="retur" class="!text-blue-500 hover:!bg-blue-100" v-if="scope.row.status_sirkulasi == 'Peminjaman'" :disabled="scope.row.sudah_dikembalikan_semua"><el-icon><Right /></el-icon>Retur</el-dropdown-item>
                <el-dropdown-item command="edit"><el-icon><Edit /></el-icon>Edit</el-dropdown-item>
                <el-dropdown-item command="hapus" class="!text-red-500 hover:!bg-red-100"><el-icon><Remove /></el-icon>Batalkan</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </paginated-table-column>
    </paginated-table>
  </el-card>
</template>

<script setup lang="ts">
import { apiServices } from '@/services/apiServices'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const dataFormSirkulasi = ref([])
const loadDataFormSirkulasi = async () => {
  const response = await apiServices.get('/inventaris/sirkulasi')
  dataFormSirkulasi.value = response.data
}

onMounted(() => loadDataFormSirkulasi())

function getStatusType(status: string) {
  switch (status) {
    case 'Peminjaman':
      return 'danger'
    case 'Pengembalian':
      return 'success'
    default:
      return 'info'
  }
}

const statusFilters = [
  { text: 'Peminjaman', value: 'Peminjaman' },
  { text: 'Pengembalian', value: 'Pengembalian' },
]

const handleCommand = (command: string, row: any) => {
  if (command === 'hapus') {
    // konfirmasiPenghapus("single")
  } else if (command === 'edit') {
    // salinData(row)
  } else if(command === 'retur') {
    router.push({
      name: 'FormSirkulasiPeminjaman',
      params: { status_sirkulasi: 'pengembalian'},
      query: { id_formulir: row.id }
    })
  }
}
</script>