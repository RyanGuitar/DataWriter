import {
  addValue,
  getId,
} from "../helper.js"

let barChart;

function drawGraph(data) {
  let mergedData = data.alarms;
  mergedData.sort((a, b) => b.count - a.count);
  const topN = 50;
  mergedData = mergedData.slice(0, topN);
  globalThis.alarmLabels = mergedData.map(data => data.alarm);
  const alarmLabels = globalThis.alarmLabels
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
  chartContainer.style.width = `${calculatedWidth}px`;
  ctx.canvas.style.width = `${calculatedWidth}px`;

  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: alarmLabels,
      datasets: [{
        data: alarmCounts,
        backgroundColor: 'rgba(94, 199, 247, 0.3)',
        borderColor: 'rgb(94, 199, 247)',
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
  if (elements.length <= 0) {
    return;
  }
  const clickedElement = elements[0];
  const clickedLabel = alarmLabels[clickedElement.index];
  addValue("alarmInput", clickedLabel)
}


export {
  drawGraph,
  handleBarClick,
}