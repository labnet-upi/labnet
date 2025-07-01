<template>
  <el-card class="mb-6">
    <el-segmented
      v-model="modeInput"
      :options="opsiModeInput"
      class="my-3"
    />
    <GenerateData
      v-if="modeInput === opsiModeInput[0].value"
      @simpan="(newData) => pushToTableData(newData)">
    </GenerateData>
    <RegisterSection
      v-else 
      @submit="(newData) => pushToTableData([newData])">
    </RegisterSection>
  </el-card>

  <el-card class="mb-6">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold">Daftar Inventaris</h3>

      <div class="flex items-center space-x-2">
        <el-button type="warning" icon="RefreshRight" @click="reset" :disabled="tableData.length == 0">Reset</el-button>
        <el-button type="success" icon="CircleCheckFilled" @click="simpan" :disabled="tableData.length == 0">Simpan</el-button>
      </div>
    </div>
  </el-card>

  <el-card class="mb-6">
    <ListBarang ref="listBarangRef" :data="tableData"></ListBarang>
  </el-card>

</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { FormBarang, useInventoriStore } from '@/services/inventoriServices'
import ListBarang from '@/components/inventaris/ListBarang.vue'
import { apiServices } from '@/services/apiServices'
import { ElLoading, ElNotification } from 'element-plus'

const inventoriStore = useInventoriStore()

const GenerateData = defineAsyncComponent(() => import('@/components/inventaris/form-inventori/GenerateData.vue'))
const RegisterSection = defineAsyncComponent(() => import(/* webpackPrefetch: true */ '@/components/inventaris/form-inventori/RegisterSection.vue'))

const opsiModeInput = [
  {label: "Generate", value: "generate"},
  {label: "Manual", value: "manual"},
]
const modeInput = ref(opsiModeInput[0].value)
const listBarangRef = ref()
const tableData = ref<FormBarang[]>([])
const pushToTableData = (newData: FormBarang[]) => tableData.value.unshift(...newData)
const reset = () => tableData.value.splice(0) // i dont know but, doesnt works
const simpan = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  try {
    const response = await apiServices.post('/inventaris/barang/', tableData.value)

    // Jika berhasil, kosongkan tableData
    reset()

    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
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

onMounted(() => {
  Object.assign(tableData.value, [])
  inventoriStore.loadSaranIsi()
})
</script>