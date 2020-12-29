import { D3Tree } from './types'

export function TreeMap({ stats, level = 0 }: { stats: D3Tree; level?: number }) {
    return (
        <div>
            {stats.children.map((child, i) => (
                <div key={i}>
                    {child.name}
                    <TreeMap stats={child} level={level + 1} />
                </div>
            ))}
        </div>
    )
}
