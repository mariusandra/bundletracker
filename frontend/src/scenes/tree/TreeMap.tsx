import { TreeNode } from './types'
import { humanFileSize } from './utils'
interface TreeMapProps {
    node: TreeNode
    level?: number
    path?: string
    x: number
    y: number
    hoverPath: string
}

function getColor(level: number, path: string, hueIndex: number, hover: boolean) {
    const nodeModulesLevel = path.split('/').filter((p) => p === 'node_modules').length
    const hsl = [
        hueIndex * 3 + nodeModulesLevel * 100,
        path === '<root>' || path === '<root>/.' || path.endsWith('/node_modules') ? 0 : 40 + (hover ? 30 : 0),
        88 - level * 5 + (hover ? 12 : 0),
    ]
    return `hsl(${hsl[0]}deg ${hsl[1]}% ${hsl[2]}%)`
}

export function TreeMap({ node, level = 0, path = '', x = 0, y = 0, hoverPath }: TreeMapProps) {
    const rootPath = path ? `${path}/${node.name}` : node.name
    const { x0, x1, y0, y1 } = node.coords

    const classes = [
        'tree-node',
        path.endsWith('/node_modules') ? 'is-node-modules' : '',
        hoverPath === rootPath ? 'hover' : '',
        node.children.length === 0 ? 'is-leaf' : '',
    ]
    const pathHover = `${rootPath}/`.startsWith(`${hoverPath}/`) // avoids /bla-1 matching /bla-10

    return (
        <div
            className={classes.filter((a) => a).join(' ')}
            style={{
                width: x1 - x0,
                height: y1 - y0,
                left: x0 - x,
                top: y0 - y,
                background: getColor(level, rootPath, node.hueIndex, pathHover),
            }}
            data-path={rootPath}
            data-hue={node.hueIndex}
        >
            <div className="tree-heading">
                {node.name} {humanFileSize(node.value)}
            </div>
            {node.children.map((child, i) => (
                <TreeMap
                    node={child}
                    hoverPath={hoverPath}
                    key={child.name}
                    level={level + 1}
                    path={rootPath}
                    x={x0}
                    y={y0}
                />
            ))}
        </div>
    )
}
