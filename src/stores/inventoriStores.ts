import { apiServices } from '@/services/apiServices'
import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import debounce from 'lodash.debounce'

export const useInventoriStore = defineStore('counter', () => {
  const saranIsi = ref<any>([])

  const loadSaranIsi = async () => {
    const response = await apiServices.get('/inventaris/barang/saran-isi')
    saranIsi.value = response.data
  }

  function flatten(tree: any) {
    const result: any[] = [];

    function traverse(nodes: any) {
      for (const node of nodes) {
        const { children, ...rest } = node;
        result.push(rest);
        if (children && children.length) {
          traverse(children);
        }
      }
    }

    traverse(tree);
    return result;
  }

  function filterByLastNama(items: any[]): any[] {
    const map = new Map<string, any>();

    for (const item of items) {
      const key = item.nama;
      if (!key) continue; // lewati jika tidak ada nama
      map.set(key, item); // item terakhir akan menimpa yang lama
    }

    return Array.from(map.values());
  }

  const pushSaranIsi = (newData: any[]) => {
    const flattenData = flatten(newData)
    const normalizedExisting = saranIsi.value.map((item: any) => toRaw(item))
    const mergedData = [...normalizedExisting, ...flattenData]
    const filteredData = filterByLastNama(mergedData)
    console.log(filteredData)
    saranIsi.value.splice(0, saranIsi.value.length, ...filteredData)
  }

  const cariSaranSekarang = (queryString: string, cb: any, keyDicari: string) => {
    const cariKemiripan = (queryString: string) => {
      return (item: any) => item[keyDicari].toLowerCase().includes(queryString.toLowerCase())
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
    callback()
  }

  const handleSelectSaranNamaBarang = (item: any, form: any, callbackPrefix?: Function, callbackSatuan?: Function) => {
    form.prefiksKode = getPrefiksKode(item.kode)
    setKondisiSatuanJumlah(item, form)
    if (callbackPrefix) callbackPrefix()
    if (callbackSatuan) callbackSatuan()
  }

  return { loadSaranIsi, pushSaranIsi, getSaranNama, getSaranKode, handleSelectSaranNama, handleSelectSaranNamaBarang }
})
