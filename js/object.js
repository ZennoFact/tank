class Bear {
  constructor(color = 0x555749) {
    const body = new THREE.Group();

    this.x = 0;
    this.y = 0;

    this.color = color;
    this.state = {
      goForward: false,
      turnLeft: false,
      turnRight: false,
      goBack: false,
    };
  }

  // 射撃
  fire() {}
  // 移動
  move() {}
  // 旋回
  turn() {}

  // TODO: 3D（FPS）にするなら付けたい
  sonar() {} // これを使って索敵（ただばれる可能性あり）とかできると面白そう（詳細決定と実装めんどくさい？）
  aim() {} // ジョイスティックでもないと厳しそう

  create(body) {
    const geometry = new THREE.BoxGeometry(1, 1, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x555749 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1, 0);
    return mesh;
  }
}

class Player {
  constructor(position, playerColor = color.player1) {
    this.position = position;
    this.color = playerColor;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 1.6), // 形状の指定
      new THREE.MeshBasicMaterial({ color: color.body }) // ポリゴンメッシュ（略してメッシュ）。多角形の面の集合体
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }
}
class Block {
  constructor(position) {
    this.position = position;
    this.color = color.wall;
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

  collision(playerBB, playerInkColor) {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (
      this.boundingBox.intersectsBox(playerBB) &&
      this.color !== playerInkColor
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
}

class Ball {
  constructor(player) {
    const position = player.mesh.position;
    this.isNotHit = true;
    this.life = 100;
    this.color = player.color;

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

  move() {
    this.mesh.translateZ(-0.3);
    this.mesh.position.y += this.life < 25 ? -0.05 : +0.005;
    this.life--;
    if (this.life < 0) this.isNotHit = false;
  }

  // TODO: floorやplayerをクラス化したら，こっちの考え方でいける
  // collision(cube) {
  //   const cubeBB = cube.boundingBox;
  //   this.boundingBox
  //     .copy(this.mesh.geometry.boundingBox)
  //     .applyMatrix4(this.mesh.matrixWorld);
  //   if (this.boundingBox.intersectsBox(cubeBB)) {
  //     cube.color = this.color;
  //     this.isNotHit = false;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  collision(cubeBB, obj) {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(cubeBB)) {
      if (obj) {
        obj.color = this.color;
      }
      this.isNotHit = false;
      return true;
    } else {
      return false;
    }
  }
}
