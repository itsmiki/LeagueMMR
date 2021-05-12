import flask
from flask import request, jsonify
from flask_cors import CORS
import time

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

api_key = ''
API_KEYS = {}

@app.route('/', methods=['GET'])
def home():
    return '''<h1>League of Legends API</h1>
<p>A prototype API for getting MMR of all players in a game.</p>'''

@app.route('/api/v1/getkey', methods=['GET'])
def get_key():
    import string
    import random
    request_ip = request.headers.get('Bypass-Tunnel-Reminder')
    # print(request_ip)
    for key1, ip1 in API_KEYS.items(): 
        if ip1[0] == request_ip:
            print(API_KEYS)
            return jsonify(key1)


    def get_random_string():
        letters = string.ascii_uppercase
        result_str = ''.join(random.choice(letters) for i in range(12))
        return(result_str)
    
    key = get_random_string()
    API_KEYS.update({key: [request_ip, 0]})

    print(API_KEYS)
    return jsonify(key)

@app.route('/api/v1/gamemmr', methods=['GET'])
def api_mmr():
    if 'apikey' in request.args:
        try:
            apikey = name = str(request.args['apikey'])
            if apikey != 'MASTER_KEY':
                request_ip = request.headers.get('Bypass-Tunnel-Reminder')
                #print(API_KEYS)
                if API_KEYS[apikey][0] != request_ip:
                    return jsonify({'error': 403}) #klucz nie pasuje do ip
                if API_KEYS[apikey][1] > 4:
                    return jsonify({'error': 429}) #za duzo zapytan
                API_KEYS[apikey][1] += 1
        except:
            return jsonify({'error': 403}) #niewłaściwy klucz
    else:
        return jsonify({'error': 401}) #brak klucza


    if 'name' in request.args:
        name = str(request.args['name'])
        print(name)
    else:
        return "Error: No name field provided. Please specify an id."

    if 'region' in request.args:
        region = str(request.args['region'])
        print(region)
    else:
        return "Error: No region field provided. Please specify an id."

    from riotwatcher import LolWatcher, ApiError
    import requests

    lol_watcher = LolWatcher(api_key)

    if region == 'eune':
        URL = 'https://eune.whatismymmr.com/api/v1/summoner?name='
        my_region = 'eun1'
    elif region == 'euw':
        URL = 'https://euw.whatismymmr.com/api/v1/summoner?name='
        my_region = 'euw1'
    elif region == 'na':
        URL = 'https://na.whatismymmr.com/api/v1/summoner?name='
        my_region = 'na1'
    else:
        return "Error: Wrong region."

    

    results = { 'game': [
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'nickname': None,
        'team': None,
        'available': None,
        'mmr': None,
        'champion': None,
        'tier': None,
        'rank': None,
        'leaguePoints': None,
    },
    {
        'average': None,
        'number': None,
    }
    ] }

    try:
        me = lol_watcher.summoner.by_name(my_region, name)
    except requests.HTTPError as exception:
        results['game'][10]['average'] = -1
        print(exception)
        return jsonify(results)

    try:
        match_info = lol_watcher.spectator.by_summoner(my_region, me['id'])
    except requests.HTTPError as exception:
        print("Player isn't in a game")
        print(exception)
        #results = {'status': 'Player not in the game.'}
        return jsonify(results)

    import requests
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    from timeit import default_timer
    import re

    START_TIME = default_timer()

    def get_or_create_eventloop():
        try:
            return asyncio.get_event_loop()
        except RuntimeError as ex:
            if "There is no current event loop in thread" in str(ex):
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                return asyncio.get_event_loop()

    def fetch(session, csv):
        base_url = "https://euw.whatismymmr.com/api/v1/summoner?name="
        with session.get(URL + csv[0]) as response:
            data = response.json()
            if response.status_code != 200:
                print("FAILURE::{0}".format(URL))

            elapsed = default_timer() - START_TIME
            time_completed_at = "{:5.2f}s".format(elapsed)
            
            
            try:
                mmr = response.json()['ranked']['avg']
                print("{0:<20} {1:<5} {2:>20}".format(csv[0], mmr, time_completed_at))
                if(mmr != None):
                    return csv[0], 1, response.json()['ranked']['avg'], csv[1]
            except:
                print("{0:<20} {1:<5} {2:>20}".format(csv[0], "N/A", time_completed_at))
                return csv[0], 0, 0, csv[1]

    async def get_data_asynchronous():
        csvs_to_fetch = [
            [match_info['participants'][0]['summonerName'], match_info['participants'][0]['teamId']],
            [match_info['participants'][1]['summonerName'], match_info['participants'][1]['teamId']],
            [match_info['participants'][2]['summonerName'], match_info['participants'][2]['teamId']],
            [match_info['participants'][3]['summonerName'], match_info['participants'][3]['teamId']],
            [match_info['participants'][4]['summonerName'], match_info['participants'][4]['teamId']],
            [match_info['participants'][5]['summonerName'], match_info['participants'][5]['teamId']],
            [match_info['participants'][6]['summonerName'], match_info['participants'][6]['teamId']],
            [match_info['participants'][7]['summonerName'], match_info['participants'][7]['teamId']],
            [match_info['participants'][8]['summonerName'], match_info['participants'][8]['teamId']],
            [match_info['participants'][9]['summonerName'], match_info['participants'][9]['teamId']]
        ]
        print("{0:<20} {1:<5} {2:>20}".format("Nickname", "MMR", "Completed at"))
        with ThreadPoolExecutor(max_workers=10) as executor:
            with requests.Session() as session:
                # Set any session parameters here before calling `fetch`
                loop = asyncio.get_event_loop()
                START_TIME = default_timer()
                tasks = [
                    loop.run_in_executor(
                        executor,
                        fetch,
                        *(session, csv) # Allows us to pass in multiple arguments to `fetch`
                    )
                    for csv in csvs_to_fetch
                ]
                for response in await asyncio.gather(*tasks):
                    pass
        return tasks

    def main():
        how_many = 0
        mmr_sum = 0
        loop = get_or_create_eventloop()
        future = asyncio.ensure_future(get_data_asynchronous())
        loop.run_until_complete(future)
        #print(str(future.result()))
        champion_dict = {'266': 'Aatrox', '103': 'Ahri', '84': 'Akali', '12': 'Alistar', '32': 'Amumu', '34': 'Anivia', '1': 'Annie', '22': 'Ashe', '136': 'Aurelion Sol', '268': 'Azir', '432': 'Bard', '53': 'Blitzcrank', '63': 'Brand', '201': 'Braum', '51': 'Caitlyn', '164': 'Camille', '69': 'Cassiopeia', '31': 'Cho`Gath', '42': 'Corki', '122': 'Darius', '131': 'Diana', '119': 'Draven', '36': 'Dr Mundo', '245': 'Ekko', '60': 'Elise', '28': 'Evelynn', '81': 'Ezreal', '9': 'Fiddlesticks', '114': 'Fiora', '105': 'Fizz', '3': 'Galio', '41': 'Gangplank', '86': 'Garen', '150': 'Gnar', '79': 'Gragas', '104': 'Graves', '120': 'Hecarim', '74': 'Heimerdinger', '420': 'Illaoi', '39': 'Irelia', '427': 'Ivern', '40': 'Janna', '59': 'Jarvan IV', '24': 'Jax', '126': 'Jayce', '202': 'Jhin', '222': 'Jinx', '429': 'Kalista', '43': 'Karma', '30': 'Karthus', '38': 'Kassadin', '55': 'Katarina', '10': 'Kayle', '85': 'Kennen', '121': 'Kha`Zix', '203': 'Kindred', '240': 'Kled', '96': 'Kog`Maw', '7': 'Leblanc', '64': 'Lee Sin', '89': 'Leona', '127': 'Lissandra', '236': 'Lucian', '117': 'Lulu', '99': 'Lux', '54': 'Malphite', '90': 'Malzahar', '57': 'Maokai', '11': 'Master Yi', '21': 'Miss Fortune', '62': 'Wukong', '82': 'Mordekaiser', '25': 'Morgana', '267': 'Nami', '75': 'Nasus', '111': 'Nautilus', '76': 'Nidalee', '56': 'Nocturne', '20': 'Nunu & Willump', '2': 'Olaf', '61': 'Orianna', '80': 'Pantheon', '78': 'Poppy', '133': 'Quinn', '33': 'Rammus', '421': 'Rek`Sai', '58': 'Renekton', '107': 'Rengar', '92': 'Riven', '68': 'Rumble', '13': 'Ryze', '113': 'Sejuani', '35': 'Shaco', '98': 'Shen', '102': 'Shyvana', '27': 'Singed', '14': 'Sion', '15': 'Sivir', '72': 'Skarner', '37': 'Sona', '16': 'Soraka', '50': 'Swain', '134': 'Syndra', '223': 'Tahm Kench', '163': 'Taliyah', '91': 'Talon', '44': 'Taric', '17': 'Teemo', '412': 'Thresh', '18': 'Tristana', '48': 'Trundle', '23': 'Tryndamere', '4': 'Twisted Fate', '29': 'Twitch', '77': 'Udyr', '6': 'Urgot', '110': 'Varus', '67': 'Vayne', '45': 'Veigar', '161': 'Vel`Koz', '254': 'Vi', '112': 'Viktor', '8': 'Vladimir', '106': 'Volibear', '19': 'Warwick', '101': 'Xerath', '5': 'Xin Zhao', '157': 'Yasuo', '83': 'Yorick', '154': 'Zac', '238': 'Zed', '115': 'Ziggs', '26': 'Zilean', '143': 'Zyra', '498': 'Xayah', '497' '497': 'Rakan', '141': 'Kayn', '516': 'Ornn', '142': 'Zoe', '145': 'Kai`Sa', '555': 'Pyke', '518': 'Neeko', '517': 'Sylas', '350': 'Yuumi', '246': 'Qiyana', '235': 'Senna', '523': 'Aphelios', '875': 'Sett', '876': 'Lillia', '777': 'Yone', '360': 'Samira', '147': 'Seraphine', '526': 'Rell', '234': 'Viego'}
        for i in range (0, 10):
            summoner_name = str(future.result()[i]).split('\'')[1::2]
            position = str(future.result()[i]).find('\'', 26)
            results['game'][i]['nickname'] = summoner_name[0]
            results['game'][i]['available'] = int(str(future.result()[i])[position + 3])
            results['game'][i]['champion'] = champion_dict[str(match_info['participants'][i]['championId'])]
            player_info = lol_watcher.league.by_summoner(my_region, match_info['participants'][i]['summonerId'])
            try:
                if player_info[0]['queueType'] == 'RANKED_SOLO_5x5':
                    results['game'][i]['tier'] = player_info[0]['tier']
                    results['game'][i]['rank'] = player_info[0]['rank']
                    results['game'][i]['leaguePoints'] = player_info[0]['leaguePoints']
                elif player_info[1]['queueType'] == 'RANKED_SOLO_5x5':
                    results['game'][i]['tier'] = player_info[1]['tier']
                    results['game'][i]['rank'] = player_info[1]['rank']
                    results['game'][i]['leaguePoints'] = player_info[1]['leaguePoints']
            except:
                print("mistake")

            if(results['game'][i]['available']==1):
                results['game'][i]['mmr'] = int(str(future.result()[i])[position + 6 : position + 10])
                if(int(str(future.result()[i])[position + 12 : position + 15]) == 100):
                    results['game'][i]['team'] = "blue"
                else:
                    results['game'][i]['team'] = "red"
            else:
                results['game'][i]['mmr'] = int(str(future.result()[i])[position + 6])
                if(int(str(future.result()[i])[position + 9 : position + 12]) == 100):
                    results['game'][i]['team'] = "blue"
                else:
                    results['game'][i]['team'] = "red"

        for i in range (0,10):
            #print(tablica[i])
            how_many += results['game'][i]['available']
            mmr_sum += results['game'][i]['mmr']

        results['game'][10]['average'] = round(mmr_sum/how_many, 2)
        results['game'][10]['number'] = how_many
        print("Average MMR: ", mmr_sum/how_many)


    
    main()


    return jsonify(results)


@app.route('/api/v1/ranking/refresh', methods=['GET'])
def api_ranking_refresh():
    from riotwatcher import LolWatcher, ApiError
    import requests
    import time

    f = open("time.txt", "r")
    time_now = f.read()
    f.close()

    if(time.time() - float(time_now) < 15):
        results = {'time': -1}
        return jsonify(results)


    lol_watcher = LolWatcher(api_key)
    

    miki = "uX0sDT_aEj4CzpYItA-aGDtRXFagBvcR2E5-ZlIUyUWZY0U"
    kacper = "Lsg8ZfPprweVAVQgnjuozV9QErLxO2ue9SAXzrTHFVqDI2c"
    czarek = "IRBxAbwyDZOKzZtbIsafRS-tkH-jffp7-ZACmzzjeNxHHCs"
    michal = "L4yCUrElQv0XcnI6j6NC5hb3j69Q1Dt7_f-vegU-4-todP4"

    miki_info = lol_watcher.league.by_summoner("eun1", miki)
    kacper_info = lol_watcher.league.by_summoner("eun1", kacper)
    czarek_info = lol_watcher.league.by_summoner("eun1", czarek)
    michal_info = lol_watcher.league.by_summoner("eun1", michal)

    results = { 'ranking': [
    {   
        miki_info[0]['queueType']: 
        {
            'nickname': miki_info[0]['summonerName'],
            'tier': miki_info[0]['tier'],
            'rank': miki_info[0]['rank'],
            'leaguePoints': miki_info[0]['leaguePoints'],
        },
        miki_info[1]['queueType']:
        {
            'nickname': miki_info[1]['summonerName'],
            'tier': miki_info[1]['tier'],
            'rank': miki_info[1]['rank'],
            'leaguePoints': miki_info[1]['leaguePoints'],
        },
    },
    {   
        kacper_info[0]['queueType']: 
        {
            'nickname': kacper_info[0]['summonerName'],
            'tier': kacper_info[0]['tier'],
            'rank': kacper_info[0]['rank'],
            'leaguePoints': kacper_info[0]['leaguePoints'],
        },
        kacper_info[1]['queueType']:
        {
            'nickname': kacper_info[1]['summonerName'],
            'tier': kacper_info[1]['tier'],
            'rank': kacper_info[1]['rank'],
            'leaguePoints': kacper_info[1]['leaguePoints'],
        },
    },
        {   
        czarek_info[0]['queueType']: 
        {
            'nickname': czarek_info[0]['summonerName'],
            'tier': czarek_info[0]['tier'],
            'rank': czarek_info[0]['rank'],
            'leaguePoints': czarek_info[0]['leaguePoints'],
        },
        czarek_info[1]['queueType']:
        {
            'nickname': czarek_info[1]['summonerName'],
            'tier': czarek_info[1]['tier'],
            'rank': czarek_info[1]['rank'],
            'leaguePoints': czarek_info[1]['leaguePoints'],
        },
    },
        {   
        michal_info[0]['queueType']: 
        {
            'nickname': michal_info[0]['summonerName'],
            'tier': michal_info[0]['tier'],
            'rank': michal_info[0]['rank'],
            'leaguePoints': michal_info[0]['leaguePoints'],
        },
        michal_info[1]['queueType']:
        {
            'nickname': michal_info[1]['summonerName'],
            'tier': michal_info[1]['tier'],
            'rank': michal_info[1]['rank'],
            'leaguePoints': michal_info[1]['leaguePoints'],
        },
    },
    ]}
    
    time_now = time.time()
    f = open("time.txt", "w")
    f.write(str(time_now))
    f.close()

    f = open("ranking.txt", "w")
    f.write(str(results))
    f.close()

    return jsonify(results)


@app.route('/api/v1/ranking/load', methods=['GET'])
def api_ranking():
    import ast
    f = open("ranking.txt", "r")
    results = f.read()
    f.close()
    results = ast.literal_eval(results)
    return jsonify(results)


@app.route('/api/v1/ranking/time', methods=['GET'])
def api_ranking_time():
    f = open("time.txt", "r")
    time_now = f.read()
    f.close()
    results = { 'time': float(time_now) }
    print(time_now)
    return jsonify(results)

#===========================================================

import threading
import ast

f = open("keys.txt", "r")
temp = f.read()
f.close()
API_KEYS = ast.literal_eval(temp)

def printit():
    threading.Timer(60.0, printit).start()
    for key1, ip1 in API_KEYS.items():
        ip1[1] = 0
    API_KEYS['MASTER_KEY'][1] = -20
    f = open("keys.txt", "w")
    f.write(str(API_KEYS))
    f.close()

print(API_KEYS) 
printit()

app.run()


#app.run(host='0.0.0.0')
