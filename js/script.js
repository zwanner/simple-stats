
let data = JSON.parse(localStorage.getItem('data'));

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


const firebaseConfig = {

    apiKey: "AIzaSyAbw3z6E8CtpEjtmMeCMUbW_00X9VKgUcY",

    authDomain: "simple-stats-8f46a.firebaseapp.com",

    databaseURL: "https://simple-stats-8f46a-default-rtdb.firebaseio.com",

    projectId: "simple-stats-8f46a",

    storageBucket: "simple-stats-8f46a.appspot.com",

    messagingSenderId: "193913248538",

    appId: "1:193913248538:web:8260d4e5326abf21edeaa3",

    measurementId: "G-34N2P8M2Y1"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// function guidGenerator() {
//     var S4 = function () {
//         return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
//     };
//     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
// }

function setUser(user) {
    localStorage.setItem('user', user);
    window.location.reload();
}

function getUser() {
    if (!localStorage.getItem('user')) {
        setUser(prompt('Please enter your username'));
    }
    console.log(localStorage.getItem('user'));
    return localStorage.getItem('user');
}


let user = getUser();



function storeData(data) {
    let database_ref = database.ref();
    database_ref.child(user).set(data);
    console.log("Data stored: " + JSON.stringify(data));
}



function loadData() {
    localStorage.removeItem('data');
    let database_ref = database.ref();
    database_ref.child(user).get().then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Data loaded: " + JSON.stringify(snapshot.val()));
            localStorage.setItem("data", JSON.stringify(snapshot.val()));
            return snapshot.val();
        } else {
            console.log("No data available");
            data[user] = {
                dates: [],
                hltvRating: [],
                maps: [],
                winLoss: [],
                kills: [],
                deaths: [],
                adr: []
            };
            localStorage.setItem('data', JSON.stringify(data));
        }
    }).catch((error) => {
        console.error(error);
    });
}

loadData();


let dates = data[user].dates;


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
    tooltip: {
        shared: true,
        crosshairs: true,
        //round down to 2 decimal places
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f}</b><br/>'
    },
    series: [{
        name: 'HTLV Rating',
        data: data[user].hltvRating
    },
    {
        name: "K/D Ratio",
        data: data[user].kills.map((x, i) => x / data[user].deaths[i])
    }]
});

Highcharts.chart('ADRGraph', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'ADR over time'
    },
    xAxis: {
        categories: dates,
    },
    yAxis: {
        title: {
            text: 'ADR'
        }
    },
    series: [{
        name: 'ADR',
        data: data[user].adr
    }]
});

function getAverageRating() {
    let sum = 0;
    for (let i = 0; i < data[user].hltvRating.length; i++) {
        sum += data[user].hltvRating[i];
    }
    return sum / data[user].hltvRating.length;
}

//get average rating per map
function getAverageRatingPerMap(map) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < data[user].maps.length; i++) {
        if (data[user].maps[i] === map) {
            sum += data[user].hltvRating[i];
            count++;
        }
    }
    return sum / count;
}

function getWinLossRatio(map) {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    for (let i = 0; i < data[user].maps.length; i++) {
        if (data[user].maps[i] === map) {
            if (data[user].winLoss[i] === 1) {
                wins++;
            } else if (data[user].winLoss[i] === 0) {
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
            color: '#000000',
            inside: true,
            verticalAlign: 'top',
            format: '{point.y:.2f}', // one decimal
            y: -25, // 10 pixels down from the top
            style: {
                fontSize: '13px',
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
        verticalAlign: 'top',
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
            ['Wins', data[user].winLoss.filter(x => x === 1).length],
            ['Losses', data[user].winLoss.filter(x => x === 0).length],
            ['Draws', data[user].winLoss.filter(x => x === 0.5).length]
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
                format: '{point.y:.1f}%',
                style: {
                    fontSize: '13px',
                }
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
                    y: getWinLossRatio('Overpass') * 100,
                },
                {
                    name: 'Anubis',
                    y: getWinLossRatio('Anubis') * 100,
                },
                {
                    name: 'Nuke',
                    y: getWinLossRatio('Nuke') * 100,
                },
                {
                    name: 'Mirage',
                    y: getWinLossRatio('Mirage') * 100,
                },
                {
                    name: 'Ancient',
                    y: getWinLossRatio('Ancient') * 100,
                },
                {
                    name: 'Inferno',
                    y: getWinLossRatio('Inferno') * 100,
                },
                {
                    name: 'Vertigo',
                    y: getWinLossRatio('Vertigo') * 100,
                }
            ]
        }
    ]

});

Highcharts.chart('kpgdpgGraph', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Kills and Deaths per Map',
        align: 'center'
    },
    xAxis: {
        categories: ['Overpass', 'Anubis', 'Nuke', 'Mirage', 'Ancient', 'Inferno', 'Vertigo']
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percent'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent',
            dataLabels: {
                enabled: true,
                format: '{point.percentage:.0f}%'
            }
        }
    },
    series: [{
        name: 'Kills',
        data: [
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0),
            data[user].kills.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0)
        ]
    }, {
        name: 'Deaths',
        data: [
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0),
            data[user].deaths.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0)
        ]
    }]
});



function renderStats() {
    const kdaStats = document.getElementById('leftStats');
    let tempData = document.createElement('p');

    
    // tempData = document.createElement('p');
    // tempData.textContent = `Best Performance: ${data[user].maps[data[user].hltvRating.indexOf(Math.max(data[user].hltvRating))]} with a rating of ${Math.max(data[user].hltvRating)}`;
    // kdaStats.appendChild(tempData);

    // tempData = document.createElement('p');
    // tempData.textContent = `Worst Performance: ${data[user].maps[data[user].hltvRating.indexOf(Math.min(data[user].hltvRating))]} with a rating of ${Math.min(data[user].hltvRating)}`;
    // kdaStats.appendChild(tempData);

    const aadr = document.getElementById('AADR');
    const akpg = document.getElementById('AKpG');
    const adpg = document.getElementById('ADpG');
    const ahpg = document.getElementById('AHpG');

    aadr.textContent = `${(data[user].adr.reduce((a, b) => a + b, 0) / data[user].adr.length).toFixed(2)}`;
    akpg.textContent = `${(data[user].kills.reduce((a, b) => a + b, 0) / data[user].kills.length).toFixed(2)}`;
    adpg.textContent = `${(data[user].deaths.reduce((a, b) => a + b, 0) / data[user].deaths.length).toFixed(2)}`;
    ahpg.textContent = `${(data[user].hltvRating.reduce((a, b) => a + b, 0) / data[user].hltvRating.length).toFixed(2)}`;


    const oaadr = document.getElementById('oAADR');
    const oakpg = document.getElementById('oAKpG');
    const oadpg = document.getElementById('oADpG');
    const oahpg = document.getElementById('oAHpG');

    oaadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Overpass').length).toFixed(2)}`;
    oakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Overpass').length).toFixed(2)}`;
    oadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Overpass').length).toFixed(2)}`;
    oahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Overpass').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Overpass').length).toFixed(2)}`;

    const anbaadr = document.getElementById('anbAADR');
    const anbakpg = document.getElementById('anbAKpG');
    const anbadpg = document.getElementById('anbADpG');
    const anbahpg = document.getElementById('anbAHpG');

    anbaadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Anubis').length).toFixed(2)}`;
    anbakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Anubis').length).toFixed(2)}`;
    anbadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Anubis').length).toFixed(2)}`;
    anbahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Anubis').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Anubis').length).toFixed(2)}`;

    const naadr = document.getElementById('nAADR');
    const nakpg = document.getElementById('nAKpG');
    const nadpg = document.getElementById('nADpG');
    const nahpg = document.getElementById('nAHpG');

    naadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Nuke').length).toFixed(2)}`;
    nakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Nuke').length).toFixed(2)}`;
    nadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Nuke').length).toFixed(2)}`;
    nahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Nuke').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Nuke').length).toFixed(2)}`;

    const maadr = document.getElementById('mAADR');
    const makpg = document.getElementById('mAKpG');
    const madpg = document.getElementById('mADpG');
    const mahpg = document.getElementById('mAHpG');

    maadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Mirage').length).toFixed(2)}`;
    makpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Mirage').length).toFixed(2)}`;
    madpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Mirage').length).toFixed(2)}`;
    mahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Mirage').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Mirage').length).toFixed(2)}`;

    const ancaadr = document.getElementById('ancAADR');
    const ancakpg = document.getElementById('ancAKpG');
    const ancadpg = document.getElementById('ancADpG');
    const ancahpg = document.getElementById('ancAHpG');

    ancaadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Ancient').length).toFixed(2)}`;
    ancakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Ancient').length).toFixed(2)}`;
    ancadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Ancient').length).toFixed(2)}`;
    ancahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Ancient').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Ancient').length).toFixed(2)}`;

    const iaadr = document.getElementById('iAADR');
    const iakpg = document.getElementById('iAKpG');
    const iadpg = document.getElementById('iADpG');
    const iahpg = document.getElementById('iAHpG');

    iaadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Inferno').length).toFixed(2)}`;
    iakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Inferno').length).toFixed(2)}`;
    iadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Inferno').length).toFixed(2)}`;
    iahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Inferno').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Inferno').length).toFixed(2)}`;

    const vaadr = document.getElementById('vAADR');
    const vakpg = document.getElementById('vAKpG');
    const vadpg = document.getElementById('vADpG');
    const vahpg = document.getElementById('vAHpG');
    
    vaadr.textContent = `${(data[user].adr.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0) / data[user].adr.filter((x, i) => data[user].maps[i] === 'Vertigo').length).toFixed(2)}`;
    vakpg.textContent = `${(data[user].kills.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0) / data[user].kills.filter((x, i) => data[user].maps[i] === 'Vertigo').length).toFixed(2)}`;
    vadpg.textContent = `${(data[user].deaths.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0) / data[user].deaths.filter((x, i) => data[user].maps[i] === 'Vertigo').length).toFixed(2)}`;
    vahpg.textContent = `${(data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Vertigo').reduce((a, b) => a + b, 0) / data[user].hltvRating.filter((x, i) => data[user].maps[i] === 'Vertigo').length).toFixed(2)}`;

    const totalMatches = document.getElementById('totalMatches');
    totalMatches.textContent = data[user].dates.length;
    const totalWins = document.getElementById('totalWins');
    totalWins.textContent = data[user].winLoss.filter(x => x === 1).length;
    const totalLosses = document.getElementById('totalLosses');
    totalLosses.textContent = data[user].winLoss.filter(x => x === 0).length;
    const totalKills = document.getElementById('totalKills');
    totalKills.textContent = data[user].kills.reduce((a, b) => a + b, 0);
    const totalDeaths = document.getElementById('totalDeaths');
    totalDeaths.textContent = data[user].deaths.reduce((a, b) => a + b, 0);

    // total adr and htvl values recorded
    const totalADR = document.getElementById('totalADR');
    totalADR.textContent = data[user].adr.reduce((a, b) => a + b, 0).toFixed(2);
    const totalHLTV = document.getElementById('totalHLTV');
    totalHLTV.textContent = data[user].hltvRating.reduce((a, b) => a + b, 0).toFixed(2);

}




const addDataButton = document.getElementById('addData');
addDataButton.addEventListener('click', function () {
    const date = document.getElementById('date').value;
    document.getElementById('date').value = '';
    const hltvRating = parseFloat(document.getElementById('hltvRating').value);
    document.getElementById('hltvRating').value = '';
    //const leetifyRating = document.getElementById('leetifyRating').value;
    const map = document.getElementById('map').value;
    document.getElementById('map').value = '';
    const winLoss = document.getElementById('winLoss').value;
    document.getElementById('winLoss').value = '';
    const kills = parseInt(document.getElementById('kills').value);
    document.getElementById('kills').value = '';
    const deaths = parseInt(document.getElementById('deaths').value);
    document.getElementById('deaths').value = '';
    const adr = parseFloat(document.getElementById('adr').value);
    document.getElementById('adr').value = '';
    console.log(`Date: ${date}, HLTV Rating: ${hltvRating}, ADR: ${adr}, Map: ${map}, WinLoss: ${winLoss} Kills: ${kills} Deaths: ${deaths}`);
    if (!date || !hltvRating || !map || !winLoss || !kills || !deaths || !adr) {
        alert('Please fill out all fields');
        return;
    }
    data[user].dates.push(date);
    data[user].hltvRating.push(parseFloat(hltvRating));
    data[user].maps.push(map);
    data[user].winLoss.push(parseFloat(winLoss));
    data[user].kills.push(kills);
    data[user].deaths.push(deaths);
    data[user].adr.push(adr);
    console.log(data);
    //data[user].leetifyRating.push(parseFloat(leetifyRating));
    localStorage.setItem('data', JSON.stringify(data));
    storeData(data);
    window.location.reload();
});


const searchUserButton = document.getElementById('searchUser');
searchUserButton.addEventListener('click', function () {
    const user = document.getElementById('search').value;
    setUser(user);
});





// fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?key=${apiKey}&steamid=${steamID}>&appid=730`, { mode: 'no-cors' })
//     .then(response => {
//         console.log(response);
//     })
//     .then(data => { collectData(data) });

function init() {
    renderStats();
}

init();






