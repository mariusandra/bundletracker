import { kea } from 'kea'
import { logicType } from '../types/logicType'
import { D3Tree } from './types'

export const logic = kea<logicType>({
    actions: {
        loadStats: true,
        setStats: (stats: D3Tree) => ({ stats }),
    },
    reducers: {
        stats: [
            null as D3Tree | null,
            {
                setStats: (_, { stats }) => stats,
            },
        ],
    },
    listeners: ({ actions }) => ({
        loadStats: async () => {
            const response = await fetch('/bundle.json')
            const stats = await response.json()
            actions.setStats(stats)
        },
    }),
    events: ({ actions }) => ({
        afterMount() {
            actions.loadStats()
        },
    }),
})
