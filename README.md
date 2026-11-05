# PIESCA

**Proto-Indo-European Sound Change Applier**, based on Mark Rosenfelder's SCA² notation. PIESCA combines a searchable Proto-Indo-European dictionary (including attested/reconstructed inflection tables) with a browser-side sound-change engine.

## Repository contents

| File | Purpose |
| --- | --- |
| `piesca.html` | Jekyll page, including application markup and asset references |
| `_includes/pie-pagination.html` | Reusable pagination snippet required by the page |
| `assets/scripts/pie/app.mjs` | Browser UI, local storage, rule imports/exports, results renderer |
| `assets/scripts/pie/worker.mjs` | Dictionary indexing, transformations and search in a Web Worker |
| `assets/scripts/pie/sca.mjs` | Sound-change implementation |
| `assets/css/pie.css` | PIESCA-specific CSS, extending the Academy's base design system |
| `assets/data/pie/dictionary.json` | Bundled dictionary with inflection/paradigm data |
| `assets/data/pie/source.json` | Source attribution, snapshot metadata, checksum, coverage figures |
| `scripts/update-pie.py` | Standard-library importer for upstream source data |
| `tests/pie-dictionary.test.mjs`, `tests/pie-sca.test.mjs` | Automated tests |
| `docs/pie-dictionary.md` | Technical and provenance notes from the original website project |
| `scripts/export-jekyll.py` | Export PIESCA-owned files into a Jekyll site's directory |

This is a **source repository**, not a separate replacement website theme. Its Jekyll page intentionally uses the Academy's `default` layout, `page-heading.html` include, global CSS custom properties, form components, and dictionary/table styles. Those shared site resources are **not** copied into this archive; they remain owned by `danetiska.com`.

## Test

Requires Node.js with its built-in test runner; no npm packages are needed.

```sh
node --test tests/pie*.test.mjs
```

## Integrate into the Academy site

In `danetiska.com`, remove the original PIESCA-owned files from Git tracking, then attach this project as a submodule:

```sh
git submodule add https://github.com/YOUR-ACCOUNT/piesca.git _vendor/piesca
```

In the Academy deployment process, **after submodule checkout and before `bundle exec jekyll build`**, run:

```sh
python3 _vendor/piesca/scripts/export-jekyll.py --output .
bundle exec jekyll build
```

The exporter copies only the files listed above under their original Jekyll-relative paths. It does not replace navigation, library metadata, site-wide CSS, privacy policy or any Academy layout. If your local checkout contains old PIESCA files with the same paths, the exported files overwrite them. For a clean build, use a fresh deployment checkout or remove the old files first. In the Academy repository, add the generated destination paths to `.gitignore` *after* removing old tracked copies.

Alternatively, export into a staging directory and inspect the output:

```sh
python3 scripts/export-jekyll.py --output dist/jekyll
```

Since the page still has `permalink: /piesca/`, visitors keep the existing URL. The Web Worker is loaded relative to `app.mjs`; the JSON asset URLs are supplied by the Jekyll page.

## Updating dictionary data

See `docs/pie-dictionary.md` and run the Python importer from the root of this repository:

```sh
python3 scripts/update-pie.py
```

It uses Python's standard library to retrieve and prepare the source data. The bundled snapshot can be served without fetching an external API at visitor runtime.

## Credits and licensing

- Sound-change notation derives from Mark Rosenfelder's SCA². PIESCA implements the notation; it is not a bundled copy of the SCA² application.
- Dictionary contents are adapted from Wiktionary via Kaikki/Wiktextract and carry **CC BY-SA 4.0 and GFDL** attribution/redistribution obligations. Preserve the `source.json` record and the on-page links to source entries and history.
- No standalone license for the original PIESCA application source was supplied with the archived project artifacts. Choose and add a code license separately before publishing this repository; do not assume the third-party dictionary data has the same license as the application code.

## Source snapshot note

Files in this extraction were reconstructed from earlier `danetiska.com` PIESCA source patches dated **2026-10-26**, including interface refinements, the `/piesca/` route and the SCA² credit. They have **not** been verified against the live GitHub `master` branch as of 2026-11-05. The test suite passed against the extracted files. Compare with the current site checkout before deleting any originals.
