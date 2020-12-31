import './TreeScene.scss'
import { useActions, useValues } from 'kea'
import { treeLogic } from './treeLogic'
import { TreeMap } from './TreeMap'
import { Dials } from './Dials'
import { useEffect } from 'react'

const showDials = false

export function TreeScene() {
    const { hoverPath, treeWithCoords, root, error, bundle } = useValues(treeLogic)
    const { setHoverPath, setRootHue } = useActions(treeLogic)

    useEffect(() => {
        function getPath(target: HTMLElement) {
            if (target.className.includes('tree-heading')) {
                const path = target?.parentElement?.dataset?.['path'] || null
                return path
            } else {
                return null
            }
        }
        function getHue(target: HTMLElement) {
            if (target.className.includes('tree-heading')) {
                const hue = target?.parentElement?.dataset?.['hue'] || null
                return hue ? parseInt(hue) : 0
            } else {
                return 0
            }
        }
        function onMove(e: MouseEvent) {
            setHoverPath(getPath(e.target as HTMLElement))
        }
        function onClick(e: MouseEvent) {
            if (e.button === 0) {
                setRootHue(getPath(e.target as HTMLElement), getHue(e.target as HTMLElement))
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
            {error ? <div style={{ color: 'red', fontSize: 30 }}>{error}</div> : null}
            {!bundle ? (
                <div style={{ color: 'red', fontSize: 30 }}>
                    Please load an URL with a bundle, such as: {window.location.origin}/b/BUNDLE_ID
                </div>
            ) : null}
            {treeWithCoords ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={treeWithCoords} x={0} y={0} hoverPath={hoverPath} path={rootWithoutLast} />
                </div>
            ) : null}
            {showDials && <Dials />}
        </div>
    )
}
