<template>
  <div class="flex items-center justify-between pe-4 py-2">
    <h2 class="text-xl font-semibold">Penilaian Perorangan</h2>
    
    <div class="flex gap-2">
      <el-button type="primary" @click="rekapPenilaian">Simpan Nilai</el-button>
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <el-card
      v-for="dataPenilaian in dataPenilaianPerorangan"
      :key="'dataPenilaian_' + dataPenilaian.nim"
    >
      <PenilaianTable :data="dataPenilaian.dataNilai" ref="tabelPeroranganRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import PenilaianTable from '@/components/PenilaianTable.vue'
import { ElNotification, ElLoading } from 'element-plus'

const tabelPeroranganRef= ref([])

const dataPenilaianPerorangan = ref([
  {
    nama: "A",
    nim: 100,
    dataNilai: [
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
    ]
  },
  {
    nama: "B",
    nim: 101,
    dataNilai: [
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
    ]
  },
  {
    nama: "C",
    nim: 102,
    dataNilai: [
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
    ]
  },
])

function rekapPenilaian() {
  if (!Array.isArray(tabelPeroranganRef.value)) return [];
  
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  const hasilRekap = tabelPeroranganRef.value.reduce((acc, item) => {
    const nilai = item?.getRekapNilai?.();
    if (nilai) acc.push(nilai);
    return acc;
  }, []);

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