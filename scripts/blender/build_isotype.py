"""
Builds public/models/isotype.v1.glb from src/data/isotype.paths.json.

Each piece is extruded along the view axis and bevelled so edges catch light.
Red pieces sit slightly in front of the chrome plates, like the flat mark's
layering. Blender is Z-up; the glTF exporter converts to Y-up, so the mark is
drawn on Blender's XZ plane (front view looks along +Y) and ends up facing +Z
in three.js.

Run: blender -b -P scripts/blender/build_isotype.py
"""
import json
import sys
from pathlib import Path

import bmesh
import bpy

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from scene_utils import reset_scene, make_materials  # noqa: E402

TARGET = ROOT / "public" / "models" / "isotype.v1.glb"
HEIGHT = 3.2  # world units: the mark is 3.2 units tall in three.js
DEPTH = {"red": 0.26, "chrome": 0.16}
FRONT = {"red": -0.13, "chrome": -0.03}  # Blender -Y is towards the camera
BEVEL = {"red": 0.018, "chrome": 0.012}


def build_piece(name, material_name, points, material):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    front = FRONT[material_name]
    verts = [bm.verts.new((x * HEIGHT, front, y * HEIGHT)) for x, y in points]
    face = bm.faces.new(verts)
    bm.normal_update()
    if face.normal.y > 0:  # make the cap face the camera (-Y)
        face.normal_flip()
    extruded = bmesh.ops.extrude_face_region(bm, geom=[face])
    moved = [element for element in extruded["geom"] if isinstance(element, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=(0.0, DEPTH[material_name], 0.0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bmesh.ops.bevel(
        bm,
        geom=bm.edges[:],
        offset=BEVEL[material_name],
        segments=2,
        profile=0.5,
        affect="EDGES",
        clamp_overlap=True,
    )
    bmesh.ops.triangulate(bm, faces=bm.faces[:], quad_method="BEAUTY", ngon_method="EAR_CLIP")
    bm.to_mesh(mesh)
    bm.free()
    for polygon in mesh.polygons:
        polygon.use_smooth = False
    mesh.materials.append(material)
    return obj


def build_isotype():
    data = json.loads((ROOT / "src" / "data" / "isotype.paths.json").read_text())
    materials = make_materials()
    root = bpy.data.objects.new("isotype", None)
    bpy.context.collection.objects.link(root)
    for piece in data["pieces"]:
        obj = build_piece(piece["name"], piece["material"], piece["points"], materials[piece["material"]])
        obj.parent = root
    return root


def main():
    reset_scene()
    build_isotype()
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(TARGET),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_normals=True,
        export_texcoords=False,
        export_cameras=False,
        export_lights=False,
        export_draco_mesh_compression_enable=False,
    )
    print(f"exported {TARGET.relative_to(ROOT)} ({TARGET.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
