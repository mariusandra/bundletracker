// Auto-generated with kea-typegen. DO NOT EDIT!

import { Logic } from 'kea'

export interface treeLogicType<D3Tree> extends Logic {
    actionCreators: {
        loadStats: () => {
            type: 'load stats (...scenes.tree.treeLogic)'
            payload: {
                value: boolean
            }
        }
        setStats: (
            stats: D3Tree
        ) => {
            type: 'set stats (...scenes.tree.treeLogic)'
            payload: {
                stats: D3Tree
            }
        }
    }
    actionKeys: {
        'load stats (...scenes.tree.treeLogic)': 'loadStats'
        'set stats (...scenes.tree.treeLogic)': 'setStats'
    }
    actionTypes: {
        loadStats: 'load stats (...scenes.tree.treeLogic)'
        setStats: 'set stats (...scenes.tree.treeLogic)'
    }
    actions: {
        loadStats: () => void
        setStats: (stats: D3Tree) => void
    }
    constants: {}
    defaults: {
        stats: D3Tree | null
        windowWidth: number
        windowHeight: number
    }
    events: {
        afterMount: () => void
    }
    key: undefined
    listeners: {
        loadStats: ((
            action: {
                type: 'load stats (...scenes.tree.treeLogic)'
                payload: {
                    value: boolean
                }
            },
            previousState: any
        ) => void | Promise<void>)[]
    }
    path: ['', '', '', 'scenes', 'tree', 'treeLogic']
    pathString: '...scenes.tree.treeLogic'
    props: Record<string, unknown>
    reducer: (
        state: any,
        action: () => any,
        fullState: any
    ) => {
        stats: D3Tree | null
        windowWidth: number
        windowHeight: number
    }
    reducerOptions: {}
    reducers: {
        stats: (state: D3Tree | null, action: any, fullState: any) => D3Tree | null
        windowWidth: (state: number, action: any, fullState: any) => number
        windowHeight: (state: number, action: any, fullState: any) => number
    }
    selector: (
        state: any
    ) => {
        stats: D3Tree | null
        windowWidth: number
        windowHeight: number
    }
    selectors: {
        stats: (state: any, props: any) => D3Tree | null
        windowWidth: (state: any, props: any) => number
        windowHeight: (state: any, props: any) => number
        cleanStats: (state: any, props: any) => D3Tree
    }
    sharedListeners: {}
    values: {
        stats: D3Tree | null
        windowWidth: number
        windowHeight: number
        cleanStats: D3Tree
    }
    _isKea: true
    _isKeaWithKey: false
    __keaTypeGenInternalSelectorTypes: {
        cleanStats: (arg1: D3Tree, arg2: number, arg3: number) => D3Tree
    }
}
