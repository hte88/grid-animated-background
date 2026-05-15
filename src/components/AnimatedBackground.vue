<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Cell = {
    color: string
    hover: boolean
    toggle: boolean
    symbol: string | number | null
    toggledOn: boolean
}

const props = withDefaults(
    defineProps<{
        cellSize?: number
        rotate?: number
        skewX?: number
        skewY?: number
        scale?: number
        hoverColors?: string[]
        toggleProbability?: number
        symbolProbability?: number
        preColoredProbability?: number
        symbols?: (string | number)[]
        borderColor?: string
        baseBackground?: string
        animated?: boolean
        interaction?: 'hover' | 'click' | 'none'
        rippleRadius?: number
        glow?: boolean
        glowIntensity?: number
        trail?: boolean
        trailDuration?: number
        autoWave?: boolean
        waveSpeed?: number
        respectReducedMotion?: boolean
    }>(),
    {
        cellSize: 32,
        rotate: 0,
        skewX: -48,
        skewY: 14,
        scale: 1,
        hoverColors: () => ['#FF6B9D', '#00D9FF', '#7DFF8E', '#FFD93D', '#BD93F9'],
        toggleProbability: 0.02,
        symbolProbability: 0.15,
        preColoredProbability: 0.009,
        symbols: () => Array.from(Array(49).keys()),
        borderColor: 'rgba(255,255,255,0.04)',
        baseBackground: 'rgba(255,255,255,0)',
        animated: true,
        interaction: 'hover',
        rippleRadius: 0,
        glow: false,
        glowIntensity: 12,
        trail: false,
        trailDuration: 600,
        autoWave: false,
        waveSpeed: 6,
        respectReducedMotion: true
    }
)

const grid = ref<Cell[][]>([])

const reducedMotion = ref(false)

const effectiveAnimated = computed(
    () => props.animated && !(props.respectReducedMotion && reducedMotion.value)
)
const effectiveAutoWave = computed(
    () => props.autoWave && !(props.respectReducedMotion && reducedMotion.value)
)

function pickColor() {
    const i = Math.floor(Math.random() * props.hoverColors.length)
    return props.hoverColors[i] ?? props.baseBackground
}

function pickSymbol() {
    if (!props.symbols.length) return null
    return props.symbols[Math.floor(Math.random() * props.symbols.length)] ?? null
}

function generateGrid() {
    const rows = Math.ceil(window.innerHeight / props.cellSize) + 4
    const cols = Math.ceil(window.innerWidth / props.cellSize) + 4

    grid.value = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => {
            const hasSymbol = Math.random() < props.symbolProbability
            const preColored = Math.random() < props.preColoredProbability
            const toggle = preColored ? true : Math.random() < props.toggleProbability
            return {
                color: pickColor(),
                hover: false,
                toggle,
                symbol: hasSymbol ? pickSymbol() : null,
                toggledOn: preColored
            }
        })
    )
}

const trailTimers = new Map<string, number>()
function clearTrailTimers() {
    trailTimers.forEach((id) => window.clearTimeout(id))
    trailTimers.clear()
}

function activateCell(r: number, c: number, depth = 0) {
    const cell = grid.value?.[r]?.[c]
    if (!cell) return
    if (cell.toggle) {
        if (depth === 0) cell.toggledOn = !cell.toggledOn
    } else {
        cell.hover = true
        if (props.trail) {
            const key = `${r}-${c}`
            const previous = trailTimers.get(key)
            if (previous) window.clearTimeout(previous)
            const id = window.setTimeout(() => {
                const target = grid.value?.[r]?.[c]
                if (target && !target.toggle) target.hover = false
                trailTimers.delete(key)
            }, props.trailDuration)
            trailTimers.set(key, id)
        }
    }
}

function spreadRipple(r: number, c: number) {
    const radius = Math.max(0, Math.floor(props.rippleRadius))
    if (radius === 0) {
        activateCell(r, c, 0)
        return
    }
    for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
            const dist = Math.sqrt(dr * dr + dc * dc)
            if (dist > radius) continue
            const nr = r + dr
            const nc = c + dc
            if (dist === 0) {
                activateCell(nr, nc, 0)
            } else {
                window.setTimeout(() => activateCell(nr, nc, 1), dist * 60)
            }
        }
    }
}

function handleEnter(r: number, c: number) {
    if (!effectiveAnimated.value) return
    if (props.interaction !== 'hover') return
    spreadRipple(r, c)
}

function handleLeave(r: number, c: number) {
    const cell = grid.value?.[r]?.[c]
    if (!effectiveAnimated.value || !cell) return
    if (props.interaction !== 'hover') return
    if (props.trail) return // trail handles its own cleanup
    if (!cell.toggle) {
        window.setTimeout(() => {
            const target = grid.value?.[r]?.[c]
            if (target && !target.toggle) target.hover = false
        }, 100)
    }
}

function handleClick(r: number, c: number) {
    if (!effectiveAnimated.value) return
    if (props.interaction !== 'click') return
    const cell = grid.value?.[r]?.[c]
    if (!cell) return
    cell.toggledOn = !cell.toggledOn
    if (!cell.toggle && props.rippleRadius > 0) {
        const radius = Math.max(0, Math.floor(props.rippleRadius))
        for (let dr = -radius; dr <= radius; dr++) {
            for (let dc = -radius; dc <= radius; dc++) {
                const dist = Math.sqrt(dr * dr + dc * dc)
                if (dist === 0 || dist > radius) continue
                const nr = r + dr
                const nc = c + dc
                window.setTimeout(() => {
                    const t = grid.value?.[nr]?.[nc]
                    if (t) t.toggledOn = !t.toggledOn
                }, dist * 80)
            }
        }
    }
}

let resizeFrame = 0
function onResize() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => generateGrid())
}

const touchedCells = new Set<string>()

function handleTouch(e: TouchEvent) {
    if (!effectiveAnimated.value) return
    if (props.interaction === 'none') return
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i]
        if (!touch) continue
        const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
        const cellEl = el?.closest('[data-cell]') as HTMLElement | null
        if (!cellEl) continue
        const r = Number(cellEl.dataset.r)
        const c = Number(cellEl.dataset.c)
        if (Number.isNaN(r) || Number.isNaN(c)) continue
        const key = `${r}-${c}`
        if (touchedCells.has(key)) continue
        touchedCells.add(key)
        if (props.interaction === 'hover') {
            spreadRipple(r, c)
        } else {
            handleClick(r, c)
        }
    }
}

function handleTouchEnd() {
    if (props.interaction === 'hover' && !props.trail) {
        const cells = Array.from(touchedCells)
        window.setTimeout(() => {
            cells.forEach((key) => {
                const [rs, cs] = key.split('-')
                const r = Number(rs)
                const c = Number(cs)
                const cell = grid.value?.[r]?.[c]
                if (cell && !cell.toggle) cell.hover = false
            })
        }, 300)
    }
    touchedCells.clear()
}

const reducedMotionMq =
    typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
if (reducedMotionMq) reducedMotion.value = reducedMotionMq.matches
const reducedMotionListener = (e: MediaQueryListEvent) => {
    reducedMotion.value = e.matches
}

onMounted(() => {
    reducedMotionMq?.addEventListener('change', reducedMotionListener)
    generateGrid()
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    reducedMotionMq?.removeEventListener('change', reducedMotionListener)
    window.removeEventListener('resize', onResize)
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    clearTrailTimers()
})

// Re-generate the grid when settings that affect topology change
watch(
    () => [props.cellSize, props.toggleProbability, props.symbolProbability, props.preColoredProbability, props.symbols],
    () => generateGrid()
)

defineExpose({ regenerate: generateGrid })
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-auto absolute top-1/2 left-1/2 transform-gpu touch-none"
        :class="effectiveAutoWave ? 'auto-wave-on' : ''"
        :style="{
            transform: `translate(-50%, -50%) skewX(${skewX}deg) skewY(${skewY}deg) scale(${scale}) rotate(${rotate}deg)`,
            '--wave-speed': `${waveSpeed}s`
        } as Record<string, string>"
        @touchstart.passive="handleTouch"
        @touchmove.passive="handleTouch"
        @touchend.passive="handleTouchEnd"
        @touchcancel.passive="handleTouchEnd"
    >
        <div v-for="(row, r) in grid" :key="r" class="flex">
            <div
                v-for="(cell, c) in row"
                :key="c"
                data-cell
                :data-r="r"
                :data-c="c"
                class="cell flex items-center justify-center font-bold text-white"
                :class="effectiveAnimated ? 'transition-all duration-300 ease-linear cursor-pointer' : ''"
                :style="{
                    width: `${cellSize * 2}px`,
                    height: `${cellSize}px`,
                    backgroundColor: cell.hover || cell.toggledOn ? cell.color : baseBackground,
                    border: `0.5px solid ${borderColor}`,
                    boxShadow:
                        glow && (cell.hover || cell.toggledOn)
                            ? `0 0 ${glowIntensity}px ${cell.color}`
                            : 'none',
                    '--r': r,
                    '--c': c,
                    '--cell-color': cell.color
                } as Record<string, string | number>"
                @mouseenter="handleEnter(r, c)"
                @mouseleave="handleLeave(r, c)"
                @click="handleClick(r, c)"
            >
                <span
                    v-if="cell.symbol !== null && (cell.hover || cell.toggledOn)"
                    class="text-xl font-light"
                >
                    {{ cell.symbol }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auto-wave-on .cell {
    animation: cellWave var(--wave-speed, 6s) ease-in-out infinite;
    animation-delay: calc((var(--r, 0) + var(--c, 0)) * -0.08s);
}

@keyframes cellWave {
    0%,
    85%,
    100% {
        background-color: var(--base-bg, transparent);
        box-shadow: none;
    }
    7%,
    18% {
        background-color: var(--cell-color);
        box-shadow: 0 0 14px var(--cell-color);
    }
}
</style>
