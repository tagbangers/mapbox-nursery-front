const { promisify } = require('util')

const p = require('puppeteer')
const chalk = require('chalk')
const fetch = require('node-fetch')
const fs = require('fs-extra')
const { last, endsWith, reject } = require('ramda')
const XLSX = require('xlsx')

const streamPipeline = promisify(require('stream').pipeline)

const SOURCE_BASE_URL =
  'https://www.city.yokohama.lg.jp/kurashi/kosodate-kyoiku/hoiku-yoji/shisetsu/info/'
const SOURCE_PAGE = 'nyusho-jokyo.html'
const DOWNLOAD_PATH = `${__dirname}/../resources/_TEMP`

const logger = {
  progress: s => console.log(chalk.gray(s)),
  info: s => console.log(chalk.green(s)),
}

const selectors = {
  links: 'main .contents-area table td a',
}

const evaluatePage = async (page, selector) => {
  const foundElements = await page.$$(selector)
  return foundElements
}

const getFileName = s => {
  return last(s.split('/'))
}

const downloadFile = async uri => {
  const resp = await fetch(uri)

  if (!resp.ok) {
    throw new Error(`failed to download: ${uri}`)
  }

  const fileName = getFileName(uri)
  const path = `${DOWNLOAD_PATH}/${fileName}`

  logger.progress(`Downloading: ${fileName}...`)
  await streamPipeline(
    resp.body,
    fs.createWriteStream(path, {
      encoding: 'utf8',
    })
  )
}

const downloadFiles = async uriList => {
  try {
    await Promise.all(uriList.map(downloadFile))
    logger.info(`\nDownloaded files in temporal directory. (${DOWNLOAD_PATH})`)
  } catch (e) {
    throw new Error(e)
  }
}

const parseFiles = async () => {
  const files = await fs.readdir(DOWNLOAD_PATH)
  const filePaths = files
    .filter(endsWith('.xlsx'))
    .map(s => `${DOWNLOAD_PATH}/${s}`)

  filePaths.forEach(p => {
    const book = XLSX.readFile(p)
    const Sheet1 = book.Sheets[book.SheetNames[0]]
    const Sheet1Json = XLSX.utils.sheet_to_json(Sheet1)
  })
}

const main = async () => {
  const fileUris = []
  const browser = await p.launch({
    headless: false,
  })

  const page = await browser.newPage()

  await page.goto(`${SOURCE_BASE_URL}${SOURCE_PAGE}`, {
    waitUntil: 'networkidle0',
  })

  const fileLinks = await evaluatePage(page, selectors.links)

  if (fileLinks.length === 0) {
    throw new Error('No file links found. Perhaps page structure changed.')
    process.exit(1)
  }

  logger.progress(`Collecting data files -----------`)

  for (const el of fileLinks) {
    const href = await page.evaluate(el => el.getAttribute('href'), el)
    if (endsWith('.xlsx', href)) {
      const fileUri = `${SOURCE_BASE_URL}${href}`
      logger.progress(`File: ${fileUri}`)
      fileUris.push(fileUri)
    }
  }

  browser.close()

  logger.info('Download files...')

  await downloadFiles(fileUris)

  logger.info(`\nStart: aggregate data from downloaded files.`)

  const results = await parseFiles()

  console.log(results)
}

//  main()
parseFiles()
