'use strict'
const postcss = require('postcss');
const postcssFilterRules = require('./postcss-filter-rules')
const { subModules, allModules } = require('./colorui-modules')

function getTitle(opts) {
  return `
/*
  该文件由 colorui-theme 导出, 工具地址:https://github.com/zero0-1one/colorui-theme
  ${opts.isRemove ? '已删除' : '保留'}模块:${opts.modules.join(', ')}
*/
`
}


module.exports = postcss.plugin('postcss-colorui-lite', opts => {
  let isRemove = (opts.isRemove === undefined) ? true : !!opts.isRemove
  let all = []
  let subNot = []
  for (let name of opts.modules) {
    if (name.startsWith('^')) {
      name = name.slice(1)
      let group = name.split('-')[0]
      if (!(subModules.hasOwnProperty(group) && subModules[group].includes(name))) {
        throw new Error('只有子模块能使用 ^ 符合')
      }
      subNot.push(name)
    } else {
      if (subModules.hasOwnProperty(name)) {
        all.push(...subModules[name])
      } else {
        all.push(name)
      }
    }
  }

  let allSet = new Set(all)
  for (const sub of subNot) {
    allSet.delete(sub)
  }
  all = [...allSet] //去重

  let filter = []
  let typeFilter = new Set()
  for (const name of all) {
    if (!allModules.hasOwnProperty(name)) {
      console.warn(`不存在模块:${name}`)
      continue
    }
    let m = allModules[name]
    if (m.type == 'rule') {
      if (Array.isArray(m.filter)) filter.push(...m.filter)
      else filter.push(m.filter)
    } else if (m.type == 'type') {
      typeFilter.add(m.filter)
    }
  }

  if (!isRemove) typeFilter.add('rule')

  return async (root, result) => {
    root.each(node => {
      if (isRemove) {
        if (typeFilter.has(node.type)) node.remove()
      } else {
        if (!typeFilter.has(node.type)) node.remove()
      }
    })
    postcssFilterRules({ filter, isRemove })(root, result)
    root.prepend(getTitle(opts))
  }
})

