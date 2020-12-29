export interface D3Tree {
    name: string
    value: number
    children: D3Tree[]
    coords?: {
        x0: number
        y0: number
        x1: number
        y1: number
    }
}
