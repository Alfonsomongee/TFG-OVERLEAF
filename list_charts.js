const fs = require('fs');
const esios = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\docs\\16-graficas-esios.mdx', 'utf8');
const entsoe = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\docs\\17-graficas-entsoe.mdx', 'utf8');

const list = [];
list.push('--- ESIOS CHARTS ---');
const regex = /label="(.*?)"/g;
let match;
while ((match = regex.exec(esios)) !== null) {
    list.push(match[1]);
}

list.push('\n--- ENTSO-E CHARTS ---');
while ((match = regex.exec(entsoe)) !== null) {
    list.push(match[1]);
}

fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\GALERIAFORENSE\\lista_todas_graficas.txt', list.join('\n'));
console.log(list.join('\n'));
