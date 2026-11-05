#!/usr/bin/env python3
"""Export PIESCA-owned sources to a Jekyll site directory (stdlib only)."""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = (
    'piesca.html',
    '_includes/pie-pagination.html',
    'assets/css/pie.css',
    'assets/data/pie/dictionary.json',
    'assets/data/pie/source.json',
    'assets/scripts/pie/app.mjs',
    'assets/scripts/pie/sca.mjs',
    'assets/scripts/pie/worker.mjs',
)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--output', type=Path, default=ROOT / 'dist' / 'jekyll',
                   help='Jekyll root or staging directory (default: dist/jekyll)')
    args = p.parse_args()
    destination = args.output.resolve()
    if destination == ROOT:
        p.error('Refusing to export directly over this repository. Use dist/jekyll instead.')

    for name in SOURCES:
        src = ROOT / name
        if not src.is_file():
            raise FileNotFoundError(f'Missing required PIESCA file: {name}')
        dest = destination / name
        if dest.resolve() == src.resolve():
            raise RuntimeError(f'Output would overwrite its own source: {name}')
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        print(name)
    print(f'Exported {len(SOURCES)} files to {destination}')


if __name__ == '__main__':
    main()
