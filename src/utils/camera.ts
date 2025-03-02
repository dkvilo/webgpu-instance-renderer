import { Mat4 } from "../math/mat4";

export class Camera {
  /**
   * Create a perspective camera
   * @param fov Field of view in radians
   * @param aspect Aspect ratio (width / height)
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns The projection matrix
   */
  static createPerspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    return Mat4.perspective(fov, aspect, near, far);
  }

  /**
   * Create an orthographic camera
   * @param left Left clipping plane
   * @param right Right clipping plane
   * @param bottom Bottom clipping plane
   * @param top Top clipping plane
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns The projection matrix
   */
  static createOrthographic(
    left: number, right: number,
    bottom: number, top: number,
    near: number, far: number
  ): Mat4 {
    return Mat4.orthographic(left, right, bottom, top, near, far);
  }

  /**
   * Create a look-at view matrix
   * @param eye Eye position
   * @param target Target position
   * @param up Up vector
   * @returns The view matrix
   */
  static createLookAt(
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number] = [0, 1, 0]
  ): Mat4 {
    return Mat4.lookAt(eye, target, up);
  }
}
