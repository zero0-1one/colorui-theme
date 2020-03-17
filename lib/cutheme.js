'use strict'
const postcss = require('postcss');
const postcssNewColor = require('./postcss-colorui-new-color')
const postcssTheme = require('./postcss-colorui-theme')
const postcssLite = require('./postcss-colorui-lite')
const fs = require('fs')
const path = require('path')


module.exports = {
  async doAll(options) {
    let { src, dest } = options
    if (src == dest) console.warn('导出目录与导入目录相同,可能会覆盖源文件')
    let cuCss = fs.readFileSync(path.join(src, 'main.css'))
    if (options.newColors) cuCss = await this.dumpNewColor(options, cuCss)
    if (options.themes) this.dumpTheme(options, cuCss)
    if (options.lite) this.dumpLite(options, cuCss)


    let fileName = options.fileName || 'main-new.css'
    fs.writeFileSync(path.join(dest, fileName), cuCss)

    let copyFiles = options.copyFiles || ['icon.css', 'animation.css']
    for (const file of options.copyFiles) {
      if (!fs.existsSync(path.join(src, file))) continue
      fs.writeFileSync(path.join(dest, file), fs.readFileSync(path.join(src, file)))
    }
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


