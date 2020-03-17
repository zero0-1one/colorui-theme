const { expect } = require('chai')
const postcss = require('postcss')
const postcssFilterRules = require('../lib/postcss-filter-rules')
const postcssCopy = require('../lib/postcss-copy')
const postcssTheme = require('../lib/postcss-colorui-theme')
const postcssLite = require('../lib/postcss-colorui-lite')
const cutheme = require('../lib/cutheme')
const fs = require('fs')
const path = require('path')

for (const dir of ['css', 'css/lib', 'css/bin', 'css/plugin']) {
  if (!fs.existsSync(path.join(__dirname, dir))) fs.mkdirSync(path.join(__dirname, dir))
}

let css1 = `
.a{
  color:red;
}

.abc{
  color:red;
}

.c,
.b{
  color:red;
}

.bd{
  color:red;
}`

let css_retain_b = `
.abc{
  color:red;
}

.b{
  color:red;
}

.bd{
  color:red;
}`

let css_retain_ac = `
.a{
  color:red;
}

.abc{
  color:red;
}

.c{
  color:red;
}`

let css_remove_b = `
.a{
  color:red;
}

.c{
  color:red;
}`

let css_remove_ac = `
.b{
  color:red;
}

.bd{
  color:red;
}`


let css_copy_b2x = `
.axc{
  color:red;
}

.x{
  color:red;
}

.xd{
  color:red;
}`


let css_copy_b2x_c2y = `
.axc,
.aby{
  color:red;
}

.y,
.x{
  color:red;
}

.xd{
  color:red;
}`


let css1_copy_ab2abb = `
.abbc{
  color:red;
}`

let css1_copy_ab2abb_prefix = `
.p .abbc{
  color:red;
}`


describe('postcss-filter-rules', function () {
  it('retain  string', async function () {
    let opts = { filter: 'b', isRemove: false }
    let result = await postcss([postcssFilterRules(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_retain_b)
    expect(result.warnings().length).equal(0)
  })

  it('retain  array', async function () {
    let opts = { filter: ['a', 'c'], isRemove: false }
    let result = await postcss([postcssFilterRules(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_retain_ac)
    expect(result.warnings().length).equal(0)
  })

  it('remove  string', async function () {
    let opts = { filter: 'b', isRemove: true }
    let result = await postcss([postcssFilterRules(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_remove_b)
    expect(result.warnings().length).equal(0)
  })

  it('remove  array', async function () {
    let opts = { filter: ['a', 'c'], isRemove: true }
    let result = await postcss([postcssFilterRules(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_remove_ac)
    expect(result.warnings().length).equal(0)
  })
})


describe('postcss-copy', function () {
  it('copy one', async function () {
    let opts = { copy: ['b', 'x'] }
    let result = await postcss([postcssCopy(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_copy_b2x)
    expect(result.warnings().length).equal(0)
  })

  it('copy many', async function () {
    let opts = { copy: [['b', 'x'], ['c', 'y']] }
    let result = await postcss([postcssCopy(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css_copy_b2x_c2y)
    expect(result.warnings().length).equal(0)
  })


  it('copy with capture', async function () {
    let opts = { copy: ['a(b)', 'a$1$1'] }
    let result = await postcss([postcssCopy(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css1_copy_ab2abb)
    expect(result.warnings().length).equal(0)
  })


  it('copy with prefix', async function () {
    let opts = { copy: ['a(b)', 'a$1$1'], prefix: '.p ' }
    let result = await postcss([postcssCopy(opts)]).process(css1, { from: undefined })
    expect(result.css).equal(css1_copy_ab2abb_prefix)
    expect(result.warnings().length).equal(0)
  })
})


describe('postcss-colorui-theme', function () {
  it('theme', async function () {
    let opts = {
      theme: 'blue',
      colorMap: { 'activated': 'blue' }
    }
    let cuCss = fs.readFileSync(path.join(__dirname, 'main.css'))
    let result = await postcss([postcssTheme(opts)]).process(cuCss, { from: undefined })
    fs.writeFileSync(path.join(__dirname, `css/plugin/cutheme-${opts.theme}.css`), result.css)
    expect(result.warnings().length).equal(0)
  })

  it('theme new color', async function () {
    let opts = {
      theme: 'newColor',
      newColor: { //定义新颜色
        blue2: {
          main: '#0081ff',
          inverse: '#ffffff',
          light: '#cce6ff',
          shadow: 'rgba(0, 102, 204, 0.2);',
          gradual: '#1cbbb4',
        }
      },
      colorMap: { 'activated': 'blue2' }
    }
    let cuCss = fs.readFileSync(path.join(__dirname, 'main.css'))
    let result = await postcss([postcssTheme(opts)]).process(cuCss, { from: undefined })
    fs.writeFileSync(path.join(__dirname, `css/plugin/cutheme-${opts.theme}.css`), result.css)
    expect(result.warnings().length).equal(0)
  })
})



describe('postcss-colorui-lite', function () {
  it('theme', async function () {
    let opts = {
      modules: [
        // 'color',
        'color'
      ],
      isRemove: false  //指定的modules 是删除 还是保留模式, 默认删除模式
    }
    let cuCss = fs.readFileSync(path.join(__dirname, 'main.css'))
    let result = await postcss([postcssLite(opts)]).process(cuCss, { from: undefined })
    fs.writeFileSync(path.join(__dirname, `css/plugin/main-lite.css`), result.css)
    expect(result.warnings().length).equal(0)
  })
})

describe('lib', function () {
  it('dumpTheme', async function () {
    await cutheme.dumpTheme({
      src: path.join(__dirname),  // 指定 colorui 中 main.css 所在的目录
      dest: path.join(__dirname, 'css/lib'), // 指定生成文件保存的目录

      //多主题配置
      themes: {
        name: 'test', //主题名称 默认:'default',
        fileName: '', //导出的文件名默认 `theme-${theme.name}.css`
        namespace: '', //每个选择器追加的命名空间, 默认未 `.theme-${theme.name} ` 注意:通常后面有空格
        newColor: { //定义新颜色
          blue2: {
            main: '#0081ff',
            inverse: '#ffffff',
            light: '#cce6ff',
            shadow: 'rgba(0, 102, 204, 0.2);',
            gradual: '#1cbbb4',
            lightInverse: '#0081ff', //可不填, 默认与 main 相同
          }
        },
        colorMap: {//指定主题中每种元素映射 colorui 中颜
          'activated': 'blue',
          'disabled': 'grey',
          'newColor': 'blue2',
        },
      }
    })
  })

  it('dumpLite', async function () {
    await cutheme.dumpLite({
      src: path.join(__dirname),  // 指定 colorui 中 main.css 所在的目录
      dest: path.join(__dirname, 'css/lib'), // 指定生成文件保存的目录
      lite: {
        modules: ['color-red'],
        isRemove: false,
      }
    })
  })
})


