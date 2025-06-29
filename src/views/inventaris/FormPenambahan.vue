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
        <el-button type="warning" icon="RefreshRight">Reset</el-button>
        <el-button type="success" icon="CircleCheckFilled">Simpan</el-button>
      </div>
    </div>
  </el-card>

  <el-card class="mb-6">
    <ListBarang ref="listBarangRef" :data="tableData"></ListBarang>
  </el-card>

</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { FormBarang } from '@/services/inventoriServices'
import ListBarang from '@/components/ListBarang.vue'

const GenerateData = defineAsyncComponent(() => import('@/components/FormInventori/GenerateData.vue'))
const RegisterSection = defineAsyncComponent(() => import(/* webpackPrefetch: true */ '@/components/FormInventori/RegisterSection.vue'))

const opsiModeInput = [
  {label: "Generate", value: "generate"},
  {label: "Manual", value: "manual"},
]
const modeInput = ref(opsiModeInput[0].value)
const listBarangRef = ref()
const tableData = ref<FormBarang[]>([])
const pushToTableData = (newData: FormBarang[]) => newData.forEach(data => tableData.value.push(data))
</script>
