# Blender assets (models as code)

| Script | Output |
| --- | --- |
| `isotype_polygons.py` (python3) | `src/data/isotype.paths.json` — the mark as clean polygons (also the particle shape in the browser), measured on `public/brand/decode9-isotype.png` (+ `isotype.preview.png` overlay to compare) |
| `build_isotype.py` (blender) | `public/models/isotype.v1.glb` — extruded, bevelled pieces with `d9_red` / `d9_chrome` materials |
| `render_posters.py` (blender) | `public/brand/core-poster.v1.webp` and `.out/og-background.png` (Cycles, GPU when available) |
| `compose_og.py` (python3) | `public/brand/decode9-og.jpg` — needs `FONT_DIR` with SpaceGrotesk/Manrope/JetBrainsMono TTFs |

```sh
python3 scripts/blender/isotype_polygons.py
npm run models                       # build_isotype + render_posters
FONT_DIR=~/fonts python3 scripts/blender/compose_og.py
```

Binary outputs are committed, so CI never needs Blender. When a model or poster changes, bump its version in the
file name (`isotype.v2.glb`): GitHub Pages caches every file and doesn't let us set cache headers.
