import fs from 'fs-extra';

export const isDir = (p: string) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
};

export const logIcon = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌️',
};

// https://ripperhe.gitee.io/bob/#/plugin/addtion/icon
export const pluginIcon: { [propName: string]: string } = {
  translate: '001',
  ocr: '002',
  tts: '003',
};
