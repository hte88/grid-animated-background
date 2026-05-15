<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'

const {
    hoverColors,
    newColor,
    borderColor,
    baseBackground,
    addColor,
    removeColor,
    updateColor
} = useDemoState()
</script>

<template>
    <section>
        <h3 class="mb-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase">Colors</h3>
        <div class="space-y-3">
            <div>
                <span class="mb-1 block text-xs text-zinc-400">Palette</span>
                <div class="flex flex-wrap gap-2">
                    <div
                        v-for="(color, index) in hoverColors"
                        :key="index"
                        class="group relative flex items-center"
                    >
                        <input
                            type="color"
                            :value="color"
                            class="h-7 w-7 cursor-pointer rounded border border-white/20 bg-transparent"
                            @input="
                                updateColor(index, ($event.target as HTMLInputElement).value)
                            "
                        />
                        <button
                            class="absolute -top-1 -right-1 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white group-hover:flex"
                            @click="removeColor(index)"
                        >
                            ×
                        </button>
                    </div>
                    <label class="flex items-center gap-1">
                        <input
                            v-model="newColor"
                            type="color"
                            class="h-7 w-7 cursor-pointer rounded border border-white/20 bg-transparent"
                        />
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
                <input
                    v-model="borderColor"
                    type="text"
                    class="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400"
                />
            </div>
            <div>
                <span class="mb-1 block text-xs text-zinc-400">Base background</span>
                <input
                    v-model="baseBackground"
                    type="text"
                    class="w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400"
                />
            </div>
        </div>
    </section>
</template>
