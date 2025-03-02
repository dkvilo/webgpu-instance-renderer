export abstract class RenderObject {
  pipeline: GPURenderPipeline | null = null;
  vertexBuffer: GPUBuffer | null = null;
  indexBuffer: GPUBuffer | null = null;
  instanceBuffer: GPUBuffer | null = null;
  bindGroup: GPUBindGroup | null = null;
  vertexCount: number = 0;
  indexCount: number = 0;
  instanceCount: number = 1;

  /**
   * Initialize the object's GPU resources
   * @param device The GPU device
   */
  abstract initialize(device: GPUDevice): void;

  /**
   * Update the object's instance data
   * @param device The GPU device
   * @param instanceData The instance data to update
   */
  updateInstanceData(device: GPUDevice, instanceData: Float32Array) {
    if (!this.instanceBuffer) return;
    device.queue.writeBuffer(this.instanceBuffer, 0, instanceData);
  }
}