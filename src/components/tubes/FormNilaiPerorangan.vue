<template>
  <el-card class="my-6">
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Penilaian Perorangan</h2>
      
      <div class="flex gap-2">
        <i v-if="belumDisimpan" class="el-icon-warning">Belum disimpan</i>
        <el-button type="primary" @click="rekapPenilaian" :disabled="!belumDisimpan">Simpan Nilai</el-button>
      </div>
    </div>
  </el-card>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="kelompokDinilai && kelompokDinilai.anggota && kelompokDinilai.anggota.length > 0">
    <el-card
      v-for="(anggota, anggota_index) in kelompokDinilai.anggota"
      :key="'anggota_' + anggota.nim"
    >
      <el-descriptions :column="1" class="mb-4" border>
        <el-descriptions-item label="Nama">{{ anggota.nama }}</el-descriptions-item>
        <el-descriptions-item label="NIM">{{ anggota.nim }}</el-descriptions-item>
      </el-descriptions>
      <PenilaianTable :aspek_penilaian="aspekPenilaianPerorangan" :ref="el => tabelPeroranganRef[anggota_index] = el" :tampilkan-nilai-saja="true" @change="jadikanStateDraft"/>
    </el-card>
  </div>
  <el-card v-else class="my-6">
    <el-empty>
      <p class="text-center text-gray-500">Tidak ada data penilaian perorangan yang tersedia.</p>
    </el-empty>
  </el-card>
</template>

<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue'
import PenilaianTable from './PenilaianTable.vue'
import { ElNotification, ElLoading, ElMessage } from 'element-plus'
import { apiServices } from '@/services/apiServices'
import type { ComponentPublicInstance } from 'vue'

interface Kelompok {
  id: number | null
  nomor: number | null
  kelas: string | null
  tahun: number | null
  anggota: Array<{ nama: string; nim: string; id: string }>
  laporan: string
}
const tabelPeroranganRef = shallowRef<any[]>([])

const dataPenilaianPerorangan = ref<any[]>([])
const aspekPenilaianPerorangan = ref([])
const kelompokDinilai = ref<Kelompok | null>(null)
const belumDisimpan = ref<boolean>(false)

async function loadAspekPenilaianPerorangan(tahun: number) {
  aspekPenilaianPerorangan.value.splice(0, aspekPenilaianPerorangan.value.length);
  const response = await apiServices.get(`/tugas_besar/aspek/penilaian-perorangan?tahun=${tahun}`)
  aspekPenilaianPerorangan.value = response.data
}

async function loadDataPenilaianPerorangan(kelompok: Kelompok) {
  dataPenilaianPerorangan.value.splice(0, dataPenilaianPerorangan.value.length);
  const firstCachedData = localStorage.getItem('dataPenilaianPerorangan_' + kelompok.anggota[0].id);
  if (firstCachedData) {
    kelompok.anggota.forEach((anggota, index) => {
      const cachedData = localStorage.getItem('dataPenilaianPerorangan_' + anggota.id);
      if (!cachedData) return;
      const parsedCachedData = JSON.parse(cachedData);

      const nilaiObject = parsedCachedData.nilai;
      const nilaiArray = Array.isArray(nilaiObject)
        ? nilaiObject
        : Object.entries(nilaiObject).map(([kategori, skor]) => ({
            kategori,
            skor
          }));
      if (nilaiArray.length) {
        dataPenilaianPerorangan.value.push({
          id: anggota.id,
          id_mahasiswa: anggota.id,
          nilai: nilaiArray
        });
      }

      belumDisimpan.value = parsedCachedData.belumDisimpan || false;
    });

  } else {
    const response = await apiServices.get(`/tugas_besar/penilaian/nilai-perorangan?id_kelompok=${kelompok.id}`);
    dataPenilaianPerorangan.value = response.data;
    console.log('Data penilaian perorangan:', dataPenilaianPerorangan.value);
    belumDisimpan.value = false;
  }
}

function mergeAspek() {
  tabelPeroranganRef.value.forEach((tabel, index) => {
    const dataNilai = dataPenilaianPerorangan.value.find((item) => item?.id_mahasiswa === kelompokDinilai.value?.anggota[index]?.id) ?? null;
    if (dataNilai) {
      tabel.mergeAspek(dataNilai.nilai, kelompokDinilai.value?.anggota[index]?.id);
    } else {
      tabel.mergeAspek([], kelompokDinilai.value?.anggota[index]?.id);
    }
  });
}

async function setFormNilaiPerorangan(kelompok: Kelompok) {
  if(kelompok.id !== kelompokDinilai.value?.id && kelompokDinilai.value?.id) {
    tabelPeroranganRef.value.forEach((a: ComponentPublicInstance<{ getRekapNilai: () => any; }>, index) => {
      const hasilRekap = {
        belumDisimpan: belumDisimpan.value,
        ...a.getRekapNilai()
      }
      localStorage.setItem('dataPenilaianPerorangan_' + kelompokDinilai.value?.anggota[index]?.id, JSON.stringify(hasilRekap));
    });
  }
  await loadDataPenilaianPerorangan(kelompok);
  kelompokDinilai.value = kelompok;

  // tunggu sampai tabelPeroranganRef.value terisi
  await nextTick();
  mergeAspek()

  ElMessage({
    message: 'Data perorangan selesai dimuat',
    type: 'info',
  })
}

function jadikanStateDraft() {
  belumDisimpan.value = true;
}

async function rekapPenilaian() {
  if (!Array.isArray(tabelPeroranganRef.value)) return [];
  
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const hasilRekap = tabelPeroranganRef.value.reduce<any[]>((acc, item) => {
    const nilai = item?.getRekapNilai();
    const id_mahasiswa = item?.getKeyData();
    if (nilai) {
      acc.push({
        id_kelompok: kelompokDinilai.value?.id,
        id_mahasiswa: id_mahasiswa.key,
        nilai: nilai.nilai,
      });
    }
    return acc;
  }, []);

  try {
    const response = await apiServices.post('/tugas_besar/penilaian/nilai-perorangan', hasilRekap);

    // Hapus data lama dari localStorage
    kelompokDinilai.value?.anggota.forEach((anggota) => {
      localStorage.removeItem('dataPenilaianPerorangan_' + anggota.id);
    });

    dataPenilaianPerorangan.value = response.data;

    await nextTick(); // pastikan DOM update sebelum merge
    mergeAspek();

    belumDisimpan.value = false;

    setTimeout(() => {
      loadingInstance.close();
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      });
    }, 500);
    
  } catch (error) {
    console.error('Error saving data:', error);
    loadingInstance.close(); // pastikan loading ditutup meskipun gagal
    ElNotification({
      title: 'Error',
      message: 'Gagal menyimpan data penilaian perorangan.',
      type: 'error',
      position: 'bottom-right',
    });
  }
}

defineExpose({
  loadAspekPenilaianPerorangan,
  setFormNilaiPerorangan
})
</script>