<template>
  <div class="overflow-auto max-w-full">
    <el-table
      :data="data"
      border
      row-key="id"
      :tree-props="{ children: 'children' }"
      default-expand-all
      :show-summary="true"
      :summary-method="getSummary"
      :span-method="tableSpanMethod"
      style="width: 100%;"
    >
      <el-table-column type="index" label="No"/>
  
      <el-table-column prop="kriteria" label="Kriteria Penilaian">
        <template #default="scope">
          <strong v-if="scope.row.isParent">{{ scope.row.kriteria }}</strong>
          <template v-else>{{ scope.row.kriteria }}</template>
        </template>
      </el-table-column>
  
      <el-table-column label="Bobot(B)" width="100">
        <template #default="scope">
          <span v-if="!scope.row.isParent">{{ scope.row.bobot }}%</span>
        </template>
      </el-table-column>
  
      <el-table-column label="Nilai(N)" width="140">
        <template #default="scope">
          <span v-if="!scope.row.isParent">
            <el-input
              v-model.number="scope.row.nilai"
              :min="1"
              :max="100"
              placeholder="1-100"
              @input="updateNilaiXBobot(scope.row)"
            />
          </span>
        </template>
      </el-table-column>
  
      <el-table-column label="B*N" width="100">
        <template #default="scope">
          <span v-if="!scope.row.isParent && scope.row.nilai_x_bobot">{{ scope.row.nilai_x_bobot.toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  data: any[]
}>()

function updateNilaiXBobot(row: any) {
  row.nilai_x_bobot = ((row.nilai || 0) * (row.bobot || 0)) / 100
}

function getSummary() {
  let total = 0
  props.data.forEach(group => {
    group.children?.forEach(child => {
      total += child.nilai_x_bobot || 0
    })
  })
  return ['', '', '', 'Total', total.toFixed(2)]
}

function tableSpanMethod({ row, columnIndex }: { row: any; columnIndex: number }) {
  if (row.isParent) {
    if (columnIndex === 1) return [1, 4]
    if (columnIndex >= 2 && columnIndex <= 4) return [0, 0]
  }
}

function getRekapNilai() {
  const nilaiPerId = props.data.reduce((acc, element) => {
    const children = element.children?.reduce((childAcc: any[], childElement: any) => {
      if (childElement.nilai != null) {
        childAcc.push({
          aspek_penilaian_id: childElement.id,
          nilai: childElement.nilai
        })
      }
      return childAcc
    }, []) || []

    if (children.length > 0) {
      acc.push({
        aspek_penilaian_id: element.id,
        children: children
      })
    }

    return acc
  }, [])

  return { nilai: nilaiPerId }
}

defineExpose({
  getRekapNilai
})
</script>
