
function update() {
    setInterval(update2, 1000)
}

function update2() {
    var seconds = document.getElementById("get_time").innerHTML;
    // console.log("działa")
    seconds = Number(seconds) + 1;
    document.getElementById("get_time").innerHTML = seconds;
    var time = new Date(seconds * 1000).toISOString().substr(11, 8);
    // console.log(time)
    if (time.substr(0, 2) == 0 && time.substr(3, 2) == 0)
        document.getElementById("time").innerHTML = "Last update " + time.substr(6, 2) + " seconds ago.";
    else {
        if (time.substr(0, 2) == 0)
            document.getElementById("time").innerHTML = "Last update " + time.substr(3, 2) + " minutes " + time.substr(6, 2) + " seconds ago.";
        else
            document.getElementById("time").innerHTML = "Last update " + time.substr(0, 2) + " hours " + time.substr(3, 2) + " minutes " + time.substr(6, 2) + " seconds ago."; 
    }
}

function check() {
    setTimeout(check1, 2500)
}

function check1() {
    if(document.getElementById("api_key").innerHTML == "")
        document.getElementById("alert_server_down").hidden = false;
    
}

function close_element(element_id) {
    document.getElementById(element_id).hidden = true;
}

function refresh() {
    var Parent = document.getElementById('ranking_text');
    document.getElementById("search_ranking_button").disabled = true;
    document.getElementById("alert_waiting").hidden = false;
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
    var URL = document.getElementById("api_url").href
    fetch(URL + '/api/v1/ranking/refresh',
        {headers: {'Bypass-Tunnel-Reminder': 'application/json'}})
        .then(function (response) {
            response.json().then(data => {
                if(data.time == -1) {
                    document.getElementById("search_ranking_button").disabled = false;
                    document.getElementById("alert_waiting").hidden = true;
                    window.alert("It's possible to refresh only once every 15 seconds.")
                    return
                }
                chart(data);
                time();
                document.getElementById("search_ranking_button").disabled = false;
                document.getElementById("alert_waiting").hidden = true;
            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}

function time() {
    var URL = document.getElementById("api_url").href
    fetch(URL + '/api/v1/ranking/time',
        {headers: {'Bypass-Tunnel-Reminder': 'application/json'}})
        .then(function (response) {
            response.json().then(data => {
                var d = new Date();
                console.log(Date())
                seconds =  Math.floor(d/1000 - data.time);
                document.getElementById("get_time").innerHTML = seconds;
                var time = new Date(seconds * 1000).toISOString().substr(11, 8);
                if (time.substr(0, 2) == 0 && time.substr(3, 2) == 0)
                    document.getElementById("time").innerHTML = "Last update " + time.substr(6, 2) + " seconds ago.";
                else {
                    if (time.substr(0, 2) == 0)
                        document.getElementById("time").innerHTML = "Last update " + time.substr(3, 2) + " minutes " + time.substr(6, 2) + " seconds ago.";
                    else
                        document.getElementById("time").innerHTML = "Last update " + time.substr(0, 2) + " hours " + time.substr(3, 2) + " minutes " + time.substr(6, 2) + " seconds ago."; 
                }
            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}
function load() {
    document.getElementById("search_ranking_button").disabled = true; 
    setTimeout(load1, 500)
}


function load1() {
    var Parent = document.getElementById('ranking_text');
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
    var URL = document.getElementById("api_url").href
    fetch(URL + '/api/v1/ranking/load',
        {headers: {'Bypass-Tunnel-Reminder': 'application/json'}})
        .then(function (response) {
            response.json().then(data => {
                chart(data);
                document.getElementById("search_ranking_button").disabled = false; 
            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}


function chart(data) {
    var chart = new CanvasJS.Chart("chartContainer", {
    theme: "light1", // "light1", "light2", "dark1"
    animationEnabled: true,
    exportEnabled: true,
    title: {
        text: "Current ranking",
        fontFamily: "Arial",
        fontWeight: "bold",
        fontSize: 40,
    },
    axisX: {
        margin: 10,
        labelPlacement: "inside",
        tickPlacement: "inside"
    },
    axisY2: {
        titleFontSize: 14,
        includeZero: true,
        suffix: "LP",
    },
    data: [{
        type: "bar",
        axisYType: "secondary",
        //yValueFormatString: "#,###.##LP",
        //indexLabel: "{y}",
        dataPoints: [
        { label: data.ranking[0]['RANKED_SOLO_5x5']['nickname'] + '  SOLO/DUO [' + data.ranking[0]['RANKED_SOLO_5x5']['tier'] + ' ' + data.ranking[0]['RANKED_SOLO_5x5']['rank'] + ' ' + data.ranking[0]['RANKED_SOLO_5x5']['leaguePoints'] + ' LP]', y: count(data, 0, 'RANKED_SOLO_5x5'), color: get_color(data.ranking[0]['RANKED_SOLO_5x5']['tier'])},
        { label: data.ranking[1]['RANKED_SOLO_5x5']['nickname'] + '  SOLO/DUO [' + data.ranking[1]['RANKED_SOLO_5x5']['tier'] + ' ' + data.ranking[1]['RANKED_SOLO_5x5']['rank'] + ' ' + data.ranking[1]['RANKED_SOLO_5x5']['leaguePoints'] + ' LP]', y: count(data, 1, 'RANKED_SOLO_5x5'), color: get_color(data.ranking[1]['RANKED_SOLO_5x5']['tier'])},
        { label: data.ranking[2]['RANKED_SOLO_5x5']['nickname'] + '  SOLO/DUO [' + data.ranking[2]['RANKED_SOLO_5x5']['tier'] + ' ' + data.ranking[2]['RANKED_SOLO_5x5']['rank'] + ' ' + data.ranking[2]['RANKED_SOLO_5x5']['leaguePoints'] + ' LP]', y: count(data, 2, 'RANKED_SOLO_5x5'), color: get_color(data.ranking[2]['RANKED_SOLO_5x5']['tier'])},
        { label: data.ranking[3]['RANKED_SOLO_5x5']['nickname'] + '  SOLO/DUO [' + data.ranking[3]['RANKED_SOLO_5x5']['tier'] + ' ' + data.ranking[3]['RANKED_SOLO_5x5']['rank'] + ' ' + data.ranking[3]['RANKED_SOLO_5x5']['leaguePoints'] + ' LP]', y: count(data, 3, 'RANKED_SOLO_5x5'), color: get_color(data.ranking[3]['RANKED_SOLO_5x5']['tier'])},
        { label: " ", y: 0},
        { label: data.ranking[0]['RANKED_FLEX_SR']['nickname'] + '  FLEX [' + data.ranking[0]['RANKED_FLEX_SR']['tier'] + ' ' + data.ranking[0]['RANKED_FLEX_SR']['rank'] + ' ' + data.ranking[0]['RANKED_FLEX_SR']['leaguePoints'] + ' LP]', y: count(data, 0, 'RANKED_FLEX_SR'), color: get_color(data.ranking[0]['RANKED_FLEX_SR']['tier'])},
        { label: data.ranking[1]['RANKED_FLEX_SR']['nickname'] + '  FLEX [' + data.ranking[1]['RANKED_FLEX_SR']['tier'] + ' ' + data.ranking[1]['RANKED_FLEX_SR']['rank'] + ' ' + data.ranking[1]['RANKED_FLEX_SR']['leaguePoints'] + ' LP]', y: count(data, 1, 'RANKED_FLEX_SR'), color: get_color(data.ranking[1]['RANKED_FLEX_SR']['tier'])},
        { label: data.ranking[2]['RANKED_FLEX_SR']['nickname'] + '  FLEX [' + data.ranking[2]['RANKED_FLEX_SR']['tier'] + ' ' + data.ranking[2]['RANKED_FLEX_SR']['rank'] + ' ' + data.ranking[2]['RANKED_FLEX_SR']['leaguePoints'] + ' LP]', y: count(data, 2, 'RANKED_FLEX_SR'), color: get_color("BRONZE")},
        { label: data.ranking[3]['RANKED_FLEX_SR']['nickname'] + '  FLEX [' + data.ranking[3]['RANKED_FLEX_SR']['tier'] + ' ' + data.ranking[3]['RANKED_FLEX_SR']['rank'] + ' ' + data.ranking[3]['RANKED_FLEX_SR']['leaguePoints'] + ' LP]', y: count(data, 3, 'RANKED_FLEX_SR'), color: get_color(data.ranking[3]['RANKED_FLEX_SR']['tier'])},
        ]
    }]
    });
    chart.render();
    //chart.axisY2[0]._labels[4].textBlock.text = 'silver'
}

function count(data, position, queue) {
    let sum = 0;
    switch (data.ranking[position][queue]['tier']) {
        case "BRONZE":
            sum += 400;
            break;
        case "SILVER":
            sum += 800;
            break;
        case "GOLD":
            sum += 1200;
            break;
        case "PLATINUM":
            sum += 1600;
            break;
    }

    switch (data.ranking[position][queue]['rank']) {
        case "IV":
            sum += 0;
            break;
        case "III":
            sum += 100;
            break;
        case "II":
            sum += 200;
            break;
        case "I":
            sum += 300;
            break;
    }
    
    sum += data.ranking[position][queue]['leaguePoints']

    return sum;
}

function get_color(rank) {
    let color;
    switch (rank) {
        case "BRONZE":
            color = '#76400a';
            break;
        case "SILVER":
            color = '#C0C0C0';
            break;
        case "GOLD":
            color = '#DAA520';
            break;
        case "PLATINUM":
            color = '#59cfa6';
            break;
    }
    return color;
}

function read()  
{  
     var txtFile = new XMLHttpRequest();  
     txtFile.open("GET", "https://github.com/itsmiki/itsmiki.github.io/blob/main/server_address.txt", true);
     console.log("funkcja")
     txtFile.onreadystatechange = function()   
     {  
          if (txtFile.readyState === 4)   
          {  
               // Makes sure the document is ready to parse.  
               if (txtFile.status === 200)   
               {  
                    // Makes sure it's found the file. 
                    console.log("działa");
                    document.getElementById("api_url").href = txtFile.responseText;  
               }  
          }  
     }  
     txtFile.send(null)  
}  


















// https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/uX0sDT_aEj4CzpYItA-aGDtRXFagBvcR2E5-ZlIUyUWZY0U?api_key={api key}

// //Meth is Good - uX0sDT_aEj4CzpYItA-aGDtRXFagBvcR2E5-ZlIUyUWZY0U

// //4566769 - L4yCUrElQv0XcnI6j6NC5hb3j69Q1Dt7_f-vegU-4-todP4

// //4566768 - IRBxAbwyDZOKzZtbIsafRS-tkH-jffp7-ZACmzzjeNxHHCs

// //DzikUPL - Lsg8ZfPprweVAVQgnjuozV9QErLxO2ue9SAXzrTHFVqDI2c

// var api_key = "RGAPI-5d1c853f-8d87-4ae7-ad72-4c037744a9f2";
// var miki = "uX0sDT_aEj4CzpYItA-aGDtRXFagBvcR2E5-ZlIUyUWZY0U";
// var kacper = "Lsg8ZfPprweVAVQgnjuozV9QErLxO2ue9SAXzrTHFVqDI2c";
// var czarek = "IRBxAbwyDZOKzZtbIsafRS-tkH-jffp7-ZACmzzjeNxHHCs";
// var michal = "L4yCUrElQv0XcnI6j6NC5hb3j69Q1Dt7_f-vegU-4-todP4";

// var array = []

// function ask(name, id, key) {
//     console.log('https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key)
//     var Parent = document.getElementById('ranking_text'); 
//     while(Parent.hasChildNodes())
//     {
//         Parent.removeChild(Parent.firstChild);
//     }
//     // fetch('https://pumpkin-pie-66118.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key)
//     //     .then(function (response) {
//     //         response.json().then(data => {
//     //             var solo_tier = data[0].tier;
//     //             var solo_rank = data[0].rank;
//     //             var solo_lp = data[0].leaguePoints;
//     //             var flex_tier = data[1].tier;
//     //             var flex_rank = data[1].rank;
//     //             let p = document.createElement("p");
//     //             var text = document.createTextNode(name + ' ' + solo_tier + ' ' + solo_rank + ' ' + solo_lp + 'lp');
//     //             p.appendChild(text);
//     //             let div = document.getElementById("ranking_text");
//     //             div.appendChild(p);
//     //             save([name, solo_tier, solo_rank, solo_lp])
//     //         });
//     //     })
//     //     .catch(function (err) {
//     //         console.log("Something went wrong!", err);
//     //     });

//         Promise.all([
//             fetch('https://pumpkin-pie-66118.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key),
//             fetch('https://pumpkin-pie-66118.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key),
//             fetch('https://pumpkin-pie-66118.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key),
//             fetch('https://pumpkin-pie-66118.herokuapp.com/https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id + '?api_key=' + key),
//         ]).then(function (responses) {
//             // Get a JSON object from each of the responses
//             Promise.all(responses.map(function (response) {
//                 response.json().then( data => {
//                     console.log(responses[0]);
//                 })
//             })
//             )
//         }).catch(function (error) {
//             // if there's an error, log it
//             console.log(error);
//         });
        
// }

// function save(array1) {
//     array.push(array1);
//     console.log(array);
// }
