<template>
  <div class="flex items-center justify-between pe-4 py-2">
    <h2 class="text-xl font-semibold">Penilaian Kelompok</h2>
    
    <div class="flex gap-2">
      <i v-if="belumDisimpan" class="el-icon-warning">Belum disimpan</i>
      <el-button type="primary" @click="rekapPenilaian" :disabled="!belumDisimpan">Simpan Nilai</el-button>
    </div>
  </div>

  <div width="300px">
    <PenilaianTable :aspek_penilaian="aspekPenilaianKelompok" ref="tabelKelompokRef" :tampilkan-nilai-saja="false" @change="jadikanStateDraft"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PenilaianTable from './PenilaianTable.vue'
import { ElNotification, ElLoading, ElMessage } from 'element-plus'
import { apiServices } from '@/services/apiServices'

const tabelKelompokRef= ref()
const dataPenilaianKelompok = ref([])
const aspekPenilaianKelompok = ref([])
const idKelompok = ref('')
const belumDisimpan = ref<boolean>(false)

async function loadAspekPenilaianKelompok(tahun: number) {
  const hasilRekap = tabelKelompokRef.value.getRekapNilai()
  localStorage.setItem('dataPenilaianKelompok_' + idKelompok.value, JSON.stringify(hasilRekap))

  aspekPenilaianKelompok.value.splice(0, aspekPenilaianKelompok.value.length)
  const response = await apiServices.get(`/tugas_besar/aspek/penilaian-kelompok?tahun=${tahun}`)
  aspekPenilaianKelompok.value = response.data
}

async function loadDataPenilaianKelompok(id_kelompok: string) {
  dataPenilaianKelompok.value.splice(0, dataPenilaianKelompok.value.length)
  // cek apakah data sudah ada di localStorage
  const cachedData = localStorage.getItem('dataPenilaianKelompok_' + id_kelompok)
  if (cachedData) {
    const parsedCachedData = JSON.parse(cachedData)
    dataPenilaianKelompok.value = parsedCachedData.nilai || []
    belumDisimpan.value = parsedCachedData.belumDisimpan || false
  } else {
    const response = await apiServices.get(`/tugas_besar/penilaian/nilai-kelompok?id_kelompok=${id_kelompok}`)
    dataPenilaianKelompok.value = response.data.nilai || []
    belumDisimpan.value = false
  }
}

async function setFormNilaiKelompok(id_kelompok: string) {
  if(idKelompok.value != id_kelompok && idKelompok.value != '') {
    const hasilRekap = {
      belumDisimpan: belumDisimpan.value,
      ...tabelKelompokRef.value.getRekapNilai()
    }
    localStorage.setItem('dataPenilaianKelompok_' + idKelompok.value, JSON.stringify(hasilRekap))
  }
  await loadDataPenilaianKelompok(id_kelompok)
  idKelompok.value = id_kelompok

  if (tabelKelompokRef.value) {
    tabelKelompokRef.value.mergeAspek(dataPenilaianKelompok.value, idKelompok.value)
  }

  ElMessage({
    message: 'Data kelompok selesai dimuat',
    type: 'info',
  })
}

function jadikanStateDraft() {
  belumDisimpan.value = true
}

function rekapPenilaian() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const hasilRekap = tabelKelompokRef.value.getRekapNilai()
  console.log(hasilRekap)
  apiServices.post('/tugas_besar/penilaian/nilai-kelompok', {
    id_kelompok: idKelompok.value,
    ...hasilRekap
  }).then(() => {
    // hapus data lama di localStorage
    localStorage.removeItem('dataPenilaianKelompok_' + idKelompok.value);
    belumDisimpan.value = false;

    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
  }).catch((error) => {
    console.error('Error saving data:', error)
    ElNotification({
      title: 'Error',
      message: 'Gagal menyimpan data!',
      type: 'error',
      position: 'bottom-right',
    })
  })

}

defineExpose({
  dataPenilaianKelompok,
  loadAspekPenilaianKelompok,
  setFormNilaiKelompok
})
</script>
