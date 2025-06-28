<template>
  <el-row>
    <el-col>
      <h3>Child</h3>
    </el-col>
  </el-row>

  <el-row :gutter="12">
    <el-col :span="5">
      <el-form-item label="Barang">
        <el-input :disabled="props.disableForm" v-model="childFormData.namaBarang" placeholder="Nama Barang" />
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item label="Prefiks Kode">
        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
          <el-input
            :disabled="isPrefiksInactive"
            v-model="childFormData.prefiksKode"
          />
          <el-switch
            :disabled="props.disableForm"
            v-model="childFormData.kodeAktif"
          />
        </div>
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item label="Kode">
        <el-input :disabled="props.disableForm" v-model="childFormData.kode" placeholder="Kode" />
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item label="*">
        <el-button :disabled="props.disableForm || childFormData.kode == ''" type="primary" icon="Plus" circle plain @click="submit"/>
        <el-button :disabled="props.disableForm" type="warning" icon="RefreshRight" circle plain @click="resetForm"/>
      </el-form-item>
    </el-col>
  </el-row>
  
  <el-row :gutter="12">
    <el-col :span="5">
      <el-form-item label="Kondisi">
        <el-select :disabled="props.disableForm" v-model="childFormData.kondisi" placeholder="Pilih Kondisi">
          <el-option
            v-for="opsi in opsiKondisiBarang"
            :key="opsi.value"
            :label="opsi.label"
            :value="opsi.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
  
    <el-col :span="5">
      <el-form-item label="Satuan">
        <el-select :disabled="props.disableForm" v-model="childFormData.satuan" placeholder="Pilih Satuan">
          <el-option
            v-for="opsi in opsiSatuan"
            :key="opsi.value"
            :label="opsi.label"
            :value="opsi.value"
          />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item label="Jumlah">
        <el-input-number :disabled="props.disableForm" v-model="childFormData.jumlah" />
      </el-form-item>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { opsiKondisiBarang, opsiSatuan } from '@/services/inventoriServices'

const props = defineProps({
  disableForm: { type: Boolean, required: true }
})
const emit = defineEmits(['submit'])

const lastPrefix = ref('')
const defaultChildFormData = () => ({
  namaBarang: '',
  prefiksKode: '',
  kode: '',
  kodeAktif: false,
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
  jumlah: 1
})
const childFormData = reactive<any>({...defaultChildFormData()})

function resetForm() {
  Object.assign(childFormData, defaultChildFormData())
}

function submit() {
  lastPrefix.value = childFormData.prefiksKode
  const newData = Object.assign({}, childFormData)
  emit('submit',newData)
  resetForm()
}

const setPrefix = (prefix: string) => {
  lastPrefix.value = prefix
  childFormData.prefiksKode = prefix
}

const isPrefiksInactive = computed(() => {
  if(props.disableForm) return true
  else if(childFormData.kodeAktif) return false
  return true
})

defineExpose({
  setPrefix,
  resetForm
})
</script>