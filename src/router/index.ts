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
    meta: { requiresAuth: true, breadcrumb: 'Beranda' },
    children: [
      {
        path: 'tubes',
        meta: { breadcrumb: 'Tubes' },
        children: [
          {
            path: 'susun-aspek',
            name: 'SusunAspek',
            component: () => import('../views/tubes/SusunAspek.vue'),
            meta: { breadcrumb: 'Susun Aspek' }
          },
          {
            path: 'penilaian',
            name: 'PenilaianTubes',
            component: () => import('../views/tubes/FormPenilaian.vue'),
            meta: { breadcrumb: 'Penilaian Tubes' }
          },
          {
            path: 'rekap',
            name: 'RekapPenilaian',
            component: () => import('../views/tubes/RekapPenilaian.vue'),
            meta: { breadcrumb: 'Rekap Penilaian' }
          }
        ]
      },
      {
        path: 'inventaris',
        meta: { breadcrumb: 'Inventaris' },
        children: [
          {
            path: 'daftar',
            name: 'ListInventaris',
            component: () => import('../views/inventaris/ListInventaris.vue'),
            meta: { breadcrumb: 'List Inventaris' }
          },
          {
            path: 'tambah',
            name: 'TambahInventaris',
            component: () => import('../views/inventaris/FormPenambahan.vue'),
            meta: { breadcrumb: 'Tambah Inventaris' }
          },
          {
            path: 'peminjaman',
            name: 'Peminjaman',
            component: () => import('../views/inventaris/ListPeminjaman.vue'),
            meta: { breadcrumb: 'Peminjaman' }
          },
          {
            path: 'pinjam',
            name: 'Pinjam',
            component: () => import('../views/inventaris/FormPeminjaman.vue'),
            meta: { breadcrumb: 'Form Peminjaman' }
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
