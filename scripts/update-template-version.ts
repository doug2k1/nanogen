import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Read root package.json
const rootPath = join(process.cwd(), 'package.json')
const rootPkg = JSON.parse(readFileSync(rootPath, 'utf8'))

// Read template package.json
const templatePath = join(process.cwd(), 'template/package.json')
const templatePkg = JSON.parse(readFileSync(templatePath, 'utf8'))

// Update nanogen version
templatePkg.devDependencies.nanogen = `^${rootPkg.version}`

// Write back updated template package.json
writeFileSync(templatePath, JSON.stringify(templatePkg, null, 2) + '\n', 'utf8')
