import chalk from 'chalk';
import fs from 'fs-extra';
import { rollup } from 'rollup';
import { initOptByProjectRootPath } from './init-rollup-config';

async function run(packName: string) {
  const projectPath = `${process.cwd()}/packages/${packName}`;
  try {
    const { inputOptions, outCjs, outEsm } = initOptByProjectRootPath(projectPath);
    const bundle = await rollup(inputOptions);
    await bundle.write(outCjs);
    await bundle.write(outEsm);
    console.log(chalk.green(`\n[log]: build complete -> packages/${packName} \n`));
  } catch (err) {
    console.log(chalk.red(`\n[log]: build err -> packages/${packName}`), err, '\n');
  }
}

(async () => {
  const dirs = await fs.readdir('./packages');
  // 获取 yarn run build packageName 中的 packageName
  let packageName = process.argv[2];
  // 编译所有包
  if (packageName === '--all') {
    const tasks = dirs.map((dir) => run(dir));
    await Promise.all(tasks);
    return;
  }
  if (!dirs.includes(packageName)) {
    console.log(chalk.red(`\nError: packages/${packageName} not exist.\n`));
    return;
  }
  // 编译单个包
  await run(packageName);
})();
