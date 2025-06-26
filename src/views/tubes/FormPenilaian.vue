<template>
  <el-card>
    <el-descriptions :column="1" border v-loading="loadingInformasi">
      <el-descriptions-item label="Angkatan">
        <el-radio-group v-model="angkatanDipilih" size="small" @change="gantiAngkatan">
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
        <el-radio-group v-model="kelasDipilih" size="small" @change="gantiKelas">
          <el-radio-button label="C1">C1</el-radio-button>
          <el-radio-button label="C2">C2</el-radio-button>
        </el-radio-group>
      </el-descriptions-item>
  
      <el-descriptions-item label="Nomor Kelompok">
        <div class="w-[150px]">
          <el-input :model-value="kelompokDinilai.nomor ?? '-'" readonly>
            <template #append>
              <el-button @click="dialogVisible = true" type="primary" size="small" icon :disabled="!daftarKelompokDifilter.length">
                <el-icon><More /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </el-descriptions-item>
  
      <el-descriptions-item label="Anggota">
        <ul class="space-y-2">
          <li
            v-for="(anggota, index) in kelompokDinilai.anggota"
            :key="index"
          >
            <span class="font-medium">{{ anggota.nama }}</span> - 
            <span class="text-sm text-gray-500">{{ anggota.nim }}</span>
          </li>
        </ul>
      </el-descriptions-item>
  
      <el-descriptions-item label="Laporan">
        <el-link :href="kelompokDinilai.laporan" target="_blank" type="primary" :disabled="!kelompokDinilai.laporan">
          Lihat Laporan
        </el-link>
      </el-descriptions-item>
    </el-descriptions>
  </el-card>

  <el-card class="my-6" v-show="formPernilaianDitampilkan">
    <FormNilaiKelompok ref="formNilaiKelompok"></FormNilaiKelompok>
  </el-card>

  <el-card class="my-6" v-show="formPernilaianDitampilkan">
    <FormNilaiPerorangan ref="formNilaiPerorangan" :kelompokDinilai="kelompokDinilai"></FormNilaiPerorangan>
  </el-card>

  <el-dialog
    title="Pilih Kelompok"
    v-model="dialogVisible"
    :before-close="hapusPilihanKelompok"
  >
    <span>
      <div class="flex flex-wrap gap-4 justify-start" v-if="daftarKelompokDifilter.length > 0">
        <el-card
          v-for="dataKelompok in daftarKelompokDifilter"
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
      <el-empty description="Kosong" v-else></el-empty>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button
          type="primary"
          @click="kelompokDipilihModal && gantiKelompok(kelompokDipilihModal)"
          :disabled="!kelompokDipilihModal"
        >Ganti Kelompok</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FormNilaiKelompok from './FormNilaiKelompok.vue'
import FormNilaiPerorangan from './FormNilaiPerorangan.vue'
import { apiServices } from '@/services/apiServices'

const loadingInformasi = ref(false)

const angkatanDipilih = ref()
const kelasDipilih = ref()
const daftarAngkatan: number[] = []

interface Kelompok {
  id: number | null
  nomor: number | null
  kelas: string | null
  angkatan: number | null
  anggota: Array<{ nama: string; nim: string }>
  laporan: string
}

const seluruhDaftarKelompok = ref<Kelompok[]>([])
const daftarKelompokDifilter = ref<Kelompok[]>([])

const kelompokDipilihModal = ref<Kelompok | null>(null);
const formPernilaianDitampilkan = ref(false)

const pilihKelompok = (kelompok: Kelompok) => {
  kelompokDipilihModal.value = kelompok
}

const hapusPilihanKelompok = (done: () => void) => {
  kelompokDipilihModal.value = null;
  done()
}

const kelompokDinilai = ref<Kelompok>({
  id: null,
  nomor: null,
  kelas: null,
  angkatan: null,
  anggota: [],
  laporan: '',
})

const dialogVisible = ref(false)
const formNilaiKelompok = ref()
const formNilaiPerorangan = ref()

const kosongkanKelompok = () => {
  kelompokDinilai.value = {
    id: null,
    nomor: null,
    kelas: null,
    angkatan: null,
    anggota: [],
    laporan: '',
  }
  kelompokDipilihModal.value = null;
}

const gantiAngkatan = async () => {
  formPernilaianDitampilkan.value = false
  kosongkanKelompok();
  formNilaiKelompok.value?.loadAspekPenilaianKelompok(angkatanDipilih.value);
  formNilaiPerorangan.value?.loadAspekPenilaianPerorangan(angkatanDipilih.value);

  seluruhDaftarKelompok.value = [];
  daftarKelompokDifilter.value = [];

  const response = await apiServices.get('/tugas_besar/penilaian/daftar-kelompok?angkatan=' + angkatanDipilih.value);
  seluruhDaftarKelompok.value = response.data;
  loadingInformasi.value = false;
}

const gantiKelas = () => {
  kosongkanKelompok();
  formPernilaianDitampilkan.value = false;
  daftarKelompokDifilter.value = seluruhDaftarKelompok.value.filter(kelompok => {
    return kelompok.kelas === kelasDipilih.value
  })
}

const gantiKelompok = (kelompok: Kelompok) => {
  // copy object kelompok untuk menghindari referensi langsung
  kelompok = JSON.parse(JSON.stringify(kelompok))
  kelompokDinilai.value = kelompok
  dialogVisible.value = false
  formPernilaianDitampilkan.value = true;

  formNilaiKelompok.value?.setFormNilaiKelompok(kelompok.id);
  formNilaiPerorangan.value?.setFormNilaiPerorangan(kelompok);
}

onMounted(() => {
  loadingInformasi.value = true;

  // Buat daftar angkatan 3 tahun kebelakang
  daftarAngkatan.push(new Date().getFullYear() - 2);
  daftarAngkatan.push(new Date().getFullYear() - 1);
  daftarAngkatan.push(new Date().getFullYear());

  angkatanDipilih.value = new Date().getFullYear();
  gantiAngkatan()
})

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
