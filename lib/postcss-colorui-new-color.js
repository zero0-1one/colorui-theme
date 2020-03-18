'use strict'
const postcss = require('postcss');
const tools = require('./tools')



function createNewColor(colors) {
  let name = colors.name
  let hoverStr = tools.createHoverRules(name, colors)

  return `

/*  -- 新颜色:${name} -- */

switch.${name}[checked] .wx-switch-input,
checkbox.${name}[checked] .wx-checkbox-input,
radio.${name}[checked] .wx-radio-input,
switch.${name}.checked .uni-switch-input,
checkbox.${name}.checked .uni-checkbox-input,
radio.${name}.checked .uni-radio-input {
  background-color: ${colors.main} !important;
  border-color: ${colors.main} !important;
  color: ${colors.inverse} !important;
}

.line-${name}::after,
.lines-${name}::after {
  border-color: ${colors.main};
}

.bg-${name} {
  color: ${colors.inverse};
  background-color: ${colors.main};
}

.bg-${name}.light {
  color: ${colors['light-inverse']};
  background-color: ${colors.light};
}
${hoverStr}

.bg-gradual-${name} {
  background-image: linear-gradient(45deg, ${colors.gradual[0]}, ${colors.gradual[1]});
  color: ${colors.inverse};
}

.shadow[class*='-${name}'] {
  box-shadow: 6upx 6upx 8upx ${colors.shadow};
}

.text-shadow[class*='-${name}'] {
  text-shadow: 6upx 6upx 8upx ${colors.shadow};
}

.text-${name},
.line-${name},
.lines-${name} {
  color: ${colors.main};
}
`
}

const comment = `

/* ==================
        新颜色
 ==================== */
`
module.exports = postcss.plugin('postcss-colorui-new-color', newColors => {
  newColors = JSON.parse(JSON.stringify(newColors))
  for (const colors of newColors) {
    let msg = []
    if (!colors.name) throw new Error('缺少颜色名')
    if (!colors.hasOwnProperty('main')) msg.push('主色(main)')
    if (!colors.hasOwnProperty('inverse')) msg.push('反色(inverse)')
    if (!colors.hasOwnProperty('light')) msg.push('亮色(light)')
    if (!colors.hasOwnProperty('shadow')) msg.push('阴影色(shadow)')
    if (!colors.hasOwnProperty('gradual')) msg.push('渐变色(gradual)')
    if (!colors.hasOwnProperty('lightInverse')) colors.lightInverse = colors.main
    if (msg.length > 0) throw new Error(`未定义新颜色(${colors.name})的 ${msg.join(',')}`)

    if (!Array.isArray(colors.gradual)) colors.gradual = [colors.main, colors.gradual] //只指定了一个颜色值

    //转换名字
    colors['light-inverse'] = colors.lightInverse
    colors['light-hover'] = colors.lightHover
  }
  return async (root, result) => {
    if (Object.keys(newColors).length > 0) {
      root.nodes.push(...postcss.parse(comment).nodes)
      for (const color of newColors) {
        root.append(createNewColor(color))
      }
    }
  }
})

