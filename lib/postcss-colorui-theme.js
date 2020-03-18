'use strict'
const postcss = require('postcss');
const postcssCopy = require('./postcss-copy')
const tools = require('./tools')
const title = `
/*
  该文件由 colorui-theme 导出, 工具地址:https://github.com/zero0-1one/colorui-theme
*/
`

module.exports = postcss.plugin('postcss-colorui-theme', opts => {
  let colorMap = opts.colorMap || {}
  let themeName = opts.name || 'default'
  let namespace = opts.namespace || `.theme-${themeName} `
  return async (root, result) => {
    let copyOpts = []
    let allColors = {}
    let colorsByName = {}
    for (const ele in colorMap) {
      let color = colorMap[ele]
      copyOpts.push([`-${color}([^a-zA-Z0-9]|$)`, `-${ele}$1`, 'g'])
      copyOpts.push([`\\.${color}([^a-zA-Z0-9]|$)`, `.${ele}$1`, 'g'])

      let colors = colorsByName[color] || tools.getColors(color, root)
      colorsByName[color] = colors
      for (const type in colors) {
        let key = type == "main" ? ele : `${ele}-${type}`
        allColors[key] = colors[type]
      }
    }
    postcssCopy({ copy: copyOpts, prefix: namespace })(root, result)
    root.prepend(title)
    result.themeColors = allColors
  }
})

