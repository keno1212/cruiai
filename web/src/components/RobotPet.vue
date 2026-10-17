<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type PetState = 'idle' | 'dance' | 'martial' | 'slack'
const states: PetState[] = ['idle', 'dance', 'martial', 'slack']
const labels: Record<PetState, string> = {
  idle: '待机中…',
  dance: '蹦迪中…',
  martial: '练功中 · 哈！',
  slack: '摆烂中… zzz'
}
const state = ref<PetState>('idle')

let timer: number | undefined
function next(): void {
  const i = states.indexOf(state.value)
  state.value = states[(i + 1) % states.length]
}
function onPetClick(): void {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
  next()
  timer = window.setInterval(next, 11000)
}

onMounted(() => {
  timer = window.setInterval(next, 11000)
})
onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div
    class="robot-pet"
    :class="state"
    @click="onPetClick"
    :title="labels[state] + '（点击切换状态）'"
    role="img"
    :aria-label="'站点机器宠物，当前状态：' + labels[state]"
  >
    <div class="pet-label">{{ labels[state] }}</div>
    <div class="pet-stage">
      <div class="pet-antenna"><span class="pet-tip"></span></div>
      <div class="pet-head">
        <span class="pet-eye left"></span>
        <span class="pet-eye right"></span>
        <span class="pet-mouth"></span>
      </div>
      <div class="pet-body"><span class="pet-core"></span></div>
      <div class="pet-arm left"></div>
      <div class="pet-arm right"></div>
      <div class="pet-leg left"></div>
      <div class="pet-leg right"></div>
    </div>
    <div class="pet-zzz" aria-hidden="true">
      <span class="z1">Z</span>
      <span class="z2">Z</span>
      <span class="z3">Z</span>
    </div>
  </div>
</template>

<style scoped>
.robot-pet {
  position: fixed;
  left: 18px;
  bottom: 16px;
  width: 120px;
  height: 168px;
  z-index: 60;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.pet-stage {
  position: relative;
  width: 120px;
  height: 150px;
  margin: 0 auto;
  transform-origin: center bottom;
}

/* ---- 天线 ---- */
.pet-antenna {
  position: absolute;
  left: 58px;
  top: 0;
  width: 4px;
  height: 16px;
  background: var(--c-cyan);
  box-shadow: 0 0 6px var(--c-cyan);
}
.pet-tip {
  position: absolute;
  top: -6px;
  left: -3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-amber);
  box-shadow: 0 0 9px var(--c-amber);
  animation: tip-pulse 1.6s ease-in-out infinite;
}

/* ---- 头 ---- */
.pet-head {
  position: absolute;
  left: 37px;
  top: 16px;
  width: 46px;
  height: 34px;
  border: 2px solid var(--c-cyan);
  border-radius: 9px;
  background: var(--c-surface);
  box-shadow: 0 0 10px rgba(34, 211, 211, 0.35);
}
.pet-eye {
  position: absolute;
  top: 11px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-cyan);
  box-shadow: 0 0 7px var(--c-cyan);
}
.pet-eye.left {
  left: 9px;
}
.pet-eye.right {
  right: 9px;
}
.pet-mouth {
  position: absolute;
  bottom: 7px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 2px;
  background: var(--c-amber);
  border-radius: 2px;
}

/* ---- 身体 ---- */
.pet-body {
  position: absolute;
  left: 40px;
  top: 54px;
  width: 40px;
  height: 46px;
  border: 2px solid var(--c-amber);
  border-radius: 9px;
  background: var(--c-surface);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}
.pet-core {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--c-amber);
  box-shadow: 0 0 12px var(--c-amber);
  animation: core-pulse 2s ease-in-out infinite;
}

/* ---- 四肢 ---- */
.pet-arm,
.pet-leg {
  position: absolute;
  width: 8px;
  border-radius: 4px;
  transform-origin: top center;
}
.pet-arm {
  top: 60px;
  height: 30px;
  background: var(--c-cyan);
  box-shadow: 0 0 6px rgba(34, 211, 211, 0.4);
}
.pet-arm.left {
  left: 30px;
}
.pet-arm.right {
  right: 30px;
}
.pet-leg {
  top: 98px;
  height: 28px;
  background: var(--c-amber);
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}
.pet-leg.left {
  left: 42px;
}
.pet-leg.right {
  right: 42px;
}

/* ---- 状态气泡 ---- */
.pet-label {
  position: absolute;
  left: 50%;
  top: -16px;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--c-cyan);
  background: var(--c-elevated);
  border: 1px solid var(--c-border);
  padding: 3px 9px;
  border-radius: 7px;
  opacity: 0.35;
  transition: opacity 0.25s ease;
  pointer-events: none;
}
.robot-pet:hover .pet-label {
  opacity: 1;
}

/* ---- 摆烂 Zzz ---- */
.pet-zzz {
  position: absolute;
  right: -10px;
  top: 18px;
  display: none;
  font-family: 'JetBrains Mono', monospace;
  color: var(--c-text-dim);
}
.pet-zzz span {
  position: absolute;
  opacity: 0;
}
.pet-zzz .z1 {
  font-size: 11px;
  animation: z-float 2.4s ease-in-out infinite;
}
.pet-zzz .z2 {
  font-size: 14px;
  animation: z-float 2.4s ease-in-out infinite 0.8s;
}
.pet-zzz .z3 {
  font-size: 17px;
  animation: z-float 2.4s ease-in-out infinite 1.6s;
}

/* ============ 状态动画 ============ */
/* 待机 */
.robot-pet.idle .pet-stage {
  animation: pet-float 3s ease-in-out infinite;
}

/* 跳舞 */
.robot-pet.dance .pet-stage {
  animation: pet-dance 0.6s ease-in-out infinite;
}
.robot-pet.dance .pet-arm.left {
  animation: arm-swing-l 0.6s ease-in-out infinite;
}
.robot-pet.dance .pet-arm.right {
  animation: arm-swing-r 0.6s ease-in-out infinite;
}
.robot-pet.dance .pet-leg.left {
  animation: leg-dance-l 0.6s ease-in-out infinite;
}
.robot-pet.dance .pet-leg.right {
  animation: leg-dance-r 0.6s ease-in-out infinite;
}

/* 武术 */
.robot-pet.martial .pet-stage {
  animation: pet-martial 0.5s ease-in-out infinite;
}
.robot-pet.martial .pet-arm.left {
  animation: arm-punch-l 0.42s ease-in-out infinite;
}
.robot-pet.martial .pet-arm.right {
  animation: arm-punch-r 0.42s ease-in-out infinite;
}
.robot-pet.martial .pet-leg.left {
  transform: rotate(20deg);
}
.robot-pet.martial .pet-leg.right {
  transform: rotate(-20deg);
}
.robot-pet.martial .pet-core {
  animation: core-pulse 0.5s ease-in-out infinite;
}

/* 摆烂 */
.robot-pet.slack .pet-stage {
  animation: pet-slack 2.4s ease-in-out infinite;
}
.robot-pet.slack .pet-head {
  animation: head-droop 2.4s ease-in-out infinite;
}
.robot-pet.slack .pet-eye {
  opacity: 0.3;
  height: 3px;
  top: 14px;
}
.robot-pet.slack .pet-arm.left {
  transform: rotate(62deg);
}
.robot-pet.slack .pet-arm.right {
  transform: rotate(-62deg);
}
.robot-pet.slack .pet-leg.left {
  transform: rotate(42deg);
}
.robot-pet.slack .pet-leg.right {
  transform: rotate(-42deg);
}
.robot-pet.slack .pet-zzz {
  display: block;
}

/* ============ keyframes ============ */
@keyframes tip-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.6; }
}
@keyframes core-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.7; }
}
@keyframes pet-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes pet-dance {
  0% { transform: translateY(0) rotate(-5deg); }
  25% { transform: translateY(-11px) rotate(0); }
  50% { transform: translateY(0) rotate(5deg); }
  75% { transform: translateY(-11px) rotate(0); }
  100% { transform: translateY(0) rotate(-5deg); }
}
@keyframes arm-swing-l {
  0% { transform: rotate(20deg); }
  50% { transform: rotate(-45deg); }
  100% { transform: rotate(20deg); }
}
@keyframes arm-swing-r {
  0% { transform: rotate(-20deg); }
  50% { transform: rotate(45deg); }
  100% { transform: rotate(-20deg); }
}
@keyframes leg-dance-l {
  0% { transform: rotate(10deg); }
  50% { transform: rotate(-16deg); }
  100% { transform: rotate(10deg); }
}
@keyframes leg-dance-r {
  0% { transform: rotate(-10deg); }
  50% { transform: rotate(16deg); }
  100% { transform: rotate(-10deg); }
}
@keyframes pet-martial {
  0% { transform: translateY(0) rotate(0); }
  25% { transform: translateY(4px) rotate(-3deg); }
  50% { transform: translateY(0) rotate(3deg); }
  75% { transform: translateY(4px) rotate(-3deg); }
  100% { transform: translateY(0) rotate(0); }
}
@keyframes arm-punch-l {
  0% { transform: rotate(0); }
  50% { transform: rotate(-115deg) translateX(-3px); }
  100% { transform: rotate(0); }
}
@keyframes arm-punch-r {
  0% { transform: rotate(0); }
  50% { transform: rotate(115deg) translateX(3px); }
  100% { transform: rotate(0); }
}
@keyframes pet-slack {
  0%, 100% { transform: translateY(6px) scaleY(0.92); }
  50% { transform: translateY(9px) scaleY(0.9); }
}
@keyframes head-droop {
  0%, 100% { transform: rotate(0); }
  50% { transform: rotate(13deg); }
}
@keyframes z-float {
  0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
  30% { opacity: 0.9; }
  100% { opacity: 0; transform: translate(10px, -22px) scale(1.2); }
}

/* 窄屏隐藏，避免遮挡内容 */
@media (max-width: 600px) {
  .robot-pet {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .robot-pet .pet-stage,
  .robot-pet .pet-arm,
  .robot-pet .pet-leg,
  .robot-pet .pet-head,
  .pet-tip,
  .pet-core,
  .pet-zzz span {
    animation: none !important;
  }
}
</style>
