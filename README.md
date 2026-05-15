# grid-animated-background

Composant Vue 3 d'arrière-plan interactif : une grille isométrique de cellules qui réagissent à la souris, au clic ou au toucher, avec ripples, glow, trail et vague automatique.

Démo configurable fournie avec un panneau de contrôle (presets, palette, symboles, transform, snippet à copier).

## Aperçu

- Grille auto-dimensionnée à la fenêtre, régénérée au resize
- Inclinaison isométrique paramétrable (`skewX`, `skewY`, `rotate`, `scale`)
- Cellules « hover » (réactives) et cellules « toggle » (allumées en permanence après activation)
- Symboles optionnels affichés quand la cellule est active (chiffres, lettres, emojis, glyphes, binaire ou custom)
- Interaction `hover` / `click` / `none`, propagation en ripple, trail à fade-out, glow, auto-wave CSS
- Respecte `prefers-reduced-motion` par défaut
- Support tactile multi-touch

## Stack

Vue 3 · Vite 6 · TypeScript · Tailwind 4 · `@vueuse/core`

## Démarrage

```bash
bun install
bun run dev
```

Build de production :

```bash
bun run build
bun run preview
```

## Utilisation

```vue
<script setup lang="ts">
import AnimatedBackground from './components/AnimatedBackground.vue'
</script>

<template>
    <div class="absolute inset-0">
        <AnimatedBackground
            :cell-size="32"
            :hover-colors="['#FF6B9D', '#00D9FF', '#7DFF8E']"
            interaction="hover"
            :ripple-radius="2"
            glow
            trail
        />
    </div>
</template>
```

Le composant se positionne en `absolute` centré ; placez-le dans un parent `relative` qui contraint sa taille.

## Props

| Prop | Type | Défaut | Description |
| --- | --- | --- | --- |
| `cellSize` | `number` | `32` | Hauteur d'une cellule en px (la largeur est `cellSize × 2`). |
| `rotate` | `number` | `0` | Rotation (deg). |
| `skewX` | `number` | `-48` | Skew horizontal (deg). |
| `skewY` | `number` | `14` | Skew vertical (deg). |
| `scale` | `number` | `1` | Échelle. |
| `hoverColors` | `string[]` | palette par défaut | Couleurs piochées aléatoirement par cellule. |
| `toggleProbability` | `number` | `0.02` | Probabilité qu'une cellule soit de type « toggle » (état persistant). |
| `symbolProbability` | `number` | `0.15` | Probabilité d'afficher un symbole quand la cellule est active. |
| `preColoredProbability` | `number` | `0.009` | Probabilité qu'une cellule soit déjà allumée au démarrage. |
| `symbols` | `(string \| number)[]` | `0..48` | Pool de symboles. |
| `borderColor` | `string` | `rgba(255,255,255,0.04)` | Couleur de bordure des cellules. |
| `baseBackground` | `string` | `rgba(255,255,255,0)` | Fond des cellules au repos. |
| `animated` | `boolean` | `true` | Active/désactive globalement les transitions. |
| `interaction` | `'hover' \| 'click' \| 'none'` | `'hover'` | Mode d'interaction. |
| `rippleRadius` | `number` | `0` | Rayon de propagation autour de la cellule activée. |
| `glow` | `boolean` | `false` | Ajoute un `box-shadow` coloré sur les cellules actives. |
| `glowIntensity` | `number` | `12` | Rayon du glow en px. |
| `trail` | `boolean` | `false` | En mode hover, la cellule reste allumée puis s'éteint progressivement. |
| `trailDuration` | `number` | `600` | Durée du trail en ms. |
| `autoWave` | `boolean` | `false` | Animation CSS en vague qui parcourt la grille. |
| `waveSpeed` | `number` | `6` | Durée d'un cycle d'auto-wave en secondes. |
| `respectReducedMotion` | `boolean` | `true` | Coupe animation et auto-wave si l'utilisateur a activé `prefers-reduced-motion`. |

## Méthodes exposées

```ts
const bg = useTemplateRef<InstanceType<typeof AnimatedBackground>>('bg')
bg.value?.regenerate() // re-génère la grille (couleurs, symboles, toggles)
```

## Presets de démo

Le `App.vue` inclus propose 6 presets prêts à l'emploi : **Loto**, **Cyber**, **Sunset**, **Mono**, **Pastel**, **Matrix**. Le panneau de contrôle permet aussi d'exporter la configuration courante en snippet Vue prêt à coller.

## Notes

- Les cellules « toggle » s'allument/éteignent au passage et conservent leur état ; les cellules normales reviennent au repos.
- Le ripple en mode `click` propage un toggle aux cellules voisines avec un délai proportionnel à la distance.
- Le composant est `aria-hidden="true"` — il est purement décoratif.
