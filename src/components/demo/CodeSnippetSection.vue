<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'

const { showSnippet, snippet, copied, copySnippet } = useDemoState()
</script>

<template>
    <section>
        <div class="mb-2 flex items-center justify-between">
            <h3 class="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Code</h3>
            <button class="text-xs text-zinc-400 hover:text-white" @click="showSnippet = !showSnippet">
                {{ showSnippet ? 'hide' : 'show' }}
            </button>
        </div>
        <div v-if="showSnippet" class="relative">
            <pre
                class="thin-scroll max-h-64 overflow-auto rounded-md border border-white/10 bg-black/60 p-3 text-[11px] leading-relaxed text-zinc-200"
                >{{ snippet }}</pre
            >
            <button
                class="absolute top-2 right-2 rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] text-white hover:bg-black/90"
                @click="copySnippet"
            >
                {{ copied ? '✓ copied' : 'copy' }}
            </button>
        </div>
    </section>
</template>
