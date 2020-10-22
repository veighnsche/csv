import { Fn, pipe, toggleLogging as togglePipeLogging } from '@veighnsche/pipe'

export let logging = false

const logLength = (name: string, subj: any[]) => {
  logging && console.log(name, subj.length)
  return subj
}

const readingTexts = (file: File) => new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = event => resolve(event?.target?.result)
  reader.readAsText(file)
})

// todo: make promisedMap
const map = (fn: Fn) => (subj: any) => subj.map(fn)

const allowMimeTypes = (types: string[]) => (files: File[]): File[] => files.filter(file => types.includes(file.type))

const removeFalsy = (array: any[]): any[] => logLength('after removeFalsy: ', logLength('before removeFalsy: ', array).filter(Boolean))

const hydrateFiles = (csv: FileList, files: File[] = [], i = 0): File[] => csv.item(i)
  ? hydrateFiles(csv, [...files, csv.item(i) as File], i + 1)
  : files

const handlePipe = pipe(
  hydrateFiles,
  removeFalsy,
  allowMimeTypes(['text/csv', 'application/vnd.ms-excel']),
  map(readingTexts)
)

export function handleCsvFiles(files: FileList) {
  return handlePipe(files)
}

export const toggleLogging = (): void => {
  logging = !logging
  togglePipeLogging()
}
