#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

const log = (message, color = 'white') => console.log(chalk[color](message));

(async () => {
  const execa = (await import('execa')).execa;

  try {
    const packageManager = (await askQuestion('Do you prefer npm or pnpm? (default: npm) ')).trim() || 'npm';
    const useGit = (await askQuestion('Do you want to initialize a Git repository? (y/n) (default: y) ')).trim() || 'y';
    const setupESLint = (await askQuestion('Do you want to set up ESLint? (y/n) (default: y) ')).trim() || 'y';
    const setupPrettier = (await askQuestion('Do you want to set up Prettier? (y/n) (default: y) ')).trim() || 'y';
    const setupAxios = (await askQuestion('Do you want to install axios? (y/n) (default: y) ')).trim() || 'y';
    const setupRouter = (await askQuestion('Do you want to install react-router-dom? (y/n) (default: y) ')).trim() || 'y';
    const setupHusky = (await askQuestion('Do you want to set up husky for Git hooks? (y/n) (default: y) ')).trim() || 'y';
    const setupRedux = (await askQuestion('Do you want to install redux and @reduxjs/toolkit? (y/n) (default: y) ')).trim() || 'y';
    const setupJest = (await askQuestion('Do you want to set up Jest for testing? (y/n) (default: y) ')).trim() || 'y';
    const setupDotenv = (await askQuestion('Do you want to set up dotenv for environment variables? (y/n) (default: y) ')).trim() || 'y';

    const projectName = process.argv[2] || 'my-react-app';
    const projectPath = path.resolve(process.cwd(), projectName);

    log(`Creating Vite project in ${projectPath}...`, 'cyan');
    await execa(packageManager, ['create', 'vite@latest', projectName, '--', '--template', 'react'], { stdio: 'inherit' });

    process.chdir(projectPath);

    log('Installing Tailwind CSS and dependencies...', 'cyan');
    await execa(packageManager, ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], { stdio: 'inherit' });

    log('Initializing Tailwind CSS...', 'cyan');
    await execa('npx', ['tailwindcss', 'init', '-p'], { stdio: 'inherit' });

    log('Configuring Tailwind CSS...', 'cyan');
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    };
    `;
    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    const indexCSS = `@tailwind base;
    @tailwind components;
    @tailwind utilities;
    `;
    await fs.writeFile(path.join(projectPath, 'src', 'index.css'), indexCSS);

    if (useGit === 'y') {
      log('Initializing Git repository...', 'cyan');
      await execa('git', ['init'], { stdio: 'inherit' });

      log('Creating .gitignore...', 'cyan');
      const gitignore = `node_modules
      dist
      .env
      `;
      await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
    }

    if (setupESLint === 'y') {
      log('Setting up ESLint...', 'cyan');
      await execa(packageManager, ['install', '-D', 'eslint'], { stdio: 'inherit' });
      await execa('npx', ['eslint', '--init'], { stdio: 'inherit' });
    }

    if (setupPrettier === 'y') {
      log('Setting up Prettier...', 'cyan');
      await execa(packageManager, ['install', '-D', 'prettier'], { stdio: 'inherit' });
      const prettierConfig = `{
        "semi": false,
        "singleQuote": true
      }
      `;
      await fs.writeFile(path.join(projectPath, '.prettierrc'), prettierConfig);
    }

    if (setupAxios === 'y') {
      log('Installing axios...', 'cyan');
      await execa(packageManager, ['install', 'axios'], { stdio: 'inherit' });
    }

    if (setupRouter === 'y') {
      log('Installing react-router-dom...', 'cyan');
      await execa(packageManager, ['install', 'react-router-dom'], { stdio: 'inherit' });
    }

    if (setupHusky === 'y') {
  log('Setting up husky for Git hooks...', 'cyan');
  await execa(packageManager, ['install', 'husky', '-D'], { stdio: 'inherit' });
  await execa('npx', ['husky', 'init'], { stdio: 'inherit' });

  log('Configuring lint-staged...', 'cyan');
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

  packageJson['lint-staged'] = {
    "*.{js,jsx,ts,tsx}": "eslint --fix"
  };

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
}


    if (setupRedux === 'y') {
      log('Installing redux and @reduxjs/toolkit...', 'cyan');
      await execa(packageManager, ['install', '@reduxjs/toolkit', 'react-redux'], { stdio: 'inherit' });
    }

    if (setupJest === 'y') {
      log('Setting up Jest for testing...', 'cyan');
      await execa(packageManager, ['install', '-D', 'jest', 'babel-jest', '@testing-library/react', '@testing-library/jest-dom'], { stdio: 'inherit' });
      const jestConfig = `{
        "testEnvironment": "jsdom"
      }
      `;
      await fs.writeFile(path.join(projectPath, 'jest.config.js'), jestConfig);
    }

    if (setupDotenv === 'y') {
      log('Setting up dotenv...', 'cyan');
      await execa(packageManager, ['install', 'dotenv'], { stdio: 'inherit' });
      const dotenvConfig = `NODE_ENV=development
      API_URL=http://localhost:3000
      `;
      await fs.writeFile(path.join(projectPath, '.env'), dotenvConfig);
    }

    log('Project setup complete.', 'green');
  } catch (error) {
    log(`Error setting up project: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
})();
