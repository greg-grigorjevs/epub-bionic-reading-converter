import * as cheerio from 'cheerio';
import fs from 'fs-extra'
import path from 'path'

export function bionifyBook(bookDirectory) {
  const bionifiedBook = copyBook(bookDirectory) + '/OEBPS'
  const bookFiles = fs.readdirSync(bionifiedBook)
  
  for (let bookFile of bookFiles) {
    bookFile = `${bionifiedBook}/${bookFile}`
    if (path.extname(bookFile) == '.html' || path.extname(bookFile) == '.xhtml') {
      fs.writeFileSync(bookFile, bionifyFile(bookFile))
    }
  }
}

function copyBook(bookDirectory) {
  const bookPath = path.parse(bookDirectory)

  const newPath = path.format({
    root: bookPath.root,
    name: bookPath.name += ' bionified',
    ext: '.epub'
  })
  
  console.log(newPath)
  fs.copySync(bookDirectory, newPath)

  return newPath
}

function bionifyFile(file) {
  const buffer = fs.readFileSync(file);

  const $ = cheerio.load(buffer, {decodeEntities: false, xmlMode: true, recognizeSelfClosing: true});

  const nodes = $('p, li')

  nodes.each((_i, node) => {
    node = $(node)
    node.html(bionifyText(node.text()))
  })

  return $.html()
}


function bionifyText(text) {
  return text.split(' ').map(word => bionifyWord(word)).join(' ')
}

function bionifyWord(word) {
  let wordLength = word.length;
  const chars = [',', '.']

  // check if word contains any of the unnneccesary chars 
  if (chars.some(char => word.includes(char))) {
    wordLength--;
  }

  if (wordLength >= 0 && wordLength <= 3) {
    return `<strong>${word.substr(0, 1)}</strong>` + word.substr(1)
  } else if (wordLength <= 8) {
    return `<strong>${word.substr(0, 2)}</strong>` + word.substr(2)
  } else {
    return `<strong>${word.substr(0, 3)}</strong>` + word.substr(3)
  }

}

/* fs.writeFileSync('./test.html', $.html()); */
