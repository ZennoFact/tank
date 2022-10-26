class SplaObject {
  constructor(color) {
    this.color = color;
  }
  setBounds() {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
  }
  is() {
    return "SplaObject";
  }
}

class Player extends SplaObject {
  constructor(position, playerColor = color.player1) {
    super(playerColor);
    this.bodyColor = color.body;

    this.position = position;
    this.material = [
      new THREE.MeshBasicMaterial({ color: color.body }),
      new THREE.MeshBasicMaterial({ color: color.body }),
      new THREE.MeshBasicMaterial({ color: playerColor.ink }),
      new THREE.MeshBasicMaterial({ color: color.body }),
      new THREE.MeshBasicMaterial({ color: color.body }),
      new THREE.MeshBasicMaterial({ color: this.color.ink }),
    ];
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 1.6), // 形状の指定
      this.material // ポリゴンメッシュ（略してメッシュ）。多角形の面の集合体
    );

    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  is() {
    return "Player";
  }

  collision(obj) {
    if (obj.is() !== "Ball") return false;
    if (obj.color.ink === this.color.ink) return false;
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(obj.boundingBox)) {
      this.changeColor(obj.color);

      if (obj.is() === "Ball") obj.isNotHit = false;

      return true;
    } else {
      return false;
    }
  }

  move(speed) {
    this.mesh.translateZ(speed);
  }

  roll(radian) {
    this.mesh.rotation.y -= 0.02 * radian;
  }

  changeColor(color) {
    // 上面と正面だけ色を変更
    if (color) this.color = color;
    this.material = [
      new THREE.MeshBasicMaterial({ color: this.bodyColor }),
      new THREE.MeshBasicMaterial({ color: this.bodyColor }),
      new THREE.MeshBasicMaterial({ color: this.color.ink }),
      new THREE.MeshBasicMaterial({ color: this.bodyColor }),
      new THREE.MeshBasicMaterial({ color: this.bodyColor }),
      new THREE.MeshBasicMaterial({ color: this.color.ink }),
    ];
    this.mesh.material = this.material;
  }
  equals(clone, ink) {
    if (this.mesh.position.x !== clone.position.x) return false;
    if (this.mesh.position.y !== clone.position.y) return false;
    if (this.mesh.position.z !== clone.position.z) return false;
    if (this.mesh.rotation.y !== clone.rotation.y) return false;
    if (this.color.ink !== ink) return false;
    return true;
  }
}
class Block extends SplaObject {
  constructor(position) {
    super(color.wall);

    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshBasicMaterial({ color: this.color.ink })
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  is() {
    return "Block";
  }

  collision(player) {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (
      this.boundingBox.intersectsBox(player.boundingBox) &&
      this.color !== player.color
    ) {
      this.mesh.material.color.setHex(color.danger);
      return { isHit: true, color: this.color };
    } else if (this.color === color.wall) {
      this.mesh.material.color.setHex(color.wall.ink);
    } else {
      this.mesh.material.color.setHex(this.color.ink);
    }
    return { isHit: false, color: color.wall };

    // 完全に重なったら？は今のところ考えない
    // if (this.boundingBox.containsBox(playerBB)) {}
  }

  changeColor(color) {
    this.color = color;
  }
}

class Ball extends SplaObject {
  constructor(player) {
    super(player.color);

    const position = player.mesh.position;
    this.isNotHit = true;
    this.life = 100;

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 16),
      new THREE.MeshBasicMaterial({ color: this.color.ink })
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.rotation.set(
      player.mesh.rotation.x,
      player.mesh.rotation.y,
      player.mesh.rotation.z
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    // this.mesh.matrixAutoUpdate = false;

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  is() {
    return "Ball";
  }

  move() {
    this.mesh.translateZ(-0.3);
    this.mesh.position.y += this.life < 25 ? -0.05 : +0.005;
    this.life--;
    if (this.life < 0) this.isNotHit = false;
  }

  collision(obj) {
    if (obj.is() === "Player") {
      this.isNotHit = false;
      return true;
    }

    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(obj.boundingBox)) {
      obj.color = this.color;
      this.isNotHit = false;
      return true;
    }
    return false;
  }
}

class Floor extends SplaObject {
  constructor(color) {
    super(color);

    this.colors = [];
    const floorGeometry = new THREE.PlaneGeometry(
      100,
      100,
      100,
      100
    ).toNonIndexed();
    const positionAttribute = floorGeometry.getAttribute("position");
    const floorColor = new THREE.Color();
    for (let i = 0; i < positionAttribute.count; i += 6) {
      floorColor.setHex(0xdddddd);
      const alpha = 1;

      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);
      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);
      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);

      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);
      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);
      this.colors.push(floorColor.r, floorColor.g, floorColor.b, alpha);
    }
    floorGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(this.colors, 4)
    );
    const floorMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(floorGeometry, floorMaterial);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = Math.PI / -2; // 平面を作ると縦に出来上がるので，回転させて床にする（なお，三角関数を利用）

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  is() {
    return "Floor";
  }

  getBounds() {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    return this.boundingBox;
  }
}

class Pumpkin extends SplaObject {
  constructor(player, seed) {
    super(player.color);

    const position = player.mesh.position;
    this.isNotHit = true;
    this.life = 100;

    this.mesh = seed.clone();
    this.mesh.position.set(position.x, position.y, position.z);

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  move() {
    // TODO: おもろい動きの検討
    this.mesh.position.y += 0.1;
    this.mesh.rotation.z += 0.05;
    this.mesh.scale.x += 0.001;
    this.mesh.scale.y += 0.001;
    this.mesh.scale.z += 0.001;
    this.life--;
    if (this.life < 0) this.isNotHit = false; // 時間で爆発？
  }

  collision(obj) {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(obj.boundingBox)) {
      obj.color = this.color;
      this.isNotHit = false;
      return true;
    }
    return false;
  }
}
