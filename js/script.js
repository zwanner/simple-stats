
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
        colors: [
            '#9b20d9',
            '#6225ed', 
            '#3e5ccf'
        ],
        data: [
            ['Wins', data.winLoss.filter(x => x === 1).length],
            ['Losses', data.winLoss.filter(x => x === 0).length],
            ['Draws', data.winLoss.filter(x => x === 0.5).length]
        ]
    }]
});




// Create the chart
Highcharts.chart('winpercentagePerMapBarChart', {
    chart: {
        type: 'column'
    },
    title: {
        align: 'center',
        text: 'Win Percentage per Map'
    },
    accessibility: {
        announceNewData: {
            enabled: true
        }
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: 'Win Percentage'
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b> of matches<br/>'
    },

    series: [
        {
            name: 'Map Win Percentage',
            colorByPoint: true,
            colors: [
                '#9b20d9', '#9215ac', '#861ec9', '#7a17e6', '#7010f9', '#691af3',
                '#6225ed', '#5b30e7', '#533be1', '#4c46db', '#4551d5', '#3e5ccf',
                '#3667c9', '#2f72c3', '#277dbd', '#1f88b7', '#1693b1', '#0a9eaa',
                '#03c69b', '#00f194'
            ],
            data: [
                {
                    name: 'Overpass',
                    y: getWinLossRatio('Overpass')*100,
                },
                {
                    name: 'Anubis',
                    y: getWinLossRatio('Anubis')*100,
                },
                {
                    name: 'Nuke',
                    y: getWinLossRatio('Nuke')*100,
                },
                {
                    name: 'Mirage',
                    y: getWinLossRatio('Mirage')*100,
                },
                {
                    name: 'Ancient',
                    y: getWinLossRatio('Ancient')*100,
                },
                {
                    name: 'Inferno',
                    y: getWinLossRatio('Inferno')*100,
                },
                {
                    name: 'Vertigo',
                    y: getWinLossRatio('Vertigo')*100,
                }
            ]
        }
    ]
    
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
    tempData.textContent = `KDA: ${kda.toFixed(2)}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('div');
    tempData.classList.add('col', "p-1", "bg-danger", "text-white", "rounded", "m-1");
    tempData.textContent = `Deaths: ${data.deaths.reduce((a, b) => a + b, 0)}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('p');
    tempData.textContent = `Average ADR: ${(data.adr.reduce((a, b) => a + b, 0) / data.adr.length).toFixed(2)}`;
    kdaStats.appendChild(tempData);

    tempData = document.createElement('p');
    tempData.textContent = `Average HLTV Rating: ${getAverageRating().toFixed(2)}`;
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
    const adr = parseFloat(document.getElementById('adr').value);
    console.log(`Date: ${date}, HLTV Rating: ${hltvRating}, ADR: ${adr}, Map: ${map}, WinLoss: ${winLoss} Kills: ${kills} Deaths: ${deaths}`);
    if (!date || !hltvRating || !map || !winLoss || !kills || !deaths || !adr) {
        alert('Please fill out all fields');
        return;
    }
    data.dates.push(date);
    data.hltvRating.push(parseFloat(hltvRating));
    data.maps.push(map);
    data.winLoss.push(parseFloat(winLoss));
    data.kills.push(kills);
    data.deaths.push(deaths);
    data.adr.push(adr);
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
        ],
        "adr": [
        ],
    };

    localStorage.setItem('data', JSON.stringify(data));
}

function init() {
    renderStats();
}

init();

resetStatsButton = document.getElementById('resetStats');
resetStatsButton.addEventListener('click', function () {
    const confirmReset = confirm('Are you sure you want to reset all data?');
    if (!confirmReset) {
        return;
    }
    resetData();
    window.location.reload();
});