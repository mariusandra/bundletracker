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
                <label>Padding: {dials.padding}</label>
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
        </div>
    )
}