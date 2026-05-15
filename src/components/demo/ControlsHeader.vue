<script setup lang="ts">
import { useDemoState } from '../../composables/useDemoState'

defineProps<{ onRegenerate: () => void }>()

const { panelOpen } = useDemoState()
</script>

<template>
    <header
        class="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md"
    >
        <h2 class="text-sm font-semibold tracking-wide text-white">⚙ Controls</h2>
        <div class="flex items-center gap-2">
            <a
                href="https://github.com/hte88/grid-animated-background"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                title="Voir le code source sur GitHub"
            >
                <svg
                    class="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        d="M12 .5C5.73.5.67 5.56.67 11.83c0 5.02 3.25 9.28 7.76 10.79.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.16.69-3.83-1.35-3.83-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.52-.29-5.18-1.26-5.18-5.62 0-1.24.44-2.26 1.18-3.06-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.93 10.93 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.06 0 4.37-2.67 5.33-5.21 5.61.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.79.55 4.51-1.51 7.75-5.77 7.75-10.79C23.33 5.56 18.27.5 12 .5Z"
                    />
                </svg>
                GitHub
            </a>
            <button
                class="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                title="Regénérer la grille"
                @click="onRegenerate"
            >
                ↻ Regen
            </button>
            <button
                class="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white hover:bg-white/10"
                @click="panelOpen = false"
            >
                ✕
            </button>
        </div>
    </header>
</template>
