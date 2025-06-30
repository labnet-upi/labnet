import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DashboardLayout from '../components/dashboard/Dashboard.vue'
import DashboardLogin from '../components/auth/Login.vue'

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
            path: 'barang',
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
            path: 'sirkulasi-peminjaman',
            name: 'SirkulasiPeminjaman',
            component: () => import('../views/inventaris/ListSirkulasiPeminjaman.vue'),
            meta: { breadcrumb: 'Sirkulasi Peminjaman' }
          },
          {
            path: 'form-sirkulasi/:status_sirkulasi',
            name: 'FormSirkulasiPeminjaman',
            component: () => import('../views/inventaris/FormSirkulasiPeminjaman.vue'),
            meta: { breadcrumb: 'Form Sirkulasi Peminjaman' }
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
