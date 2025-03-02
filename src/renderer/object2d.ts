import { DEFAULT_2D_SHADER } from "./default-program";
import { RenderObject } from "./render-object";

export class Object2D extends RenderObject {
  private vertices: Float32Array;
  private indices?: Uint16Array;
  private shader: string;
  private instanceDataSize: number;
  
  /**
   * Create a new 2D object
   * @param vertices The vertex data in the format [x, y, u, v, ...]
   * @param indices The index data (optional)
   * @param shader The shader code
   * @param instanceDataSize The size of each instance data in bytes
   */
  constructor(
    vertices: Float32Array,
    indices?: Uint16Array,
    shader?: string,
    instanceDataSize: number = 36
  ) {
    super();
    this.vertices = vertices;
    this.indices = indices;
    this.shader = shader || DEFAULT_2D_SHADER;
    this.instanceDataSize = instanceDataSize;
    
    this.vertexCount = vertices.length / 4; // 4 floats per vertex (position, uv)
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
      mappedAtCreation: true
    });
    
    new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertices);
    this.vertexBuffer.unmap();
    
    if (this.indices) {
      this.indexBuffer = device.createBuffer({
        size: this.indices.byteLength,
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true
      });
      new Uint16Array(this.indexBuffer.getMappedRange()).set(this.indices);
      this.indexBuffer.unmap();
    }
    
    this.instanceBuffer = device.createBuffer({
      size: this.instanceDataSize * this.instanceCount,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    
    const shaderModule = device.createShaderModule({
      code: this.shader
    });
    
    const pipelineLayout = device.createPipelineLayout({
      bindGroupLayouts: [
        device.createBindGroupLayout({
          entries: [{
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: { type: 'uniform' }
          }] as any
        })
      ]
    });
    
    this.pipeline = device.createRenderPipeline({
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: 'vertexMain',
        buffers: [
          // @VertexBuffer @Layout
          {
            arrayStride: 4 * 4, // 4 floats per vertex (position, uv)
            attributes: [
              { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
              { shaderLocation: 1, offset: 2 * 4, format: 'float32x2' }  // uv
            ]
          },
          // @InstanceBuffer @Layout
          {
            arrayStride: this.instanceDataSize,
            stepMode: 'instance',
            attributes: [
              { shaderLocation: 2, offset: 0, format: 'float32x2' },  // position
              { shaderLocation: 3, offset: 8, format: 'float32' },    // rotation
              { shaderLocation: 4, offset: 12, format: 'float32x2' }, // scale
              { shaderLocation: 5, offset: 20, format: 'float32x4' }  // color (RGBA)
            ]
          }
        ] as any
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fragmentMain',
        targets: [{ 
          format: navigator.gpu.getPreferredCanvasFormat(),
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add'
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha', 
              operation: 'add'
            }
          }
        }] as any
      },
      primitive: {
        topology: 'triangle-list'
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus'
      }
    });
  }
  
  /**
   * Set the instance count and resize the instance buffer if needed
   * @param device The GPU device
   * @param count The new instance count
   */
  setInstanceCount(device: GPUDevice, count: number) {
    if (count > this.instanceCount) {
      if (this.instanceBuffer) {
        this.instanceBuffer.destroy();
      }
      
      this.instanceBuffer = device.createBuffer({
        size: this.instanceDataSize * count,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      });
    }
    
    this.instanceCount = count;
  }
}
