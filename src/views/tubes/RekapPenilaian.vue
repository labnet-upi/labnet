<template>
  <div>
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Penilaian Tubes</h2>

      <div class="flex gap-2">
        <el-button type="info" @click="showFilter = !showFilter">
          <el-icon><Filter /></el-icon>
        </el-button>
        <el-button type="primary" @click="exportCSV">Export CSV</el-button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="showFilter" class="flex flex-col gap-4 overflow-hidden">
        <!-- Mode -->
        <div class="flex items-center justify-start">
          <p class="w-32">Mode:</p>
          <div class="flex gap-2">
            <el-button
              v-for="mode in modeOptions"
              :key="mode.value"
              :type="modeDipilih === mode.value ? 'primary' : 'default'"
              @click="modeDipilih = mode.value"
              size="small"
            >
              {{ mode.label }}
            </el-button>
          </div>
        </div>

        <!-- Tahun -->
        <div class="flex items-center justify-start">
          <p class="w-32">Tahun:</p>
          <div class="flex gap-2">
            <el-button
              v-for="tahun in tahunOptions"
              :key="tahun"
              :type="selectedTahun.includes(tahun) ? 'primary' : 'default'"
              @click="toggleTahun(tahun)"
              size="small"
            >
              {{ tahun }}
            </el-button>
          </div>
        </div>

        <!-- Kelas -->
        <div class="flex items-center justify-start">
          <p class="w-32">Kelas:</p>
          <div class="flex gap-2">
            <el-button
              v-for="kelas in kelasOptions"
              :key="kelas"
              :type="selectedKelas.includes(kelas) ? 'primary' : 'default'"
              @click="toggleKelas(kelas)"
              size="small"
            >
              {{ kelas }}
            </el-button>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <el-table :data="dataMahasiswa" style="width: 100%" v-show="modeDipilih == 'perorangan'">
    <el-table-column label="No" type="index" width="50" />
    <el-table-column prop="nama" label="Nama" />
    <el-table-column prop="nim" label="NIM" />
    <el-table-column label="Nilai Kelompok">
      <template #default="{ row }">
        {{ row.nilaiKelompok.toFixed(2) }}
      </template>
    </el-table-column>
    <el-table-column label="Nilai Perorangan">
      <template #default="{ row }">
        {{ row.nilaiPerorangan.toFixed(2) }}
      </template>
    </el-table-column>
    <el-table-column label="Total">
      <template #default="{ row }">
        {{ row.total.toFixed(2) }}
      </template>
    </el-table-column>
  </el-table>

  <el-table :data="dataKelompok" style="width: 100%" v-show="modeDipilih == 'kelompok'">
    <!-- Kolom No -->
    <el-table-column type="index" label="No" width="50" />

    <!-- Kolom Nomor Kelompok -->
    <el-table-column prop="nomorKelompok" label="Nomor Kelompok">
      <template #default="{ row }">Kelompok {{ row.nomorKelompok }}</template>
    </el-table-column>

    <!-- Kolom Link Laporan -->
    <el-table-column prop="linkLaporan" label="Laporan">
      <template #default="{ row }">
        <a
          :href="row.linkLaporan"
          target="_blank"
          class="text-blue-600 underline hover:text-blue-800"
        >
          Lihat
        </a>
      </template>
    </el-table-column>

    <!-- Kolom Nilai -->
    <el-table-column prop="nilai" label="Nilai" width="100" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
const showFilter = ref(false)

const modeOptions = [
  { label: 'Perorangan', value: 'perorangan' },
  { label: 'Kelompok', value: 'kelompok' },
]

const modeDipilih = ref("perorangan");

const tahunOptions = ['2022', '2023', '2024']
const kelasOptions = ['C1', 'C2']

const selectedTahun = ref(['2024'])
const selectedKelas = ref(['C1', 'C2'])

function toggleTahun(tahun) {
  if (selectedTahun.value.includes(tahun)) {
    selectedTahun.value = selectedTahun.value.filter(t => t !== tahun)
  } else {
    selectedTahun.value.push(tahun)
  }
}

function toggleKelas(kelas) {
  if (selectedKelas.value.includes(kelas)) {
    selectedKelas.value = selectedKelas.value.filter(k => k !== kelas)
  } else {
    selectedKelas.value.push(kelas)
  }
}

const dataMahasiswa = [
  {
    nama: 'Ahmad Fauzi',
    nim: '12345678',
    nilaiKelompok: 100,
    nilaiPerorangan: 100,
    total: 100
  },
  {
    nama: 'Siti Aminah',
    nim: '87654321',
    nilaiKelompok: 100,
    nilaiPerorangan: 100,
    total: 100
  },
  // Tambah data lain sesuai kebutuhan
]

const dataKelompok = [
  {
    nomorKelompok: 1,
    linkLaporan: 'https://drive.google.com/file/d/abc123',
    nilai: 85,
  },
  {
    nomorKelompok: 2,
    linkLaporan: 'https://drive.google.com/file/d/xyz456',
    nilai: 90,
  },
  // Tambahkan data lainnya sesuai kebutuhan
]
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  max-height: 500px; /* sesuaikan dengan tinggi konten */
  opacity: 1;
  padding-top: initial;
  padding-bottom: initial;
  overflow: hidden;
}
</style>
