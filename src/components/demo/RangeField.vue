<script setup lang="ts">
defineProps<{
    label: string
    display: string | number
    min: number
    max: number
    step: number
}>()

const model = defineModel<number>({ required: true })
</script>

<template>
    <div>
        <div class="mb-1 flex justify-between text-xs text-zinc-400">
            <span>{{ label }}</span><span>{{ display }}</span>
        </div>
        <input
            v-model.number="model"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            class="w-full"
        />
    </div>
</template>
