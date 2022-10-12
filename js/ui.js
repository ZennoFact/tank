function loadUI() {
  const clone = document.querySelector("#uiParts").content.cloneNode(true);
  const uiCollection = clone.querySelectorAll(".ui");

  Array.prototype.forEach.call(uiCollection, (item) => {
    document.body.appendChild(item);
  });
}
