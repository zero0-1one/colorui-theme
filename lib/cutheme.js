'use strict'
const postcss = require('postcss');
const postcssNewColor = require('./postcss-colorui-new-color')
const postcssTheme = require('./postcss-colorui-theme')
const postcssLite = require('./postcss-colorui-lite')
const postcssCodeSnippets = require('./postcss-code-snippets')
const { rawModules } = require('./colorui-modules')
const tools = require('./tools')
const fs = require('fs')
const path = require('path')

const title = `
/*
  该文件由 colorui-theme 导出, 工具地址:https://github.com/zero0-1one/colorui-theme
*/
`

module.exports = {
  async doAll(options) {
    let { src, dest } = options
    if (src == dest) {
      console.warn('导出目录与导入目录相同,可能会覆盖源文件')
    } else {
      let copyFiles = options.copyFiles || ['icon.css', 'animation.css']
      for (const file of copyFiles) {
        if (!fs.existsSync(path.join(src, file))) continue
        fs.writeFileSync(path.join(dest, file), fs.readFileSync(path.join(src, file)))
      }
    }

    let cuCss = fs.readFileSync(path.join(src, 'main.css'))
    if (options.addHoverRules) cuCss = await this.addHoverRules(cuCss)
    if (options.newColors) cuCss = await this.dumpNewColor(options, cuCss)
    if (options.themes) this.dumpTheme(options, cuCss)
    if (options.lite) this.dumpLite(options, cuCss)
    if (options.codeSnippets) this.dumpCodeSnippets(options, cuCss)

    if (options.fileName !== false) {
      let fileName = options.fileName || 'main-new.css'
      fs.writeFileSync(path.join(dest, fileName), cuCss)
    }


    return path.resolve(options.dest)
    //  if (options.uncss) this.dumpUncss(options, cuCss)
  },

  async addHoverRules(cuCss) {
    let root = postcss.parse(cuCss)
    for (const color in rawModules.color) {
      let colors = tools.getColors(color, root)
      cuCss += tools.createHoverRules(color, colors)
    }
    return cuCss
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

    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))

    let themesCss = ''
    let themesColors = {}
    if (!Array.isArray(themes.themes)) themes.themes = [themes.themes]
    for (const theme of themes.themes) {
      let result = await postcss([postcssTheme(theme)]).process(cuCss, { from: undefined })
      if (theme.fileName !== false) {
        let fileName = theme.fileName || `theme-${theme.name}.css`
        fs.writeFileSync(path.join(dest, fileName), result.css)
      }
      if (theme.jsonFileName !== false) {
        let jsonFileName = theme.jsonFileName || `${theme.name}-colors.json`
        fs.writeFileSync(path.join(dest, jsonFileName), JSON.stringify(result.themeColors, null, 2))
      }

      if (themesCss == '') {
        themesCss += result.css
      } else {
        let index = result.css.indexOf('*/')  //去掉注释
        themesCss += result.css.slice(index + 2)
      }
      themesColors[theme.name || 'default'] = result.themeColors
    }

    if (themes.fileName !== false) {
      let themesFileName = themes.fileName || 'themes.css'
      fs.writeFileSync(path.join(dest, themesFileName), themesCss)
    }
    if (themes.jsonFileName !== false) {
      let jsonFileName = themes.jsonFileName || 'themes.json'
      fs.writeFileSync(path.join(dest, jsonFileName), JSON.stringify(themesColors, null, 2))
    }
    // if (themes.scssFileName !== false) {
    //   let scssFileName = themes.scssFileName || 'themes.scss'
    //   fs.writeFileSync(path.join(dest, jsonFileName), JSON.stringify(themesColors, null, 2))
    // }
  },

  //根据指定模块来导出使用的 css
  async dumpLite(options, cuCss) {
    let { src, dest, lite } = options
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    let result = await postcss([postcssLite(lite)]).process(cuCss, { from: undefined })

    if (lite.fileName !== false) {
      let fileName = lite.fileName || `main-lite.css`
      fs.writeFileSync(path.join(dest, fileName), result.css)
    }
  },

  //使用 uncss 移除未使用的 css
  async dumpUncss(options) {
    let { src, dest, uncss, cuCss } = options
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    throw new Error('尚未实现')
  },


  async dumpCodeSnippets(options, cuCss) {
    let { src, dest, codeSnippets } = options
    cuCss = cuCss || fs.readFileSync(path.join(src, 'main.css'))
    if (!codeSnippets.dir) codeSnippets.dir = dest
    if (codeSnippets.prefix !== false) codeSnippets.prefix = codeSnippets.prefix || 'cu-'
    await postcss([postcssCodeSnippets(codeSnippets)]).process(cuCss, { from: undefined })
  }
}


