<template>
  <el-form label-position="top" :model="form">
    <h2 class="mb-3">Penanggung Jawab Barang</h2>
    <el-divider />
    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Nama PJ">
          <el-input v-model="form.nama" placeholder="Masukkan nama"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="No. Telepon PJ">
          <el-input v-model="form.notel" placeholder="Masukkan nomor telepon"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="Tanggal Pencatatan">
          <el-date-picker
            v-model="form.tanggal"
            type="date"
            placeholder="Pilih tanggal"
            format="DD-MM-YYYY"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="5">
        <el-form-item label="Nama Pencatat">
          <el-input :model-value="namaPencatat" placeholder="Masukkan nama" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="No. Telepon Pencatat">
          <el-input :model-value="notelPencatat" placeholder="Masukkan nomor telepon" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="10">
        <el-form-item label="Keterangan">
          <el-input
            type="textarea"
            v-model="form.keterangan"
            placeholder="Masukkan keterangan"
            rows="4"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
const props = defineProps({
  form: { type: Object, required: true }
})
const namaPencatat = localStorage.getItem('nama') || '';
const notelPencatat = localStorage.getItem('notel') || '-';
</script>