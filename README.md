# colorui-theme

这个是从`ColorUi`生成不同颜色主题的工具.  
`ColorUi`是款优秀的 css 框架, 在此非常感谢 weilanwl 将它开源.  
关于`ColorUi`更多信息,请前往 <https://github.com/weilanwl/ColorUI> 或 <https://www.color-ui.com>

## 功能

- 将`ColorUi`中不颜色映射成多组主题.
- 轻松的为`ColorUi`增加或替换颜色规则.
- 按模块导出的`main-lite.css`,减少 css 文件大小

## TODO

- 通过`uncss`过滤没用的`css`规则

## 使用方法

```
npm install colorui-theme  -g
或
npm install colorui-theme  --save-dev

cutheme ./config.json
```

## 配置文件

可以为 `.js` 或 `.json` 文件

```js
//config.js
{
  // 指定 colorui 中 main.css 所在的目录
  src:'~/colorui',
  // 指定生成文件保存的目录
  dest:'~/projectDir/css',

  // src下的main.css 会导出一份到 dest中,如果指定 newColors 会在文件末尾追加新的颜色规则
  // 如果 fileName === false 则不会导出该文件, 其他空值默认 'main-new.css'
  fileName:'main-new.css',
  //需要从 src 目录拷贝到 dest 的文件, 默认包含: icon.css, animation.css
  copyFiles:['icon.css', 'animation.css'],
  //是否追加 hover 规则
  addHoverRules:true,
  //指定需要添加的新颜色
  newColors:[{
    name:'newblue', //新颜色的名字
    main: '#0081ff',  //主色
    inverse: '#ffffff',  //反色
    light: '#cce6ff',   //亮色
    shadow: 'rgba(0, 102, 204, 0.2);',//阴影色
    gradual: '#1cbbb4',//渐变色
    lightInverse:'#0081ff', //亮色的反色, 默认与 main 相同
    hover:'',//默认通过计算 main 加深
    lightHover:'',//默认通过计算 light 加深
  }],


  //多主题配置
  themes:{
    // 合并所有 theme 文件到 themesFileName
    // 如果 fileName === false 则不会导出该文件, 其他空值默认 'themes.css'
    fileName:'themes.css',
    //颜色值 如果 fileName === false 则不会导出该文件, 其他空值默认 'colors.json'
    jsonFileName: false,
    themes:[{
      //主题名称 默认:'default'
      name:'default',
      // 如果 fileName === false 则不会导出该文件, 其他空值默认`theme-${name}.css`
      fileName:'cutheme-default.css',
      // 如果 fileName === false 则不会导出该文件, 其他空值默认 `${name}-colors.json`
      jsonFileName: false,
      //每个选择器追加的命名空间, 默认为`.theme-${name} ` 注意:通常后面有空格
      namespace:'.theme-default ',
      //指定主题中每种元素映射 colorui 中颜, 也可指定 newColors 中的颜色
      colorMap:{
        'activated':'blue',
        'disabled':'grey',
        'newColor':'newblue',//newColors 中的颜色
      },
    },
    //... 更多主题
    ],
  },


   //根据指定模块来导出 css
  lite:{
    // 如果 fileName === false 则不会导出该文件, 其他空值默认 `main-lite.css`
    fileName:'main-lite.css',
   //指定的modules 是删除 还是保留模式, 默认删除模式
    isRemove:true
    //自带模块
    modules:[
      'color', //删除 color 模块
      '^color-red', //保留 color-red. 子模块可以使用 ^ 运算符合
      'chat',//删除 chat 模块
    ],
  }
}
```

## 模块

中间有 "`-`" 的为子模块

```
comment
image
switch
switch-switch
switch-checkbox
switch-radio
border
button
tag
avatar
progress
load
list
bar
nav
chat
card
form
modal
swiper
steps
timeline
layout
layout-flex
layout-grid
layout-margin
layout-padding
layout-float
text
color
color-red
color-orange
color-yellow
color-olive
color-green
color-cyan
color-blue
color-purple
color-mauve
color-pink
color-brown
color-grey
color-gray
color-black
color-white
```
