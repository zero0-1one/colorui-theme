'use strict'
const postcss = require('postcss');


module.exports = postcss.plugin('postcss-copy', opts => {
  let copy = opts.copy
  let prefix = opts.prefix || ''
  if (!Array.isArray(copy)) throw new Error('参数 copy 类型错误')
  if (!Array.isArray(copy[0])) copy = [copy]

  copy = copy.map(([search, newSubStr, flags]) => [new RegExp(search, flags), newSubStr])

  return (root, result) => {
    root.each(node => {
      if (node.type != 'rule') return void node.remove()
      let rule = node
      let selectors = []
      rule.selectors.forEach(s => {
        for (const [search, newSubStr] of copy) {
          if (search.test(s)) selectors.push(prefix + s.replace(search, newSubStr))
        }
      })

      if (selectors.length == 0) rule.remove()
      else rule.selector = selectors.join(',\n')

    })
  }
})