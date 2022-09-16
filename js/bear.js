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
  }
}

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

  collision(player) {
    console.log();
    let array = player.geometry.vertices;
    // let array = player.geometry.attributes.position.array;

    for (var vertexIndex = 0; vertexIndex < array.length; vertexIndex++) {
      var localVertex = array[vertexIndex].clone();
      var globalVertex = player.matrix.multiplyVector3(localVertex);
      var directionVector = globalVertex.subSelf(player.position);

      var ray = new THREE.Ray(
        player.position,
        directionVector.clone().normalize()
      );
      var collisionResults = ray.intersectObjects([this.mesh]);
      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        this.mesh.material.color.setHex(this.collisionColor);
      } else {
        this.mesh.material.color.setHex(this.color);
      }
    }
  }
}
