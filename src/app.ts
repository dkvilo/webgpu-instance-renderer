import { WebGPURenderer } from "./renderer/renderer";
import { Object3D } from "./renderer/object3d";
import { Object2D } from "./renderer/object2d";

import { Mat4 } from "./math/mat4";
import { Geometry } from "./utils/geometry";

async function initRenderer(canvas: HTMLCanvasElement) {
  if (!canvas) {
    console.error('Canvas element not found');
    return null;
  }

  const renderer = new WebGPURenderer(canvas);
  const initialized = await renderer.initialize();
  if (!initialized) {
    console.error('Failed to initialize WebGPU renderer');
    return null;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.resize();

  // Todo (David): re-crate target textures to have true resize
  return renderer;
}

async function create3DScene(canvas: HTMLCanvasElement) {
  const renderer = await initRenderer(canvas);
  if (!renderer) return;

  const { vertices, indices } = Geometry.createSphere(.1, 16, 16);
  const cubeObject = new Object3D(vertices, indices);

  renderer.addObject(cubeObject);

  const aspect = renderer.getCanvas()!.width / renderer.getCanvas()!.height;
  renderer.setupPerspectiveCamera(Math.PI / 4, aspect, 0.1, 100.0, [0, 0, 0], [0, 0, 0], [0, 1, 0]);

  const instanceCount = 1000;
  cubeObject.setInstanceCount(renderer.getDevice()!, instanceCount);
  const instanceMatrices: Mat4[] = Array(instanceCount).fill(null).map(() => Mat4.identity());

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseX = ((event.clientX - rect.left) * scaleX / canvas.width) * 2 - 1;
    mouseY = -(((event.clientY - rect.top) * scaleY / canvas.height) * 2 - 1);
  });

  let lastTime = 0;
  function animate(time: number) {
    const deltaTime = (time - lastTime); lastTime = time;

    for (let i = 0; i < instanceCount; i++) {
      const x = Math.sin(i * 0.21 + deltaTime * 0.001) * 3;
      const y = Math.sin(i * 0.37 + time * 0.001) * 2;
      const z = -5.0 + Math.sin(i * 0.13 + time * 0.001) * 3;

      const scale = 0.2 + Math.sin(i + time * 0.001) * 0.05;

      const translation = Mat4.translation(x, y, z);
      const scaling = Mat4.scaling(scale, scale, scale);
      const rotationX = Mat4.rotationX(time * 0.0005 * (i % 1 + 1));
      const rotationY = Mat4.rotationY(time * 0.0003 * (i % 5 + 1));

      const modelMatrix = translation
        .multiply(rotationY)
        .multiply(rotationX)
        .multiply(scaling);

      instanceMatrices[i] = modelMatrix;
    }

    if (cubeObject instanceof Object3D) {
      cubeObject.updateInstanceMatrices((renderer as any).getDevice(), instanceMatrices);
    }

    (renderer as WebGPURenderer).render();
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

async function create2DScene(canvas: HTMLCanvasElement) {
  const renderer = await initRenderer(canvas);
  if (!renderer) return;

  const width = renderer.getCanvas()!.width;
  const height = renderer.getCanvas()!.height;

  // Note (david) Top (flipped for 2D screen coordinates)
  renderer.setupOrthographicCamera(0, width, height, 0, -1, 1);

  const { vertices, indices } = Geometry.createQuad();
  const quadObject = new Object2D(vertices, indices);
  renderer.addObject(quadObject);

  const instanceCount = 10000;
  quadObject.setInstanceCount(renderer.getDevice()!, instanceCount);

  interface Particle {
    position: [number, number];
    velocity: [number, number];
    rotation: number;
    rotationSpeed: number;
    scale: [number, number];
    color: [number, number, number, number];
    life: number;
    maxLife: number;
  }

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
  });

  const particles: Particle[] = [];
  for (let i = 0; i < instanceCount; i++) {
    particles.push({
      position: [width / 2, height / 2],
      velocity: [
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500
      ],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 2,
      scale: [10, 20],
      color: [
        Math.random(),
        Math.random(),
        Math.random(),
        1.0
      ],
      life: 0,
      maxLife: 1 + Math.random() * 4
    });
  }

  // Note (David) 9 floats per instance: position(2), rotation(1), scale(2), color(4)
  const instanceData = new Float32Array(instanceCount * 9);

  let lastTime = 0;
  function animate(time: number) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    for (let i = 0; i < instanceCount; i++) {
      const particle = particles[i];

      particle.life += deltaTime;
      if (particle.life >= particle.maxLife) {
        particle.position = [mouseX, mouseY];
        particle.velocity = [
          (Math.random() - 0.5) * 500,
          (Math.random() - 0.5) * 500
        ];
        particle.life = 0;
        particle.color[3] = 1.0;
      }

      particle.position[0] += particle.velocity[0] * deltaTime;
      particle.position[1] += particle.velocity[1] * deltaTime;
      particle.rotation += particle.rotationSpeed * deltaTime;
      particle.color[3] = 1.0 - (particle.life / particle.maxLife);

      const offset = i * 9;
      instanceData[offset + 0] = particle.position[0];
      instanceData[offset + 1] = particle.position[1];
      instanceData[offset + 2] = particle.rotation;
      instanceData[offset + 3] = particle.scale[0];
      instanceData[offset + 4] = particle.scale[1];
      instanceData[offset + 5] = particle.color[0];
      instanceData[offset + 6] = particle.color[1];
      instanceData[offset + 7] = particle.color[2];
      instanceData[offset + 8] = particle.color[3];
    }

    quadObject.updateInstanceData((renderer as WebGPURenderer).getDevice()!, instanceData);
    (renderer as WebGPURenderer).render();

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

export function startDemo(type: '3d' | '2d') {
  if (type === '3d') {
    const canvas = document.getElementById('canvas-3d') as HTMLCanvasElement;
    create3DScene(canvas);
  } else {
    const canvas = document.getElementById('canvas-2d') as HTMLCanvasElement;
    create2DScene(canvas);
  }
}
