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

function getColor(level: number, node: TreeNode, path: string, hueIndex: number, hover: boolean) {
    const nodeModulesLevel = path.split('/').filter((p) => p === 'node_modules').length

    const h = hueIndex * 3 + nodeModulesLevel * 100
    const s = node.meta?.root || node.meta?.node_modules || path === '<root>/.' ? 0 : 40 + (hover ? 30 : 25) - level * 2
    const l = 84 - level * 4 + (hover ? 10 : 5)

    return `hsl(${h}deg ${s}% ${l}%)`
}

export function TreeMap({ node, level = 0, path = '', x = 0, y = 0, hoverPath }: TreeMapProps) {
    const rootPath = path ? `${path}/${node.name}` : node.name
    const { x0, x1, y0, y1 } = node.coords

    const classes = [
        'tree-node',
        node.meta?.node_modules ? 'is-node-modules' : '',
        node.meta?.module ? 'is-module' : '',
        node.meta?.chunk ? 'is-chunk' : '',
        node.meta?.root ? 'is-root' : '',
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
                background: getColor(level, node, rootPath, node.hueIndex, pathHover),
            }}
            data-path={rootPath}
            data-hue={node.hueIndex}
        >
            <div className="tree-heading">
                {node.name.startsWith('./') ? node.name.substring(2) : node.name} {humanFileSize(node.value)}
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
