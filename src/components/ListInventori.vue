<template>
  <el-card class="mb-6">
    <DeleteSelectionBar :selected-length="selectedList.length" @delete="konfirmasiPenghapus('multiple')"></DeleteSelectionBar>
    <el-table :data="tableData" style="width: 100%" row-key="id" default-expand-all @selection-change="handleSelectionChange">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column type="selection" width="55" />
      <el-table-column prop="nama" label="Nama" >
        <template #default="scope">
          <strong v-if="scope.row.children">{{ scope.row.nama }}</strong>
          <span v-else>{{ scope.row.nama }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="kode" label="Kode Barang" width="150" />
      <el-table-column prop="kondisi" label="Kondisi Terakhir" />
      <el-table-column prop="jumlah" label="Jumlah" width="200">
        <template #default="scope">
          {{ scope.row.jumlah }} {{ scope.row.satuan }}
        </template>
      </el-table-column>
      <el-table-column label="" width="100">
        <template #default="scope">
          <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
            <el-button text icon="MoreFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="detail"><el-icon><View /></el-icon>Detail</el-dropdown-item>
                <el-dropdown-item command="salin"><el-icon><CopyDocument /></el-icon>Salin</el-dropdown-item>
                <el-dropdown-item command="hapus" class="!text-red-500"><el-icon><Remove /></el-icon>Hapus</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

      <template #expand="props">
        <el-table
          v-if="props.row.satuan === 'set' && props.row.children?.length"
          :data="props.row.children"
          size="small"
          row-key="id"
        >
          <el-table-column prop="nama" label="Child Barang" />
          <el-table-column prop="kode" label="Kode" width="150" />
          <el-table-column prop="kondisi" label="Kondisi" />
        </el-table>
        <span v-else>Tidak ada child barang</span>
      </template>
    </el-table>

    <el-empty v-if="tableData.length === 0" description="Belum ada data" class="mt-4" />
  </el-card>

  <el-dialog
    v-model="deleteConfirmVisible"
    title="Konfirmasi"
    width="500"
    align-center
  >
    <span>Yakin hapus data?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">Batal</el-button>
        <el-button type="danger" @click="hapusData()">
          Hapus
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormBarang } from '@/services/inventoriServices'
import DeleteSelectionBar from '@/components/DeleteSelectionBar.vue'

const tableData = ref<FormBarang[]>([])

const selectedList = ref<FormBarang[]>([])
const selectedData = ref<any>()
const deleteConfirmVisible = ref(false)
const modeHapus = ref<string>("")

const hapusData = () => {
  function hapusItemRekursif(list: FormBarang[], selectedIds: Set<string>): FormBarang[] {
    return list
      .filter(item => !selectedIds.has(item.id))
      .map(item => {
        if (item.children && item.children.length > 0) {
          item.children = hapusItemRekursif(item.children, selectedIds)
        }
        return item
      })
  }

  let selectedIds: string[] = []

  if (modeHapus.value === 'multiple') {
    selectedIds = selectedList.value.map(item => item.id)
    selectedList.value = []
  } else if (modeHapus.value === 'single') {
    selectedIds = [selectedData.value.id]
    selectedData.value = null
  }

  const selectedIdSet = new Set(selectedIds)
  tableData.value = hapusItemRekursif(tableData.value, selectedIdSet)

  deleteConfirmVisible.value = false
}

const konfirmasiPenghapus = (mode: string) => {
  modeHapus.value = mode
  deleteConfirmVisible.value = true
}

const salinData = (row: any) => {
}

const handleCommand = (command: string, row: any) => {
  selectedData.value = row
  if (command === 'hapus') {
    konfirmasiPenghapus("single")
  } else if (command === 'salin') {
    salinData(row)
  }
}

const handleSelectionChange = (val: FormBarang[]) => selectedList.value = val
const setTableData = (newData: FormBarang[]) => tableData.value = newData
const addToTableData = (newData: FormBarang[]) => newData.forEach(data => tableData.value.push(data))
const getTableData = () => (Array.from(tableData.value))
const clearTableData = () => tableData.value.slice(0)

defineExpose({
  setTableData,
  addToTableData,
  getTableData,
  clearTableData
})
</script>