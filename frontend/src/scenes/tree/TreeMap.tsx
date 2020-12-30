import { TreeNode } from './types'
import { humanFileSize } from './utils'
interface TreeMapProps {
    node: TreeNode
    level?: number
    path?: string
    x: number
    y: number
    index: number
}

function getColor(level: number, path: string, index: number) {
    const inNodeModules = path.split('/').includes('node_modules')
    const hsl = [
        index * 3 + (inNodeModules ? 100 : 0),
        path === '<root>' || path === '<root>/.' || path === '<root>/./node_modules' ? 0 : 34,
        88 - level * 5,
    ]
    return `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]}%)`
}

export function TreeMap({ node, level = 0, path = '', x = 0, y = 0, index = 0 }: TreeMapProps) {
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
                background: getColor(level, rootPath, index),
            }}
        >
            <div className="tree-heading">
                {node.name} {humanFileSize(node.value)}
            </div>
            {node.children.map((child, i) => (
                <TreeMap
                    node={child}
                    key={child.name}
                    level={level + 1}
                    path={rootPath}
                    x={x0}
                    y={y0}
                    index={i + index}
                />
            ))}
        </div>
    )
}
