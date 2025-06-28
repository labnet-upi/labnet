interface FormBarang {
  id: string
  nama: string
  kode: string
  kondisi: string | null
  satuan: string | null
  jumlah: number
  children?: FormBarang[]
  parentId?: string
}

const opsiKondisiBarang = [
    { label: 'Baru', value: 'baru' },
    { label: 'Baik', value: 'baik' },
    { label: 'Rusak Ringan', value: 'rusak_ringan' },
    { label: 'Rusak Berat', value: 'rusak_berat' },
    { label: 'Hilang', value: 'hilang' },
    { label: 'Dikembalikan (Bekas)', value: 'bekas' },
    { label: 'Dihapuskan', value: 'dihapuskan' }
]

const opsiSatuan = [
    { label: 'Buah', value: 'buah' },
    { label: 'Set', value: 'set' },
]

export { FormBarang, opsiKondisiBarang, opsiSatuan }