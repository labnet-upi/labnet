<template>
  <el-container class="layout-container" style="height: 100%">
    <el-aside width="200px" style="height: 100%;">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '2']" router>
            <el-sub-menu index="1">
              <template #title>
                  <el-icon><document /></el-icon>
                  Tubes
              </template>

              <el-menu-item index="/dashboard/tubes/susun-aspek">Susun Aspek</el-menu-item>
              <el-menu-item index="/dashboard/tubes/penilaian">Penilaian</el-menu-item>
              <el-menu-item index="/dashboard/tubes/rekap">Rekap</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="2">
              <template #title>
                  <el-icon><folder /></el-icon>
                  Inventaris
              </template>

              <el-menu-item index="/dashboard/inventaris/barang">Barang</el-menu-item>
              <el-menu-item index="/dashboard/inventaris/sirkulasi-peminjaman">Opname</el-menu-item>
              <el-menu-item index="/dashboard/inventaris/sirkulasi-peminjaman">Sirkulasi Peminjaman</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="/dashboard/pengguna"><el-icon><User /></el-icon>Pengguna</el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown @command="handleDropdownCommand">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="moodle">Moodle</el-dropdown-item>
                <el-dropdown-item command="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ nama }}</span>
        </div>
      </el-header>

      <el-main style="overflow-y: auto; height: calc(100vh - 60px);">
        <el-scrollbar >
          <Breadcrumb class="my-3"/>
          <router-view/>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import Breadcrumb from '@/components/dashboard/Breadcrumb.vue'

const nama = localStorage.getItem('nama')
const router = useRouter()

function handleDropdownCommand(command: string) {
  if (command === 'moodle') {
    window.open('http://labnet.cs.upi.edu/', '_blank')
  } else if (command === 'logout') {
    localStorage.clear()
    router.push({ name: 'DashboardLogin' })
  }
}
</script>

<style scoped>
.layout-container .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>