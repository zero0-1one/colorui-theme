#!/usr/bin/env node
const package = require('../package.json')
const { program } = require('commander');
const cutheme = require('../lib/cutheme')

program
  .version(package.version)
  .requiredOption('-c, --config <path>', 'set config path')
  .parse(process.argv)




const cfg = require(program.config)

cutheme.doAll(cfg).then((dest) => {
  console.log('导出完成!!   导出目录:', dest)
})