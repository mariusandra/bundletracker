import './styles.scss'
import { D3Tree } from '../../types'
interface TreeMapProps {
    node: D3Tree
    level?: number
    path?: string
    x: number
    y: number
}
export function TreeMap({ node, level = 0, path = '', x = 0, y = 0 }: TreeMapProps) {
    const rootPath = path ? `${path}/${node.name}` : node.name
    const { x0, x1, y0, y1 } = node.coords

    return (
        <div
            className={`tree-node${node.name === 'node_modules' ? ' node-modules' : ''}`}
            style={{ width: x1 - x0, height: y1 - y0, left: x0 - x, top: y0 - y }}
        >
            {node.children.length === 0 ? (
                <div className="tree-heading">
                    {node.name} {node.value}
                </div>
            ) : null}
            {node.children.map((child) => (
                <TreeMap node={child} key={child.name} level={level + 1} path={rootPath} x={x0} y={y0} />
            ))}
        </div>
    )
}
