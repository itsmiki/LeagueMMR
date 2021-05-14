
function getkey() {
    document.getElementById("search_mmr_button").disabled = true; 
    setTimeout(getkey1, 1000)
}

function getkey1() {
    var URL = document.getElementById("api_url").href
    fetch(URL + '/api/v1/getkey',
        {headers: {'Bypass-Tunnel-Reminder': document.getElementById("ip").innerHTML}})
        .then(function (response) {
            response.json().then(data => {
                document.getElementById("api_key").innerHTML = data
                document.getElementById("search_mmr_button").disabled = false; 
            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
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

function getip() {
    var URL = document.getElementById("api_url").href
    fetch('https://api.my-ip.io/ip.json',
        {headers: {'Bypass-Tunnel-Reminder': 'application/json'}})
        .then(function (response) {
            response.json().then(data => {
                document.getElementById("ip").innerHTML = data.ip
            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}


function ask() {
    var name = document.getElementById("summoner_name").value;
    var region = document.getElementById("region").value;
    var Parent = document.getElementById('mmr_table');
    document.getElementById("search_mmr_button").disabled = true;
    document.getElementById("alert_waiting").hidden = false;
    while(Parent.hasChildNodes())
    {
        Parent.removeChild(Parent.firstChild);
    }
    document.getElementById("average").innerHTML = "";
    var URL = document.getElementById("api_url").href
    var key = document.getElementById("api_key").innerHTML
    console.log(key)
    console.log(URL + '/api/v1/gamemmr?name=' + name + '&region=' + region + '&apikey=' + key)
    fetch( URL + '/api/v1/gamemmr?name=' + name + '&region=' + region + '&apikey=' + key, 
        {headers: {'Bypass-Tunnel-Reminder': document.getElementById("ip").innerHTML}})
        .then(function (response) {
            response.json().then(data => {
                console.log(data.error);
                if(data.error != undefined) {
                    if(data.error == 429) {
                        window.alert("Too many requests. You can only request 5 times every minute.");
                        document.getElementById("search_mmr_button").disabled = false;
                        document.getElementById("alert_waiting").hidden = true;
                        return;
                    }
                    if(data.error == 403) {
                        window.alert("Error: Wrong key.");
                        document.getElementById("search_mmr_button").disabled = false;
                        document.getElementById("alert_waiting").hidden = true;
                        return;
                    }
                    if(data.error == 401) {
                        window.alert("Error: No key.");
                        document.getElementById("search_mmr_button").disabled = false;
                        document.getElementById("alert_waiting").hidden = true;
                        return;
                    }
                }
                if(data.game[10].average == -1) { //gracz nie istnieje
                    document.getElementById("average").innerHTML = "Player doesn't exist.";
                    document.getElementById("search_mmr_button").disabled = false;
                    document.getElementById("alert_waiting").hidden = true;
                    return;
                }
                for(var i=0; i<10; i++) {
                    if(data.game[i].mmr == 0)
                        data.game[i].mmr = "N/A"
                }
                if (data.game[10].average != null) {  //gracz jest w grze
                    let game_info = [
                        { NAME: data.game[0].nickname + " (" + data.game[0].champion + ")", MMR: data.game[0].mmr, TEAM: data.game[0].team, RANK: ucfirst(data.game[0].tier + " " + data.game[0].rank + " " + data.game[0].leaguePoints + " LP")},
                        { NAME: data.game[1].nickname + " (" + data.game[1].champion + ")", MMR: data.game[1].mmr, TEAM: data.game[1].team, RANK: ucfirst(data.game[1].tier + " " + data.game[1].rank + " " + data.game[1].leaguePoints + " LP")},
                        { NAME: data.game[2].nickname + " (" + data.game[2].champion + ")", MMR: data.game[2].mmr, TEAM: data.game[2].team, RANK: ucfirst(data.game[2].tier + " " + data.game[2].rank + " " + data.game[2].leaguePoints + " LP")},
                        { NAME: data.game[3].nickname + " (" + data.game[3].champion + ")", MMR: data.game[3].mmr, TEAM: data.game[3].team, RANK: ucfirst(data.game[3].tier + " " + data.game[3].rank + " " + data.game[3].leaguePoints + " LP")},
                        { NAME: data.game[4].nickname + " (" + data.game[4].champion + ")", MMR: data.game[4].mmr, TEAM: data.game[4].team, RANK: ucfirst(data.game[4].tier + " " + data.game[4].rank + " " + data.game[4].leaguePoints + " LP")},
                        { NAME: data.game[5].nickname + " (" + data.game[5].champion + ")", MMR: data.game[5].mmr, TEAM: data.game[5].team, RANK: ucfirst(data.game[5].tier + " " + data.game[5].rank + " " + data.game[5].leaguePoints + " LP")},
                        { NAME: data.game[6].nickname + " (" + data.game[6].champion + ")", MMR: data.game[6].mmr, TEAM: data.game[6].team, RANK: ucfirst(data.game[6].tier + " " + data.game[6].rank + " " + data.game[6].leaguePoints + " LP")},
                        { NAME: data.game[7].nickname + " (" + data.game[7].champion + ")", MMR: data.game[7].mmr, TEAM: data.game[7].team, RANK: ucfirst(data.game[7].tier + " " + data.game[7].rank + " " + data.game[7].leaguePoints + " LP")},
                        { NAME: data.game[8].nickname + " (" + data.game[8].champion + ")", MMR: data.game[8].mmr, TEAM: data.game[8].team, RANK: ucfirst(data.game[8].tier + " " + data.game[8].rank + " " + data.game[8].leaguePoints + " LP")},
                        { NAME: data.game[9].nickname + " (" + data.game[9].champion + ")", MMR: data.game[9].mmr, TEAM: data.game[9].team, RANK: ucfirst(data.game[9].tier + " " + data.game[9].rank + " " + data.game[9].leaguePoints + " LP")},
                    ];
                    let table = document.querySelector("table");
                    let headers = Object.keys(game_info[0]);
                    generateTableHead(table, headers);
                    generateTable(table, game_info);
                    document.getElementById("average").innerHTML = "Average MMR: " + data.game[10].average;
                    document.getElementById("search_mmr_button").disabled = false;
                    document.getElementById("alert_waiting").hidden = true;
                    }
                else {              // gracz nie jest w grze
                    document.getElementById("average").innerHTML = "Player isn't in a game.";
                    document.getElementById("search_mmr_button").disabled = false;
                    document.getElementById("alert_waiting").hidden = true;
                }

            });
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        if (key == "TEAM")
            continue
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    let tbody = table.createTBody();
    for (let element of data) {
        let row = tbody.insertRow();
        for (key in element) {
            if(element[key] == "red") {
                row.style.backgroundColor = "#ffcccc";
                continue;
            }
            if(element[key] == "blue") {
                row.style.backgroundColor = "#e6f5ff";
                continue
            }
            let cell = row.insertCell();
            let p = document.createElement("a")
            let text = document.createTextNode(element[key]);
            if(key == "RANK") {
                var img = document.createElement("img");
                var rank = element[key].split(' ')[0]
                img.src = "photos/" + rank.toLowerCase() + ".png";
                img.style.width = '25px';
                img.style.height = 'auto';
                cell.appendChild(img);
            }
            if(key == "NAME") {
                var img = document.createElement("img");
                var rank = element[key].split(' ')[0]
                img.src = "http://ddragon.leagueoflegends.com/cdn/11.10.1/img/champion/" + element[key]  + ".png";
                img.style.width = '25px';
                img.style.height = 'auto';
                cell.appendChild(img);
            }
            p.appendChild(text);
            cell.appendChild(p);

        }
    }
}

function ucfirst(str) {
    if(str == "undefined null null LP")
        return "Unranked";
    var firstLetter = str.substr(0, 1);
    return firstLetter + str.substr(1, str.indexOf(' ')).toLowerCase() + str.substr(str.indexOf(' ') + 1);
}
