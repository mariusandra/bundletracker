import './TreeScene.scss'
import { useActions, useValues } from 'kea'
import { treeLogic } from './treeLogic'
import { TreeMap } from './TreeMap'
import { Dials } from './Dials'
import { useEffect } from 'react'

const showDials = false

export function TreeScene() {
    const { hoverPath, treeWithCoords, root } = useValues(treeLogic)
    const { setHoverPath, setRoot } = useActions(treeLogic)

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
            if (e.button === 0) {
                setRoot(getPath(e.target as HTMLElement))
            }
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mousedown', onClick)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mousedown', onClick)
        }
    }, []) // eslint-disable-line

    const rootWithoutLast = root.split('/').slice(0, -1).join('/')

    return (
        <div className="tree-scene">
            {treeWithCoords ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={treeWithCoords} x={0} y={0} hoverPath={hoverPath} path={rootWithoutLast} />
                </div>
            ) : null}
            {showDials && <Dials />}
        </div>
    )
}
