import Zip from 'adm-zip'
import { fileTypeFromFile } from 'file-type'

export function unzipBook(bookPath, targetPath) {
    const zip = new Zip(bookPath)
    zip.extractAllTo(targetPath, true)
}

export function checkIfZipped(bookPath) {
  return fileTypeFromFile(bookPath).then(file => file.mime == 'application/epub+zip')
}
