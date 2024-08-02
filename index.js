#!/usr/bin/env node

(async () => {
  const execa = (await import('execa')).execa;
  const path = (await import('path')).default;

  try {
    const projectName = process.argv[2] || 'my-react-app';
    const projectPath = path.resolve(process.cwd(), projectName);

    console.log(`Creating Vite project in ${projectPath}...`);
    await execa('npm', ['create', 'vite@latest', projectName, '--', '--template', 'react'], { stdio: 'inherit' });

    process.chdir(projectPath);

    console.log('Installing Tailwind CSS and dependencies...');
    await execa('npm', ['install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], { stdio: 'inherit' });

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

    console.log('Project setup complete.');
  } catch (error) {
    console.error('Error setting up project:', error);
  }
})();
