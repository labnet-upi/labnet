import { apiServices } from '@/services/apiServices'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import debounce from 'lodash.debounce'

export const useInventoriStore = defineStore('counter', () => {
  const saranIsi = ref<any>([])

  const loadSaranIsi = async () => {
    const response = await apiServices.get('/inventaris/barang/saran-isi')
    saranIsi.value = response.data
  }

  const cariSaranSekarang = (queryString: string, cb: any, keyDicari: string) => {
    const cariKemiripan = (queryString: string) => {
      return (item: any) =>
        item[keyDicari].toLowerCase().includes(queryString.toLowerCase())
    }

    const lower = queryString.toLowerCase()
    const results = queryString
      ? saranIsi.value.filter(cariKemiripan(lower))
      : saranIsi.value
    cb(results)
  }

  const cariSaranNamaSekarang = (queryString: string, cb: any) => cariSaranSekarang(queryString, cb, 'nama')
  const cariSaranKodeSekarang = (queryString: string, cb: any) => cariSaranSekarang(queryString, cb, 'kode')

  const getPrefiksKode = (kode: string): string => {
    const index = kode.lastIndexOf('-')
    return index !== -1 ? kode.slice(0, index + 1) : kode
  }

  const getSaranNama = debounce(cariSaranNamaSekarang, 300)
  const getSaranKode = debounce(cariSaranKodeSekarang, 300)

  const setKondisiSatuanJumlah = (item: any, form: any) => {
    form.kondisi = item.kondisi
    form.satuan = item.satuan
    form.jumlah = item.jumlah
  }

  const handleSelectSaranNama = (item: any, form: any, callback: Function) => {
    form.kode = getPrefiksKode(item.kode)
    setKondisiSatuanJumlah(item, form)
    callback(form.satuan == 'set')
  }

  const handleSelectSaranNamaBarang = (item: any, form: any, callbackPrefix?: Function, callbackSatuan?: Function) => {
    form.prefiksKode = getPrefiksKode(item.kode)
    setKondisiSatuanJumlah(item, form)
    if (callbackPrefix) callbackPrefix()
    if (callbackSatuan) callbackSatuan()
  }

  return { loadSaranIsi, getSaranNama, getSaranKode, handleSelectSaranNama, handleSelectSaranNamaBarang }
})
