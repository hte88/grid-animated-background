<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'
import ControlsHeader from './ControlsHeader.vue'
import PresetsSection from './PresetsSection.vue'
import AnimationSection from './AnimationSection.vue'
import EffectsSection from './EffectsSection.vue'
import GridSection from './GridSection.vue'
import TransformSection from './TransformSection.vue'
import ColorsSection from './ColorsSection.vue'
import SymbolsSection from './SymbolsSection.vue'
import CodeSnippetSection from './CodeSnippetSection.vue'

defineProps<{ onRegenerate: () => void }>()

const { panelOpen } = useDemoState()
</script>

<template>
    <button
        v-if="!panelOpen"
        class="absolute top-4 right-4 z-20 rounded-lg border border-white/10 bg-black/60 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/80"
        @click="panelOpen = true"
    >
        ⚙ Options
    </button>

    <aside
        v-if="panelOpen"
        class="thin-scroll absolute top-0 right-0 z-20 h-full w-full overflow-y-auto border-l border-white/10 bg-black/80 backdrop-blur-md sm:w-[360px] sm:bg-black/70"
    >
        <ControlsHeader :on-regenerate="onRegenerate" />
        <div class="space-y-6 p-4 text-sm text-zinc-200">
            <PresetsSection />
            <AnimationSection />
            <EffectsSection />
            <GridSection />
            <TransformSection />
            <ColorsSection />
            <SymbolsSection />
            <CodeSnippetSection />
            <p class="pt-2 text-center text-[10px] text-zinc-500">
                Demo · Animated Background Component
            </p>
        </div>
    </aside>
</template>
