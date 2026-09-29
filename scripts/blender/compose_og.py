"""
Composes public/brand/decode9-og.jpg (1200×630) from the Cycles background
rendered by render_posters.py plus the decode9 wordmark and copy.

Brand fonts are OFL (google/fonts); pass their folder in FONT_DIR:
  FONT_DIR=/path/to/fonts python3 scripts/blender/compose_og.py
expects SpaceGrotesk.ttf, Manrope.ttf and JetBrainsMono.ttf (variable fonts).
"""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
FONTS = Path(os.environ.get("FONT_DIR", HERE / ".fonts"))


def font(name, size, weight):
    face = ImageFont.truetype(str(FONTS / name), size)
    try:
        face.set_variation_by_axes([weight])
    except (OSError, AttributeError):
        pass
    return face


def main():
    canvas = Image.open(HERE / ".out" / "og-background.png").convert("RGBA")
    width, height = canvas.size

    # Left-side veil so the copy reads over the render.
    veil = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    veil_draw = ImageDraw.Draw(veil)
    for x in range(width):
        alpha = int(max(0, 215 - x * 0.32))
        veil_draw.line([(x, 0), (x, height)], fill=(11, 12, 14, alpha))
    canvas.alpha_composite(veil)

    logo = Image.open(ROOT / "public" / "brand" / "decode9-logo.png").convert("RGBA")
    logo_width = 250
    logo = logo.resize((logo_width, round(logo.height * logo_width / logo.width)), Image.LANCZOS)
    canvas.alpha_composite(logo, (72, 88))

    draw = ImageDraw.Draw(canvas)
    draw.line([(72, 196), (104, 196)], fill=(229, 18, 27, 255), width=2)
    draw.text((116, 186), "DECODE SESSION", font=font("JetBrainsMono.ttf", 17, 600), fill=(255, 76, 82, 255))
    draw.text((70, 226), "Jorge Bastidas", font=font("SpaceGrotesk.ttf", 66, 700), fill=(244, 246, 248, 255))
    draw.text((72, 312), "Senior Full Stack Engineer · CTO @ The Empire", font=font("Manrope.ttf", 27, 600), fill=(212, 215, 222, 255))
    draw.text(
        (72, 358),
        "Scalable architecture · AI agents · Automation · MVPs",
        font=font("Manrope.ttf", 22, 500),
        fill=(126, 130, 144, 255),
    )
    draw.text((72, 540), "decode9.codes", font=font("JetBrainsMono.ttf", 20, 500), fill=(176, 180, 191, 255))

    target = ROOT / "public" / "brand" / "decode9-og.jpg"
    canvas.convert("RGB").save(target, quality=88, optimize=True, progressive=True)
    print(f"wrote {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
