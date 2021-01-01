export interface TreeMeta {
    root?: boolean
    module?: boolean
    chunk?: boolean
    node_modules?: boolean
}

export interface APITreeNode {
    name: string
    value?: number
    children: APITreeNode[]
    meta?: TreeMeta
}

export interface TreeNode {
    name: string
    value: number
    children: TreeNode[]
    coords?: TreeCoords
    hueIndex: number
    meta?: TreeMeta
}

export interface TreeCoords {
    x0: number
    y0: number
    x1: number
    y1: number
}

export interface Dials {
    padding: number
    paddingTop: number
    margin: number
    minWidth: number
    minHeight: number
    minHeightToHaveChildren: number
}
