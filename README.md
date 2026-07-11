# Palvio

Hello — sync test.

A modern React application built with Vite, TypeScript, and cutting-edge web technologies.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Contributing](#contributing)
- [License](#license)

## 🚀 About

Palvio is a modern web application that leverages the power of React, Vite, and TypeScript to deliver a fast, scalable, and maintainable solution. Built with developer experience in mind, it features hot module replacement, optimized builds, and comprehensive linting rules.

## ✨ Features

- ⚡ **Lightning Fast**: Powered by Vite for instant hot module replacement
- 🎯 **Type Safe**: Full TypeScript support with strict type checking
- 🔧 **Modern Tooling**: ESLint, Prettier, and other development tools
- 📱 **Responsive Design**: Mobile-first approach with modern CSS
- 🚀 **Optimized Build**: Production-ready builds with code splitting
- 🧪 **Testing Ready**: Set up for unit and integration testing

## 🛠️ Tech Stack

- **Frontend Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Linting**: ESLint with TypeScript-aware rules
- **Styling**: CSS3 with modern features
- **Package Manager**: npm/yarn/pnpm

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 16.0 or higher)
- **npm** (version 7.0 or higher) or **yarn** (version 1.22 or higher)
- **Git** (for cloning the repository)

You can check your versions by running:
```bash
node --version
npm --version
git --version
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kuldeepsaini23/palvio.git
   cd palvio
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using pnpm
   pnpm install
   ```

3. **Set up environment variables** (if applicable)
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

## 🚀 Usage

### Development Mode

Start the development server with hot module replacement:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Production Build

Create an optimized production build:

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

### Preview Production Build

Preview the production build locally:

```bash
# Using npm
npm run preview

# Using yarn
yarn preview

# Using pnpm
pnpm preview
```

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `preview` | Preview production build |
| `lint` | Run ESLint |
| `lint:fix` | Run ESLint with auto-fix |
| `type-check` | Run TypeScript compiler check |

## 📁 Project Structure

```
palvio/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── styles/            # CSS styles
│   ├── assets/            # Images, fonts, etc.
│   ├── App.tsx            # Main App component
│   └── main.tsx           # Application entry point
├── .eslintrc.cjs          # ESLint configuration
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node.js
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules and conventions
- Use functional components with hooks
- Implement proper error handling
- Write meaningful commit messages

### ESLint Configuration

The project uses strict ESLint rules with TypeScript support. For production applications, consider enabling type-aware lint rules:

```javascript
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // For stricter rules
    ...tseslint.configs.strictTypeChecked,
    // For stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### React-Specific Linting

For additional React-specific rules, install and configure:

```bash
npm install --save-dev eslint-plugin-react-x eslint-plugin-react-dom
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Commit with descriptive messages
5. Push and create a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Kuldeep Saini**
- GitHub: [@kuldeepsaini23](https://github.com/kuldeepsaini23)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing fast build tool
- TypeScript team for type safety
- All contributors and supporters

---

**Happy Coding! 🚀**
