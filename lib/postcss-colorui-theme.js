'use strict'
const postcss = require('postcss');
const postcssCopy = require('./postcss-copy')

/**
{
  name:'default', //主题名称 会导出 `theme-${theme}.css` 的文件, 默认 'default',
  namespace:'', //每个选择器追加的命名空间, 默认未 `.theme-${name} ` 注意:通常后面有空格
  newColor:{ //定义新颜色
    blue2:{
      main:'${colors.main}',
      inverse:'${colors.main}',
      light:'${colors.main}',
      shadow:'${colors.shadow}', //应该有透明值
      gradual:'${colors.gradual}',
      lightInverse:'${colors.main}', //可不填, 默认与 main 相同
    }
  },
  colorMap:{//指定主题中每种元素映射 colorui 中颜
    '${name}':'blue',
    'disabled':'grey',
    'newColor':blue2,
  }
}
 */

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

