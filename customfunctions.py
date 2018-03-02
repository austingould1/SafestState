import json

def addGeoJson(arg):
    with open('states.json') as f:
        data = json.load(f)

    # state_coordinates = []
    # states = []
    for feature in data['features']:
        state = feature['properties']['name']


        for bundle in arg:
            bundle_state = bundle[0]

            if state == bundle_state:
                feature['properties']['deaths'] = bundle[1]
    
    return data

def region(c):
    if c['state'] in ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont','New Jersey','New York','Pennsylvania']:
        return 'Northeast'
    elif c['state'] in ['Illinois','Indiana','Michigan','Ohio','Wisconsin','Iowa','Kansas','Minnesota','Missouri','Nebraska','North Dakota','South Dakota']:
        return 'Midwest'
    elif c['state'] in ['Delaware','Florida','Georgia','Maryland','North Carolina','South Carolina','Virginia','West Virginia','Alabama','Kentucky','Mississippi','Tennessee','Arkansas','Louisiana','Oklahoma','Texas']:
        return 'South'
    else:
        return 'West'