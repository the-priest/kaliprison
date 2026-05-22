// Kali Prison build step 1/2 — transpile JSX to a plain-JS bundle.
// Run from the build/ directory:  node build.js
const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

const SRC = path.join(__dirname, '..', 'src', 'trapped.jsx');
const OUT = path.join(__dirname, 'app.bundle.js');

let src = fs.readFileSync(SRC, 'utf8');
// adapt the React component for a global (UMD) React instead of a module import
src = src.replace(/^import\s+\{[^}]*\}\s+from\s+["']react["'];?\s*\n/, '');
src = src.replace('export default function App()', 'function App()');
const appSrc =
  `const { useState, useRef, useEffect } = React;\n` +
  src +
  `\nconst __root = ReactDOM.createRoot(document.getElementById('root'));\n` +
  `__root.render(React.createElement(App));\n`;

const out = babel.transformSync(appSrc, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  comments: false,
  compact: false,
});
fs.writeFileSync(OUT, out.code);
console.log('[build] wrote', path.relative(process.cwd(), OUT), '(' + out.code.length + ' bytes)');
