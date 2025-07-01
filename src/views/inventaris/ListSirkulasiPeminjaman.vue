<template>
  <el-card>
    <div class="flex items-end justify-end py-2 mb-6">
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
      :show-search="true"
      :custom-matcher="customMatcher"
    >
      <paginated-table-column prop="nama" label="Nama Peminjam"/>
      <paginated-table-column prop="notel" label="No. Telp.">
        <template #default="{ row }">
          <el-link
            type="success"
            :href="`https://wa.me/${parsePhone(row.notel)}`"
            target="_blank"
          >
            +{{ parsePhone(row.notel) }}
          </el-link>
        </template>
      </paginated-table-column>

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

      <paginated-table-column prop="notelPencatat" label="No. Telp.">
        <template #default="{ row }">
          <el-link
            type="success"
            :href="`https://wa.me/${parsePhone(row.pencatat.notel)}`"
            target="_blank"
          >
            +{{ parsePhone(row.pencatat.notel) }}
          </el-link>
        </template>
      </paginated-table-column>

      <paginated-table-column label="">
        <template #default="scope">
          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button text icon="MoreFilled" />
            <template #dropdown>
              <el-dropdown-menu v-if="scope.row.sudah_dikembalikan_semua">
                <el-dropdown-item disabled>Tidak ada aksi</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else>
                <el-dropdown-item command="retur" class="!text-blue-500 hover:!bg-blue-100" v-if="scope.row.status_sirkulasi == 'peminjaman'"><el-icon><Right /></el-icon>Retur</el-dropdown-item>
                <el-dropdown-item command="edit" v-if="scope.row.status_sirkulasi == 'peminjaman'"><el-icon><Edit /></el-icon>Edit</el-dropdown-item>
                <el-dropdown-item command="hapus" class="!text-red-500 hover:!bg-red-100"><el-icon><Remove /></el-icon>Batalkan</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </paginated-table-column>
    </paginated-table>
  </el-card>
  <el-dialog
    v-model="deleteConfirmVisible"
    title="Konfirmasi"
    width="500"
    align-center
  >
  <p>Penghapusan dapat mengakibatkan inkonsistensi data</p>
  <span>Yakin hapus data?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">Batal</el-button>
        <el-button type="danger" @click="hapusDataSirkulasi()">
          Hapus
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { apiServices } from '@/services/apiServices'
import { ElLoading, ElNotification } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const dataFormSirkulasi = ref([])
const loadDataFormSirkulasi = async () => {
  const response = await apiServices.get('/inventaris/sirkulasi')
  dataFormSirkulasi.value = response.data
}
const deleteConfirmVisible = ref(false)
onMounted(() => loadDataFormSirkulasi())

function getStatusType(status: string) {
  switch (status) {
    case 'peminjaman':
      return 'danger'
    case 'pengembalian':
      return 'success'
    default:
      return 'info'
  }
}

const statusFilters = [
  { text: 'Peminjaman', value: 'peminjaman' },
  { text: 'Pengembalian', value: 'pengembalian' },
]
const idFormulirSiapDihapus = ref<string>("")
const hapusDataSirkulasi = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  try {
    const response = await apiServices.delete('/inventaris/sirkulasi?id_formulir='+idFormulirSiapDihapus.value)
    await loadDataFormSirkulasi()
    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
    deleteConfirmVisible.value = false
  } catch (error) {
    loadingInstance.close()
    ElNotification({
      title: 'Gagal',
      message: 'Terjadi kesalahan saat menyimpan data.',
      type: 'error',
      position: 'bottom-right',
    })

    // (Opsional) tampilkan log error untuk debugging
    console.error('Error saat menyimpan data:', error)
  }
}
const openWarningPembatalan = (id_formulir: string) => {
  idFormulirSiapDihapus.value = id_formulir
  deleteConfirmVisible.value = true
}
const routeToPeminjaman = (id: any) => {
  router.push({
    name: 'FormSirkulasiPeminjaman',
    params: { status_sirkulasi: 'peminjaman'},
    query: { id_formulir: id }
  })
}
const routeToPengembalian = (id: any) => {
  router.push({
    name: 'FormSirkulasiPeminjaman',
    params: { status_sirkulasi: 'pengembalian'},
    query: { id_formulir: id }
  })
}
const commandHandlers: Record<string, (id: any) => void> = {
  hapus: openWarningPembatalan,
  edit: routeToPeminjaman,
  retur: routeToPengembalian,
}
const handleCommand = (command: string, row: any) => {
  commandHandlers[command]?.(row.id)
}
const customMatcher = (row: any, keyword: string) => {
  const lcKeyword = keyword.toLowerCase();
  const flatFields = [
    row.nama,
    row.pencatat?.nama,
  ];
  const barangFields = (row.data_barang_sirkulasi ?? []).flatMap((barang_sirkulasi: any) => {
    const barang = barang_sirkulasi?.barang ?? {};
    return [barang.nama, barang.kode];
  });
  return [...flatFields, ...barangFields].some(value =>
    String(value ?? '').toLowerCase().includes(lcKeyword)
  );
};

function parsePhone(notel: unknown): string {
  if (typeof notel !== 'string' && typeof notel !== 'number') return '';

  const str = String(notel);
  const cleaned = str.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }

  return cleaned;
}

function then() {
  throw new Error('Function not implemented.')
}
</script>