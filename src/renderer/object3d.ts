import { Mat4 } from '../math/mat4';

import { DEFAULT_3D_SHADER } from './default-program';
import { RenderObject } from './render-object';

export class Object3D extends RenderObject {
  private vertices: Float32Array;
  private indices?: Uint16Array;
  private shader: string;
  private instanceDataSize: number;

  /**
   * Create a new 3D object
   * @param vertices The vertex data in the format [x, y, z, nx, ny, nz, u, v,
   *     ...]
   * @param indices The index data (optional)
   * @param shader The shader code
   * @param instanceDataSize The size of each instance data in bytes
   */
  constructor(
    vertices: Float32Array, indices?: Uint16Array, shader?: string,
    instanceDataSize: number = 64) {
    super();
    this.vertices = vertices;
    this.indices = indices;
    this.shader = shader || DEFAULT_3D_SHADER;
    this.instanceDataSize = instanceDataSize;

    this.vertexCount =
      vertices.length / 8;  // 8 floats per vertex (position, normal, uv)
    this.indexCount = indices ? indices.length : 0;
  }

  /**
   * Initialize the object's GPU resources
   * @param device The GPU device
   */
  initialize(device: GPUDevice): void {
    this.vertexBuffer = device.createBuffer({
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });

    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertices);
    this.vertexBuffer.unmap();

    if (this.indices) {
      this.indexBuffer = device.createBuffer({
        size: this.indices.byteLength,
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true,
      });
      new Uint16Array(this.indexBuffer.getMappedRange()).set(this.indices);
      this.indexBuffer.unmap();
    }

    this.instanceBuffer = device.createBuffer({
      size: this.instanceDataSize * this.instanceCount,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const materialBuffer = device.createBuffer({
      size: 16,  // min buffer size
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const bindGroupLayout = device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        } as any,
      ],
    });

    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: materialBuffer },
        },
      ],
    });

    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        // @Camera bind group
        device.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.VERTEX,
              buffer: { type: 'uniform' },
            } as any,
          ],
        }),
        bindGroupLayout,
      ],
    });

    const shaderModule = device.createShaderModule({
      code: this.shader,
    });

    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vertexMain',
        buffers: [
          // @VertexBuffer @Layout
          {
            arrayStride: 8 * 4,  // 8 floats per vertex (position, normal, uv)
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x3' },  // position
              {
                shaderLocation: 1,
                offset: 3 * 4,
                format: 'float32x3'
              },  // normal
              { shaderLocation: 2, offset: 6 * 4, format: 'float32x2' },  // uv
            ],
          },
          // @InstanceBuffer @Layout
          {
            arrayStride: this.instanceDataSize,
            stepMode: 'instance',
            attributes: [
              {
                shaderLocation: 3,
                offset: 0,
                format: 'float32x4'
              },  // modelMatrix (row 0)
              {
                shaderLocation: 4,
                offset: 16,
                format: 'float32x4'
              },  // modelMatrix (row 1)
              {
                shaderLocation: 5,
                offset: 32,
                format: 'float32x4'
              },  // modelMatrix (row 2)
              {
                shaderLocation: 6,
                offset: 48,
                format: 'float32x4'
              },  // modelMatrix (row 3)
            ],
          },
        ] as any,
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fragmentMain',
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    });
  }

  /**
   * Set the instance count and resize the instance buffer if needed
   * @param device The GPU device
   * @param count The new instance count
   */
  setInstanceCount(device: GPUDevice, count: number) {
    if (count > this.instanceCount) {
      // Resize the instance buffer if needed
      if (this.instanceBuffer) {
        this.instanceBuffer.destroy();
      }

      this.instanceBuffer = device.createBuffer({
        size: this.instanceDataSize * count,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
    }

    this.instanceCount = count;
  }

  /**
   * Update instance data using Mat4 matrices
   * @param device The GPU device
   * @param matrices Array of transformation matrices
   */
  updateInstanceMatrices(device: GPUDevice, matrices: Mat4[]) {
    if (!this.instanceBuffer) return;

    // merge into a single Float32Array
    const instanceData = new Float32Array(matrices.length * 16);
    for (let i = 0; i < matrices.length; i++) {
      const offset = i * 16;
      for (let j = 0; j < 16; j++) {
        instanceData[offset + j] = matrices[i].data[j];
      }
    }

    device.queue.writeBuffer(this.instanceBuffer, 0, instanceData);
  }
}
