import * as fs from 'fs'
import * as path from 'path'
import express from 'express'
import { convertToTree, getFilesAndSizes } from './parse'

const app = express()
const port = process.env.BUNDLETRACKER_PORT || 4001
// app.use(express.static('public'))

app.get('/bundle.json', (req, res) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/stats.json')).toString())
    const filesAndSizes = getFilesAndSizes(json.modules)
    const d3Tree = convertToTree(filesAndSizes)

    res.json(d3Tree)
})

app.post('/upload', (req, res) => {
    res.json({ success: true })
})

app.listen(port, () => {
    console.log(`BundleTracker API listening at http://localhost:${port}`)
})
