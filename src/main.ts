import { startDemo } from "./app";
import { checkWebGPUSupport } from './utils/utils';

const statusElement = document.getElementById('status') as HTMLDivElement;

async function main() {
  const supported = await checkWebGPUSupport();
  if (!supported) {
    statusElement.textContent = 'WebGPU is not supported in your browser.';
    statusElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    return;
  }

  statusElement.textContent = 'WebGPU supported!';

  startDemo('3d');
  startDemo('2d');
}

main();