<!-- components/Breadcrumb.vue -->
<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :to="item.to"
      v-bind="{ replace: true }"
    >
      {{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  label: string
  to: { path: string }
}

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  return route.matched
    .filter(r => r.meta && r.meta.breadcrumb !== false)
    .map(r => {
      const label =
        typeof r.meta.breadcrumb === 'function'
          ? r.meta.breadcrumb(route)
          : r.meta.breadcrumb || r.name

      return {
        label,
        to: { path: r.path }
      }
    })
})
</script>
