<template>
  <el-form label-position="top" class="mb-4">
    <ParentGenerateData></ParentGenerateData>

    <el-row>
      <el-col>
        <h3>Child</h3>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Barang">
          <el-input v-model="parentFormData.namaBarang" placeholder="Nama Barang" />
        </el-form-item>
      </el-col>

      <el-col :span="5">
        <el-form-item label="Prefiks Kode">
          <el-input v-model="parentFormData.prefiksKode" placeholder="Prefiks Kode" />
        </el-form-item>
      </el-col>

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
          <el-select v-model="parentFormData.satuan" placeholder="Pilih Satuan">
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
  </el-form>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
  >
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ParentGenerateData from '@/components/FormInventori/ParentGenerateData.vue'
import { FormBarang, opsiKondisiBarang, opsiSatuan } from '@/services/inventoriServices'

const defaultParentFormData = () => ({
  namaBarang: '',
  prefiksKode: '',
  angkaAwal: 1,
  jumlah: 1,
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
})
const parentFormData = reactive<any>({...defaultParentFormData()})

const defaultChildFormData = () => ({
  namaBarang: '',
  prefiksKode: '',
  kode: '',
  kondisi: opsiKondisiBarang[0].value,
  satuan: opsiSatuan[0].value,
})
const childFormData = reactive<any>({...defaultChildFormData()})

const dialogVisible = ref()
function resetForm() {
}


</script>
