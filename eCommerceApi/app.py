from email.mime import base
from os import link
from flask import Flask, request,json
import selectorlib
import requests
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
extractor = selectorlib.Extractor.from_yaml_file('selectors.yml')
    
@app.route('/',methods = ['POST','GET'])
@cross_origin()
def api():
    if request.method == 'POST':
        req_data = json.loads(request.data)
        headers = {
            'authority': 'www.amazon.com',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'dnt': '1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        }
        r = requests.get(req_data['link'], headers=headers)
        name = extractor.extract(r.text)['name']

        return name

        