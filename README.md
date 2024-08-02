
# Vite-Tailwind-React-Cli

A simple CLI tool to set up a new React project with Vite and Tailwind CSS in one step.

## Features

- Initializes a new React project with Vite.
- Configures Tailwind CSS with PostCSS and Autoprefixer.
- Automatically sets up Tailwind CSS configuration files.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)

## Installation

First, install the CLI tool globally:

```bash
npm install -g vite-tailwind-react-Cli
```

## Usage

To create a new React project with Vite and Tailwind CSS, run:

```bash
create-vtr my-new-project
```

Replace `my-new-project` with your desired project name.

## Project Structure

The generated project will have the following structure:

```
my-new-project/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Configuration

Tailwind CSS is configured to scan the following files for class names:

```javascript
/** @type {import('tailwindcss').Config} */
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
```

The default `src/index.css` includes the necessary Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Execa](https://github.com/sindresorhus/execa)

# vite-react-tailwind-cli
# vite-react-tailwind-cli
