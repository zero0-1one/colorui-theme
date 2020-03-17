module.exports = {
  src: '~/colorui',  // 指定 colorui 中 main.css 所在的目录
  dest: '~/projectDir/css', // 指定生成文件保存的目录

  // src下的main.css 会导出一份到 dest中,如果指定newColors会在文件末尾追加新的颜色规则
  // 默认 'main-new.css'
  fileName: 'main-new.css',
  newColors: [{ // 添加新颜色规则到 main.css
    main: '#0081ff',
    inverse: '#ffffff',
    light: '#cce6ff',
    shadow: 'rgba(0, 102, 204, 0.2);',
    gradual: '#1cbbb4',
    lightInverse: '#0081ff', //可不填, 默认与 main 相同
  }],
  //多主题配置
  themes: [{
    //主题名称 默认:'default'
    name: 'default',
    //导出的主题文件名默认 `theme-${name}.css`
    fileName: 'cutheme-default.css',
    //每个选择器追加的命名空间, 默认为`.theme-${name} ` 注意:通常后面有空格
    namespace: 'theme-default',
    colorMap: {//指定主题中每种元素映射 colorui 中颜
      '${name}': 'blue',
      'disabled': 'grey',
      'newColor': 'bule2',//也可指定 newColors 中的颜色
    },
  },
    //... 更多主题
  ],

  //根据指定模块来导出使用的 css
  lite: {
    fileName: 'main-lite.css', //导出的文件名默认 `main-lite.css`
    modules: [
      'colors',
      // 'color-red', //子模块
    ],
    isRemove: true  //指定的modules 是删除 还是保留模式, 默认删除模式
  },
  //lite版本配置,
  uncss: {
    projectDir: '', //默认未 dest 目录
    fileFilter: ['.html', '.vue'], //需要检查的文件后缀名, 默认 ['.html', '.vue'],
    liteName: '', //默认 main-lite.css
  }
}