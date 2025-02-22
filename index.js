const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

(async () => {
    try {
        const [html, langs] = await Promise.all([
            fs.readFile(path.join(__dirname, 'convert', 'index.html'), 'utf8'),
            fs.readFile(path.join(__dirname, 'convert', 'translations.json'), 'utf8')
                .then(JSON.parse)
        ]);

        const translate = (text, dict) =>
            Object.entries(dict)
                .reduce((acc, [src, tgt]) =>
                    acc.replace(new RegExp(`\\b${src.replace(/\W/g, '\\$&')}\\b`, 'g'), tgt),
                    text);

        await fs.mkdir(path.join(__dirname, 'output'), { recursive: true });

        await Promise.all(
            Object.entries(langs).map(([lang, dict]) => {
                const $ = cheerio.load(html);
                $('*').contents()
                    .filter((_, el) => el.type === 'text')
                    .each((_, el) => el.data = translate(el.data, dict));
                return fs.writeFile(path.join(__dirname, 'output', `index_${lang}.html`), $.html());
            })
        );
    } catch (err) {
        console.error('Error:', err);
    }
})();
