/**
 * Check if WebGPU is supported in the current browser
 * @returns Promise that resolves to true if WebGPU is supported, false otherwise
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  if (!navigator.gpu) {
    return false;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error checking WebGPU support:', e);
    return false;
  }
}