/**
 * Simple matrix library for WebGPU renderer
 * Primarily focused on 4x4 matrices for 3D transformations
 */

/**
 * Matrix4 class for handling 4x4 matrix operations
 */
export class Mat4 {
  /**
   * The internal Float32Array storage for the matrix data
   */
  public data: Float32Array;

  /**
   * Creates a new 4x4 matrix
   * @param values Optional initial values for the matrix
   */
  constructor(values?: number[] | Float32Array) {
    this.data = new Float32Array(16);

    if (values) {
      for (let i = 0; i < Math.min(values.length, 16); i++) {
        this.data[i] = values[i];
      }
    }
  }

  /**
   * Creates a new matrix with the same values as this one
   * @returns A new matrix with the same values
   */
  clone(): Mat4 {
    return new Mat4(this.data);
  }

  /**
   * Sets this matrix to the identity matrix
   * @returns This matrix for chaining
   */
  identity(): Mat4 {
    this.data.fill(0);
    this.data[0] = 1;
    this.data[5] = 1;
    this.data[10] = 1;
    this.data[15] = 1;
    return this;
  }

  /**
   * Creates a new identity matrix
   * @returns A new identity matrix
   */
  static identity(): Mat4 {
    const mat = new Mat4();
    return mat.identity();
  }

  /**
   * Multiplies this matrix by another matrix and stores the result in this matrix
   * @param other The matrix to multiply by
   * @returns This matrix for chaining
   */
  multiply(other: Mat4): Mat4 {
    const a = this.data;
    const b = other.data;
    const res = new Float32Array(16);

    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
    const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
    const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
    const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

    res[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
    res[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
    res[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
    res[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;
    res[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
    res[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
    res[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
    res[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;
    res[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
    res[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
    res[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
    res[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;
    res[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
    res[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
    res[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
    res[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;

    this.data = res;
    return this;
  }

  /**
   * Multiplies two matrices and returns a new matrix with the result
   * @param a The first matrix
   * @param b The second matrix
   * @returns A new matrix with the result
   */
  static multiply(a: Mat4, b: Mat4): Mat4 {
    return a.clone().multiply(b);
  }

  /**
   * Transposes this matrix
   * @returns This matrix for chaining
   */
  transpose(): Mat4 {
    const a = this.data;
    const res = new Float32Array(16);

    res[0] = a[0];
    res[1] = a[4];
    res[2] = a[8];
    res[3] = a[12];
    res[4] = a[1];
    res[5] = a[5];
    res[6] = a[9];
    res[7] = a[13];
    res[8] = a[2];
    res[9] = a[6];
    res[10] = a[10];
    res[11] = a[14];
    res[12] = a[3];
    res[13] = a[7];
    res[14] = a[11];
    res[15] = a[15];

    this.data = res;
    return this;
  }

  /**
   * Calculates the determinant of this matrix
   * @returns The determinant
   */
  determinant(): number {
    const a = this.data;
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  /**
   * Inverts this matrix
   * @returns This matrix for chaining, or null if the matrix is not invertible
   */
  invert(): Mat4 | null {
    const a = this.data;
    const res = new Float32Array(16);

    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null; // Not invertible
    }
    det = 1.0 / det;

    res[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    res[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    res[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    res[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    res[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    res[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    res[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    res[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    res[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    res[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    res[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    res[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    res[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    res[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    res[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    res[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    this.data = res;
    return this;
  }

  /**
   * Creates a translation matrix
   * @param x X translation
   * @param y Y translation
   * @param z Z translation
   * @returns This matrix for chaining
   */
  translation(x: number, y: number, z: number): Mat4 {
    this.identity();

    this.data[12] = x;
    this.data[13] = y;
    this.data[14] = z;

    return this;
  }

  /**
   * Creates a new translation matrix
   * @param x X translation
   * @param y Y translation
   * @param z Z translation
   * @returns A new translation matrix
   */
  static translation(x: number, y: number, z: number): Mat4 {
    return new Mat4().translation(x, y, z);
  }

  /**
   * Creates a scaling matrix
   * @param x X scale
   * @param y Y scale
   * @param z Z scale
   * @returns This matrix for chaining
   */
  scaling(x: number, y: number, z: number): Mat4 {
    this.identity();

    this.data[0] = x;
    this.data[5] = y;
    this.data[10] = z;

    return this;
  }

  /**
   * Creates a new scaling matrix
   * @param x X scale
   * @param y Y scale
   * @param z Z scale
   * @returns A new scaling matrix
   */
  static scaling(x: number, y: number, z: number): Mat4 {
    return new Mat4().scaling(x, y, z);
  }

  /**
   * Creates a rotation matrix around the X axis
   * @param angle Angle in radians
   * @returns This matrix for chaining
   */
  rotationX(angle: number): Mat4 {
    this.identity();

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    this.data[5] = c;
    this.data[6] = s;
    this.data[9] = -s;
    this.data[10] = c;

    return this;
  }

  /**
   * Creates a new rotation matrix around the X axis
   * @param angle Angle in radians
   * @returns A new rotation matrix
   */
  static rotationX(angle: number): Mat4 {
    return new Mat4().rotationX(angle);
  }

  /**
   * Creates a rotation matrix around the Y axis
   * @param angle Angle in radians
   * @returns This matrix for chaining
   */
  rotationY(angle: number): Mat4 {
    this.identity();

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    this.data[0] = c;
    this.data[2] = -s;
    this.data[8] = s;
    this.data[10] = c;

    return this;
  }

  /**
   * Creates a new rotation matrix around the Y axis
   * @param angle Angle in radians
   * @returns A new rotation matrix
   */
  static rotationY(angle: number): Mat4 {
    return new Mat4().rotationY(angle);
  }

  /**
   * Creates a rotation matrix around the Z axis
   * @param angle Angle in radians
   * @returns This matrix for chaining
   */
  rotationZ(angle: number): Mat4 {
    this.identity();

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    this.data[0] = c;
    this.data[1] = s;
    this.data[4] = -s;
    this.data[5] = c;

    return this;
  }

  /**
   * Creates a new rotation matrix around the Z axis
   * @param angle Angle in radians
   * @returns A new rotation matrix
   */
  static rotationZ(angle: number): Mat4 {
    return new Mat4().rotationZ(angle);
  }

  /**
   * Creates a perspective projection matrix
   * @param fov Field of view in radians
   * @param aspect Aspect ratio (width / height)
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns This matrix for chaining
   */
  perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    this.data.fill(0);

    const f = 1.0 / Math.tan(fov / 2);

    this.data[0] = f / aspect;
    this.data[5] = f;
    this.data[10] = (far + near) / (near - far);
    this.data[11] = -1;
    this.data[14] = (2 * far * near) / (near - far);

    return this;
  }

  /**
   * Creates a new perspective projection matrix
   * @param fov Field of view in radians
   * @param aspect Aspect ratio (width / height)
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns A new perspective projection matrix
   */
  static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    return new Mat4().perspective(fov, aspect, near, far);
  }

  /**
   * Creates an orthographic projection matrix
   * @param left Left clipping plane
   * @param right Right clipping plane
   * @param bottom Bottom clipping plane
   * @param top Top clipping plane
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns This matrix for chaining
   */
  orthographic(
    left: number, right: number,
    bottom: number, top: number,
    near: number, far: number
  ): Mat4 {
    this.data.fill(0);

    this.data[0] = 2 / (right - left);
    this.data[5] = 2 / (top - bottom);
    this.data[10] = 2 / (near - far);

    this.data[12] = (left + right) / (left - right);
    this.data[13] = (bottom + top) / (bottom - top);
    this.data[14] = (near + far) / (near - far);
    this.data[15] = 1;

    return this;
  }

  /**
   * Creates a new orthographic projection matrix
   * @param left Left clipping plane
   * @param right Right clipping plane
   * @param bottom Bottom clipping plane
   * @param top Top clipping plane
   * @param near Near clipping plane
   * @param far Far clipping plane
   * @returns A new orthographic projection matrix
   */
  static orthographic(
    left: number, right: number,
    bottom: number, top: number,
    near: number, far: number
  ): Mat4 {
    return new Mat4().orthographic(left, right, bottom, top, near, far);
  }

  /**
   * Creates a "look at" view matrix
   * @param eye Eye position
   * @param target Target position
   * @param up Up vector
   * @returns This matrix for chaining
   */
  lookAt(
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number] = [0, 1, 0]
  ): Mat4 {
    const z = Vec3.normalize(Vec3.subtract(eye, target));

    // Handle case where eye and target are the same position
    if (z[0] === 0 && z[1] === 0 && z[2] === 0) {
      return this.identity();
    }

    const x = Vec3.normalize(Vec3.cross(up, z));

    // Handle case where up and z are parallel
    if (x[0] === 0 && x[1] === 0 && x[2] === 0) {
      // Choose a different up vector
      const newUp: [number, number, number] =
        Math.abs(z[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1];
      return this.lookAt(eye, target, newUp);
    }

    const y = Vec3.cross(z, x);

    this.data[0] = x[0];
    this.data[1] = y[0];
    this.data[2] = z[0];
    this.data[3] = 0;

    this.data[4] = x[1];
    this.data[5] = y[1];
    this.data[6] = z[1];
    this.data[7] = 0;

    this.data[8] = x[2];
    this.data[9] = y[2];
    this.data[10] = z[2];
    this.data[11] = 0;

    this.data[12] = -Vec3.dot(x, eye);
    this.data[13] = -Vec3.dot(y, eye);
    this.data[14] = -Vec3.dot(z, eye);
    this.data[15] = 1;

    return this;
  }

  /**
   * Creates a new "look at" view matrix
   * @param eye Eye position
   * @param target Target position
   * @param up Up vector
   * @returns A new "look at" view matrix
   */
  static lookAt(
    eye: [number, number, number],
    target: [number, number, number],
    up: [number, number, number] = [0, 1, 0]
  ): Mat4 {
    return new Mat4().lookAt(eye, target, up);
  }
}

/**
 * Vector3 class for 3D vector operations
 */
export class Vec3 {
  /**
   * Normalizes a 3-component vector
   * @param v The vector to normalize
   * @returns The normalized vector
   */
  static normalize(v: [number, number, number]): [number, number, number] {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    }
    return [0, 0, 0];
  }

  /**
   * Computes the cross product of two 3-component vectors
   * @param a The first vector
   * @param b The second vector
   * @returns The cross product vector
   */
  static cross(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  /**
   * Computes the dot product of two 3-component vectors
   * @param a The first vector
   * @param b The second vector
   * @returns The dot product
   */
  static dot(a: [number, number, number], b: [number, number, number]): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  /**
   * Subtracts vector b from vector a
   * @param a The first vector
   * @param b The second vector
   * @returns The resulting vector
   */
  static subtract(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [
      a[0] - b[0],
      a[1] - b[1],
      a[2] - b[2]
    ];
  }

  /**
   * Adds vector b to vector a
   * @param a The first vector
   * @param b The second vector
   * @returns The resulting vector
   */
  static add(a: [number, number, number], b: [number, number, number]): [number, number, number] {
    return [
      a[0] + b[0],
      a[1] + b[1],
      a[2] + b[2]
    ];
  }

  /**
   * Scales a vector by a scalar
   * @param v The vector
   * @param s The scalar
   * @returns The scaled vector
   */
  static scale(v: [number, number, number], s: number): [number, number, number] {
    return [
      v[0] * s,
      v[1] * s,
      v[2] * s
    ];
  }

  /**
   * Calculates the length of a vector
   * @param v The vector
   * @returns The length
   */
  static magnitude(v: [number, number, number]): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }
}

/**
 * Vector2 class for 2D vector operations
 */
export class Vec2 {
  /**
   * Normalizes a 2-component vector
   * @param v The vector to normalize
   * @returns The normalized vector
   */
  static normalize(v: [number, number]): [number, number] {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length];
    }
    return [0, 0];
  }

  /**
   * Computes the dot product of two 2-component vectors
   * @param a The first vector
   * @param b The second vector
   * @returns The dot product
   */
  static dot(a: [number, number], b: [number, number]): number {
    return a[0] * b[0] + a[1] * b[1];
  }

  /**
   * Subtracts vector b from vector a
   * @param a The first vector
   * @param b The second vector
   * @returns The resulting vector
   */
  static subtract(a: [number, number], b: [number, number]): [number, number] {
    return [
      a[0] - b[0],
      a[1] - b[1]
    ];
  }

  /**
   * Adds vector b to vector a
   * @param a The first vector
   * @param b The second vector
   * @returns The resulting vector
   */
  static add(a: [number, number], b: [number, number]): [number, number] {
    return [
      a[0] + b[0],
      a[1] + b[1]
    ];
  }

  /**
   * Scales a vector by a scalar
   * @param v The vector
   * @param s The scalar
   * @returns The scaled vector
   */
  static scale(v: [number, number], s: number): [number, number] {
    return [
      v[0] * s,
      v[1] * s
    ];
  }

  /**
   * Calculates the length of a vector
   * @param v The vector
   * @returns The length
   */
  static magnitude(v: [number, number]): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }
}