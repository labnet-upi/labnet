<template>
  <el-form label-position="top" class="mb-4" ref="formRef" :rules="rules" :model="parentFormData">
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Barang" prop="namaBarang">
          <el-autocomplete
            v-model="parentFormData.namaBarang"
            :fetch-suggestions="inventoriStore.getSaranNama"
            :trigger-on-focus="false"
            clearable
            value-key="nama"
            @select="(item: any) => inventoriStore.handleSelectSaranNamaBarang(item, parentFormData, prefiksDiubah, handleSatuan)"
            placeholder="Nama Barang"/>
        </el-form-item>
      </el-col>
  
      <el-col :span="5">
        <el-form-item label="Prefiks Kode" prop="prefiksKode">
          <el-autocomplete
           v-model="parentFormData.prefiksKode"
            :fetch-suggestions="inventoriStore.getSaranKode"
            :trigger-on-focus="false"
            clearable
            value-key="kode"
           placeholder="Prefiks Kode"
           @blur="prefiksDiubah"/>
        </el-form-item>
      </el-col>
  
      <el-col :span="4">
        <el-form-item label="Angka Awal" prop="angkaAwal">
          <el-input-number v-model="parentFormData.angkaAwal" />
        </el-form-item>
      </el-col>
  
      <el-col :span="4">
        <el-form-item label="Jumlah" prop="jumlah">
          <el-input-number v-model="parentFormData.jumlah" />
        </el-form-item>
      </el-col>
  
      <el-col :span="6">
        <div class="!flex !items-end !justify-end">
          <el-button type="warning" icon="RefreshRight" @click="resetForm">{{ showButton ? '' : 'Reset' }}</el-button>
          <el-button type="info" icon="MagicStick" @click="generateData" v-if="showButton">Generate</el-button>
        </div>
      </el-col>
    </el-row>
  
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Kondisi" prop="kondisi">
          <el-select v-model="parentFormData.kondisi" placeholder="Pilih Kondisi">
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
          <el-select v-model="parentFormData.satuan" placeholder="Pilih Satuan" @change="handleSatuan">
            <el-option
              v-for="opsi in opsiSatuan"
              :key="opsi.value"
              :label="opsi.label"
              :value="opsi.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="4">
        <el-form-item label="Digit" prop="digit">
          <el-input-number v-model="parentFormData.digit" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { opsiKondisiBarang, opsiSatuan, useInventoriStore, getParentGeneratedData, FormBarang } from '@/services/inventoriServices'
import { generateRules } from '@/services/formValidateServices'

const props = defineProps({
  showButton: { type: Boolean, required: true }
})
const inventoriStore = useInventoriStore()
const emit = defineEmits(['generate', 'prefix-diubah', 'ubah-satuan'])

const defaultParentFormData = () => ({
  namaBarang: '',
  prefiksKode: '',
  angkaAwal: 1,
  jumlah: 1,
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
  digit: 3,
})
const parentFormData = reactive<any>({...defaultParentFormData()})
const rules = generateRules(parentFormData)
const formRef = ref()
const resetForm = () => Object.assign(parentFormData, defaultParentFormData())

const generateData = async () => {
  try {
    await formRef.value.validate()
    const newData = Object.assign({}, parentFormData)
    emit('generate', newData)
  } catch (err) {
    console.warn('Form tidak valid', err)
  }
}

const prefiksDiubah = () => emit('prefix-diubah', parentFormData.prefiksKode + '-')
const handleSatuan = () => emit('ubah-satuan', parentFormData.satuan === opsiSatuan[0].value)
const setForm = (formBarang: FormBarang) => {
  const newData = getParentGeneratedData(formBarang)
  Object.assign(parentFormData, newData)
  prefiksDiubah()
  handleSatuan()
}
const triggerGenerateData = () => {
  generateData()
}
defineExpose({
  resetForm,
  setForm,
  triggerGenerateData
})
</script>
