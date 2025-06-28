<template>
  <el-card class="mb-6">
    <el-segmented
      v-model="modeInput"
      :options="opsiModeInput"
      class="my-3"
    />
    <GenerateData v-if="modeInput === opsiModeInput[0].value"></GenerateData>
    <RegisterSection @submit="pushToTableData" v-else></RegisterSection>
  </el-card>

  <el-card class="mb-6">
    <div class="flex items-end justify-end">
      <el-button type="warning" icon="RefreshRight">Reset</el-button>
      <el-button type="success" icon="CircleCheckFilled">Simpan</el-button>
    </div>
  </el-card>

  <ListInventori ref="listInventoriRef"></ListInventori>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RegisterSection from '@/components/FormInventori/RegisterSection.vue'
import { FormBarang } from '@/services/inventoriServices'
import GenerateData from '@/components/FormInventori/GenerateData.vue'
import ListInventori from '@/components/ListInventori.vue'

const opsiModeInput = [
  {label: "Generate", value: "generate"},
  {label: "Manual", value: "manual"},
]
const modeInput = ref(opsiModeInput[0].value)

const listInventoriRef = ref()

const pushToTableData = (newData: FormBarang) => {
  listInventoriRef.value.addToTableData(newData)
}
</script>
