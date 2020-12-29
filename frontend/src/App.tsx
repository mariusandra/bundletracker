import './App.css'
import { useValues } from 'kea'
import { treeLogic } from './tree/treeLogic'
import { TreeMap } from './tree/TreeMap'

function App() {
    const { cleanStats } = useValues(treeLogic)
    return <div className="App">{cleanStats ? <TreeMap stats={cleanStats} /> : null}</div>
}

export default App
