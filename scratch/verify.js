const fs = require('fs');
const http = require('http');

const html = fs.readFileSync('index.html', 'utf8');

const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
const scriptRegex = /<script[^>]+src=["']([^"']+)["']/g;
const linkRegex = /<link[^>]+href=["']([^"']+)["']/g;

const imgs = [];
let match;
while ((match = imgRegex.exec(html)) !== null) imgs.push(match[1]);

const scripts = [];
while ((match = scriptRegex.exec(html)) !== null) scripts.push(match[1]);

const links = [];
while ((match = linkRegex.exec(html)) !== null) links.push(match[1]);

console.log('--- HTML Asset Audit ---');
console.log('Images found:', imgs.length);
console.log('Scripts found:', scripts.length);
console.log('Links found:', links.length);

const all = [...imgs, ...scripts, ...links];
let missing = 0;
all.forEach(p => {
  if (p.startsWith('http') || p.startsWith('//') || p.startsWith('#')) return;
  const decoded = decodeURIComponent(p.split('?')[0].split('#')[0]);
  if (!fs.existsSync(decoded)) {
    console.error('MISSING FILE:', decoded);
    missing++;
  }
});

console.log('Total local assets checked:', all.filter(p => !p.startsWith('http') && !p.startsWith('//') && !p.startsWith('#')).length);
console.log('Missing files count:', missing);

// Check CSS file existence & background images
const css = fs.readFileSync('assets/css/style.css', 'utf8');
const bgRegex = /url\(['"]?([^'"\)]+)['"]?\)/g;
const bgs = [];
while ((match = bgRegex.exec(css)) !== null) {
  const url = match[1];
  if (!url.startsWith('data:') && !url.startsWith('http') && !url.startsWith('//')) {
    bgs.push(url);
  }
}

console.log('\n--- CSS Background Asset Audit ---');
console.log('CSS background urls found:', bgs.length);
let missingBg = 0;
bgs.forEach(b => {
  // paths relative to assets/css/
  const resolved = decodeURIComponent(('assets/css/' + b).replace(/\/\//g, '/'));
  const norm = require('path').normalize(resolved);
  if (!fs.existsSync(norm)) {
    console.error('MISSING CSS BG:', b, '->', norm);
    missingBg++;
  }
});
console.log('Missing CSS background images count:', missingBg);
