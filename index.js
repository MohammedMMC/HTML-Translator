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

        const translate = (text, dict) => {
            if (text.endsWith(' ') && !dict[text]) {
                text = text.slice(0, -1);
            }
            if (text.startsWith(' ') && !dict[text]) {
                text = text.slice(1);
            }

            return dict[text] || text;
        }

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
