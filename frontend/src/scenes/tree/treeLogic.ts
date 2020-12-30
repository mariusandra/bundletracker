import { kea } from 'kea'
import { treeLogicType } from './treeLogicType'
import { APITreeNode, TreeCoords, TreeNode, Dials } from './types'
import squarify from 'squarify'

export const treeLogic = kea<treeLogicType<APITreeNode, TreeNode, TreeCoords, Dials>>({
    actions: {
        loadStats: true,
        setStatsResponse: (statsResponse: APITreeNode) => ({ statsResponse }),
        setDials: (dials: Partial<Dials>) => ({ dials }),
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
        dials: [
            { padding: 10, margin: 10, minWidth: 10, minHeight: 10 } as Dials,
            {
                setDials: (state, { dials }) => ({ ...state, ...dials }),
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
            (s) => [s.treeWithValues, s.windowCoords, s.dials],
            (treeWithValues, windowCoords, { margin, padding, minWidth, minHeight }) => {
                if (!treeWithValues || !windowCoords) {
                    return null
                }

                function setCoords(node: TreeNode, coords: TreeCoords, level: number) {
                    const x0 = coords.x0 + (level === 0 ? 0 : margin / 2)
                    const x1 = coords.x1 - (level === 0 ? 0 : margin / 2)
                    const y0 = coords.y0 + (level === 0 ? 0 : margin / 2)
                    const y1 = coords.y1 - (level === 0 ? 0 : margin / 2)

                    let combinedChildren: TreeNode[] = []
                    if (x1 > x0 && y1 > y0 && coords.x1 - coords.x0 >= minWidth && coords.y1 - coords.y0 >= minHeight) {
                        const area = (x1 - x0) * (y1 - y0)

                        const minimalAreaforChild = (minWidth + padding + margin) * (minHeight + padding + margin)
                        const minimalValueForChild = node.value * (minimalAreaforChild / area)

                        const includedChildren =
                            minimalAreaforChild > 0
                                ? node.children.filter(({ value }) => value >= minimalValueForChild)
                                : []
                        const excludedValue = node.value - includedChildren.reduce((sum, { value }) => sum + value, 0)

                        combinedChildren =
                            excludedValue > 0 && includedChildren.length > 0 && excludedValue > minimalValueForChild
                                ? [
                                      ...includedChildren,
                                      {
                                          name: '*OTHER*',
                                          value: excludedValue,
                                          children: [],
                                      },
                                  ]
                                : includedChildren

                        const squarified = squarify(
                            combinedChildren.map(({ value }) => ({ value })), // don't pass children to squarify!
                            {
                                x0: x0 + padding / 2,
                                x1: x1 - padding / 2,
                                y0: y0 + padding / 2,
                                y1: y1 - padding / 2,
                            }
                        )

                        combinedChildren = combinedChildren
                            .map((child, index) => setCoords(child, squarified[index], level + 1))
                            .filter((c) => c)
                    }
                    return {
                        ...node,
                        coords: { x0, x1, y0, y1 },
                        children: combinedChildren,
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
