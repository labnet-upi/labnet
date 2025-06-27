<template>
  <el-card class="mb-3">
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Penilaian Kelompok</h2>
    </div>
    <FormSusunAspek ref="formSusunAspekKelompokRef" :tahun="tahun" @change="onChangeAspekKelompok"></FormSusunAspek>

    <div class="flex items-center justify-end mt-6 gap-3">
      <i v-if="disabledSimpanAspekKelompok" class="el-icon-warning">Belum disimpan</i>
      <el-button type="primary" :disabled="!disabledSimpanAspekKelompok" @click="simpanAspekKelompok">Simpan Aspek</el-button>
    </div>
  </el-card>

  <el-card class="mb-3">
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Penilaian Perorangan</h2>
    </div>
    <FormSusunAspek ref="formSusunAspekPeroranganRef" :tahun="tahun" @change="onChangeAspekPerorangan"></FormSusunAspek>

    <div class="flex items-center justify-end mt-6 gap-3">
      <i v-if="disabledSimpanAspekPerorangan" class="el-icon-warning">Belum disimpan</i>
      <el-button type="primary" :disabled="!disabledSimpanAspekPerorangan" @click="simpanAspekPerorangan">Simpan Aspek</el-button>
    </div>
  </el-card>

  <el-card class="mb-3">
    <div class="flex items-center justify-between pe-4 py-2">
      <h2 class="text-xl font-semibold">Bobot Penilaian</h2>

    </div>
    
    <div class="flex items-center gap-6 px-4 py-2">
      <div class="flex items-center gap-2">
        <span>Kelompok</span>
        <el-input-number
        v-model="bobotKelompok"
        :min="0"
        :max="100"
        :step="5"
        @input="onChangeBobot"
        />
        <span>%</span>
      </div>
      
      <div class="flex items-center gap-2">
        <span>Perorangan</span>
        <el-input-number
        :model-value="bobotPerorangan"
        disabled
        />
        <span>%</span>
      </div>
    </div>
    
    <div class="flex items-center justify-end mt-6 gap-3">
      <i v-if="disabledSimpanBobot" class="el-icon-warning">Belum disimpan</i>
      <el-button type="primary" :disabled="!disabledSimpanBobot" @click="simpanBobot">Simpan Bobot</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Ref, nextTick } from 'vue';
import FormSusunAspek from '@/components/FormSusunAspek.vue';
import { apiServices } from '@/services/apiServices';
import { ElLoading, ElNotification } from 'element-plus';

const formSusunAspekKelompokRef = ref()
const formSusunAspekPeroranganRef = ref()

const disabledSimpanAspekKelompok = ref(false)
const disabledSimpanAspekPerorangan = ref(false)
const disabledSimpanBobot = ref(false)

function onChangeAspekKelompok() {
  disabledSimpanAspekKelompok.value = true
}

function onChangeAspekPerorangan() {
  disabledSimpanAspekPerorangan.value = true
}

function onChangeBobot() {
  disabledSimpanBobot.value = true
}

let tahun = new Date().getFullYear();

async function loadAspek({
  formRef,
  endpoint,
}: {
  formRef: any
  endpoint: string
}) {
  const response = await apiServices.get(`${endpoint}?tahun=${tahun}`)
  formRef.value.setKriteriaList(response.data);
}

onMounted(() => {
  loadAspek({
    formRef: formSusunAspekKelompokRef,
    endpoint: "/tugas_besar/penilaian/aspek-penilaian-kelompok"
  })
  loadAspek({
    formRef: formSusunAspekPeroranganRef,
    endpoint: "/tugas_besar/penilaian/aspek-penilaian-perorangan"
  })
})

async function simpanAspek({
  formRef,
  endpoint,
  setDisabledFlag,
}: {
  formRef: any
  endpoint: string
  setDisabledFlag: Ref<boolean>
}) {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })

  try {
    // Pastikan DOM & model selesai update
    await nextTick()

    // Ambil data paling akhir yang valid
    const aspek = formRef.value.getCleanKriteriaList()

    // Kirim ke server
    const response = await apiServices.post(endpoint, aspek)

    // Tunggu transisi jika perlu
    await nextTick()

    // Set data hasil dari server (sudah bersih + terstruktur)
    await formRef.value.setKriteriaList(response.data)

    // Selesai
    setDisabledFlag.value = false
    loadingInstance.close()

    ElNotification({
      title: 'Sukses',
      message: 'Data berhasil disimpan!',
      type: 'success',
      position: 'bottom-right',
    })
  } catch (error) {
    console.error('Error saving data:', error)
    loadingInstance.close()
    ElNotification({
      title: 'Error',
      message: 'Gagal menyimpan data!',
      type: 'error',
      position: 'bottom-right',
    })
  }
}

function simpanAspekKelompok() {
  simpanAspek({
    formRef: formSusunAspekKelompokRef,
    endpoint: '/tugas_besar/penilaian/aspek-penilaian-kelompok',
    setDisabledFlag: disabledSimpanAspekKelompok
  })
}

function simpanAspekPerorangan() {
  simpanAspek({
    formRef: formSusunAspekPeroranganRef,
    endpoint: '/tugas_besar/penilaian/aspek-penilaian-perorangan',
    setDisabledFlag: disabledSimpanAspekPerorangan
  })
}

const bobotKelompok = ref(60)

const bobotPerorangan = computed(() => {
  const nilai = 100 - bobotKelompok.value
  return nilai < 0 ? 0 : nilai
})

function simpanBobot() {
  return {
    kelompok: bobotKelompok.value,
    perorangan: bobotPerorangan.value
  }
}
</script>
