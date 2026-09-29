"""
Renders the stage poster (fallback when WebGL is off / while it loads) and the
background of the Open Graph image, with Cycles.

  public/brand/core-poster.v1.webp   1920×1080, mark on the right third
  scripts/blender/.out/og-background.png  1200×630, composed by compose_og.py

Run: blender -b -P scripts/blender/render_posters.py
"""
import math
import random
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
sys.path.insert(0, str(HERE))

from build_isotype import build_isotype  # noqa: E402
from scene_utils import reset_scene  # noqa: E402

OUT = HERE / ".out"


def emission(name, color, strength):
    material = bpy.data.materials.new(name)
    nodes = material.node_tree.nodes
    nodes.clear()
    shader = nodes.new("ShaderNodeEmission")
    shader.inputs["Color"].default_value = color
    shader.inputs["Strength"].default_value = strength
    output = nodes.new("ShaderNodeOutputMaterial")
    material.node_tree.links.new(shader.outputs["Emission"], output.inputs["Surface"])
    return material


def speck_cloud(name, count, seed, material, radius_range, flatten):
    """Tiny emissive specks orbiting the mark: the particle core, frozen."""
    rng = random.Random(seed)
    mesh = bpy.data.meshes.new(name)
    bm = bmesh.new()
    for _ in range(count):
        theta = rng.uniform(0, math.tau)
        radius = rng.uniform(*radius_range)
        center = Matrix.Translation((
            math.cos(theta) * radius,
            math.sin(theta) * radius * flatten + rng.gauss(0, 0.35),
            rng.gauss(-0.4, 1.8),
        ))
        bmesh.ops.create_icosphere(bm, subdivisions=1, radius=rng.uniform(0.005, 0.013), matrix=center)
    bm.to_mesh(mesh)
    bm.free()
    mesh.materials.append(material)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return obj


def particle_halo():
    speck_cloud("halo_red", 380, 9, emission("speck_red", (1.0, 0.03, 0.04, 1.0), 14.0), (2.1, 3.6), 0.9)
    speck_cloud("halo_white", 140, 17, emission("speck_white", (0.9, 0.93, 1.0, 1.0), 5.0), (2.4, 4.4), 0.8)


def softbox(name, location, rotation, size, strength):
    """Off-camera emissive strips: something for the chrome to reflect."""
    bpy.ops.mesh.primitive_plane_add(size=1, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0], size[1], 1)
    obj.data.materials.append(emission(f"{name}_light", (0.92, 0.95, 1.0, 1.0), strength))
    obj.visible_camera = False
    return obj


def area_light(name, location, rotation, color, energy, size):
    data = bpy.data.lights.new(name, "AREA")
    data.color = color
    data.energy = energy
    data.size = size
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    obj.rotation_euler = rotation
    bpy.context.collection.objects.link(obj)
    return obj


def setup_scene():
    scene = reset_scene()
    build_isotype()
    particle_halo()

    world = bpy.data.worlds.new("void")
    scene.world = world
    background = world.node_tree.nodes.get("Background") or world.node_tree.nodes.new("ShaderNodeBackground")
    background.inputs["Color"].default_value = (0.0035, 0.0038, 0.0045, 1.0)
    background.inputs["Strength"].default_value = 1.0
    # Thin atmosphere so the red rim draws light shafts.
    volume = world.node_tree.nodes.new("ShaderNodeVolumePrincipled")
    volume.inputs["Density"].default_value = 0.0022
    world_output = world.node_tree.nodes.get("World Output")
    world.node_tree.links.new(volume.outputs["Volume"], world_output.inputs["Volume"])

    # Key (cool, top-left), red rims (behind), faint fill from below.
    area_light("key", (-4.5, -6.0, 4.5), (math.radians(55), 0, math.radians(-35)), (0.85, 0.9, 1.0), 700, 5)
    area_light("rim", (3.2, 2.6, 2.4), (math.radians(-60), 0, math.radians(140)), (1.0, 0.04, 0.05), 3200, 1.5)
    area_light("rim_l", (-3.6, 2.4, -1.2), (math.radians(-100), 0, math.radians(-130)), (1.0, 0.06, 0.07), 1400, 1.5)
    area_light("fill", (0.0, -5.0, -4.0), (math.radians(125), 0, 0), (0.6, 0.65, 0.8), 90, 6)
    softbox("strip_top", (0.0, -4.0, 5.0), (math.radians(40), 0, 0), (7.0, 0.5), 18.0)
    softbox("strip_left", (-5.0, -4.0, 0.5), (0, math.radians(-60), math.radians(-35)), (0.45, 6.0), 12.0)

    camera_data = bpy.data.cameras.new("camera")
    camera_data.lens = 55
    camera_data.dof.use_dof = True
    camera_data.dof.aperture_fstop = 1.1
    camera_data.dof.focus_distance = 10.4
    camera = bpy.data.objects.new("camera", camera_data)
    camera.location = (0.9, -10.5, 0.8)
    camera.rotation_euler = (math.radians(86.5), 0, math.radians(4.8))
    bpy.context.collection.objects.link(camera)
    scene.camera = camera

    isotype = bpy.data.objects["isotype"]
    isotype.rotation_euler = (0, 0, math.radians(-14))

    scene.render.engine = "CYCLES"
    cycles = scene.cycles
    preferences = bpy.context.preferences.addons["cycles"].preferences
    preferences.refresh_devices()
    for backend in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
        try:
            preferences.compute_device_type = backend
        except TypeError:
            continue
        if any(device.type == backend for device in preferences.devices):
            for device in preferences.devices:
                device.use = device.type == backend
            cycles.device = "GPU"
            break
    cycles.samples = 256
    cycles.volume_step_rate = 4.0
    cycles.use_denoising = True
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.film_transparent = False
    return scene, camera_data


def render(scene, camera_data, path, width, height, shift_x, file_format="PNG"):
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    camera_data.shift_x = shift_x
    scene.render.image_settings.file_format = file_format
    if file_format == "WEBP":
        scene.render.image_settings.quality = 82
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)
    print(f"rendered {path.relative_to(ROOT)}")


def main():
    OUT.mkdir(exist_ok=True)
    scene, camera_data = setup_scene()
    render(scene, camera_data, ROOT / "public" / "brand" / "core-poster.v1.webp", 1920, 1080, -0.2, "WEBP")
    render(scene, camera_data, OUT / "og-background.png", 1200, 630, -0.24)


if __name__ == "__main__":
    main()
