'use strict'
const postcss = require('postcss');


function createNewColor(colors) {
  let name = colors.name
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
  background-color: ${colors.main};
  color: ${colors.inverse};
}

.bg-${name}.light {
  color: ${colors.lightInverse};
  background-color: ${colors.light};
}

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
  for (const color of newColors) {
    let msg = []
    if (!color.name) throw new Error('缺少颜色名')
    if (!color.hasOwnProperty('main')) msg.push('主色(main)')
    if (!color.hasOwnProperty('inverse')) msg.push('反色(inverse)')
    if (!color.hasOwnProperty('light')) msg.push('亮色(light)')
    if (!color.hasOwnProperty('shadow')) msg.push('阴影色(shadow)')
    if (!color.hasOwnProperty('gradual')) msg.push('渐变色(gradual)')
    if (!color.hasOwnProperty('lightInverse')) color.lightInverse = color.main
    if (msg.length > 0) throw new Error(`未定义新颜色(${color.name})的 ${msg.join(',')}`)

    if (!Array.isArray(color.gradual)) color.gradual = [color.main, color.gradual] //只指定了一个颜色值
  }
  return async (root, result) => {
    //先添加新颜色
    if (Object.keys(newColors).length > 0) {
      root.nodes.push(...postcss.parse(comment).nodes)
      for (const color of newColors) {
        root.append(createNewColor(color))
      }
    }
  }
})

