<template>
  <el-card>
    <div class="flex items-center justify-between py-2">
      <h2 class="text-xl font-semibold">Penilaian Tubes</h2>

      <div class="flex gap-2">
        <el-button icon="Download" type="primary" @click="exportCSV">Export CSV</el-button>
      </div>
    </div>

    <div class="mt-3">
      <paginated-table
        ref="tabelPeroranganRef"
        :show-filter="true"
        @filter-click="dialogVisible = true"
        v-show="modeDitampilkan == 'perorangan'"
        v-loading="loading">
        <paginated-table-column prop="nama" label="Nama" sortable/>
        <paginated-table-column prop="nim" label="NIM" sortable/>
        <paginated-table-column prop="kelas" label="Kelas" />
        <paginated-table-column prop="tahun" label="Tahun" sortable/>
        <paginated-table-column prop="nomorKelompok" label="Kelompok">
          <template #default="{ row }">Kelompok {{ row.nomor }}</template>
        </paginated-table-column>
        <paginated-table-column label="Nilai Kelompok">
          <template #default="{ row }">
            {{ row.nilaiKelompok.toFixed(2) }}
          </template>
        </paginated-table-column>
        <paginated-table-column label="Nilai Perorangan">
          <template #default="{ row }">
            {{ row.nilaiPerorangan.toFixed(2) }}
          </template>
        </paginated-table-column>
        <paginated-table-column label="Total">
          <template #default="{ row }">
            {{ row.nilaiAkhir.toFixed(2) }}
          </template>
        </paginated-table-column>
      </paginated-table>
    
      <paginated-table
        ref="tabelKelompokRef"
        :show-filter="true"
        @filter-click="dialogVisible = true"
        style="width: 100%"
        v-show="modeDitampilkan == 'kelompok'"
        v-loading="loading">
        <paginated-table-column prop="nomorKelompok" label="Kelompok">
          <template #default="{ row }">Kelompok {{ row.nomor }}</template>
        </paginated-table-column>
        <paginated-table-column prop="kelas" label="Kelas" />
        <paginated-table-column prop="tahun" label="Tahun" />
        <paginated-table-column prop="laporan" label="Laporan">
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
        </paginated-table-column>
        <paginated-table-column prop="nilaiAkhir" label="Nilai" width="100">
          <template #default="{ row }">
            {{ row.nilaiAkhir.toFixed(2) }}
          </template>
        </paginated-table-column>
      </paginated-table>
    </div>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    title="Filter"
    width="500"
  >
    <div class="flex flex-col gap-4 overflow-hidden">
      <!-- Mode -->
      <div class="flex items-center justify-start">
        <p class="w-32">Mode:</p>
        <div class="flex gap-2">
          <el-button
            v-for="mode in modeOptions"
            :key="mode.value"
            :type="modeDipilih === mode.value ? 'info' : 'default'"
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
            :type="selectedTahun.includes(tahun) ? 'info' : 'default'"
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
            :type="selectedKelas.includes(kelas) ? 'info' : 'default'"
            @click="toggleKelas(kelas)"
            size="small"
          >
            {{ kelas }}
          </el-button>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" @click="dialogVisible = false, loadData()">
          Terapkan
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { apiServices, downloadFile } from '@/services/apiServices';
import { ref, onMounted, computed } from 'vue'
import qs from 'qs'

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

const tabelPeroranganRef = ref(null)
const tabelKelompokRef = ref(null)

const loading = ref(false)

const dialogVisible = ref(false)

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

  tabelPeroranganRef.value.setData(dataPerorangan.value)
  tabelKelompokRef.value.setData(dataKelompok.value)

  setTimeout(() => {
    loading.value = false;
  }, 1000);
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
  tabelPeroranganRef.value.setSearchFields(['nama', 'nim'])
  tabelKelompokRef.value.setSearchFields(['nama', 'nim'])

  // Buat daftar tahun 3 tahun kebelakang
  opsiTahun.push(new Date().getFullYear() - 2);
  opsiTahun.push(new Date().getFullYear() - 1);
  opsiTahun.push(new Date().getFullYear());

  selectedTahun.value = [new Date().getFullYear()];
  loadData();
})
</script>