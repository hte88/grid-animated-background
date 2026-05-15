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
        const index = Math.floor(Math.random() * options.hoverColors.length)
        return options.hoverColors[index] ?? options.baseBackground
    }

    function pickSymbol() {
        if (!options.symbols.length) {
            return null
        }
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
        trailTimers.forEach((timerId) => {
            window.clearTimeout(timerId)
        })
        trailTimers.clear()
    }

    function activateCell(row: number, col: number, depth = 0) {
        const cell = grid.value?.[row]?.[col]
        if (!cell) {
            return
        }
        if (cell.toggle) {
            if (depth === 0) {
                cell.toggledOn = !cell.toggledOn
            }
        } else {
            cell.hover = true
            if (options.trail) {
                const key = `${row}-${col}`
                const previousTimer = trailTimers.get(key)
                if (previousTimer) {
                    window.clearTimeout(previousTimer)
                }
                const timerId = window.setTimeout(() => {
                    const target = grid.value?.[row]?.[col]
                    if (target && !target.toggle) {
                        target.hover = false
                    }
                    trailTimers.delete(key)
                }, options.trailDuration)
                trailTimers.set(key, timerId)
            }
        }
    }

    function spreadRipple(row: number, col: number) {
        const radius = Math.max(0, Math.floor(options.rippleRadius))
        if (radius === 0) {
            activateCell(row, col, 0)
            return
        }
        for (let dRow = -radius; dRow <= radius; dRow++) {
            for (let dCol = -radius; dCol <= radius; dCol++) {
                const distance = Math.sqrt(dRow * dRow + dCol * dCol)
                if (distance > radius) {
                    continue
                }
                const neighborRow = row + dRow
                const neighborCol = col + dCol
                if (distance === 0) {
                    activateCell(neighborRow, neighborCol, 0)
                } else {
                    window.setTimeout(() => {
                        activateCell(neighborRow, neighborCol, 1)
                    }, distance * 60)
                }
            }
        }
    }

    function handleEnter(row: number, col: number) {
        if (!effectiveAnimated.value) {
            return
        }
        if (options.interaction !== 'hover') {
            return
        }
        spreadRipple(row, col)
    }

    function handleLeave(row: number, col: number) {
        const cell = grid.value?.[row]?.[col]
        if (!effectiveAnimated.value || !cell) {
            return
        }
        if (options.interaction !== 'hover') {
            return
        }
        if (options.trail) {
            return
        }
        if (!cell.toggle) {
            window.setTimeout(() => {
                const target = grid.value?.[row]?.[col]
                if (target && !target.toggle) {
                    target.hover = false
                }
            }, 100)
        }
    }

    function handleClick(row: number, col: number) {
        if (!effectiveAnimated.value) {
            return
        }
        if (options.interaction !== 'click') {
            return
        }
        const cell = grid.value?.[row]?.[col]
        if (!cell) {
            return
        }
        cell.toggledOn = !cell.toggledOn
        if (!cell.toggle && options.rippleRadius > 0) {
            const radius = Math.max(0, Math.floor(options.rippleRadius))
            for (let dRow = -radius; dRow <= radius; dRow++) {
                for (let dCol = -radius; dCol <= radius; dCol++) {
                    const distance = Math.sqrt(dRow * dRow + dCol * dCol)
                    if (distance === 0 || distance > radius) {
                        continue
                    }
                    const neighborRow = row + dRow
                    const neighborCol = col + dCol
                    window.setTimeout(() => {
                        const neighbor = grid.value?.[neighborRow]?.[neighborCol]
                        if (neighbor) {
                            neighbor.toggledOn = !neighbor.toggledOn
                        }
                    }, distance * 80)
                }
            }
        }
    }

    let resizeFrame = 0
    function onResize() {
        if (resizeFrame) {
            cancelAnimationFrame(resizeFrame)
        }
        resizeFrame = requestAnimationFrame(() => {
            generateGrid()
        })
    }

    const touchedCells = new Set<string>()

    function handleTouch(event: TouchEvent) {
        if (!effectiveAnimated.value) {
            return
        }
        if (options.interaction === 'none') {
            return
        }
        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i]
            if (!touch) {
                continue
            }
            const elementAtPoint = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            ) as HTMLElement | null
            const cellElement = elementAtPoint?.closest('[data-cell]') as HTMLElement | null
            if (!cellElement) {
                continue
            }
            const row = Number(cellElement.dataset.row)
            const col = Number(cellElement.dataset.col)
            if (Number.isNaN(row) || Number.isNaN(col)) {
                continue
            }
            const key = `${row}-${col}`
            if (touchedCells.has(key)) {
                continue
            }
            touchedCells.add(key)
            if (options.interaction === 'hover') {
                spreadRipple(row, col)
            } else {
                handleClick(row, col)
            }
        }
    }

    function handleTouchEnd() {
        if (options.interaction === 'hover' && !options.trail) {
            const cells = Array.from(touchedCells)
            window.setTimeout(() => {
                cells.forEach((key) => {
                    const [rowStr, colStr] = key.split('-')
                    const row = Number(rowStr)
                    const col = Number(colStr)
                    const cell = grid.value?.[row]?.[col]
                    if (cell && !cell.toggle) {
                        cell.hover = false
                    }
                })
            }, 300)
        }
        touchedCells.clear()
    }

    const reducedMotionMq =
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia('(prefers-reduced-motion: reduce)')
            : null
    if (reducedMotionMq) {
        reducedMotion.value = reducedMotionMq.matches
    }
    const reducedMotionListener = (event: MediaQueryListEvent) => {
        reducedMotion.value = event.matches
    }

    onMounted(() => {
        reducedMotionMq?.addEventListener('change', reducedMotionListener)
        generateGrid()
        window.addEventListener('resize', onResize)
    })

    onBeforeUnmount(() => {
        reducedMotionMq?.removeEventListener('change', reducedMotionListener)
        window.removeEventListener('resize', onResize)
        if (resizeFrame) {
            cancelAnimationFrame(resizeFrame)
        }
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
        () => {
            generateGrid()
        }
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
