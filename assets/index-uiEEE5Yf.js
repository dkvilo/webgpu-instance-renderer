(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();class v{data;constructor(t){if(this.data=new Float32Array(16),t)for(let e=0;e<Math.min(t.length,16);e++)this.data[e]=t[e]}clone(){return new v(this.data)}identity(){return this.data.fill(0),this.data[0]=1,this.data[5]=1,this.data[10]=1,this.data[15]=1,this}static identity(){return new v().identity()}multiply(t){const e=this.data,i=t.data,n=new Float32Array(16),a=e[0],r=e[1],o=e[2],h=e[3],c=e[4],d=e[5],p=e[6],g=e[7],m=e[8],u=e[9],f=e[10],l=e[11],s=e[12],x=e[13],w=e[14],P=e[15],B=i[0],C=i[1],M=i[2],U=i[3],G=i[4],S=i[5],A=i[6],O=i[7],R=i[8],z=i[9],b=i[10],L=i[11],E=i[12],T=i[13],F=i[14],V=i[15];return n[0]=a*B+r*G+o*R+h*E,n[1]=a*C+r*S+o*z+h*T,n[2]=a*M+r*A+o*b+h*F,n[3]=a*U+r*O+o*L+h*V,n[4]=c*B+d*G+p*R+g*E,n[5]=c*C+d*S+p*z+g*T,n[6]=c*M+d*A+p*b+g*F,n[7]=c*U+d*O+p*L+g*V,n[8]=m*B+u*G+f*R+l*E,n[9]=m*C+u*S+f*z+l*T,n[10]=m*M+u*A+f*b+l*F,n[11]=m*U+u*O+f*L+l*V,n[12]=s*B+x*G+w*R+P*E,n[13]=s*C+x*S+w*z+P*T,n[14]=s*M+x*A+w*b+P*F,n[15]=s*U+x*O+w*L+P*V,this.data=n,this}static multiply(t,e){return t.clone().multiply(e)}transpose(){const t=this.data,e=new Float32Array(16);return e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15],this.data=e,this}determinant(){const t=this.data,e=t[0],i=t[1],n=t[2],a=t[3],r=t[4],o=t[5],h=t[6],c=t[7],d=t[8],p=t[9],g=t[10],m=t[11],u=t[12],f=t[13],l=t[14],s=t[15],x=e*o-i*r,w=e*h-n*r,P=e*c-a*r,B=i*h-n*o,C=i*c-a*o,M=n*c-a*h,U=d*f-p*u,G=d*l-g*u,S=d*s-m*u,A=p*l-g*f,O=p*s-m*f,R=g*s-m*l;return x*R-w*O+P*A+B*S-C*G+M*U}invert(){const t=this.data,e=new Float32Array(16),i=t[0],n=t[1],a=t[2],r=t[3],o=t[4],h=t[5],c=t[6],d=t[7],p=t[8],g=t[9],m=t[10],u=t[11],f=t[12],l=t[13],s=t[14],x=t[15],w=i*h-n*o,P=i*c-a*o,B=i*d-r*o,C=n*c-a*h,M=n*d-r*h,U=a*d-r*c,G=p*l-g*f,S=p*s-m*f,A=p*x-u*f,O=g*s-m*l,R=g*x-u*l,z=m*x-u*s;let b=w*z-P*R+B*O+C*A-M*S+U*G;return b?(b=1/b,e[0]=(h*z-c*R+d*O)*b,e[1]=(a*R-n*z-r*O)*b,e[2]=(l*U-s*M+x*C)*b,e[3]=(m*M-g*U-u*C)*b,e[4]=(c*A-o*z-d*S)*b,e[5]=(i*z-a*A+r*S)*b,e[6]=(s*B-f*U-x*P)*b,e[7]=(p*U-m*B+u*P)*b,e[8]=(o*R-h*A+d*G)*b,e[9]=(n*A-i*R-r*G)*b,e[10]=(f*M-l*B+x*w)*b,e[11]=(g*B-p*M-u*w)*b,e[12]=(h*S-o*O-c*G)*b,e[13]=(i*O-n*S+a*G)*b,e[14]=(l*P-f*C-s*w)*b,e[15]=(p*C-g*P+m*w)*b,this.data=e,this):null}translation(t,e,i){return this.identity(),this.data[12]=t,this.data[13]=e,this.data[14]=i,this}static translation(t,e,i){return new v().translation(t,e,i)}scaling(t,e,i){return this.identity(),this.data[0]=t,this.data[5]=e,this.data[10]=i,this}static scaling(t,e,i){return new v().scaling(t,e,i)}rotationX(t){this.identity();const e=Math.cos(t),i=Math.sin(t);return this.data[5]=e,this.data[6]=i,this.data[9]=-i,this.data[10]=e,this}static rotationX(t){return new v().rotationX(t)}rotationY(t){this.identity();const e=Math.cos(t),i=Math.sin(t);return this.data[0]=e,this.data[2]=-i,this.data[8]=i,this.data[10]=e,this}static rotationY(t){return new v().rotationY(t)}rotationZ(t){this.identity();const e=Math.cos(t),i=Math.sin(t);return this.data[0]=e,this.data[1]=i,this.data[4]=-i,this.data[5]=e,this}static rotationZ(t){return new v().rotationZ(t)}perspective(t,e,i,n){this.data.fill(0);const a=1/Math.tan(t/2);return this.data[0]=a/e,this.data[5]=a,this.data[10]=(n+i)/(i-n),this.data[11]=-1,this.data[14]=2*n*i/(i-n),this}static perspective(t,e,i,n){return new v().perspective(t,e,i,n)}orthographic(t,e,i,n,a,r){return this.data.fill(0),this.data[0]=2/(e-t),this.data[5]=2/(n-i),this.data[10]=2/(a-r),this.data[12]=(t+e)/(t-e),this.data[13]=(i+n)/(i-n),this.data[14]=(a+r)/(a-r),this.data[15]=1,this}static orthographic(t,e,i,n,a,r){return new v().orthographic(t,e,i,n,a,r)}lookAt(t,e,i=[0,1,0]){const n=D.normalize(D.subtract(t,e));if(n[0]===0&&n[1]===0&&n[2]===0)return this.identity();const a=D.normalize(D.cross(i,n));if(a[0]===0&&a[1]===0&&a[2]===0){const o=Math.abs(n[0])<.9?[1,0,0]:[0,0,1];return this.lookAt(t,e,o)}const r=D.cross(n,a);return this.data[0]=a[0],this.data[1]=r[0],this.data[2]=n[0],this.data[3]=0,this.data[4]=a[1],this.data[5]=r[1],this.data[6]=n[1],this.data[7]=0,this.data[8]=a[2],this.data[9]=r[2],this.data[10]=n[2],this.data[11]=0,this.data[12]=-D.dot(a,t),this.data[13]=-D.dot(r,t),this.data[14]=-D.dot(n,t),this.data[15]=1,this}static lookAt(t,e,i=[0,1,0]){return new v().lookAt(t,e,i)}}class D{static normalize(t){const e=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return e>1e-5?[t[0]/e,t[1]/e,t[2]/e]:[0,0,0]}static cross(t,e){return[t[1]*e[2]-t[2]*e[1],t[2]*e[0]-t[0]*e[2],t[0]*e[1]-t[1]*e[0]]}static dot(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}static subtract(t,e){return[t[0]-e[0],t[1]-e[1],t[2]-e[2]]}static add(t,e){return[t[0]+e[0],t[1]+e[1],t[2]+e[2]]}static scale(t,e){return[t[0]*e,t[1]*e,t[2]*e]}static magnitude(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2])}}class N{device=null;context=null;canvas=null;presentationFormat="bgra8unorm";depthFormat="depth24plus";depthTexture=null;RenderObjects=[];cameraUniformBuffer=null;cameraBindGroup=null;viewMatrix=v.identity();projectionMatrix=v.identity();getDevice(){return this.device}getCanvas(){return this.canvas}constructor(t){this.canvas=t}async initialize(){if(!navigator.gpu)return console.error("WebGPU is not supported in this browser."),!1;const t=await navigator.gpu.requestAdapter();if(!t)return console.error("Couldn't request WebGPU adapter."),!1;if(this.device=await t.requestDevice(),!this.device)return console.error("Couldn't request WebGPU device."),!1;if(this.context=this.canvas.getContext("webgpu"),!this.context)return console.error("Couldn't get WebGPU context from canvas."),!1;this.presentationFormat=navigator.gpu.getPreferredCanvasFormat(),this.context.configure({device:this.device,format:this.presentationFormat,alphaMode:"premultiplied"}),this.cameraUniformBuffer=this.device.createBuffer({size:4*16*2,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});const e=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]});return this.cameraBindGroup=this.device.createBindGroup({layout:e,entries:[{binding:0,resource:{buffer:this.cameraUniformBuffer}}]}),!0}resize(){if(!this.canvas||!this.device||!this.context)return;const t=this.canvas.clientWidth*window.devicePixelRatio,e=this.canvas.clientHeight*window.devicePixelRatio;this.canvas.width=t,this.canvas.height=e,this.depthTexture&&this.depthTexture.destroy(),this.depthTexture=this.device.createTexture({size:{width:t,height:e,depthOrArrayLayers:1},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT})}addObject(t){this.RenderObjects.push(t),this.device&&t.initialize(this.device)}removeObject(t){const e=this.RenderObjects.indexOf(t);e!==-1&&this.RenderObjects.splice(e,1)}updateCamera(t,e){if(!this.device||!this.cameraUniformBuffer)return;this.viewMatrix=t,this.projectionMatrix=e;const i=v.multiply(e,t);this.device.queue.writeBuffer(this.cameraUniformBuffer,0,i.data),this.device.queue.writeBuffer(this.cameraUniformBuffer,64,t.data)}updateCameraFromArrays(t,e){const i=new v(t),n=new v(e);this.updateCamera(i,n)}render(){if(!this.device||!this.context||!this.depthTexture)return;const e=this.context.getCurrentTexture().createView(),i=this.depthTexture.createView(),n=this.device.createCommandEncoder(),a=n.beginRenderPass({colorAttachments:[{view:e,clearValue:{r:.1,g:.1,b:.1,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:i,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});for(const r of this.RenderObjects)a.setPipeline(r.pipeline),a.setBindGroup(0,this.cameraBindGroup),r.bindGroup&&a.setBindGroup(1,r.bindGroup),a.setVertexBuffer(0,r.vertexBuffer),r.instanceBuffer&&a.setVertexBuffer(1,r.instanceBuffer),r.indexBuffer?(a.setIndexBuffer(r.indexBuffer,"uint16"),a.drawIndexed(r.indexCount,r.instanceCount)):a.draw(r.vertexCount,r.instanceCount);a.end(),this.device.queue.submit([n.finish()])}setupPerspectiveCamera(t,e,i,n,a,r,o=[0,1,0]){const h=v.lookAt(a,r,o),c=v.perspective(t,e,i,n);this.updateCamera(h,c)}setupOrthographicCamera(t,e,i,n,a,r){const o=v.identity(),h=v.orthographic(t,e,i,n,a,r);this.updateCamera(o,h)}getViewMatrix(){return this.viewMatrix.clone()}getProjectionMatrix(){return this.projectionMatrix.clone()}}const _=`
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
}`,H=`
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
}`;class q{pipeline=null;vertexBuffer=null;indexBuffer=null;instanceBuffer=null;bindGroup=null;vertexCount=0;indexCount=0;instanceCount=1;updateInstanceData(t,e){this.instanceBuffer&&t.queue.writeBuffer(this.instanceBuffer,0,e)}}class I extends q{vertices;indices;shader;instanceDataSize;constructor(t,e,i,n=64){super(),this.vertices=t,this.indices=e,this.shader=i||_,this.instanceDataSize=n,this.vertexCount=t.length/8,this.indexCount=e?e.length:0}initialize(t){this.vertexBuffer=t.createBuffer({size:this.vertices.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertices),this.vertexBuffer.unmap(),this.indices&&(this.indexBuffer=t.createBuffer({size:this.indices.byteLength,usage:GPUBufferUsage.INDEX,mappedAtCreation:!0}),new Uint16Array(this.indexBuffer.getMappedRange()).set(this.indices),this.indexBuffer.unmap()),this.instanceBuffer=t.createBuffer({size:this.instanceDataSize*this.instanceCount,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});const e=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),i=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]});this.bindGroup=t.createBindGroup({layout:i,entries:[{binding:0,resource:{buffer:e}}]});const n=t.createPipelineLayout({bindGroupLayouts:[t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),i]}),a=t.createShaderModule({code:this.shader});this.pipeline=t.createRenderPipeline({layout:n,vertex:{module:a,entryPoint:"vertexMain",buffers:[{arrayStride:8*4,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:3*4,format:"float32x3"},{shaderLocation:2,offset:6*4,format:"float32x2"}]},{arrayStride:this.instanceDataSize,stepMode:"instance",attributes:[{shaderLocation:3,offset:0,format:"float32x4"},{shaderLocation:4,offset:16,format:"float32x4"},{shaderLocation:5,offset:32,format:"float32x4"},{shaderLocation:6,offset:48,format:"float32x4"}]}]},fragment:{module:a,entryPoint:"fragmentMain",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}})}setInstanceCount(t,e){e>this.instanceCount&&(this.instanceBuffer&&this.instanceBuffer.destroy(),this.instanceBuffer=t.createBuffer({size:this.instanceDataSize*e,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})),this.instanceCount=e}updateInstanceMatrices(t,e){if(!this.instanceBuffer)return;const i=new Float32Array(e.length*16);for(let n=0;n<e.length;n++){const a=n*16;for(let r=0;r<16;r++)i[a+r]=e[n].data[r]}t.queue.writeBuffer(this.instanceBuffer,0,i)}}class k extends q{vertices;indices;shader;instanceDataSize;constructor(t,e,i,n=36){super(),this.vertices=t,this.indices=e,this.shader=i||H,this.instanceDataSize=n,this.vertexCount=t.length/4,this.indexCount=e?e.length:0}initialize(t){this.vertexBuffer=t.createBuffer({size:this.vertices.byteLength,usage:GPUBufferUsage.VERTEX,mappedAtCreation:!0}),new Float32Array(this.vertexBuffer.getMappedRange()).set(this.vertices),this.vertexBuffer.unmap(),this.indices&&(this.indexBuffer=t.createBuffer({size:this.indices.byteLength,usage:GPUBufferUsage.INDEX,mappedAtCreation:!0}),new Uint16Array(this.indexBuffer.getMappedRange()).set(this.indices),this.indexBuffer.unmap()),this.instanceBuffer=t.createBuffer({size:this.instanceDataSize*this.instanceCount,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});const e=t.createShaderModule({code:this.shader}),i=t.createPipelineLayout({bindGroupLayouts:[t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})]});this.pipeline=t.createRenderPipeline({layout:i,vertex:{module:e,entryPoint:"vertexMain",buffers:[{arrayStride:4*4,attributes:[{shaderLocation:0,offset:0,format:"float32x2"},{shaderLocation:1,offset:2*4,format:"float32x2"}]},{arrayStride:this.instanceDataSize,stepMode:"instance",attributes:[{shaderLocation:2,offset:0,format:"float32x2"},{shaderLocation:3,offset:8,format:"float32"},{shaderLocation:4,offset:12,format:"float32x2"},{shaderLocation:5,offset:20,format:"float32x4"}]}]},fragment:{module:e,entryPoint:"fragmentMain",targets:[{format:navigator.gpu.getPreferredCanvasFormat(),blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}})}setInstanceCount(t,e){e>this.instanceCount&&(this.instanceBuffer&&this.instanceBuffer.destroy(),this.instanceBuffer=t.createBuffer({size:this.instanceDataSize*e,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})),this.instanceCount=e}}class W{static createQuad(){const t=new Float32Array([-.5,-.5,0,0,.5,-.5,1,0,.5,.5,1,1,-.5,.5,0,1]),e=new Uint16Array([0,1,2,0,2,3]);return{vertices:t,indices:e}}static createCube(){const t=new Float32Array([-.5,-.5,.5,0,0,1,0,0,.5,-.5,.5,0,0,1,1,0,.5,.5,.5,0,0,1,1,1,-.5,.5,.5,0,0,1,0,1,-.5,-.5,-.5,0,0,-1,1,0,-.5,.5,-.5,0,0,-1,1,1,.5,.5,-.5,0,0,-1,0,1,.5,-.5,-.5,0,0,-1,0,0,-.5,.5,-.5,0,1,0,0,1,-.5,.5,.5,0,1,0,0,0,.5,.5,.5,0,1,0,1,0,.5,.5,-.5,0,1,0,1,1,-.5,-.5,-.5,0,-1,0,1,1,.5,-.5,-.5,0,-1,0,0,1,.5,-.5,.5,0,-1,0,0,0,-.5,-.5,.5,0,-1,0,1,0,.5,-.5,-.5,1,0,0,1,0,.5,.5,-.5,1,0,0,1,1,.5,.5,.5,1,0,0,0,1,.5,-.5,.5,1,0,0,0,0,-.5,-.5,-.5,-1,0,0,0,0,-.5,-.5,.5,-1,0,0,1,0,-.5,.5,.5,-1,0,0,1,1,-.5,.5,-.5,-1,0,0,0,1]),e=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);return{vertices:t,indices:e}}static createSphere(t=1,e=16,i=16){const n=[],a=[];for(let r=0;r<=e;r++){const o=r*Math.PI/e,h=Math.sin(o),c=Math.cos(o);for(let d=0;d<=i;d++){const p=d*2*Math.PI/i,g=Math.sin(p),u=Math.cos(p)*h,f=c,l=g*h,s=1-d/i,x=1-r/e;n.push(t*u,t*f,t*l,u,f,l,s,x)}}for(let r=0;r<e;r++)for(let o=0;o<i;o++){const h=r*(i+1)+o,c=h+i+1;a.push(h,h+1,c),a.push(c,h+1,c+1)}return{vertices:new Float32Array(n),indices:new Uint16Array(a)}}static createPlane(t=1,e=1,i=1,n=1){const a=[],r=[],o=t/2,h=e/2,c=i,d=n,p=t/c,g=e/d;for(let m=0;m<=d;m++){const u=m*g-h;for(let f=0;f<=c;f++){const l=f*p-o;a.push(l,0,u,0,1,0,f/c,1-m/d)}}for(let m=0;m<d;m++)for(let u=0;u<c;u++){const f=u+(c+1)*m,l=u+(c+1)*(m+1),s=u+1+(c+1)*(m+1),x=u+1+(c+1)*m;r.push(f,l,x),r.push(l,s,x)}return{vertices:new Float32Array(a),indices:new Uint16Array(r)}}}async function Y(y){if(!y)return console.error("Canvas element not found"),null;const t=new N(y);return await t.initialize()?(y.width=window.innerWidth,y.height=window.innerHeight,t.resize(),t):(console.error("Failed to initialize WebGPU renderer"),null)}async function Z(y){const t=await Y(y);if(!t)return;const{vertices:e,indices:i}=W.createSphere(.1,16,16),n=new I(e,i);t.addObject(n);const a=t.getCanvas().width/t.getCanvas().height;t.setupPerspectiveCamera(Math.PI/4,a,.1,100,[0,0,0],[0,0,0],[0,1,0]);const r=1e3;n.setInstanceCount(t.getDevice(),r);const o=Array(r).fill(null).map(()=>v.identity());let h=0;function c(d){const p=d-h;h=d;for(let g=0;g<r;g++){const m=Math.sin(g*.21+p*.001)*3,u=Math.sin(g*.37+d*.001)*2,f=-5+Math.sin(g*.13+d*.001)*3,l=.2+Math.sin(g+d*.001)*.05,s=v.translation(m,u,f),x=v.scaling(l,l,l),w=v.rotationX(d*5e-4*(g%1+1)),P=v.rotationY(d*3e-4*(g%5+1)),B=s.multiply(P).multiply(w).multiply(x);o[g]=B}n instanceof I&&n.updateInstanceMatrices(t.getDevice(),o),t.render(),requestAnimationFrame(c)}requestAnimationFrame(c)}async function Q(y){const t=await Y(y);if(!t)return;const e=t.getCanvas().width,i=t.getCanvas().height;t.setupOrthographicCamera(0,e,i,0,-1,1);const{vertices:n,indices:a}=W.createQuad(),r=new k(n,a);t.addObject(r);const o=1e4;r.setInstanceCount(t.getDevice(),o);let h=0,c=0;document.addEventListener("mousemove",u=>{const f=y.getBoundingClientRect(),l=y.width/f.width,s=y.height/f.height;h=(u.clientX-f.left)*l,c=(u.clientY-f.top)*s});const d=[];for(let u=0;u<o;u++)d.push({position:[e/2,i/2],velocity:[(Math.random()-.5)*500,(Math.random()-.5)*500],rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-.5)*2,scale:[10,20],color:[Math.random(),Math.random(),Math.random(),1],life:0,maxLife:1+Math.random()*4});const p=new Float32Array(o*9);let g=0;function m(u){const f=(u-g)/1e3;g=u;for(let l=0;l<o;l++){const s=d[l];s.life+=f,s.life>=s.maxLife&&(s.position=[h,c],s.velocity=[(Math.random()-.5)*500,(Math.random()-.5)*500],s.life=0,s.color[3]=1),s.position[0]+=s.velocity[0]*f,s.position[1]+=s.velocity[1]*f,s.rotation+=s.rotationSpeed*f,s.color[3]=1-s.life/s.maxLife;const x=l*9;p[x+0]=s.position[0],p[x+1]=s.position[1],p[x+2]=s.rotation,p[x+3]=s.scale[0],p[x+4]=s.scale[1],p[x+5]=s.color[0],p[x+6]=s.color[1],p[x+7]=s.color[2],p[x+8]=s.color[3]}r.updateInstanceData(t.getDevice(),p),t.render(),requestAnimationFrame(m)}requestAnimationFrame(m)}function X(y){if(y==="3d"){const t=document.getElementById("canvas-3d");Z(t)}else{const t=document.getElementById("canvas-2d");Q(t)}}async function K(){if(!navigator.gpu)return!1;try{return!!await navigator.gpu.requestAdapter()}catch(y){return console.error("Error checking WebGPU support:",y),!1}}const j=document.getElementById("status");async function J(){if(!await K()){j.textContent="WebGPU is not supported in your browser.",j.style.backgroundColor="rgba(255, 0, 0, 0.5)";return}j.textContent="WebGPU supported!",X("3d"),X("2d")}J();
