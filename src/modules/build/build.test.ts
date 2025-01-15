import mockConfig from '@/test/mock/mock-config'
import { copyFolderToTemp } from '@/test/utils/copyFolderToTemp'
import fse from 'fs-extra'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { build } from './build'

vi.mock('@/libs/logger/logger')

describe('build', () => {
  let tempDir: string
  const initialCwd = process.cwd()

  beforeEach(() => {
    tempDir = copyFolderToTemp(path.resolve(__dirname, '../../test/mock'))
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(initialCwd)
    fse.removeSync(tempDir)
  })

  it('should empty output path', () => {
    fse.mkdirSync(mockConfig.build.outputPath)
    const testFile = `${mockConfig.build.outputPath}/test.txt`
    fse.writeFileSync(testFile, 'test')

    build(mockConfig)

    expect(fse.existsSync(testFile)).toBe(false)
  })

  it('should copy assets folder', () => {
    build(mockConfig)

    expect(fse.existsSync(`${mockConfig.build.outputPath}/asset.txt`)).toBe(
      true,
    )
    expect(
      fse.existsSync(`${mockConfig.build.outputPath}/sub/another.txt`),
    ).toBe(true)
  })

  it('should use the default layout', () => {
    build(mockConfig)

    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/md1/index.html`,
      'utf-8',
    )
    expect(page).to.have.string('default-layout-start')
    expect(page).to.have.string('default-layout-end')
  })

  it('should use custom layout', () => {
    build(mockConfig)

    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/custom/index.html`,
      'utf-8',
    )
    expect(page).to.have.string('custom-layout-start')
    expect(page).to.have.string('custom-layout-end')
  })

  it('should generate pages from markdown', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/md1/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('<p>markdown-page-1</p>')

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/md/md2/index.html`,
      'utf-8',
    )
    expect(page2).to.have.string('<p>markdown-page-2</p>')
  })

  it('should generate pages from ejs', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('<p>ejs-1</p>')

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs/ejs2/index.html`,
      'utf-8',
    )
    expect(page2).to.have.string('<p>ejs-2</p>')
  })

  it('should generate pages from html', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html1/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('<p>html-1</p>')

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/html/html2/index.html`,
      'utf-8',
    )
    expect(page2).to.have.string('<p>html-2</p>')
  })

  it('should not generate extra directory if filename is index', () => {
    build(mockConfig)

    expect(
      fse.existsSync(
        `${mockConfig.build.outputPath}/with-index/index/index.html`,
      ),
    ).to.be.false
    expect(
      fse.existsSync(`${mockConfig.build.outputPath}/with-index/index.html`),
    ).to.be.true
  })

  it('should not generate extra directory if cleanUrls option is false', () => {
    const config = Object.assign({}, mockConfig)
    config.build = Object.assign({}, config.build, { cleanUrls: false })
    build(config)

    expect(fse.existsSync(`${mockConfig.build.outputPath}/html1/index.html`)).to
      .be.false
    expect(fse.existsSync(`${mockConfig.build.outputPath}/html1.html`)).to.be
      .true
  })

  it('should inject site config', () => {
    build(mockConfig)

    const page = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-site-data/index.html`,
      'utf-8',
    )
    expect(page).to.have.string('site title on layout: test-site')
    expect(page).to.have.string('site title on page: test-site')
  })

  it('should inject front matter', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-front-matter-md/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('front-matter on layout: test-md')

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/with-front-matter-ejs/index.html`,
      'utf-8',
    )
    expect(page2).to.have.string('front-matter on layout: test-ejs')
    expect(page2).to.have.string('front-matter on page: test-ejs')
  })

  it('should include partial on layout', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('<p>test-partial-from-layout</p>')
  })

  it('should include partial on pages', () => {
    build(mockConfig)

    const page1 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs1/index.html`,
      'utf-8',
    )
    expect(page1).to.have.string('<p>test-partial-from-page-ejs1</p>')

    const page2 = fse.readFileSync(
      `${mockConfig.build.outputPath}/ejs/ejs2/index.html`,
      'utf-8',
    )
    expect(page2).to.have.string('<p>test-partial-from-page-ejs2</p>')
  })
})
