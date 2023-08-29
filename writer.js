import {
  addValue,
  addClick,
  getId,
  addToId,
  addKeyup,
  addChange,
} from "./helper.js"
import {
  makeFileName,
  makeMessage,
  dropBoxControl,
  sendWhatsapp,
  cancelSend,
} from "./scripts/dropBox.js"
import {
  deleteAlarm,
  getData,
} from "./scripts/dataRWD.js"
import {
  drawGraph,
} from "./scripts/bar.js"
import {
  downloadFile,
} from "./scripts/file.js"

let alarmTotal;

const worker = new Worker("writer_worker.js");
globalThis.workerX = worker

worker.addEventListener("message", (event) => {
  let { msg, data } = event.data;
  
  if (msg === "read") {
    const parsed = JSON.parse(data)
    if(!data){
      data = {"alarms":[]}
    }
    addValue("writingPad", data);
    drawGraph(parsed);
    alarmInput.value = "";
    worker.postMessage({msg:"totals", data})
  }
  if (msg === "write") {
    worker.postMessage({ msg: "read" });
  }
  if (msg === "download") {
    const fileName = getId("fileName").innerHTML
    downloadFile(data, fileName)
    dropBoxControl("dropBox")
  }
  if(msg === "totals"){
    alarmTotal = data[0]
    addToId("alarmTotal", alarmTotal)
    addToId("addressesTotal", data[1].length)
  }
  if(msg !== "topFive"){
    return;
  }
  const percent = Math.ceil(data/alarmTotal * 100)
  addToId("countFive", data)
  if (percent){
    addToId("percentTopFive", `${percent}%`)
  } else {
    addToId("percentTopFive", 0)
  }
  
});

async function addFileValue(e){
  const data = await e.target.files[0].text()
  dropBoxControl("dropBox3")
  addValue("writingPad", data)
  worker.postMessage({msg:"write", data})
}

function resetWriter(){
  worker.postMessage({msg:"clear"})
  dropBoxControl("dropBox3")
}

window.onload = () => {
  worker.postMessage({ msg: "read" });
  addClick("name", () => worker.postMessage({msg:"read"}))
  addClick("write", getData);
  addClick("continueDownload", () => worker.postMessage({msg:"download", data:"download"}))
  addClick("resetWriter", resetWriter)
  addClick("download", () => dropBoxControl("dropBox"))
  addClick("iconBox", () => dropBoxControl("dropBox3"))
  addClick("delete", deleteAlarm);
  addClick("cancelSend", cancelSend)
  addClick("cancelDownload", () => dropBoxControl("dropBox"))
  addClick("alarmInput", (e) => e.target.value = "")
  addClick("sendMessage", sendWhatsapp)
  addChange("uploadFile", addFileValue)
  addKeyup("area", (e) => makeFileName(e))
  addKeyup("code", (e) => makeMessage(e))
  addKeyup("led", (e) => makeMessage(e))
  addChange("startDate", (e) => makeFileName(e))
  addChange("endDate", (e) => makeFileName(e))
}
