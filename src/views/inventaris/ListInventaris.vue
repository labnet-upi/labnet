<template>
  <el-card>
    <div class="flex items-end justify-end mb-6">
      <el-button type="primary" icon="Refresh" plain @click="loadInventori"></el-button>
      <el-button type="success" icon="Download" plain>Excel</el-button>
      <el-button
        type="primary"
        icon="Plus"
        :to="{name: 'TambahInventaris'}"
        tag="router-link"
        >Batch
      </el-button>
    </div>
    <ListBarang ref="listBarangRef" :data="tableData" :show-search="true" :search-fields="['nama', 'kode']"></ListBarang>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListBarang from '@/components/inventaris/ListBarang.vue'
import { apiServices } from '@/services/apiServices'
import { FormBarang } from '@/services/inventoriServices'
const tableData = ref<FormBarang[]>([])
const loadInventori = async () => {
  const response = await apiServices.get('/inventaris/barang/')
  Object.assign(tableData.value, response.data)
}
onMounted(() => loadInventori())
</script>
