import * as cheerio from 'cheerio';
import fs from 'fs-extra'
import path from 'path'
import * as zipHandler from './zipHandler.js'

export async function bionifyBook(bookDirectory) {
  const bionifiedBook = await duplicateBook(bookDirectory)

  const bookFiles = getFiles(bionifiedBook)

  for (let bookFile of bookFiles) {
    if (path.extname(bookFile) == '.html' || path.extname(bookFile) == '.xhtml') {
      fs.writeFileSync(bookFile, bionifyFile(bookFile))
    }
  }
}



// get all files from the directory recursively
function getFiles(dir, files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(name, files);
    } else {
      // If it is a file, push the full path to the files array
      files.push(name);
    }
  }
  return files;
}

async function duplicateBook(bookDirectory) {
  const bookPath = path.parse(bookDirectory)

  const newPath = path.format({
    root: bookPath.root,
    name: bookPath.name += ' bionified',
    ext: '.epub'
  })

  if (await zipHandler.checkIfZipped(bookDirectory)) {
    zipHandler.unzipBook(bookDirectory, newPath)
  } else {
    fs.copySync(bookDirectory, newPath)
  }

  return newPath
}

function bionifyFile(file) {
  const buffer = fs.readFileSync(file);

  const $ = cheerio.load(buffer, { decodeEntities: false, xmlMode: true, recognizeSelfClosing: true });

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
