<script setup lang="ts">
import type { SymbolPreset } from '../../lib/presets'
import { useDemoState } from '../../composables/useDemoState'

const { symbolPreset, customSymbols } = useDemoState()

const symbolOptions: SymbolPreset[] = ['lotto', 'letters', 'emojis', 'glyphs', 'binary', 'custom']
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Symbols</h3>
        <div class="grid grid-cols-3 gap-1.5">
            <button
                v-for="option in symbolOptions"
                :key="option"
                class="rounded-md border px-2 py-1 text-xs transition"
                :class="
                    symbolPreset === option
                        ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100'
                        : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                "
                @click="symbolPreset = option"
            >
                {{ option }}
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
</template>
