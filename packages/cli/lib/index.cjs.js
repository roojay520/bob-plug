'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ora = require('ora');
var chalk = require('chalk');
var fs = require('fs-extra');
var inquirer = require('inquirer');
var validateProjectName = require('validate-npm-package-name');
var ejs = require('ejs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
var validateProjectName__default = /*#__PURE__*/_interopDefaultLegacy(validateProjectName);
var ejs__default = /*#__PURE__*/_interopDefaultLegacy(ejs);

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}
// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}
// posix version
function isAbsolute(path) {
  return path.charAt(0) === '/';
}

// posix version
function join() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join,
  isAbsolute: isAbsolute,
  normalize: normalize,
  resolve: resolve
};
function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

const isDir = (p) => {
  try {
    return fs__default['default'].statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
};
const logIcon = {
  info: "\u2139\uFE0F",
  success: "\u2705",
  warning: "\u26A0\uFE0F",
  error: "\u274C\uFE0F"
};

var __async$1 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function copy(options) {
  return __async$1(this, null, function* () {
    const { from = "", to = "", tplData, ignore = [] } = options;
    let filesAndDirs = yield fs__default['default'].readdir(from);
    let files = [];
    let dirs = [];
    filesAndDirs.forEach((name) => {
      if (isDir(path.resolve(from, name))) {
        dirs.push(name);
      } else {
        files.push(name);
      }
    });
    files.forEach((_fileName) => {
      if (ignore.includes(_fileName)) {
        return;
      }
      let fileName = _fileName;
      let content = fs__default['default'].readFileSync(path.resolve(from, fileName), "utf-8");
      if (fileName.slice(-4) === ".ejs") {
        content = ejs__default['default'].render(content, { tpl: tplData });
        fileName = fileName.replace(".ejs", "");
      }
      fs__default['default'].writeFileSync(path.resolve(to, fileName), content);
    });
    dirs.forEach((dirName) => {
      if (ignore.includes(dirName)) {
        return;
      }
      const fromDir = path.resolve(from, dirName);
      const toDir = path.resolve(to, dirName);
      fs__default['default'].ensureDirSync(toDir);
      copy({ from: fromDir, to: toDir, tplData, ignore });
    });
  });
}

var templates = [
  {
    name: "bobplugin-tpl-translate - \u6587\u672C\u7FFB\u8BD1\u63D2\u4EF6\u6A21\u677F",
    category: "translate",
    dir: "bobplugin-tpl-translate"
  },
  {
    name: "bobplugin-tpl-ocr - \u6587\u672C\u8BC6\u522B\u63D2\u4EF6\u6A21\u677F",
    category: "ocr",
    dir: "bobplugin-tpl-translate"
  },
  {
    name: "bobplugin-tpl-tts - \u8BED\u97F3\u5408\u6210\u63D2\u4EF6\u6A21\u677F",
    category: "tts",
    dir: "bobplugin-tpl-translate"
  }
];

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const questions = [
  {
    type: "list",
    name: "template",
    message: "\u8BF7\u9009\u62E9\u9879\u76EE\u6A21\u677F(template):",
    choices: templates.map((v, i) => ({
      key: i,
      name: v.name,
      value: i
    })),
    default: 0
  },
  {
    type: "input",
    name: "author",
    message: "\u8BF7\u8F93\u5165\u4F60\u7684\u540D\u5B57(author):",
    validate(value) {
      return !!value;
    }
  },
  {
    type: "input",
    name: "title",
    message: "\u8BF7\u8F93\u5165\u63D2\u4EF6\u5C55\u793A\u6807\u9898(title):",
    validate(value) {
      return !!value;
    }
  },
  {
    type: "input",
    name: "desc",
    message: "\u8BF7\u8F93\u5165\u9879\u76EE\u63CF\u8FF0(desc):",
    default: "bob \u63D2\u4EF6",
    validate(value) {
      return !!value;
    }
  },
  {
    type: "confirm",
    name: "confirm",
    message: "\u786E\u8BA4\u521B\u5EFA?",
    default: true
  }
];
function validateName(name) {
  var _a, _b;
  const result = validateProjectName__default['default'](name);
  if (result.validForNewPackages)
    return true;
  console.error(chalk__default['default'].red(`\u65E0\u6548\u7684\u9879\u76EE\u540D: "${name}"`));
  (_a = result.errors) == null ? void 0 : _a.forEach((err) => {
    console.error(chalk__default['default'].red.dim(`Error: ${err}`));
  });
  (_b = result.warnings) == null ? void 0 : _b.forEach((warn) => {
    console.error(chalk__default['default'].red.dim(`Warning: ${warn}`));
  });
  return false;
}
function create(_projectName, options) {
  return __async(this, null, function* () {
    let pkgName = _projectName;
    const cwd = options.cwd || process.cwd();
    const inCurrent = pkgName === ".";
    const name = inCurrent ? path.relative("../", cwd) : pkgName;
    const targetDir = path.resolve(cwd, pkgName || ".");
    const isValidName = validateName(name);
    if (!isValidName)
      return;
    if (isDir(targetDir)) {
      console.log(chalk__default['default'].red(`${logIcon.error} ${targetDir} \u5DF2\u5B58\u5728, \u8BF7\u5220\u9664\u6216\u91CD\u65B0\u547D\u540D\u9879\u76EE`));
      return;
    }
    var promptInfo = inquirer__default['default'].createPromptModule();
    const answers = yield promptInfo(questions);
    if (answers.confirm === false) {
      console.log(chalk__default['default'].red(`${logIcon.error} \u53D6\u6D88\u521B\u5EFA`));
      return;
    }
    console.log("\n");
    const tpl = templates[answers.template];
    const sourceDir = path.resolve(__dirname, "..", "templates", `${tpl.dir}`);
    if (!isDir(sourceDir)) {
      console.log(chalk__default['default'].red(`${logIcon.error} ${tpl.dir} \u6A21\u677F\u4E0D\u5B58\u5728`));
      return;
    }
    const spinner = ora__default['default']().start("\u5F00\u59CB\u521B\u5EFA...");
    spinner.text = `${chalk__default['default'].yellow("\u751F\u6210\u9879\u76EE\u6587\u4EF6\u4E2D...")}`;
    try {
      yield fs__default['default'].emptyDir(targetDir);
      yield copy({
        from: sourceDir,
        to: targetDir,
        tplData: {
          desc: answers.desc,
          author: answers.author,
          name: pkgName,
          title: answers.title,
          identifier: `com.roojay.bobplug-${Date.now()}`,
          category: tpl.category
        },
        ignore: ["node_modules"]
      });
    } catch (e) {
      spinner.fail("\u521B\u5EFA\u5931\u8D25...");
      console.error(e);
      return;
    }
    spinner.succeed(chalk__default['default'].green("\u521B\u5EFA\u5B8C\u6210!\n"));
    console.log(chalk__default['default'].cyan(`$ cd ${pkgName}`));
    console.log(chalk__default['default'].cyan(`$ yarn install && yarn run dev
`));
  });
}

exports.create = create;
