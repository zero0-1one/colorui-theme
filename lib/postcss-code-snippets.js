'use strict'
const postcss = require('postcss');
const fs = require('fs')
const path = require('path')

module.exports = postcss.plugin('postcss-code-snippets', opts => {
  let prefix = opts.prefix || ''
  return (root, result) => {
    let snippets = {}
    root.walkRules(rule => {
      let keywords = rule.selector.match(/\.[a-z]+([_\-][a-z]+)*/g)
      if (!keywords) return
      for (let word of keywords) {
        word = word.slice(1)
        if (snippets[word]) continue
        let key = word.startsWith(prefix) ? word : prefix + word
        snippets[word] = {
          body: [word],
          prefix: key,
          scope: "css,vue-html,javascript",
        }
      }
    })
    result.codeSnippets = snippets
    if (opts.fileName !== false) {
      let dir = opts.dir || './'
      let fileName = opts.fileName || `./${prefix}css.code-snippets`
      if (!fileName.endsWith('.code-snippets')) fileName += '.code-snippets'
      fs.writeFileSync(path.join(dir, fileName), JSON.stringify(snippets, null, 2))
    }
  }
})