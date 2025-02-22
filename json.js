const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');

const languages = ["en", "ar", "tr"];

(async () => {
    try {
        const $ = cheerio.load(await fs.readFile(path.join(__dirname, 'convert', 'index.html'), 'utf8'));
        $('script, style, code').remove();

        const texts = [...new Set($('*')
            .contents()
            .filter((_, { type, data }) =>
                type === 'text' &&
                (data = data.trim()) &&
                !/function|=>/.test(data)
            )
            .map((_, { data }) => data.trim())
            .get())];

        await fs.writeFile(
            path.join(__dirname, 'convert', 'translations.json'),
            JSON.stringify(Object.fromEntries(
                languages.map(lang => [
                    lang,
                    Object.fromEntries(texts.map(t => [t, lang === 'en' ? t : '']))
                ])
            ), null, 2)
        );
    } catch (err) {
        console.error('Error:', err);
    }
})();