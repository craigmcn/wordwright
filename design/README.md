# design/

Source assets that get rasterized into `public/icons/` and
`public/favicon.ico`, kept separately so they're editable without touching a
PNG in an image editor.

- `icon-source.svg` — the app icon (512×512), used for `icon-192.png`,
  `icon-512.png`, `apple-touch-icon.png`, and `favicon.ico`.
- `icon-maskable-source.svg` — same icon redrawn with extra padding so the
  clock face stays inside the safe zone when a launcher masks it into a
  circle/squircle/etc. Used for `icon-maskable-512.png` only.

To regenerate after editing a source file:

```bash
rsvg-convert -w 192 -h 192 design/icon-source.svg -o public/icons/icon-192.png
rsvg-convert -w 512 -h 512 design/icon-source.svg -o public/icons/icon-512.png
rsvg-convert -w 512 -h 512 design/icon-maskable-source.svg -o public/icons/icon-maskable-512.png
rsvg-convert -w 180 -h 180 design/icon-source.svg -o public/icons/apple-touch-icon.png
rsvg-convert -w 32 -h 32 design/icon-source.svg -o /tmp/favicon-32.png
rsvg-convert -w 16 -h 16 design/icon-source.svg -o /tmp/favicon-16.png
magick /tmp/favicon-16.png /tmp/favicon-32.png public/favicon.ico
```

Requires `rsvg-convert` and `magick` (ImageMagick) — both installable via
Homebrew (`brew install librsvg imagemagick`).
