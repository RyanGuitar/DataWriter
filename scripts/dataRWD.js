import {
  getValue,
  getId,
} from "../helper.js"
import {
  whatsappStatus
} from "./dropBox.js"

function deleteAlarm() {
  let updatedData = getValue("writingPad");
  const alarmInput = getId("alarmInput")
  const alarmInputValue = alarmInput.value.trim();
  if (!updatedData || !alarmInputValue) return;
  getId("whatsapp").dataset.saved = "true"
  whatsappStatus()
  updatedData = JSON.parse(updatedData);
  const index = updatedData.alarms.findIndex((obj) => obj.alarm === alarmInputValue);
  if (index !== -1) {
    if (updatedData.alarms[index].count > 1) {
      updatedData.alarms[index].count--;
    } else {
      updatedData.alarms.splice(index, 1);
    }
    globalThis.workerX.postMessage({ msg: "write", data: JSON.stringify(updatedData)});
  }
}

function getData() {
  let updatedData = getValue("writingPad");
  updatedData = updatedData ? JSON.parse(updatedData) : {"alarms": []};
  globalThis.inputAlarm = getId("alarmInput").value.trim();
  const inputAlarm = globalThis.inputAlarm;
  if (!inputAlarm) return;
  getId("whatsapp").dataset.saved = "false"
  whatsappStatus()

  if (!updatedData.alarms) {
    updatedData.alarms = [];
  }
  const existingAlarm = updatedData.alarms.find(({ alarm }) => alarm === inputAlarm);
  if (existingAlarm) {
    existingAlarm.count = (existingAlarm.count || 1) + 1;
  } else {
    updatedData.alarms.push({ alarm: inputAlarm, count: 1 });
  }
  globalThis.workerX.postMessage({ msg: "merge", data: updatedData });
}

export {
  deleteAlarm,
  getData
}
