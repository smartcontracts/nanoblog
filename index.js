const fs = require('fs')
const path = require('path')
const { marked } = require('marked')
const glob = require('glob')
const matter = require('gray-matter')
const copyfiles = require('copyfiles')

/**
 * Escapes a string for safe use in HTML attributes.
 * @param {string} str String to escape.
 * @returns {string} Escaped string.
 */
const escapeAttr = (str) => {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Generates an HTML page with the given title and content.
 * @param {string} title Title for the page.
 * @param {string} published Date the page was published.
 * @param {string} content Content for the page.
 * @param {object} meta Optional metadata for the page.
 * @param {string} meta.description Description for the page.
 * @param {string} meta.image URL to an image for the page.
 * @param {string} meta.url URL for the page.
 * @returns {string} HTML page.
 */
const template = (title, published, content, meta = {}) => {
  const desc = meta.description || ''
  const image = meta.image || ''
  const url = meta.url || ''

  let ogTags = ''
  ogTags += `\n    <meta property="og:title" content="${escapeAttr(title)}">`
  ogTags += `\n    <meta property="og:type" content="article">`
  if (desc) ogTags += `\n    <meta name="description" content="${escapeAttr(desc)}">`
  if (desc) ogTags += `\n    <meta property="og:description" content="${escapeAttr(desc)}">`
  if (image) ogTags += `\n    <meta property="og:image" content="${escapeAttr(image)}">`
  if (url) ogTags += `\n    <meta property="og:url" content="${escapeAttr(url)}">`
  ogTags += `\n    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`
  ogTags += `\n    <meta name="twitter:title" content="${escapeAttr(title)}">`
  if (desc) ogTags += `\n    <meta name="twitter:description" content="${escapeAttr(desc)}">`
  if (image) ogTags += `\n    <meta name="twitter:image" content="${escapeAttr(image)}">`

  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
    <title>${title}</title>${ogTags}
  </head>
  <body>
    <div class="nav"><a href="/">Home</a></div>
    <h1>${title}</h1>
    ${published ? `<div><i>Published ${new Date(published).toISOString().split('T')[0]}</i></div>` : ''}
    <div>${content.replace(/\n$/, '')}</div>
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
    const html = template(parsed.data.title, parsed.data.published, marked.parse(parsed.content), {
      description: parsed.data.description,
      image: parsed.data.image,
      url: parsed.data.url,
    })

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
