<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-semibold text-center mb-6">Masukkan Kode Akses</h2>
      <input
        v-model="accessCode"
        type="text"
        placeholder="Kode Akses"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="submitCode(accessCode)"
        class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Login
      </button>
      <p v-if="errorMessage" class="text-red-500 mt-4 text-center text-sm">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiServices } from '@/services/apiServices'
import { useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'

const router = useRouter()
const accessCode = ref('')
const errorMessage = ref('')

async function submitCode(code: string) {
  try {
    const response = await apiServices.post('/user/login', { nim: code })

    const responseData = response.data

    // Simpan ke localStorage
    localStorage.setItem('session_token', responseData.session_token)
    localStorage.setItem('nama', responseData.user.nama)
    localStorage.setItem('nim', responseData.user.nim)
    
    ElNotification({
      title: 'Success',
      message: 'Hai, ' + responseData.user.nama + '!',
      type: 'success',
    })

    router.push({ name: 'ListInventaris' })
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed'
  }
}

// Cek apakah sudah login saat component mount
onMounted(() => {
  const savedCode = localStorage.getItem('session_token')
  if (savedCode) {
    router.push({ name: 'ListInventaris' })
  }
})
</script>
