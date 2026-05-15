import { computed, ref } from 'vue'
import { PRESETS, SYMBOL_SETS, type SymbolPreset } from '../lib/presets'

const symbolPreset = ref<SymbolPreset>('lotto')
const customSymbols = ref('')
const symbols = computed(() =>
    symbolPreset.value === 'custom'
        ? customSymbols.value.split(/[,\s]+/).filter(Boolean)
        : SYMBOL_SETS[symbolPreset.value]
)

const cellSize = ref(32)
const rotate = ref(0)
const skewX = ref(-48)
const skewY = ref(14)
const scale = ref(1)
const toggleProbability = ref(0.02)
const symbolProbability = ref(0.15)
const preColoredProbability = ref(0.009)
const baseBackground = ref('rgba(255,255,255,0)')
const borderColor = ref('rgba(255,255,255,0.04)')
const hoverColors = ref<string[]>(['#FF6B9D', '#00D9FF', '#7DFF8E', '#FFD93D', '#BD93F9'])
const newColor = ref('#FF6B9D')

const animated = ref(true)
const interaction = ref<'hover' | 'click' | 'none'>('hover')
const rippleRadius = ref(0)
const glow = ref(false)
const glowIntensity = ref(12)
const trail = ref(false)
const trailDuration = ref(600)
const autoWave = ref(false)
const waveSpeed = ref(6)
const respectReducedMotion = ref(true)

const panelOpen = ref(true)
const showSnippet = ref(false)
const copied = ref(false)

function applyPreset(key: string) {
    const preset = PRESETS[key]
    if (!preset) {
        return
    }
    hoverColors.value = [...preset.hoverColors]
    baseBackground.value = preset.baseBackground
    borderColor.value = preset.borderColor
    cellSize.value = preset.cellSize
    glow.value = preset.glow
    skewX.value = preset.skewX
    skewY.value = preset.skewY
    symbolPreset.value = preset.symbolPreset
}

function addColor() {
    if (!newColor.value) {
        return
    }
    hoverColors.value = [...hoverColors.value, newColor.value]
}

function removeColor(targetIndex: number) {
    hoverColors.value = hoverColors.value.filter((_, index) => index !== targetIndex)
}

function updateColor(targetIndex: number, value: string) {
    hoverColors.value = hoverColors.value.map((existing, index) =>
        index === targetIndex ? value : existing
    )
}

function resetTransform() {
    rotate.value = 0
    skewX.value = -48
    skewY.value = 14
    scale.value = 1
}

const snippet = computed(() => {
    const attributes: string[] = []
    attributes.push(`:cell-size="${cellSize.value}"`)
    if (rotate.value !== 0) {
        attributes.push(`:rotate="${rotate.value}"`)
    }
    if (skewX.value !== -48) {
        attributes.push(`:skew-x="${skewX.value}"`)
    }
    if (skewY.value !== 14) {
        attributes.push(`:skew-y="${skewY.value}"`)
    }
    if (scale.value !== 1) {
        attributes.push(`:scale="${scale.value}"`)
    }
    attributes.push(`:hover-colors='${JSON.stringify(hoverColors.value)}'`)
    attributes.push(`:toggle-probability="${toggleProbability.value}"`)
    attributes.push(`:symbol-probability="${symbolProbability.value}"`)
    attributes.push(`:pre-colored-probability="${preColoredProbability.value}"`)
    if (interaction.value !== 'hover') {
        attributes.push(`interaction="${interaction.value}"`)
    }
    if (rippleRadius.value > 0) {
        attributes.push(`:ripple-radius="${rippleRadius.value}"`)
    }
    if (glow.value) {
        attributes.push(`glow`)
        attributes.push(`:glow-intensity="${glowIntensity.value}"`)
    }
    if (trail.value) {
        attributes.push(`trail`)
        attributes.push(`:trail-duration="${trailDuration.value}"`)
    }
    if (autoWave.value) {
        attributes.push(`auto-wave`)
        attributes.push(`:wave-speed="${waveSpeed.value}"`)
    }
    if (!animated.value) {
        attributes.push(`:animated="false"`)
    }
    return `<AnimatedBackground\n    ${attributes.join('\n    ')}\n/>`
})

async function copySnippet() {
    try {
        await navigator.clipboard.writeText(snippet.value)
        copied.value = true
        setTimeout(() => (copied.value = false), 1500)
    } catch {}
}

export function useDemoState() {
    return {
        symbolPreset,
        customSymbols,
        symbols,
        cellSize,
        rotate,
        skewX,
        skewY,
        scale,
        toggleProbability,
        symbolProbability,
        preColoredProbability,
        baseBackground,
        borderColor,
        hoverColors,
        newColor,
        animated,
        interaction,
        rippleRadius,
        glow,
        glowIntensity,
        trail,
        trailDuration,
        autoWave,
        waveSpeed,
        respectReducedMotion,
        panelOpen,
        showSnippet,
        copied,
        snippet,
        applyPreset,
        addColor,
        removeColor,
        updateColor,
        resetTransform,
        copySnippet
    }
}
