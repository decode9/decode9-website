"""Converts raw captures to web-ready WebP in public/work/<id>/ (desktop 1600w, mobile 600w)."""
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
WIDTHS = {"desktop": 1600, "mobile": 600}


def main():
    for raw in sorted((HERE / ".raw").glob("*/*.png")):
        kind = raw.stem
        target = ROOT / "public" / "work" / raw.parent.name / f"{kind}.webp"
        target.parent.mkdir(parents=True, exist_ok=True)
        image = Image.open(raw).convert("RGB")
        width = WIDTHS.get(kind, 1200)
        if image.width > width:
            image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
        image.save(target, "WEBP", quality=80, method=6)
        print(f"{target.relative_to(ROOT)}  {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
