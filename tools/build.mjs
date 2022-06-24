import { minify } from "terser";
import { name, states, mime } from 'codemirror-nsis/mode';
import EJS from 'ejs';
import fs from 'node:fs/promises';

const template = await fs.readFile('src/template.ejs', 'utf-8');

const { code } = await minify(
    EJS.render(template, {
        name,
        states,
        mime
    })
);

await fs.writeFile('./main.js', code, 'utf-8');