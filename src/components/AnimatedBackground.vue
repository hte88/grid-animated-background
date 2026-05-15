<script setup lang="ts">
import { useAnimatedGrid } from '../composables/useAnimatedGrid'

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

const {
    grid,
    effectiveAnimated,
    effectiveAutoWave,
    regenerate,
    handleEnter,
    handleLeave,
    handleClick,
    handleTouch,
    handleTouchEnd
} = useAnimatedGrid(props)

defineExpose({ regenerate })
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-auto absolute top-1/2 left-1/2 transform-gpu touch-none"
        :class="effectiveAutoWave ? 'auto-wave-on' : ''"
        :style="
            {
                transform: `translate(-50%, -50%) skewX(${skewX}deg) skewY(${skewY}deg) scale(${scale}) rotate(${rotate}deg)`,
                '--wave-speed': `${waveSpeed}s`
            } as Record<string, string>
        "
        @touchstart.passive="handleTouch"
        @touchmove.passive="handleTouch"
        @touchend.passive="handleTouchEnd"
        @touchcancel.passive="handleTouchEnd"
    >
        <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="flex">
            <div
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                data-cell
                :data-row="rowIndex"
                :data-col="colIndex"
                class="cell flex items-center justify-center font-bold text-white"
                :class="
                    effectiveAnimated
                        ? 'transition-all duration-300 ease-linear cursor-pointer'
                        : ''
                "
                :style="
                    {
                        width: `${cellSize * 2}px`,
                        height: `${cellSize}px`,
                        backgroundColor: cell.hover || cell.toggledOn ? cell.color : baseBackground,
                        border: `0.5px solid ${borderColor}`,
                        boxShadow:
                            glow && (cell.hover || cell.toggledOn)
                                ? `0 0 ${glowIntensity}px ${cell.color}`
                                : 'none',
                        '--row': rowIndex,
                        '--col': colIndex,
                        '--cell-color': cell.color
                    } as Record<string, string | number>
                "
                @mouseenter="handleEnter(rowIndex, colIndex)"
                @mouseleave="handleLeave(rowIndex, colIndex)"
                @click="handleClick(rowIndex, colIndex)"
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
    animation-delay: calc((var(--row, 0) + var(--col, 0)) * -0.08s);
}

@keyframes cellWave {
    0%,
    85%,
    100% {
        background-color: transparent;
        box-shadow: none;
    }
    7%,
    18% {
        background-color: var(--cell-color);
        box-shadow: 0 0 14px var(--cell-color);
    }
}
</style>
