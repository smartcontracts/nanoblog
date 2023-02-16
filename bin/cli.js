#!/usr/bin/env node
const { program } = require('commander')
const { version } = require('../package.json')
const { compile } = require('../index.js')

program
  .name('nanoblog')
  .description('CLI for nanoblog')
  .version(version)

program
  .command('compile')
  .description('compile your nanoblog')
  .option('-i, --input <input>', 'input directory', 'src')
  .option('-o, --output <output>', 'output directory', 'dist')
  .action((options) => {
    compile(options.input, options.output)
  })

program.parse(process.argv)
