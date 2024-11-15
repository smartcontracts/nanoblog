const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const glob = require('glob')
const matter = require('gray-matter')
const copyfiles = require('copyfiles')

/**
 * Generates an HTML page with the given title and content.
 * @param {string} title Title for the page.
 * @param {string} published Date the page was published.
 * @param {string} content Content for the page.
 * @returns {string} HTML page.
 */
const template = (title, published, content) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
    <title>${title}</title>
  </head>
  <body>
    <div class="nav"><a href="/">Home</a></div>
    <h1>${title}</h1>
    <div><i>${published}</i></div>
    <div>
${content.replace(/\n$/, '')}
    </div>
  </body>
</html>`
}

const compile = async (inpdir, outdir) => {
  // Create the output directory.
  fs.mkdirSync(outdir, { recursive: true })

  // Convert markdown to HTML.
  for (const input of glob.sync(`${inpdir}/**/*.md`)) {
    // Parse the input and turn it into HTML.
    const source = fs.readFileSync(input, 'utf8')
    const parsed = matter(source)
    const html = template(parsed.data.title, parsed.data.published, marked.parse(parsed.content))

    // Write the output file.
    const output = input.replace(/\.md$/, '.html').replace(new RegExp(`^${inpdir}`), outdir)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.writeFileSync(output, html)
  }

  // Copy remaining files.
  await new Promise((resolve) => {
    copyfiles([`${inpdir}/**/*`, outdir], { up: 1, exclude: `${inpdir}/**/*.md` }, (resolve))
  })
}

module.exports = { compile }
