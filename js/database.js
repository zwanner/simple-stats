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


function storeData(data) {
    let database_ref = database.ref();
    database_ref.child('data').set(data);
    console.log("Data stored: " + JSON.stringify(data));
}

const storetoDB = document.getElementById('storetoDB');
storetoDB.addEventListener('click', () => {
    const confirmStore = confirm("Are you sure you want to store the data? \nThis will overwrite the current data in the database with the data in the local storage.");
    if (!confirmStore) {
        return;
    }
    let data = JSON.parse(localStorage.getItem("data"));
    storeData(data);

});


function loadData() {
    let database_ref = database.ref();
    database_ref.child('data').get().then((snapshot) => {
        if (snapshot.exists()) {
            // console.log("Data loaded: " + JSON.stringify(snapshot.val()));
            localStorage.setItem("data", JSON.stringify(snapshot.val()));
            return snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

loadData();

export { storeData, loadData};
