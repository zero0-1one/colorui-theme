'use strict'
const postcss = require('postcss');
const postcssCopy = require('./postcss-copy')

const title = `
/*
  该文件由 colorui-theme 导出, 工具地址:https://github.com/zero0-1one/colorui-theme
*/
`

module.exports = postcss.plugin('postcss-colorui-theme', opts => {
  let colorMap = opts.colorMap || {}
  let themeName = opts.hasOwnProperty('theme') ? opts.name : 'default'
  let namespace = opts.hasOwnProperty('namespace') ? opts.namespace : `.theme-${themeName} `
  return async (root, result) => {
    let copyOpts = []
    for (const ele in colorMap) {
      let color = colorMap[ele]
      copyOpts.push([`-${color}([^a-zA-Z0-9]|$)`, `-${ele}$1`, 'g'])
      copyOpts.push([`\\.${color}([^a-zA-Z0-9]|$)`, `.${ele}$1`, 'g'])
    }
    postcssCopy({ copy: copyOpts, prefix: namespace })(root, result)
    root.prepend(title)
  }
})

