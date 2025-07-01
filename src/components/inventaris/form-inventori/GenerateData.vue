<template>
  <ParentGenerateData
    @generate="generate"
    @ubah-satuan="setChildDisableState"
    @prefix-diubah="setPrefix"
    ref="parentDataRef">
  </ParentGenerateData>
  <ChildGenerateData
    @submit="addChild"
    ref="childDataRef"
    :disable-form="disableChild">
  </ChildGenerateData>

  <el-row v-if="pcsData.length > 0" class="mt-2">
    <el-col :span="24">
      <el-tag
        v-for="(c, idx) in pcsData"
        :key="c.id"
        closable
        @close="hapusChild(idx)"
        class="mr-2 mb-2"
      >
        {{ c.namaBarang }} ({{ c.jumlah }} {{ c.satuan }} {{ c.kondisi }})
      </el-tag>
    </el-col>
  </el-row>

  <el-dialog
    v-model="dialogVisible"
    title="Hasil"
    width="800"
  >
    <el-scrollbar style="max-height: 400px;">
      <el-table :data="tableData" row-key="id">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="nama" label="Nama"/>
        <el-table-column prop="kode" label="Kode"/>
        <el-table-column prop="kondisi" label="Kondisi"/>
        <el-table-column prop="jumlah" label="Jumlah">
          <template #default="scope">
            {{ scope.row.jumlah }} {{ scope.row.satuan }}
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Batal</el-button>
        <el-button type="primary" @click="simpan">
          Pindahkan Data
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ParentGenerateData from './ParentGenerateData.vue'
import ChildGenerateData from './ChildGenerateData.vue'
import { FormBarang } from '@/services/inventoriServices'
import { ObjectId } from 'bson'

const emit = defineEmits(['simpan'])

const dialogVisible = ref(false)
const tableData = ref<FormBarang[]>([])
const parentDataRef = ref()
const childDataRef = ref()

const disableChild = ref<boolean>(true)
const pcsData = ref<any[]>([])

function generate(newData: any) {
  const hasil: FormBarang[] = [];
  // Hitung digit maksimum berdasarkan angka akhir
  const maxAngka = newData.angkaAwal + newData.jumlah - 1
  const digitCount = Math.max(newData.digit, maxAngka.toString().length)

  for (let i = 0; i < newData.jumlah; i++) {
    const angka = (newData.angkaAwal + i).toString().padStart(digitCount, '0')
    const parentKode = `${newData.prefiksKode}${angka}`
    const children = pcsData.value.map((child) => ({
      id: new ObjectId().toHexString(),
      nama: child.namaBarang,
      kode: `${child.kodeAktif ? child.prefiksKode : parentKode}${child.kode}`,
      kondisi: child.kondisi,
      satuan: child.satuan,
      jumlah: child.jumlah,
      parentId: newData.id,
    }));

    hasil.push({
      id: new ObjectId().toHexString(),
      nama: newData.namaBarang,
      kode: parentKode,
      kondisi: newData.kondisi,
      satuan: newData.satuan,
      jumlah: newData.jumlah,
      children: children ?? []
    });
  }
  tableData.value = hasil
  dialogVisible.value = true
}

const simpan = () => {
  emit('simpan', tableData.value)
  parentDataRef.value.resetForm()
  childDataRef.value.resetForm()
  pcsData.value.splice(0)
  dialogVisible.value = false
}

const addChild = (newData: any) => pcsData.value.push(newData)
const setChildDisableState = (status: boolean) => {
  disableChild.value = status
  childDataRef.value.resetForm()
  pcsData.value.splice(0)
}
const setPrefix = (prefix: string) => childDataRef.value.setPrefix(prefix)
const hapusChild = (idx: number) => pcsData.value.splice(idx, 1)

</script>
