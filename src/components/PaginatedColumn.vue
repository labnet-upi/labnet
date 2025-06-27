<script setup>
import { inject } from 'vue'

// Terima props
defineProps({
  prop: String,
  label: String,
  width: [String, Number],
  align: String,
  sortable: {
    type: [Boolean, String],
    default: false,
  },
})

// Ambil context el-table dari parent
const table = inject('elTable')
</script>

<template>
  <el-table-column
    :prop="prop"
    :label="label"
    :width="width"
    :align="align"
    :sortable="sortable === true ? 'custom' : sortable"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </el-table-column>
</template>
