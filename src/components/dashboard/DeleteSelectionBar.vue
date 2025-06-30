<template>
  <div
    v-if="props.selectedLength > 0"
    class="flex items-center justify-between p-4 mb-4 bg-red-50 border border-red-300 text-red-800 rounded-lg"
  >
    <p class="text-sm font-medium">
      {{ props.selectedLength }} item dipilih
    </p>
    <el-button
      type="danger"
      icon="Delete"
      @click="handleDelete"
    >
      Hapus
    </el-button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedLength: {type: Number, required: true}
})
const emit = defineEmits(['delete'])
const handleDelete = () => emit('delete')
</script>