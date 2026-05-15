<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import AnimatedBackground from './components/AnimatedBackground.vue'

type SymbolPreset = 'lotto' | 'letters' | 'emojis' | 'glyphs' | 'binary' | 'custom'

type Preset = {
    name: string
    hoverColors: string[]
    baseBackground: string
    borderColor: string
    cellSize: number
    glow: boolean
    skewX: number
    skewY: number
    symbolPreset: SymbolPreset
}

const PRESETS: Record<string, Preset> = {
    Loto: {
        name: 'Loto',
        hoverColors: ['#FF6B9D', '#00D9FF', '#7DFF8E', '#FFD93D', '#BD93F9'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 32,
        glow: false,
        skewX: -48,
        skewY: 14,
        symbolPreset: 'lotto'
    },
    Cyber: {
        name: 'Cyber',
        hoverColors: ['#00FFC2', '#00BFFF', '#FF00E5', '#9D4EDD'],
        baseBackground: 'rgba(5,8,16,0)',
        borderColor: 'rgba(0,255,194,0.05)',
        cellSize: 28,
        glow: true,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'binary'
    },
    Sunset: {
        name: 'Sunset',
        hoverColors: ['#FF4E50', '#FC913A', '#F9D423', '#FF6F91'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 36,
        glow: true,
        skewX: -30,
        skewY: 8,
        symbolPreset: 'glyphs'
    },
    Mono: {
        name: 'Mono',
        hoverColors: ['#ffffff'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 24,
        glow: false,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'letters'
    },
    Pastel: {
        name: 'Pastel',
        hoverColors: ['#FFD6E0', '#C9F2FF', '#D4F8D4', '#FFF3C4', '#E6D6FF'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.05)',
        cellSize: 40,
        glow: false,
        skewX: -20,
        skewY: 6,
        symbolPreset: 'emojis'
    },
    Matrix: {
        name: 'Matrix',
        hoverColors: ['#00FF66', '#88FF99', '#33CC44'],
        baseBackground: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,255,102,0.06)',
        cellSize: 22,
        glow: true,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'binary'
    }
}

const SYMBOL_SETS: Record<SymbolPreset, (string | number)[]> = {
    lotto: Array.from({ length: 49 }, (_, i) => i + 1),
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    emojis: ['★', '✦', '✺', '✱', '✸', '✹', '❀', '✿', '◆', '◇', '●', '○'],
    glyphs: ['#', '/', '\\', '<', '>', '*', '+', '=', '@', '$', '%', '&'],
    binary: ['0', '1'],
    custom: []
}

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
const hoverColors = ref<string[]>([
    '#FF6B9D',
    '#00D9FF',
    '#7DFF8E',
    '#FFD93D',
    '#BD93F9'
])
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

const bgRef = useTemplateRef<InstanceType<typeof AnimatedBackground>>('bg')

function regenerate() {
    bgRef.value?.regenerate()
}

function applyPreset(key: string) {
    const p = PRESETS[key]
    if (!p) return
    hoverColors.value = [...p.hoverColors]
    baseBackground.value = p.baseBackground
    borderColor.value = p.borderColor
    cellSize.value = p.cellSize
    glow.value = p.glow
    skewX.value = p.skewX
    skewY.value = p.skewY
    symbolPreset.value = p.symbolPreset
}

function addColor() {
    if (!newColor.value) return
    hoverColors.value = [...hoverColors.value, newColor.value]
}

function removeColor(idx: number) {
    hoverColors.value = hoverColors.value.filter((_, i) => i !== idx)
}

function resetTransform() {
    rotate.value = 0
    skewX.value = -48
    skewY.value = 14
    scale.value = 1
}

const snippet = computed(() => {
    const props: string[] = []
    props.push(`:cell-size="${cellSize.value}"`)
    if (rotate.value !== 0) props.push(`:rotate="${rotate.value}"`)
    if (skewX.value !== -48) props.push(`:skew-x="${skewX.value}"`)
    if (skewY.value !== 14) props.push(`:skew-y="${skewY.value}"`)
    if (scale.value !== 1) props.push(`:scale="${scale.value}"`)
    props.push(`:hover-colors='${JSON.stringify(hoverColors.value)}'`)
    props.push(`:toggle-probability="${toggleProbability.value}"`)
    props.push(`:symbol-probability="${symbolProbability.value}"`)
    props.push(`:pre-colored-probability="${preColoredProbability.value}"`)
    if (interaction.value !== 'hover') props.push(`interaction="${interaction.value}"`)
    if (rippleRadius.value > 0) props.push(`:ripple-radius="${rippleRadius.value}"`)
    if (glow.value) {
        props.push(`glow`)
        props.push(`:glow-intensity="${glowIntensity.value}"`)
    }
    if (trail.value) {
        props.push(`trail`)
        props.push(`:trail-duration="${trailDuration.value}"`)
    }
    if (autoWave.value) {
        props.push(`auto-wave`)
        props.push(`:wave-speed="${waveSpeed.value}"`)
    }
    if (!animated.value) props.push(`:animated="false"`)
    return `<AnimatedBackground\n    ${props.join('\n    ')}\n/>`
})

const copied = ref(false)
async function copySnippet() {
    try {
        await navigator.clipboard.writeText(snippet.value)
        copied.value = true
        setTimeout(() => (copied.value = false), 1500)
    } catch {
        // ignore
    }
}
</script>

<template>
    <main class="relative h-screen w-screen overflow-hidden">
        <!-- Background layer -->
        <div class="absolute inset-0">
            <AnimatedBackground
                ref="bg"
                :cell-size="cellSize"
                :rotate="rotate"
                :skew-x="skewX"
                :skew-y="skewY"
                :scale="scale"
                :hover-colors="hoverColors"
                :toggle-probability="toggleProbability"
                :symbol-probability="symbolProbability"
                :pre-colored-probability="preColoredProbability"
                :symbols="symbols"
                :base-background="baseBackground"
                :border-color="borderColor"
                :animated="animated"
                :interaction="interaction"
                :ripple-radius="rippleRadius"
                :glow="glow"
                :glow-intensity="glowIntensity"
                :trail="trail"
                :trail-duration="trailDuration"
                :auto-wave="autoWave"
                :wave-speed="waveSpeed"
                :respect-reduced-motion="respectReducedMotion"
            />
        </div>

        <!-- Title overlay -->
        <div
            class="pointer-events-none absolute top-8 z-10 -translate-x-1/2 text-center transition-[left] duration-300"
            :class="[
                panelOpen ? 'hidden sm:block left-[calc(50%-180px)]' : 'left-1/2'
            ]"
        >
            <h1
                class="text-4xl font-black tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-5xl md:text-7xl"
            >
                Animated <span class="text-fuchsia-400">Background</span>
            </h1>
            <p class="mt-2 text-xs text-zinc-400 sm:text-sm md:text-base">
                Interagis avec la grille · ouvre le panneau pour personnaliser
            </p>
        </div>

        <!-- Open button (when panel closed) -->
        <button
            v-if="!panelOpen"
            class="absolute top-4 right-4 z-20 rounded-lg border border-white/10 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/80"
            @click="panelOpen = true"
        >
            ⚙ Options
        </button>

        <!-- Controls panel -->
        <aside
            v-if="panelOpen"
            class="thin-scroll absolute top-0 right-0 z-20 h-full w-full overflow-y-auto border-l border-white/10 bg-black/80 backdrop-blur-md sm:w-[360px] sm:bg-black/70"
        >
            <header class="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">
                <h2 class="text-sm font-semibold tracking-wide text-white">
                    ⚙ Controls
                </h2>
                <div class="flex items-center gap-2">
                    <a
                        href="https://github.com/hte88/grid-animated-background"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                        title="Voir le code source sur GitHub"
                    >
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 .5C5.73.5.67 5.56.67 11.83c0 5.02 3.25 9.28 7.76 10.79.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.16.69-3.83-1.35-3.83-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.52-.29-5.18-1.26-5.18-5.62 0-1.24.44-2.26 1.18-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.06 0 4.37-2.67 5.33-5.21 5.61.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.79.55 4.51-1.51 7.75-5.77 7.75-10.79C23.33 5.56 18.27.5 12 .5Z" />
                        </svg>
                        GitHub
                    </a>
                    <button
                        class="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                        title="Regénérer la grille"
                        @click="regenerate"
                    >
                        ↻ Regen
                    </button>
                    <button
                        class="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                        @click="panelOpen = false"
                    >
                        ✕
                    </button>
                </div>
            </header>

            <div class="space-y-6 p-4 text-sm text-zinc-200">
                <!-- Presets -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Presets
                    </h3>
                    <div class="flex flex-wrap gap-2">
                        <button
                            v-for="(p, key) in PRESETS"
                            :key="key"
                            class="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                            @click="applyPreset(key)"
                        >
                            {{ p.name }}
                        </button>
                    </div>
                </section>

                <!-- Animation -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Animation
                    </h3>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between gap-3">
                            <span>Animated</span>
                            <input v-model="animated" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
                        </label>
                        <label class="flex items-center justify-between gap-3">
                            <span>Respect reduced-motion</span>
                            <input v-model="respectReducedMotion" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
                        </label>
                        <div>
                            <span class="mb-1 block text-xs text-zinc-400">Interaction</span>
                            <div class="grid grid-cols-3 gap-1.5">
                                <button
                                    v-for="opt in ['hover', 'click', 'none'] as const"
                                    :key="opt"
                                    class="rounded-md border px-2 py-1 text-xs transition"
                                    :class="
                                        interaction === opt
                                            ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100'
                                            : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                                    "
                                    @click="interaction = opt"
                                >
                                    {{ opt }}
                                </button>
                            </div>
                        </div>
                        <label class="flex items-center justify-between gap-3">
                            <span>Auto-wave</span>
                            <input v-model="autoWave" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
                        </label>
                        <div v-if="autoWave">
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Wave speed</span><span>{{ waveSpeed }}s</span>
                            </div>
                            <input v-model.number="waveSpeed" type="range" min="1" max="20" step="0.5" class="w-full" />
                        </div>
                    </div>
                </section>

                <!-- FX -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Effects
                    </h3>
                    <div class="space-y-3">
                        <label class="flex items-center justify-between gap-3">
                            <span>Glow</span>
                            <input v-model="glow" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
                        </label>
                        <div v-if="glow">
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Glow intensity</span><span>{{ glowIntensity }}px</span>
                            </div>
                            <input v-model.number="glowIntensity" type="range" min="0" max="60" step="1" class="w-full" />
                        </div>

                        <label class="flex items-center justify-between gap-3">
                            <span>Trail (fade-out)</span>
                            <input v-model="trail" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
                        </label>
                        <div v-if="trail">
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Trail duration</span><span>{{ trailDuration }}ms</span>
                            </div>
                            <input v-model.number="trailDuration" type="range" min="100" max="3000" step="50" class="w-full" />
                        </div>

                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Ripple radius</span><span>{{ rippleRadius }}</span>
                            </div>
                            <input v-model.number="rippleRadius" type="range" min="0" max="8" step="1" class="w-full" />
                        </div>
                    </div>
                </section>

                <!-- Grid -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Grid
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Cell size</span><span>{{ cellSize }}px</span>
                            </div>
                            <input v-model.number="cellSize" type="range" min="12" max="80" step="1" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Toggle probability</span><span>{{ toggleProbability.toFixed(3) }}</span>
                            </div>
                            <input v-model.number="toggleProbability" type="range" min="0" max="0.2" step="0.005" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Symbol probability</span><span>{{ symbolProbability.toFixed(2) }}</span>
                            </div>
                            <input v-model.number="symbolProbability" type="range" min="0" max="1" step="0.01" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Pre-colored probability</span><span>{{ preColoredProbability.toFixed(3) }}</span>
                            </div>
                            <input v-model.number="preColoredProbability" type="range" min="0" max="0.1" step="0.001" class="w-full" />
                        </div>
                    </div>
                </section>

                <!-- Transform -->
                <section>
                    <div class="mb-2 flex items-center justify-between">
                        <h3 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                            Transform
                        </h3>
                        <button
                            class="text-xs text-zinc-400 hover:text-white"
                            @click="resetTransform"
                        >
                            reset
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Rotate</span><span>{{ rotate }}°</span>
                            </div>
                            <input v-model.number="rotate" type="range" min="-180" max="180" step="1" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Skew X</span><span>{{ skewX }}°</span>
                            </div>
                            <input v-model.number="skewX" type="range" min="-90" max="90" step="1" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Skew Y</span><span>{{ skewY }}°</span>
                            </div>
                            <input v-model.number="skewY" type="range" min="-90" max="90" step="1" class="w-full" />
                        </div>
                        <div>
                            <div class="mb-1 flex justify-between text-xs text-zinc-400">
                                <span>Scale</span><span>{{ scale.toFixed(2) }}</span>
                            </div>
                            <input v-model.number="scale" type="range" min="0.4" max="2.5" step="0.05" class="w-full" />
                        </div>
                    </div>
                </section>

                <!-- Colors -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Colors
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <span class="mb-1 block text-xs text-zinc-400">Palette</span>
                            <div class="flex flex-wrap gap-2">
                                <div
                                    v-for="(color, i) in hoverColors"
                                    :key="i"
                                    class="group relative flex items-center"
                                >
                                    <input
                                        type="color"
                                        :value="color"
                                        class="h-7 w-7 cursor-pointer rounded border border-white/20 bg-transparent"
                                        @input="
                                            hoverColors = hoverColors.map((c, idx) =>
                                                idx === i ? ($event.target as HTMLInputElement).value : c
                                            )
                                        "
                                    />
                                    <button
                                        class="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white group-hover:flex"
                                        @click="removeColor(i)"
                                    >
                                        ×
                                    </button>
                                </div>
                                <label class="flex items-center gap-1">
                                    <input v-model="newColor" type="color" class="h-7 w-7 cursor-pointer rounded border border-white/20 bg-transparent" />
                                    <button
                                        class="h-7 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-white hover:bg-white/10"
                                        @click="addColor"
                                    >
                                        +
                                    </button>
                                </label>
                            </div>
                        </div>
                        <div>
                            <span class="mb-1 block text-xs text-zinc-400">Border</span>
                            <input v-model="borderColor" type="text" class="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400" />
                        </div>
                        <div>
                            <span class="mb-1 block text-xs text-zinc-400">Base background</span>
                            <input v-model="baseBackground" type="text" class="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400" />
                        </div>
                    </div>
                </section>

                <!-- Symbols -->
                <section>
                    <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                        Symbols
                    </h3>
                    <div class="grid grid-cols-3 gap-1.5">
                        <button
                            v-for="opt in (['lotto', 'letters', 'emojis', 'glyphs', 'binary', 'custom'] as SymbolPreset[])"
                            :key="opt"
                            class="rounded-md border px-2 py-1 text-xs transition"
                            :class="
                                symbolPreset === opt
                                    ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100'
                                    : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                            "
                            @click="symbolPreset = opt"
                        >
                            {{ opt }}
                        </button>
                    </div>
                    <textarea
                        v-if="symbolPreset === 'custom'"
                        v-model="customSymbols"
                        placeholder="comma- or space-separated"
                        class="mt-2 w-full rounded-md border border-white/10 bg-black/40 p-2 text-xs text-white outline-none focus:border-fuchsia-400"
                        rows="2"
                    />
                </section>

                <!-- Code snippet -->
                <section>
                    <div class="mb-2 flex items-center justify-between">
                        <h3 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                            Code
                        </h3>
                        <button
                            class="text-xs text-zinc-400 hover:text-white"
                            @click="showSnippet = !showSnippet"
                        >
                            {{ showSnippet ? 'hide' : 'show' }}
                        </button>
                    </div>
                    <div v-if="showSnippet" class="relative">
                        <pre class="thin-scroll max-h-64 overflow-auto rounded-md border border-white/10 bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-200">{{ snippet }}</pre>
                        <button
                            class="absolute top-2 right-2 rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-black/90"
                            @click="copySnippet"
                        >
                            {{ copied ? '✓ copied' : 'copy' }}
                        </button>
                    </div>
                </section>

                <p class="pt-2 text-center text-[10px] text-zinc-500">
                    Demo · Animated Background Component
                </p>
            </div>
        </aside>
    </main>
</template>
