<script setup lang="ts">
import { ref, onMounted } from 'vue'

const lines = [
  '> cruiai bootloader v1.0',
  '> mounting /dev/creativity ........ OK',
  '> loading kernel: 诚睿·AI ......... OK',
  '> establishing uplink ............. OK',
  '> welcome, operator.'
]
const shown = ref<string[]>([])

onMounted(() => {
  let i = 0
  const tick = () => {
    if (i < lines.length) {
      shown.value.push(lines[i])
      i += 1
      setTimeout(tick, 260)
    }
  }
  tick()
})
</script>

<template>
  <div class="boot-screen">
    <div class="boot-inner">
      <div class="boot-line" v-for="(l, i) in shown" :key="i">{{ l }}</div>
      <div class="boot-line"><span class="boot-cursor"></span></div>
    </div>
  </div>
</template>
