import * as fs from 'fs'
import * as path from 'path'
import express from 'express'
import { convertToTree, getFilesAndSizes } from './parse'
import { PrismaClient } from '../prisma/client'

const prisma = new PrismaClient()
const app = express()
const port = process.env.PORT || 4001
const siteUrl = process.env.SITE_URL || `http://localhost:${port}`

async function main() {
    const bundleCount = await prisma.bundle.count()
    console.log(`🟢 ${bundleCount} bundles in the database!`)

    const staticPath = path.resolve(__dirname, '../public')

    app.use(express.json({ limit: '20mb' }))
    app.use(express.static(staticPath))

    app.get('/bundle.json', (req, res) => {
        const json = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../assets/stats.json')).toString())
        const filesAndSizes = getFilesAndSizes(json.modules)
        const tree = convertToTree(filesAndSizes)

        res.json(tree)
    })

    app.get('/bundle/:bundle.json', async (req, res) => {
        const { bundle } = req.params
        const bundleModel = await prisma.bundle.findFirst({
            where: {
                id: bundle,
            },
        })

        if (bundleModel) {
            res.json(bundleModel.tree)
        } else {
            res.status(404).json({ error: '404 not found' })
        }
    })

    app.post('/upload', async (req, res) => {
        try {
            const { tree, meta } = req.body
            const bundle = await prisma.bundle.create({
                data: { tree, meta },
            })
            const url = `${siteUrl}/b/${bundle.id}`
            res.json({ success: true, url, message: `📦 Bundle Tracked: ${url}` })
            console.log(url)
        } catch (error) {
            res.json({ success: false, message: '🔴 Could not store bundle!' })
        }
    })

    app.get('/b/*', (req, res) => {
        res.sendFile(path.resolve(staticPath, 'index.html'))
    })

    app.listen(port, () => {
        console.log(`🟢 BundleTracker Server listening at ${siteUrl}`)
    })
}
main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
