<template>
  <div class="flex items-center justify-between pe-4 py-2">
    <h2 class="text-xl font-semibold">Penilaian Kelompok</h2>
    
    <div class="flex gap-2">
      <el-button type="primary" @click="rekapPenilaian">Simpan Nilai</el-button>
    </div>
  </div>
  
  <PenilaianTable :data="dataPenilaianKelompok" ref="tabelKelompokRef"/>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PenilaianTable from '@/components/PenilaianTable.vue'
import { ElNotification, ElLoading } from 'element-plus'

const tabelKelompokRef= ref()

const dataPenilaianKelompok = ref([
  {
    id: 1,
    kriteria: 'kriteria A',
    isParent: true,
    children: [
      {
        id: 2,
        kriteria: 'kriteria 1',
        bobot: 30.0,
        nilai: 100,
        nilai_x_bobot: 30.0,
        isParent: false
      },
      {
        id: 3,
        kriteria: 'kriteria 2',
        bobot: 40.0,
        nilai: 90,
        nilai_x_bobot: 36.0,
        isParent: false
      }
    ]
  },
  {
    id: 4,
    kriteria: 'kriteria B',
    isParent: true,
    children: [
      {
        id: 5,
        kriteria: 'kriteria 3',
        bobot: 20.0,
        isParent: false
      }
    ]
  }
])


function rekapPenilaian() {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const hasilRekap = tabelKelompokRef.value.getRekapNilai?.()

  console.log(hasilRekap)

  setTimeout(() => {
    loadingInstance.close()
    ElNotification({
      title: 'Sukses',
      message: 'Data berhasil disimpan!',
      type: 'success',
      position: 'bottom-right',
    })
  }, 500)
}
</script>
