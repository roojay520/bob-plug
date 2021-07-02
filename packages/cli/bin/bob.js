#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { create } = require('../lib/index.cjs.js');

program.version(require('../package').version).usage('<command> [options]');

program
  .command('create <name>')
  .description('创建新插件')
  .option('-t, --type [pluginType]', '插件类型')
  .action((name, options) => create(name, options));

program.on('--help', () => {
  console.log(`\nRun ${chalk.cyan(`bob <command> --help`)} 获取更多使用帮助\n`);
});

program.parse(process.argv);
