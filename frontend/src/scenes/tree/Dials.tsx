import { useActions, useValues } from 'kea'
import { treeLogic } from './treeLogic'

export function Dials() {
    const { dials } = useValues(treeLogic)
    const { setDials } = useActions(treeLogic)

    return (
        <div className="tree-dials">
            <div>
                <label>Margin: {dials.margin}</label>
                <input
                    type="range"
                    value={dials.margin}
                    onChange={(e) => setDials({ margin: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Top padding: {dials.paddingTop}</label>
                <input
                    type="range"
                    value={dials.paddingTop}
                    onChange={(e) => setDials({ paddingTop: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Other padding: {dials.padding}</label>
                <input
                    type="range"
                    value={dials.padding}
                    onChange={(e) => setDials({ padding: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Min Width: {dials.minWidth}</label>
                <input
                    type="range"
                    value={dials.minWidth}
                    onChange={(e) => setDials({ minWidth: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Min Height: {dials.minHeight}</label>
                <input
                    type="range"
                    value={dials.minHeight}
                    onChange={(e) => setDials({ minHeight: parseInt(e.target.value) })}
                />
            </div>
            <div>
                <label>Min height to have children: {dials.minHeightToHaveChildren}</label>
                <input
                    type="range"
                    value={dials.minHeightToHaveChildren}
                    onChange={(e) => setDials({ minHeightToHaveChildren: parseInt(e.target.value) })}
                />
            </div>
        </div>
    )
}
