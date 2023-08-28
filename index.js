import * as cheerio from 'cheerio';
import * as fs from 'fs';


const file = 'The Almanack of Naval Ravikant A Guide to Wealth and Happiness copy.epub/OEBPS/Eric-Jorgenson_The-Almanack-of-Naval-Ravikant_PRODUCTION_v102-3.xhtml'
const buffer = fs.readFileSync(file);

const $ = cheerio.load(buffer);

const nodes = $('p, li')

nodes.each((_i, node) => {
  node = $(node)
  node.html(bionifyText(node.text()))
})

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

fs.writeFileSync('./test.html', $.html());
