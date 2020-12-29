import { useValues } from 'kea'
import { treeLogic } from '../tree/treeLogic'
import { TreeMap } from '../tree/TreeMap'

function App() {
    const { cleanStats, windowWidth, windowHeight } = useValues(treeLogic)
    console.log(cleanStats)
    return (
        <div className="App">
            {cleanStats && windowWidth && windowHeight ? (
                <div style={{ padding: 10, position: 'relative' }}>
                    <TreeMap node={cleanStats} x={0} y={0} />
                </div>
            ) : null}
        </div>
    )
}

export default App
