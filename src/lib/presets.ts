export type SymbolPreset = 'lotto' | 'letters' | 'emojis' | 'glyphs' | 'binary' | 'custom'

export type Preset = {
    name: string
    hoverColors: string[]
    baseBackground: string
    borderColor: string
    cellSize: number
    glow: boolean
    skewX: number
    skewY: number
    symbolPreset: SymbolPreset
}

export const PRESETS: Record<string, Preset> = {
    Loto: {
        name: 'Loto',
        hoverColors: ['#FF6B9D', '#00D9FF', '#7DFF8E', '#FFD93D', '#BD93F9'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 32,
        glow: false,
        skewX: -48,
        skewY: 14,
        symbolPreset: 'lotto'
    },
    Cyber: {
        name: 'Cyber',
        hoverColors: ['#00FFC2', '#00BFFF', '#FF00E5', '#9D4EDD'],
        baseBackground: 'rgba(5,8,16,0)',
        borderColor: 'rgba(0,255,194,0.05)',
        cellSize: 28,
        glow: true,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'binary'
    },
    Sunset: {
        name: 'Sunset',
        hoverColors: ['#FF4E50', '#FC913A', '#F9D423', '#FF6F91'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 36,
        glow: true,
        skewX: -30,
        skewY: 8,
        symbolPreset: 'glyphs'
    },
    Mono: {
        name: 'Mono',
        hoverColors: ['#ffffff'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.04)',
        cellSize: 24,
        glow: false,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'letters'
    },
    Pastel: {
        name: 'Pastel',
        hoverColors: ['#FFD6E0', '#C9F2FF', '#D4F8D4', '#FFF3C4', '#E6D6FF'],
        baseBackground: 'rgba(255,255,255,0)',
        borderColor: 'rgba(255,255,255,0.05)',
        cellSize: 40,
        glow: false,
        skewX: -20,
        skewY: 6,
        symbolPreset: 'emojis'
    },
    Matrix: {
        name: 'Matrix',
        hoverColors: ['#00FF66', '#88FF99', '#33CC44'],
        baseBackground: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,255,102,0.06)',
        cellSize: 22,
        glow: true,
        skewX: 0,
        skewY: 0,
        symbolPreset: 'binary'
    }
}

export const SYMBOL_SETS: Record<SymbolPreset, (string | number)[]> = {
    lotto: Array.from({ length: 49 }, (_, index) => index + 1),
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    emojis: ['★', '✦', '✺', '✱', '✸', '✹', '❀', '✿', '◆', '◇', '●', '○'],
    glyphs: ['#', '/', '\\', '<', '>', '*', '+', '=', '@', '$', '%', '&'],
    binary: ['0', '1'],
    custom: []
}
