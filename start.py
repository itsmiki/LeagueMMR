import os, subprocess
from pyngrok import ngrok
import requests, time


ngrok = os.system("gnome-terminal -e 'bash -c \"cd /home/osboxes/Documents/ngrok; ./ngrok http 8080; bash\" '")

stream = os.system("gnome-terminal -e 'bash -c \"cd /home/osboxes/Documents/MMR API; export FLASK_APP=api_server.py; flask run -h 127.0.0.1 -p 8080; bash\" '")

time.sleep(3)
r = requests.get('http://localhost:4040/api/tunnels')

if r.json()['tunnels'][0]['proto'] == 'https':
    print(r.json()['tunnels'][0]['public_url'])
else:
    print(r.json()['tunnels'][1]['public_url'])
