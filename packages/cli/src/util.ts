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
