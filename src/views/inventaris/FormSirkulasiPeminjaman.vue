<template>
  <el-card class="mb-6">
    <TopSection :form="form" :status_sirkulasi="status_sirkulasi"></TopSection>
  </el-card>

  <el-card class="mb-6">
    <h2 class="mb-3">Pilih Barang</h2>
    <el-divider />
    <paginated-table
      :data="tableData"
      style="width: 100%" row-key="id"
      :show-search="true"
      :search-fields="['nama', 'kode']">
      <paginated-table-column prop="nama" label="Nama" >
        <template #default="scope">
          <span v-if="scope.row.children">{{ scope.row.nama }}</span>
          <i v-else>{{ scope.row.nama }}</i>
        </template>
      </paginated-table-column>
      <paginated-table-column prop="kode" label="Kode Barang" width="150">
        <template #default="scope">
          <el-tag type="info" effect="light">{{ scope.row.kode }}</el-tag>
        </template>
      </paginated-table-column>
      <paginated-table-column prop="kondisi" label="Kondisi Terakhir" />
      <paginated-table-column prop="jumlah" label="Total" width="62" align="center"></paginated-table-column>
      <paginated-table-column prop="jumlah_terkini" label="Tersedia" width="85" align="center"></paginated-table-column>
      <paginated-table-column prop="jumlah_maks_dapat_dicatat" label="Jumlah" width="200">
        <template #default="scope">
          <el-input-number
            :min="isPeminjaman() ? 1: 0"
            :max="scope.row.jumlah_maks_dapat_dicatat"
            v-model="scope.row.jumlah_dicatat">
            <template #suffix>
              {{ scope.row.satuan }}
            </template>
          </el-input-number>
        </template>
      </paginated-table-column>
      <paginated-table-column props="apalah" width="55">
        <template #header><el-checkbox size="large"  v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"/></template>
        <template #default="scope"><el-checkbox v-model="scope.row.checked" size="large" @change="(newVal: boolean) => handleItemCheckChange(scope.row, newVal)"/></template>
      </paginated-table-column>
      <paginated-table-column prop="keterangan" label="Keterangan">
        <template #default="scope">
          <el-input
            v-model="scope.row.keterangan"
            :rows="2"
            type="textarea"
            placeholder="keterangan"
          />
        </template>
      </paginated-table-column>
  
      <template #before-footer>
        <el-empty v-if="tableData.length === 0" description="Tidak ada data" class="mt-4" />
      </template>
    </paginated-table>
  </el-card>

  <el-card class="mb-6">
    <el-form label-position="top">
      <el-form-item label="Barang Dipilih">
        <el-tag
          v-for="selected in selectedList"
          key="id"
          class="mr-2 mb-2"
          >
          <el-icon><Box v-if="selected.satuan == 'set'"/><Cpu v-else/></el-icon>
          {{ selected.kode }} ({{ selected.jumlah }} {{ selected.satuan }})
        </el-tag>
          <el-text type="danger" size="small" v-if="selectedList.length == 0">Belum ada barang dipilih</el-text>
      </el-form-item>

      <div class="flex justify-end">
        <el-button type="info" icon="ArrowLeft" @click="keHalamanSirkulasiPeminjaman" plain>Kembali</el-button>
        <el-button type="warning" @click="simpan" :disabled="selectedList.length == 0">{{ !isPeminjaman() ? 'Kembalikan' : isPeminjamanBaru() ? 'Pinjam' : 'Simpan Perubahan' }} Barang</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { apiServices } from '@/services/apiServices';
import { computed, onMounted, ref, toRaw } from 'vue';
import TopSection from '@/components/inventaris/form-sirkulasi-barang/TopSection.vue';
import { watch } from 'vue';
import { ElLoading, ElNotification } from 'element-plus';
import { ObjectId } from 'bson'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
const route = useRoute()
const router = useRouter()
const id_formulir = route.query.id_formulir
const status_sirkulasi = Array.isArray(route.params.status_sirkulasi)
  ? route.params.status_sirkulasi[0]
  : route.params.status_sirkulasi
const isPeminjaman = () => status_sirkulasi === 'peminjaman'
const isPeminjamanBaru = () => isPeminjaman() && !id_formulir
const isPeminjamanLama = () => isPeminjaman() && id_formulir
const form = ref({
  nama: '',
  notel: '',
  tanggal: dayjs().format('YYYY-MM-DD'),
  keterangan: ''
})
const tableData = ref<any[]>([])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const flattenRows = (rows: any[]): any[] => rows.flatMap(row => [row, ...(row.children ? flattenRows(row.children) : [])])
const updateCheckState = () => {
  const allRows = flattenRows(tableData.value)
  const checkedCount = allRows.filter(row => row.checked).length

  checkAll.value = checkedCount === allRows.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRows.length
}
const handleItemCheck = (row: any, newVal: boolean) => {
  row.checked = newVal
  
  if (newVal && (!row.keterangan || row.keterangan.trim() === '')) row.keterangan = form.value.keterangan
}
const handleCheckAllChange = (newVal: boolean) => {
  const allRows = flattenRows(tableData.value)
  allRows.forEach(row => handleItemCheck(row, newVal))
  isIndeterminate.value = false
}
const handleItemCheckChange = (row: any, newVal: boolean) => {
  handleItemCheck(row, newVal)
  if (row.children && row.children.length) row.children.forEach((child: any) => handleItemCheck(child, newVal))
  updateCheckState()
}
const selectedList = computed(() => flattenRows(tableData.value.filter((item) => item.checked == true)))
watch(tableData, () => {
  updateCheckState()
}, { deep: true })
const initFormBarang = (rows: any[], checkedVal: boolean) => {
  rows.forEach(row => {
    row.checked = checkedVal
    row.jumlah_dicatat = isPeminjaman() ? row.jumlah_terkini : row.jumlah - row.jumlah_terkini
    row.keterangan = ''
    row.jumlah_maks_dapat_dicatat = row.jumlah_terkini
    if (row.children) initFormBarang(row.children, checkedVal)
  })
}
const loadInventoriAktif = async () => {
  const status = isPeminjaman() ? 'tidak_dipinjam' : 'dipinjam'
  const response = await apiServices.get(`/inventaris/barang?status=${status}`)
  const result = response.data
  initFormBarang(result, !isPeminjaman)
  Object.assign(tableData.value, result)
}
const loadFormSirkulasi = async () => {
  const response = await apiServices.get(`/inventaris/sirkulasi/?id_formulir=${id_formulir}&status_sirkulasi=${status_sirkulasi}`)
  // set form val
  const informasiSirkulasi = response.data.informasi_sirkulasi
  form.value.nama = informasiSirkulasi.nama,
  form.value.notel = informasiSirkulasi.notel
  form.value.tanggal = informasiSirkulasi.tanggal_pencatatan	
  form.value.keterangan = informasiSirkulasi.keterangan
  //  set table data
  const dataPilihanBarang = response.data.pilihan_barang
  Object.assign(tableData.value, dataPilihanBarang)
}
onMounted(async () => {
  if(isPeminjamanBaru()) await loadInventoriAktif()
  else await loadFormSirkulasi()
})
const reset = async () => {
  form.value.nama = ''
  form.value.notel = ''
  form.value.tanggal = dayjs().format('YYYY-MM-DD')
  form.value.keterangan = ''
  tableData.value.splice(0)
  await loadInventoriAktif()
}
const keHalamanSirkulasiPeminjaman = () => router.push({name:'SirkulasiPeminjaman'})
const simpan = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const statusSirkulasi = isPeminjaman() ? "peminjaman" : "pengembalian"
  const id =
    !isPeminjaman() || isPeminjamanBaru()
      ? new ObjectId().toHexString()
      : id_formulir;

  const request = {
    penanggung_jawab: {
      id,
      ...form.value,
      status_sirkulasi: statusSirkulasi,
      ...(id_formulir ? { id_formulir_sebelumnya: id_formulir } : {})
    },
    barang: selectedList.value,
  };

  try {
    const method = isPeminjamanLama() ? 'patch' : 'post'
    const response = await apiServices[method]('/inventaris/sirkulasi/', request)
    if(!id_formulir) await reset()
    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
    if(id_formulir) keHalamanSirkulasiPeminjaman()
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
</script>