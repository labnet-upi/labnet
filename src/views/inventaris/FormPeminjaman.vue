<template>
  <el-card class="mb-6">
    <TopSection :form="form"></TopSection>
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
      <paginated-table-column prop="jumlah" label="Stok" width="60" align="center"></paginated-table-column>
      <paginated-table-column prop="jumlah" label="Jumlah" width="200">
        <template #default="scope">
          <el-input-number v-model="scope.row.jumlah" :min="1" :max="scope.row.jumlah">
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
        <el-button type="primary">Simpan</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { apiServices } from '@/services/apiServices';
import { computed, onMounted, ref } from 'vue';
import TopSection from '@/components/FormSirkulasiBarang/TopSection.vue';
import { rowContextKey } from 'element-plus';
import { watch } from 'vue';

const form = ref({
  nama: '',
  notel: '',
  tanggal: '',
  pencatat: '',
  keterangan: ''
})

const tableData = ref<any[]>([])
const loadInventoriAktif = async () => {
  const response = await apiServices.get('/inventaris/barang/')
  Object.assign(tableData.value, response.data)
}


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
const selectedList = computed(() => tableData.value.filter((item) => item.checked == true))
watch(tableData, () => {
  updateCheckState()
}, { deep: true })

onMounted(async () => {
  await loadInventoriAktif()
  // Tambahkan properti `checked` ke semua row
  const initCheckbox = (rows: any[]) => {
    rows.forEach(row => {
      row.checked = false
      if (row.children) initCheckbox(row.children)
    })
  }
  initCheckbox(tableData.value)
})
</script>