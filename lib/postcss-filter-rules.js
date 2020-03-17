'use strict'
const postcss = require('postcss');



module.exports = postcss.plugin('postcss-filter-rules', opts => {
  let filters = opts.filter
  let isRemove = !!opts.isRemove
  if (!Array.isArray(filters)) filters = [filters]

  filters = filters.map(filter => {
    if (filter instanceof RegExp) return filter
    if (typeof filter == 'string') {
      return new RegExp(filter)
    } else {
      throw new Error('filter 类型错误, 只支持 regExp格式, 或 regExp的字符串表达')
    }
  })

  return (root, result) => {
    root.walkRules(rule => {
      let selectors = []
      rule.selectors.forEach(s => {
        for (const f of filters) {
          if (f.test(s)) {
            if (!isRemove) selectors.push(s)
            return
          }
        }
        //都不满足
        if (isRemove) selectors.push(s)
      })
      if (selectors.length == 0) rule.remove()
      else rule.selector = selectors.join(',\n')
    })
  }
})
