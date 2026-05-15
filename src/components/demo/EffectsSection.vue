<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'
import RangeField from './RangeField.vue'

const { glow, glowIntensity, trail, trailDuration, rippleRadius } = useDemoState()
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Effects</h3>
        <div class="space-y-3">
            <label class="flex items-center justify-between gap-3">
                <span>Glow</span>
                <input v-model="glow" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
            </label>
            <RangeField
                v-if="glow"
                v-model="glowIntensity"
                label="Glow intensity"
                :display="`${glowIntensity}px`"
                :min="0"
                :max="60"
                :step="1"
            />

            <label class="flex items-center justify-between gap-3">
                <span>Trail (fade-out)</span>
                <input v-model="trail" type="checkbox" class="h-4 w-4 accent-fuchsia-500" />
            </label>
            <RangeField
                v-if="trail"
                v-model="trailDuration"
                label="Trail duration"
                :display="`${trailDuration}ms`"
                :min="100"
                :max="3000"
                :step="50"
            />

            <RangeField
                v-model="rippleRadius"
                label="Ripple radius"
                :display="rippleRadius"
                :min="0"
                :max="8"
                :step="1"
            />
        </div>
    </section>
</template>
