import { kea } from 'kea'
import { treeLogicType } from './treeLogicType'
import { APITreeNode, TreeCoords, TreeNode, TreeMeta, Dials } from './types'
import squarify from 'squarify'

const defaultDials: Dials = {
    padding: 0,
    paddingTop: 14,
    margin: 4,
    minWidth: 24,
    minHeight: 24,
    minHeightToHaveChildren: 32,
}

export const treeLogic = kea<treeLogicType<APITreeNode, TreeNode, TreeCoords, TreeMeta, Dials>>({
    actions: {
        setError: (error: string) => ({ error }),
        setBundle: (bundle: string) => ({ bundle }),
        setBundleResponse: (statsResponse: APITreeNode) => ({ statsResponse }),
        setDials: (dials: Partial<Dials>) => ({ dials }),
        setDialsDebounced: (dials: Partial<Dials>) => ({ dials }),
        setHoverPath: (path: string | null) => ({ path }),
        setRootHue: (root: string, hue: number) => ({ root, hue }),
    },
    listeners: ({ actions }) => ({
        setBundle: async ({ bundle }) => {
            try {
                const response = await fetch(`/bundle/${bundle}.json`)
                if (response.status === 200) {
                    const stats = await response.json()
                    actions.setBundleResponse(stats)
                } else {
                    const stats = await response.json()
                    throw new Error(stats.error)
                }
            } catch (error) {
                actions.setError(error.message)
                console.error(error)
            }
        },
        setDials: async ({ dials }, breakpoint) => {
            await breakpoint(10)
            actions.setDialsDebounced(dials)
        },
    }),
    reducers: {
        statsResponse: [
            null as APITreeNode | null,
            {
                setBundleResponse: (_, { statsResponse }) => statsResponse,
            },
        ],
        dials: [
            defaultDials,
            {
                setDialsDebounced: (state, { dials }) => ({ ...state, ...dials }),
            },
        ],
        hoverPath: [
            null as string | null,
            {
                setHoverPath: (_, { path }) => path,
                setRootHue: () => null,
            },
        ],
        root: [
            '',
            {
                setRootHue: (_, { root }) => root,
            },
        ],
        bundle: [
            '',
            {
                setBundle: (_, { bundle }) => bundle,
            },
        ],
        error: [
            null as null | string,
            {
                setError: (_, { error }) => error,
                setBundle: () => null,
            },
        ],
        hue: [
            0,
            {
                setRootHue: (_, { hue }) => hue,
            },
        ],
    },
    actionToUrl: ({ values }) => ({
        setRootHue: ({ root, hue }) => [`/b/${values.bundle}`, root || hue ? { root, hue } : {}],
    }),
    urlToAction: ({ actions, values }) => ({
        '/b/:bundle': ({ bundle }, { root = '', hue = '0' }) => {
            if (values.bundle !== bundle) {
                actions.setBundle(bundle)
            }
            if (values.root !== root || values.hue !== parseInt(hue)) {
                actions.setRootHue(root, parseInt(hue))
            }
        },
    }),
    windowValues: {
        windowWidth: (window) => window.innerWidth,
        windowHeight: (window) => window.innerHeight,
    },
    selectors: {
        treeWithValues: [
            (s) => [s.statsResponse],
            (statsResponse) => {
                function addIntermediateValues(node: APITreeNode): TreeNode {
                    if (typeof node.value !== 'undefined') {
                        return { ...node, hueIndex: 0 } as TreeNode
                    }
                    const children = node.children.map(addIntermediateValues)
                    const value = children.reduce((sum, child) => sum + (child.value || 0), 0)
                    return {
                        ...node,
                        children,
                        value,
                        hueIndex: 0,
                    } as TreeNode
                }
                return statsResponse ? addIntermediateValues(statsResponse) : null
            },
        ],

        treeWithFilter: [
            (s) => [s.treeWithValues, s.root],
            (tree, root) => {
                if (root && tree && root !== '<root>') {
                    const [, ...pathParts] = root.split('/')
                    for (const path of pathParts) {
                        tree = tree?.children.find((c) => c.name === path)
                    }
                }
                return tree
            },
        ],

        simplifiedTree: [
            (s) => [s.treeWithFilter],
            (tree) => {
                function simplifyTree(tree: TreeNode): TreeNode {
                    if (
                        tree.children.length === 1 &&
                        !tree.meta?.node_modules &&
                        !tree.meta?.module &&
                        !tree.meta?.chunk
                    ) {
                        return { ...tree.children[0], name: `${tree.name}/${tree.children[0].name}` }
                    } else {
                        return { ...tree, children: tree.children.map(simplifyTree) }
                    }
                }
                return tree ? simplifyTree(tree) : null
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
            (s) => [s.simplifiedTree, s.windowCoords, s.dials, s.hue],
            (
                tree,
                windowCoords,
                { margin, padding, paddingTop, minWidth, minHeight, minHeightToHaveChildren },
                hue
            ) => {
                if (!tree || !windowCoords) {
                    return null
                }

                function setCoords(node: TreeNode, coords: TreeCoords, level: number, hueIndex: number) {
                    const x0 = coords.x0 + (level === 0 ? 0 : margin)
                    const x1 = coords.x1 - (level === 0 ? 0 : margin)
                    const y0 = coords.y0 + (level === 0 ? 0 : margin)
                    const y1 = coords.y1 - (level === 0 ? 0 : margin)

                    let combinedChildren: TreeNode[] = []
                    if (
                        x1 > x0 &&
                        y1 > y0 &&
                        coords.x1 - coords.x0 >= minWidth &&
                        coords.y1 - coords.y0 >= minHeightToHaveChildren
                    ) {
                        const area = (x1 - x0) * (y1 - y0)

                        const minimalAreaforChild =
                            (minWidth + padding * 2 + margin * 2) * (minHeight + padding + paddingTop + margin * 2)
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
                                          hueIndex: 0,
                                      },
                                  ]
                                : includedChildren

                        const squarified = squarify(
                            combinedChildren.map(({ value }) => ({ value })), // don't pass children to squarify!
                            {
                                x0: x0 + padding,
                                x1: x1 - padding,
                                y0: y0 + paddingTop,
                                y1: y1 - padding,
                            }
                        )

                        combinedChildren = combinedChildren
                            .map((child, index) => setCoords(child, squarified[index], level + 1, hueIndex + index))
                            .filter((c) => c)
                    }
                    return {
                        ...node,
                        coords: { x0, x1, y0, y1 },
                        children: combinedChildren,
                        hueIndex,
                    }
                }

                return setCoords(tree, windowCoords, 0, hue)
            },
        ],
    },
})
