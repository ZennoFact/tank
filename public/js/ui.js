function loadUI(type = "player") {
  const domId = type === "player" ? "#uiParts" : "#gmParts";
  // TODO: css含めたgmパーツの表示から
  const clone = document.querySelector(domId).content.cloneNode(true);
  const uiCollection = clone.querySelectorAll(".ui");

  Array.prototype.forEach.call(uiCollection, (item) => {
    document.body.appendChild(item);
  });
}
