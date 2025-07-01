<template>
  <DeleteSelectionBar :selected-length="selectedList.length" @delete="konfirmasiPenghapus('multiple')"></DeleteSelectionBar>
  <paginated-table
    :data="props.data"
    style="width: 100%" row-key="id"
    default-expand-all
    :show-search="props.showSearch"
    :search-fields="searchFields"
    @selection-change="handleSelectionChange">
    <paginated-table-column type="selection" width="55" />
    <paginated-table-column prop="nama" label="Nama" >
      <template #default="scope">
        <strong v-if="scope.row.children">{{ scope.row.nama }}</strong>
        <span v-else>{{ scope.row.nama }}</span>
      </template>
    </paginated-table-column>
    <paginated-table-column prop="kode" label="Kode Barang" width="150">
      <template #default="scope">
        <el-tag type="info" effect="light">{{ scope.row.kode }}</el-tag>
      </template>
    </paginated-table-column>
    <paginated-table-column prop="kondisi" label="Kondisi Terakhir" />
    <paginated-table-column prop="jumlah" label="Jumlah" width="200">
      <template #default="scope">
        {{ scope.row.jumlah }} {{ scope.row.satuan }}
      </template>
    </paginated-table-column>
    <paginated-table-column label="" width="100">
      <template #default="scope">
        <el-dropdown @command="(command: string) => handleCommand(command, scope.row)">
          <el-button text icon="MoreFilled" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit"><el-icon><Edit /></el-icon>Edit</el-dropdown-item>
              <el-dropdown-item command="salin" v-if="!isChild(scope.row)"><el-icon><CopyDocument /></el-icon>Salin</el-dropdown-item>
              <el-dropdown-item command="hapus" class="!text-red-500"><el-icon><Remove /></el-icon>Hapus</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </paginated-table-column>

    <template #before-footer>
      <el-empty v-if="props.data.length === 0" description="Belum ada data" class="mt-4" />
    </template>
  </paginated-table>

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

  <el-dialog
    v-model="editVisible"
    title="Edit Data"
    width="1200"
    @opened="onEditDialogOpened"
  >
    <RegisterSection :show-button="false" ref="editRef" @submit="onSubmitRegisterSection"></RegisterSection>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editVisible = false">Batal</el-button>
        <el-button type="warning" @click="editData">
          Simpan Perubahan
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="salinVisible"
    title="Salin Data"
    width="1200"
    @opened="onSalinDialogOpened"
  >
    <GenerateData ref="salinRef" :show-button="false" @simpan="(newData: FormBarang[]) => onSubmitSalinSection(newData)"></GenerateData>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="salinVisible = false">Batal</el-button>
        <el-button type="info" @click="generateDataSalinan">
          Generate Data
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, nextTick } from 'vue'
import { FormBarang } from '@/services/inventoriServices'
import DeleteSelectionBar from '../dashboard/DeleteSelectionBar.vue'
import type { PropType } from 'vue'
const GenerateData = defineAsyncComponent(() => import(/* webpackPrefetch: true */ '@/components/inventaris/form-inventori/GenerateData.vue'))
const RegisterSection = defineAsyncComponent(() => import(/* webpackPrefetch: true */ '@/components/inventaris/form-inventori/RegisterSection.vue'))

const props = defineProps({
  data: { type: Array as PropType<any[]>, default: () => [] },
  searchFields: { type: Array as PropType<string[]>, default: () => [] },
  showSearch: { type: Boolean, default: false },
  showFilter: { type: Boolean, default: false },
})
const emit = defineEmits(['hapus', 'submit-perubahan', 'submit-salinan-data'])
const editRef = ref()
const salinRef = ref()
const selectedList = ref<FormBarang[]>([])
const selectedData = ref<any>()
const deleteConfirmVisible = ref(false)
const editVisible = ref(false)
const salinVisible = ref(false)
const modeHapus = ref<string>("")
const hapusData = async () => {
  let selectedIds: string[] = []
  if (modeHapus.value === 'multiple') {
    selectedIds = selectedList.value.map(item => item.id)
    selectedList.value = []
  } else if (modeHapus.value === 'single') {
    selectedIds = [selectedData.value.id]
    selectedData.value = null
  }
  const selectedIdSet = new Set(selectedIds)
  emit('hapus', selectedIdSet,
    (isSuccess: boolean) => deleteConfirmVisible.value = !isSuccess
  )
}
const konfirmasiPenghapus = (mode: string) => (modeHapus.value = mode, deleteConfirmVisible.value = true)
const editedRow = ref<any | null>(null)
const salinRow = ref<any | null>(null)
const bukaDialogEdit = (row: any) => (editedRow.value = row, editVisible.value = true)
const bukaDialogSalinData = (row: any) => (salinRow.value = row, salinVisible.value = true)
const onDialogAction = async (componentRef: any, dataRow: any, callback: Function) => {
  await nextTick()
  if (componentRef.value && dataRow.value) callback()
}
const onEditAction = (callback: Function) => onDialogAction(editRef, editedRow, callback)
const onSalinAction = (callback: Function) => onDialogAction(salinRef, salinRow, callback)
const onEditDialogOpened = () => onEditAction(() => editRef.value.setForm(editedRow.value))
const onSalinDialogOpened = () => onSalinAction(() => salinRef.value.setForm(salinRow.value))
const editData = () => onEditAction(() => editRef.value.triggerSubmit())
const generateDataSalinan = () => onSalinAction(async () => salinRef.value.triggerGenerateData())
const onSubmitRegisterSection = (submitData: FormBarang) => {
  editedRow.value = submitData
  emit('submit-perubahan', editedRow.value,
    (isSuccess: boolean) => editVisible.value = !isSuccess
  )
}
const onSubmitSalinSection = (submitData: FormBarang[]) => {
  console.log('submitData')
  emit('submit-salinan-data', submitData,
    (isSuccess: boolean) => salinVisible.value = !isSuccess
  )
}
const commandHandlers: Record<string, (row: any) => void> = {
  hapus: () => konfirmasiPenghapus('single'),
  salin: bukaDialogSalinData,
  edit: bukaDialogEdit,
}
const handleCommand = (command: string, row: any) => {
  selectedData.value = row
  commandHandlers[command]?.(row)
}
const handleSelectionChange = (val: FormBarang[]) => selectedList.value = val
const getTableData = () => (Array.from(props.data))
const clearTableData = () => props.data.slice(0)
const isChild = (row: any): boolean => props.data.some(item => item.children?.some((child: any) => child.id === row.id))
defineExpose({
  getTableData,
  clearTableData
})
</script>