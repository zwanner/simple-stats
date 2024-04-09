
const addDataBtn = document.getElementById('addDataBtn');

let dates = [];

const chart = Highcharts.chart('HLTVGraph', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Ratings over time'
    },
    xAxis: {
        categories: dates,
    },
    yAxis: {
        title: {
            text: 'Rating'
        }
    },
    series: [{
        name: 'HTLV Rating',
        data: [1.5, 0.94, 0.76]
    }, {
        name: 'Leetify Rating',
        data: [1.76, 1.23, 1.05]
    }]
});


async function modalAddData() {
    const modalEl = document.getElementById('staticBackdrop');
    // Show the modal
    const modalButtonEl = document.getElementById('modalAddDataBtn');
    // Create a promise that resolves when the modal is closed
    const modalClosedPromise = new Promise((resolve) => {
        modalButtonEl.addEventListener('click', () => {
            resolve();
        });
    });

    // Wait for the modal to be closed
    await modalClosedPromise;
}


addDataBtn.addEventListener('click', modalAddData());
