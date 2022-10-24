window.addEventListener(
  "keydown",
  (event) => {
    switch (event.key) {
      case "w":
        tilted.lStickV = -1;
        break;
      case "s":
        tilted.lStickV = 1;
        break;
      case "a":
        tilted.rStickH = -1;
        break;
      case "d":
        tilted.rStickH = 1;
        break;
      case " ":
        pressed.rTriger = true;
        break;
      case "j":
        pressed.rButton = true;
        break;
      case "h":
        pressed.lButton = true;
        break;
      case "k":
        pressed.lTriger = true;
        break;
      case "v":
        pressed.rStick = true;
        break;
      case "b":
        pressed.bButton = true;
        break;
      case "m": // mapEdit
        pressed.xButton = true;
        break;
    }
  },
  false
);

window.addEventListener(
  "keyup",
  (event) => {
    switch (event.key) {
      case "w":
        tilted.lStickV = 0;
        break;
      case "s":
        tilted.lStickV = 0;
        break;
      case "a":
        tilted.rStickH = 0;
        break;
      case "d":
        tilted.rStickH = 0;
        break;
      case " ":
        pressed.rTriger = false;
        break;
      case "j":
        pressed.rButton = false;
        break;
      case "h":
        pressed.lButton = false;
        break;
      case "k":
        pressed.lTriger = false;
        break;
      case "v":
        pressed.rStick = false;
        break;
      case "b":
        pressed.bButton = false;
        break;
      case "m": // mapEdit
        pressed.xButton = false;
        break;
    }
  },
  false
);
