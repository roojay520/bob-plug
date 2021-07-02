import ora from 'ora';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import validateProjectName from 'validate-npm-package-name';

import { isDir, logIcon } from './util';
import { copy } from './copy';
import templates from '../templates/config';

const questions = [
  {
    type: 'list',
    name: 'template',
    message: '请选择项目模板(template):',
    choices: templates.map((v: any, i: any) => ({
      key: i,
      name: v.name,
      value: v.dir,
    })),
  },
  {
    type: 'input',
    name: 'author',
    message: '请输入你的名字(author):',
    validate(value: any) {
      return !!value;
    },
  },
  {
    type: 'input',
    name: 'title',
    message: '请输入插件展示标题(title):',
    validate(value: any) {
      return !!value;
    },
  },
  {
    type: 'input',
    name: 'desc',
    message: '请输入项目描述(desc):',
    default: 'bob 插件',
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: '确认创建?',
    default: true,
  },
];

function validateName(name: string) {
  const result = validateProjectName(name);
  if (result.validForNewPackages) return true;
  console.error(chalk.red(`无效的项目名: "${name}"`));
  result.errors?.forEach((err: any) => {
    console.error(chalk.red.dim(`Error: ${err}`));
  });
  result.warnings?.forEach((warn: any) => {
    console.error(chalk.red.dim(`Warning: ${warn}`));
  });
  return false;
}

export async function create(_projectName: string, options: any) {
  let pkgName = _projectName;
  const cwd = options.cwd || process.cwd();
  const inCurrent = pkgName === '.';
  const name = inCurrent ? path.relative('../', cwd) : pkgName;
  const targetDir = path.resolve(cwd, pkgName || '.');

  const isValidName = validateName(name);
  if (!isValidName) return;

  if (isDir(targetDir)) {
    console.log(chalk.red(`${logIcon.error} ${targetDir} 已存在, 请删除或重新命名项目`));
    return;
  }

  // 填写配置信息
  var promptInfo = inquirer.createPromptModule();
  const answers = await promptInfo(questions);
  if (answers.confirm === false) {
    console.log(chalk.red(`${logIcon.error} 取消创建`));
    return;
  }

  console.log('\n');
  // 启动复制流程
  const sourceDir = path.resolve(__dirname, '..', 'templates', answers.template);
  if (!isDir(sourceDir)) {
    console.log(chalk.red(`${logIcon.error} ${answers.template} 模板不存在`));
    return;
  }
  const spinner = ora().start('开始创建...');
  spinner.text = `${chalk.yellow('生成项目文件中...')}`;
  try {
    await fs.emptyDir(targetDir);
    await copy({
      from: sourceDir,
      to: targetDir,
      tplData: {
        desc: answers.desc,
        author: answers.author,
        name: pkgName,
        title: answers.title,
        identifier: `com.bobplugin.${Date.now()}`,
      },
      ignore: ['node_modules'],
    });
  } catch (e) {
    spinner.fail('创建失败...');
    console.error(e);
    return;
  }
  spinner.succeed(chalk.green('创建完成!\n'));
  console.log(chalk.cyan(`$ cd ${pkgName}`));
  console.log(chalk.cyan(`$ yarn install && yarn run dev\n`));
}
