import { kea } from 'kea'
import { logicType } from '../types/logicType'

export const logic = kea<logicType>({
    actions: {
        loadStats: true,
        setStats: (stats) => ({ stats }),
    },
    reducers: {
        stats: [
            null,
            {
                setStats: (_, { stats }) => stats,
            },
        ],
    },
    listeners: ({ actions }) => ({
        loadStats: async () => {
            const response = await fetch('/bundle.json')
            const bundle = await response.json()
            actions.setStats(bundle)
        },
    }),
    events: ({ actions }) => ({
        afterMount() {
            actions.loadStats()
        },
    }),
})
