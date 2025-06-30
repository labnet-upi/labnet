<template>
  <el-row :gutter="12">
    <el-col :span="5">
      <el-form-item label="Barang">
        <el-input v-model="parentFormData.namaBarang" placeholder="Nama Barang" />
      </el-form-item>
    </el-col>

    <el-col :span="5">
      <el-form-item label="Prefiks Kode">
        <el-input v-model="parentFormData.prefiksKode" placeholder="Prefiks Kode" @blur="prefiksDiubah"/>
      </el-form-item>
    </el-col>

    <el-col :span="4">
      <el-form-item label="Angka Awal">
        <el-input-number v-model="parentFormData.angkaAwal" />
      </el-form-item>
    </el-col>

    <el-col :span="4">
      <el-form-item label="Jumlah">
        <el-input-number v-model="parentFormData.jumlah" />
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <div class="!flex !items-end !justify-end">
        <el-button type="warning" icon="RefreshRight" @click="resetForm"/>
        <el-button type="info" icon="MagicStick" @click="generateData" :disabled="parentFormData.prefiksKode == ''">Generate</el-button>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="12">
    <el-col :span="5">
      <el-form-item label="Kondisi">
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
      <el-form-item label="Satuan">
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
  </el-row>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { opsiKondisiBarang, opsiSatuan } from '@/services/inventoriServices'

const emit = defineEmits(['generate', 'prefix-diubah', 'ubah-satuan'])

const defaultParentFormData = () => ({
  namaBarang: '',
  prefiksKode: '',
  angkaAwal: 1,
  jumlah: 1,
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
})
const parentFormData = reactive<any>({...defaultParentFormData()})

const resetForm = () => Object.assign(parentFormData, defaultParentFormData())

const generateData = () => {
  const newData = Object.assign({}, parentFormData)
  emit('generate', newData)
}

function prefiksDiubah() {
  emit('prefix-diubah', parentFormData.prefiksKode + '-')
}

function handleSatuan() {
  emit('ubah-satuan', parentFormData.satuan === opsiSatuan[0].value)
}

defineExpose({
  resetForm
})
</script>
