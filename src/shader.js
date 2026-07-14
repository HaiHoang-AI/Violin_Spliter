export function initShaderCanvas(canvas) {
  if (!canvas) return;
  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }

  const vertexShaderSrc = `
    attribute vec2 position;
    varying vec2 v_texCoord;
    void main() {
        v_texCoord = position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y;
        gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    precision highp float;

    varying vec2 v_texCoord;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform bool u_isDark;

    vec3 emerald = vec3(0.02, 0.17, 0.13); // #062c21
    vec3 gold = vec3(0.83, 0.69, 0.22);    // #d4b038
    vec3 dark = vec3(0.08, 0.08, 0.05);    // #14140e
    vec3 ivory = vec3(0.99, 0.98, 0.93);   // #FDF9EE

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec2 uv = v_texCoord;
        vec2 center = uv - 0.5;
        center.x *= u_resolution.x / u_resolution.y;
        
        float t = u_time * 0.5;
        float wave = sin(uv.x * 10.0 + t) * 0.02;
        wave += sin(uv.x * 20.0 - t * 0.8) * 0.01;
        
        float line = abs(center.y + wave);
        float glow = 0.005 / pow(line, 0.8);
        
        float string1 = 0.002 / abs(center.y + sin(uv.x * 8.0 + t * 1.2) * 0.05);
        float string2 = 0.002 / abs(center.y + cos(uv.x * 12.0 - t * 0.9) * 0.08);
        
        float n = noise(uv * 3.0 + t * 0.2);
        vec3 bgColor = u_isDark ? mix(dark, emerald * 0.5, n) : mix(ivory, vec3(0.95, 0.93, 0.88), n);
        vec3 color = bgColor;
        
        vec3 glowColor = u_isDark ? gold : vec3(0.45, 0.36, 0.0);
        color += glowColor * (glow + string1 + string2) * 0.5;
        
        float particles = 0.0;
        for(float i = 0.0; i < 20.0; i++) {
            vec2 pos = vec2(random(vec2(i, 1.0)), random(vec2(i, 2.0)));
            pos.y = fract(pos.y - t * 0.1);
            float size = 0.001 * random(vec2(i, 3.0));
            float dist = distance(uv, pos);
            particles += size / dist;
        }
        color += glowColor * particles * 0.2;

        float d = length(uv - 0.5);
        color *= smoothstep(0.8, 0.2, d);

        gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
      }
      return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'position');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const isDarkLocation = gl.getUniformLocation(program, 'u_isDark');

  let animationFrameId;

  function resize() {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
  }
  
  window.addEventListener('resize', resize);
  resize();

  function render(time) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      const isDark = document.documentElement.classList.contains('dark');
      gl.uniform1i(isDarkLocation, isDark ? 1 : 0);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
  }
  animationFrameId = requestAnimationFrame(render);

  // Return a cleanup function
  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(animationFrameId);
  };
}
