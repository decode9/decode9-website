import type { Material, WebGLProgramParametersWithUniforms } from 'three';
import { simplexNoise } from './noise';

export interface DissolveUniforms {
  uReveal: { value: number };
  uEdgeColor: { value: [number, number, number] };
}

/**
 * Adds a noise-driven dissolve to a built-in material: fragments whose noise
 * value is above `uReveal` are discarded, and a glowing band marks the edge.
 */
export const applyDissolve = (material: Material, uniforms: DissolveUniforms): void => {
  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uReveal = uniforms.uReveal;
    shader.uniforms.uEdgeColor = { value: uniforms.uEdgeColor.value };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vD9World;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvD9World = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\nvarying vec3 vD9World;\nuniform float uReveal;\nuniform vec3 uEdgeColor;\n${simplexNoise}`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
        float d9Noise = snoise(vD9World * 1.8) * 0.5 + 0.5;
        float d9Threshold = uReveal * 1.12 - 0.06;
        if (d9Noise > d9Threshold) discard;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += uEdgeColor * smoothstep(d9Threshold - 0.07, d9Threshold, d9Noise) * 2.2;`,
      );
  };
  material.needsUpdate = true;
};
