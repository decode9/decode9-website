"""Regenerates every Blender-made asset: `npm run models` (then compose_og.py for the OG image)."""
import runpy
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

runpy.run_path(str(HERE / "build_isotype.py"), run_name="__main__")
runpy.run_path(str(HERE / "render_posters.py"), run_name="__main__")
