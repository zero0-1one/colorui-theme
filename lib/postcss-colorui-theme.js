'use strict'
const postcss = require('postcss');
const postcssCopy = require('./postcss-copy')

const title = `
/*
  该文件由 colorui-theme 导出, 工具地址:https://github.com/zero0-1one/colorui-theme
*/
`



function getColors(name, root) {
  let colorRules = []
  root.walkRules(new RegExp(`-${name}([^a-zA-Z0-9]|$)`), rule => {
    colorRules.push(rule)
  })
  const colorReg = /(rgba?\s*\(\s*\d+\s*(\,\s*[0-9\.]+\s*){2,3}\))|(#[0-9a-f]{3,6})/gi
  let findColors = function (selector, propName, count = 1) {
    let color = null
    for (const rule of colorRules) {
      if (rule.selector.includes(selector)) {
        rule.walkDecls(propName, (decl) => {
          let rt = decl.value.match(colorReg)
          if (rt && rt.length >= count) {
            color = count == 1 ? rt[0] : rt.slice(0, count)
          }
          return color === null
        })
        if (color !== null) break
      }
    }
    return color
  }



  let colors = {
    'main': findColors(`.text-${name}`, 'color'),
    'inverse': findColors(`.text-${name}`, 'color'),
    'light': findColors(`.bg-${name}.light`, 'background-color'),
    'shadow': findColors(`.text-shadow[class*='-${name}']`, 'text-shadow'),
    'gradual': findColors(`.bg-gradual-${name}`, 'background-image', 2),
    'light-inverse': findColors(`.bg-${name}.light`, 'color'),
  }
  return colors
}

module.exports = postcss.plugin('postcss-colorui-theme', opts => {
  let colorMap = opts.colorMap || {}
  let themeName = opts.name || 'default'
  let namespace = opts.namespace || `.theme-${themeName} `
  return async (root, result) => {
    let copyOpts = []
    let allColors = {}
    for (const ele in colorMap) {
      let color = colorMap[ele]
      copyOpts.push([`-${color}([^a-zA-Z0-9]|$)`, `-${ele}$1`, 'g'])
      copyOpts.push([`\\.${color}([^a-zA-Z0-9]|$)`, `.${ele}$1`, 'g'])

      let colors = getColors(color, root)
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

