import './styles.scss'
import { useValues } from 'kea'
import { treeLogic } from './treeLogic'
import { TreeMap } from './TreeMap'

export function TreeScene() {
    const { cleanStats, windowWidth, windowHeight } = useValues(treeLogic)
    console.log(cleanStats)
    return (
        <div className="tree-scene">
            {cleanStats && windowWidth && windowHeight ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={cleanStats} x={0} y={0} />
                </div>
            ) : null}
        </div>
    )
}
