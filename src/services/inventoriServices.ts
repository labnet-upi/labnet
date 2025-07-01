import { useInventoriStore } from "@/stores/inventoriStores"
import { ObjectId } from "bson"

export interface FormBarang {
  id: string
  nama: string
  kode: string
  kondisi: string | null
  satuan: string | null
  jumlah: number
  children?: FormBarang[]
  parentId?: string
}
export const opsiKondisiBarang = [
    { label: 'Baru', value: 'baru' },
    { label: 'Baik', value: 'baik' },
    { label: 'Rusak Ringan', value: 'rusak_ringan' },
    { label: 'Rusak Berat', value: 'rusak_berat' },
    { label: 'Hilang', value: 'hilang' },
    { label: 'Dikembalikan (Bekas)', value: 'bekas' },
    { label: 'Dihapuskan', value: 'dihapuskan' }
]
export const opsiSatuan = [
    { label: 'Buah', value: 'buah' },
    { label: 'Set', value: 'set' },
]
export const splitKode = (kode: string): { prefix: string, tail: string, digit: number } => {
  const index = kode.lastIndexOf('-')
  const prefix = index != -1 ? kode.slice(0, index + 1) : kode + '-'
  const tailStr = index != -1 ? kode.slice(index + 1) : '000'
  const digit = tailStr.length
  const tailNumber = Number(tailStr) + 1
  const tail = tailNumber.toString().padStart(digit, '0')
  return { prefix, tail, digit }
}
export const getParentGeneratedData = (formBarang: FormBarang) => {
  const { prefix: prefiksKode, tail, digit } = splitKode(formBarang.kode)
  return {
    namaBarang: formBarang.nama,
    prefiksKode,
    angkaAwal: Number(tail),
    jumlah: 1,
    kondisi: formBarang.kondisi,
    satuan: formBarang.satuan,
    digit
  }
}
function filterListFormBarang(list: FormBarang[], selectedIds: Set<string>): FormBarang[] {
  return list
    .filter(item => !selectedIds.has(item.id))
    .map(item => {
      if (item.children && item.children.length > 0) {
        item.children = filterListFormBarang(item.children, selectedIds)
      }
      return item
    })
}
export const hapusBarang = async (precall: Function, data: FormBarang[], selectedIds: Set<string>, successCallback: Function) => {
  const isSafe = await precall()
  if(!isSafe) {
    successCallback(false)
    return
  }
  const filteredData = filterListFormBarang(data, selectedIds)
  data.splice(0, data.length, ...filteredData)
  successCallback(true)
}
function findItemById(list: FormBarang[], id: string): FormBarang | null {
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItemById(item.children, id)
      if (found) return found
    }
  }
  return null
}
export const editBarang = async (precall: Function, data: FormBarang[], edittedData: FormBarang, successCallback: Function) => {
  const isSafe = await precall()
  if(!isSafe) {
    successCallback(false)
    return
  }
  const dataFound = findItemById(data, edittedData.id)
  console.log("dataFound", dataFound)
  if(dataFound) Object.assign(dataFound, edittedData)
  successCallback(true)
}
export const salinBarang = async (precall: Function, data: FormBarang[], newData: FormBarang[], successCallback: Function) => {
  const isSafe = await precall()
  if(!isSafe) {
    successCallback(false)
    return
  }
  data.unshift(...newData)
  successCallback(true)
}
export { useInventoriStore }