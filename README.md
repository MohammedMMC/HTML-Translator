# HTML Translator

A simple Node.js tool to generate translated versions of HTML files using a JSON translation dictionary.

## Setup

1. Install dependencies:

```bash
npm install cheerio path fs
```

2. Create required folders:

```
html-translator/
├── convert/
│   ├── index.html       # Your source HTML file
│   └── translations.json # Translation dictionary
└── output/              # Generated translations
```

## Usage

### 1. Generate Translation Template

```bash
node json.js
```

This will:

- Read your HTML file
- Extract all text content
- Create a translations.json template
  This will generate a `translations.json` template with placeholder entries for the following languages:
- English (en)
- Arabic (ar)
- Turkish (tr)

You can modify the `languages` array in `json.js` to add or remove languages as needed:

```bash
const languages = ["en", "ar", "tr"];
```

### 2. Add Translations

Edit `convert/translations.json` and add translations for each language.

Example structure:

```json
{
  "en": {
    "Hello": "Hello"
  },
  "ar": {
    "Hello": "مرحبا"
  },
  "tr": {
    "Hello": "Merhaba"
  }
}
```

### 3. Generate Translated Files

```bash
node index.js
```

This will create translated HTML files in the `output` folder.
