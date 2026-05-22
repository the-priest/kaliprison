// Kali Prison build step 2/2 — inline React + the bundle into a self-contained
// offline index.html. Run after build.js, from the build/ directory:
//   node assemble.js
const fs = require('fs');
const path = require('path');

const NM = path.join(__dirname, 'node_modules');
const react = fs.readFileSync(path.join(NM, 'react/umd/react.production.min.js'), 'utf8');
const reactDom = fs.readFileSync(path.join(NM, 'react-dom/umd/react-dom.production.min.js'), 'utf8');
let app = fs.readFileSync(path.join(__dirname, 'app.bundle.js'), 'utf8');

// CRITICAL: a literal </script> inside inlined JS closes the <script> tag early
// in every browser's HTML parser. Break the sequence; JS semantics are unchanged.
app = app.replace(/<\/script>/gi, '<\\/script>');

const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23050805'/%3E%3Ctext x='4' y='24' font-family='monospace' font-size='22' fill='%2300ff41'%3E%3E_%3C/text%3E%3C/svg%3E";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TRAPPED — AXIOM-KALI</title>
<link rel="icon" href="${favicon}">
<style>
  html,body{margin:0;padding:0;height:100%;background:#050805;overflow:hidden;}
  #root{height:100vh;}
  #boot{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
        background:#050805;color:#00ff41;font-family:'Courier New',monospace;font-size:14px;
        letter-spacing:3px;text-shadow:0 0 12px #00ff41;z-index:9999;}
  #boot.gone{display:none;}
  @keyframes pulse{50%{opacity:.35}}
  #boot b{animation:pulse 1s step-end infinite;font-weight:normal;}
</style>
</head>
<body>
<div id="boot">INITIALISING AXIOM-KALI<b>_</b></div>
<div id="root"></div>
<script>${react}</script>
<script>${reactDom}</script>
<script>
try {
${app}
  document.getElementById('boot').classList.add('gone');
} catch (err) {
  document.getElementById('boot').textContent = 'BOOT FAILURE: ' + err.message;
}
</script>
</body>
</html>`;

const OUT = path.join(__dirname, '..', 'index.html');
fs.writeFileSync(OUT, html);
console.log('[assemble] wrote', path.relative(process.cwd(), OUT), '(' + (html.length/1024/1024).toFixed(2) + ' MB)');
