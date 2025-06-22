<template>
  <el-card>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Angkatan">
        <el-radio-group v-model="informasiKelompok.angkatan" size="small" @change="mulaiGantiInformasi">
          <el-radio-button
            v-for="angkatan in daftarAngkatan"
            :key="angkatan"
            :label="angkatan"
          >
            {{ angkatan }}
          </el-radio-button>
        </el-radio-group>
      </el-descriptions-item>
  
      <el-descriptions-item label="Kelas">
        <el-radio-group v-model="informasiKelompok.kelas" size="small" @change="mulaiGantiInformasi">
          <el-radio-button label="C1">C1</el-radio-button>
          <el-radio-button label="C2">C2</el-radio-button>
        </el-radio-group>
      </el-descriptions-item>
  
      <el-descriptions-item label="Nomor Kelompok">
        <div class="w-[150px]">
          <el-input :model-value="informasiKelompok.nomor ?? '-'" readonly>
            <template #append>
              <el-button @click="dialogVisible = true" type="primary" size="small" icon>
                <el-icon><More /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </el-descriptions-item>
  
      <el-descriptions-item label="Anggota">
        <ul class="space-y-2">
          <li
            v-for="(anggota, index) in informasiKelompok.anggota"
            :key="index"
          >
            <span class="font-medium">{{ anggota.nama }}</span> - 
            <span class="text-sm text-gray-500">{{ anggota.nim }}</span>
          </li>
        </ul>
      </el-descriptions-item>
  
      <el-descriptions-item label="Laporan">
        <el-link :href="informasiKelompok.laporan" target="_blank" type="primary">
          Lihat Laporan
        </el-link>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>

  <el-card class="my-6" v-show="!informasiSedangDiganti">
    <FormNilaiKelompok></FormNilaiKelompok>
  </el-card>

  <el-card class="my-6" v-show="!informasiSedangDiganti">
    <FormNilaiPerorangan></FormNilaiPerorangan>
  </el-card>

  <el-dialog
    title="Pilih Kelompok"
    v-model="dialogVisible"
    :before-close="hapusPilihanKelompok"
  >
    <span>
      <div class="flex flex-wrap gap-4 justify-end">
        <el-card
          v-for="dataKelompok in daftarKelompok"
          :key="'dataKelompok_' + dataKelompok.nomor"
          style="width: 48%; cursor: pointer;"
          class="card-option"
          :class="{ 'card-option--active': dataKelompok.nomor === kelompokDipilihModal?.nomor }"
          @click="pilihKelompok(dataKelompok)"
        >
          <template #header>Kelompok {{ dataKelompok.nomor }}</template>
          <ul class="space-y-2">
            <li
              v-for="(anggota, index) in dataKelompok.anggota"
              :key="index"
            >
              <span class="font-medium">{{ anggota.nama }}</span> - 
              <span class="text-sm text-gray-500">{{ anggota.nim }}</span>
            </li>
          </ul>
        </el-card>
      </div>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" @click="gantiKelompok(kelompokDipilihModal)">Ganti Kelompok</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FormNilaiKelompok from './FormNilaiKelompok'
import FormNilaiPerorangan from './FormNilaiPerorangan'

const daftarAngkatan = [2019, 2020, 2021, 2022, 2023, 2024]

const daftarKelompok = ref([
  {
    nomor: 1,
    kelas: 'C1',
    angkatan: 2022,
    anggota: [
      { nama: 'A', nim: 100 },
      { nama: 'B', nim: 101 },
      { nama: 'C', nim: 102 },
    ],
    laporan: 'http://google.com',
  },
  {
    nomor: 2,
    kelas: 'C1',
    angkatan: 2022,
    anggota: [
      { nama: 'D', nim: 103 },
      { nama: 'E', nim: 104 },
      { nama: 'F', nim: 105 },
    ],
    laporan: 'http://google.com',
  }
])

const kelompokDipilihModal = ref(null);

const pilihKelompok = (kelompok) => {
  kelompokDipilihModal.value = kelompok
}

const hapusPilihanKelompok = (done) => {
  kelompokDipilihModal.value = null;
  done()
}

const informasiKelompok = ref({
  nomor: 1,
  kelas: 'C1',
  angkatan: 2022,
  anggota: [
    { nama: 'A', nim: 100 },
    { nama: 'B', nim: 101 },
    { nama: 'C', nim: 102 },
  ],
  laporan: 'http://google.com',
})

const informasiSedangDiganti = ref(false)
const dialogVisible = ref(false)

const gantiKelompok = (kelompok) => {
  informasiKelompok.value = kelompok
  kelompokDipilihModal.value = false
  dialogVisible.value = false
  informasiSedangDiganti.value = false
}

const mulaiGantiInformasi = () => {
  informasiSedangDiganti.value = true
  informasiKelompok.value.nomor = null
  informasiKelompok.value.anggota = []
  informasiKelompok.value.laporan = null
}
</script>

<style scoped>
.card-option {
  width: 48%;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.card-option:hover {
  border-color: #409EFF;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.5);
}

.card-option--active {
  border-color: #409EFF;
  background-color: #ecf5ff;
}
</style>
