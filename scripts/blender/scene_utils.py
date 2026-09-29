"""Shared Blender helpers for the decode9 model and render scripts."""
import bpy

RED = (0.787, 0.006, 0.012, 1.0)  # #E5121B in linear space
CHROME = (0.58, 0.6, 0.66, 1.0)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    return scene


def principled(name, base_color, metallic, roughness, coat=0.0):
    material = bpy.data.materials.new(name)
    nodes = material.node_tree.nodes
    shader = nodes.get("Principled BSDF") or nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = base_color
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if "Coat Weight" in shader.inputs:
        shader.inputs["Coat Weight"].default_value = coat
        shader.inputs["Coat Roughness"].default_value = 0.08
    output = nodes.get("Material Output") or nodes.new("ShaderNodeOutputMaterial")
    material.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return material


def make_materials():
    return {
        "red": principled("d9_red", RED, 0.45, 0.3, coat=0.8),
        "chrome": principled("d9_chrome", CHROME, 1.0, 0.24),
    }
