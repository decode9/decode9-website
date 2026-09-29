/** Final grade: vignette and a hint of chromatic aberration towards the edges. */
export const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVignette: { value: 0.85 },
    uAberration: { value: 0.0012 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uVignette;
    uniform float uAberration;
    varying vec2 vUv;
    void main() {
      vec2 fromCenter = vUv - 0.5;
      vec2 shift = fromCenter * uAberration * length(fromCenter) * 4.0;
      vec4 color = texture2D(tDiffuse, vUv);
      color.r = texture2D(tDiffuse, vUv + shift).r;
      color.b = texture2D(tDiffuse, vUv - shift).b;
      float vignette = smoothstep(0.95, 0.25, length(fromCenter) * uVignette * 1.35);
      gl_FragColor = vec4(color.rgb * mix(0.35, 1.0, vignette), color.a);
    }
  `,
};
