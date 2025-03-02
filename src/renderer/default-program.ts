export const DEFAULT_3D_SHADER = 
`
struct Camera {
  viewProjectionMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>
}

@group(0) @binding(0) var<uniform> camera: Camera;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normal: vec3<f32>,
  @location(2) uv: vec2<f32>,
  @location(3) model_row0: vec4<f32>,
  @location(4) model_row1: vec4<f32>,
  @location(5) model_row2: vec4<f32>,
  @location(6) model_row3: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) normal: vec3<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) worldPos: vec3<f32>
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;
  let model = mat4x4<f32>(
    input.model_row0,
    input.model_row1,
    input.model_row2,
    input.model_row3
  );
  
  let worldPos = model * vec4<f32>(input.position, 1.0);
  output.position = camera.viewProjectionMatrix * worldPos;
  output.worldPos = worldPos.xyz;
  
  let normalMatrix = mat3x3<f32>(
    model[0].xyz,
    model[1].xyz,
    model[2].xyz
  );

  output.normal = normalize(normalMatrix * input.normal);
  output.uv = input.uv;
  
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let lightDir = normalize(vec3<f32>(0.5, 1.0, 0.3));
  let ambient = 0.2;
  let diffuse = max(dot(input.normal, lightDir), 0.0);
  let color = input.normal * 0.5 + 0.5;
  return vec4<f32>(color * (ambient + diffuse), 1.0);
}`;

export const DEFAULT_2D_SHADER = `
struct Camera {
  viewProjectionMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>
}

@group(0) @binding(0) var<uniform> camera: Camera;

struct VertexInput {
  @location(0) position: vec2<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) instancePos: vec2<f32>,
  @location(3) instanceRot: f32,
  @location(4) instanceScale: vec2<f32>,
  @location(5) instanceColor: vec4<f32>
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>
}

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  var output: VertexOutput;

  let cosRot = cos(input.instanceRot);
  let sinRot = sin(input.instanceRot);
  let rotMat = mat2x2<f32>(
    cosRot, sinRot,
    -sinRot, cosRot
  );
  
  let scaledPos = input.position * input.instanceScale;
  let rotatedPos = rotMat * scaledPos;
  let finalPos = vec4<f32>(rotatedPos + input.instancePos, 0.0, 1.0);
  
  output.position = camera.viewProjectionMatrix * finalPos;
  output.uv = input.uv;
  output.color = input.instanceColor;
  
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  return input.color;
}`;