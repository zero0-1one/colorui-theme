'use strict'
module.exports = {
  //将颜色字符串 解析为rgb数组, 支持 'rgb(234, 200, 190)'   '#ffffff'   '#fff' 式样
  colorParse(color) {
    color = color.trim().toLowerCase()
    let data = []
    if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(color)) {
      if (color.length == 4) {
        // !!函数内重名 i, c  在非node 环境 会有问题, 这里使用 var
        for (var i = 1; i < 4; i += 1) {
          var c = color.slice(i, i + 1)
          data.push(parseInt('0x' + c + c))
        }
      } else {
        for (var i = 1; i < 7; i += 2) {
          var c = color.slice(i, i + 2)
          data.push(parseInt('0x' + c))
        }
      }
      return data
    }
    color = color.replace(/\s/g, '')
    let matches = color.match(/^rgb\((\d+)\,(\d+)\,(\d+)\)$/)
    if (matches) {
      for (var i = 1; i < 4; i++) {
        var v = parseInt(matches[i])
        if (v < 0 || v > 255) return
        data.push(v)
      }
      return data
    }
  },

  colorRgb(data) {
    return 'rgb(' + data.join(',') + ')'
  },

  colorHex(data) {
    return '#' + data.map(v => v.toString(16).padStart(2, '0')).join('')
  },

  // r,g,b范围:[0,255]
  // h范围:[0,360]  s,l范围:[0,100]
  rgb2hsl([r, g, b], round = true) {
    r = r / 255
    g = g / 255
    b = b / 255

    let min = Math.min(r, g, b)
    let max = Math.max(r, g, b)

    let h, s, l
    l = (min + max) / 2
    let difference = max - min
    if (max == min) {
      h = 0
      s = 0
    } else {
      s = l > 0.5 ? difference / (2.0 - max - min) : difference / (max + min)
      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0)
          break
        case g:
          h = 2.0 + (b - r) / difference
          break
        case b:
          h = 4.0 + (r - g) / difference
          break
      }
      h = h * 60
    }
    s = s * 100 //转换成百分比的形式
    l = l * 100
    return round ? [h, s, l].map(v => Math.round(v)) : [h, s, l]
  },

  // r,g,b范围:[0,255]
  // h范围:[0,360]  s,v范围:[0,100]
  rgb2hsv([r, g, b], round = true) {
    r = r / 255
    g = g / 255
    b = b / 255
    let h, s, v
    let min = Math.min(r, g, b)
    let max = (v = Math.max(r, g, b))
    let difference = max - min

    if (max == min) {
      h = 0
    } else {
      switch (max) {
        case r:
          h = (g - b) / difference + (g < b ? 6 : 0)
          break
        case g:
          h = 2.0 + (b - r) / difference
          break
        case b:
          h = 4.0 + (r - g) / difference
          break
      }
      h = h * 60
    }
    if (max == 0) {
      s = 0
    } else {
      s = 1 - min / max
    }
    s = s * 100
    v = v * 100
    return round ? [h, s, v].map(v => Math.round(v)) : [h, s, v]
  },

  // r,g,b范围:[0,255]
  // h范围:[0,360]  s,l范围:[0,100]
  hsl2rgb([h, s, l], round = true) {
    h = h / 360
    s = s / 100
    l = l / 100
    let rgb = []

    if (s == 0) {
      rgb = [l * 255, l * 255, l * 255]
    } else {
      let q = l >= 0.5 ? l + s - l * s : l * (1 + s)
      let p = 2 * l - q
      rgb[0] = h + 1 / 3
      rgb[1] = h
      rgb[2] = h - 1 / 3
      for (let i = 0; i < rgb.length; i++) {
        let tc = rgb[i]
        if (tc < 0) {
          tc = tc + 1
        } else if (tc > 1) {
          tc = tc - 1
        }
        switch (true) {
          case tc < 1 / 6:
            tc = p + (q - p) * 6 * tc
            break
          case 1 / 6 <= tc && tc < 0.5:
            tc = q
            break
          case 0.5 <= tc && tc < 2 / 3:
            tc = p + (q - p) * (4 - 6 * tc)
            break
          default:
            tc = p
            break
        }
        rgb[i] = tc * 255
      }
    }
    return round ? rgb.map(v => Math.round(v)) : rgb
  },

  // r,g,b范围:[0,255]
  // h范围:[0,360]  s,v范围:[0,100]
  hsv2rgb([h, s, v], round = true) {
    s = s / 100
    v = v / 100
    let h1 = Math.floor(h / 60) % 6
    let f = h / 60 - h1
    let p = v * (1 - s)
    let q = v * (1 - f * s)
    let t = v * (1 - (1 - f) * s)
    let r, g, b
    switch (h1) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }
    let rgb = [r * 255, g * 255, b * 255]
    return round ? rgb.map(v => Math.round(v)) : rgb
  },

  interColor(color1, color2, ratio) {
    let color = []
    let ratio2 = 1 - ratio
    for (let i = 0; i < 3; i++) {
      color.push(Math.round(color1[i] * ratio + color2[i] * ratio2))
    }
    return color
  },

  difficultyColor(difficulty, forget, vague, know) {
    if (difficulty > 50) {
      forget = this.colorParse(forget)
      vague = this.colorParse(vague)
      return this.colorHex(this.interColor(forget, vague, (difficulty - 50) / 50))
    } else {
      vague = this.colorParse(vague)
      know = this.colorParse(know)
      return this.colorHex(this.interColor(vague, know, difficulty / 50))
    }
  },

  deepenColor(color, rate = 0.8) {
    let isStr = typeof color == 'string'
    let rgb = isStr ? this.colorParse(color) : color
    let hsl = this.rgb2hsl(rgb, false)
    hsl[2] *= rate
    rgb = this.hsl2rgb(hsl)
    return isStr ? this.colorHex(rgb) : rgb
  },

  createHoverRules(name, colors) {
    let colorsHover = colors.hover || this.deepenColor(colors.main)
    let hoverStr = `
    
.bg-${name}.button-hover,
.bg-${name}.hover {
  color: ${colors.inverse};
  background-color: ${colorsHover};
}`
    if (colors['light-hover'] || colors.light) {
      let lightHover = colors['light-hover'] || this.deepenColor(colors.light)
      hoverStr += `
  
.bg-${name}.light.button-hover,
.bg-${name}.light.hover {
  color: ${colors['light-inverse']};
  background-color: ${lightHover};
}`
    }
    return hoverStr
  },

  // root: colorui 的 postcss root
  getColors(name, root) {
    let colorRules = []
    root.walkRules(new RegExp(`-${name}([^a-zA-Z0-9]|$)`), rule => {
      colorRules.push(rule)
    })
    const colorReg = /(rgba?\s*\(\s*\d+\s*(\,\s*[0-9\.]+\s*){2,3}\))|(#[0-9a-f]{3,6})/gi
    let findColors = function (selector, propName, count = 1) {
      let color = null
      for (const rule of colorRules) {
        if (rule.selector.includes(selector)) {
          rule.walkDecls(propName, decl => {
            let rt = decl.value.match(colorReg)
            if (rt && rt.length >= count) {
              rt = rt.map(c => c.replace(/\s+/g, ''))
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
      'inverse': findColors(`.bg-${name}`, 'color'),
      'hover': findColors(`.bg-${name}.hover`, 'background-color'),
      'light': findColors(`.bg-${name}.light`, 'background-color'),
      'light-hover': findColors(`.bg-${name}.light.hover`, 'background-color'),
      'shadow': findColors(`.text-shadow[class*='-${name}']`, 'text-shadow'),
      'gradual': findColors(`.bg-gradual-${name}`, 'background-image', 2),
      'light-inverse': findColors(`.bg-${name}.light`, 'color'),
    }
    return colors
  },
}
