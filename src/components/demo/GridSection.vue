<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'
import RangeField from './RangeField.vue'

const { cellSize, toggleProbability, symbolProbability, preColoredProbability } = useDemoState()
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Grid</h3>
        <div class="space-y-3">
            <RangeField
                v-model="cellSize"
                label="Cell size"
                :display="`${cellSize}px`"
                :min="12"
                :max="80"
                :step="1"
            />
            <RangeField
                v-model="toggleProbability"
                label="Toggle probability"
                :display="toggleProbability.toFixed(3)"
                :min="0"
                :max="0.2"
                :step="0.005"
            />
            <RangeField
                v-model="symbolProbability"
                label="Symbol probability"
                :display="symbolProbability.toFixed(2)"
                :min="0"
                :max="1"
                :step="0.01"
            />
            <RangeField
                v-model="preColoredProbability"
                label="Pre-colored probability"
                :display="preColoredProbability.toFixed(3)"
                :min="0"
                :max="0.1"
                :step="0.001"
            />
        </div>
    </section>
</template>
