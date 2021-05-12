import requests

resp = requests.get('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
if resp.status_code != 200:
    # This means something went wrong.
    raise ApiError('GET /tasks/ {}'.format(resp.status_code))

#print(resp.json().data)
dictionary = {}
lista = []
i=0
for key in resp.json()['data']:
    lista.append(key)

print(lista)

for i in range (0, len(lista)):
    dictionary.update({resp.json()['data'][lista[i]]['key']: lista[i]})

print(dictionary)