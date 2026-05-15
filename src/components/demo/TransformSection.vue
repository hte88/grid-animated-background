<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'
import RangeField from './RangeField.vue'

const { rotate, skewX, skewY, scale, resetTransform } = useDemoState()
</script>

<template>
    <section>
        <div class="mb-2 flex items-center justify-between">
            <h3 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Transform</h3>
            <button class="text-xs text-zinc-400 hover:text-white" @click="resetTransform">
                reset
            </button>
        </div>
        <div class="space-y-3">
            <RangeField
                v-model="rotate"
                label="Rotate"
                :display="`${rotate}°`"
                :min="-180"
                :max="180"
                :step="1"
            />
            <RangeField
                v-model="skewX"
                label="Skew X"
                :display="`${skewX}°`"
                :min="-90"
                :max="90"
                :step="1"
            />
            <RangeField
                v-model="skewY"
                label="Skew Y"
                :display="`${skewY}°`"
                :min="-90"
                :max="90"
                :step="1"
            />
            <RangeField
                v-model="scale"
                label="Scale"
                :display="scale.toFixed(2)"
                :min="0.4"
                :max="2.5"
                :step="0.05"
            />
        </div>
    </section>
</template>
