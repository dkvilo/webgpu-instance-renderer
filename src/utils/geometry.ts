export class Geometry {
  /**
   * Create a quad geometry for 2D rendering
   * @returns The quad vertices and indices
   */
  static createQuad(): { vertices: Float32Array, indices: Uint16Array } {
    const vertices = new Float32Array([
      -0.5, -0.5, 0, 0,
      0.5, -0.5, 1, 0,
      0.5, 0.5, 1, 1,
      -0.5, 0.5, 0, 1
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      0, 2, 3
    ]);

    return { vertices, indices };
  }

  /**
   * Create a cube geometry for 3D rendering
   * @returns The cube vertices and indices
   */
  static createCube(): { vertices: Float32Array, indices: Uint16Array } {
    const vertices = new Float32Array([
      // Front face
      -0.5, -0.5, 0.5, 0, 0, 1, 0, 0, // Bottom-left
      0.5, -0.5, 0.5, 0, 0, 1, 1, 0, // Bottom-right
      0.5, 0.5, 0.5, 0, 0, 1, 1, 1, // Top-right
      -0.5, 0.5, 0.5, 0, 0, 1, 0, 1, // Top-left

      // Back face
      -0.5, -0.5, -0.5, 0, 0, -1, 1, 0, // Bottom-left
      -0.5, 0.5, -0.5, 0, 0, -1, 1, 1, // Top-left
      0.5, 0.5, -0.5, 0, 0, -1, 0, 1, // Top-right
      0.5, -0.5, -0.5, 0, 0, -1, 0, 0, // Bottom-right

      // Top face
      -0.5, 0.5, -0.5, 0, 1, 0, 0, 1, // Back-left
      -0.5, 0.5, 0.5, 0, 1, 0, 0, 0, // Front-left
      0.5, 0.5, 0.5, 0, 1, 0, 1, 0, // Front-right
      0.5, 0.5, -0.5, 0, 1, 0, 1, 1, // Back-right

      // Bottom face
      -0.5, -0.5, -0.5, 0, -1, 0, 1, 1, // Back-left
      0.5, -0.5, -0.5, 0, -1, 0, 0, 1, // Back-right
      0.5, -0.5, 0.5, 0, -1, 0, 0, 0, // Front-right
      -0.5, -0.5, 0.5, 0, -1, 0, 1, 0, // Front-left

      // Right face
      0.5, -0.5, -0.5, 1, 0, 0, 1, 0, // Back-bottom
      0.5, 0.5, -0.5, 1, 0, 0, 1, 1, // Back-top
      0.5, 0.5, 0.5, 1, 0, 0, 0, 1, // Front-top
      0.5, -0.5, 0.5, 1, 0, 0, 0, 0, // Front-bottom

      // Left face
      -0.5, -0.5, -0.5, -1, 0, 0, 0, 0, // Back-bottom
      -0.5, -0.5, 0.5, -1, 0, 0, 1, 0, // Front-bottom
      -0.5, 0.5, 0.5, -1, 0, 0, 1, 1, // Front-top
      -0.5, 0.5, -0.5, -1, 0, 0, 0, 1  // Back-top
    ]);

    const indices = new Uint16Array([
      0, 1, 2, 0, 2, 3,  // front
      4, 5, 6, 4, 6, 7,  // back
      8, 9, 10, 8, 10, 11, // top
      12, 13, 14, 12, 14, 15, // bottom
      16, 17, 18, 16, 18, 19, // right
      20, 21, 22, 20, 22, 23  // left
    ]);

    return { vertices, indices };
  }

  /**
   * Create a sphere geometry for 3D rendering
   * @param radius The radius of the sphere
   * @param latitudeBands The number of latitude bands
   * @param longitudeBands The number of longitude bands
   * @returns The sphere vertices and indices
   */
  static createSphere(radius: number = 1, latitudeBands: number = 16, longitudeBands: number = 16): { vertices: Float32Array, indices: Uint16Array } {
    const vertices = [];
    const indices = [];

    // Generate vertices
    for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = lat * Math.PI / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longitudeBands; lon++) {
        const phi = lon * 2 * Math.PI / longitudeBands;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const u = 1 - (lon / longitudeBands);
        const v = 1 - (lat / latitudeBands);

        vertices.push(
          radius * x, radius * y, radius * z, // position
          x, y, z,                            // normal
          u, v                                // uv
        );
      }
    }

    for (let lat = 0; lat < latitudeBands; lat++) {
      for (let lon = 0; lon < longitudeBands; lon++) {
        const first = (lat * (longitudeBands + 1)) + lon;
        const second = first + longitudeBands + 1;

        indices.push(first, first + 1, second);
        indices.push(second, first + 1, second + 1);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices)
    };
  }

  /**
   * Create a plane geometry for 3D rendering
   * @param width The width of the plane
   * @param height The height of the plane
   * @param widthSegments The number of width segments
   * @param heightSegments The number of height segments
   * @returns The plane vertices and indices
   */
  static createPlane(width: number = 1, height: number = 1, widthSegments: number = 1, heightSegments: number = 1): { vertices: Float32Array, indices: Uint16Array } {
    const vertices = [];
    const indices = [];

    const widthHalf = width / 2;
    const heightHalf = height / 2;

    const gridX = widthSegments;
    const gridY = heightSegments;

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    for (let iy = 0; iy <= gridY; iy++) {
      const y = iy * segmentHeight - heightHalf;

      for (let ix = 0; ix <= gridX; ix++) {
        const x = ix * segmentWidth - widthHalf;

        vertices.push(
          x, 0, y,    // position
          0, 1, 0,    // normal (up)
          ix / gridX, 1 - (iy / gridY) // uv
        );
      }
    }

    for (let iy = 0; iy < gridY; iy++) {
      for (let ix = 0; ix < gridX; ix++) {
        const a = ix + (gridX + 1) * iy;
        const b = ix + (gridX + 1) * (iy + 1);
        const c = (ix + 1) + (gridX + 1) * (iy + 1);
        const d = (ix + 1) + (gridX + 1) * iy;

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices)
    };
  }
}