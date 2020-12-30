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
        function getPath(target: HTMLElement) {
            if (target.className.includes('tree-heading')) {
                const path = target?.parentElement?.dataset?.['path'] || null
                return path
            } else {
                return null
            }
        }
        function onMove(e: MouseEvent) {
            setHoverPath(getPath(e.target as HTMLElement))
        }
        function onClick(e: MouseEvent) {
            console.log(getPath(e.target as HTMLElement))
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mousedown', onClick)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mousedown', onClick)
        }
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
