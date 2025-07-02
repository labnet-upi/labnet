<template>
  <el-card>
    <div class="flex items-end justify-end mb-6">
      <el-button type="primary" icon="Refresh" plain @click="loadInventori" :loading="loadingInventori" loading-icon="Refresh"></el-button>
      <el-button type="success" icon="Download" plain @click="exportExcel" :loading="loadingExport">Excel</el-button>
      <el-button
        type="primary"
        icon="Plus"
        :to="{name: 'TambahInventaris'}"
        tag="router-link"
        >Batch
      </el-button>
    </div>
    <ListBarang
      ref="listBarangRef"
      @hapus="(selectedIds, successCallback) => hapusBarang(async () => await deleteBarang(selectedIds), tableData, selectedIds, successCallback)"
      @submit-perubahan="(edittedData, successCallback) => editBarang(async () => await putBarang(edittedData), tableData, edittedData, successCallback)"
      @submit-salinan-data="(newData, successCallback) => salinBarang(async () => await postBarang(newData), tableData, newData, successCallback)"
      :data="tableData"
      :show-search="true"
      :search-fields="['nama', 'kode']"></ListBarang>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListBarang from '@/components/inventaris/ListBarang.vue'
import { apiServices, downloadFile } from '@/services/apiServices'
import { FormBarang, hapusBarang, editBarang, salinBarang } from '@/services/inventoriServices'
import { ElLoading, ElNotification } from 'element-plus'
const tableData = ref<FormBarang[]>([])
const loadingInventori = ref(false)
const loadInventori = async () => {
  loadingInventori.value = true
  const response = await apiServices.get('/inventaris/barang/')
  Object.assign(tableData.value, response.data)
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadingInventori.value = false
}
onMounted(() => loadInventori())
const deleteBarang =  async (listIdBarang: Set<String>) => {
  const idArray = Array.from(listIdBarang)
  console.log(idArray)
  // return;
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })
  
  try {
    const response = await apiServices.delete('/inventaris/barang', {
      data: {
        list_id_barang: idArray
      }
    })
    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil dihapus!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
    return true;
  } catch (error) {
    loadingInstance.close()
    ElNotification({
      title: 'Gagal',
      message: 'Terjadi kesalahan saat menghapus data.',
      type: 'error',
      position: 'bottom-right',
    })
  
    // (Opsional) tampilkan log error untuk debugging
    console.error('Error saat menghapus data:', error)
    return false;
  }
}
const postBarang =  async (newData: FormBarang[]) => {
  // return;
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })
  
  try {
    const response = await apiServices.post('/inventaris/barang/', newData)
    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
    return true;
  } catch (error) {
    loadingInstance.close()
    ElNotification({
      title: 'Gagal',
      message: 'Terjadi kesalahan saat menyimpan data.',
      type: 'error',
      position: 'bottom-right',
    })
  
    // (Opsional) tampilkan log error untuk debugging
    console.error('Error saat menghapus data:', error)
    return false;
  }
}
const putBarang =  async (updatedData: FormBarang) => {
  // return;
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Menyimpan...',
    background: 'rgba(0, 0, 0, 0.5)',
  })
  
  try {
    const response = await apiServices.put('/inventaris/barang/', updatedData)
    setTimeout(() => {
      loadingInstance.close()
      ElNotification({
        title: 'Sukses',
        message: 'Data berhasil disimpan!',
        type: 'success',
        position: 'bottom-right',
      })
    }, 500)
    return true;
  } catch (error) {
    loadingInstance.close()
    ElNotification({
      title: 'Gagal',
      message: 'Terjadi kesalahan saat menyimpan data.',
      type: 'error',
      position: 'bottom-right',
    })
  
    // (Opsional) tampilkan log error untuk debugging
    console.error('Error saat menghapus data:', error)
    return false;
  }
}
const loadingExport = ref(false)
const exportExcel = async () => {
  loadingExport.value = true
  await downloadFile("inventaris/barang?format=excel")
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadingExport.value = true
}
</script>
