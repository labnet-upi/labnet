<template>
  <el-table
    :data="displayedKriteria"
    border
    style="width: 100%"
    show-summary
    :summary-method="getSummaries"
    ref="tableRef">
    <el-table-column label="No" type="index"></el-table-column>
    <!-- Kriteria -->
    <el-table-column label="Kriteria" width="300">
      <template #default="scope">
        <el-input
          v-model="scope.row.kriteria"
          placeholder="Kriteria"
          @input="handleKriteriaInput(scope.$index)"
        />
      </template>
    </el-table-column>

    <!-- Sub-Kriteria -->
    <el-table-column label="Sub-Kriteria">
      <template #default="scope">
        <el-table
          :data="getDisplayedSubKriteria(scope.row)"
          size="small"
          border
          style="width: 100%"
        >
          <el-table-column label="No" type="index"></el-table-column>
          <el-table-column label="Sub-Kriteria">
            <template #default="subScope">
              <el-input
                v-model="subScope.row.kriteria"
                placeholder="Sub-Kriteria"
                @input="handleSubInput(scope.$index, subScope.$index)"
              />
            </template>
          </el-table-column>

          <el-table-column label="Bobot" width="165">
            <template #default="subScope">
              <el-input-number
                v-model="subScope.row.bobot"
                :min="0"
                :max="100"
                :step="1"
                width="100"
                controls-position="right"
                @change="handleSubInput(scope.$index, subScope.$index)"
              />
            </template>
          </el-table-column>

          <!-- Tombol Hapus Sub-Kriteria -->
          <el-table-column width="80">
            <template #default="subScope">
              <div class="flex item-center justify-center">
                <el-button
                  type="danger"
                  size="small"
                  @click="removeSubKriteria(scope.$index, subScope.$index)"
                  :disabled="scope.row.children.length -1 === subScope.$index"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-table-column>

    <!-- Tombol Hapus Kriteria -->
    <el-table-column width="100" align="center">
      <template #default="scope">
        <div class="flex item-center justify-center">
          <el-button
            type="danger"
            size="small"
            @click="removeKriteria(scope.$index)"
            :disabled="kriteriaList.length - 1 === scope.$index"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  tahun: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change'])

interface SubKriteria {
  id: any
  kriteria: string
  bobot: number
}

interface Kriteria {
  id: any
  kriteria: string
  children: SubKriteria[]
}

const tableRef = ref()
const kriteriaList = ref<Kriteria[]>([
  {
    id: null,
    kriteria: '',
    children: [{ id: null, kriteria: '', bobot: 0 }]
  }
])

function changeTrigged() {
  emit('change')
}

const displayedKriteria = computed(() => kriteriaList.value)

function getDisplayedSubKriteria(kriteria: Kriteria) {
  return kriteria.children
}

function handleKriteriaInput(index: number) {
  changeTrigged()

  const current = kriteriaList.value[index]
  if (!current) return

  const isLast = index === kriteriaList.value.length - 1
  const isValid = current.kriteria.trim() !== ''

  if (isLast && isValid) {
    kriteriaList.value.push({
      id: null,
      kriteria: '',
      children: [{ id: null, kriteria: '', bobot: 0 }]
    })
  }
}

function handleSubInput(kriteriaIndex: number, subIndex: number) {
  changeTrigged()

  const kriteria = kriteriaList.value[kriteriaIndex]
  if (!kriteria) return

  const subList = kriteria.children
  const current = subList[subIndex]
  if (
    subIndex === subList.length - 1 &&
    (current.kriteria.trim() !== '' || current.bobot > 0)
  ) {
    subList.push({ id: null, kriteria: '', bobot: 0 })
  }
}

function removeKriteria(index: number) {
  changeTrigged()

  if (kriteriaList.value.length > 1) kriteriaList.value.splice(index, 1)
}

function removeSubKriteria(kriteriaIndex: number, subIndex: number) {
  changeTrigged()
  
  const subList = kriteriaList.value[kriteriaIndex]?.children
  if (subList && subList.length > 1) subList.splice(subIndex, 1)
}

function getCleanKriteriaList() {
  return kriteriaList.value
    .filter(k => k.kriteria.trim() !== '')
    .map(k => ({
      id: k.id,
      kriteria: k.kriteria.trim(),
      tahun: props.tahun,
      children: k.children
        .filter(sub => sub.kriteria.trim() !== '' || sub.bobot > 0)
        .map(sub => ({
          id: sub.id,
          kriteria: sub.kriteria.trim(),
          tahun: props.tahun,
          bobot: sub.bobot
        }))
    }))
    .filter(k => k.children.length > 0)
}

const totalBobot = computed(() => {
  return kriteriaList.value.reduce((total, kriteria) => {
    return total + kriteria.children.reduce((subTotal, sub) => {
      return subTotal + (sub.bobot || 0)
    }, 0)
  }, 0)
})

const getSummaries = () => {
  // Setelah summary dibuat, update class baris summary
  nextTick(() => {
    const el = tableRef.value?.$el as HTMLElement
    const summaryRow = el?.querySelector('.el-table__footer-wrapper tr') as HTMLElement
    if (summaryRow) {
      if (totalBobot.value > 100) {
        summaryRow.classList.add('warning-row')
      } else {
        summaryRow.classList.remove('warning-row')
      }
    }
  })

  return ['', '', 'Total Bobot', totalBobot.value]
}

function setKriteriaList(data: any[]) {
  const newList = data.map((item: any) => {
    const children = [...(item.children || [])].map((sub: any) => ({
      id: sub.id ?? null,
      kriteria: sub.kriteria || '',
      bobot: sub.bobot || 0
    }))

    const lastChild = children.at(-1)
    if (!lastChild || lastChild.kriteria.trim() !== '' || lastChild.bobot > 0) {
      children.push({ id: null, kriteria: '', bobot: 0 })
    }

    return {
      id: item.id ?? null,
      kriteria: item.kriteria || '',
      children
    }
  })

  const last = newList.at(-1)
  if (!last || last.kriteria.trim() !== '') {
    newList.push({
      id: null,
      kriteria: '',
      children: [{ id: null, kriteria: '', bobot: 0 }]
    })
  }

  kriteriaList.value = newList
}

defineExpose({
  getCleanKriteriaList,
  setKriteriaList
})
</script>
