import fse from 'fs-extra'
import path from 'node:path'

export function copyFolderToTemp(sourcePath: string) {
  const tempPath = path.join(process.cwd(), '.tmp')

  fse.ensureDirSync(tempPath)

  const tempDir = fse.mkdtempSync(path.join(tempPath, 'test-'))

  fse.copySync(sourcePath, tempDir)

  return tempDir
}
