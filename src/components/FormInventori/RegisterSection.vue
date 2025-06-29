<template>
  <el-form label-position="top" class="mb-4">
    <register-input
      :is-set-section="true"
      :is-plain="showChild"
      @ubah-satuan="handleUbahSatuanParent"
      @clear="handleClear"
      @submit="handleSubmit"
      >
    </register-input>
    <register-input
      :is-set-section="false"
      :is-plain="false"
      @clear="handleClear"
      @submit="addPcsData"
      v-show="showChild"
      ref="pcsInputRef"
      class="mt-2">
    </register-input>
    
    <el-row v-if="pcsData.length > 0" class="mt-2">
      <el-col :span="24">
        <el-tag
          v-for="(c, idx) in pcsData"
          :key="c.id"
          closable
          @close="hapusChild(idx)"
          class="mr-2 mb-2"
        >
          {{ c.nama }} - {{ c.kode }} ({{ c.jumlah }} {{ c.satuan }} {{ c.kondisi }})
        </el-tag>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegisterInput from './RegisterInput.vue'
import { FormBarang } from '@/services/inventoriServices'

const emit = defineEmits(['submit'])
const pcsInputRef = ref()
const pcsData = ref<FormBarang[]>([])
const showChild = ref(false)

const hapusChild = (idx: number) => {
  pcsData.value.splice(idx, 1)
}

function handleUbahSatuanParent(isSet: boolean) {
  showChild.value = isSet

  pcsInputRef.value.handleClear()
}

function handleClear() {
  if(pcsData.value.length) pcsData.value.splice(0)
}

function addPcsData(newData: FormBarang) {
  pcsData.value.push(newData)
}

function handleSubmit(parentData: FormBarang) {
  const childData = Array.from(pcsData.value)
  emit('submit', {
    ...parentData,
    children: childData
  })

  pcsInputRef.value.handleClear()
}
</script>
