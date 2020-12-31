import * as fs from 'fs'
import * as path from 'path'
import express from 'express'
import { convertToTree, getFilesAndSizes } from './parse'

const app = express()
const port = process.env.PORT || 4001
const siteUrl = process.env.SITE_URL || `http://localhost:${port}`

app.use(express.json({ limit: '20mb' }))
// app.use(express.static('public'))

app.get('/bundle.json', (req, res) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/stats.json')).toString())
    const filesAndSizes = getFilesAndSizes(json.modules)
    const tree = convertToTree(filesAndSizes)

    res.json(tree)
})

app.post('/upload', (req, res) => {
    try {
        console.log(req.body)
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: 'Error Storing JSON!' })
    }
})

app.listen(port, () => {
    console.log(`BundleTracker API listening at ${siteUrl}`)
})
