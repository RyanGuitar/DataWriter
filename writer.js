import {
  addValue,
  addClick,
  removeClick,
  getValue,
  getId,
  log,
  addToId,
  downloadFile,
  addKeyup,
  addChange,
} from "./helper.js"
import {
  makeFileName,
  makeMessage,
  dropBoxControl,
  callDrop,
  sendWhatsapp,
  whatsappStatus,
} from "./scripts/dropBox.js"
import {
  deleteAlarm
} from "./scripts/dataRWD.js"

let barChart; 
let mergedData; 
let alarmLabels; 
let alarmTotal;
let alarmInput = getId("alarmInput")

const worker = new Worker("writer_worker.js");
globalThis.workerX = worker

worker.addEventListener("message", (event) => {
  let { msg, data } = event.data;

  if (msg === "read") {
    let parsed = JSON.parse(data)
    addValue("writingPad", data);
    drawGraph(parsed);
    alarmInput.value = "";
    worker.postMessage({msg:"totals", data:data})
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
  if(msg === "topFive"){
    let percent = Math.ceil(data/alarmTotal * 100)
    addToId("countFive", data)
    addToId("percentTopFive", `${percent}%`)
  }
});

function getData() {
  let updatedData = getValue("writingPad");
  if (!updatedData) {
    updatedData = {"alarms": []};
  } else {
    updatedData = JSON.parse(updatedData);
  }
  globalThis.inputAlarm = alarmInput.value;
  let inputAlarm = globalThis.inputAlarm
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
  worker.postMessage({ msg: "merge", data: updatedData });
}

function drawGraph(data) {
  mergedData = data.alarms;
  mergedData.sort((a, b) => b.count - a.count);
  const topN = 50;
  mergedData = mergedData.slice(0, topN);
  alarmLabels = mergedData.map(data => data.alarm);
  const alarmCounts = mergedData.map(data => data.count);
  const ctx = getId('barChart').getContext('2d');
  const chartContainer = getId('canvasBox');
  let minBarWidth = 50;
  const numBars = mergedData.length;
  if (numBars == 1) {
    minBarWidth = 80;
  }
  if (barChart) {
    barChart.destroy();
  }

  const calculatedWidth = minBarWidth * numBars;
  chartContainer.style.width = calculatedWidth + 'px';
  ctx.canvas.style.width = calculatedWidth + 'px';

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: alarmLabels,
      datasets: [{
        data: alarmCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 1,
      }]
    },
    options: {
      onClick: handleBarClick,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function handleBarClick(event, elements) {
  if (elements.length > 0) {
    const clickedElement = elements[0];
    const clickedLabel = alarmLabels[clickedElement.index];
    addValue("alarmInput", clickedLabel)
  }
}

window.onload = () => {
  worker.postMessage({ msg: "read" });
  addClick("writingPad", () => worker.postMessage({msg:"read"}))
  addClick("write", getData);
  addClick("continueDownload", () => worker.postMessage({msg:"download", data:"download"}))
  addClick("download", () => dropBoxControl("dropBox"))
  addClick("delete", deleteAlarm);
  addClick("iconBox", () => dropBoxControl("dropBox2"))
  addClick("alarmInput", (e) => e.target.value = "")
  addClick("sendMessage", sendWhatsapp)
  addKeyup("area", (e) => makeFileName(e))
  addKeyup("code", (e) => makeMessage(e))
  addKeyup("led", (e) => makeMessage(e))
  addChange("startDate", (e) => makeFileName(e))
  addChange("endDate", (e) => makeFileName(e))
}