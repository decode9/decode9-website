import { simplexNoise } from './noise';

/**
 * The guide's body. Each particle morphs from `position` to `aTo` with a
 * per-particle delay (the same curve as utils/math.ts#staggeredProgress, so a
 * morph can be rebased on the CPU mid-flight), while a decaying turbulence
 * field makes the shape "decode" out of noise.
 */
export const particleVertexShader = /* glsl */ `
${simplexNoise}

uniform float uProgress;
uniform float uSpread;
uniform float uTime;
uniform float uTurbulence;
uniform float uSize;
uniform float uPixelRatio;
uniform float uThinking;
uniform float uIntensity;
uniform float uDensity;
uniform vec3 uFocus;
uniform float uFocusStrength;
uniform vec3 uPointer;
uniform float uPointerStrength;

attribute vec3 aTo;
attribute float aSeed;
attribute float aScale;

varying float vAccent;
varying float vAlpha;
varying float vGlow;

float easeInOutCubic(float t) {
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  float local = clamp((uProgress - aSeed * uSpread) / (1.0 - uSpread), 0.0, 1.0);
  vec3 pos = mix(position, aTo, easeInOutCubic(local));

  vec3 q = pos * 0.42 + vec3(aSeed * 7.0, uTime * 0.07, -uTime * 0.05);
  vec3 swirl = vec3(snoise(q), snoise(q + 31.4), snoise(q + 71.9));
  pos += swirl * uTurbulence * (0.5 + aSeed * 0.9);
  pos += swirl * 0.035;

  float pulse = sin(uTime * 3.2 - length(pos) * 1.6) * 0.5 + 0.5;
  pos += normalize(pos + 1e-4) * uThinking * pulse * 0.16;

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vec2 away = world.xy - uPointer.xy;
  float near = smoothstep(1.6, 0.0, length(away));
  world.xy += normalize(away + 1e-4) * near * uPointerStrength * 0.55;
  world.z += near * uPointerStrength * 0.35;

  vGlow = uFocusStrength * smoothstep(1.1, 0.0, distance(world.xyz, uFocus));
  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = uSize * aScale * (1.0 + vGlow * 1.6 + uThinking * pulse * 0.5 + near * uPointerStrength * 0.6);
  gl_PointSize = size * uPixelRatio / max(0.1, -mv.z);

  vAccent = step(0.7, fract(aSeed * 13.37));
  vAlpha = uIntensity * uDensity * (0.45 + 0.55 * fract(aSeed * 7.13));
}
`;

export const particleFragmentShader = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uThinking;

varying float vAccent;
varying float vAlpha;
varying float vGlow;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.0, d);
  if (alpha < 0.02) discard;
  float accent = clamp(vAccent + vGlow + uThinking * 0.3, 0.0, 1.0);
  vec3 color = mix(uBase, uAccent, accent) * (1.0 + vGlow * 2.2);
  gl_FragColor = vec4(color, alpha * alpha * vAlpha);
}
`;
