
// let data = JSON.parse(localStorage.getItem('data'));
let data = JSON.parse(localStorage.getItem('data'));
let dates = data.dates;


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
        data: data.hltvRating
    }]
});

function getAverageRating() {
    let sum = 0;
    for (let i = 0; i < data.hltvRating.length; i++) {
        sum += data.hltvRating[i];
    }
    return sum / data.hltvRating.length;
}

//get average rating per map
function getAverageRatingPerMap(map) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < data.maps.length; i++) {
        if (data.maps[i] === map) {
            sum += data.hltvRating[i];
            count++;
        }
    }
    return sum / count;
}

function getWinLossRatio(map) {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    for (let i = 0; i < data.maps.length; i++) {
        if (data.maps[i] === map) {
            if (data.winLoss[i] === 1) {
                wins++;
            } else if (data.winLoss[i] === 0) {
                losses++;
            } else {
                draws++;
            }
        }
    }
    return wins / (wins + losses + draws);
}


Highcharts.chart('ratingPerMapGraph', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Average HLTV 2.0 Rating per Map'
    },
    xAxis: {
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'HLTV Rating'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: 'Average HLTV Rating <b>{point.y:.2f}</b>'
    },
    series: [{
        name: 'Maps',
        colors: [
            '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
            '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
            '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
            '#03c69b', '#00f194'
        ],
        colorByPoint: true,
        groupPadding: 0,
        data: [
            ['Overpass', getAverageRatingPerMap('Overpass')],
            ['Anubis', getAverageRatingPerMap('Anubis')],
            ['Nuke', getAverageRatingPerMap('Nuke')],
            ['Mirage', getAverageRatingPerMap('Mirage')],
            ['Ancient', getAverageRatingPerMap('Ancient')],
            ['Inferno', getAverageRatingPerMap('Inferno')],
            ['Vertigo', getAverageRatingPerMap('Vertigo')],
        ],
        dataLabels: {
            enabled: true,
            // rotation: -90,
            color: '#FFFFFF',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y:.2f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});

Highcharts.chart('winpercentagePerMap', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Win % per Map'
    },
    xAxis: {
        type: 'category',
        labels: {
            autoRotation: [-45, -90],
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Win %'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: "<b>{point.y:.2f}</b>"
    },
    series: [
        {
            name: 'Maps',
            colors: [
                '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
                '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
                '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
                '#03c69b', '#00f194'
            ],
            colorByPoint: true,
            groupPadding: 0,
            data: [
                ['Overpass', getWinLossRatio('Overpass')],
                ['Anubis', getWinLossRatio('Anubis')],
                ['Nuke', getWinLossRatio('Nuke')],
                ['Mirage', getWinLossRatio('Mirage')],
                ['Ancient', getWinLossRatio('Ancient')],
                ['Inferno', getWinLossRatio('Inferno')],
                ['Vertigo', getWinLossRatio('Vertigo')],
            ],
            dataLabels: {
                enabled: true,
                // rotation: -90,
                color: '#FFFFFF',
                inside: true,
                verticalAlign: 'top',
                format: '{point.y:.2f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
});

// Data retrieved from https://netmarketshare.com/
Highcharts.chart('winLossGraph', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Wins and Losses',
        align: 'center',
        verticalAlign: 'middle',
        y: 60,
        style: {
            fontSize: '1.1em'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: -90,
            endAngle: 90,
            center: ['50%', '75%'],
            size: '120%'
        }
    },
    series: [{
        type: 'pie',
        name: 'Win/Loss Ratio',
        innerSize: '50%',
        data: [
            ['Wins', data.winLoss.filter(x => x === 1).length],
            ['Losses', data.winLoss.filter(x => x === 0).length],
            ['Draws', data.winLoss.filter(x => x === 0.5).length]
        ]
    }]
});


function renderStats() {
    const kdaStats = document.getElementById('kdaStats');
    let tempData = document.createElement('p');

    tempData = document.createElement('p');
    tempData.classList.add('fw-bold', "p-1", "bg-primary", "text-white", "rounded");
    tempData.textContent = `Total Matches: ${data.maps.length} (${data.winLoss.filter(x => x === 1).length} Wins, ${data.winLoss.filter(x => x === 0).length} Losses, ${data.winLoss.filter(x => x === 0.5).length} Draws)`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('div');
    tempData.classList.add('col', "p-1", "bg-success", "text-white", "rounded", "m-1");
    tempData.textContent = `Kills: ${data.kills.reduce((a, b) => a + b, 0)}`;
    kdaStats.appendChild(tempData);

    let kda = data.kills.reduce((a, b) => a + b, 0) / data.deaths.reduce((a, b) => a + b, 0);
    tempData = document.createElement('p');
    tempData.classList.add('col', "p-1", "bg-warning", "text-white", "rounded", "m-1");
    tempData.textContent = `KDA: ${kda}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('div');
    tempData.classList.add('col', "p-1", "bg-danger", "text-white", "rounded", "m-1");
    tempData.textContent = `Deaths: ${data.deaths.reduce((a, b) => a + b, 0)}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('p');
    tempData.textContent = `Average HLTV Rating: ${getAverageRating()}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('p');
    tempData.textContent = `Best Performance: ${data.maps[data.hltvRating.indexOf(Math.max(...data.hltvRating))]} with a rating of ${Math.max(...data.hltvRating)}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('p');
    tempData.textContent = `Worst Performance: ${data.maps[data.hltvRating.indexOf(Math.min(...data.hltvRating))]} with a rating of ${Math.min(...data.hltvRating)}`;
    kdaStats.appendChild(tempData);


}




const addDataButton = document.getElementById('addData');
addDataButton.addEventListener('click', function () {
    const date = document.getElementById('date').value;
    const hltvRating = parseFloat(document.getElementById('hltvRating').value);
    //const leetifyRating = document.getElementById('leetifyRating').value;
    const map = document.getElementById('map').value;
    const winLoss = document.getElementById('winLoss').value;
    const kills = parseInt(document.getElementById('kills').value);
    const deaths = parseInt(document.getElementById('deaths').value);
    console.log(`Date: ${date}, HLTV Rating: ${hltvRating}, Map: ${map}, WinLoss: ${winLoss} Kills: ${kills} Deaths: ${deaths}`);
    if (!date || !hltvRating || !map || !winLoss || !kills) {
        alert('Please fill out all fields');
        return;
    }
    data.dates.push(date);
    data.hltvRating.push(parseFloat(hltvRating));
    data.maps.push(map);
    data.winLoss.push(parseFloat(winLoss));
    data.kills.push(kills);
    data.deaths.push(deaths);
    //data.leetifyRating.push(parseFloat(leetifyRating));
    localStorage.setItem('data', JSON.stringify(data));
    window.location.reload();
});



function resetData() {
    data = {
        "hltvRating": [
            1.23,
            1.39,
            1.07,
            1.04,
            1.4,
            1.2,
            1.21,
            0.86,
            1.61,
            1.08,
            1.1,
            1.24,
            0.95,
            1.21,
            1.29,
            1.47,
            0.96,
            1.14,
            0.84,
            1.42,
            1.37,
            1.08,
            1.18
        ],
        "dates": [
            "2024-04-02",
            "2024-04-02",
            "2024-04-02",
            "2024-04-02",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-03",
            "2024-04-04",
            "2024-04-04",
            "2024-04-04",
            "2024-04-04",
            "2024-04-09",
            "2024-04-09",
            "2024-04-09",
            "2024-04-09",
            "2024-04-09"
        ],
        "maps": [
            "Overpass",
            "Anubis",
            "Nuke",
            "Mirage",
            "Overpass",
            "Overpass",
            "Ancient",
            "Nuke",
            "Inferno",
            "Anubis",
            "Mirage",
            "Mirage",
            "Mirage",
            "Ancient",
            "Overpass",
            "Ancient",
            "Mirage",
            "Mirage",
            "Mirage",
            "Overpass",
            "Inferno",
            "Mirage",
            "Inferno"
        ],
        "winLoss": [
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            0,
            0,
            0,
            1,
            1,
            0,
            0.5,
            0,
            0,
            1,
            0,
            0
        ],
        "kills": [
        ],
        "deaths": [
        ]
    };

    localStorage.setItem('data', JSON.stringify(data));
}

function init() {
    renderStats();
}

init();