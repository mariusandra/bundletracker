import { kea } from 'kea'
import { treeLogicType } from '../../types/tree/treeLogicType'
import { D3Tree } from '../types'

export const treeLogic = kea<treeLogicType>({
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
    selectors: {
        cleanStats: [
            (s) => [s.stats],
            (stats) => {
                return stats
            },
        ],
    },
    events: ({ actions }) => ({
        afterMount() {
            actions.loadStats()
        },
    }),
})
