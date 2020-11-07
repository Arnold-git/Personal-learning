import json
import requests
from urllib.request import urlopen
import urllib.request

requ = urllib.request.Request(url='http://api.currencylayer.com/live?access_key=eab861f057b302760cee91a57e78c06d')
with urllib.request.urlopen(requ) as f:
	data = f.read()



data = json.loads(data)
# print(json.dumps(data, indent=2))

# for item in data['quotes']:
# 	print(item['USDNGR'])

usd_rates = dict()

for key, value in data['quotes'].items():

	name, price = (key, value)
	usd_rates[name] = price
print(50 * float(usd_rates['USDNGN']))
   