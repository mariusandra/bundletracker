import { kea } from 'kea'
import { treeLogicType } from './treeLogicType'
import { D3Tree } from '../../types'
import squarify from 'squarify'

export const treeLogic = kea<treeLogicType<D3Tree>>({
    actions: {
        loadStats: true,
        setStats: (stats: D3Tree) => ({ stats }),
    },
    listeners: ({ actions }) => ({
        loadStats: async () => {
            const response = await fetch('/bundle.json')
            const stats = await response.json()
            actions.setStats(stats)
        },
    }),
    reducers: {
        stats: [
            null as D3Tree | null,
            {
                setStats: (_, { stats }) => stats,
            },
        ],
    },
    windowValues: {
        windowWidth: (window) => window.innerWidth,
        windowHeight: (window) => window.innerHeight,
    },
    selectors: {
        cleanStats: [
            (s) => [s.stats, s.windowWidth, s.windowHeight],
            (rawStats, windowWidth, windowHeight) => {
                if (!rawStats || !windowWidth || !windowHeight) {
                    return null
                }
                function sumStats(child: D3Tree): D3Tree {
                    if (child.children.length > 0) {
                        child.children = child.children.map(sumStats)
                        child.value = child.children.map((c) => c.value).reduce((p, c) => (p || 0) + (c || 0), 0)
                    }
                    return child
                }
                const stats = sumStats(rawStats)
                stats.coords = { x0: 0, y0: 0, x1: windowWidth, y1: windowHeight }

                function getDimensions(child: D3Tree) {
                    squarify(
                        child.children.map(({ value }, index) => ({ value, index })),
                        child.coords
                    ).forEach(({ index, x0, x1, y0, y1 }) => {
                        child.children[index].coords = { x0, x1, y0, y1 }
                    })

                    child.children = child.children.map((c) => getDimensions(c))

                    return child
                }

                return getDimensions(stats)
            },
        ],
    },
    events: ({ actions }) => ({
        afterMount() {
            actions.loadStats()
        },
    }),
})
