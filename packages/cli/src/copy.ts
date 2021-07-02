import fs from 'fs-extra';
import path from 'path';
import ejs, { Data } from 'ejs';
import { isDir } from './util';

interface Options {
  from: string;
  to: string;
  tplData: Data,
  ignore: string[]
}

export async function copy(options: Options) {
  const { from = '', to = '', tplData, ignore = [] } = options;
  let filesAndDirs = await fs.readdir(from);

  // 区分文件和文件夹
  let files: string[] = [];
  let dirs: string[] = [];

  filesAndDirs.forEach((name) => {
    if (isDir(path.resolve(from, name))) {
      dirs.push(name);
    } else {
      files.push(name);
    }
  });

  // 复制并编译文件
  files.forEach((_fileName) => {
    if (ignore.includes(_fileName)) {
      return;
    }
    let fileName = _fileName;
    let content = fs.readFileSync(path.resolve(from, fileName), 'utf-8');
    if (fileName.slice(-4) === '.ejs') {
      content = ejs.render(content, { tpl: tplData });
      fileName = fileName.replace('.ejs', '');
    }
    fs.writeFileSync(path.resolve(to, fileName), content);
  });

  // 递归复制目录
  dirs.forEach((dirName) => {
    if (ignore.includes(dirName)) {
      return;
    }
    const fromDir = path.resolve(from, dirName);
    const toDir = path.resolve(to, dirName);
    fs.ensureDirSync(toDir);
    copy({ from: fromDir, to: toDir, tplData, ignore });
  });
}
