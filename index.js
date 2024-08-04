#!/usr/bin/env node

import readline from  "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
  const execa = (await import('execa')).execa;
  const path = (await import('path')).default;

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

    console.log(`Creating Vite project in ${projectPath}...`);
    await execa(packageManager, ['create', 'vite@latest', projectName, '--', '--template', 'react'], { stdio: 'inherit' });

    process.chdir(projectPath);

    console.log('Installing Tailwind CSS and dependencies...');
    await execa(packageManager, ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], { stdio: 'inherit' });

    console.log('Initializing Tailwind CSS...');
    await execa('npx', ['tailwindcss', 'init', '-p'], { stdio: 'inherit' });

    console.log('Configuring Tailwind CSS...');
    const fs = (await import('fs')).promises;
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
      console.log('Initializing Git repository...');
      await execa('git', ['init'], { stdio: 'inherit' });

      console.log('Creating .gitignore...');
      const gitignore = `node_modules
dist
.env
`;
      await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
    }

    if (setupESLint === 'y') {
      console.log('Setting up ESLint...');
      await execa(packageManager, ['install', '-D', 'eslint'], { stdio: 'inherit' });
      await execa('npx', ['eslint', '--init'], { stdio: 'inherit' });
    }

    if (setupPrettier === 'y') {
      console.log('Setting up Prettier...');
      await execa(packageManager, ['install', '-D', 'prettier'], { stdio: 'inherit' });
      const prettierConfig = `{
  "semi": false,
  "singleQuote": true
}
`;
      await fs.writeFile(path.join(projectPath, '.prettierrc'), prettierConfig);
    }

    if (setupAxios === 'y') {
      console.log('Installing axios...');
      await execa(packageManager, ['install', 'axios'], { stdio: 'inherit' });
    }

    if (setupRouter === 'y') {
      console.log('Installing react-router-dom...');
      await execa(packageManager, ['install', 'react-router-dom'], { stdio: 'inherit' });
    }

    if (setupHusky === 'y') {
      console.log('Setting up husky for Git hooks...');
      await execa(packageManager, ['install', 'husky', '-D'], { stdio: 'inherit' });
      await execa('npx', ['husky', 'init'], { stdio: 'inherit' });
      const lintStagedConfig = `{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": "eslint --fix"
  }
}
`;
      await fs.writeFile(path.join(projectPath, 'package.json'), lintStagedConfig, { flag: 'a' });
    }

    if (setupRedux === 'y') {
      console.log('Installing redux and @reduxjs/toolkit...');
      await execa(packageManager, ['install', '@reduxjs/toolkit', 'react-redux'], { stdio: 'inherit' });
    }

    if (setupJest === 'y') {
      console.log('Setting up Jest for testing...');
      await execa(packageManager, ['install', '-D', 'jest', 'babel-jest', '@testing-library/react', '@testing-library/jest-dom'], { stdio: 'inherit' });
      const jestConfig = `{
  "testEnvironment": "jsdom"
}
`;
      await fs.writeFile(path.join(projectPath, 'jest.config.js'), jestConfig);
    }

    if (setupDotenv === 'y') {
      console.log('Setting up dotenv...');
      await execa(packageManager, ['install', 'dotenv'], { stdio: 'inherit' });
      const dotenvConfig = `NODE_ENV=development
API_URL=http://localhost:3000
`;
      await fs.writeFile(path.join(projectPath, '.env'), dotenvConfig);
    }

    console.log('Project setup complete.');
  } catch (error) {
    console.error('Error setting up project:', error);
  } finally {
    rl.close();
  }
})();
