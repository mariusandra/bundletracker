import './TreeScene.scss'
import { useValues } from 'kea'
import { treeLogic } from './treeLogic'
import { TreeMap } from './TreeMap'

export function TreeScene() {
    const { treeWithCoords } = useValues(treeLogic)
    console.log(treeWithCoords)
    return (
        <div className="tree-scene">
            {treeWithCoords ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={treeWithCoords} x={0} y={0} />
                </div>
            ) : null}
        </div>
    )
}
