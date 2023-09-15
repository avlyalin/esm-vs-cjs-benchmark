import fs from 'node:fs';
import path from 'node:path';

let dummyJs = fs.readFileSync('./dummy.js');

function writeToFile(path, rows) {
  for (const row of rows) {
    fs.appendFileSync(path, row);
    fs.appendFileSync(path, '\n');
  }
}

function buildRequireModuleFileGenerator(withExtension) {
  return function createRequireModuleFile(path, importCount, level, withImports = true) {
    const imports = [];

    if (withImports) {
      for (let i = 1; i <= importCount; i++) {
        let moduleSpecifier = `./module${level}_${i}/level${level + 1}`;

        if (withExtension) {
          moduleSpecifier += '/index.js';
        }

        imports.push(`const module${level}_${i} = require('${moduleSpecifier}');`);
      }
    }

    let moduleExport = 'module.exports = 1;';

    if (withImports) {
      moduleExport = `\n
const sum = ${Array(importCount)
        .fill(null)
        .map((module, index) => `module${level}_${index + 1}`, '')
        .join(' + ')};

module.exports = sum;
    `;
    }

    writeToFile(path, [...imports, moduleExport, dummyJs]);
  };
}

function buildRequireIndexFileGenerator(withExtension) {
  return function createRequireIndexFile(path, level, importsCount) {
    const imports = [];

    for (let i = 1; i <= importsCount; i++) {
      let moduleSpecifier = `./module${level}_${i}`;

      if (withExtension) {
        moduleSpecifier += '.js';
      }

      imports.push(`const module${level}_${i} = require('${moduleSpecifier}');`);
    }

    let countSum = `
const sum = ${Array(importsCount)
      .fill(null)
      .map((module, index) => `module${level}_${index + 1}`)
      .join(' + ')};`;

    let consoleSum = '';

    let moduleExport = 'module.exports = sum;';

    writeToFile(path, [...imports, countSum, consoleSum, moduleExport]);
  };
}

function createEsmModuleFile(path, importCount, level, withImports = true) {
  const imports = [];

  if (withImports) {
    for (let i = 1; i <= importCount; i++) {
      imports.push(`import module${level}_${i} from './module${level}_${i}/level${level + 1}/index.js'`);
    }
  }

  let moduleExport = 'export default 1;';

  if (withImports) {
    moduleExport = `\n
const sum = ${Array(importCount)
      .fill(null)
      .map((module, index) => `module${level}_${index + 1}`, '')
      .join(' + ')};

export default sum;
    `;
  }

  writeToFile(path, [...imports, moduleExport, dummyJs]);
}

function buildModuleTreeGenerator(createIndexFile, createModuleFile) {
  return function createModuleTree(directoryPath, levels, imports, currentLevel = 1) {
    // Создаем директорию для текущего уровня
    const dirPath = `${directoryPath}/level${currentLevel}`;
    fs.mkdirSync(dirPath, { recursive: true });

    // создаем индексный файл для данного уровня
    createIndexFile(`${dirPath}/index.js`, currentLevel, imports);

    // Создаем файлы модулей на текущем уровне
    for (let i = 1; i <= imports; i++) {
      const filePath = `${dirPath}/module${currentLevel}_${i}.js`;
      createModuleFile(filePath, imports, currentLevel, currentLevel < levels);
    }

    // Рекурсивно создаем дочерние уровни
    if (currentLevel < levels) {
      for (let i = 1; i <= imports; i++) {
        const childDirectoryPath = `${dirPath}/module${currentLevel}_${i}`;
        createModuleTree(childDirectoryPath, levels, imports, currentLevel + 1);
      }
    }
  };
}

function createEsmIndexFile(path, level, importsCount) {
  const imports = [];

  for (let i = 1; i <= importsCount; i++) {
    imports.push(`import module${level}_${i} from './module${level}_${i}.js'`);
  }

  let countSum = `
const sum = ${Array(importsCount)
    .fill(null)
    .map((module, index) => `module${level}_${index + 1}`)
    .join(' + ')};`;

  // let consoleSum = level === 1 ? 'console.log(sum);' : '';
  let consoleSum = '';

  let moduleExport = 'export default sum;';

  writeToFile(path, [...imports, countSum, consoleSum, moduleExport]);
}

function createEsmModulesTree(path, levelsCount, importsCount) {
  const generator = buildModuleTreeGenerator(createEsmIndexFile, createEsmModuleFile);

  generator(path, levelsCount, importsCount);

  fs.writeFileSync(`${path}/package.json`, '{"type":"module"}');
}

function createCjsWithExtModulesTree(path, levelsCount, importsCount) {
  const indexFileGenerator = buildRequireIndexFileGenerator(true);
  const moduleFileGenerator = buildRequireModuleFileGenerator(true);
  const generator = buildModuleTreeGenerator(indexFileGenerator, moduleFileGenerator);

  generator(path, levelsCount, importsCount);

  fs.writeFileSync(`${path}/package.json`, '{"type":"commonjs"}');
}

function createCjsModulesTree(path, levelsCount, importsCount) {
  const indexFileGenerator = buildRequireIndexFileGenerator(false);
  const moduleFileGenerator = buildRequireModuleFileGenerator(false);
  const generator = buildModuleTreeGenerator(indexFileGenerator, moduleFileGenerator);

  generator(path, levelsCount, importsCount);

  fs.writeFileSync(`${path}/package.json`, '{"type":"commonjs"}');
}

const esmModulesPath = './esm';
const cjsWithExtModulesPath = './cjs-ext';
const cjsModulesPath = './cjs';

const levels = process.env.LEVELS ? Number(process.env.LEVELS) : 3;
const imports = process.env.IMPORTS ? Number(process.env.IMPORTS) : 10;

for (const modulesPath of [esmModulesPath, cjsWithExtModulesPath, cjsModulesPath]) {
  if (fs.existsSync(path.resolve(modulesPath))) {
    fs.rmSync(path.resolve(modulesPath), { recursive: true });
  }
}

createEsmModulesTree(esmModulesPath, levels, imports);

createCjsWithExtModulesTree(cjsWithExtModulesPath, levels, imports);

createCjsModulesTree(cjsModulesPath, levels, imports);
