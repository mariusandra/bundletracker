import './TreeScene.scss'
import { useActions, useValues } from 'kea'
import { treeLogic } from './treeLogic'
import { TreeMap } from './TreeMap'
import { Dials } from './Dials'
import { useEffect } from 'react'

const showDials = false

export function TreeScene() {
    const { hoverPath, treeWithCoords } = useValues(treeLogic)
    const { setHoverPath } = useActions(treeLogic)

    useEffect(() => {
        function onMove(e: MouseEvent) {
            let target = e.target as HTMLElement
            if (target.className.includes('tree-heading')) {
                const path = target?.parentElement?.dataset?.['path'] || null
                console.log(path)
                setHoverPath(path)
            } else {
                setHoverPath(null)
            }
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
    }, []) // eslint-disable-line

    return (
        <div className="tree-scene">
            {treeWithCoords ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={treeWithCoords} x={0} y={0} hoverPath={hoverPath} />
                </div>
            ) : null}
            {showDials && <Dials />}
        </div>
    )
}
