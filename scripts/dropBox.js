import { addToId, addClick, removeClick, getId } from "../helper.js";

let area = `AREA: `;
let start = `START DATE TO`;
let end = ` END DATE`;
let code = ` Code ?`;
let led = ` LED ?`;

function resetForms() {
  area = `AREA: `;
  start = `START DATE TO`;
  end = ` END DATE`;
  code = ` Code ?`;
  led = ` LED ?`;
  getId("messageForm").reset()
  getId("fileNameForm").reset()
}

function callDrop() {
  resetForms();
  dropBoxControl("dropBox2");
}

function cancelSend(){
  getId("whatsapp").dataset.saved = "true"
  dropBoxControl("dropBox2")
  whatsappStatus()
}


function dropBoxControl(id) {
  resetForms()
  const dropBox = getId(id);
  const open = dropBox.dataset.open;
  if (open === "true") {
    dropBox.style.transform = "translate(0, 0)";
    dropBox.dataset.open = "false";
  } else {
    dropBox.style.transform = "translate(0, -150%)";
    dropBox.dataset.open = "true";
  }
  if (id === "dropBox") {
    addToId("fileName", `${area}${start}${end}`);
  }
  if (id === "dropBox2") {
    addToId("message", `${globalThis.inputAlarm}${code}${led}`);
  }
}

function makeFileName(e) {
  const target = e.target;
  const file = target.dataset.file;
  const value = target.value;
  if (file === "area") {
    area = `${value}_`;
  }
  if (file === "start") {
    start = ` ${value} to`;
  }
  if (file === "end") {
    end = ` ${value}`;
  }
  addToId("fileName", `${area}${start}${end}`);
}

function makeMessage(e) {
  const target = e.target;
  const message = target.dataset.message;
  const value = target.value;
  if (message === "code") {
    code = ` ${value}`;
  }
  if (message === "led") {
    led = ` ${value}`;
  }
  addToId("message", `${globalThis.inputAlarm}${code}${led}`);
}

function sendWhatsapp() {
  const message = getId("message").innerHTML;
  const link = document.createElement("a");
  link.href = `whatsapp://send?phone=+27815677207&text=${message}`;
  link.click();
  callDrop();
  getId("whatsapp").dataset.saved = "true";
  whatsappStatus();
}

function whatsappStatus() {
  const whatsapp = getId("whatsapp");
  const status = whatsapp.dataset.saved;
  if (status === "false") {
    addClick("whatsapp", callDrop);
    whatsapp.classList.add("whatsapp");
  }
  if (status === "true") {
    removeClick("whatsapp", callDrop);
    whatsapp.classList.remove("whatsapp");
  }
}

export {
  makeFileName,
  makeMessage,
  dropBoxControl,
  callDrop,
  sendWhatsapp,
  whatsappStatus,
  cancelSend,
};
