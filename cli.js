#!/usr/bin/env node
import meow from 'meow'
import {bionifyBook} from './index.js'
import fs from 'fs-extra'
import path from 'path'

const cli = meow(`
  Usage
    $ bionifyBook <bookPath>
`, {
    importMeta: import.meta,
  })

bionifyBook(cli.input.at(0))
