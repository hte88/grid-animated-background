<script setup lang="ts">
import { useTemplateRef } from 'vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import ControlsPanel from './components/demo/ControlsPanel.vue'
import TitleOverlay from './components/demo/TitleOverlay.vue'
import { useDemoState } from './composables/useDemoState'

const state = useDemoState()

const backgroundRef = useTemplateRef<InstanceType<typeof AnimatedBackground>>('background')

function regenerate() {
    backgroundRef.value?.regenerate()
}
</script>

<template>
    <main class="relative h-screen w-screen overflow-hidden">
        <div class="absolute inset-0">
            <AnimatedBackground
                ref="background"
                :cell-size="state.cellSize.value"
                :rotate="state.rotate.value"
                :skew-x="state.skewX.value"
                :skew-y="state.skewY.value"
                :scale="state.scale.value"
                :hover-colors="state.hoverColors.value"
                :toggle-probability="state.toggleProbability.value"
                :symbol-probability="state.symbolProbability.value"
                :pre-colored-probability="state.preColoredProbability.value"
                :symbols="state.symbols.value"
                :base-background="state.baseBackground.value"
                :border-color="state.borderColor.value"
                :animated="state.animated.value"
                :interaction="state.interaction.value"
                :ripple-radius="state.rippleRadius.value"
                :glow="state.glow.value"
                :glow-intensity="state.glowIntensity.value"
                :trail="state.trail.value"
                :trail-duration="state.trailDuration.value"
                :auto-wave="state.autoWave.value"
                :wave-speed="state.waveSpeed.value"
                :respect-reduced-motion="state.respectReducedMotion.value"
            />
        </div>

        <TitleOverlay />
        <ControlsPanel :on-regenerate="regenerate" />
    </main>
</template>
