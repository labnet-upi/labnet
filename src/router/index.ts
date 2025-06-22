import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DashboardLayout from '../components/Dashboard.vue'
import DashboardLogin from '../components/Login.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'DashboardLogin',
    component: DashboardLogin
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'tubes',
        children: [
          {
            path: 'penilaian',
            name: 'PenilaianTubes',
            component: () => import('../views/tubes/FormPenilaian.vue')
          },
          {
            path: 'rekap',
            name: 'RekapPenilaian',
            component: () => import('../views/tubes/RekapPenilaian.vue')
          }
        ]
      },
      {
        path: 'inventaris',
        children: [
          {
            path: 'daftar',
            name: 'ListInventaris',
            component: () => import('../views/inventaris/ListInventaris.vue')
          },
          {
            path: 'tambah',
            name: 'TambahInventaris',
            component: () => import('../views/inventaris/FormPenambahan.vue')
          },
          {
            path: 'peminjaman',
            name: 'Peminjaman',
            component: () => import('../views/inventaris/ListPeminjaman.vue')
          },
          {
            path: 'pinjam',
            name: 'Pinjam',
            component: () => import('../views/inventaris/FormPeminjaman.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('session_token')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'DashboardLogin' })
  } else {
    next()
  }
})

export default router
