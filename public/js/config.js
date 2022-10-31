const config = {
  button: {
    a: 0,
    b: 1,
    x: 2,
    y: 3,
    lb: 4,
    rb: 5,
    lt: 6,
    rt: 7,
    back: 8,
    start: 9,
    lStick: 10,
    rStick: 11,
  },
  stick: {
    leftX: 0,
    leftY: 1,
    rightX: 2,
    rightY: 3,
  },
  // 現状使用しないがキーボード操作にはこれを使用
  key: {
    foward: "w",
    left: "a",
    right: "d",
    back: "s",
    shoot: " ",
    edit: "e",
    fps: "f",
    none: "",
  },
};

const viewMode = {
  birdsEye: 0,
  thirdPerson: 1,
  firstPerson: 2,
};

const weaponMode = {
  main: 0,
  sub1: 1,
};

// TODO: 全てinkとsplashに分けるか要検討
const color = {
  body: 0x555749,
  wall: {
    ink: 0x888a7c,
    splash: 0xdddddd,
  },
  danger: 0xff0000,
  floor: 0xdddddd, // TODO: これ，壁のスプラッシュに巻き込む？
  pumpkin: 0xffa500,
  player1: {
    // 青系
    ink: 0x6464ff,
    splash: 0x9696ff,
    index: 0,
  },
  player2: {
    // 赤系
    ink: 0xff420e,
    splash: 0xf98866,
    index: 1,
  },
  player3: {
    // 黄系
    ink: 0xf6a807,
    splash: 0xfbd509,
    index: 2,
  },
  player4: {
    // 緑系
    ink: 0x30b947,
    splash: 0x87e65e,
    index: 3,
  },
};

// TODO: 将来的にパッドの接続の有無で操作に必要なボタン名を変えたい
manual = {
  gamepad: {
    bom: "B-Button",
    color: "L-Button",
    dive: "L-Triger",
    edit: "X-Button",
    load: "Back-Button",
    main: "R-Triger",
    move: "↑L-Stick↓",
    roll: "←R-Stick→",
    save: "Start-Button",
    sub: "R-Button",
    view: "R-Stick Press",
  },
  keyboard: {
    bom: "B",
    color: "",
    dive: "",
    edit: "",
    load: "",
    main: "SPACE",
    move: "↑W | S↓",
    roll: "←A | D→",
    save: "",
    sub: "",
    view: "",
  },
};
