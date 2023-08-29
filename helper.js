function log(...args) {
  args.forEach(arg => console.log(arg))
}

function getId(id){
  return document.getElementById(id)
}

function addToId(id, txt){
  getId(id).innerHTML = txt
}

function addValue(id, txt){
  getId(id).value = txt
}

function addKeyup(id, fn){
  getId(id).addEventListener("keyup", fn)
}

function getValue(id){
  return getId(id).value
}

function changeBackground(id, col){
  getId(id).style.background = col
}

function changeColor(id, col){
  getId(id).style.color = col
}

function addClick(id, fn){
  getId(id).addEventListener("click", fn)
}

function addChange(id, fn){
  getId(id).addEventListener("change", fn)
}

function changeCaptureGreen(){
  changeBackground("capture", "green")
  changeBackground("save", "green")
  changeColor("save", "white")
}

function changeCaptureRed(){
  changeBackground("capture", "red")
  changeBackground("save", "lightgray")
  changeColor("save", "black")
}

function removeClick(id, fn){
  getId(id).removeEventListener("click", fn)
}

export {
  log,
  getId,
  addValue,
  addKeyup,
  getValue,
  changeBackground,
  changeColor,
  addClick,
  addChange,
  changeCaptureGreen,
  changeCaptureRed,
  addToId,
  removeClick,
}