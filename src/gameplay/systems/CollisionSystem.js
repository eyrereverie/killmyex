export default class CollisionSystem {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
  }

  overlap(a, b, callback) {
    const collider = this.scene.physics.add.overlap(a, b, callback);
    this.colliders.push(collider);
    return collider;
  }

  destroy() {
    this.colliders.forEach((collider) => collider.destroy());
    this.colliders = [];
  }
}
