window.addEventListener(
  "touchstart",
  (event) => {
    pressed.rTriger = true;
  },
  false
);

window.addEventListener(
  "touchend",
  (event) => {
    pressed.rTriger = false;
  },
  false
);

function clickRequestDeviceSensor() {
  //. ユーザーに「許可」を求めるダイアログを表示
  DeviceOrientationEvent.requestPermission()
    .then(function (response) {
      if (response === "granted") {
        //. 許可された場合のみイベントハンドラを追加できる
        window.addEventListener(
          "deviceorientation",
          (event) => {
            // alpha: rotation around z-axis
            var rotateDegrees = event.alpha;
            // gamma: left to right
            var leftToRight = event.gamma;
            // beta: front back motion
            var frontToBack = event.beta;
            handleOrientationEvent(frontToBack, leftToRight, rotateDegrees);
          },
          true
        );
        //. 画面上部のボタンを消す
        document.body.removeChild(document.getElementById("sensorrequest"));
      }
    })
    .catch(function (e) {
      console.log(e);
    });
}

if (window.DeviceOrientationEvent) {
  //. iOS13 以上であれば DeviceOrientationEvent.requestPermission 関数が定義されているので、ここで条件分岐
  if (
    DeviceOrientationEvent.requestPermission &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    //. iOS 13 以上の場合、画面上部に「センサーの有効化」ボタンを追加
    var banner = document.createElement("div");
    banner.setAttribute("z-index", 99);
    banner.setAttribute("position", "absolute");
    banner.setAttribute("width", "100%");
    banner.setAttribute("margin", "20px");
    banner.setAttribute("background-color", "block");
    banner.setAttribute("id", "sensorrequest");
    banner.innerHTML = "センサーの有効化";
    banner.addEventListener("click", clickRequestDeviceSensor);
    document.body.prepend(banner);
  } else {
    //. Android または iOS 13 未満の場合、
    //. DeviceOrientationEvent オブジェクトが有効な場合のみ、deviceorientation イベント発生時に deviceOrientaion 関数がハンドリングするよう登録
    window.addEventListener("deviceorientation", deviceOrientationHandler);
  }
}

var handleOrientationEvent = function (
  frontToBack,
  leftToRight,
  rotateDegrees
) {
  tilted.lStickV = (frontToBack - 55) / 20;
  tilted.rStickH = leftToRight / 50;
};
