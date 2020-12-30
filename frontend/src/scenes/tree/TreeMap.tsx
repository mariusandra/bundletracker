import { TreeNode } from './types'
interface TreeMapProps {
    node: TreeNode
    level?: number
    path?: string
    x: number
    y: number
}
const colors = [
    '#00429d',
    '#1147a0',
    '#1d4da2',
    '#2552a5',
    '#2c58a7',
    '#335daa',
    '#3963ac',
    '#3f69af',
    '#446eb1',
    '#4a74b4',
    '#4f7ab6',
    '#547fb8',
    '#5985bb',
    '#5e8bbd',
    '#6391c0',
    '#6997c2',
    '#6e9dc4',
    '#73a2c6',
    '#78a8c9',
    '#7eaecb',
    '#83b4cd',
    '#89bacf',
    '#8fc0d1',
    '#95c6d3',
    '#9bccd5',
    '#a1d2d7',
    '#a8d8d9',
    '#afddda',
    '#b7e3dc',
    '#bfe9de',
    '#c8eedf',
    '#d1f3e0',
    '#ddf8e1',
    '#eafde1',
    '#ffffe0',
]

export function TreeMap({ node, level = 0, path = '', x = 0, y = 0 }: TreeMapProps) {
    const rootPath = path ? `${path}/${node.name}` : node.name
    const { x0, x1, y0, y1 } = node.coords

    return (
        <div
            className={`tree-node${node.name === 'node_modules' ? ' node-modules' : ''}`}
            style={{
                width: x1 - x0,
                height: y1 - y0,
                left: x0 - x,
                top: y0 - y,
                background: colors[level * 3],
            }}
        >
            <div className="tree-heading">
                {node.name} {node.value}
            </div>
            {node.children.map((child) => (
                <TreeMap node={child} key={child.name} level={level + 1} path={rootPath} x={x0} y={y0} />
            ))}
        </div>
    )
}
