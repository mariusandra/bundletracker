import './App.css'
import { useValues } from 'kea'
import { logic } from './logic'
import { TreeMap } from './TreeMap'

function App() {
    const { stats } = useValues(logic)
    return <div className="App">{stats ? <TreeMap stats={stats} /> : null}</div>
}

export default App
