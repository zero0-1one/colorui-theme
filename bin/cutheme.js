#!/usr/bin/env node
const package = require('../package.json')
const { program } = require('commander');
const cutheme = require('../lib/cutheme')
const path = require('path')

program
  .version(package.version)
  .requiredOption('-c, --config <path>', 'set config path')
  .parse(process.argv)



let cfgPath = path.isAbsolute(program.config) ? program.config : path.join(process.cwd(), program.config)
const cfg = require(cfgPath)

cutheme.doAll(cfg).then((dest) => {
  console.log('导出完成!!   导出目录:', dest)
})