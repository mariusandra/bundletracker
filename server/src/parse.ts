export interface TreeNode {
    name: string
    value?: number
    children: TreeNode[]
}

export function getFilesAndSizes(modules: any[]) {
    const collector = new Map<string, number>()
    for (const module of modules) {
        if (module.modules) {
            for (const innerModule of module.modules) {
                const name = innerModule.name.split('!').pop()
                collector.set(name, innerModule.size)
            }
        } else {
            const name = module.name.split('!').pop()
            collector.set(name, module.size)
        }
    }
    return collector
}

export function convertToTree(filesAndSizes: Map<string, number>): TreeNode {
    const tree: TreeNode = {
        name: '<root>',
        children: [],
    }
    for (const [file, size] of filesAndSizes) {
        let pointer = tree
        const fileParts = file.split('/')
        fileParts.forEach((filePart, index) => {
            let child = pointer.children.find((c) => c.name === filePart)
            if (!child) {
                child = {
                    name: filePart,
                    children: [],
                }
                pointer.children.push(child)
            }
            if (index === fileParts.length - 1) {
                child.value = size
            }
            pointer = child
        })
    }
    return tree
}

export function parseStats(stats: any): TreeNode {
    const filesAndSizes = getFilesAndSizes(stats.modules)
    const tree = convertToTree(filesAndSizes)
    return tree
}
