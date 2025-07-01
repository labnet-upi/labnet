<template>
  <el-form label-position="top" class="mb-4" ref="formRef" :rules="rules" :model="childFormData">
    <el-row class="my-3">
      <el-col>
        <h3>Bagian Set</h3>
      </el-col>
    </el-row>
  
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Barang" prop="namaBarang">
          <el-autocomplete
            :disabled="props.disableForm"
            v-model="childFormData.namaBarang"
            :fetch-suggestions="inventoriStore.getSaranNama"
            :trigger-on-focus="false"
            clearable
            value-key="nama"
            @select="(item: any) => inventoriStore.handleSelectSaranNamaBarang(item, childFormData)"
            placeholder="Nama Barang" />
        </el-form-item>
      </el-col>
  
      <el-col :span="5">
        <el-form-item label="Prefiks Kode" prop="prefiksKode">
          <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
            <el-autocomplete
              :disabled="isPrefiksInactive"
              :fetch-suggestions="inventoriStore.getSaranKode"
              :trigger-on-focus="false"
              clearable
              value-key="kode"
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
        <el-form-item label="Kode" prop="kode">
          <el-input :disabled="props.disableForm" v-model="childFormData.kode" placeholder="Kode" />
        </el-form-item>
      </el-col>
  
      <el-col :span="5">
        <el-form-item label="*">
          <el-button :disabled="props.disableForm" type="primary" icon="Plus" circle plain @click="submit"/>
          <el-button :disabled="props.disableForm" type="warning" icon="RefreshRight" circle plain @click="resetForm"/>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Kondisi" prop="kode">
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
        <el-form-item label="Satuan" prop="satuan">
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
        <el-form-item label="Jumlah" prop="jumlah">
          <el-input-number :disabled="props.disableForm" v-model="childFormData.jumlah" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { opsiKondisiBarang, opsiSatuan, useInventoriStore } from '@/services/inventoriServices'
import { generateRules } from '@/services/formValidateServices'

const inventoriStore = useInventoriStore()
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
const rules = generateRules(childFormData)
const formRef = ref()
function resetForm() {
  Object.assign(childFormData, defaultChildFormData())
}

async function submit() {
  try {
    await formRef.value.validate()
    lastPrefix.value = childFormData.prefiksKode
    const newData = Object.assign({}, childFormData)
    emit('submit',newData)
    resetForm()
  } catch (err) {
    // Validasi gagal
    console.warn('Form tidak valid', err)
  }
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