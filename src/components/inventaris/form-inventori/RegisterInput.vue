<template>
  <el-form label-position="top" class="mb-4" :rules="rules" ref="formRef" :model="form">
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item :label="props.isSetSection ? 'Barang' : ''" prop="nama">
          <el-autocomplete
            v-model="form.nama"
            :fetch-suggestions="inventoriStore.getSaranNama"
            :trigger-on-focus="false"
            clearable
            value-key="nama"
            placeholder="Nama Barang"
            @select="(item: any) => inventoriStore.handleSelectSaranNama(item, form, (newVal: boolean) => emit('ubah-satuan', newVal))"
            @input="isEditted = true"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="props.isSetSection ? 'Kode' : ''" prop="kode">
          <el-autocomplete
            v-model="form.kode"
            :fetch-suggestions="inventoriStore.getSaranKode"
            :trigger-on-focus="false"
            clearable
            value-key="kode"
            placeholder="Kode Barang" />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item :label="props.isSetSection ? 'Kondisi' : ''" prop="kondisi">
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
        <el-form-item :label="props.isSetSection ? 'Satuan' : ''" prop="satuan">
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
        <el-form-item :label="props.isSetSection ? 'Jumlah' : ''" prop="jumlah">
          <el-input-number v-model="form.jumlah" :disabled="isJumlahDisabled"/>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <el-form-item :label="props.isSetSection ? '*' : ''">
          <el-button type="primary" icon="Plus" circle :plain="isPlain" @click="handleSubmit"/>
          <el-button type="warning" icon="RefreshRight" circle :plain="isPlain" @click="handleClear" :disabled="!isEditted"/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { FormBarang, opsiKondisiBarang, opsiSatuan, useInventoriStore } from '@/services/inventoriServices';
import { reactive, ref } from 'vue';
import { ObjectId } from 'bson'
import { generateRules } from '@/services/formValidateServices'

const inventoriStore = useInventoriStore()

const props = defineProps({
  isSetSection: { type: Boolean, required: true },
  isPlain: { type: Boolean, required: true },
})

const emit = defineEmits(['submit', 'ubah-satuan', 'clear'])

const defaultValue = () => ({
  id: new ObjectId().toHexString(),
  nama: '',
  kode: '',
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
  jumlah: 1
})

const form = reactive<FormBarang>({ ...defaultValue() })
const rules = generateRules(form, "blur", ["id"])
const formRef = ref()
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

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const newData = Object.assign({}, form)
    emit('submit', newData)
    clearForm()
  } catch (err) {
    // Validasi gagal
    console.warn('Form tidak valid', err)
  }
}

function handleClear() {
  emit('clear')
  clearForm()
}

defineExpose({
  handleClear
})
</script>