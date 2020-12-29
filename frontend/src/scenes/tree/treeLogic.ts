import { kea } from 'kea'
import { treeLogicType } from './treeLogicType'
import { APITreeNode, TreeCoords, TreeNode } from './types'
import squarify from 'squarify'

export const treeLogic = kea<treeLogicType<APITreeNode, TreeNode, TreeCoords>>({
    actions: {
        loadStats: true,
        setStatsResponse: (statsResponse: APITreeNode) => ({ statsResponse }),
    },
    listeners: ({ actions }) => ({
        loadStats: async () => {
            const response = await fetch('/bundle.json')
            const stats = await response.json()
            actions.setStatsResponse(stats)
        },
    }),
    reducers: {
        statsResponse: [
            null as APITreeNode | null,
            {
                setStatsResponse: (_, { statsResponse }) => statsResponse,
            },
        ],
    },
    windowValues: {
        windowWidth: (window) => window.innerWidth,
        windowHeight: (window) => window.innerHeight,
    },
    selectors: {
        treeWithValues: [
            (s) => [s.statsResponse],
            (statsResponse) => {
                function addIntermediateValues(child: APITreeNode): TreeNode {
                    if (typeof child.value !== 'undefined') {
                        return child as TreeNode
                    }
                    const children = child.children.map(addIntermediateValues)
                    const value = children.reduce((sum, child) => sum + (child.value || 0), 0)
                    return {
                        ...child,
                        children,
                        value,
                    }
                }
                return statsResponse ? addIntermediateValues(statsResponse) : null
            },
        ],

        windowCoords: [
            (s) => [s.windowWidth, s.windowHeight],
            (windowWidth, windowHeight) => {
                if (!windowWidth || !windowHeight) {
                    return null
                }
                return { x0: 0, y0: 0, x1: windowWidth, y1: windowHeight } as TreeCoords
            },
        ],

        treeWithCoords: [
            (s) => [s.treeWithValues, s.windowCoords],
            (treeWithValues, windowCoords) => {
                if (!treeWithValues || !windowCoords) {
                    return null
                }

                function setCoords(node: TreeNode, coords: TreeCoords, level: number) {
                    const squarified = squarify(
                        // get just one layer
                        node.children.map(({ value }) => ({ value })),
                        // pre-given coords as the boundary
                        coords
                    )

                    return {
                        ...node,
                        coords,
                        children: node.children.map((child, index) => setCoords(child, squarified[index], level + 1)),
                    }
                }

                return setCoords(treeWithValues, windowCoords, 0)
            },
        ],
    },
    events: ({ actions }) => ({
        afterMount() {
            actions.loadStats()
        },
    }),
})
