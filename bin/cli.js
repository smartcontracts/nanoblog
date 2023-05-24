#!/usr/bin/env node
const path = require('path')
const { program } = require('commander')
const server = require('live-server')
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

program
  .command('serve')
  .description('serve your nanoblog locally for development')
  .option('-i, --input <input>', 'input directory', 'src')
  .option('-o, --output <output>', 'output directory', 'dist')
  .option('-p, --port <port>', 'port to serve on', '8080')
  .action((options) => {
    server.start({ port: options.port, root: options.output, watch: [options.input] })
    server.watcher.on('change', (e) => {
      if (path.normalize(e).indexOf(path.normalize(options.output)) === -1) {
        compile(options.input, options.output)
      }
    })
  })

program.parse(process.argv)
