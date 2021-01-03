import * as fs from 'fs'
import * as path from 'path'
import express from 'express'
import { parseStats } from './parse'
import { PrismaClient } from '../prisma/client'
import { randomString } from './utils'

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

    app.get('/bundle/dev.json', (req, res) => {
        const stats = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../assets/stats.json')).toString())
        res.json(parseStats(stats))
    })

    app.get('/bundle/:token.json', async (req, res) => {
        const { token } = req.params
        const bundleModel = await prisma.bundle.findFirst({ where: { token } })

        if (bundleModel) {
            res.json(bundleModel.tree)
        } else {
            res.status(404).json({ error: '404 not found' })
        }
    })

    app.post('/upload', async (req, res) => {
        try {
            const { tree, meta, token: projectToken, commit, branch } = req.body

            if (projectToken) {
                const project = await prisma.project.findFirst({ where: { token: projectToken } })
                if (!project) {
                    res.json({ success: false, message: '🔴 BundleTracker: Invalid token!' })
                    return
                }
            }

            const bundleToken = randomString(40)
            const bundle = await prisma.bundle.create({
                data: {
                    tree,
                    meta,
                    commit,
                    branch,
                    token: bundleToken,
                    ...(projectToken ? { project: { connect: { token: projectToken } } } : {}),
                },
            })
            const url = `${siteUrl}/b/${bundle.token}`
            res.json({ success: true, url, message: `📦 Bundle Tracked: ${url}` })
            console.log(url)
        } catch (error) {
            res.json({ success: false, message: '🔴 BundleTracker: Error saving bundle!' })
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
