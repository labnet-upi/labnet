import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dashboard from '../components/Dashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/dashboard',
    component: Dashboard,
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

export default router
