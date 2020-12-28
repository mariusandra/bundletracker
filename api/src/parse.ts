export const sizeKey = Symbol('size')

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

interface SizeTree extends Record<string, SizeTree> {
    [sizeKey]: number
}

export function convertToTree(filesAndSizes: Map<string, number>) {
    const tree: SizeTree = {
        [sizeKey]: 0,
    }
    for (const [file, size] of filesAndSizes) {
        let pointer = tree
        pointer[sizeKey] += size
        for (const filePart of file.split('/')) {
            let child = pointer[filePart]
            if (!child) {
                child = pointer[filePart] = {
                    [sizeKey]: 0,
                }
            }
            child[sizeKey] += size
            pointer = child
        }
    }
    return tree
}

export interface D3Tree {
    name: string
    value?: number
    children: D3Tree[]
}

export function convertToD3Tree(filesAndSizes: Map<string, number>) {
    const tree: D3Tree = {
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
    return simplifyD3Tree(tree)
}

export function simplifyD3Tree(tree: D3Tree): D3Tree {
    if (tree.children.length === 1) {
        tree.children[0].name = `${tree.name}/${tree.children[0].name}`
        return tree.children[0]
    } else {
        return { ...tree, children: tree.children.map(simplifyD3Tree) }
    }
}
