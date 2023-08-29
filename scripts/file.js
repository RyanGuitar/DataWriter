function downloadFile(text, fileName) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url
  link.download = `${fileName}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

async function uploadFile(){
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  const fileRead = await draftHandle.getFile()
  const text = await fileRead.text()
  postMessage({msg:"write", data:text})
}

export {
  downloadFile,
  uploadFile
}