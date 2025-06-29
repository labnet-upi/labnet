<template>
  <el-card>
    <div class="flex items-end justify-end mb-6">
      <el-button type="success" icon="Download" plain>Excel</el-button>
      <el-button
        type="primary"
        icon="Plus"
        @click="router.push({name: 'TambahInventaris'})"
        >Batch
      </el-button>
    </div>
    <ListBarang ref="listBarangRef" :data="tableData" :show-search="true"></ListBarang>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import ListBarang from '@/components/ListBarang.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const tableData = ref([])
</script>
