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
              v-for="tahun in opsiTahun"
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

        <div class="flex item-end justify-end">
            <el-button
              type="primary"
              class="me-4"
              @click="loadData()"
              :disabled="selectedKelas.length == 0 || selectedTahun.length == 0"
            >
              Filter
            </el-button>
        </div>
      </div>
    </transition>
  </div>

  <el-table :data="paginatedDataPerorangan" style="width: 100%" v-show="modeDitampilkan == 'perorangan'" v-loading="loading">
    <el-table-column label="No" type="index" width="50" :index="indexMethod"/>
    <el-table-column prop="nama" label="Nama" />
    <el-table-column prop="nim" label="NIM" />
    <el-table-column prop="kelas" label="Kelas" />
    <el-table-column prop="angkatan" label="Tahun" />
    <el-table-column prop="nomorKelompok" label="Nomor Kelompok">
      <template #default="{ row }">Kelompok {{ row.nomor }}</template>
    </el-table-column>
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
        {{ row.nilaiAkhir.toFixed(2) }}
      </template>
    </el-table-column>
  </el-table>

  <el-table :data="paginatedDataKelompok" style="width: 100%" v-show="modeDitampilkan == 'kelompok'" v-loading="loading">
    <el-table-column type="index" label="No" width="50" :index="indexMethod"/>
    <el-table-column prop="nomorKelompok" label="Nomor Kelompok">
      <template #default="{ row }">Kelompok {{ row.nomor }}</template>
    </el-table-column>
    <el-table-column prop="kelas" label="Kelas" />
    <el-table-column prop="angkatan" label="Tahun" />
    <el-table-column prop="laporan" label="Laporan">
      <template #default="{ row }">
        <el-link
          :href="row.laporan"
          target="_blank"
          type="primary"
          v-if="row.laporan"
          class="ml-2">
          Lihat Laporan
        </el-link>
      </template>
    </el-table-column>
    <el-table-column prop="nilaiAkhir" label="Nilai" width="100">
      <template #default="{ row }">
        {{ row.nilaiAkhir.toFixed(2) }}
      </template>
    </el-table-column>
  </el-table>

  <div class="flex item-center justify-center mt-6">
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      :total="modeDitampilkan == 'perorangan' ? dataPerorangan.length : dataKelompok.length"
      v-if="!loading"
      @current-change="handlePageChange"
    />
  </div>

</template>

<script setup>
import { apiServices, downloadFile } from '@/services/apiServices';
import { ref, onMounted, computed } from 'vue'
import qs from 'qs'
const showFilter = ref(false)

const modeOptions = [
  { label: 'Perorangan', value: 'perorangan' },
  { label: 'Kelompok', value: 'kelompok' },
]

const modeDipilih = ref("perorangan");
const modeDitampilkan = ref()

const opsiTahun = []
const kelasOptions = ['C1', 'C2']

const selectedTahun = ref([])
const selectedKelas = ref(['C1', 'C2'])

const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10

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

const dataPerorangan = ref([])
const dataKelompok = ref([])

const apiUrls = {
  perorangan: '/tugas_besar/rekap/nilai-perorangan',
  kelompok: '/tugas_besar/rekap/nilai-kelompok'
}

async function loadData() {
  loading.value = true;
  modeDitampilkan.value = modeDipilih.value;
  const response = await apiServices.get(
    apiUrls[modeDipilih.value],
    {
      params: {
        "tahun": selectedTahun.value,
        "kelas": selectedKelas.value,
        "format": "json"
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    });

  if( modeDipilih.value === 'perorangan') {
    dataKelompok.value.splice(0, dataKelompok.value.length)
    dataPerorangan.value = response.data;
  } else {
    dataPerorangan.value.splice(0, dataPerorangan.value.length)
    dataKelompok.value = response.data;
  }

  currentPage.value = 1

  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

const paginatedDataPerorangan = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return dataPerorangan.value.slice(start, end);
})

const paginatedDataKelompok = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return dataKelompok.value.slice(start, end);
})

function handlePageChange(page) {
  currentPage.value = page
}

function indexMethod(index) {
  return (currentPage.value - 1) * pageSize + index + 1;
}

function exportCSV() {
  downloadFile(
    apiUrls[modeDipilih.value],
    {
      params: {
        "tahun": selectedTahun.value,
        "kelas": selectedKelas.value,
        "format": "csv"
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    });
}

onMounted(() => {
  // Buat daftar angkatan 3 tahun kebelakang
  opsiTahun.push(new Date().getFullYear() - 2);
  opsiTahun.push(new Date().getFullYear() - 1);
  opsiTahun.push(new Date().getFullYear());

  selectedTahun.value = [new Date().getFullYear()];
  loadData();
})
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
