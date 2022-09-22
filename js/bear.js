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

// Meshはcloneして使いまわせないか。→色の変化が一気に出たので一旦却下

class Block {
  color = 0xff6464;
  collisionColor = 0xff2424;
  constructor(position) {
    // this.collision;
    this.position = position;
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: this.color })
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // 接触判定用BoundingBox
    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.mesh);
  }

  collision(playerBB) {
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(playerBB)) {
      this.mesh.material.color.setHex(this.collisionColor);
    } else {
      // 色を戻したいときはここのコメントを解除
      // this.mesh.material.color.setHex(this.color);
    }

    // TODO: 完全に重なったら？は今のところ考えない
    // if (this.boundingBox.containsBox(playerBB)) {
    //   this.mesh.position.y = 1.5;
    // } else {
    //   this.mesh.position.y = 1;
    // }
  }
}

class Ball {
  color = 0x6464ff;
  constructor(player) {
    const position = player.position;
    this.isNotHit = true;
    this.life = 100;

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 16),
      new THREE.MeshBasicMaterial({ color: this.color })
    );
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.rotation.set(
      player.rotation.x,
      player.rotation.y,
      player.rotation.z
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
    this.life--;
    if (this.life < 0) this.isNotHit = false;
  }

  collision(cube) {
    const cubeBB = cube.boundingBox;
    this.boundingBox
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld);
    if (this.boundingBox.intersectsBox(cubeBB)) {
      cube.mesh.material.color.setHex(this.color);
      this.isNotHit = false;
      return true;
    } else {
      return false;
    }
  }
}
