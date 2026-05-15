<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'

const { panelOpen } = useDemoState()
</script>

<template>
    <div
        class="pointer-events-none absolute top-8 z-10 -translate-x-1/2 text-center transition-[left] duration-300"
        :class="[panelOpen ? 'hidden sm:block left-[calc(50%-180px)]' : 'left-1/2']"
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
</template>
