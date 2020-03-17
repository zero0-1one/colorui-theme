'use strict'
const postcss = require('postcss');
const postcssNewColor = require('./postcss-colorui-new-color')
const postcssTheme = require('./postcss-colorui-theme')
const postcssLite = require('./postcss-colorui-lite')
const fs = require('fs')
const path = require('path')


/**
{
  src:'~/colorui',  // 指定 colorui 中 main.css 所在的目录
  dest:'~/projectDir/css', // 指定生成文件保存的目录
  fileName:'',//默认 'main-new.css'
  newColors:[{
      main: '#0081ff',
      inverse: '#ffffff',
      light: '#cce6ff',
      shadow: 'rgba(0, 102, 204, 0.2);',
      gradual: '#1cbbb4',
      lightInverse:'#0081ff', //可不填, 默认与 main 相同
    }]
  },
  //多主题配置
  themes:[{
    name:'default', //主题名称 默认:'default',
    fileName:'cutheme-${theme.name}.css', //导出的文件名默认 `theme-${theme.name}.css`
    namespace:'', //每个选择器追加的命名空间, 默认未 `.theme-${theme.name} ` 注意:通常后面有空格
   
    colorMap:{//指定主题中每种元素映射 colorui 中颜
      '${name}':'blue',
      'disabled':'grey',
      'newColor':blue2,
    },
  },
  ...
  ],

   //根据指定模块来导出使用的 css
  lite:{
    fileName:'main-lite.css', //导出的文件名默认 `main-lite.css`
    modules:[
      'colors',  
      // 'color-red', //子模块
    ],
    isRemove:true  //指定的modules 是删除 还是保留模式, 默认删除模式
  },
  //lite版本配置,
  uncss:{
    projectDir:'', //默认未 dest 目录
    fileFilter:['.html', '.vue'], //需要检查的文件后缀名, 默认 ['.html', '.vue'],
    liteName:'', //默认 main-lite.css
  }
}
 */
module.exports = {
  async doAll(options) {
    if (options.src == options.desc) console.warn('导出目录与导入目录相同,可能会覆盖源文件')
    let cuCss = fs.readFileSync(path.join(options.src, 'main.css'))
    if (options.newColors) cuCss = await this.dumpNewColor(options, cuCss)
    if (options.themes) this.dumpTheme(options, cuCss)
    if (options.lite) this.dumpLite(options, cuCss)


    let fileName = options.fileName || 'main-new.css'
    let dest = options.dest
    fs.writeFileSync(path.join(dest, fileName), cuCss)

    return path.resolve(options.dest)
    //  if (options.uncss) this.dumpUncss(options, cuCss)
  },

  async dumpNewColor(options, cuCss) {
    let { src, newColors } = options
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    let result = await postcss([postcssNewColor(newColors)]).process(cuCss, { from: undefined })
    return result.css
  },

  //根据配置导出主题 css
  async dumpTheme(options, cuCss) {
    let { src, dest, themes } = options
    if (!Array.isArray(themes)) themes = [themes]

    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    for (const theme of themes) {
      let fileName = theme.fileName || `theme-${theme.name}.css`
      let result = await postcss([postcssTheme(theme)]).process(cuCss, { from: undefined })
      fs.writeFileSync(path.join(dest, fileName), result.css)
    }
  },

  //根据指定模块来导出使用的 css
  async dumpLite(options, cuCss) {
    let { src, dest, lite } = options
    let fileName = lite.fileName || `main-lite.css`
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    let result = await postcss([postcssLite(lite)]).process(cuCss, { from: undefined })
    fs.writeFileSync(path.join(dest, fileName), result.css)
  },

  //使用 uncss 移除未使用的 css
  async dumpUncss(options) {
    let { src, dest, uncss } = options
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    throw new Error('尚未实现')
  }
}


