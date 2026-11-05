# PIESCA — Proto-Indo-European Sound Change Applier

Based on master 7513387. The native Jekyll page is `/piesca/`, linked from the existing Library tools
list. No legacy routes or redirects are provided.

## Structure

- `piesca.html`: two accessible tabs, applied rules, search and editor.
- `assets/scripts/pie/sca.mjs`: independent implementation of documented SCA²
  notation. Shared by the dictionary and draft preview.
- `worker.mjs`: loading, cached sound changes, search and pagination off the UI
  thread. A new worker replaces the previous dictionary only after successful
  indexing; invalid drafts leave applied results intact.
- `app.mjs`: safe DOM rendering, local preferences, rule import/export and UI.
- `assets/css/pie.css`: tool-specific layout only. Existing theme tokens, form
  controls, dictionary entries, tabs and inflection table styles are reused.
- `assets/data/pie/`: bundled expanded dictionary, structured rendered tables,
  source dates, checksum and coverage manifest. Visitors need no external API.

The snapshot contains 1,802 lemmas, 1,931 part-of-speech entries and 39,029 form
records. Definitions/forms come from the October 1, 2026 enwiktionary dump,
expanded October 21. Table structures were refreshed from rendered Wiktionary
pages October 26. Thus table revisions can be newer than the definition snapshot.
784 rendered tables cover 695 headwords; `ḱís` uses the labelled structured-form
fallback. Do not invent unattested forms or collapse active and middle voice.
Tables are attached by source lemma and displayed once per lemma on a results
page, retaining the page's full collection of paradigms.

Forms, grammatical labels, row spans, column spans and language-marked text are
stored as data; third-party HTML, styles, scripts and event handlers are never
inserted into the page. Sound changes operate on PIE text only, including PIE
references in definitions and table notes; English labels are preserved.
Search accepts English meanings, original lemmas, transformed lemmas and
transformed inflections. Original forms are not shown alongside output forms.
Blank rules mean identity output, explicitly stated above the dictionary.

## Rules

Supported: ordered `target/replacement/environment[/exception]`, `→`, named
single-character categories, indexed category replacement including extended
substitution, bracket categories, word boundaries, optional environments,
insertion, deletion, `…`, `²`, metathesis `\\`, `source|replacement` rewrites
and optional reverse rewrites. `*` comments and `-*` stage markers are accepted;
the dictionary displays final results, rather than intermediate stages. This is
an implementation of the notation, not a copy of Rosenfelder's program or every
control in his standalone application. Rule exports use Academy JSON, not `.sc`.

Strings are NFC-normalized. Accents and syllabicity remain significant. Use
rewrite rules for multicharacter segments inside categories. Example rules are
illustrative, not a proposed historical daughter language. Rules don't model
analogy, morphological levelling, or changes to grammatical categories.

Local storage contains only the applied configuration. Draft import/export and
preview are local. Workers can be terminated when processing exceeds its time
budget. No extra runtime packages, build dependencies or API keys are required.

## Refresh

Run `python3 scripts/update-pie.py` (stdlib only). It discovers dates from the
Kaikki page, downloads the expanded JSONL, and retrieves rendered tables with
six concurrent requests. A local HTML cache makes interrupted runs resumable.
For an existing extract use `--source /path/to/extract.jsonl`; `--index` can supply
the corresponding source index HTML. `--offline` rebuilds using cached tables
without fetching missing pages. Review `source.json`, especially `missingTables`,
then commit the refreshed data. Keep the cache out of version control.

If Kaikki retires this legacy language-specific export, update the downloader
to filter `lang_code == 'ine-pro'` from its replacement raw export; do not silently
substitute an older dataset. This known upstream deprecation is why a verified
snapshot is bundled rather than fetched at runtime.

## Validation

`node --test tests/pie*.test.mjs`

Tests cover the published Latin–Portuguese example, boundaries, Unicode,
category mappings, optional contexts, insertions, deletion, metathesis,
gemination, wildcard, exceptions, rewriting, invalid rules, the full index,
transformed inflection search, voice headings, and structured table data.

Browser QA used the real assets with a pre-rendered page shell, because Ruby and
Bundler are unavailable in this environment. A complete Jekyll build should run
in the normal site workflow before deployment.

## Apply the patch

From a checkout of the same repository:

```sh
git apply --check danetiska-pie-dictionary.patch
git apply danetiska-pie-dictionary.patch
node --test tests/pie*.test.mjs
bundle exec jekyll build
```

No GitHub commit/push or public deployment is included in this patch.
