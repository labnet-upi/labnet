<template>
  <el-card>
    <div class="flex items-end justify-end mb-6">
      <el-button type="primary" icon="Refresh" plain @click="loadInventori"></el-button>
      <el-button type="success" icon="Download" plain>Excel</el-button>
      <el-button
        type="primary"
        icon="Plus"
        @click="router.push({name: 'TambahInventaris'})"
        >Batch
      </el-button>
    </div>
    <ListBarang ref="listBarangRef" :data="tableData" :show-search="true" :search-fields="['nama', 'kode']"></ListBarang>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ListBarang from '@/components/ListBarang.vue'
import { useRouter } from 'vue-router'
import { apiServices } from '@/services/apiServices'
import { FormBarang } from '@/services/inventoriServices'
const router = useRouter()
const tableData = ref<FormBarang[]>([])
const loadInventori = async () => {
  const response = await apiServices.get('/inventaris/barang/')
  Object.assign(tableData.value, response.data)
}
onMounted(() => loadInventori())
</script>
