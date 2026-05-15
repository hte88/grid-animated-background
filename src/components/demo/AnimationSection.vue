<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'
import RangeField from './RangeField.vue'

const { animated, respectReducedMotion, interaction, autoWave, waveSpeed } = useDemoState()

const interactionOptions = ['hover', 'click', 'none'] as const
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Animation</h3>
        <div class="space-y-3">
            <label class="flex items-center justify-between gap-3">
                <span>Animated</span>
                <input v-model="animated" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
            </label>
            <label class="flex items-center justify-between gap-3">
                <span>Respect reduced-motion</span>
                <input
                    v-model="respectReducedMotion"
                    type="checkbox"
                    class="h-4 w-4 accent-fuchsia-500"
                />
            </label>
            <div>
                <span class="mb-1 block text-xs text-zinc-400">Interaction</span>
                <div class="grid grid-cols-3 gap-1.5">
                    <button
                        v-for="option in interactionOptions"
                        :key="option"
                        class="rounded-md border px-2 py-1 text-xs transition"
                        :class="
                            interaction === option
                                ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-100'
                                : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                        "
                        @click="interaction = option"
                    >
                        {{ option }}
                    </button>
                </div>
            </div>
            <label class="flex items-center justify-between gap-3">
                <span>Auto-wave</span>
                <input v-model="autoWave" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
            </label>
            <RangeField
                v-if="autoWave"
                v-model="waveSpeed"
                label="Wave speed"
                :display="`${waveSpeed}s`"
                :min="1"
                :max="20"
                :step="0.5"
            />
        </div>
    </section>
</template>
