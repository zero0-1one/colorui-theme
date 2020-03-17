'use strict'


function nameModule(names) {
  if (!Array.isArray(names)) names = [names]
  let filter = []
  for (const name of names) {
    filter.push(`-${name}([^a-zA-Z0-9]|$)`)
    filter.push(`\\.${name}([^a-zA-Z0-9]|$)`)
  }
  return { type: 'rule', filter }
}

function classModule(names, prefix = true) {
  if (!Array.isArray(names)) names = [names]
  return {
    type: 'rule', filter: names.map(name => {
      if (prefix) name = 'cu-' + name
      if (name.endsWith('-')) {
        return `\\.${name}[a-zA-Z]`
      } else {
        return `\\.${name}([^a-zA-Z0-9]|$)`
      }
    })
  }
}

function tagModule(names) {
  if (!Array.isArray(names)) names = [names]
  return { type: 'rule', filter: names.map(name => `(^|[^a-zA-Z0-9])${name}([^a-zA-Z0-9]|$)`) }
}

const cuModules = {
  comment: { type: 'type', filter: 'comment' },
  image: tagModule('image'),
  switch: {
    switch: tagModule('switch'),
    checkbox: tagModule('checkbox'),
    radio: tagModule('radio'),
  },
  border: classModule(['solid', 'dashed']),
  button: classModule('btn'),
  tag: classModule('tag'),
  avatar: classModule('avatar'),
  progress: classModule('progress'),
  load: classModule('load'),
  list: classModule(['list', 'item']),
  bar: classModule('bar'),
  nav: classModule('nav'),
  chat: classModule('chat'),
  card: classModule('card'),
  form: classModule('form-group'),
  modal: classModule('modal'),
  swiper: nameModule('swiper'),
  steps: classModule('steps'),
  timeline: classModule('timeline'),
  layout: {
    flex: classModule(['flex', 'basis-', 'align-', 'justify-', 'self-'], false),
    grid: classModule('grid', false),
    margin: classModule('margin', false),
    padding: classModule('padding', false),
    float: classModule(['cf', 'fl', 'fr'], false),
  },
  text: classModule(['text'], false),
  color: {
    red: nameModule('red'),
    orange: nameModule('orange'),
    yellow: nameModule('yellow'),
    olive: nameModule('olive'),
    green: nameModule('green'),
    cyan: nameModule('cyan'),
    blue: nameModule('blue'),
    purple: nameModule('purple'),
    mauve: nameModule('mauve'),
    pink: nameModule('pink'),
    brown: nameModule('brown'),
    grey: nameModule('grey'),
    gray: nameModule('gray'),
    black: nameModule('black'),
    white: nameModule('white')
  }
}


let subModules = {}
let allModules = {}
let moduleList = []
for (const m in cuModules) {
  moduleList.push(m)
  if (cuModules[m].hasOwnProperty('type') && cuModules[m].hasOwnProperty('filter')) {
    allModules[m] = cuModules[m]
  } else {//包含子模块
    subModules[m] = []
    for (const sub in cuModules[m]) {
      let subName = m + '-' + sub
      moduleList.push(subName)
      subModules[m].push(subName)
      allModules[subName] = cuModules[m][sub]
    }
  }
}


console.log(moduleList.join('\n'))
module.exports = { subModules, allModules, moduleList }

