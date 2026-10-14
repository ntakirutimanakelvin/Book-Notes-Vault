
import requests

facts= []

for i in range(5):

    response= requests.get('https://catfact.ninja/fact')

    if response.status_code == 200:
        data = response.json()
        # print(f"Today's fact is: {data['fact']}.")
        # print(f'It is {data['length']} characters long.')

        facts.append(data['facts'])

    else:
        print('opps! I couuld not get a fact. sorry')

print(facts)