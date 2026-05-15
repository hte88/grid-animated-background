import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type Cell = {
    color: string
    hover: boolean
    toggle: boolean
    symbol: string | number | null
    toggledOn: boolean
}

export type AnimatedGridOptions = {
    cellSize: number
    hoverColors: string[]
    baseBackground: string
    toggleProbability: number
    symbolProbability: number
    preColoredProbability: number
    symbols: (string | number)[]
    animated: boolean
    interaction: 'hover' | 'click' | 'none'
    rippleRadius: number
    trail: boolean
    trailDuration: number
    autoWave: boolean
    respectReducedMotion: boolean
}

export function useAnimatedGrid(options: AnimatedGridOptions) {
    const grid = ref<Cell[][]>([])
    const reducedMotion = ref(false)

    const effectiveAnimated = computed(
        () => options.animated && !(options.respectReducedMotion && reducedMotion.value)
    )
    const effectiveAutoWave = computed(
        () => options.autoWave && !(options.respectReducedMotion && reducedMotion.value)
    )

    function pickColor() {
        const i = Math.floor(Math.random() * options.hoverColors.length)
        return options.hoverColors[i] ?? options.baseBackground
    }

    function pickSymbol() {
        if (!options.symbols.length) return null
        return options.symbols[Math.floor(Math.random() * options.symbols.length)] ?? null
    }

    function generateGrid() {
        const rows = Math.ceil(window.innerHeight / options.cellSize) + 4
        const cols = Math.ceil(window.innerWidth / options.cellSize) + 4

        grid.value = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => {
                const hasSymbol = Math.random() < options.symbolProbability
                const preColored = Math.random() < options.preColoredProbability
                const toggle = preColored ? true : Math.random() < options.toggleProbability
                return {
                    color: pickColor(),
                    hover: false,
                    toggle,
                    symbol: hasSymbol ? pickSymbol() : null,
                    toggledOn: preColored
                }
            })
        )
    }

    const trailTimers = new Map<string, number>()
    function clearTrailTimers() {
        trailTimers.forEach((id) => window.clearTimeout(id))
        trailTimers.clear()
    }

    function activateCell(r: number, c: number, depth = 0) {
        const cell = grid.value?.[r]?.[c]
        if (!cell) return
        if (cell.toggle) {
            if (depth === 0) cell.toggledOn = !cell.toggledOn
        } else {
            cell.hover = true
            if (options.trail) {
                const key = `${r}-${c}`
                const previous = trailTimers.get(key)
                if (previous) window.clearTimeout(previous)
                const id = window.setTimeout(() => {
                    const target = grid.value?.[r]?.[c]
                    if (target && !target.toggle) target.hover = false
                    trailTimers.delete(key)
                }, options.trailDuration)
                trailTimers.set(key, id)
            }
        }
    }

    function spreadRipple(r: number, c: number) {
        const radius = Math.max(0, Math.floor(options.rippleRadius))
        if (radius === 0) {
            activateCell(r, c, 0)
            return
        }
        for (let dr = -radius; dr <= radius; dr++) {
            for (let dc = -radius; dc <= radius; dc++) {
                const dist = Math.sqrt(dr * dr + dc * dc)
                if (dist > radius) continue
                const nr = r + dr
                const nc = c + dc
                if (dist === 0) {
                    activateCell(nr, nc, 0)
                } else {
                    window.setTimeout(() => activateCell(nr, nc, 1), dist * 60)
                }
            }
        }
    }

    function handleEnter(r: number, c: number) {
        if (!effectiveAnimated.value) return
        if (options.interaction !== 'hover') return
        spreadRipple(r, c)
    }

    function handleLeave(r: number, c: number) {
        const cell = grid.value?.[r]?.[c]
        if (!effectiveAnimated.value || !cell) return
        if (options.interaction !== 'hover') return
        if (options.trail) return
        if (!cell.toggle) {
            window.setTimeout(() => {
                const target = grid.value?.[r]?.[c]
                if (target && !target.toggle) target.hover = false
            }, 100)
        }
    }

    function handleClick(r: number, c: number) {
        if (!effectiveAnimated.value) return
        if (options.interaction !== 'click') return
        const cell = grid.value?.[r]?.[c]
        if (!cell) return
        cell.toggledOn = !cell.toggledOn
        if (!cell.toggle && options.rippleRadius > 0) {
            const radius = Math.max(0, Math.floor(options.rippleRadius))
            for (let dr = -radius; dr <= radius; dr++) {
                for (let dc = -radius; dc <= radius; dc++) {
                    const dist = Math.sqrt(dr * dr + dc * dc)
                    if (dist === 0 || dist > radius) continue
                    const nr = r + dr
                    const nc = c + dc
                    window.setTimeout(() => {
                        const t = grid.value?.[nr]?.[nc]
                        if (t) t.toggledOn = !t.toggledOn
                    }, dist * 80)
                }
            }
        }
    }

    let resizeFrame = 0
    function onResize() {
        if (resizeFrame) cancelAnimationFrame(resizeFrame)
        resizeFrame = requestAnimationFrame(() => generateGrid())
    }

    const touchedCells = new Set<string>()

    function handleTouch(e: TouchEvent) {
        if (!effectiveAnimated.value) return
        if (options.interaction === 'none') return
        for (let i = 0; i < e.touches.length; i++) {
            const touch = e.touches[i]
            if (!touch) continue
            const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
            const cellEl = el?.closest('[data-cell]') as HTMLElement | null
            if (!cellEl) continue
            const r = Number(cellEl.dataset.r)
            const c = Number(cellEl.dataset.c)
            if (Number.isNaN(r) || Number.isNaN(c)) continue
            const key = `${r}-${c}`
            if (touchedCells.has(key)) continue
            touchedCells.add(key)
            if (options.interaction === 'hover') {
                spreadRipple(r, c)
            } else {
                handleClick(r, c)
            }
        }
    }

    function handleTouchEnd() {
        if (options.interaction === 'hover' && !options.trail) {
            const cells = Array.from(touchedCells)
            window.setTimeout(() => {
                cells.forEach((key) => {
                    const [rs, cs] = key.split('-')
                    const r = Number(rs)
                    const c = Number(cs)
                    const cell = grid.value?.[r]?.[c]
                    if (cell && !cell.toggle) cell.hover = false
                })
            }, 300)
        }
        touchedCells.clear()
    }

    const reducedMotionMq =
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null
    if (reducedMotionMq) reducedMotion.value = reducedMotionMq.matches
    const reducedMotionListener = (e: MediaQueryListEvent) => {
        reducedMotion.value = e.matches
    }

    onMounted(() => {
        reducedMotionMq?.addEventListener('change', reducedMotionListener)
        generateGrid()
        window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => {
        reducedMotionMq?.removeEventListener('change', reducedMotionListener)
        window.removeEventListener('resize', onResize)
        if (resizeFrame) cancelAnimationFrame(resizeFrame)
        clearTrailTimers()
    })

    watch(
        () => [
            options.cellSize,
            options.toggleProbability,
            options.symbolProbability,
            options.preColoredProbability,
            options.symbols
        ],
        () => generateGrid()
    )

    return {
        grid,
        effectiveAnimated,
        effectiveAutoWave,
        regenerate: generateGrid,
        handleEnter,
        handleLeave,
        handleClick,
        handleTouch,
        handleTouchEnd
    }
}
