// Kali Prison build step 2/2 — inline React + bundle into self-contained index.html
// Run after build.js, from the build/ directory:  node assemble.js
const fs = require('fs');
const path = require('path');

const NM = path.join(__dirname, 'node_modules');
const react = fs.readFileSync(path.join(NM, 'react/umd/react.production.min.js'), 'utf8');
const reactDom = fs.readFileSync(path.join(NM, 'react-dom/umd/react-dom.production.min.js'), 'utf8');
let app = fs.readFileSync(path.join(__dirname, 'app.bundle.js'), 'utf8');

// Break </script> to avoid early tag close
app = app.replace(/<\/script>/gi, '<\\/script>');

const favicon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23020402'/%3E%3Ctext x='3' y='24' font-family='monospace' font-size='22' fill='%2300ff41'%3E%3E_%3C/text%3E%3C/svg%3E";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<title>KALI PRISON — AXIOM-KALI</title>
<meta name="description" content="A browser game that teaches Linux and cybersecurity by trapping you inside a machine. Find the way out.">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  /* fallback if offline — Courier New looks good too */
  html,body{margin:0;padding:0;height:100%;background:#020402;overflow:hidden;}
  #root{height:100vh;}
  #boot{
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:#020402;color:#00ff41;
    font-family:'JetBrains Mono','Courier New',monospace;font-size:13px;
    letter-spacing:4px;text-shadow:0 0 12px #00ff41;z-index:9999;
    flex-direction:column;gap:16px;
  }
  #boot.gone{display:none;}
  #boot-bar{
    width:200px;height:2px;background:#0d2a0d;position:relative;overflow:hidden;
  }
  #boot-fill{
    position:absolute;top:0;left:0;height:100%;background:#00ff41;
    box-shadow:0 0 8px #00ff41;
    animation:bootfill 1.2s ease forwards;
  }
  @keyframes bootfill{from{width:0}to{width:100%}}
  @keyframes pulse{50%{opacity:.3}}
  #boot b{animation:pulse 0.9s step-end infinite;font-weight:normal;}
</style>
</head>
<body>
<div id="boot">
  <div>INITIALISING AXIOM-KALI<b>_</b></div>
  <div id="boot-bar"><div id="boot-fill"></div></div>
</div>
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
