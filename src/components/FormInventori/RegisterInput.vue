<template>
  <el-row :gutter="12">
    <el-col :span="5">
      <el-form-item :label="props.isSetSection ? 'Barang' : ''">
        <el-input v-model="form.nama" placeholder="Nama Barang" @input="isEditted = true"/>
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item :label="props.isSetSection ? 'Kode' : ''">
        <el-input v-model="form.kode" placeholder="Kode Barang" />
      </el-form-item>
    </el-col>
    <el-col :span="4">
      <el-form-item :label="props.isSetSection ? 'Kondisi' : ''">
        <el-select v-model="form.kondisi" placeholder="Pilih Kondisi">
          <el-option
            v-for="opsi in opsiKondisiBarang"
            :key="opsi.value"
            :label="opsi.label"
            :value="opsi.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="3">
      <el-form-item :label="props.isSetSection ? 'Satuan' : ''">
        <el-select v-model="form.satuan" placeholder="Pilih Satuan" @change="handleSatuan">
          <el-option
            v-for="opsi in opsiSatuan"
            :key="opsi.value"
            :label="opsi.label"
            :value="opsi.value"
          />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="3">
      <el-form-item :label="props.isSetSection ? 'Jumlah' : ''">
        <el-input-number v-model="form.jumlah" :disabled="isJumlahDisabled"/>
      </el-form-item>
    </el-col>
    <el-col :span="2">
      <el-form-item :label="props.isSetSection ? '*' : ''">
        <el-button type="primary" icon="Plus" circle :plain="isPlain" @click="handleSubmit" :disabled="form.kode == ''"/>
        <el-button type="warning" icon="RefreshRight" circle :plain="isPlain" @click="handleClear" :disabled="!isEditted"/>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { FormBarang, opsiKondisiBarang, opsiSatuan } from '@/services/inventoriServices';
import { reactive, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
  isSetSection: { type: Boolean, required: true },
  isPlain: { type: Boolean, required: true },
})

const emit = defineEmits(['submit', 'ubah-satuan', 'clear'])

const defaultValue = () => ({
  id: uuidv4(),
  nama: '',
  kode: '',
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
  jumlah: 1
})

const form = reactive<FormBarang>({ ...defaultValue() })

const isEditted = ref(false)
const isJumlahDisabled = ref(false)

function clearForm() {
  Object.assign(form, defaultValue())
  emit('ubah-satuan', false)
}

function handleSatuan() {
  if(form.satuan === opsiSatuan[1].value && props.isSetSection) {
    form.jumlah = 1
    isJumlahDisabled.value = true
    emit('ubah-satuan', true)
  } else {
    isJumlahDisabled.value = false
    emit('ubah-satuan', false)
  }
}

function handleSubmit() {
  const newData = Object.assign({}, form)
  emit('submit', newData)
  clearForm()
}

function handleClear() {
  emit('clear')
  clearForm()
}

defineExpose({
  handleClear
})
</script>