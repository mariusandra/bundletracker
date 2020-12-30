export interface APITreeNode {
    name: string
    value?: number
    children: APITreeNode[]
}

export interface TreeNode {
    name: string
    value: number
    children: TreeNode[]
    coords?: TreeCoords
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
}
