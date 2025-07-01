<template>
  <register-input
    :is-set-section="true"
    :is-plain="showChild"
    @ubah-satuan="handleUbahSatuanParent"
    @clear="handleClear"
    @submit="handleSubmit"
    ref="parentInputRef"
    :show-button="showButton">
  </register-input>
  <register-input
    v-if="showSetSection"
    :is-set-section="false"
    :is-plain="false"
    @clear="handleClear"
    @submit="addPcsData"
    v-show="showChild"
    ref="pcsInputRef"
    class="mt-2"
    :show-button="true">
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegisterInput from './RegisterInput.vue'
import { FormBarang, useInventoriStore } from '@/services/inventoriServices'
const inventoriStore = useInventoriStore()
const props = defineProps({
  showButton: { type : Boolean, default: true },
  showSetSection: { type: Boolean, default: true }
})
const emit = defineEmits(['submit'])
const parentInputRef = ref()
const pcsInputRef = ref()
const pcsData = ref<FormBarang[]>([])
const showChild = ref(false)

const hapusChild = (idx: number) => pcsData.value.splice(idx, 1)
function handleUbahSatuanParent(isSet: boolean) {
  showChild.value = isSet
  pcsInputRef.value.handleClear()
}
function handleClear() {
  if(pcsData.value.length) pcsData.value.splice(0)
}
const addPcsData = (newData: FormBarang) => pcsData.value.push(newData)
const getSubmitData = (parentData: FormBarang) => {
  const childData = Array.from(pcsData.value)
  return {
    ...parentData,
    children: childData
  }
}
function handleSubmit(parentData: FormBarang) {
  const submitData = getSubmitData(parentData)
  emit('submit', submitData)
  inventoriStore.pushSaranIsi([submitData])
  pcsInputRef.value.handleClear()
}
const setForm = (newData: FormBarang) => {
  parentInputRef.value.setForm(newData)
  if(newData.children && newData.children.length) {
    pcsData.value.splice(0, pcsData.value.length, ...newData.children)
  } else {
    pcsData.value.splice(0)
  }
}
const triggerSubmit = () => parentInputRef.value.triggerSubmit()
defineExpose({
  setForm,
  triggerSubmit
})
</script>
