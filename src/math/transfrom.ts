import { Mat4 } from "./mat4";

export class Transform {
  /**
   * Create a 4x4 identity matrix
   * @returns The identity matrix
   */
  static createIdentity(): Mat4 {
    return Mat4.identity();
  }

  /**
   * Create a 4x4 translation matrix
   * @param x X translation
   * @param y Y translation
   * @param z Z translation
   * @returns The translation matrix
   */
  static createTranslation(x: number, y: number, z: number): Mat4 {
    return Mat4.translation(x, y, z);
  }

  /**
   * Create a 4x4 scale matrix
   * @param x X scale
   * @param y Y scale
   * @param z Z scale
   * @returns The scale matrix
   */
  static createScale(x: number, y: number, z: number): Mat4 {
    return Mat4.scaling(x, y, z);
  }

  /**
   * Create a 4x4 rotation matrix around the X axis
   * @param angle Angle in radians
   * @returns The rotation matrix
   */
  static createRotationX(angle: number): Mat4 {
    return Mat4.rotationX(angle);
  }

  /**
   * Create a 4x4 rotation matrix around the Y axis
   * @param angle Angle in radians
   * @returns The rotation matrix
   */
  static createRotationY(angle: number): Mat4 {
    return Mat4.rotationY(angle);
  }

  /**
   * Create a 4x4 rotation matrix around the Z axis
   * @param angle Angle in radians
   * @returns The rotation matrix
   */
  static createRotationZ(angle: number): Mat4 {
    return Mat4.rotationZ(angle);
  }

  /**
   * Create a 2D transform matrix for 2D instances
   * @param position Position [x, y]
   * @param rotation Rotation in radians
   * @param scale Scale [x, y]
   * @param color Color [r, g, b, a]
   * @returns The 2D transform data
   */
  static create2DTransform(
    position: [number, number],
    rotation: number = 0,
    scale: [number, number] = [1, 1],
    color: [number, number, number, number] = [1, 1, 1, 1]
  ): Float32Array {
    const transform = new Float32Array(9);
    transform[0] = position[0];
    transform[1] = position[1];
    transform[2] = rotation;
    transform[3] = scale[0];
    transform[4] = scale[1];
    transform[5] = color[0];
    transform[6] = color[1];
    transform[7] = color[2];
    transform[8] = color[3];
    return transform;
  }
}
