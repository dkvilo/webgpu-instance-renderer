import { Mat4 } from "../math/mat4"
import { RenderObject } from "./render-object";

export class WebGPURenderer {
  private device: GPUDevice | null = null;
  private context: GPUCanvasContext | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private presentationFormat: GPUTextureFormat = 'bgra8unorm';
  private depthFormat: GPUTextureFormat = 'depth24plus';
  private depthTexture: GPUTexture | null = null;
  private RenderObjects: RenderObject[] = [];
  private cameraUniformBuffer: GPUBuffer | null = null;
  private cameraBindGroup: GPUBindGroup | null = null;
  private viewMatrix: Mat4 = Mat4.identity();
  private projectionMatrix: Mat4 = Mat4.identity();

  /**
   * Get the Device instance
   * @returns GPUDevice
   */
  public getDevice(): GPUDevice | null {
    return this.device;
  }

  /**
   * Get the HTMLCanvas instance
   * @returns HTMLCanvas that is used to preset texture from swapchain
   */
  public getCanvas(): HTMLCanvasElement | null {
    return this.canvas;
  }

  /**
   * Create a new WebGPU renderer
   * @param canvas The canvas element to render to
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  /**
   * Initialize the WebGPU renderer
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<boolean> {
    if (!navigator.gpu) {
      console.error("WebGPU is not supported in this browser.");
      return false;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.error("Couldn't request WebGPU adapter.");
      return false;
    }

    this.device = await adapter.requestDevice();
    if (!this.device) {
      console.error("Couldn't request WebGPU device.");
      return false;
    }

    this.context = this.canvas!.getContext('webgpu');
    if (!this.context) {
      console.error("Couldn't get WebGPU context from canvas.");
      return false;
    }

    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: this.presentationFormat,
      alphaMode: 'premultiplied'
    });

    // Create camera uniform buffer
    this.cameraUniformBuffer = this.device.createBuffer({
      // TODO (David): this is very retarded, find better way to know size, maybe at compile time
      size: 4 * 16 * 2, // ViewProjection matrix (4x4) + View matrix (4x4)
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    const cameraBindGroupLayout = this.device.createBindGroupLayout({
      entries: [{
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' }
      } as any]
    });

    this.cameraBindGroup = this.device.createBindGroup({
      layout: cameraBindGroupLayout,
      entries: [{
        binding: 0,
        resource: { buffer: this.cameraUniformBuffer }
      }]
    });

    return true;
  }

  /**
   * Resize the renderer to match the canvas size
   */
  resize() {
    if (!this.canvas || !this.device || !this.context) return;

    const width = this.canvas.clientWidth * window.devicePixelRatio;
    const height = this.canvas.clientHeight * window.devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;

    if (this.depthTexture) {
      this.depthTexture.destroy();
    }

    this.depthTexture = this.device.createTexture({
      size: { width, height, depthOrArrayLayers: 1 },
      format: this.depthFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
  }

  /**
   * Add an object to the scene
   * @param object The object to add to the scene
   */
  addObject(object: RenderObject) {
    this.RenderObjects.push(object);
    if (this.device) {
      object.initialize(this.device);
    }
  }

  /**
   * Remove an object from the scene
   * @param object The object to remove from the scene
   */
  removeObject(object: RenderObject) {
    const index = this.RenderObjects.indexOf(object);
    if (index !== -1) {
      this.RenderObjects.splice(index, 1);
    }
  }

  /**
   * Update the camera matrices
   * @param viewMatrix The view matrix
   * @param projectionMatrix The projection matrix
   */
  updateCamera(viewMatrix: Mat4, projectionMatrix: Mat4) {
    if (!this.device || !this.cameraUniformBuffer) return;

    // Store matrices
    this.viewMatrix = viewMatrix;
    this.projectionMatrix = projectionMatrix;
    const viewProjectionMatrix = Mat4.multiply(projectionMatrix, viewMatrix);

    // Note (David): write to uniform buffer (above we have bind group for this)
    this.device.queue.writeBuffer(this.cameraUniformBuffer, 0, viewProjectionMatrix.data);
    this.device.queue.writeBuffer(this.cameraUniformBuffer, 64, viewMatrix.data);
  }

  /**
   * Update the camera matrices using Float32Array (for compatibility)
   * @param viewMatrixArray The view matrix as Float32Array
   * @param projectionMatrixArray The projection matrix as Float32Array
   */
  updateCameraFromArrays(viewMatrixArray: Float32Array, projectionMatrixArray: Float32Array) {
    const viewMatrix = new Mat4(viewMatrixArray);
    const projectionMatrix = new Mat4(projectionMatrixArray);

    this.updateCamera(viewMatrix, projectionMatrix);
  }

  /**
   * Render the scene
   */
  render() {
    if (!this.device || !this.context || !this.depthTexture) return;

    const colorTexture = this.context.getCurrentTexture();
    const colorView = colorTexture.createView();
    const depthView = this.depthTexture.createView();

    const commandEncoder = this.device.createCommandEncoder();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: colorView,
        clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store'
      } as any],
      depthStencilAttachment: {
        view: depthView,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store'
      }
    });

    for (const object of this.RenderObjects) {
      renderPass.setPipeline(object.pipeline!);
      renderPass.setBindGroup(0, this.cameraBindGroup!);

      if (object.bindGroup) {
        renderPass.setBindGroup(1, object.bindGroup);
      }

      renderPass.setVertexBuffer(0, object.vertexBuffer!);

      if (object.instanceBuffer) {
        renderPass.setVertexBuffer(1, object.instanceBuffer);
      }

      if (object.indexBuffer) {
        renderPass.setIndexBuffer(object.indexBuffer, 'uint16');
        renderPass.drawIndexed(object.indexCount, object.instanceCount);
      } else {
        renderPass.draw(object.vertexCount, object.instanceCount);
      }
    }

    renderPass.end();
    this.device.queue.submit([commandEncoder.finish()]);
  }

  /**
   * Sets up a perspective camera
   * @param fov Field of view in radians
   * @param aspect Aspect ratio (width / height)
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @param eye Eye position
   * @param target Target position
   * @param up Up vector
   */
  setupPerspectiveCamera(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number] = [0, 1, 0]
  ): void {
    const view = Mat4.lookAt(eye, target, up);
    const projection = Mat4.perspective(fov, aspect, near, far);
    this.updateCamera(view, projection);
  }

  /**
   * Sets up an orthographic camera
   * @param left Left clipping plane
   * @param right Right clipping plane
   * @param bottom Bottom clipping plane
   * @param top Top clipping plane
   * @param near Near clipping plane
   * @param far Far clipping plane
   */
  setupOrthographicCamera(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): void {
    const view = Mat4.identity();
    const projection = Mat4.orthographic(left, right, bottom, top, near, far);
    this.updateCamera(view, projection);
  }

  /**
   * Gets the current view matrix
   * @returns The current view matrix
   */
  getViewMatrix(): Mat4 {
    return this.viewMatrix.clone();
  }

  /**
   * Gets the current projection matrix
   * @returns The current projection matrix
   */
  getProjectionMatrix(): Mat4 {
    return this.projectionMatrix.clone();
  }
}
