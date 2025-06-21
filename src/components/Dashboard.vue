<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside width="200px" style="height: 100%;">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '2']" router>
            <!-- Tubes -->
            <el-sub-menu index="1">
            <template #title>
                <el-icon><document /></el-icon>
                Tubes
            </template>

            <el-menu-item index="/dashboard/tubes/penilaian">Penilaian</el-menu-item>
            <el-menu-item index="/dashboard/tubes/rekap">Rekap</el-menu-item>
            </el-sub-menu>

            <!-- Inventaris -->
            <el-sub-menu index="2">
            <template #title>
                <el-icon><folder /></el-icon>
                Inventaris
            </template>

            <el-menu-item index="/dashboard/inventaris/daftar">Daftar Inventaris</el-menu-item>
            <el-menu-item index="/dashboard/inventaris/peminjaman">Peminjaman</el-menu-item>
            <el-menu-item index="/dashboard/inventaris/pengembalian">Pengembalian</el-menu-item>
            </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>Tom</span>
        </div>
      </el-header>

      <el-main style="overflow-y: auto; height: calc(100vh - 60px);">
          <el-scrollbar >
            <div class="bg-white p-6" style="margin: 0 3px; padding: 0 4px; background-color: #FFFFFA">
                <router-view/>
            </div>
          </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>