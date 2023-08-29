onmessage = (event) => {
  let {msg, data=""} = event.data
  if (msg === "read"){
    readFile()
  }
  if (msg === "write"){
   writeFile(data)
  }
  if (msg === "download"){
    readFile("download")

  }
  if (msg === "merge"){
    const mergedAlarms = mergeAlarmsWithCount(data.alarms);
    data.alarms = mergedAlarms.map(({ alarm, count }) => ({ alarm, count }));
    writeFile(JSON.stringify(data))
  }
  
  if(msg === "totals"){
    sumAlarmCounts(data)
    sumTopFiveCounts(data)
  }
  if(msg === "topFive"){
    sumTopFiveCounts(data)
  }
  if (msg === "clear"){
    writeFile(`{"alarms":[]}`)
  }
}

function mergeAlarmsWithCount(data) {
  const mergedAlarms = {};

  data.forEach(({ alarm, count }) => {
    if (mergedAlarms[alarm]) {
      mergedAlarms[alarm] += +count;
    } else {
      mergedAlarms[alarm] = +count;
    }
  });

  return Object.entries(mergedAlarms).map(([alarm, count]) => ({
    alarm,
    count,
  }));
}

async function writeFile(data){
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  const accessHandle = await draftHandle.createSyncAccessHandle();

  await accessHandle.truncate(0);

  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(data);
  const writeBuffer = accessHandle.write(encodedMessage, { at: 0 });
  accessHandle.flush();
  accessHandle.close();
  readFile()
}

async function readFile(msg = ""){
  const root = await navigator.storage.getDirectory();

  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  const fileRead = await draftHandle.getFile()
  const text = await fileRead.text()
  if(!msg){
    postMessage({msg:"read", data:text})
  }
  if (msg === "download"){
    postMessage({msg:"download", data:text})
  }
}

function sumAlarmCounts(data) {
  let total = 0;
  const parsed = JSON.parse(data)
  const alarms = parsed.alarms;
  for (const alarm of alarms) {
    total += alarm.count;
  }
  postMessage({msg:"totals", data:[total, alarms]})
}

function sumTopFiveCounts(data){
  let total = 0;
  const parsed = JSON.parse(data)
  const alarms = parsed.alarms;
  alarms.sort((a, b) => b.count - a.count);
  const topFive = alarms.slice(0, 5)
  for (const alarm of topFive) {
    total += alarm.count;
  }
  postMessage({msg:"topFive", data:total})
}