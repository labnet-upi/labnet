<template>
  <el-table
    :data="mergedAspek"
    border
    row-key="id"
    :tree-props="{ children: 'children' }"
    default-expand-all
    :show-summary="true"
    :summary-method="getSummary"
    :span-method="tableSpanMethod"
    style="width: 100%;"
    v-loading="loadingMergeAspek"
  >
    <el-table-column prop="no" label="#" width="60" type="index">
      <template #default="scope">{{ scope.row.no }}</template>
    </el-table-column>

    <el-table-column prop="kriteria" label="Kriteria Penilaian">
      <template #default="scope">
        <strong v-if="scope.row.isParent">{{ scope.row.kriteria }}</strong>
        <template v-else>{{ scope.row.kriteria }}</template>
      </template>
    </el-table-column>

    <el-table-column label="Bobot(B)" width="100" v-if="!tampilkanNilaiSaja">
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

    <el-table-column label="B*N" width="100" v-if="!tampilkanNilaiSaja">
      <template #default="scope">
        <span v-if="!scope.row.isParent && scope.row.nilai_x_bobot">{{ scope.row.nilai_x_bobot.toFixed(2) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { defineProps, nextTick, ref } from 'vue'
import cloneDeep from 'lodash.clonedeep'

const props = defineProps({
  aspek_penilaian: {
    type: Array,
    required: true
  },
  tampilkanNilaiSaja: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['change'])
function changeTrigged() {
  emit('change')
}

const mergedAspek = ref<any[]>([])
const loadingMergeAspek = ref(false)
const keyData=ref<string>('')

const mergeAspek = async (dataNilai: any[] = [], key: string) => {
  loadingMergeAspek.value = true
  keyData.value = key
  mergedAspek.value.splice(0, mergedAspek.value.length)

  const nilaiMap = new Map(dataNilai.map(n => [n.aspek_penilaian_id, n]))

  let parentIndex = 1

  const tambahNilai = (aspek: any, parentNum?: number, childNum?: number): any => {
    const nilaiDitemukan = nilaiMap.get(aspek.id) ?? null

    const nomor = parentNum && childNum ? `${parentNum}.${childNum}` : `${parentIndex}`

    const isChild = Boolean(parentNum && childNum)

    const nilai = aspek.isParent
      ? null
      : nilaiDitemukan?.nilai ?? (isChild ? 90 : null)

    const result: any = {
      id: aspek.id,
      kriteria: aspek.kriteria,
      bobot: aspek.bobot,
      isParent: aspek.isParent,
      nilai,
      nilai_x_bobot: typeof nilai === 'number' && aspek.bobot
        ? (nilai * aspek.bobot) / 100
        : undefined,
      no: nomor,
    }

    if (aspek.children && aspek.children.length) {
      let localChildIndex = 1
      result.children = aspek.children.map((child: any) =>
        tambahNilai(child, parentIndex, localChildIndex++)
      )
    }

    if (!parentNum) parentIndex++

    return result
  }

  mergedAspek.value = cloneDeep(props.aspek_penilaian).map((aspek: any) => tambahNilai(aspek))

  setTimeout(() => {
    loadingMergeAspek.value = false
  }, 300)
}

function updateNilaiXBobot(row: any) {
  changeTrigged()
  row.nilai_x_bobot = ((row.nilai || 0) * (row.bobot || 0)) / 100
}

function getSummary() {
  let total = 0
  mergedAspek.value.forEach(group => {
    group.children?.forEach((child: { nilai_x_bobot: any; }) => {
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
  const nilaiPerId = mergedAspek.value.reduce((acc, element) => {
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
      acc.push(...children)
    }

    return acc
  }, [])

  return { nilai: nilaiPerId }
}

function getKeyData() {
  return {
    key: keyData.value,
  }
}

defineExpose({
  getRekapNilai,
  mergeAspek,
  getKeyData
})
</script>
