<script setup lang="ts">
import { PRESETS } from '../../lib/presets'
import { useDemoState } from '../../composables/useDemoState'

const { applyPreset } = useDemoState()
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Presets</h3>
        <div class="flex flex-wrap gap-2">
            <button
                v-for="(preset, key) in PRESETS"
                :key="key"
                class="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                @click="applyPreset(key)"
            >
                {{ preset.name }}
            </button>
        </div>
    </section>
</template>
