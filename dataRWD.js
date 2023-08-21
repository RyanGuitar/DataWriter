import {
  getValue,
  log,
  getId,
} from "../helper.js"
import {
  whatsappStatus
} from "./dropBox.js"

function deleteAlarm() {
  let updatedData = getValue("writingPad");
  const alarmInput = getId("alarmInput")
  let alarmInputValue = alarmInput.value;
  if (!updatedData || !alarmInputValue) return;
  getId("whatsapp").dataset.saved = "true"
  whatsappStatus()
  updatedData = JSON.parse(updatedData);
  let index = updatedData.alarms.findIndex((obj) => obj.alarm === alarmInputValue);
  if (index !== -1) {
    if (updatedData.alarms[index].count > 1) {
      updatedData.alarms[index].count--;
    } else {
      updatedData.alarms.splice(index, 1);
    }
    globalThis.workerX.postMessage({ msg: "write", data: JSON.stringify(updatedData)});
  }
}

export {
  deleteAlarm
}