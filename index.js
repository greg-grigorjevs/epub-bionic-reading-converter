import * as cheerio from 'cheerio';
import fs from 'fs-extra'
import path from 'path'

function bionifyBookTest(bookName) {
  const testBook = bookName + ' test.epub'
  fs.copySync(`${bookName}.epub`, testBook)

  const bookFile = testBook + '/OEBPS/' + fs.readdirSync(testBook + '/OEBPS')[1]
  console.log(bookFile)

  fs.writeFileSync(bookFile, bionifyFile(bookFile))
}

function bionifyBook(bookDirectory) {
  const bookFiles = fs.readdirSync(bookDirectory)
  for (let bookFile of bookFiles) {
    bookFile = `${bookDirectory}/${bookFile}`
    if (path.extname(bookFile) == '.html' || path.extname(bookFile) == '.xhtml') {
      fs.writeFileSync(bookFile, bionifyFile(bookFile))
    }
  }
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
