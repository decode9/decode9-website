"""
The decode9 isotype as clean polygons, measured by hand on
public/brand/decode9-isotype.png (517×556 px, mirror axis x = 258.5).

The PNG's brushed-metal texture makes automatic tracing ragged, and the mark is
pure straight-edged geometry, so the source of truth is this list of vertices.
`python3 scripts/blender/isotype_polygons.py` writes src/data/isotype.paths.json
(normalised: 1 unit tall, centred, y up) and a preview overlay.
"""
import json
from pathlib import Path

WIDTH, HEIGHT = 517, 556
AXIS = 258.5
HERE = Path(__file__).resolve().parent


def mirror(points):
    return [(round(2 * AXIS - x, 1), y) for x, y in reversed(points)]


HORN_L = [(90, 21), (28, 135), (91, 199), (131, 172), (82, 122)]
UPPER_PLATE_L = [(21, 169), (77, 225), (77, 276), (60, 292), (21, 262)]
INNER_PLATE_L = [(100, 291), (195, 356), (152, 392), (100, 357)]
NINE = [
    (259, 93), (419, 200), (419, 381), (262, 488), (262, 464), (368, 374), (368, 231),
    (259, 160), (167, 222), (316, 321), (271, 354), (100, 245), (100, 200),
]
SHIELD = [
    (21, 297), (77, 346), (77, 385), (259, 527), (440, 385), (440, 346), (496, 297),
    (496, 400), (422, 457), (377, 442), (259, 538), (140, 442), (95, 457), (21, 400),
]

PIECES = [
    ("horn_l", "red", HORN_L),
    ("horn_r", "red", mirror(HORN_L)),
    ("nine", "red", NINE),
    ("plate_upper_l", "chrome", UPPER_PLATE_L),
    ("plate_upper_r", "chrome", mirror(UPPER_PLATE_L)),
    ("plate_inner_l", "chrome", INNER_PLATE_L),
    ("shield", "chrome", SHIELD),
]


def normalise(points):
    return [[round((x - WIDTH / 2) / HEIGHT, 5), round((HEIGHT / 2 - y) / HEIGHT, 5)] for x, y in points]


def main():
    data = {
        "source": "decode9-isotype.png",
        "pieces": [{"name": name, "material": material, "points": normalise(points)} for name, material, points in PIECES],
    }
    # Shared by the Blender build and the web app (particle shape of the mark).
    (HERE.parents[1] / "src" / "data" / "isotype.paths.json").write_text(json.dumps(data, indent=1))
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return
    base = Image.open(HERE.parents[1] / "public" / "brand" / "decode9-isotype.png").convert("RGBA")
    canvas = Image.new("RGBA", base.size, (12, 12, 14, 255))
    canvas.alpha_composite(base)
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _, material, points in PIECES:
        fill = (0, 200, 255, 70) if material == "chrome" else (255, 255, 0, 60)
        draw.polygon(points, fill=fill, outline=(0, 255, 180, 255))
    canvas.alpha_composite(overlay)
    canvas.resize((WIDTH * 2, HEIGHT * 2)).save(HERE / "isotype.preview.png")


if __name__ == "__main__":
    main()
